from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Count, Sum, Q, Avg, Prefetch
from django.utils import timezone
from django.db import transaction
from .models import (
    Enrollment, Course, Category, Lesson, 
    Certificate, Skill, LessonProgress, 
    UserActivity, CourseSkill, Quiz, Question,
    Answer, QuizAttempt, QuizAnswer, CourseSection,
    CourseReview, CourseProgress, TimeSpent
)
from .serializers import (
    CourseListSerializer, CourseDetailSerializer, 
    EnrollmentSerializer, CertificateSerializer,
    UserActivitySerializer, LessonSerializer,
    CategorySerializer, QuizSerializer,
    QuizAttemptSerializer, QuizSubmissionSerializer,
    CourseSectionSerializer, CourseReviewSerializer,
    LessonProgressSerializer, CourseSerializer,
    CourseProgressSerializer, TimeSpentSerializer
)
import string
import random
import uuid
import logging
from datetime import timedelta, datetime

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset

class CourseSectionViewSet(viewsets.ModelViewSet):
    queryset = CourseSection.objects.all()
    serializer_class = CourseSectionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return CourseSection.objects.filter(course_id=self.kwargs['course_pk'])

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Lesson.objects.filter(section_id=self.kwargs['section_pk'])

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    """Vue pour lister et récupérer les inscriptions d'un utilisateur"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EnrollmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Enrollment.objects.filter(user=user).select_related(
            'course', 'course__category'
        ).order_by('-last_activity')

class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    """Vue pour lister et récupérer les certificats d'un utilisateur"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CertificateSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Certificate.objects.filter(user=user).select_related(
            'course', 'course__category'
        ).order_by('-issue_date')

class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """Vue pour lister et récupérer les activités d'un utilisateur"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserActivitySerializer
    
    def get_queryset(self):
        user = self.request.user
        return UserActivity.objects.filter(user=user).order_by('-created_at')[:20]

class DashboardStatsView(APIView):
    """Vue pour récupérer les statistiques du tableau de bord d'un utilisateur"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Récupérer les cours en cours
        in_progress_enrollments = Enrollment.objects.filter(
            user=user, 
            completed=False
        ).select_related('course').order_by('-last_activity')[:5]
        
        # Récupérer les statistiques
        completed_courses = Enrollment.objects.filter(user=user, completed=True).count()
        
        # Calculer le temps total d'apprentissage (en heures)
        total_time_spent = LessonProgress.objects.filter(user=user).aggregate(
            total=Sum('time_spent')
        )['total'] or 0
        total_hours_learned = round(total_time_spent / 3600, 1)  # Convertir les secondes en heures
        
        # Compter les certificats obtenus
        certificates_count = Certificate.objects.filter(user=user).count()
        
        # Récupérer les activités récentes
        recent_activities = UserActivity.objects.filter(user=user).order_by('-created_at')[:10]
        
        # Récupérer les cours recommandés
        # Logique de recommandation : cours populaires de catégories similaires aux inscriptions
        user_categories = Enrollment.objects.filter(user=user).values_list('course__category', flat=True).distinct()
        
        recommended_courses = Course.objects.filter(
            status='published',
            is_active=True
        ).filter(
            Q(category__in=user_categories) | Q(featured=True)
        ).exclude(
            enrollments__user=user  # Exclure les cours où l'utilisateur est déjà inscrit
        ).annotate(
            enrollment_count=Count('enrollments')
        ).order_by('-enrollment_count', '-created_at')[:5]
        
        # Construire la réponse
        response_data = {
            "courses_completed": completed_courses,
            "total_hours_learned": total_hours_learned,
            "certificates_earned": certificates_count,
            "in_progress_courses": EnrollmentSerializer(in_progress_enrollments, many=True).data,
            "recent_activities": UserActivitySerializer(recent_activities, many=True).data,
            "recommended_courses": CourseListSerializer(recommended_courses, many=True).data
        }
        
        return Response(response_data)

class UserCoursesView(APIView):
    """Vue pour récupérer les cours de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Récupérer toutes les inscriptions de l'utilisateur
        enrollments = Enrollment.objects.filter(
            user=user
        ).select_related(
            'course', 'course__category'
        ).order_by('-last_activity')
        
        # Séparer les cours en cours et terminés
        in_progress = [e for e in enrollments if not e.completed]
        completed = [e for e in enrollments if e.completed]
        
        # Sérialiser les données
        response_data = {
            "in_progress": EnrollmentSerializer(in_progress, many=True).data,
            "completed": EnrollmentSerializer(completed, many=True).data,
            "total_courses": len(enrollments)
        }
        
        return Response(response_data)

class UserActivitiesView(APIView):
    """Vue pour récupérer l'historique d'activité de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Paramètres de pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 10))
        
        # Filtrer par type d'activité si spécifié
        activity_type = request.query_params.get('type')
        filters = {'user': user}
        if activity_type:
            filters['activity_type'] = activity_type
            
        # Récupérer les activités
        activities = UserActivity.objects.filter(
            **filters
        ).select_related(
            'related_course', 'related_lesson'
        ).order_by('-created_at')
        
        # Pagination manuelle simple
        start = (page - 1) * page_size
        end = start + page_size
        paginated_activities = activities[start:end]
        total_count = activities.count()
        
        response_data = {
            "activities": UserActivitySerializer(paginated_activities, many=True).data,
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size
        }
        
        return Response(response_data)

