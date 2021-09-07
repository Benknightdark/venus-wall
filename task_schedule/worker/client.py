# import time
# from tasks import add
 
# # 不要直接add(4, 4)，這裡需要用 celery 提供的介面 delay 進行呼叫
# result = add.delay(6, 6)
# print(result.id)
# while not result.ready():
#     time.sleep(1)
# print('task done: {0}'.format(result.get()))

from celery import signature
callback=signature('tasks.add', args=(2, 2), countdown=10)
print(callback.apply_async())