from rest_framework import serializers

from .models import Announcements, Comments, Tags, Users


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ('id', 'username', 'institute', 'role', 'created_at')


class TagsSerializer(serializers.ModelSerializer):
    targets = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()

    class Meta:
        model = Tags
        fields = ('id', 'name', 'targets', 'observations')

    def get_targets(self, tag):
        return [target.id for target in tag.targets.all()]

    def get_observations(self, tag):
        return [observation.id for observation in tag.observations.all()]


class TagsGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'


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
        fields = '__all__'