class UserCertificatesView(APIView):
    """Vue pour récupérer les certificats de l'utilisateur connecté"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Récupérer tous les certificats
        certificates = Certificate.objects.filter(
            user=user
        ).select_related(
            'course', 'course__category'
        ).order_by('-issue_date')
        
        response_data = {
            "certificates": CertificateSerializer(certificates, many=True).data,
            "total": certificates.count()
        }
        
        return Response(response_data)

class QuizDetailView(APIView):
    """Vue pour récupérer les détails d'un quiz associé à une leçon"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, lesson_id):
        user = request.user
        
        # Vérifier que la leçon existe
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier que l'utilisateur est inscrit au cours
        get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer le quiz associé à cette leçon
        quiz = get_object_or_404(Quiz, lesson=lesson)
        
        # Récupérer les dernières tentatives pour ce quiz
        latest_attempt = QuizAttempt.objects.filter(
            user=user, quiz=quiz
        ).order_by('-created_at').first()
        
        # Sérialiser les données du quiz
        serializer = QuizSerializer(quiz)
        
        response_data = {
            **serializer.data,
            'latest_attempt': QuizAttemptSerializer(latest_attempt).data if latest_attempt else None
        }
        
        return Response(response_data)

class SubmitQuizView(APIView):
    """Vue pour soumettre les réponses d'un quiz"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, lesson_id):
        user = request.user
        
        # Vérifier que la leçon existe
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier que l'utilisateur est inscrit au cours
        get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer le quiz associé à cette leçon
        quiz = get_object_or_404(Quiz, lesson=lesson)
        
        # Valider les données soumises
        serializer = QuizSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        submitted_answers = serializer.validated_data['answers']
        
        # Créer une nouvelle tentative
        with transaction.atomic():
            # Calculer le score
            questions = Question.objects.filter(quiz=quiz).prefetch_related('answers')
            total_questions = questions.count()
            correct_answers = 0
            
            # Préparer le feedback pour chaque question
            feedback = {}
            
            # Créer la nouvelle tentative
            attempt = QuizAttempt.objects.create(
                user=user,
                quiz=quiz,
                score=0,  # À mettre à jour
                passed=False  # À mettre à jour
            )
            
            # Traiter chaque réponse
            for question in questions:
                # L'utilisateur a-t-il répondu à cette question ?
                if str(question.id) not in submitted_answers:
                    continue
                
                # Récupérer la réponse sélectionnée
                answer_id = submitted_answers[str(question.id)]
                answer = get_object_or_404(Answer, id=answer_id, question=question)
                
                # Créer l'entrée QuizAnswer
                QuizAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    answer=answer,
                    is_correct=answer.is_correct
                )
                
                # Mettre à jour le score et le feedback
                if answer.is_correct:
                    correct_answers += 1
                
                # Préparer le feedback pour cette question
                feedback[question.id] = {
                    'is_correct': answer.is_correct,
                    'explanation': question.explanation if hasattr(question, 'explanation') else None
                }
            
            # Calculer le score final
            score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
            passed = score >= quiz.pass_percentage
            
            # Mettre à jour la tentative
            attempt.score = score
            attempt.passed = passed
            attempt.save()
            
            # Enregistrer l'activité
            activity_description = f"A {'réussi' if passed else 'échoué'} le quiz '{quiz.title}' avec un score de {score:.1f}%"
            UserActivity.objects.create(
                user=user,
                activity_type='quiz_completed',
                description=activity_description,
                related_course=lesson.course,
                related_lesson=lesson
            )
            
            # Si le quiz est réussi, marquer la leçon comme complète
            if passed:
                lesson_progress, created = LessonProgress.objects.get_or_create(
                    user=user,
                    lesson=lesson
                )
                lesson_progress.completed = True
                lesson_progress.completed_at = timezone.now()
                lesson_progress.save()
        
        # Réponse finale
        response_data = {
            'score': score,
            'passed': passed,
            'feedback': feedback
        }
        
        return Response(response_data)

class LessonDetailView(APIView):
    """Vue pour afficher les détails d'une leçon spécifique"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, lesson_id):
        user = request.user
        
        # Récupérer la leçon
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer ou créer l'objet de progression
        lesson_progress, created = LessonProgress.objects.get_or_create(
            user=user, 
            lesson=lesson
        )
        
        # Mettre à jour la date de dernier accès
        lesson_progress.save()  # auto_now met automatiquement à jour last_accessed
        
        # Enregistrer l'activité si c'est la première consultation
        if created:
            UserActivity.objects.create(
                user=user,
                activity_type='lesson_started',
                description=f"A commencé la leçon '{lesson.title}'",
                related_course=lesson.course,
                related_lesson=lesson
            )
        
        # Sérialiser la leçon avec son contexte
        serializer = LessonSerializer(
            lesson,
            context={'request': request}
        )
        
        return Response(serializer.data)

