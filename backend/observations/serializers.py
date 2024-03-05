from django.db import transaction
from helpers.models import Tags
from helpers.serializers import (CommentsGetSerializer, TagsSerializer,
                                 UserSerializer)
from rest_framework import serializers
from targets.serializers import TargetGetSerializer

from .models import Lulin, Observation


class ObservationGetSerializer(serializers.ModelSerializer):
    tags = TagsSerializer(many=True)
    comments = CommentsGetSerializer(many=True)
    targets = TargetGetSerializer(many=True)
    user = UserSerializer()

    class Meta:
        model = Observation
        fields = ('id', 'user', 'name', 'observatory', 'start_date', 'end_date',
                  'targets', 'priority', 'status', 'tags', 'comments',
                  'created_at', 'updated_at')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'created_at' in data:
            data['created_at'] = instance.created_at.strftime(
                "%Y-%m-%d %H:%M:%S")
        if 'updated_at' in data:
            data['updated_at'] = instance.updated_at.strftime(
                "%Y-%m-%d %H:%M:%S")
        if 'start_date' in data:
            data['start_date'] = instance.start_date.strftime(
                "%Y-%m-%d %H:%M:%S")
        if 'end_date' in data:
            data['end_date'] = instance.end_date.strftime(
                "%Y-%m-%d %H:%M:%S")
        return data


class ObservationPostSerializer(serializers.ModelSerializer):
    tags = TagsSerializer(many=True, required=False)

    class Meta:
        model = Observation
        fields = ('id', 'name', 'user', 'observatory', 'start_date', 'end_date',
                  'targets', 'priority', 'status', 'created_at', 'updated_at', 'tags')
        extra_kwargs = {
            'id': {'read_only': True, 'required': False},
            'name': {'required': False},
            'user': {'read_only': True},
            'binning': {'required': False},
            'frames': {'required': False}
        }

    def validate(self, data):
        request_user = self.context['request'].user
        targets = data.get('targets')
        for target in targets:
            if target.user != request_user:
                raise serializers.ValidationError(
                    "You do not have permission to perform this action for this target.")
        return data

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', None)
        targets_data = validated_data.pop('targets', None)
        user = self.context['request'].user
        observation = Observation.objects.create(**validated_data, user=user)

        for target_instance in targets_data:
            observation.targets.add(target_instance)
            if observation.observatory == Observation.observatories.LULIN:
                Lulin.objects.get_or_create(
                    observation=observation,
                    target=target_instance,
                )

        if tags_data:
            with transaction.atomic():
                for tag_data in tags_data:
                    tag, _ = Tags.objects.get_or_create(
                        name=tag_data['name'],
                        user=observation.user
                    )
                    observation.tags.add(tag)

        return observation


class ObservationPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = "__all__"


class LulinGetSerializer(serializers.ModelSerializer):
    target = TargetGetSerializer()

    class Meta:
        model = Lulin
        fields = "__all__"


class LulinPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lulin
        fields = "__all__"
