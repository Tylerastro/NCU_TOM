from datetime import datetime
from typing import List

from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from helpers.models import Comments, Users
from observations.lulin import LulinScheduler
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from targets.views import GetTargetsAltAz
from targets.visibility import TargetAltAz

from .models import Lulin, Observation
from .serializers import (LulinGetSerializer, LulinPutSerializer,
                          ObservationGetSerializer, ObservationPostSerializer,
                          ObservationPutSerializer)


class ObservationsView(APIView):
    serializer_class = ObservationGetSerializer

    def get(self, request):
        conditions = []
        observation_id = request.query_params.get('observation_id')
        observatory = request.query_params.get('observatory')
        status = request.query_params.get('status')

        if observation_id:
            conditions.append(Q(id=observation_id))
        if observatory:
            conditions.append(Q(observatory=observatory))
        if status:
            conditions.append(Q(status=status))

        combined_conditions = Q()
        for condition in conditions:
            combined_conditions &= condition

        if request.user.role in (Users.roles.ADMIN, Users.roles.FACULTY):
            observations = Observation.objects.filter(
                combined_conditions
            )
        else:
            observations = Observation.objects.filter(
                Q(user=request.user) & combined_conditions
            )
        serializer = ObservationGetSerializer(observations, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = ObservationPostSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request, pk):
        if request.user.role in (Users.roles.ADMIN, Users.roles.FACULTY):
            observation = get_object_or_404(Observation, pk=pk)
        else:
            observation = get_object_or_404(
                Observation, pk=pk, user=request.user)
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

        if request.user.role in (Users.roles.ADMIN, Users.roles.FACULTY):
            observations = Lulin.objects.filter(
                combined_conditions
            )
            if pk:
                observations = observations.filter(observation__id=pk).select_related(
                    'observation')
        else:
            observations = Lulin.objects.filter(
                Q(observation__user=request.user) & combined_conditions
            )
            if pk:
                observations = observations.filter(observation__id=pk).select_related(
                    'observation', 'observation__user')

        serializer = LulinGetSerializer(observations, many=True)
        return Response(serializer.data, status=200)

    def put(self, request, pk):
        lulin_instance = get_object_or_404(Lulin, pk=pk)
        serializer = LulinPutSerializer(
            lulin_instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)


@permission_classes((IsAuthenticated, ))
class CodeView(APIView):
    def get(self, request, id):
        service = LulinScheduler()

        try:
            if request.user in (Users.roles.ADMIN, Users.roles.FACULTY):
                lulin = Observation.objects.get(id=id)
            else:
                lulin = Observation.objects.get(id=id, user=request.user)
        except Observation.DoesNotExist:
            return Response({"detail": "Observation not found"}, status=404)

        refresh = request.query_params.get('refresh')
        if refresh == 'true' or not lulin.code:
            code = service.gen_code(observation_id=id)
            return HttpResponse(code, content_type='text/plain')
        else:
            return HttpResponse(lulin.code, content_type='text/plain')


@api_view(['GET'])
def GetCodes(request):
    if request.user.role not in (Users.roles.ADMIN, Users.roles.FACULTY):
        return Response({"detail": "Unauthorized"}, status=401)

    service = LulinScheduler()
    print(request.data)
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    if all([not start_date, not end_date]):
        return Response({"detail": "start_date and end_date are required"}, status=400)

    if start_date:
        start_date = datetime.strptime(start_date, '%Y-%m-%d')
    if end_date:
        end_date = datetime.strptime(end_date, '%Y-%m-%d')

    return HttpResponse(service.get_codes(
        start_date, end_date), content_type='text/plain')


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
                context=request.data,
            )
            observation.comments.add(comment)
            observation.save()
            serializer = ObservationGetSerializer(observation)
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)
