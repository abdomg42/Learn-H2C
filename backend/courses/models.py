from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=20, default='indigo')
    icon = models.CharField(max_length=50, blank=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = 'Categories'

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'Débutant'),
        ('intermediate', 'Intermédiaire'),
        ('advanced', 'Avancé'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
        ('archived', 'Archivé'),
    ]
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='courses/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='courses/thumbnails/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='courses')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_courses')
    instructors = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='taught_courses', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_hours = models.FloatField(default=0)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    language = models.CharField(max_length=50, default='Français')
    prerequisites = models.TextField(blank=True)
    objectives = models.TextField(blank=True, help_text="Objectifs d'apprentissage du cours")
    target_audience = models.TextField(blank=True, help_text="Public cible du cours")
    syllabus = models.TextField(blank=True, help_text="Plan du cours")
    meta_keywords = models.CharField(max_length=255, blank=True, help_text="Mots-clés pour le référencement")
    certificate_available = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
        
    def lesson_count(self):
        return self.lessons.count()
        
    def enrollment_count(self):
        return self.enrollments.count()
    
    def calculate_rating(self):
        ratings = self.reviews.values_list('rating', flat=True)
        return sum(ratings) / len(ratings) if ratings else 0

class CourseSection(models.Model):
    """Section ou module d'un cours contenant plusieurs leçons"""
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sections')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lesson(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('video', 'Vidéo'),
        ('text', 'Texte'),
        ('pdf', 'PDF'),
        ('audio', 'Audio'),
        ('presentation', 'Présentation'),
        ('exercise', 'Exercice'),
        ('interactive', 'Contenu interactif'),
    ]
    
    section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name='lessons', null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES, default='video')
    video_url = models.URLField(blank=True, null=True)
    video_duration = models.PositiveIntegerField(help_text="Durée en secondes", null=True, blank=True)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration = models.CharField(max_length=20, default='10 min')  # Durée estimée de la leçon
    is_free = models.BooleanField(default=False, help_text="Leçon disponible en preview gratuit")
    attachment = models.FileField(upload_to='lessons/', null=True, blank=True)
    
    class Meta:
        ordering = ['order']
        
    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Skill(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

class CourseSkill(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.course.title} - {self.skill.name}"

class Certificate(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    issue_date = models.DateField(auto_now_add=True)
    certificate_id = models.CharField(max_length=50, unique=True)
    pdf_file = models.FileField(upload_to='certificates/', blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.certificate_id:
            self.certificate_id = f"CERT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

class Enrollment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    progress = models.FloatField(default=0.0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)
    completion_date = models.DateTimeField(null=True, blank=True)
    certificate_issued = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'course']
    
    def __str__(self):
        return f"{self.user} - {self.course}"

class LessonProgress(models.Model):
    """Suivi de la progression d'un utilisateur pour une leçon spécifique"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_position = models.PositiveIntegerField(default=0, help_text="Dernière position dans la vidéo (en secondes)")
    time_spent = models.PositiveIntegerField(default=0, help_text="Temps total passé sur cette leçon (en secondes)")
    notes = models.TextField(blank=True, help_text="Notes personnelles de l'utilisateur")
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"{self.user.username} - {self.lesson.title} - {'Complété' if self.completed else 'En cours'}"

class UserActivity(models.Model):
    ACTIVITY_TYPES = (
        ('course_enrolled', 'Inscription au cours'),
        ('lesson_completed', 'Leçon terminée'),
        ('course_completed', 'Cours terminé'),
        ('certificate_earned', 'Certificat obtenu'),
        ('quiz_completed', 'Quiz terminé'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_TYPES)
    related_course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    related_lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, null=True, blank=True)
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'User activities'
    
    def __str__(self):
        return f"{self.user} - {self.activity_type} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"

# Nouveaux modèles pour les quiz
class Quiz(models.Model):
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    pass_percentage = models.PositiveSmallIntegerField(default=70)  # Pourcentage minimum pour réussir
    
    class Meta:
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return f"Quiz: {self.lesson.title}"

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    explanation = models.TextField(blank=True, help_text="Explication affichée après réponse incorrecte")
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Question {self.order+1}: {self.text[:50]}..."

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.text[:50]}... ({'Correct' if self.is_correct else 'Incorrect'})"

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()  # Pourcentage de réussite
    passed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user} - {self.quiz} - Score: {self.score}%"

class QuizAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    is_correct = models.BooleanField()
    
    def __str__(self):
        return f"{self.attempt.user} - Q: {self.question.id} - {'Correct' if self.is_correct else 'Incorrect'}"

class CourseReview(models.Model):
    """Avis et notations sur les cours"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'course']
        
    def __str__(self):
        return f"{self.user.username} - {self.course.title} - {self.rating}"

class CourseProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)  # Percentage of completion
    is_completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    last_accessed = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.username} - {self.course.title}"

class TimeSpent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    duration = models.IntegerField(default=0)  # Duration in seconds
    date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'course', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.duration} seconds"
