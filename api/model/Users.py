from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4

class Users(db.Model): 
    __tablename__ = 'users'
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False) 

    reservaciones = relationship("Reservaciones", back_populates="user")
    salon_gerencia = relationship("Salones", back_populates="gerente")
