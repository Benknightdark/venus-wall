from os import environ
broker_url = environ.get('BROKER_URL')
celery_result_backend = environ.get('RESULT_BACKEND')
timezone = 'Asia/Taipei'
task_serializer = 'json'
worker_send_task_events = True
result_persistent = True
create_missing_queues = True
max_tasks_per_child = 1
prefetch_multiplier = 1
acks_late = True
broker_pool_limit = None
task_acks_late = True
broker_heartbeat = 0
worker_prefetch_multiplier = 1
