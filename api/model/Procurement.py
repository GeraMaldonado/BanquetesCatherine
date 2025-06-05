from sqlalchemy import Integer, String, ForeignKey, Float, DateTime 
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4
import datetime 

class Procurement(db.Model):
    __tablename__ = 'procurement' 
    
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)

    ingrediente_id: Mapped[str] = mapped_column(ForeignKey("ingredientes.id"), nullable=False)
    cantidad: Mapped[float] = mapped_column(Float, nullable=False)
    fechaRecepcion: Mapped[str] = mapped_column(DateTime, nullable=False) 
    fechaCreacion: Mapped[str] = mapped_column(DateTime, nullable=False) 

    ingrediente_surtido = relationship("Ingredientes", back_populates="surtidos")