class CompleteLesson(APIView):
    """Vue pour marquer une leçon comme terminée"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        lesson_id = request.data.get('lesson_id')
        
        if not lesson_id:
            return Response(
                {"detail": "L'ID de la leçon est requis."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupérer la leçon
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer ou créer l'objet de progression
        progress, created = LessonProgress.objects.get_or_create(
            user=user, 
            lesson=lesson,
            defaults={
                'completed': True,
                'completed_at': timezone.now()
            }
        )
        
        # Si la progression existe déjà mais n'était pas complétée
        if not created and not progress.completed:
            progress.completed = True
            progress.completed_at = timezone.now()
            progress.save()
            
            # Enregistrer l'activité
            UserActivity.objects.create(
                user=user,
                activity_type='lesson_completed',
                description=f"A terminé la leçon '{lesson.title}'",
                related_course=lesson.course,
                related_lesson=lesson
            )
        
        # Mettre à jour la progression globale du cours
        course = lesson.course
        total_lessons = course.lessons.count()
        if total_lessons > 0:
            completed_lessons = LessonProgress.objects.filter(
                user=user, 
                lesson__course=course,
                completed=True
            ).count()
            
            progress_percentage = (completed_lessons / total_lessons) * 100
            
            enrollment.progress = progress_percentage
            
            # Si toutes les leçons sont complétées, marquer le cours comme terminé
            if progress_percentage >= 100:
                enrollment.completed = True
                enrollment.completion_date = timezone.now()
                
                # Créer un certificat si disponible et pas encore émis
                if course.certificate_available and not enrollment.certificate_issued:
                    certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
                    
                    certificate = Certificate.objects.create(
                        user=user,
                        course=course,
                        certificate_id=certificate_id
                    )
                    
                    enrollment.certificate_issued = True
                    
                    # Enregistrer l'activité pour le certificat
                    UserActivity.objects.create(
                        user=user,
                        activity_type='certificate_earned',
                        description=f"A obtenu un certificat pour le cours '{course.title}'",
                        related_course=course
                    )
                
                # Enregistrer l'activité pour la fin du cours
                UserActivity.objects.create(
                    user=user,
                    activity_type='course_completed',
                    description=f"A terminé le cours '{course.title}'",
                    related_course=course
                )
            
            enrollment.save()
        
        # Retourner la progression mise à jour
        return Response({
            "success": True,
            "lesson_completed": True,
            "course_progress": enrollment.progress
        })

class CourseProgressView(APIView):
    """Vue pour récupérer la progression globale d'un cours"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_id):
        user = request.user
        course = get_object_or_404(Course, id=course_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=course)
        
        # Récupérer les leçons du cours avec leur progression
        sections = CourseSection.objects.filter(course=course).prefetch_related('lessons')
        
        # Construire les données de section avec progression
        sections_data = []
        for section in sections:
            lessons_data = []
            for lesson in section.lessons.all():
                try:
                    progress = LessonProgress.objects.get(user=user, lesson=lesson)
                    lesson_progress = {
                        'completed': progress.completed,
                        'last_position': progress.last_position,
                        'time_spent': progress.time_spent
                    }
                except LessonProgress.DoesNotExist:
                    lesson_progress = {
                        'completed': False,
                        'last_position': 0,
                        'time_spent': 0
                    }
                
                lesson_data = {
                    'id': lesson.id,
                    'title': lesson.title,
                    'duration': lesson.duration,
                    'content_type': lesson.content_type,
                    'has_quiz': hasattr(lesson, 'quiz'),
                    'progress': lesson_progress
                }
                
                lessons_data.append(lesson_data)
            
            section_data = {
                'id': section.id,
                'title': section.title,
                'order': section.order,
                'lessons': lessons_data
            }
            
            sections_data.append(section_data)
            
        # Construire la réponse
        response_data = {
            'course_id': course.id,
            'course_title': course.title,
            'overall_progress': enrollment.progress,
            'completed': enrollment.completed,
            'sections': sections_data,
            'certificate_issued': enrollment.certificate_issued
        }
        
        return Response(response_data)

