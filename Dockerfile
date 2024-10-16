FROM python:3.11

WORKDIR /app
COPY requirements.txt /app

RUN curl https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg

RUN apt update && apt install -y unixodbc && ACCEPT_EULA=Y apt install -y msodbcsql17
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install -r requirements.txt

COPY . /app

WORKDIR /app/src/herndon_law_seo_helper

RUN python3 manage.py collectstatic --no-input

EXPOSE ${PORT}

CMD python3 manage.py migrate --settings herndon_law_seo_helper.production_settings && \
    gunicorn herndon_law_seo_helper.wsgi:application --bind 0.0.0.0:$PORT