from flask import Blueprint, request
from model.Reservaciones import Reservaciones
from model.Pagos import Pagos
from db import commit, delete, add
from datetime import datetime as dt





events = Blueprint("manager_events", __name__, url_prefix="/events")



@events.get("/reservaciones")
def manager_get_all_reservaciones():
    
    args = request.args

    params = []

    if args.get("id"): 
        params.append(Reservaciones.id == args.get("id"))

    if args.get("user_id"): 
        params.append(Reservaciones.user_id == args.get("user_id"))

    if args.get("salon_id"):
        params.append(Reservaciones.salon_id == args.get("salon_id"))

    if args.get("start_date"):
        params.append(Reservaciones.fecha >= args.get("start_date") + " 00:00")

    if args.get("end_date"):
        params.append(Reservaciones.fecha <= args.get("end_date") + " 23:59")

    if args.get("confirmado"):
        confirmado = args.get("confirmado") == "true"
        if confirmado:
            params.append(Reservaciones.confirmado == confirmado)
        

    rsv = Reservaciones.query.where(*params).all()
    return [rsv.to_json() for rsv in rsv], 200



@events.get("/reservaciones/<reservacion_id>")
def manager_get_reservacion_detail(reservacion_id):
    
    try:
        rsv = Reservaciones.query.where(Reservaciones.id == reservacion_id).one()

        return rsv.to_json(), 200

    except:
        return {"message": "Reservación no encontrada"}, 404



@events.put("/reservaciones/<reservacion_id>")
def manager_update_reservacion(reservacion_id):
    
    payload = request.get_json()

    try:
        rsv = Reservaciones.query.where(Reservaciones.id == reservacion_id).one()
    except:
        return {"message": "Reservación no encontrada"}, 404

    rsv.update(**payload)

    commit()

    return rsv.to_json(), 200


    

@events.put("/reservaciones/<reservacion_id>/cancelar")
def manager_cancel_reservacion(reservacion_id):

    try:
        rsv = Reservaciones.query.where(Reservaciones.id == reservacion_id).one()

        delete(rsv)

        return {"message": "Reservación cancelada exitosamente"}, 200

    except:
        return {"message": "Reservación no encontrada"}, 404


@events.post("/reservaciones/<reservacion_id>/update-staff")
def manager_confirm_reservacion(reservacion_id):

    payload = request.get_json()
    try:
        evento = Reservaciones.query.where(Reservaciones.id == reservacion_id).one()

        evento.actualizar_plantilla(payload)

        return evento.to_json(), 200

    
    except Exception as e:

        return {"message": "Reservación no encontrada"}, 404



@events.post("/reservaciones/<reservacion_id>/registrar-pago")
def event_registrar_pago(reservacion_id):

    payload = request.get_json()
    try:
        evento = Reservaciones.query.where(Reservaciones.id == reservacion_id).one()

        pago = Pagos(reservacion_id = evento.id, fecha = dt.now().strftime("%Y-%m-%d %H:%M"), **payload)

        add(pago)

        return evento.to_json(), 200

    
    except Exception as e:

        return {"message": str(e)}, 404
