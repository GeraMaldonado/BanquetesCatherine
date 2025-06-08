from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
  
  def to_json(self):

    return {c.name: getattr(self, c.name) for c in self.__table__.columns}
  
  def update(self, **kwargs):

    for key, value in kwargs.items():
      setattr(self, key, value)





db = SQLAlchemy(model_class=Base)



def add(instance):

  db.session.add(instance)

  commit()


def delete(instance):

  db.session.delete(instance)

  commit()


def find_by_id(entity, id):

  result = db.session.query(entity).filter_by(id=id).first()

  return result


def query(entity, **kwargs):

  result = db.session.query(entity).filter_by(**kwargs).all()

  return result





def commit():

  db.session.commit()
