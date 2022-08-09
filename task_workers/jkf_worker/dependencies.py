from fastapi import Request
from dapr_httpx.pubsub_api import PubSubApi
from dapr_httpx.state_api import StateApi


def pubsub_service(request: Request):

    yield PubSubApi(end_point_name="pubsub")


def state_service(request: Request):

    yield StateApi(end_point_name="statestore")