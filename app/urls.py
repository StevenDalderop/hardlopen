from django.urls import path
from . import views

urlpatterns = [    
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("wedstrijden", views.match, name="matches"),
    path("schema", views.schema, name="schedule"),
    path("<int:id>", views.record, name="record"),
] 