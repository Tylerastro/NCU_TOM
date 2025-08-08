from rest_framework import serializers
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from system.models import User
from system.serializers import UserBaseSerializer

from .models import Announcement, Comments, Tags


class StandardErrorSerializer:
    """Utility class for consistent error response formatting"""
    
    @staticmethod
    def format_validation_errors(serializer_errors):
        """Convert DRF serializer errors to standard format"""
        return serializer_errors
    
    @staticmethod
    def format_custom_error(message, code=None, field=None):
        """Format custom error messages consistently"""
        if field:
            return {field: [message]}
        return {"non_field_errors": [message]}
    
    @staticmethod
    def format_permission_error(message="You're not authorized to perform this action"):
        """Standard permission error format"""
        return {"detail": message}
    
    @staticmethod
    def format_not_found_error(resource="Resource"):
        """Standard not found error format"""
        return {"detail": f"{resource} not found"}


class ErrorResponseMixin:
    """Mixin for consistent error responses across all views"""
    
    def error_response(self, errors, status_code=400):
        """Return standardized error response"""
        if isinstance(errors, str):
            data = StandardErrorSerializer.format_custom_error(errors)
        else:
            data = errors
        return Response(data, status=status_code)
    
    def validation_error_response(self, serializer):
        """Return validation error response from serializer"""
        return Response(
            StandardErrorSerializer.format_validation_errors(serializer.errors),
            status=400
        )
    
    def permission_error_response(self, message=None):
        """Return permission denied response"""
        error_data = StandardErrorSerializer.format_permission_error(message)
        return Response(error_data, status=403)
    
    def not_found_error_response(self, resource="Resource"):
        """Return not found response"""
        error_data = StandardErrorSerializer.format_not_found_error(resource)
        return Response(error_data, status=404)


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
    
    def validate_name(self, value):
        """Check if tag name is unique for the user"""
        user = self.context['request'].user
        queryset = Tags.objects.filter(user=user, name=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("Tag with this name already exists.")
        return value


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
