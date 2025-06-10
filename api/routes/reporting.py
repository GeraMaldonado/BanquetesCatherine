from flask import Blueprint, request
from model.Procurement import Procurement
from model.Reservaciones import Reservaciones
from datetime import datetime as dt
from collections import defaultdict





reporting = Blueprint("reporting", __name__, url_prefix="/reports")

@reporting.get("/ingredientes-necesarios")
def report_ingredientes_necesarios():
    args = request.args

    if not args.get("end"):
        return {"message": "Invalid date range"}, 400

    start_date_str = args.get("start", dt.now().strftime("%Y-%m-%d"))
    end_date_str = args.get("end")

    reservaciones_previstas = Reservaciones.query.where(
        Reservaciones.fecha >= start_date_str + " 00:00",
        Reservaciones.fecha <= end_date_str + " 23:59",
        Reservaciones.confirmado == True
    ).all()

    datos_consolidados = defaultdict(lambda: defaultdict(lambda: {"necesidad_total": 0.0, "entrega_total": 0.0, "nombre": "", "unidad": ""}))

    ingredientes_con_necesidad_ids = set()

    for rsv in reservaciones_previstas:
        necesidades_rsv = rsv.obtener_requerimientos_ingredientes()
        fecha_rsv = dt.strptime(rsv.fecha.split(" ")[0], "%Y-%m-%d").strftime("%Y-%m-%d") 

        for nec in necesidades_rsv:
            ingrediente_id = nec["id"]
            datos_consolidados[fecha_rsv][ingrediente_id]["necesidad_total"] += nec["cantidad_requerida"]
            datos_consolidados[fecha_rsv][ingrediente_id]["nombre"] = nec["nombre"]
            datos_consolidados[fecha_rsv][ingrediente_id]["unidad"] = nec["unidad"]
            ingredientes_con_necesidad_ids.add(ingrediente_id) 

    entregas_previstas = Procurement.query.where(
        Procurement.fecha_recepcion >= start_date_str + " 00:00",
        Procurement.fecha_recepcion <= end_date_str + " 23:59",
        Procurement.ingrediente_id.in_(list(ingredientes_con_necesidad_ids)) 
    ).all()


    for ent in entregas_previstas:
        fecha_entrega = dt.strptime(ent.fecha_recepcion.split(" ")[0], "%Y-%m-%d").strftime("%Y-%m-%d") 
        ingrediente_id = ent.ingrediente_id

        if ingrediente_id in ingredientes_con_necesidad_ids:
            datos_consolidados[fecha_entrega][ingrediente_id]["entrega_total"] += ent.cantidad

    respuesta_formateada = []
    for fecha, ingredientes_por_fecha in sorted(datos_consolidados.items()):
        ingredientes_lista = []
        for ingrediente_id, datos in ingredientes_por_fecha.items():
            if ingrediente_id in ingredientes_con_necesidad_ids:
                ingredientes_lista.append({
                    "id": ingrediente_id,
                    "nombre": datos["nombre"],
                    "unidad": datos["unidad"],
                    "cantidad_necesaria_acumulada": round(datos["necesidad_total"], 2),
                    "cantidad_esperada_recibir_acumulada": round(datos["entrega_total"], 2)
                })
        if ingredientes_lista:
            respuesta_formateada.append({
                "fecha": fecha,
                "ingredientes": sorted(ingredientes_lista, key=lambda x: x['nombre'])
            })

    return respuesta_formateada, 200



@reporting.get("/eventos-pendientes-pago")
def report_eventos_pendientes_pago():
    pass

@reporting.get("/popularidad-platillos")
def report_popularidad_platillos():
    pass

def report_ventas():
    pass