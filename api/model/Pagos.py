from sqlalchemy import Integer, String, ForeignKey, Float, DateTime 
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4
import datetime 

class Pagos(db.Model):
    __tablename__ = 'pagos' 
    id: Mapped[str] = mapped_column("id", String(36), primary_key=True, default=lambda: uuid4().hex)
    
    reservacion_id: Mapped[str] = mapped_column(ForeignKey("reservaciones.id"), nullable=False)
    monto: Mapped[float] = mapped_column(Float, nullable=False)
    fecha: Mapped[str] = mapped_column(DateTime, nullable=False) 
    comprobante: Mapped[str] = mapped_column(String(500), nullable=True) 

    
    reservacion = relationship("Reservaciones", back_populates = "pagos")