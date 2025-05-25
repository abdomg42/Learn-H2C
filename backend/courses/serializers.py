from rest_framework import serializers
from .models import (
    Course, Category, Lesson, Enrollment, 
    Certificate, Skill, LessonProgress, 
    UserActivity, CourseSkill, Quiz, Question, 
    Answer, QuizAttempt, QuizAnswer, CourseSection,
    CourseReview, CourseProgress, TimeSpent
)
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les informations de base de l'utilisateur"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email']
        
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'icon', 'slug']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'duration', 'order']

class CourseSectionSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    
    class Meta:
        model = CourseSection
        fields = ['id', 'title', 'description', 'order', 'lessons']

class CourseListSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'affichage d'un cours dans une liste"""
    category = CategorySerializer(read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    skills = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()
    enrollment_count = serializers.IntegerField(read_only=True)
    is_enrolled = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'subtitle', 'slug', 'description', 'image', 'thumbnail', 
            'category', 'created_at', 'total_hours', 'level', 'lesson_count', 'skills',
            'rating', 'enrollment_count', 'price', 'discount_price', 'language', 'featured',
            'is_enrolled', 'status'
        ]
    
    def get_skills(self, obj):
        course_skills = CourseSkill.objects.filter(course=obj)
        skills = [cs.skill for cs in course_skills]
        return SkillSerializer(skills, many=True).data
    
    def get_rating(self, obj):
        return obj.calculate_rating()
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(course=obj, user=request.user).exists()
        return False

class CourseDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'affichage détaillé d'un cours"""
    category = CategorySerializer(read_only=True)
    sections = CourseSectionSerializer(many=True, read_only=True)
    skills = serializers.SerializerMethodField()
    instructors = UserBasicSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()
    enrollment_count = serializers.IntegerField(read_only=True)
    reviews = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'subtitle', 'slug', 'description', 'image', 'thumbnail', 
            'category', 'created_at', 'updated_at', 'total_hours', 'level', 'sections', 
            'skills', 'instructors', 'rating', 'enrollment_count', 'language', 'price', 
            'discount_price', 'reviews', 'objectives', 'prerequisites', 'target_audience',
            'syllabus', 'is_enrolled', 'progress', 'status', 'featured', 'certificate_available'
        ]
    
    def get_skills(self, obj):
        course_skills = CourseSkill.objects.filter(course=obj)
        skills = [cs.skill for cs in course_skills]
        return SkillSerializer(skills, many=True).data
    
    def get_rating(self, obj):
        return obj.calculate_rating()
    
    def get_reviews(self, obj):
        reviews = obj.reviews.order_by('-created_at')[:5]
        return CourseReviewSerializer(reviews, many=True).data
    
    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Enrollment.objects.filter(course=obj, user=request.user).exists()
        return False
    
    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                enrollment = Enrollment.objects.get(course=obj, user=request.user)
                return {
                    'progress': enrollment.progress,
                    'completed': enrollment.completed,
                    'last_activity': enrollment.last_activity
                }
            except Enrollment.DoesNotExist:
                pass
        return None

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'course', 'progress', 'enrolled_at', 'last_activity', 'completed', 'completion_date', 'certificate_issued']

class CertificateSerializer(serializers.ModelSerializer):
    course = CourseListSerializer(read_only=True)
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Certificate
        fields = ['id', 'course', 'user', 'issue_date', 'certificate_id', 'pdf_file']

class UserActivitySerializer(serializers.ModelSerializer):
    related_course_title = serializers.SerializerMethodField()
    related_lesson_title = serializers.SerializerMethodField()
    
    class Meta:
        model = UserActivity
        fields = ['id', 'activity_type', 'related_course_title', 'related_lesson_title', 'description', 'created_at']
    
    def get_related_course_title(self, obj):
        return obj.related_course.title if obj.related_course else None
    
    def get_related_lesson_title(self, obj):
        return obj.related_lesson.title if obj.related_lesson else None

class LessonProgressSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    
    class Meta:
        model = LessonProgress
        fields = ['id', 'lesson', 'completed', 'last_position', 'time_spent', 'notes', 'last_accessed']

class CourseReviewSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = CourseReview
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

# Nouveaux serializers pour les quiz

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'explanation', 'order', 'answers']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'pass_percentage', 'questions']

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['question', 'answer', 'is_correct']

class QuizAttemptSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'score', 'passed', 'created_at', 'answers']

class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Dict mapping question IDs to answer IDs"
    ) 

class CourseSerializer(serializers.ModelSerializer):
    sections = CourseSectionSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'description', 'thumbnail',
            'category', 'level', 'language', 'is_active',
            'created_at', 'updated_at', 'sections'
        ]
        read_only_fields = ['slug', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class CourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgress
        fields = '__all__'

class TimeSpentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSpent
        fields = '__all__' 