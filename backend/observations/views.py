from datetime import datetime
from typing import List

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from helpers.models import Comments
from helpers.paginator import Pagination
from observations.lulin import LulinScheduler
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from system.models import User
from targets.views import get_targets_altaz
from targets.visibility import TargetAltAz

from .models import LulinRun, Observation
from .serializers import (DeleteObservationSerializer, LulinGetSerializer,
                          LulinPostSerializer, LulinPutSerializer,
                          ObservationGetSerializer, ObservationPostSerializer,
                          ObservationPutSerializer, ObservationStatsSerializer)


class ObservationsView(APIView):
    serializer_class = ObservationGetSerializer
    paginator = Pagination()

    def get(self, request):
        conditions = []
        conditions.append(Q(deleted_at__isnull=True))
        observatory = request.query_params.get('observatory')
        status = request.query_params.get('status')
        name = request.query_params.get('name')
        users = request.query_params.get('users')
        tags = request.query_params.get('tags')

        if observatory:
            conditions.append(Q(observatory=observatory))
        if status:
            status = status.split(',')
            status = [int(status) for status in status if status.isdigit()]
            conditions.append(Q(status__in=status))
        if name:
            conditions.append(Q(name__icontains=name))
        if users:
            users = users.split(',')
            users = [int(user) for user in users if user.isdigit()]
            if users:
                conditions.append(Q(user__in=users))
        if tags:
            tags = tags.split(',')
            tags = [int(tag) for tag in tags if tag.isdigit()]
            if tags:
                conditions.append(Q(tags__in=tags))

        combined_conditions = Q()
        for condition in conditions:
            combined_conditions &= condition

        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            observations = Observation.objects.filter(
                combined_conditions
            )
        else:
            observations = Observation.objects.filter(
                Q(user=request.user) & combined_conditions
            )
        results = self.paginator.paginate_queryset(observations, request)
        serializer = ObservationGetSerializer(results, many=True)

        return self.paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = ObservationPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        serializer = DeleteObservationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            observation_ids = serializer.validated_data['observation_ids']

            if request.user.role == User.roles.ADMIN:
                observations = Observation.objects.filter(
                    id__in=observation_ids)
            else:
                observations = Observation.objects.filter(
                    id__in=observation_ids, user=request.user)

            deleted_count = observations.update(deleted_at=datetime.now())

            return Response({'message': f'{deleted_count} observations deleted successfully'}, status=200)
        except Exception as e:
            return Response({'error': f'Error deleting observations: {str(e)}'}, status=500)


class ObservationDetailView(APIView):
    serializer_class = ObservationGetSerializer

    @extend_schema(responses=ObservationGetSerializer, operation_id='Get Single Observation')
    def get(self, request, pk):
        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
        serializer = ObservationGetSerializer(observation)
        return Response(serializer.data, status=200)

    @extend_schema(operation_id='Delete Single Observation')
    def delete(self, request, pk):
        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
        observation.deleted_at = datetime.now()
        observation.save()
        return Response({'message': f'{observation.name} deleted successfully'}, status=200)

    def put(self, request, pk):
        if pk is None:
            return Response(status=400)
        try:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
            serializer = ObservationPutSerializer(
                observation, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)
        except ValidationError as e:
            return Response(e, status=400)


