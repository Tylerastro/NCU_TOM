from datetime import datetime
from typing import List

from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from system.models import User

from .models import Announcement, Comments, Tags
from .serializers import (AnnouncementsPostSerializer, AnnouncementsSerializer,
                          CommentsSerializer, TagsGetSerializer,
                          TagsSerializer, ErrorResponseMixin)


class TagsView(APIView, ErrorResponseMixin):

    def get(self, request) -> List[Tags]:
        tags = Tags.objects.filter(user=request.user)
        serializer = TagsGetSerializer(tags, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = TagsSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save(user=request.user)
            response = TagsGetSerializer(instance)
            return Response(response.data, status=201)
        return self.validation_error_response(serializer)


class TagsDetailView(APIView, ErrorResponseMixin):
    @extend_schema(operation_id='Get Single Tag')
    def get(self, request, pk) -> Tags:
        try:
            tag = Tags.objects.get(id=pk, user=request.user)
            serializer = TagsGetSerializer(tag)
            return Response(serializer.data)
        except Tags.DoesNotExist:
            return self.not_found_error_response("Tag")


@permission_classes((AllowAny,))
class AnnouncementsView(APIView, ErrorResponseMixin):
    @extend_schema(request=None, responses=AnnouncementsSerializer)
    def get(self, request) -> List[Announcement]:
        announcements = Announcement.objects.all()
        serializer = AnnouncementsSerializer(announcements, many=True)
        return Response(serializer.data, status=200)

    @extend_schema(request=AnnouncementsPostSerializer, responses=AnnouncementsSerializer)
    def post(self, request):
        if request.user.role not in (User.roles.ADMIN, User.roles.FACULTY):
            return self.permission_error_response()
        serializer = AnnouncementsPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return self.validation_error_response(serializer)


class AnnouncementsDetailView(APIView, ErrorResponseMixin):
    @extend_schema(request=AnnouncementsPostSerializer, responses=AnnouncementsSerializer)
    def put(self, request, pk):
        if request.user.role not in (User.roles.ADMIN, User.roles.FACULTY):
            return self.permission_error_response()
        announcement_instance = get_object_or_404(Announcement, pk=pk)
        serializer = AnnouncementsPostSerializer(
            announcement_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def delete(self, request, pk):
        if request.user.role not in (User.roles.ADMIN, User.roles.FACULTY):
            return self.permission_error_response()
        announcement_instance = get_object_or_404(Announcement, pk=pk)
        announcement_instance.deleted_at = datetime.now()
        return Response(status=204)


class CommentsView(APIView, ErrorResponseMixin):
    def get(self, request, observation_id):
        comments = Comments.objects.filter(observation_id=observation_id)
        serializer = CommentsSerializer(comments, many=True)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        comment_instance = get_object_or_404(Comments, pk=pk)
        serializer = CommentsSerializer(
            comment_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def delete(self, request, pk):
        comment_instance = get_object_or_404(Comments, pk=pk)
        comment_instance.deleted_at = datetime.now()
        comment_instance.save()
        return Response(status=204)
