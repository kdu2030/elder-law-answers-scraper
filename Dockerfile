FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y python3-pip python3-dev libpq-dev build-essential

# WORKDIR /.adaptable
# COPY .adaptable /.adaptable

WORKDIR /app
COPY requirements.txt /app

RUN pip install -r requirements.txt && \
    playwright install chromium --with-deps

COPY . /app

WORKDIR /app/src/herndon_law_seo_helper

RUN python3 manage.py collectstatic --no-input

EXPOSE ${PORT}

CMD chmod +x start_script.sh && ./start_script.sh