from django.contrib import admin
from .models import Session, Lap, Record, Training, Matches

# Register your models here.
admin.site.register(Session)
admin.site.register(Lap)
admin.site.register(Record)
admin.site.register(Training)
admin.site.register(Matches)