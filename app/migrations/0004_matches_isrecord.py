# Generated by Django 3.1.2 on 2020-12-17 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_matches'),
    ]

    operations = [
        migrations.AddField(
            model_name='matches',
            name='isRecord',
            field=models.BooleanField(default=False),
        ),
    ]