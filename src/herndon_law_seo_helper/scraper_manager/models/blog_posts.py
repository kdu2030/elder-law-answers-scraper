from django.db import models


class BlogPost(models.Model):
    source = models.IntegerField()
    date_posted = models.DateField()
    post_title = models.CharField(max_length=255)
