# Generated by Django 3.1.2 on 2020-10-22 09:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('index', models.BigIntegerField(blank=True, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(blank=True, null=True)),
                ('start_time', models.DateTimeField(blank=True, null=True)),
                ('start_position_lat', models.FloatField(blank=True, null=True)),
                ('start_position_long', models.FloatField(blank=True, null=True)),
                ('total_elapsed_time', models.FloatField(blank=True, null=True)),
                ('total_distance', models.FloatField(blank=True, null=True)),
                ('total_strides', models.FloatField(blank=True, null=True)),
                ('total_calories', models.FloatField(blank=True, null=True)),
                ('avg_speed', models.FloatField(blank=True, null=True)),
                ('avg_heart_rate', models.FloatField(blank=True, null=True)),
                ('max_heart_rate', models.FloatField(blank=True, null=True)),
                ('enhanced_avg_speed', models.FloatField(blank=True, null=True)),
                ('num_laps', models.FloatField(blank=True, null=True)),
                ('name', models.TextField(blank=True, null=True)),
                ('avg_running_cadence', models.FloatField(blank=True, null=True)),
                ('max_running_cadence', models.FloatField(blank=True, null=True)),
            ],
            options={
                'db_table': 'session',
            },
        ),
        migrations.CreateModel(
            name='Record',
            fields=[
                ('index', models.BigIntegerField(blank=True, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(blank=True, null=True)),
                ('position_lat', models.FloatField(blank=True, null=True)),
                ('position_long', models.FloatField(blank=True, null=True)),
                ('distance', models.FloatField(blank=True, null=True)),
                ('speed', models.FloatField(blank=True, null=True)),
                ('unknown', models.FloatField(blank=True, null=True)),
                ('heart_rate', models.FloatField(blank=True, null=True)),
                ('cadence', models.FloatField(blank=True, null=True)),
                ('enhanced_speed', models.FloatField(blank=True, null=True)),
                ('message', models.TextField(blank=True, db_column='Message', null=True)),
                ('name', models.TextField(blank=True, null=True)),
                ('session_index', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.session')),
            ],
            options={
                'db_table': 'record',
            },
        ),
        migrations.CreateModel(
            name='Lap',
            fields=[
                ('index', models.BigIntegerField(blank=True, primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField(blank=True, null=True)),
                ('start_time', models.DateTimeField(blank=True, null=True)),
                ('start_position_lat', models.FloatField(blank=True, null=True)),
                ('start_position_long', models.FloatField(blank=True, null=True)),
                ('end_position_lat', models.FloatField(blank=True, null=True)),
                ('end_position_long', models.FloatField(blank=True, null=True)),
                ('total_elapsed_time', models.FloatField(blank=True, null=True)),
                ('total_timer_time', models.FloatField(blank=True, null=True)),
                ('total_distance', models.FloatField(blank=True, null=True)),
                ('total_strides', models.FloatField(blank=True, null=True)),
                ('message_index', models.FloatField(blank=True, null=True)),
                ('total_calories', models.FloatField(blank=True, null=True)),
                ('avg_speed', models.FloatField(blank=True, null=True)),
                ('event', models.FloatField(blank=True, null=True)),
                ('event_type', models.FloatField(blank=True, null=True)),
                ('avg_heart_rate', models.FloatField(blank=True, null=True)),
                ('max_heart_rate', models.FloatField(blank=True, null=True)),
                ('lap_trigger', models.FloatField(blank=True, null=True)),
                ('sport', models.FloatField(blank=True, null=True)),
                ('enhanced_avg_speed', models.FloatField(blank=True, null=True)),
                ('message', models.TextField(blank=True, db_column='Message', null=True)),
                ('name', models.TextField(blank=True, null=True)),
                ('jaar', models.FloatField(blank=True, null=True)),
                ('maand', models.FloatField(blank=True, null=True)),
                ('week', models.FloatField(blank=True, null=True)),
                ('dag', models.FloatField(blank=True, null=True)),
                ('uur', models.FloatField(blank=True, null=True)),
                ('avg_running_cadence', models.FloatField(blank=True, null=True)),
                ('max_running_cadence', models.FloatField(blank=True, null=True)),
                ('session_index', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.session')),
            ],
            options={
                'db_table': 'lap',
            },
        ),
    ]
