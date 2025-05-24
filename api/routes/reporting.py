from flask import Blueprint


reporting = Blueprint("reporting", __name__, url_prefix="/reports")

@reporting.get("/ingredientes-necesarios")
def report_ingredientes_necesarios():
    pass

@reporting.get("/eventos-pendientes-pago")
def report_eventos_pendientes_pago():
    pass

@reporting.get("/popularidad-platillos")
def report_popularidad_platillos():
    pass

def report_ventas():
    pass