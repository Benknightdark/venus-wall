
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import httpx
# 'mssql+pymssql://sa:MyC0m9l&xPbbssw0rd@mssql-deployment/beauty_wall?charset=utf8'
SQLALCHEMY_DATABASE_URL = os.environ.get('DB_CONNECT_STRING', httpx.get(
    'http://localhost:3500/v1.0/secrets/kubernetes/venuswallsecrets').json()['DB_CONNECT_STRING'])
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
