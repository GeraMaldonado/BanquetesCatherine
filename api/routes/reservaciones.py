from flask import Blueprint, request, session
from model.Reservaciones import Reservaciones
from db import add


reservaciones = Blueprint("reservaciones", __name__, url_prefix="/reservaciones")

@reservaciones.post("/solicitudes-banquete")
def submit_solicitud_banquete():
    
    payload = request.get_json()
    print(session)
    rsv = Reservaciones(confirmado = False, **payload)

    add(rsv)

    return rsv.to_json(), 200


