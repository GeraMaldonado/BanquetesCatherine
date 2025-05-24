from flask import Blueprint

superuser_routes = Blueprint("superuser_routes", __name__, url_prefix="/superuser")


@superuser_routes.get("/gerentes")
def admin_list_gerentes():
    pass

@superuser_routes.post("/gerentes")
def admin_add_gerente():
    pass

@superuser_routes.put("/gerentes/<int:gerente_id>/estatus")
def admin_update_gerente_status(gerente_id):
    pass