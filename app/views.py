from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from app.serializers import SessionSerializer, RecordSerializer, LapSerializer
from app.models import Session, Record, Lap
from rest_framework.request import Request

# Create your views here. 
def index(request):
    if not request.user.is_authenticated:
        return render(request, "app/login.html", {"message": None})
    else: 
        return render(request, "app/index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "app/login.html", {"message": "Invalid credentials."})
    else:
        return render(request, "app/login.html")

@login_required
def logout_view(request):
    logout(request)
    return render(request, "app/login.html", {"message": "Logged out."})

@login_required
def record(request, id):
    try:
        Session.objects.get(pk=id)
    except Session.DoesNotExist:
        raise Http404("Session does not exist")
    return render(request, "app/record.html", {"id": id})

@login_required
def api_session_lap(request, id):
    laps = Lap.objects.filter(session_index=id)
    serializer = LapSerializer(laps, many=True, context={'request': Request(request)})
    return JsonResponse(serializer.data, safe=False)

@login_required   
def api_session_record(request, id):
    records = Record.objects.filter(session_index=id).order_by('timestamp')
    serializer = RecordSerializer(records, many=True, context={'request': Request(request)})
    return JsonResponse(serializer.data, safe=False)

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all().order_by('-timestamp')
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecordViewSet(viewsets.ModelViewSet):
    queryset = Record.objects.all().order_by('-timestamp')
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class LapViewSet(viewsets.ModelViewSet):
    queryset = Lap.objects.all().order_by('-timestamp')
    serializer_class = LapSerializer
    permission_classes = [permissions.IsAuthenticated]
    paginator = None