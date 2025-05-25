from django.contrib import admin
from .models import (
    Course, Category, Enrollment, Lesson, 
    Certificate, Skill, LessonProgress, 
    UserActivity, CourseSkill
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')
    search_fields = ('name',)

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1

class CourseSkillInline(admin.TabularInline):
    model = CourseSkill
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_by', 'created_at', 'is_active', 'level')
    list_filter = ('category', 'is_active', 'level', 'created_at')
    search_fields = ('title', 'description')
    inlines = [LessonInline, CourseSkillInline]

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'progress', 'enrolled_at', 'completed')
    list_filter = ('completed', 'enrolled_at')
    search_fields = ('user__username', 'course__title')

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    search_fields = ('title', 'description', 'course__title')
    ordering = ('course', 'order')

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('user', 'course', 'issue_date', 'certificate_id')
    search_fields = ('user__username', 'course__title', 'certificate_id')

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'lesson', 'completed', 'completed_at')
    list_filter = ('completed', 'completed_at')
    search_fields = ('user__username', 'lesson__title')

@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'description', 'created_at')
    list_filter = ('activity_type', 'created_at')
    search_fields = ('user__username', 'description')
