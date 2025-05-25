from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Profile, UserPreference, UserNotificationSetting, UserPrivacySetting
from django.core.validators import FileExtensionValidator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Check if username exists
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username is already taken."})
        
        # Check if email exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already registered."})
        
        # Validate email domain
        if not attrs['email'].endswith('@etu.univh2c.ma'):
            raise serializers.ValidationError({"email": "Email must be from @etu.univh2c.ma domain."})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['username'],  # Set first_name to username
            last_name=''  # Set last_name to empty string
        )
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(
        required=False,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png']),
        ]
    )

    class Meta:
        model = Profile
        fields = ('profile_picture', 'language', 'dark_mode')

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)
    email = serializers.EmailField(read_only=True)  # Email cannot be changed after registration

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')
        read_only_fields = ('username', 'email')  # Username and email cannot be changed after registration
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if profile_data:
            # Ensure the user has a profile
            profile, created = Profile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
        return instance

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        exclude = ('user',)

class UserNotificationSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotificationSetting
        exclude = ('user',)

class UserPrivacySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrivacySetting
        exclude = ('user',)

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        request = self.context.get('request')
        user = request.user
        
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError({"current_password": "Current password is incorrect."})
            
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
            
        return attrs
