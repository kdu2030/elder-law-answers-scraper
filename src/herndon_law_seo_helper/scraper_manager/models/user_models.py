from django.db import models
from django.contrib.auth.models import User
from enum import Enum


class PermissionCode(Enum):
    VIEW_ADMIN = 1
    EDIT_WEBSITE_CONFIG = 2


class UserPermissionCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission_code = models.IntegerField()


class UserProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image_url = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
