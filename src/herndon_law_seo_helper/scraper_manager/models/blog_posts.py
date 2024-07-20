from django.db import models


class BlogPost(models.Model):
    date_posted = models.DateField()
    post_title = models.CharField(max_length=255)


class PostFailureLog(models.Model):
    date_attempted = models.DateField()
    error_code = models.IntegerField()
    exception = models.TextField(blank=True)
