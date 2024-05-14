from typing import List

from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpRequest
from djoser.social.views import ProviderAuthView
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .models import Announcements, Tags
from .serializers import (AnnouncementsPostSerializer, AnnouncementsSerializer,
                          TagsGetSerializer, TagsSerializer)


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


class TagsView(APIView):

    def get(self, request) -> List[Tags]:
        tags = Tags.objects.filter(user=request.user)
        serializer = TagsGetSerializer(tags, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = TagsSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save(user=request.user)
            response = TagsGetSerializer(instance)
            return Response(response.data, status=201)
        return Response(serializer.errors, status=400)


class TagsDetailView(APIView):
    def get(self, request, pk) -> Tags:
        try:
            tag = Tags.objects.get(id=pk, user=request.user)
            serializer = TagsGetSerializer(tag)
            return Response(serializer.data)
        except Tags.DoesNotExist:
            return Response({"detail": "Tag not found"}, status=status.HTTP_404_NOT_FOUND)


@permission_classes((AllowAny,))
class AnnouncementsView(APIView):
    def get(self, request) -> List[Announcements]:
        announcements = Announcements.objects.all()
        serializer = AnnouncementsSerializer(announcements, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = AnnouncementsPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


def send_observation_mail(request: HttpRequest):
    try:
        send_mail(
            'New Observation',
            'A new observation has been created.',
            settings.EMAIL_HOST_USER,
            ['to@gmail.com'],
            fail_silently=True if settings.DEBUG else False
        )
        return Response(status=200)
    except:
        return Response(status=400)
