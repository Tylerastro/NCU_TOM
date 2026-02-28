from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from system.permissions import IsActivated, IsAdminOrFaculty

from .models import Announcement, Comments, Tags
from .serializers import (
    AnnouncementsPostSerializer,
    AnnouncementsSerializer,
    CommentsSerializer,
    ErrorResponseMixin,
    TagsGetSerializer,
    TagsSerializer,
)


class TagViewSet(ModelViewSet, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]

    def get_serializer_class(self):
        if self.action in ('create',):
            return TagsSerializer
        return TagsGetSerializer

    def get_queryset(self):
        return Tags.objects.filter(user=self.request.user).select_related('user')

    def create(self, request, *args, **kwargs):
        serializer = TagsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            instance = serializer.save(user=request.user)
            response = TagsGetSerializer(instance)
            return Response(response.data, status=201)
        return self.validation_error_response(serializer)

    def retrieve(self, request, *args, **kwargs):
        try:
            tag = Tags.objects.get(id=kwargs['pk'], user=request.user)
            serializer = TagsGetSerializer(tag)
            return Response(serializer.data)
        except Tags.DoesNotExist:
            return self.not_found_error_response("Tag")


class AnnouncementViewSet(ModelViewSet, ErrorResponseMixin):
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated(), IsActivated(), IsAdminOrFaculty()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return AnnouncementsPostSerializer
        return AnnouncementsSerializer

    def get_queryset(self):
        return Announcement.objects.select_related('user')

    @extend_schema(request=None, responses=AnnouncementsSerializer)
    def list(self, request, *args, **kwargs):
        announcements = self.get_queryset()
        serializer = AnnouncementsSerializer(announcements, many=True)
        return Response(serializer.data, status=200)

    @extend_schema(request=AnnouncementsPostSerializer, responses=AnnouncementsSerializer)
    def create(self, request, *args, **kwargs):
        serializer = AnnouncementsPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return self.validation_error_response(serializer)

    @extend_schema(request=AnnouncementsPostSerializer, responses=AnnouncementsSerializer)
    def update(self, request, *args, **kwargs):
        announcement_instance = get_object_or_404(Announcement, pk=kwargs['pk'])
        serializer = AnnouncementsPostSerializer(
            announcement_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def destroy(self, request, *args, **kwargs):
        announcement_instance = get_object_or_404(Announcement, pk=kwargs['pk'])
        announcement_instance.delete()
        return Response(status=204)


class CommentViewSet(ModelViewSet, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]
    serializer_class = CommentsSerializer

    def get_queryset(self):
        return Comments.objects.select_related('user')

    def update(self, request, *args, **kwargs):
        comment_instance = get_object_or_404(Comments, pk=kwargs['pk'])
        serializer = CommentsSerializer(
            comment_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def destroy(self, request, *args, **kwargs):
        comment_instance = get_object_or_404(Comments, pk=kwargs['pk'])
        comment_instance.delete()
        return Response(status=204)
