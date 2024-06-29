from django.db import models
from enum import Enum


class SourceOptions(Enum):
    UNKNOWN = 0
    ELDER_LAW_ANSWERS = 1


class SourceConfiguration(models.Model):
    source = models.IntegerField(default=SourceOptions.UNKNOWN, blank=False)

    email = models.CharField(max_length=255)
    encrypted_password = models.CharField(max_length=255)
