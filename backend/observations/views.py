from typing import List

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from helpers.models import Comments
from helpers.paginator import Pagination
from helpers.serializers import ErrorResponseMixin, StandardErrorSerializer
from observations.code_generators import get_code_generator
from observations.filters import ObservationFilter
from observations.observatory_config import get_run_model
from system.models import User
from system.permissions import IsActivated
from targets.views import get_targets_altaz
from targets.visibility import TargetAltAz

from .models import LulinRun, Observation, Observatories
from .serializers import (
    DeleteObservationSerializer,
    LulinGetSerializer,
    LulinPostSerializer,
    LulinPutSerializer,
    ObservationGetSerializer,
    ObservationPostSerializer,
    ObservationPutSerializer,
    ObservationStatsSerializer,
)


class ObservationViewSet(ModelViewSet, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]
    pagination_class = Pagination
    filterset_class = ObservationFilter

    def get_serializer_class(self):
        if self.action == 'create':
            return ObservationPostSerializer
        if self.action in ('update', 'partial_update'):
            return ObservationPutSerializer
        return ObservationGetSerializer

    def get_queryset(self):
        qs = Observation.objects.select_related('user').prefetch_related(
            'tags', 'comments', 'comments__user',
            'targets', 'targets__user', 'targets__tags',
        )
        if self.request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            return qs
        return qs.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = ObservationPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return self.validation_error_response(serializer)

    def update(self, request, *args, **kwargs):
        pk = kwargs['pk']
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
            return self.validation_error_response(serializer)
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    def destroy(self, request, *args, **kwargs):
        pk = kwargs['pk']
        if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
        observation.delete()
        return Response({'message': f'{observation.name} deleted successfully'}, status=200)

    @extend_schema(request=DeleteObservationSerializer)
    @action(detail=False, methods=['delete'], url_path='bulk-delete')
    def bulk_delete(self, request):
        serializer = DeleteObservationSerializer(data=request.data)
        if not serializer.is_valid():
            return self.validation_error_response(serializer)
        try:
            observation_ids = serializer.validated_data['observation_ids']
            if request.user.role == User.Roles.ADMIN:
                observations = Observation.objects.filter(id__in=observation_ids)
            else:
                observations = Observation.objects.filter(
                    id__in=observation_ids, user=request.user)
            deleted_count = observations.delete()
            return Response({'message': f'{deleted_count} observations deleted successfully'}, status=200)
        except Exception as e:
            return Response({'error': f'Error deleting observations: {str(e)}'}, status=500)

    @action(detail=True, methods=['post'], url_path='duplicate')
    def duplicate(self, request, pk=None):
        if request.user.role not in (User.Roles.ADMIN, User.Roles.FACULTY):
            observation = Observation.objects.get(id=pk, user=request.user)
        else:
            observation = Observation.objects.get(id=pk)

        original_observation = observation
        observation = Observation.objects.create(
            name=f'Copy of {original_observation.name}',
            user=request.user,
            observatory=original_observation.observatory,
            start_date=original_observation.start_date,
            end_date=original_observation.end_date,
            priority=original_observation.priority,
            status=Observation.statuses.PREP,
        )

        observation.tags.set(original_observation.tags.all())
        observation.targets.set(original_observation.targets.all())

        RunModel = get_run_model(original_observation.observatory)
        original_runs = RunModel.objects.filter(observation=original_observation)
        for run in original_runs:
            RunModel.objects.create(
                observation=observation,
                target=run.target,
                priority=run.priority,
                filter=run.filter,
                binning=run.binning,
                frames=run.frames,
                instrument=run.instrument,
                exposure_time=run.exposure_time
            )

        return Response(ObservationGetSerializer(observation).data, status=201)

    @action(detail=True, methods=['get', 'post'], url_path='messages')
    def messages(self, request, pk=None):
        if request.method == 'GET':
            observation = get_object_or_404(
                Observation, id=pk, user=request.user)
            serializer = ObservationGetSerializer(observation)
            return Response(serializer.data, status=200)

        # POST
        if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
        comment = Comments.objects.create(
            user=request.user,
            context=request.data,
        )
        observation.comments.add(comment)
        observation.save()
        serializer = ObservationGetSerializer(observation)
        return Response(serializer.data, status=200)

    @action(detail=True, methods=['post'], url_path='altaz')
    def altaz(self, request, pk=None):
        if request.user.role not in (User.Roles.ADMIN, User.Roles.FACULTY):
            observation = Observation.objects.get(id=pk, user=request.user)
        else:
            observation = Observation.objects.get(id=pk)

        RunModel = get_run_model(observation.observatory)
        if request.user.role not in (User.Roles.ADMIN, User.Roles.FACULTY):
            runs = RunModel.objects.filter(
                observation__id=pk, observation__user=request.user
            ).select_related('observation', 'observation__user')
        else:
            runs = RunModel.objects.filter(
                observation__id=pk
            ).select_related('observation', 'observation__user')

        targets = [x.target for x in runs]
        data: List[TargetAltAz] = get_targets_altaz(
            targets, observation.start_date, observation.end_date,
            observatory_id=observation.observatory)
        return JsonResponse(data, safe=False)


