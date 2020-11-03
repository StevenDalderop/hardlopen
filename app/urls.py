from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'sessions', views.SessionViewSet)
router.register(r'records', views.RecordViewSet)
router.register(r'laps', views.LapViewSet)


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("<int:id>", views.record, name="record"),
    path('api/', include(router.urls)),
    path('api/sessions/<int:id>/laps', views.api_session_lap, name="session_lap"),
    path('api/sessions/<int:id>/records', views.api_session_record, name="session_record"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]