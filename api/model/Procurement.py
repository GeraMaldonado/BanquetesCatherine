from sqlalchemy import Integer, String, ForeignKey, Float, DateTime 
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4 

class Procurement(db.Model):
    __tablename__ = 'procurement' 
    
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)

    ingrediente_id: Mapped[str] = mapped_column(ForeignKey("ingredientes.id"), nullable=False)
    cantidad: Mapped[float]
    fecha_recepcion: Mapped[str] = mapped_column(String(16), nullable=False)
    fecha_creacion: Mapped[str]= mapped_column(String(16), nullable=False)

    ingrediente_surtido = relationship("Ingredientes", back_populates="surtidos")
