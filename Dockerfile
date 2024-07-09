FROM python:3.11

WORKDIR /.adaptable
COPY .adaptable /.adaptable

WORKDIR /app
COPY requirements.txt /app

RUN pip install -r requirements.txt

COPY . /app

WORKDIR /app/src/herndon_law_seo_helper

RUN python3 manage.py collectstatic --no-input

EXPOSE ${PORT}

CMD python3 manage.py migrate --settings herndon_law_seo_helper.production_settings && \
    gunicorn herndon_law_seo_helper.wsgi:application --bind 0.0.0.0:$PORT