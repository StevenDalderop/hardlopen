from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.urls import reverse

# Create your views here. 
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
def index(request, *args, **kwargs):
    return render(request, "frontend/index.html")        

@login_required
def logout_view(request):
    logout(request)
    return render(request, "frontend/login.html", {"message": "Logged out."})
