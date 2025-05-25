from django.core.management.base import BaseCommand
from django.utils import timezone
from courses.models import Course, Enrollment
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Inscrit un utilisateur à tous les cours'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Nom d\'utilisateur à inscrire')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"L'utilisateur {username} n'existe pas"))
            return
            
        courses = Course.objects.all()
        if not courses.exists():
            self.stdout.write(self.style.ERROR("Aucun cours disponible"))
            return
            
        count = 0
        for course in courses:
            enrollment, created = Enrollment.objects.get_or_create(
                user=user,
                course=course,
                defaults={
                    'progress': 0,
                    'enrolled_at': timezone.now()
                }
            )
            
            if created:
                count += 1
                self.stdout.write(self.style.SUCCESS(f"Inscrit à: {course.title}"))
            else:
                self.stdout.write(self.style.WARNING(f"Déjà inscrit à: {course.title}"))
                
        self.stdout.write(self.style.SUCCESS(f"Total: {count} nouvelles inscriptions")) 