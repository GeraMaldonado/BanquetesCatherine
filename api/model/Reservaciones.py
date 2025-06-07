from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped,mapped_column
from sqlalchemy.ext.declarative import declarative_base
from db import db
from uuid import uuid4


class Reservaciones(db.Model):
    __tablename__ = "reservaciones"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: uuid4().hex)
    salon_id: Mapped[str] = mapped_column(ForeignKey("salones.id"))
    platillo_id: Mapped[str] = mapped_column(ForeignKey("platillos.id"), nullable=False)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    fecha: Mapped[str]
    invitados: Mapped[int]
    confirmado: Mapped[bool]


    pagos = relationship("Pagos", back_populates="reservacion")
    plantilla = relationship("Reservaciones_Personal", back_populates="evento")
    salon = relationship("Salones", back_populates="eventos")
    user = relationship("Users", back_populates="reservaciones")
    platillo = relationship("Platillos", back_populates="eventos_que_lo_han_usado")

    def to_json(self):

        return {
            **super().to_json(),
            "salon": self.salon.to_json(),
            "platillo": self.platillo.to_json(),
            "user": self.user.to_json(),
            "importe": self.obtener_costo(),
            "plantilla": [personal.to_json() for personal in self.plantilla]
        }

    
    def obtener_costo(self):

        costo_salon = self.salon.costoRenta
        costo_platillo = self.platillo.precio_mano_obra * self.invitados

        return costo_salon + costo_platillo
