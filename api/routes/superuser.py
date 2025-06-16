from flask import Blueprint, request
from db import add, find_by_id, delete
from model.Users import Users, ROLES
from model.Salones import Salones




superuser_routes = Blueprint("superuser_routes", __name__, url_prefix="/superuser")


@superuser_routes.get("/gerentes/<id>")
def admin_list_gerentes(id):
    gerentes = Users.query.where(Users.role == "GERENTE", Users.id == id).all()

    return [{**g.to_json(), "salon": [e.to_json() for e in g.salon_gerencia]} for g in gerentes], 200

@superuser_routes.post("/gerentes")
def admin_add_gerente():
    pass


@superuser_routes.post("/users")
def create_user():
    
    payload = request.get_json()

    if payload.get("role") not in ROLES:
        return {"message": "Invalid role"}, 400


    user = Users(**payload)

    add(user)

    return user.to_json(), 200


@superuser_routes.delete("/users/<id>")
def delete_user(id):
    
    user = find_by_id(Users, id)

    delete(user)

    return {"message": "User deleted successfully"}, 200




@superuser_routes.post("/salones")
def create_salon():

    salon = Salones(**request.get_json())

    add(salon)

    return salon.to_json(), 200