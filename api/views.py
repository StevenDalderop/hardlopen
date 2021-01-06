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
            serializer.save()    
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, format=None):
        training_id = request.data.get("training_id")
        if training_id != None:
            training_results = Training.objects.filter(training_id=training_id)
            if len(training_results) > 0:
                training = training_results[0]
                training.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'Bad Request': 'Invalid Training Id'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Invalid delete data, did not find a training id'}, status=status.HTTP_400_BAD_REQUEST)
        



@login_required 
def completed_training(request):
    if request.method == "POST":
        checked = request.POST
        training_id = list(checked.keys())[1]
        voltooid = int(checked[training_id][0])
        if not Training.objects.filter(training_id=training_id) and voltooid:
            t = Training(training_id = training_id)
            t.save()
        elif Training.objects.filter(training_id=training_id) and not voltooid:
            t = Training.objects.filter(training_id=training_id)[0]
            t.delete()        
        return redirect(reverse("schedule"))
    elif request.method == "GET":
        trainings = Training.objects.all() 
        res = []
        for t in trainings:
            res.append(t.training_id)
        return JsonResponse(res, safe=False) 