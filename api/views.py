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

class SessionRecordView(generics.ListAPIView):
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    paginator = None
    
    def get_queryset(self):
        return Record.objects.filter(session_index=self.kwargs['id']).order_by('-timestamp')

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