class LulinView(APIView):
    serializer_class = LulinGetSerializer

    @extend_schema(responses=LulinGetSerializer, operation_id='Get Lulin by observation')
    def get(self, request, pk=None):
        conditions = []
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date:
            conditions.append(Q(observation__start_date__gte=start_date))
        if end_date:
            conditions.append(Q(observation__end_date__lte=end_date))

        combined_conditions = Q()
        for condition in conditions:
            combined_conditions &= condition

        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            observations = LulinRun.objects.filter(
                combined_conditions
            )
            if pk:
                observations = observations.filter(observation__id=pk).select_related(
                    'observation')
        else:
            observations = LulinRun.objects.filter(
                Q(observation__user=request.user) & combined_conditions
            )
            if pk:
                observations = observations.filter(observation__id=pk).select_related(
                    'observation', 'observation__user')

        serializer = LulinGetSerializer(observations, many=True)
        return Response(serializer.data, status=200)

    @extend_schema(operation_id='Create Lulin')
    def post(self, request, pk):
        observation = get_object_or_404(
            Observation, pk=pk, user=request.user)
        serializer = LulinPostSerializer(
            data=request.data, context={'request': request, 'observation': observation})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class LulinDetailView(APIView):
    def _get_lulin_run(self, pk, user):
        if user.role in (User.roles.ADMIN, User.roles.FACULTY):
            return get_object_or_404(LulinRun, pk=pk)
        return get_object_or_404(LulinRun, pk=pk, observation__user=user)

    @ extend_schema(responses=LulinGetSerializer, operation_id='Get Single Lulin by id')
    def get(self, request, pk):
        lulin = self._get_lulin_run(pk, request.user)
        serializer = LulinGetSerializer(lulin)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        lulin = self._get_lulin_run(pk, request.user)
        serializer = LulinPutSerializer(lulin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        lulin = self._get_lulin_run(pk, request.user)
        lulin.delete()
        return Response(status=204)


@ permission_classes((IsAuthenticated, ))
class LulinCodeView(APIView):
    @ extend_schema(operation_id='Get or gen code for Lulin observation')
    def get(self, request, pk):
        service = LulinScheduler()
        try:
            if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
                lulin = Observation.objects.get(pk=pk)
            else:
                lulin = Observation.objects.get(pk=pk, user=request.user)
        except Observation.DoesNotExist:
            return Response({"detail": "Observation not found"}, status=404)

        refresh = request.query_params.get('refresh')
        if refresh == 'true' or not lulin.code:
            code = service.gen_code(observation_id=pk)
            return HttpResponse(code, content_type='text/plain')
        else:
            return HttpResponse(lulin.code, content_type='text/plain')


@ api_view(['GET'])
def get_lulin_compiled_codes(request):
    if request.user.role not in (User.roles.ADMIN, User.roles.FACULTY):
        return Response({"detail": "Unauthorized"}, status=401)

    service = LulinScheduler()
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    if all([not start_date, not end_date]):
        return Response({"detail": "start_date and end_date are required"}, status=400)

    return HttpResponse(service.get_codes(
        start_date, end_date), content_type='text/plain')


@ api_view(['GET'])
@ permission_classes((AllowAny, ))
def get_observation_stats(request):
    observations = Observation.objects.first()
    serializer = ObservationStatsSerializer(
        observations, context={'request': request})

    return Response(serializer.data, status=200)


@ api_view(['POST'])
@ permission_classes((IsAuthenticated, ))
def get_observation_altaz(request, pk):
    if request.user.role not in (User.roles.ADMIN, User.roles.FACULTY):
        observation = Observation.objects.get(id=pk, user=request.user)
        observations = LulinRun.objects.filter(observation__id=pk, observation__user=request.user).select_related(
            'observation', 'observation__user')
    else:
        observation = Observation.objects.get(id=pk)
        observations = LulinRun.objects.filter(observation__id=pk).select_related(
            'observation', 'observation__user')

    targets = [x.target for x in observations]

    data: List[TargetAltAz] = get_targets_altaz(
        targets, observation.start_date, observation.end_date)

    return JsonResponse(data, safe=False)


class ObservationMessagesView(APIView):
    serializer_class = ObservationGetSerializer

    def get(self, request, pk):
        observation = get_object_or_404(
            Observation, id=pk, user=request.user)
        serializer = ObservationGetSerializer(observation)
        return Response(serializer.data, status=200)

    def post(self, request, pk):
        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
        if observation:
            comment = Comments.objects.create(
                user=request.user,
                context=request.data,
            )
            observation.comments.add(comment)
            observation.save()
            serializer = ObservationGetSerializer(observation)
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)
