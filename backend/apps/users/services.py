from django.contrib.auth import authenticate
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed, ValidationError

def register_user(email:str,password:str,name:str):
    '''
    create a new user and return return user + jwt tokens
    '''
    user = User.objects.create_user(email=email, password=password, name=name)
    refresh = RefreshToken.for_user(user)

    return {
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        },
        'token': {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
    }

def login_user(email:str,password:str):
    """
    login a user and return user + jwt tokens
    """
    user = authenticate(email=email,password=password)
    if not user:
        raise AuthenticationFailed('Invalid Email or Password')
    
    refresh = RefreshToken.for_user(user)

    return {
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        },
        'token': {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
    }

def get_user_profile(user:User):
    """
    return user profile
    """
    return {
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'created_at':user.created_at,
        }
    }

def logout_user(refresh_token: str):
    """
    blacklist the refresh token to logout user
    """
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        raise ValidationError({'refresh': 'Invalid or expired refresh token.'})

