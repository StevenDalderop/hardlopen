# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Session(models.Model):
    index = models.BigIntegerField(blank=True, primary_key=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    start_position_lat = models.FloatField(blank=True, null=True)
    start_position_long = models.FloatField(blank=True, null=True)
    total_elapsed_time = models.FloatField(blank=True, null=True)
    total_distance = models.FloatField(blank=True, null=True)
    total_strides = models.FloatField(blank=True, null=True)
    total_calories = models.FloatField(blank=True, null=True)
    avg_speed = models.FloatField(blank=True, null=True)
    avg_heart_rate = models.FloatField(blank=True, null=True)
    max_heart_rate = models.FloatField(blank=True, null=True)
    enhanced_avg_speed = models.FloatField(blank=True, null=True)
    num_laps = models.FloatField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    avg_running_cadence = models.FloatField(blank=True, null=True)
    max_running_cadence = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'session'
        indexes = [
            models.Index(fields=['index']),
        ]

class Lap(models.Model):
    index = models.BigIntegerField(blank=True, primary_key=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    start_time = models.DateTimeField(blank=True, null=True)
    start_position_lat = models.FloatField(blank=True, null=True)
    start_position_long = models.FloatField(blank=True, null=True)
    end_position_lat = models.FloatField(blank=True, null=True)
    end_position_long = models.FloatField(blank=True, null=True)
    total_elapsed_time = models.FloatField(blank=True, null=True)
    total_timer_time = models.FloatField(blank=True, null=True)
    total_distance = models.FloatField(blank=True, null=True)
    total_strides = models.FloatField(blank=True, null=True)
    message_index = models.FloatField(blank=True, null=True)
    total_calories = models.FloatField(blank=True, null=True)
    avg_speed = models.FloatField(blank=True, null=True)
    event = models.FloatField(blank=True, null=True)
    event_type = models.FloatField(blank=True, null=True)
    avg_heart_rate = models.FloatField(blank=True, null=True)
    max_heart_rate = models.FloatField(blank=True, null=True)
    lap_trigger = models.FloatField(blank=True, null=True)
    sport = models.FloatField(blank=True, null=True)
    enhanced_avg_speed = models.FloatField(blank=True, null=True)
    message = models.TextField(db_column='Message', blank=True, null=True)  # Field name made lowercase.
    name = models.TextField(blank=True, null=True)
    jaar = models.FloatField(blank=True, null=True)
    maand = models.FloatField(blank=True, null=True)
    week = models.FloatField(blank=True, null=True)
    dag = models.FloatField(blank=True, null=True)
    uur = models.FloatField(blank=True, null=True)
    avg_running_cadence = models.FloatField(blank=True, null=True)
    max_running_cadence = models.FloatField(blank=True, null=True)
    session_index = models.ForeignKey(Session, on_delete=models.CASCADE)

    class Meta:
        db_table = 'lap'


class Record(models.Model):
    index = models.BigIntegerField(blank=True, primary_key=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    position_lat = models.FloatField(blank=True, null=True)
    position_long = models.FloatField(blank=True, null=True)
    distance = models.FloatField(blank=True, null=True)
    speed = models.FloatField(blank=True, null=True)
    unknown = models.FloatField(blank=True, null=True)
    heart_rate = models.FloatField(blank=True, null=True)
    cadence = models.FloatField(blank=True, null=True)
    enhanced_speed = models.FloatField(blank=True, null=True)
    message = models.TextField(db_column='Message', blank=True, null=True)  # Field name made lowercase.
    name = models.TextField(blank=True, null=True)
    session_index = models.ForeignKey(Session, on_delete=models.CASCADE)
    
    class Meta:
        db_table = 'record'


