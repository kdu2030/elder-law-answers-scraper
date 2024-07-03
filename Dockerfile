FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y python3-pip python3-dev libpq-dev build-essential

WORKDIR /app

COPY requirements.txt /app

RUN pip install -r requirements.txt && \
    playwright install --with-deps

COPY . /app

WORKDIR /app/src/herndon_law_seo_helper

RUN python3 manage.py migrate --settings herndon_law_seo_helper.production_settings && \
    python3 manage.py collectstatic --no-input

EXPOSE 8000

CMD ["gunicorn", "herndon_law_seo_helper.wsgi:application", "--bind", "0.0.0.0:8000"]