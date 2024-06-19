"""
WSGI config for herndon_law_seo_helper project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'herndon_law_seo_helper.production_settings')

application = get_wsgi_application()
application = WhiteNoise(application, root=settings.STATIC_ROOT)
