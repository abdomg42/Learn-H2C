from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, UserProfileSerializer, ChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import permissions
from django.contrib.auth import update_session_auth_hash
from .models import Profile, UserPreference, UserNotificationSetting, UserPrivacySetting
import logging
from rest_framework import generics
from .serializers import (
    UserPreferenceSerializer, 
    UserNotificationSettingSerializer, 
    UserPrivacySettingSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

# Configurer le logger
logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    def patch(self, request):
        user = request.user
        data = request.data.copy()
        
        # Handle profile picture upload
        if 'profile[profile_picture]' in request.FILES:
            profile = user.profile
            # Delete old profile picture if it exists
            if profile.profile_picture:
                profile.profile_picture.delete()
            data['profile'] = {
                'profile_picture': request.FILES['profile[profile_picture]']
            }
        
        serializer = UserProfileSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPreferencesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            preferences = user.preferences
        except UserPreference.DoesNotExist:
            preferences = UserPreference.objects.create(user=user)
        
        serializer = UserPreferenceSerializer(preferences)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        try:
            preferences = user.preferences
        except UserPreference.DoesNotExist:
            preferences = UserPreference.objects.create(user=user)
        
        serializer = UserPreferenceSerializer(preferences, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserNotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            notifications = user.notification_settings
        except UserNotificationSetting.DoesNotExist:
            notifications = UserNotificationSetting.objects.create(user=user)
        
        serializer = UserNotificationSettingSerializer(notifications)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        try:
            notifications = user.notification_settings
        except UserNotificationSetting.DoesNotExist:
            notifications = UserNotificationSetting.objects.create(user=user)
        
        serializer = UserNotificationSettingSerializer(notifications, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserPrivacyView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        try:
            privacy = user.privacy_settings
        except UserPrivacySetting.DoesNotExist:
            privacy = UserPrivacySetting.objects.create(user=user)
        
        serializer = UserPrivacySettingSerializer(privacy)
        return Response(serializer.data)
    
    def put(self, request):
        user = request.user
        try:
            privacy = user.privacy_settings
        except UserPrivacySetting.DoesNotExist:
            privacy = UserPrivacySetting.objects.create(user=user)
        
        serializer = UserPrivacySettingSerializer(privacy, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

