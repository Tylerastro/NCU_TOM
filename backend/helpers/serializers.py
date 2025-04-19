from rest_framework import serializers
from system.models import User
from system.serializers import UserBaseSerializer

from .models import Announcement, Comments, Tags


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


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ('name', 'id')


class TagsGetSerializer(serializers.ModelSerializer):
    targets = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()
    user = UserSerializer()

    class Meta:
        model = Tags
        fields = '__all__'

    def get_targets(self, tag):
        return [target.id for target in tag.targets.all()]

    def get_observations(self, tag):
        return [observation.id for observation in tag.observations.all()]


class CommentsGetSerializer(serializers.ModelSerializer):
    user = UserBaseSerializer()

    class Meta:
        model = Comments
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'created_at' in data:
            data['created_at'] = instance.created_at.strftime(
                "%Y-%m-%d %H:%M:%S")
        if 'updated_at' in data:
            data['updated_at'] = instance.updated_at.strftime(
                "%Y-%m-%d %H:%M:%S")
        return data


class AnnouncementsSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Announcement
        fields = 'id', 'user', 'title', 'context', 'type', 'created_at'


class AnnouncementsPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = 'user', 'title', 'context', 'type'
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        target = Announcement.objects.create(**validated_data, user=user)

        return target


class CommentsSerializer(serializers.ModelSerializer):
    user = UserBaseSerializer(read_only=True)

    class Meta:
        model = Comments
        fields = '__all__'
