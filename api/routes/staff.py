from flask import Blueprint, request
from model.Personal import Personal
from db import add


hr = Blueprint("hr", __name__, url_prefix="/hr")

@hr.get("/personal")
def list_personal_general():
    
    args = request.args

    if args.get("availability"):

        personal = users_available_for_date(args.get("availability"))

    else:

        personal = Personal.query.all()

    return [personal.to_json() for personal in personal], 200


@hr.post("/personal")
def add_personal_general():
    
    payload = request.get_json()

    user = Personal(**payload)

    add(user)

    return user.to_json(), 200



def users_available_for_date(date):
    
    staff = Personal.query.all()

    available = []

    for p in staff:

        if not any(date in rsv.evento.fecha for rsv in p.agendas):
            available.append(p)

    return available

