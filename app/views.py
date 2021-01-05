from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from app.models import Session
from django.contrib.auth.models import User

# Create your views here. 
def index(request):
    if not request.user.is_authenticated:
        return render(request, "frontend/login.html", {"message": None})
    else: 
        return render(request, "frontend/index.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "frontend/login.html", {"message": "Invalid credentials."})
    else:
        return render(request, "frontend/login.html")      

@login_required
def match(request):
    return render(request, "frontend/matches.html")

@login_required
def logout_view(request):
    logout(request)
    return render(request, "frontend/login.html", {"message": "Logged out."})

@login_required
def record(request, id):
    try:
        Session.objects.get(pk=id)
    except Session.DoesNotExist:
        raise Http404("Session does not exist")
    return render(request, "frontend/record.html", {"id": id})

@login_required
def schema(request):
    return render(request, "frontend/schema.html")
 

