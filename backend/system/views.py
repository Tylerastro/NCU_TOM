from datetime import datetime

from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import UserDetailsView
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from system.models import User
from system.permissions import IsActivated

from .serializers import FullUserSerializer, UserPutSerializer, UserSerializer


class TOMUserDetailsView(UserDetailsView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


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
@permission_classes((IsAuthenticated, IsActivated))
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
