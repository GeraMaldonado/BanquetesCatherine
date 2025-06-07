from flask import Blueprint, request
from routes.clients import crear_cliente
from model.Platillos import Platillos, Instrucciones, InstruccionesIngredientes
from model.Salones import Salones
from model.Reservaciones import Reservaciones
from db import add



public_routes = Blueprint("public", __name__, url_prefix="/public")


@public_routes.get("/platillos")
def get_platillos_public():
    
    platillos = Platillos.query.all()

    return [platillo.to_json() for platillo in platillos], 200




@public_routes.get("/salones")
def get_salones_public():
    
    salones = Salones.query.all()

    salones_json = [salon.to_json() for salon in salones]

    return salones_json, 200




@public_routes.post("/solicitudes-banquete")
def submit_solicitud_banquete():

    payload = request.get_json()

    evento_data = {k:v for k,v in payload.items() if not k == "user"}
    user_data = payload.get("user")

    user, _ = crear_cliente(user_data)

    rsv = Reservaciones(user_id=user.id, confirmado=False, **evento_data)

    add(rsv)

    return rsv.to_json(), 200