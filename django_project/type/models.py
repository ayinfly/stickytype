from django.db import models
# from django.utils import timezone
from django.contrib.auth.models import User

VALID_KEYS = "qwertyuiopasdfghjklzxcvbnm"

class Stats(models.Model):
    # user who took test
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    # total wpm
    wpm_total = models.PositiveSmallIntegerField(default=0)

    # time the test was taken
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.author) + ": " + str(self.time)

for val in VALID_KEYS:
    Stats.add_to_class("wpm_"+val, models.PositiveSmallIntegerField(default=0))