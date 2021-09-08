from fastapi import Request
from celery import Celery
from os import environ


def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()


def get_celery(request: Request):
    try:
        celeryapp = Celery('tasks', broker=environ.get(
            'BROKER_URL', 'redis://:YORPAS99RDDaabvxvc3@localhost:6398/0'),
            backend=environ.get(
            'RESULT_BACKEND', 'redis://:YORPAS99RDDaabvxvc3@localhost:6398/1'))
        yield celeryapp
    finally:
        celeryapp.close()