class LulinRunViewSet(ModelViewSet, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]

    def get_serializer_class(self):
        if self.action == 'create':
            return LulinPostSerializer
        if self.action in ('update', 'partial_update'):
            return LulinPutSerializer
        return LulinGetSerializer

    def get_queryset(self):
        qs = LulinRun.objects.select_related(
            'observation', 'observation__user', 'target', 'target__user'
        ).prefetch_related('target__tags')
        if self.request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            return qs
        return qs.filter(observation__user=self.request.user)

    def list(self, request, observation_pk=None):
        qs = self.get_queryset()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date:
            qs = qs.filter(observation__start_date__gte=start_date)
        if end_date:
            qs = qs.filter(observation__end_date__lte=end_date)
        if observation_pk:
            qs = qs.filter(observation__id=observation_pk)
        serializer = LulinGetSerializer(qs, many=True)
        return Response(serializer.data, status=200)

    def create(self, request, observation_pk=None):
        observation = get_object_or_404(
            Observation, pk=observation_pk, user=request.user)
        serializer = LulinPostSerializer(
            data=request.data, context={'request': request, 'observation': observation})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return self.validation_error_response(serializer)

    def retrieve(self, request, *args, **kwargs):
        lulin = self._get_lulin_run(kwargs['pk'], request.user)
        serializer = LulinGetSerializer(lulin)
        return Response(serializer.data, status=200)

    def update(self, request, *args, **kwargs):
        lulin = self._get_lulin_run(kwargs['pk'], request.user)
        serializer = LulinPutSerializer(lulin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return self.validation_error_response(serializer)

    def destroy(self, request, *args, **kwargs):
        lulin = self._get_lulin_run(kwargs['pk'], request.user)
        lulin.delete()
        return Response(status=204)

    def _get_lulin_run(self, pk, user):
        if user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            return get_object_or_404(LulinRun, pk=pk)
        return get_object_or_404(LulinRun, pk=pk, observation__user=user)


class LulinCodeView(APIView, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]

    @extend_schema(operation_id='Get or gen code for Lulin observation')
    def get(self, request, pk):
        try:
            if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
                observation = Observation.objects.get(pk=pk)
            else:
                observation = Observation.objects.get(pk=pk, user=request.user)
        except Observation.DoesNotExist:
            return self.not_found_error_response("Observation")

        refresh = request.query_params.get('refresh')
        if refresh == 'true' or not observation.code:
            generator = get_code_generator(observation.observatory)
            code = generator.gen_code(observation_id=pk)
            return HttpResponse(code, content_type='text/plain')
        return HttpResponse(observation.code, content_type='text/plain')

    @extend_schema(operation_id='Save code for Lulin observation')
    def put(self, request, pk):
        try:
            if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
                observation = Observation.objects.get(pk=pk)
            else:
                observation = Observation.objects.get(pk=pk, user=request.user)
        except Observation.DoesNotExist:
            return self.not_found_error_response("Observation")

        code = request.data.get('code', '')
        observation.code = code
        observation.save()
        return Response({'message': 'Code saved successfully'}, status=200)


@api_view(['GET'])
@permission_classes((IsAuthenticated, IsActivated))
def get_lulin_compiled_codes(request):
    if request.user.role not in (User.Roles.ADMIN, User.Roles.FACULTY):
        return Response(StandardErrorSerializer.format_permission_error("Unauthorized"), status=403)

    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    if all([not start_date, not end_date]):
        return Response(StandardErrorSerializer.format_custom_error("start_date and end_date are required"), status=400)

    observatory_id = int(request.query_params.get('observatory', Observatories.LULIN))
    generator = get_code_generator(observatory_id)
    return HttpResponse(generator.get_codes(
        start_date, end_date), content_type='text/plain')


@api_view(['GET'])
@permission_classes((AllowAny, ))
def get_observation_stats(request):
    serializer = ObservationStatsSerializer(
        Observation, context={'request': request})
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes((AllowAny,))
def get_observatories(request):
    from observations.observatory_config import OBSERVATORY_CONFIGS
    data = [
        {
            'id': config.id,
            'name': config.name,
            'code': config.code,
            'timezone': config.timezone,
            'latitude': config.latitude,
            'longitude': config.longitude,
            'height': config.height,
        }
        for config in OBSERVATORY_CONFIGS.values()
    ]
    return Response(data, status=200)
