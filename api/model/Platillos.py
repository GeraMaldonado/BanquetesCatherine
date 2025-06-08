from sqlalchemy import Integer, String, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4

class Platillos(db.Model):
    __tablename__ = 'platillos' 
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)
    nombre: Mapped[str] = mapped_column(String(255), unique=True, nullable=False) 
    descripcion: Mapped[str] = mapped_column(String(1000), nullable=True)
    precio_mano_obra: Mapped[float]
    thumbnail: Mapped[str] = mapped_column(String(500), nullable=False)

    eventos_que_lo_han_usado = relationship("Reservaciones", back_populates="platillo")
    instrucciones = relationship( "Instrucciones", back_populates="platillo")



class Instrucciones(db.Model):
    __tablename__ = 'instrucciones' 
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)
    
    platillo_id: Mapped[str] = mapped_column(ForeignKey("platillos.id"), nullable=False)
    index: Mapped[int] = mapped_column(Integer, nullable=False) 
    descripcion: Mapped[str] = mapped_column(String(1000), nullable=False)

    platillo = relationship("Platillos", back_populates="instrucciones")
    ingredientes = relationship("InstruccionesIngredientes", back_populates="instruccion")



class InstruccionesIngredientes(db.Model):
    __tablename__ = 'instrucciones_ingredientes' 
    
    instruccion_id: Mapped[str] = mapped_column(ForeignKey("instrucciones.id"), primary_key=True)
    ingrediente_id: Mapped[str] = mapped_column(ForeignKey("ingredientes.id"), primary_key=True)
    cantidad: Mapped[float] = mapped_column(Float, nullable=False)

    instruccion = relationship("Instrucciones", back_populates="ingredientes")
    ingrediente = relationship("Ingredientes", back_populates="instrucciones_en_uso")


