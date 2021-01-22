from django.shortcuts import render, redirect
from rest_framework import viewsets, permissions, generics, status
from api.serializers import SessionSerializer, RecordSerializer, LapSerializer, MatchSerializer, TrainingSerializer
from app.models import Session, Record, Lap, Matches, Training
from rest_framework.request import Request
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().order_by('-timestamp')
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all().order_by('-timestamp')
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class MatchViewSet(viewsets.ModelViewSet):
    queryset = Matches.objects.all().order_by('-date')
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class LapViewSet(viewsets.ModelViewSet):
    queryset = Lap.objects.all().order_by('-timestamp')
    serializer_class = LapSerializer
    permission_classes = [permissions.IsAuthenticated]
    paginator = None

class SessionLapView(generics.ListAPIView):
    serializer_class = LapSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Lap.objects.filter(session_index=self.kwargs['id'])

class getSessionRecords(generics.ListAPIView):
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    paginator = None
    url_kwarg = 'id'

    def get(self, request, format=None, *arg, **kwargs):
        session_index = kwargs.get(self.url_kwarg)
        if session_index != None:
            session_records = Record.objects.filter(session_index=session_index).order_by('timestamp')
            if len(session_records) > 0:
                data = RecordSerializer(session_records, many=True, context={'request': request}).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Session Not Found': 'Invalid Session Index.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Session index paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class TrainingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, format=None):
        trainings = Training.objects.all()
        serializer = TrainingSerializer(trainings, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = TrainingSerializer(data=request.data)
        if serializer.is_valid():
            index = serializer.data.get("index")
            completed = serializer.data.get("completed")
            training = Training.objects.get(index=index)
            training.completed = completed
            training.save()
            return Response(TrainingSerializer(training).data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)