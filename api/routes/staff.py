from flask import Blueprint, request
from model.Users import Users
from db import add


hr = Blueprint("hr", __name__, url_prefix="/hr")

@hr.get("/personal")
def list_personal_general():
    
    personal = Users.query.where(Users.role == "PERSONAL").all()

    return [personal.to_json() for personal in personal], 200


@hr.post("/personal")
def add_personal_general():
    
    payload = request.get_json()

    user = Users(**payload, role="PERSONAL", password="-", email = "-")

    add(user)

    return user.to_json(), 200


