FROM ubuntu/python:3.12-24.04_edge

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt && \
    playwright install --with-deps

COPY . /app

WORKDIR /app/src/herndon_law_seo_helper

RUN python3 manage.py migrate --settings herndon_law_seo_helper.production_settings && \
    python3 manage.py collectstatic --no-input

CMD ["gunicorn", "herndon_law_seo_helper.wsgi:application", "--bind", "0.0.0.0:8000"]