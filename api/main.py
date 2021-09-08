from dependencies import get_celery
import celery
from routers import forum, webpage, item, user, image
from fastapi import FastAPI, Request, Response, status
from models import models, base
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.params import Depends


models.base.Base.metadata.create_all(bind=base.engine)
app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    print(f"OMG! An HTTP error!: {repr(exc)}")
    return await http_exception_handler(request, exc)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"OMG! The client sent invalid data!: {exc}")
    return await request_validation_exception_handler(request, exc)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = base.SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


app.include_router(webpage.router, prefix="/api", tags=['看版'])
app.include_router(item.router, prefix="/api", tags=['看版項目'])
app.include_router(image.router, prefix="/api", tags=['項目圖片'])
app.include_router(user.router, prefix="/api", tags=['使用者'])
app.include_router(forum.router, prefix="/api", tags=['論壇'])


@app.get("/test", summary="test ")
async def add_web_apge(celery_app: celery = Depends(get_celery) ):
    r = celery_app.send_task('tasks.add', args=(1, 2))
    print(r)
    r2 = celery_app.send_task('tasks.echo')
    print(r2)
    return {'data':[str(r),str(r2)]}
