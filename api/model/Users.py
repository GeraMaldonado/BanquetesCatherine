from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4

ROLES = ["GERENTE", "CLIENTE", "ADMIN"]

class Users(db.Model): 
    __tablename__ = 'users'
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=True) 

    reservaciones = relationship("Reservaciones", back_populates="user")
    salon_gerencia = relationship("Salones", back_populates="gerente")


    def to_json(self):
        
        base_json = super().to_json()

        del base_json["password"]

        return base_json



    @staticmethod
    def login(user, password):

        try:
            
            result = Users.query.where(Users.email == user).one()

            if password == result.password:
                
                return result
        
            else:

                raise Exception("Contraseña incorrecta")


        except Exception as e:
            print(e)
            raise Exception(e)

        


