from flask import Blueprint


events = Blueprint("manager_events", __name__, url_prefix="/events")

@events.get("/solicitudes-banquete")
def manager_get_solicitudes():
    pass

@events.get("/solicitudes-banquete/<int:solicitud_id>")
def manager_get_solicitud_detail(solicitud_id):
    pass

def manager_create_or_confirm_reservacion():
    pass

@events.get("/reservaciones")
def manager_get_all_reservaciones():
    pass

@events.get("/reservaciones/<int:reservacion_id>")
def manager_get_reservacion_detail(reservacion_id):
    pass

@events.put("/reservaciones/<int:reservacion_id>")
def manager_update_reservacion(reservacion_id):
    pass

@events.put("/reservaciones/<int:reservacion_id>/cancelar")
def manager_cancel_reservacion(reservacion_id):
    pass

@events.post("/paquetes-personalizados")
def manager_create_paquete_personalizado():
    pass

def manager_get_paquetes_personalizados():
    pass