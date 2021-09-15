from os import environ

broker_url = environ.get(
    'BROKER_URL', 'pyamqp://rabbitmq:rabbitmq@localhost:5672//')
# amqp://rabbitmq:rabbitmq@localhost:5672/
# redis://:YORPAS99RDDaabvxvc3@localhost:6398/0
celery_result_backend = environ.get(
    'RESULT_BACKEND', 'redis://:YORPAS99RDDaabvxvc3@localhost:6398/1')
timezone = 'Asia/Taipei'
task_serializer = 'json'
worker_send_task_events = True
result_persistent = True
create_missing_queues=True
