
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import httpx
DB_CONNECT_STRING='DB_CONNECT_STRING'
kubernetes_secrets=httpx.get('http://localhost:3500/v1.0/secrets/kubernetes/venuswallsecrets')
if kubernetes_secrets.status_code != 200:
    SQLALCHEMY_DATABASE_URL = os.getenv(DB_CONNECT_STRING)
else:
    SQLALCHEMY_DATABASE_URL = os.getenv(DB_CONNECT_STRING,kubernetes_secrets.json()[DB_CONNECT_STRING])   
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
