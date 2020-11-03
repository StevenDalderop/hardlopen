from django.contrib import admin
from .models import Session, Lap, Record

# Register your models here.
admin.site.register(Session)
admin.site.register(Lap)
admin.site.register(Record)