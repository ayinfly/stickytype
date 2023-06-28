from django.db import models
# from django.utils import timezone
from django.contrib.auth.models import User

VALID_KEYS = "qwertyuiopasdfghjklzxcvbnm"

class Stat(models.Model):
    # user who took test
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    # total wpm
    wpm_total = models.PositiveSmallIntegerField(default=0)

    # time the test was taken
    time = models.DateTimeField(auto_now_add=True)

    # accuracy of your typing
    accuracy = models.PositiveSmallIntegerField(default=0)

    # mode used when typing
    mode = models.CharField(max_length=20, default='')

    # string representation
    def __str__(self):
        return str(self.author) + ": " + str(self.time)

for val in VALID_KEYS:
    Stat.add_to_class("wpm_"+val, models.PositiveSmallIntegerField(default=0))