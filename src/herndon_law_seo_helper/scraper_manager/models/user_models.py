from django.db import models
from django.contrib.auth.models import User


class UserProfilePicture(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image_url = models.CharField(max_length=255)
    file_name = models.CharField(max_length=255)
