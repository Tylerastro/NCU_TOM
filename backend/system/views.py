from datetime import datetime

from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import UserDetailsView
from django.conf import settings
from djoser.social.views import ProviderAuthView
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)
from system.models import User

from .serializers import FullUserSerializer, UserPutSerializer, UserSerializer

# Create your views here.


class TOMUserDetailsView(UserDetailsView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GoogleLogin(SocialLoginView):
    authentication_classes = []
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:3000"
    client_class = OAuth2Client


class GitHubLogin(SocialLoginView):
    authentication_classes = []
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://127.0.0.1:3000"
    client_class = OAuth2Client


class TomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 201:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie('access', access_token, max_age=settings.AUTH_COOKIE_MAX_AGE,
                                path=settings.AUTH_COOKIE_PATH, secure=settings.AUTH_COOKIE_SECURE,
                                httponly=settings.AUTH_COOKIE_HTTPONLY, samesite=settings.AUTH_COOKIE_SAMESITE)
            response.set_cookie('refresh', refresh_token, max_age=settings.AUTH_COOKIE_MAX_AGE,
                                path=settings.AUTH_COOKIE_PATH, secure=settings.AUTH_COOKIE_SECURE,
                                httponly=settings.AUTH_COOKIE_HTTPONLY, samesite=settings.AUTH_COOKIE_SAMESITE)

        return response


class TomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')

            response.set_cookie('access', access_token, max_age=settings.AUTH_COOKIE_MAX_AGE,
                                path=settings.AUTH_COOKIE_PATH, secure=settings.AUTH_COOKIE_SECURE,
                                httponly=settings.AUTH_COOKIE_HTTPONLY, samesite=settings.AUTH_COOKIE_SAMESITE)
            response.set_cookie('refresh', refresh_token, max_age=settings.AUTH_COOKIE_MAX_AGE,
                                path=settings.AUTH_COOKIE_PATH, secure=settings.AUTH_COOKIE_SECURE,
                                httponly=settings.AUTH_COOKIE_HTTPONLY, samesite=settings.AUTH_COOKIE_SAMESITE)

        return response


class TomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get('access')

            response.set_cookie('access', access_token, max_age=settings.AUTH_COOKIE_MAX_AGE,
                                path=settings.AUTH_COOKIE_PATH, secure=settings.AUTH_COOKIE_SECURE,
                                httponly=settings.AUTH_COOKIE_HTTPONLY, samesite=settings.AUTH_COOKIE_SAMESITE)

        return response


class TomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access')
        if access_token:
            request.data['token'] = access_token
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request) -> Response:
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response


@permission_classes((IsAuthenticated, ))
class UserView(APIView):
    def get(self, request) -> User:
        if request.user.role != User.roles.ADMIN:
            return Response({"detail": "Forbidden"}, status=403)

        users = User.objects.all()
        serializer = FullUserSerializer(users, many=True)
        return Response(serializer.data, status=200)


@permission_classes((IsAuthenticated, ))
class UserDetailView(APIView):
    def put(self, request, pk) -> User:
        if request.user != User.objects.get(id=pk):
            return Response({"detail": "Forbidden"}, status=403)

        user = User.objects.get(id=pk)
        serializer = UserPutSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk) -> User:
        if request.user != User.objects.get(id=pk):
            return Response({"detail": "Forbidden"}, status=403)

        user = User.objects.get(id=pk)
        user.deleted_at = datetime.now()
        user.is_active = False
        user.save()
        return Response(status=204)


@api_view(['PUT'])
@permission_classes((IsAuthenticated, ))
def EditUser(request, pk):
    if request.user.role != User.roles.ADMIN:
        return Response({"detail": "Forbidden"}, status=403)

    user = User.objects.get(id=pk)
    if user == request.user:
        return Response({"detail": "You can't edit your own role"}, status=403)
    serializer = UserPutSerializer(
        user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response(status=200)
