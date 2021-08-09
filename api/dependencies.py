from fastapi import  Request

def get_db(request: Request):
    try:
        db = request.state.db
        yield db
    finally:
        db.close()