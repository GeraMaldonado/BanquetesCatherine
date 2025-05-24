from flask import Blueprint


clientes = Blueprint("clientes", __name__, url_prefix="/clients")

@clientes.post("")
def manager_create_client():
    pass

@clientes.put("/<int:client_id>")
def manager_update_client(client_id):
    pass

@clientes.get("")
def manager_list_clients():
    pass

@clientes.get("/<int:client_id>")
def manager_get_client_details(client_id):
    pass