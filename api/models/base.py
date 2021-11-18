
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os 

SQLALCHEMY_DATABASE_URL =os.environ.get('DB_CONNECT_STRING',f'mssql+pymssql://sa:MyC0m9l&xPbbssw0rd@mssql-deployment/beauty_wall?charset=utf8')
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()