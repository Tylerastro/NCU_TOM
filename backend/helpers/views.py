from typing import List

from django.conf import settings
from djoser.social.views import ProviderAuthView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .models import Announcements, Tags
from .serializers import (AnnouncementsSerializer, TagsGetSerializer,
                          TagsSerializer)


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
        else:
            raise InvalidToken('No token provided')

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
        else:
            raise InvalidToken('No token provided')

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request) -> Response:
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        return response


class TagsView(APIView):

    def get(self, request) -> List[Tags]:
        tags = Tags.objects.filter(user=request.user)
        serializer = TagsSerializer(tags, many=True)
        return Response(serializer.data, status=200)


class TagsDetailView(APIView):
    def get(self, request, pk) -> Tags:
        try:
            tag = Tags.objects.get(id=pk, user=request.user)
            serializer = TagsGetSerializer(tag)
            return Response(serializer.data)
        except Tags.DoesNotExist:
            return Response({"detail": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)


class AnnouncementsView(APIView):

    def get(self, request) -> List[Announcements]:
        announcements = Announcements.objects.all()
        serializer = AnnouncementsSerializer(announcements, many=True)
        return Response(serializer.data, status=200)
