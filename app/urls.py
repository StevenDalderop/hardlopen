from django.urls import path
from . import views

urlpatterns = [    
    path("", views.index, name="index"),
    path("wedstrijden", views.index, name="matches"),
    path("schema", views.index, name="schedule"),
    path("session/<int:id>", views.index, name="session"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
] 