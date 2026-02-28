from typing import List

import pandas as pd
from astropy.time import Time
from django.db import IntegrityError
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from helpers.paginator import Pagination
from helpers.serializers import ErrorResponseMixin, StandardErrorSerializer
from observations.observatory_config import get_default_observatory, get_observatory_config
from system.models import User
from system.permissions import IsActivated
from targets.filters import TargetFilter

from .models import Target
from .query_service import resolve_url
from .serializers import (
    DeleteTargetSerializer,
    QueryURLSerializer,
    ResolvedTargetSerializer,
    TargetGetSerializer,
    TargetPostSerializer,
    TargetSEDSerializer,
    TargetSimbadDataSerializer,
    TargetVisibilitySerializer,
)
from .simbad import SimbadService
from .visibility import TargetAltAz, Visibility
from .vizier import VizierService


class TargetViewSet(ModelViewSet, ErrorResponseMixin):
    permission_classes = [IsAuthenticated, IsActivated]
    pagination_class = Pagination
    filterset_class = TargetFilter

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return TargetPostSerializer
        return TargetGetSerializer

    def get_queryset(self):
        qs = Target.objects.select_related('user').prefetch_related('tags', 'tags__user')
        if self.request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            return qs.distinct()
        return qs.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = TargetPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                instance = serializer.save()
                response_serializer = TargetGetSerializer(instance)
                return Response(response_serializer.data, status=201)
            except IntegrityError as e:
                if 'unique_target_name_per_user' in str(e):
                    return Response(
                        {'error': 'A target with this name already exists for this user.'},
                        status=400
                    )
                return Response(
                    {'error': 'Database integrity error occurred.'},
                    status=400
                )
        return self.validation_error_response(serializer)

    def update(self, request, *args, **kwargs):
        target = get_object_or_404(Target, pk=kwargs['pk'], user=request.user)
        serializer = TargetPostSerializer(
            target, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return self.validation_error_response(serializer)

    def destroy(self, request, *args, **kwargs):
        if request.user.role in (User.Roles.ADMIN, User.Roles.FACULTY):
            target = get_object_or_404(Target, pk=kwargs['pk'])
        else:
            target = get_object_or_404(Target, pk=kwargs['pk'], user=request.user)
        target.delete()
        return Response({'message': f'{target.name} deleted successfully'}, status=200)

    @extend_schema(request=DeleteTargetSerializer)
    @action(detail=False, methods=['delete'], url_path='bulk-delete')
    def bulk_delete(self, request):
        serializer = DeleteTargetSerializer(data=request.data)
        if not serializer.is_valid():
            return self.validation_error_response(serializer)
        try:
            target_ids = serializer.validated_data['target_ids']
            if request.user.role == User.Roles.ADMIN:
                targets = Target.objects.filter(id__in=target_ids)
            else:
                targets = Target.objects.filter(
                    id__in=target_ids, user=request.user)
            deleted_count = targets.delete()
            return Response({'message': f'{deleted_count} targets deleted successfully'}, status=200)
        except Exception as e:
            return Response({'error': f'Error deleting targets: {str(e)}'}, status=500)

    @extend_schema(request=None, responses=TargetSimbadDataSerializer)
    @action(detail=True, methods=['get'], url_path='simbad')
    def simbad(self, request, pk=None):
        target = get_object_or_404(Target, id=pk)
        service = SimbadService()
        astronomical_object = service.get_target(target.name)
        if astronomical_object is None:
            return Response(
                StandardErrorSerializer.format_not_found_error("Target"),
                status=404
            )
        serializer = TargetSimbadDataSerializer(data=astronomical_object.to_dict())
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(
            StandardErrorSerializer.format_validation_errors(serializer.errors),
            status=400
        )

    @extend_schema(request=None, responses=TargetSEDSerializer)
    @action(detail=True, methods=['get'], url_path='sed')
    def sed(self, request, pk=None):
        target = get_object_or_404(Target, id=pk)
        service = VizierService()
        sed = service.get_sed(target)
        serializer = TargetSEDSerializer(data=sed, many=True)
        if serializer.is_valid():
            return Response(serializer.data, status=200)
        return Response(
            StandardErrorSerializer.format_validation_errors(serializer.errors),
            status=400
        )

    @extend_schema(request=QueryURLSerializer, responses=ResolvedTargetSerializer)
    @action(detail=False, methods=['post'], url_path='query')
    def resolve_url_action(self, request):
        serializer = QueryURLSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                StandardErrorSerializer.format_validation_errors(serializer.errors),
                status=400,
            )
        try:
            result = resolve_url(serializer.validated_data['url'])
        except ValueError as e:
            return Response(
                StandardErrorSerializer.format_custom_error(str(e)),
                status=400,
            )
        if result is None:
            return Response(
                StandardErrorSerializer.format_not_found_error("Target"),
                status=404,
            )
        response_serializer = ResolvedTargetSerializer(result)
        return Response(response_serializer.data)

    @action(detail=False, methods=['post'], url_path='bulk')
    def bulk_create(self, request):
        def handle_uploads(file):
            file_extension = file.name.split('.')[-1]
            if file_extension == 'csv':
                return pd.read_csv(file)
            return None

        try:
            uploaded_file = request.FILES['file']
            df = handle_uploads(uploaded_file)
            if df is None:
                return HttpResponse("Invalid file type", status=400)
            targets = []
            for _, row in df.iterrows():
                try:
                    targets.append(
                        Target(
                            user=request.user,
                            name=row['name'],
                            ra=row['ra'],
                            dec=row['dec'],
                        )
                    )
                except Exception as e:
                    return HttpResponse(f"Error creating target: {e}", status=400)
            Target.objects.bulk_create(targets)
            return HttpResponse("Targets uploaded successfully")
        except Exception as e:
            return HttpResponse(f"An error occurred: {e}", status=400)


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def get_moon_altaz(request):
    obs = get_default_observatory()
    service = Visibility(lat=obs.latitude, lon=obs.longitude, height=obs.height)
    moon_altaz: TargetAltAz = service.get_moon_altaz(
        Time(request.data['start_time']),
        Time(request.data['end_time'])
    )
    serializer = TargetVisibilitySerializer(data=moon_altaz.to_dict())
    if serializer.is_valid():
        return Response(serializer.validated_data)
    return Response(
        StandardErrorSerializer.format_validation_errors(serializer.errors),
        status=400
    )


def get_targets_altaz(targets: list[Target], start_time: str, end_time: str, observatory_id: int = None):
    if observatory_id is not None:
        obs = get_observatory_config(observatory_id)
    else:
        obs = get_default_observatory()
    service = Visibility(lat=obs.latitude, lon=obs.longitude, height=obs.height)
    targets_altaz: List[TargetAltAz] = service.get_targets_altaz(
        targets=targets,
        start_time=Time(start_time),
        end_time=Time(end_time)
    )
    data = [x.to_dict() for x in targets_altaz]
    serializer = TargetVisibilitySerializer(data=data, many=True)
    if serializer.is_valid():
        return serializer.data
    raise ValueError(f"Serializer validation failed: {serializer.errors}")
