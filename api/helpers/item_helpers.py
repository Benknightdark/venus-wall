from sqlalchemy.orm.session import Session
from models import models, base, view_models

class WebPageFilter:
    def __init__(self, id):
        self.id = id

    def get_id(self,db: Session):
        return db.query(models.WebPage).filter(
            models.WebPage.ID == self.id).first()
