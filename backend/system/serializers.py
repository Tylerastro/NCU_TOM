from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.socialaccount.helpers import complete_social_login
from allauth.socialaccount.models import EmailAddress, SocialAccount
from allauth.socialaccount.providers.base import AuthProcess
from dj_rest_auth.registration.serializers import RegisterSerializer
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from system.models import User


class UserBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'is_active')


class UserSerializer(UserBaseSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'institute', 'first_name', 'last_name',
                  'role', 'created_at', 'is_active')


class UserPutSerializer(serializers.ModelSerializer):
    def validate_role(self, value):
        request = self.context.get('request')
        if not request.user.role == User.roles.ADMIN:
            raise serializers.ValidationError(
                "Only admin users can modify roles")

        return value

    class Meta:
        model = User
        fields = ('username', 'institute', 'first_name',
                  'last_name', 'role', 'is_active')


class FullUserSerializer(serializers.ModelSerializer):
    targets = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'institute', 'email',
                  'targets', 'observations', 'deleted_at',
                  'role', 'created_at', 'is_active', 'last_login')

    def get_targets(self, user):
        return [target.id for target in user.targets.all()]

    def get_observations(self, user):
        return [observation.id for observation in user.observations.all()]
