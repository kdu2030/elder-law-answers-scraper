#! /bin/bash
python3 manage.py migrate --settings herndon_law_seo_helper.production_settings
gunicorn herndon_law_seo_helper.wsgi:application --bind 0.0.0.0:$PORT