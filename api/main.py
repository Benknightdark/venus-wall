from routers import webpage, item, user, image
from fastapi import FastAPI, Request, Response
from models import models, base
from fastapi.middleware.cors import CORSMiddleware
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


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = base.SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response


app.include_router(webpage.router, prefix="/api")
app.include_router(item.router, prefix="/api")
app.include_router(image.router, prefix="/api")

app.include_router(user.router, prefix="/api")
