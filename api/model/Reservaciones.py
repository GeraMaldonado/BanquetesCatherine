from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped,mapped_column
from sqlalchemy.ext.declarative import declarative_base
from db import db


class Reservaciones(db.Model):
    __tablename__ = "reservaciones"

    id: Mapped[int] = mapped_column("id", primary_key=True)
    salon_id: Mapped[int] = mapped_column(ForeignKey("salones.id"))
    platillo_id: Mapped[int] = mapped_column(ForeignKey("platillos.id"), nullable=False)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    fecha: Mapped[str] = mapped_column(String(100), nullable=False)
    invitados: Mapped[int]
    confirmado: Mapped[bool]

    pagos = relationship("Pagos", back_populates="reservacion")
    plantilla = relationship("Reservaciones_Personal", back_populates="evento")
    salon = relationship("Salones", back_populates="eventos")
    user = relationship("Users", back_populates="reservaciones")
    platillo = relationship("Platillos", back_populates="eventos_que_lo_han_usado")
