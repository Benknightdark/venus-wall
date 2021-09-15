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


# task_exchange = Exchange('mdk_worker', type='direct')
# task_create_missing_queues = False
# task_queues = [
#     Queue('mdk_worker', task_exchange, routing_key='mdk_worker'),
# ]
# task_routes = {
#     'mdk_worker.update_item': {'queue': 'mdk_worker', 'routing_key': 'mdk_worker'}
# }
