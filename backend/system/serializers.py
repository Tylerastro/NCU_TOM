from rest_framework import serializers
from system.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'institute',
                  'role', 'created_at', 'is_active')


class UserPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'institute', 'first_name', 'last_name')


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
