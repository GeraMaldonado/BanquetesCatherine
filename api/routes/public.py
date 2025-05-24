from flask import Blueprint


public_routes = Blueprint("public", __name__, url_prefix="/public")


@public_routes.get("/platillos")
def get_platillos_public():
    pass

@public_routes.get("/platillos/<int:platillo_id>")
def get_platillo_by_id_public(platillo_id):
    pass

@public_routes.get("/salones")
def get_salones_public():
    pass

@public_routes.get("/salones/<int:salon_id>")
def get_salon_by_id_public(salon_id):
    pass
