from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

urlpatterns = [
    # Authentication endpoints
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    # User profile and settings
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('preferences/', views.UserPreferencesView.as_view(), name='preferences'),
    path('notifications/', views.UserNotificationsView.as_view(), name='notifications'),
    path('privacy/', views.UserPrivacyView.as_view(), name='privacy'),
    path('password/change/', views.ChangePasswordView.as_view(), name='change-password'),
]
