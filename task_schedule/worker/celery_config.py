from os import environ

broker_url = environ.get(
    'BROKER_URL', 'redis://:YORPAS99RDDaabvxvc3@localhost:6398/0')
celery_result_backend = environ.get(
    'RESULT_BACKEND', 'redis://:YORPAS99RDDaabvxvc3@localhost:6398/1')
timezone = 'Asia/Taipei'
task_serializer = 'json'
worker_send_task_events = True
