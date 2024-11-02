from django.db import transaction
from django.db.models import Count
from helpers.models import Comments, Tags
from helpers.serializers import (CommentsGetSerializer, TagsSerializer,
                                 UserSerializer)
from rest_framework import serializers
from targets.serializers import TargetGetSerializer

from .models import (LulinRun, Observation, Observatories, Priorities,
                     Statuses, Target)


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
        }

    def validate(self, data):
        request_user = self.context['request'].user
        targets = data.get('targets')
        for target in targets:
            if target.user != request_user:
                raise serializers.ValidationError(
                    "You do not have permission to perform this action for this target.")

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                "Start date cannot be after end date.")

        return data

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', None)
        targets_data = validated_data.pop('targets', None)
        user = self.context['request'].user
        observation = Observation.objects.create(**validated_data, user=user)

        for target_instance in targets_data:
            observation.targets.add(target_instance)
            if observation.observatory == Observatories.LULIN:
                LulinRun.objects.get_or_create(
                    observation=observation,
                    target=target_instance,
                    start_date=observation.start_date,
                    end_date=observation.end_date
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


class DeleteObservationSerializer(serializers.Serializer):
    observation_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False
    )


class ObservationPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = "__all__"

    def update(self, instance, validated_data):
        if 'status' in validated_data and validated_data['status'] != instance.status:
            if instance.user != self.context['request'].user:
                status = instance.statuses(validated_data['status']).label
                comment = Comments.objects.create(
                    context=f"Observation {instance.name} is now {status}.",
                    user=self.context['request'].user
                )
                instance.comments.add(comment)

                for attr, value in validated_data.items():
                    setattr(instance, attr, value)
                    instance.save()

        return instance


class LulinGetSerializer(serializers.ModelSerializer):
    target = TargetGetSerializer()
    observation = serializers.SerializerMethodField()

    class Meta:
        model = LulinRun
        fields = "__all__"

    def get_observation(self, obj):
        return obj.observation.name if obj.observation else None


class LulinPutSerializer(serializers.ModelSerializer):
    class Meta:
        model = LulinRun
        fields = "__all__"


class LulinPostSerializer(serializers.ModelSerializer):
    targets = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Target.objects.all())

    class Meta:
        model = LulinRun
        fields = ('priority', 'filter', 'binning', 'frames',
                  'instrument', 'exposure_time', 'targets')
        extra_kwargs = {
            'targets': {'required': False, 'read_only': True},
        }

    def validate(self, data):
        request_user = self.context['request'].user
        targets = data.get('targets', [])

        for target in targets:
            if target.user != request_user:
                raise serializers.ValidationError(
                    f"You do not have permission to perform this action for target {target.id}.")
        return data

    def create(self, validated_data):
        targets_data = validated_data.pop('targets')
        print(targets_data)
        observation = self.context['observation']

        lulin_instances = []
        for target_instance in targets_data:
            lulin = LulinRun.objects.create(
                observation=observation,
                target=target_instance,
                **validated_data
            )
            lulin_instances.append(lulin)
            observation.targets.add(target_instance)

        return observation


class StatusSerializer(serializers.Serializer):
    status = serializers.CharField()
    count = serializers.IntegerField()


class ObservationStatsSerializer(serializers.Serializer):
    total_observations = serializers.IntegerField()
    total_targets = serializers.IntegerField()
    total_users = serializers.IntegerField()
    observatory_counts = serializers.ListField(child=serializers.DictField())
    priority_counts = serializers.ListField(child=serializers.DictField())
    status_counts = serializers.ListField(child=serializers.DictField())

    def get_total_observations(self):
        return Observation.objects.count()

    def get_total_targets(self):
        return Observation.objects.values('targets').distinct().count()

    def get_total_users(self):
        return Observation.objects.values('user').distinct().count()

    def get_observatory_counts(self):
        counts = Observation.objects.values(
            'observatory').annotate(count=Count('observatory'))
        return [
            {
                'id': item['observatory'],
                'name': item['observatory'],
                'count': item['count']
            } for item in counts
        ]

    def get_priority_counts(self):
        counts = Observation.objects.values(
            'priority').annotate(count=Count('priority'))

        priority_map = dict(Priorities.choices)

        return [
            {
                'id': item['priority'],
                'name': priority_map.get(item['priority'], 'Unknown'),
                'count': item['count']
            } for item in counts
        ]

    def get_status_counts(self):
        counts = Observation.objects.values(
            'status').annotate(count=Count('status'))
        status_map = dict(Observation.statuses.choices)
        return [
            {
                'id': item['status'],
                'name': status_map.get(item['status'], 'Unknown'),
                'count': item['count']
            } for item in counts
        ]

    def to_representation(self, instance):
        return {
            'total_observations': self.get_total_observations(),
            'total_targets': self.get_total_targets(),
            'total_users': self.get_total_users(),
            'observatory_counts': self.get_observatory_counts(),
            'priority_counts': self.get_priority_counts(),
            'status_counts': self.get_status_counts()
        }
