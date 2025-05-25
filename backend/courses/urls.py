from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, CategoryViewSet,
    CourseSectionViewSet, LessonViewSet,
    CompleteLesson, CourseProgressView,
    LessonProgressView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'sections', CourseSectionViewSet, basename='section')
router.register(r'lessons', LessonViewSet, basename='lesson')

urlpatterns = [
    path('', include(router.urls)),
    path('complete_lesson/', CompleteLesson.as_view(), name='complete-lesson'),
    path('courses/<int:course_id>/progress/', CourseProgressView.as_view(), name='course-progress'),
    path('lessons/<int:lesson_id>/progress/', LessonProgressView.as_view(), name='lesson-progress'),
] 