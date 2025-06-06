from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
  
  def to_json(self):

    return {c.name: getattr(self, c.name) for c in self.__table__.columns}



db = SQLAlchemy(model_class=Base)
