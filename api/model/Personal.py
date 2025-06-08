from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship 
from db import db
from uuid import uuid4

class Personal(db.Model):
    __tablename__ = 'personal' 
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: uuid4().hex)
    nombre: Mapped[str] = mapped_column(String(255), nullable=False)

    agendas = relationship("Reservaciones_Personal", back_populates="personal_requerido")
    



class Reservaciones_Personal(db.Model):
    __tablename__ = 'reservaciones_personal' 
    
    reservacion_id: Mapped[str] = mapped_column(ForeignKey("reservaciones.id"), primary_key=True)
    colaborador_id: Mapped[str] = mapped_column(ForeignKey("personal.id"), primary_key=True)


    personal_requerido = relationship("Personal", back_populates="agendas")
    evento = relationship("Reservaciones", back_populates="plantilla")