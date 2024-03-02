import json
from typing import List

import pandas as pd
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from helpers.models import Comments, Users
from observations.lulin import LulinScheduler
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from targets.serializers import AltAzDataSerializer, TargetAltAzSerializer
from targets.views import GetTargetsAltAz
from targets.visibility import TargetAltAz

from .models import Lulin, Observation, Target
from .serializers import (LulinGetSerializer, LulinPutSerializer,
                          ObservationGetSerializer, ObservationPostSerializer,
                          ObservationPutSerializer, TargetGetSerializer)


class ObservationsView(APIView):
    serializer_class = ObservationGetSerializer

    def get(self, request):
        observation_id = request.query_params.get('observation_id')
        if observation_id:
            observation = get_object_or_404(
                Observation, id=observation_id, user=request.user)
            serializer = ObservationGetSerializer(observation)
            return Response(serializer.data, status=200)
        else:
            observaiotns = Observation.objects.filter(user=request.user)
            serializer = ObservationGetSerializer(observaiotns, many=True)
            return Response(serializer.data, status=200)

    def post(self, request):
        serializer = ObservationPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        observation = get_object_or_404(Observation, pk=pk, user=request.user)
        serializer = ObservationPutSerializer(
            observation, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def DeleteObservation(request, pk):
    if request.method == 'POST':
        try:
            observation = Observation.objects.get(id=pk)
            if observation.user != request.user:
                return JsonResponse({'error': 'Unauthorized'}, status=401)
            observation.delete()
            return JsonResponse({'message': 'Observation deleted successfully'})
        except Observation.DoesNotExist:
            return JsonResponse({'error': 'Observation not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting Observation: {str(e)}'}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


class LulinView(APIView):
    serializer_class = LulinGetSerializer

    def get(self, request, pk):
        observations = Lulin.objects.filter(observation__id=pk, observation__user=request.user).select_related(
            'observation', 'observation__user')

        serializer = LulinGetSerializer(observations, many=True)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        lulin_instance = get_object_or_404(Lulin, pk=pk)
        serializer = LulinPutSerializer(
            lulin_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_BAD_REQUEST)


@permission_classes((IsAuthenticated, ))
class CodeView(APIView):
    def get(self, request, id):
        service = LulinScheduler()
        try:
            lulin = Observation.objects.get(id=id, user=request.user)
        except Observation.DoesNotExist:
            return Response({"detail": "Observation not found"}, status=status.HTTP_404_NOT_FOUND)

        code = service.gen_code(observation_id=id)
        lulin.code = code
        lulin.save()
        return HttpResponse(code, content_type='text/plain')


@api_view(['POST'])
def GetObservationAltAz(request, pk):
    observations = Lulin.objects.filter(observation__id=pk, observation__user=request.user).select_related(
        'observation', 'observation__user')
    targets = [x.target for x in observations]

    data: List[TargetAltAz] = GetTargetsAltAz(
        targets, request.data['start_time'], request.data['end_time'])

    return JsonResponse(data, safe=False)


class ObservationMessagesView(APIView):
    serializer_class = ObservationGetSerializer

    def get(self, request, pk):
        observation = get_object_or_404(
            Observation, id=pk, user=request.user)
        serializer = ObservationGetSerializer(observation)
        return Response(serializer.data, status=200)

    def post(self, request, pk):
        observation = get_object_or_404(Observation, pk=pk, user=request.user)
        if observation:
            comment = Comments.objects.create(
                user=request.user,
                context=request.data['message'],
            )
            observation.comments.add(comment)
            observation.save()
            serializer = ObservationGetSerializer(observation)
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)
