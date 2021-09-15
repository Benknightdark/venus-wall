from os import environ
from kombu import Exchange, Queue

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
max_tasks_per_child=1
prefetch_multiplier=1
acks_late= True
broker_pool_limit=None
task_acks_late = True
broker_heartbeat = 0
worker_prefetch_multiplier = 1