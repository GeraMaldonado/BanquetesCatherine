from sqlalchemy import Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import db
from uuid import uuid4
from typing import List

UNIDADES = ["gramos", "kilogramos", "litros", "piezas", "mililitros"]

class Ingredientes(db.Model):
    __tablename__ = 'ingredientes' 
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: uuid4().hex)
    nombre: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) 
    precio: Mapped[float] = mapped_column(Float, nullable=False)
    unidad: Mapped[str] = mapped_column(String(50), nullable=False) 

    surtidos = relationship("Procurement",back_populates="ingrediente_surtido")
    instrucciones_en_uso = relationship("InstruccionesIngredientes", back_populates="ingrediente")