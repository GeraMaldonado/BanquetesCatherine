from sqlalchemy import Integer, String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4

class Salones(db.Model):
    __tablename__ = 'salones' 
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: uuid4().hex)
    
    gerente_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) 
    costoRenta: Mapped[float] = mapped_column(Float, nullable=False)
    capacidadMaxima: Mapped[int] = mapped_column(Integer, nullable=False)
    thumbnail: Mapped[str] = mapped_column(String(500))


    eventos = relationship("Reservaciones", back_populates="salon")
    gerente = relationship("Users", back_populates="salon_gerencia")
    