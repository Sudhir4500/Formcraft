from rest_framework.views import APIView
from core.responses import success_response, error_response
from .services import register_user, login_user, get_user_profile, logout_user
from .serializers import RegisterSerializer, LoginSerializer, CustomTokenRefreshSerializer, UserProfileSerializer, LogoutSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class RegisterView(APIView):
    '''
    register a new user and return jwt token
    '''
    def post(self,request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message='Invalid Data',
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        data = register_user(**serializer.validated_data)
        return success_response(
            message='User registered successfully',
            data=data,
            status_code=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    '''
    login a user and return jwt token
    '''
    permission_classes = []
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = login_user(**serializer.validated_data)
        return success_response(
            message='User logged in successfully',
            data=data,
            status_code=status.HTTP_200_OK
        )
    

from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

class TokenRefreshView(APIView):
    '''
    refresh token
    '''
    permission_classes = []
    def post(self,request):
        serializer = CustomTokenRefreshSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except (TokenError, InvalidToken) as e:
            return error_response(
                message='Token is invalid or expired',
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        data = serializer.validated_data
        return success_response(
            message='Token refreshed successfully',
            data=data,
            status_code=status.HTTP_200_OK
        )


class MeView(APIView):
    '''
    return user profile
    '''
    permission_classes = [IsAuthenticated]

    def get(self,request):
        serializer = UserProfileSerializer(request.user)
        return success_response(
            message='User profile retrieved successfully',
            data=serializer.data,
            status_code=status.HTTP_200_OK
        )

class LogoutView(APIView):
    '''
    logout a user by blacklisting the refresh token
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            logout_user(serializer.validated_data['refresh'])
        except (TokenError, InvalidToken):
            pass # If token is already invalid/blacklisted, just ignore and proceed with logout

        return success_response(
            message='User logged out successfully',
            status_code=status.HTTP_200_OK
        )