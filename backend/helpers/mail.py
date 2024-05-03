
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

from .models import Announcements, Comments, Tags, Users
from .serializers import (AnnouncementsPostSerializer, AnnouncementsSerializer,
                          TagsGetSerializer, TagsSerializer)

# TODO # This is a basic template which requires more design and customization


class MailService:
    def __init__(self):
        pass

    def send_observation_mail(self, observatory: str, observation: str):

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

    def send_announcement_mail(self, level: str, title: str, announcement: str):
        receivers = [user.email for user in Users.objects.all()]

        try:
            send_mail(
                'New Announcement',
                'A new announcement has been created.',
                settings.EMAIL_HOST_USER,
                recipient_list=receivers,
                fail_silently=True if settings.DEBUG else False
            )
            return Response(status=200)
        except:
            return Response(status=400)
