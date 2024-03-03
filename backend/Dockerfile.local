FROM python:3.11

WORKDIR /app

COPY . /app/
RUN pip install -r requirements.txt

CMD python manage.py makemigrations && \
    python manage.py migrate --noinput && \
    gunicorn tom.wsgi:application

