from flask import Blueprint, request
from model.Users import Users
from db import add, commit




clientes = Blueprint("clientes", __name__, url_prefix="/clientes")

@clientes.post("")
def manager_create_client():
    
    payload = request.get_json()

    user, created = crear_cliente(payload)

    if not created:
        return {"message": "User already exists"}, 400


    return user.to_json(), 200


@clientes.put("/<client_id>")
def manager_update_client(client_id):
    
    payload = request.get_json()

    try: 
        
        user = Users.query.where(Users.id == client_id).one()

        user.name = payload.get("name", user.name)
        user.email = payload.get("email", user.email)
        user.password = payload.get("password", user.password)

        commit()

        return user.to_json(), 200

    
    except Exception as e:

        return {"message": "User not found"}, 404

    




@clientes.get("")
def manager_list_clients():
    
    clients = Users.query.where(Users.role == "CLIENTE").all()

    return [{**client.to_json(), "eventos": [e.to_json() for e in client.reservaciones]} for client in clients], 200





@clientes.get("/<client_id>")
def manager_get_client_details(client_id):
    
    try:
        client = Users.query.where(Users.id == client_id, Users.role == "CLIENTE").one()
        return {**client.to_json(), "eventos": [e.to_json() for e in client.reservaciones]}, 200
    
    except Exception as e:
        return {"message": "Client not found"}, 404
    



def crear_cliente(payload):
    
    try:
        user = Users.query.where(Users.email == payload["email"]).one()

        return user, False


    except:

        user = Users(**payload, role="CLIENTE")

        add(user)

        return user, True