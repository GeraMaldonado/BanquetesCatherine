from flask import Blueprint


menu = Blueprint("menu", __name__, url_prefix="/menu")

@menu.post("/platillos")
def manager_add_platillo():
    pass

@menu.put("/platillos/<int:platillo_id>")
def manager_update_platillo(platillo_id):
    pass

@menu.delete("/platillos/<int:platillo_id>")
def manager_delete_platillo(platillo_id):
    pass


@menu.get("/ingredientes")
def manager_list_ingredientes():
    pass

@menu.post("/ingredientes")
def manager_add_ingrediente():
    pass

@menu.put("/ingredientes/<int:ingrediente_id>")
def manager_update_ingrediente(ingrediente_id):
    pass