class LessonProgressView(APIView):
    """Vue pour récupérer et mettre à jour la progression d'une leçon spécifique"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, lesson_id):
        user = request.user
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer ou créer la progression
        progress, created = LessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson
        )
        
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)
    
    def put(self, request, lesson_id):
        user = request.user
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer ou créer la progression
        progress, created = LessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson
        )
        
        # Mettre à jour les champs
        data = request.data
        if 'completed' in data:
            progress.completed = data['completed']
            if data['completed'] and not progress.completed_at:
                progress.completed_at = timezone.now()
                
                # Enregistrer l'activité si la leçon est complétée
                UserActivity.objects.create(
                    user=user,
                    activity_type='lesson_completed',
                    description=f"A terminé la leçon '{lesson.title}'",
                    related_course=lesson.course,
                    related_lesson=lesson
                )
                
        if 'last_position' in data:
            progress.last_position = data['last_position']
            
        if 'time_spent' in data:
            progress.time_spent = data['time_spent']
            
        if 'notes' in data:
            progress.notes = data['notes']
        
        progress.save()
        
        # Mettre à jour la progression du cours
        course = lesson.course
        total_lessons = Lesson.objects.filter(section__course=course).count()
        completed_lessons = LessonProgress.objects.filter(
            user=user,
            lesson__section__course=course,
            completed=True
        ).count()
        
        if total_lessons > 0:
            progress_percentage = (completed_lessons / total_lessons) * 100
            enrollment.progress = progress_percentage
            enrollment.save()
        
        serializer = LessonProgressSerializer(progress)
        return Response(serializer.data)

class TrackLessonTimeView(APIView):
    """Vue pour suivre le temps passé sur une leçon"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        lesson_id = request.data.get('lesson_id')
        time_increment = request.data.get('time_increment', 0)  # Temps en secondes
        
        if not lesson_id or not time_increment:
            return Response({
                "detail": "lesson_id et time_increment sont requis."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Récupérer la leçon
        lesson = get_object_or_404(Lesson, id=lesson_id)
        
        # Vérifier si l'utilisateur est inscrit au cours
        enrollment = get_object_or_404(Enrollment, user=user, course=lesson.course)
        
        # Récupérer ou créer la progression
        progress, created = LessonProgress.objects.get_or_create(
            user=user,
            lesson=lesson
        )
        
        # Incrémenter le temps passé
        progress.time_spent += int(time_increment)
        progress.save()
        
        # Mettre à jour l'activité du cours
        enrollment.last_activity = timezone.now()
        enrollment.save()
        
        return Response({
            "success": True,
            "time_spent": progress.time_spent
        })

class CertificateDetailView(APIView):
    """Vue pour récupérer les détails d'un certificat"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_id):
        user = request.user
        course = get_object_or_404(Course, id=course_id)
        
        # Vérifier si l'utilisateur est inscrit et a terminé le cours
        enrollment = get_object_or_404(
            Enrollment, 
            user=user, 
            course=course
        )
        
        if not enrollment.completed:
            return Response(
                {"detail": "Vous n'avez pas encore terminé ce cours."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Récupérer ou créer le certificat
        certificate = Certificate.objects.filter(user=user, course=course).first()
        
        if not certificate:
            if course.certificate_available:
                certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
                certificate = Certificate.objects.create(
                    user=user,
                    course=course,
                    certificate_id=certificate_id
                )
                
                # Mettre à jour l'inscription
                enrollment.certificate_issued = True
                enrollment.save()
                
                # Enregistrer l'activité
                UserActivity.objects.create(
                    user=user,
                    activity_type='certificate_earned',
                    description=f"A obtenu un certificat pour le cours '{course.title}'",
                    related_course=course
                )
            else:
                return Response(
                    {"detail": "Ce cours ne délivre pas de certificat."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = CertificateSerializer(certificate)
        return Response(serializer.data)

class EnrollInCourseView(APIView):
    """Vue pour s'inscrire à un cours"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        course_id = request.data.get('course_id')
        
        if not course_id:
            return Response(
                {"detail": "L'ID du cours est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupérer le cours
        course = get_object_or_404(Course, id=course_id)
        
        # Vérifier si l'utilisateur est déjà inscrit
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Response(
                {"detail": "Vous êtes déjà inscrit à ce cours."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'inscription
        enrollment = Enrollment.objects.create(
            user=user,
            course=course,
            progress=0.0
        )
        
        # Enregistrer l'activité
        UserActivity.objects.create(
            user=user,
            activity_type='course_enrolled',
            description=f"S'est inscrit au cours '{course.title}'",
            related_course=course
        )
        
        # Retourner les données d'inscription
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# ... other existing classes if any ...
