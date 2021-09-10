
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os 
SQLALCHEMY_DATABASE_URL =os.environ.get('DB_CONNECT_STRING', "mssql+pymssql://sa:YourStrong!Passw0rd@localhost:9487/jkf?charset=utf8") 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()