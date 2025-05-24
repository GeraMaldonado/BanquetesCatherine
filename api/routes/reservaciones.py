from flask import Blueprint


reservaciones = Blueprint("reservaciones", __name__, url_prefix="/reservaciones")

@reservaciones.post("/solicitudes-banquete")
def submit_solicitud_banquete():
    pass

@reservaciones.get("/mis-reservaciones")
def get_mis_reservaciones():
    pass

@reservaciones.get("/reservaciones/<int:reservacion_id>")
def get_mi_reservacion_detalle(reservacion_id):
    pass

@reservaciones.put("/reservaciones/<int:reservacion_id>/invitados")
def update_mis_invitados(reservacion_id):
    pass

@reservaciones.get("/mis-paquetes-personalizados")
def get_mis_paquetes_personalizados():
    pass