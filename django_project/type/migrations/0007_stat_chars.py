# Generated by Django 4.2.2 on 2023-07-10 18:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("type", "0006_stat_wpm_raw"),
    ]

    operations = [
        migrations.AddField(
            model_name="stat",
            name="chars",
            field=models.PositiveIntegerField(default=0),
        ),
    ]