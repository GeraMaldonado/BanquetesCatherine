from flask import Blueprint, request
from model.Procurement import Procurement
from model.Reservaciones import Reservaciones
from datetime import datetime as dt
from collections import defaultdict
from datetime import datetime as dt, timedelta





reporting = Blueprint("reporting", __name__, url_prefix="/reports")

@reporting.get("/ingredientes-necesarios")
def report_ingredientes_necesarios():
    args = request.args

    if not args.get("end"):
        return {"message": "Invalid date range"}, 400

    start_date_str = args.get("start", dt.now().strftime("%Y-%m-%d"))
    end_date_str = args.get("end")

    # --- 1. OBTENER NECESIDADES DIARIAS (DELTAS) ---
    reservaciones_previstas = Reservaciones.query.where(
        Reservaciones.fecha >= start_date_str + " 00:00",
        Reservaciones.fecha <= end_date_str + " 23:59",
        Reservaciones.confirmado == True
    ).all()

    # datos_diarios almacenará los cambios (deltas) para cada día
    datos_diarios = defaultdict(lambda: defaultdict(lambda: {"necesidad_total": 0.0, "entrega_total": 0.0, "nombre": "", "unidad": ""}))
    ingredientes_info = {} # Un diccionario para guardar el nombre y unidad de cada ingrediente

    for rsv in reservaciones_previstas:
        necesidades_rsv = rsv.obtener_requerimientos_ingredientes()
        fecha_rsv = dt.strptime(rsv.fecha.replace(" ", "T").split("T")[0], "%Y-%m-%d").strftime("%Y-%m-%d")

        for nec in necesidades_rsv:
            ingrediente_id = nec["id"]
            datos_diarios[fecha_rsv][ingrediente_id]["necesidad_total"] += nec["cantidad_requerida"]
            
            # Guardar la información del ingrediente
            if ingrediente_id not in ingredientes_info:
                ingredientes_info[ingrediente_id] = {"nombre": nec["nombre"], "unidad": nec["unidad"]}

    # --- 2. OBTENER ENTREGAS DIARIAS (DELTAS) ---
    if ingredientes_info: # Solo buscar entregas si hay ingredientes necesarios
        entregas_previstas = Procurement.query.where(
            Procurement.fecha_recepcion >= start_date_str + " 00:00",
            Procurement.fecha_recepcion <= end_date_str + " 23:59",
            Procurement.ingrediente_id.in_(list(ingredientes_info.keys()))
        ).all()

        for ent in entregas_previstas:
            fecha_entrega = dt.strptime(ent.fecha_recepcion.replace(" ", "T").split("T")[0], "%Y-%m-%d").strftime("%Y-%m-%d")
            ingrediente_id = ent.ingrediente_id
            datos_diarios[fecha_entrega][ingrediente_id]["entrega_total"] += ent.cantidad
    
    # --- 3. CALCULAR LOS VALORES ACUMULADOS ---
    respuesta_formateada = []
    # Diccionario para mantener el total acumulado de cada ingrediente
    totales_acumulados = defaultdict(lambda: {"necesidad": 0.0, "entrega": 0.0})
    
    # Iterar por cada día en el rango de fechas solicitado
    start_date = dt.strptime(start_date_str, "%Y-%m-%d")
    end_date = dt.strptime(end_date_str, "%Y-%m-%d")
    
    for i in range((end_date - start_date).days + 1):
        current_date = start_date + timedelta(days=i)
        current_date_str = current_date.strftime("%Y-%m-%d")

        ingredientes_del_dia = []
        # Obtener los cambios (deltas) para el día actual
        daily_changes = datos_diarios[current_date_str]

        # Iterar sobre todos los ingredientes que hemos encontrado
        for ing_id, info in ingredientes_info.items():
            # Actualizar los totales acumulados con los cambios del día
            totales_acumulados[ing_id]["necesidad"] += daily_changes[ing_id]["necesidad_total"]
            totales_acumulados[ing_id]["entrega"] += daily_changes[ing_id]["entrega_total"]

            # Añadir el estado acumulado actual a la lista del día
            ingredientes_del_dia.append({
                "id": ing_id,
                "nombre": info["nombre"],
                "unidad": info["unidad"],
                "cantidad_necesaria_acumulada": round(totales_acumulados[ing_id]["necesidad"], 2),
                "cantidad_esperada_recibir_acumulada": round(totales_acumulados[ing_id]["entrega"], 2)
            })

        # Solo añadir la fecha al resultado si tiene ingredientes
        if ingredientes_del_dia:
            respuesta_formateada.append({
                "fecha": current_date_str,
                "ingredientes": sorted(ingredientes_del_dia, key=lambda x: x['nombre'])
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