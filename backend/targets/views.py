from datetime import datetime
from typing import List

import pandas as pd
from astropy.time import Time
from django.db import IntegrityError
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from helpers.paginator import Pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from system.models import User
from system.permissions import IsActivated
from targets.visibility import TargetAltAz, Visibility

from .models import Target
from .serializers import (DeleteTargetSerializer, TargetGetSerializer,
                          TargetPostSerializer, TargetSEDSerializer,
                          TargetSimbadDataSerializer,
                          TargetVisibilitySerializer)
from .simbad import SimbadService
from .vizier import VizierService


@permission_classes((IsAuthenticated, IsActivated))
class TargetsView(APIView):
    serializer_class = TargetPostSerializer
    paginator = Pagination()

    def get(self, request):
        is_admin_or_faculty = request.user.role in (
            User.roles.ADMIN, User.roles.FACULTY
        )
        conditions = []
        conditions.append(Q(deleted_at__isnull=True))
        name = request.query_params.get('name')
        target_tags = request.query_params.get('tags')
        if name:
            conditions.append(Q(name__icontains=name))
        if target_tags:
            tags = target_tags.split(',')
            tags = [int(tag) for tag in tags if tag.isdigit()]

            if tags:
                conditions.append(Q(tags__in=tags))

        combined_conditions = Q()
        for condition in conditions:
            combined_conditions &= condition

        if is_admin_or_faculty:
            targets_filter = Target.objects.filter(
                combined_conditions).distinct()
        else:
            targets_filter = Target.objects.filter(
                Q(user=request.user) & combined_conditions
            )

        results = self.paginator.paginate_queryset(targets_filter, request)
        serializer = TargetGetSerializer(results, many=True)
        return self.paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = TargetPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                serializer.save()
                return JsonResponse(serializer.data, status=201)
            except IntegrityError as e:
                if 'unique_target_name_per_user' in str(e):
                    return Response(
                        {'error': 'A target with this name already exists for this user.'},
                        status=400
                    )
                # Handle other integrity errors
                return Response(
                    {'error': 'Database integrity error occurred.'},
                    status=400
                )
        return Response(serializer.errors, status=400)

    @extend_schema(request=DeleteTargetSerializer,)
    def delete(self, request):
        serializer = DeleteTargetSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        try:
            target_ids = serializer.validated_data['target_ids']

            if request.user.role == User.roles.ADMIN:
                targets = Target.objects.filter(id__in=target_ids)
            else:
                targets = Target.objects.filter(
                    id__in=target_ids, user=request.user)

            deleted_count = targets.update(deleted_at=datetime.now())

            return Response({'message': f'{deleted_count} targets deleted successfully'}, status=200)
        except Exception as e:
            return Response({'error': f'Error deleting targets: {str(e)}'}, status=500)


@permission_classes((IsAuthenticated, IsActivated))
class TargetDetailView(APIView):
    @extend_schema(operation_id='Get Single Target')
    def get(self, request, pk):
        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            target = get_object_or_404(Target, pk=pk, deleted_at__isnull=True)
        else:
            target = get_object_or_404(
                Target, pk=pk, user=request.user, deleted_at__isnull=True)
        serializer = TargetGetSerializer(target)
        return Response(serializer.data, status=200)

    @extend_schema(operation_id='Delete Single Target')
    def delete(self, request, pk):
        if request.user.role in (User.roles.ADMIN, User.roles.FACULTY):
            target = get_object_or_404(Target, pk=pk, deleted_at__isnull=True)
        else:
            target = get_object_or_404(
                Target, pk=pk, user=request.user, deleted_at__isnull=True)
        target.deleted_at = datetime.now()
        target.save()
        return Response({'message': f'{target.name} deleted successfully'}, status=200)

    def put(self, request, pk):
        if pk is None:
            return Response(status=400)
        target = get_object_or_404(Target, pk=pk, user=request.user)
        serializer = TargetPostSerializer(
            target, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes((IsAuthenticated, IsActivated))
def targets_creation(request):
    def handle_uploads(file):
        file_extension = file.name.split('.')[-1]
        if file_extension == 'csv':
            return pd.read_csv(file)
        else:
            return HttpResponse("Invalid file type", status=400)
    if request.method == 'POST':
        try:
            uploaded_file = request.FILES['file']
            df = handle_uploads(uploaded_file)
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

    return HttpResponse("Invalid request method", status=400)


@api_view(['POST'])
@permission_classes((IsAuthenticated))
def get_moon_altaz(request):
    service = Visibility(lat=23.469444, lon=120.872639, height=2862)

    moon_altaz: TargetAltAz = service.get_moon_altaz(
        Time(request.data['start_time']),
        Time(request.data['end_time'])
    )

    serializer = TargetVisibilitySerializer(data=moon_altaz.to_dict())

    if serializer.is_valid():
        return Response(serializer.validated_data)
    else:
        return Response(serializer.errors, status=400)


def get_targets_altaz(targets: List[Target], start_time: str, end_time: str):
    service = Visibility(lat=23.469444, lon=120.872639, height=2862)

    targets_altaz: List[TargetAltAz] = service.get_targets_altaz(
        targets=targets,
        start_time=Time(start_time),
        end_time=Time(end_time)
    )

    data = [x.to_dict() for x in targets_altaz]

    serializer = TargetVisibilitySerializer(data=data, many=True)

    if serializer.is_valid():
        return serializer.data
    else:
        return Response(serializer.errors, status=400)


@extend_schema(request=None, responses=TargetSimbadDataSerializer)
@api_view(['GET'])
@permission_classes((IsAuthenticated, IsActivated))
def get_target_simbad(request, pk: int):
    service = SimbadService()
    target = Target.objects.get(id=pk)
    if target is None:
        return {"error": "Target not found."}

    astronomical_object = service.get_target(target.name)
    if astronomical_object is not None:
        serializer = TargetSimbadDataSerializer(
            data=astronomical_object.to_dict())
        if serializer.is_valid():
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({"error": "Target not found."}, status=404)


@extend_schema(request=None, responses=TargetSEDSerializer)
@api_view(['GET'])
@permission_classes((IsAuthenticated, IsActivated))
def get_target_SED(request, pk: int):
    # TODO: Implement Cache for SED data
    service = VizierService()
    target = Target.objects.get(id=pk)
    if target is None:
        return {"error": "Target not found."}
    sed = service.get_sed(target)
    serializer = TargetSEDSerializer(data=sed, many=True)
    if serializer.is_valid():
        return Response(serializer.data, status=200)
    else:
        return Response(serializer.errors, status=400)
