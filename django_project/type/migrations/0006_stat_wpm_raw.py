# Generated by Django 4.2.2 on 2023-06-28 05:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("type", "0005_rename_stats_stat"),
    ]

    operations = [
        migrations.AddField(
            model_name="stat",
            name="wpm_raw",
            field=models.PositiveSmallIntegerField(default=0),
        ),
    ]
