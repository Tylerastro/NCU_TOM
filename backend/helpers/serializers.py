from rest_framework import serializers

from .models import Announcements, Comments, Tags, Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'institute',
                  'role', 'created_at', 'is_active')


class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'institute', 'email',
                  'role', 'created_at', 'is_active', 'last_login')


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ('name', 'id')


class TagsGetSerializer(serializers.ModelSerializer):
    targets = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()

    class Meta:
        model = Tags
        fields = '__all__'

    def get_targets(self, tag):
        return [target.id for target in tag.targets.all()]

    def get_observations(self, tag):
        return [observation.id for observation in tag.observations.all()]


class CommentsGetSerializer(serializers.ModelSerializer):
    user = UserSerializer()

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
        model = Announcements
        fields = 'id', 'user', 'title', 'context', 'type', 'created_at'


class AnnouncementsPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcements
        fields = 'user', 'title', 'context', 'type'
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        target = Announcements.objects.create(**validated_data, user=user)

        return target
