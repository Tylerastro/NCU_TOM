import json
from typing import List

import pandas as pd
from astropy.time import Time
from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from helpers.models import Users
from helpers.paginator import Pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from targets.visibility import TargetAltAz, Visibility

from .models import Target
from .serializers import (TargetAltAzSerializer, TargetGetSerializer,
                          TargetPostSerializer, TargetSEDSerializer,
                          TargetSimbadDataSerializer)
from .simbad import SimbadService
from .vizier import VizierService


class TargetsView(APIView):
    serializer_class = TargetPostSerializer
    paginator = Pagination()

    def get(self, request):
        target_id = request.query_params.get('target_id')

        is_admin_or_faculty = request.user.role in (
            Users.roles.ADMIN, Users.roles.FACULTY
        )
        if target_id:
            target_filter = {} if is_admin_or_faculty else {'user': request.user}
            target_filter['deleted_at__isnull'] = True
            target = get_object_or_404(Target, id=target_id, **target_filter)
            serializer = TargetGetSerializer(target)
            return Response(serializer.data, status=200)
        else:
            conditions = []
            conditions.append(Q(deleted_at__isnull=True))

            name = request.query_params.get('name')
            if name:
                conditions.append(Q(name__icontains=name))

            combined_conditions = Q()
            for condition in conditions:
                combined_conditions &= condition

            if request.user.role in (Users.roles.ADMIN, Users.roles.FACULTY):
                targets_filter = Target.objects.filter(combined_conditions)
            else:
                targets_filter = Target.objects.filter(
                    Q(user=request.user) & combined_conditions
                )

            results = self.paginator.paginate_queryset(targets_filter, request)
            serializer = TargetGetSerializer(results, many=True)
            return self.paginator.get_paginated_response(serializer.data)

    def post(self, request):
        serializer = TargetPostSerializer(
            data=request.data,  context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return Response(serializer.errors, status=400)

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
@permission_classes((IsAuthenticated, ))
def BulkTargetCreation(request):
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


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def DeleteTarget(request, target_id):
    try:
        target = Target.objects.get(id=target_id, user=request.user)
        target.delete()
        return JsonResponse({'message': 'Target deleted successfully'})
    except Target.DoesNotExist:
        return JsonResponse({'error': 'Target not found'}, status=404)
    except Exception:
        return JsonResponse({'error': 'Error deleting target'}, status=500)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def DeleteBulkTargets(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            target_ids = data.get('target_ids', [])
            target_ids = [int(target_id) for target_id in target_ids]
            if request.user.role == Users.roles.ADMIN:
                targets = Target.objects.filter(id__in=target_ids)
            else:
                targets = Target.objects.filter(
                    id__in=target_ids, user=request.user)
            for target in targets:
                target.delete()
            return JsonResponse({'message': 'Targets deleted successfully'})
        except Exception as e:
            return JsonResponse({'error': f'Error deleting targets: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['POST'])
def GetMoonAltAz(request):
    service = Visibility(lat=23.469444, lon=120.872639)

    moon_altaz: TargetAltAz = service.get_moon_altaz(
        Time(request.data['start_time']),
        Time(request.data['end_time'])
    )

    serializer = TargetAltAzSerializer(data=moon_altaz.to_dict())

    if serializer.is_valid():
        return Response(serializer.validated_data)
    else:
        return Response(serializer.errors, status=400)


def GetTargetsAltAz(targets: List[Target], start_time: str, end_time: str):
    service = Visibility(lat=23.469444, lon=120.872639)

    targets_altaz: List[TargetAltAz] = service.get_targets_altaz(
        targets=targets,
        start_time=Time(start_time),
        end_time=Time(end_time)
    )

    data = [x.to_dict() for x in targets_altaz]

    serializer = TargetAltAzSerializer(data=data, many=True)

    if serializer.is_valid():
        return serializer.data
    else:
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetTargetSimbad(request, pk: int):
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


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def GetTargetSED(request, pk: int):
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
