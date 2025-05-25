from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from django.core.validators import FileExtensionValidator

def user_profile_picture_path(instance, filename):
    # Get file extension
    ext = filename.split('.')[-1]
    # If user has a profile picture, use their first name initial
    if instance.user.first_name:
        filename = f"{instance.user.first_name[0].lower()}.{ext}"
    else:
        # If no first name, use username initial
        filename = f"{instance.user.username[0].lower()}.{ext}"
    return os.path.join('profile_pictures', filename)

class Profile(models.Model):
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('fr', 'Français'),
        ('es', 'Español'),
        ('de', 'Deutsch'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(
        upload_to=user_profile_picture_path,
        null=True,
        blank=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
        ]
    )
    bio = models.TextField(max_length=500, blank=True, null=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    dark_mode = models.BooleanField(default=False)
    # Additional profile fields
    address = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    birthdate = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def save(self, *args, **kwargs):
        # Delete old profile picture if it exists and a new one is being uploaded
        if self.pk:
            try:
                old_profile = Profile.objects.get(pk=self.pk)
                if old_profile.profile_picture and self.profile_picture and old_profile.profile_picture != self.profile_picture:
                    old_profile.profile_picture.delete(save=False)
            except Profile.DoesNotExist:
                pass
        super().save(*args, **kwargs)

# Signal to create a profile automatically for each new user
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

# Signal to create a profile for existing users who don't have one
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)

class UserPreference(models.Model):
    LANGUAGE_CHOICES = (
        ('fr', 'Français'),
        ('en', 'English'),
        ('es', 'Español'),
        ('de', 'Deutsch'),
    )
    THEME_CHOICES = (
        ('light', 'Light'),
        ('dark', 'Dark'),
    )
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='preferences')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='fr')
    theme = models.CharField(max_length=5, choices=THEME_CHOICES, default='light')
    autoplay_videos = models.BooleanField(default=True)
    show_completed_courses = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s preferences"

class UserNotificationSetting(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_settings')
    
    # Email notifications
    email_course_updates = models.BooleanField(default=True)
    email_new_courses = models.BooleanField(default=False)
    email_promotions = models.BooleanField(default=False)
    email_course_reminders = models.BooleanField(default=True)
    
    # Push notifications
    push_course_updates = models.BooleanField(default=True)
    push_new_courses = models.BooleanField(default=True)
    push_promotions = models.BooleanField(default=False)
    push_course_reminders = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s notification settings"

class UserPrivacySetting(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='privacy_settings')
    show_progress = models.BooleanField(default=True)
    show_certificates = models.BooleanField(default=True)
    public_profile = models.BooleanField(default=False)
    allow_data_collection = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s privacy settings"
