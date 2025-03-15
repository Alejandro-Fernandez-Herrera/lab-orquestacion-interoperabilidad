FROM python:3

ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
RUN pip install --upgrade pip setuptools
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/
ARG URL=0.0.0.0:4000
CMD ["sh", "-c", "sleep 15 && python manage.py makemigrations supermarket_ms && python manage.py migrate && python manage.py runserver $URL"]
