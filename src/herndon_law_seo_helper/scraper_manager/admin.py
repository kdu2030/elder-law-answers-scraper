from django.contrib import admin
from scraper_manager.models.setting_models import SourceConfiguration, WebsiteConfiguration
from scraper_manager.models.blog_posts import BlogPost, PostFailureLog
from scraper_manager.models.user_models import UserProfilePicture, UserPermissionCode

# Register your models here.

admin.site.register(SourceConfiguration)
admin.site.register(BlogPost)
admin.site.register(WebsiteConfiguration)
admin.site.register(UserProfilePicture)
admin.site.register(PostFailureLog)
admin.site.register(UserPermissionCode)
