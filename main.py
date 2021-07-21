from typing import List
from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy.orm import Session, joinedload, lazyload, selectinload
from models import models,base
import uuid
models.base.Base.metadata.create_all(bind=base.engine)

app = FastAPI()
@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    response = Response("Internal server error", status_code=500)
    try:
        request.state.db = base.SessionLocal()
        response = await call_next(request)
    finally:
        request.state.db.close()
    return response

def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()




# @app.get("/")
# async def read_users( db: Session = Depends(get_db)):
#     return db.query(models.Product).options(joinedload(models.Product.Cart)).all()
@app.post("/api/webpage")
async def add_web_apge( db: Session = Depends(get_db)):
    return str(uuid.uuid1())