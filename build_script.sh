#! /bin/bash

pip install -r requirements.txt
playwright install

cd ./src/herndon_law_seo_helper
python3 manage.py migrate