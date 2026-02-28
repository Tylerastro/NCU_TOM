from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from dj_rest_auth.views import UserDetailsView
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from helpers.email import ActivationEmail
from helpers.serializers import ErrorResponseMixin
from system.models import User
from system.permissions import IsActivated

from .serializers import FullUserSerializer, UserPutSerializer, UserSerializer


class CustomRegisterView(RegisterView):
    """Custom registration view that sends activation email on signup."""

    def perform_create(self, serializer):
        user = super().perform_create(serializer)
        if getattr(settings, "SEND_ACTIVATION_EMAIL", False):
            context = {"user": user}
            to = [user.email]
            ActivationEmail(self.request, context).send(to)
        return user


class ActivationView(APIView):
    """Activate a user account via uid/token from the activation email."""

    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        if not uid or not token:
            return Response(
                {"detail": "uid and token are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_pk = force_str(urlsafe_base64_decode(uid))
            user = User.all_objects.get(pk=user_pk)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response(
                {"uid": ["Invalid user ID."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"token": ["Invalid or expired token."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_active:
            return Response(
                {"detail": "Account is already active."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.is_active = True
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResendActivationView(APIView):
    """Resend the activation email to an inactive user."""

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"email": ["This field is required."]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not getattr(settings, "SEND_ACTIVATION_EMAIL", False):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.all_objects.get(email=email, is_active=False)
        except User.DoesNotExist:
            # Return 204 regardless to prevent email enumeration
            return Response(status=status.HTTP_204_NO_CONTENT)

        context = {"user": user}
        to = [user.email]
        ActivationEmail(request, context).send(to)
        return Response(status=status.HTTP_204_NO_CONTENT)


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


class UserView(APIView, ErrorResponseMixin):
    permission_classes = [IsAuthenticated]

    def get(self, request) -> User:
        if request.user.role != User.Roles.ADMIN:
            return self.permission_error_response("Forbidden")

        users = User.all_objects.prefetch_related('targets', 'observations').all()
        serializer = FullUserSerializer(users, many=True)
        return Response(serializer.data, status=200)


class UserDetailView(APIView, ErrorResponseMixin):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk) -> User:
        if request.user != User.objects.get(id=pk):
            return self.permission_error_response("Forbidden")

        user = User.objects.get(id=pk)
        serializer = UserPutSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def delete(self, request, pk) -> User:
        if request.user != User.objects.get(id=pk):
            return self.permission_error_response("Forbidden")

        user = User.objects.get(id=pk)
        user.delete()
        return Response(status=204)


@api_view(['PUT'])
@permission_classes((IsAuthenticated, IsActivated))
def EditUser(request, pk):
    if request.user.role != User.Roles.ADMIN:
        return Response({"detail": "Forbidden"}, status=403)

    user = User.objects.get(id=pk)
    if user == request.user:
        return Response({"detail": "You can't edit your own role"}, status=403)
    serializer = UserPutSerializer(
        user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=400)
