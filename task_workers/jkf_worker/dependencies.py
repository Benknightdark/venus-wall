from fastapi import Request
from dapr_httpx.pubsub_api import PubSubApi


def pubsub_service(request: Request):

    yield PubSubApi(end_point_name="pubsub")
