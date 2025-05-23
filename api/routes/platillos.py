from flask import Blueprint, request, make_response
from model.Platillos import Platillos, Instrucciones
from db import db
import json

platillos = Blueprint("platillos", __name__, url_prefix="/api/platillos")


@platillos.post("/create")
def create_platillo():

    payload = request.get_json()

    platillo = Platillos(**payload)

    db.session.add(platillo)
    db.session.commit()

    return make_response({"message": "Todo bien pana"}, 200)


@platillos.get("/")
def get_platillos():

    query = Platillos.query.where(Platillos.id == "algo").first()

    result = query.json()

    return make_response({"message": "Todo bien pana"}, 200)