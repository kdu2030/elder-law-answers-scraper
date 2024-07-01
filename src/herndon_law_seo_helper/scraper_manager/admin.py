from django.contrib import admin
from scraper_manager.models.setting_models import SourceConfiguration
from scraper_manager.models.blog_posts import BlogPost

# Register your models here.

admin.site.register(SourceConfiguration)
admin.site.register(BlogPost)
