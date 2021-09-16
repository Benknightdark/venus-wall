
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import session, sessionmaker
import os 

SQLALCHEMY_DATABASE_URL =os.environ.get('DB_CONNECT_STRING', "mssql+pymssql://sa:YourStrong!Passw0rd@localhost:9487/beauty_wall?charset=utf8") 
print(SQLALCHEMY_DATABASE_URL)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,echo=False,pool_size=0,
                       max_overflow=-1,
                       pool_timeout=30,
                       pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()