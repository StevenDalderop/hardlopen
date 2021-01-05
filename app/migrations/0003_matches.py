# Generated by Django 3.1.2 on 2020-12-17 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20201023_1112'),
    ]

    operations = [
        migrations.CreateModel(
            name='Matches',
            fields=[
                ('index', models.BigIntegerField(blank=True, primary_key=True, serialize=False)),
                ('date', models.DateTimeField(blank=True, null=True)),
                ('distance', models.FloatField(blank=True, null=True)),
                ('time', models.TextField(blank=True, null=True)),
                ('name', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'match',
            },
        ),
    ]
