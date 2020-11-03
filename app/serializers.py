from app.models import Session, Record, Lap
from rest_framework import serializers

class SessionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Session 
        col_names = [field.name for field in Session._meta.get_fields()]
        col_names.remove('start_position_lat')
        col_names.remove('start_position_long')
        col_names.remove('lap')
        col_names.remove('record')
        fields = col_names

class RecordSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Record 
        fields = ['url', 'position_lat', 'position_long', 'heart_rate', 'speed', 'timestamp']
        

class LapSerializer(serializers.HyperlinkedModelSerializer):  
    class Meta:
        model = Lap
        fields = ['url', 'timestamp', 'total_elapsed_time', 'total_distance', 'avg_speed']
        
