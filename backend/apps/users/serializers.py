from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

class RegisterSerializer(serializers.ModelSerializer):
    '''
    validates user registration data.
    handle validation
    '''
    password = serializers.CharField(min_length=6,write_only=True)
    password_confirmation = serializers.CharField(min_length=6,write_only=True)
    name = serializers.CharField(max_length=100)
    
    class Meta:
        model = User
        fields = ['email','password','password_confirmation','name']

    def validate(self, attrs):
        '''
        checks both password and password_confirmation are same
        removes password_confirmation from attrs before returning validated data
        '''
        if attrs.get('password') != attrs.get('password_confirmation'):
            raise serializers.ValidationError({"password_confirmation": "Passwords do not match."})
        attrs.pop('password_confirmation', None)
        return attrs
    

class LoginSerializer(serializers.Serializer):
    '''
    validates user login data
    '''
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    '''
    validates refresh token and return new tokens
    '''
    pass

class UserProfileSerializer(serializers.ModelSerializer):
    '''
    validates user profile data
    '''
    class Meta:
        model = User
        fields = ['id','name','email','plan','created_at']

class LogoutSerializer(serializers.Serializer):
    '''
    validates logout data by requiring a refresh token
    '''
    refresh = serializers.CharField()
