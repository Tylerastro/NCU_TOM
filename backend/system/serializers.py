from dj_rest_auth.registration.serializers import RegisterSerializer
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
        if not request.user.role == User.Roles.ADMIN:
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


class CustomRegisterSerializer(RegisterSerializer):
    """Custom registration serializer for the User model with additional fields."""

    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=100)
    last_name = serializers.CharField(required=True, max_length=100)
    institute = serializers.CharField(required=True, max_length=100)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['first_name'] = self.validated_data.get('first_name', '')
        data['last_name'] = self.validated_data.get('last_name', '')
        data['institute'] = self.validated_data.get('institute', '')
        return data

    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name')
        user.last_name = self.cleaned_data.get('last_name')
        user.institute = self.cleaned_data.get('institute')
        user.save()
        return user
