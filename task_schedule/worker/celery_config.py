from os import environ

broker_url = environ['BROKER_URL']
celery_result_backend = environ['RESULT_BACKEND']
timezone='Asia/Taipei'
task_serializer='json'