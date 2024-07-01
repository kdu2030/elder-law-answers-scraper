#! /bin/bash
playwright install

cd ./src/herndon_law_seo_helper

python3 manage.py migrate --settings herndon_law_seo_helper.production_settings
python3 manage.py collectstatic

gunicorn herndon_law_seo_helper.wsgi