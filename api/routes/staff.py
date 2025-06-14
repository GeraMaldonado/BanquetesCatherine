from flask import Blueprint, request
from model.Personal import Personal
from db import add, delete


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

@hr.delete("/personal/<string:personal_id>")
def delete_personal_by_id(personal_id):
    """
    Deletes a personal entry by its ID.
    """
    personal_to_delete = Personal.query.get(personal_id)

    if personal_to_delete is None:
        return {"error": "Personal not found"}, 404

    try:
        delete(personal_to_delete)
        return {"message": f"Personal with ID {personal_id} deleted successfully"}, 200
    except Exception as e:
        print(e)
        return {"error": f"Error deleting personal: {str(e)}"}, 500


def users_available_for_date(date):
    
    staff = Personal.query.all()

    available = []

    for p in staff:

        if not any(date in rsv.evento.fecha for rsv in p.agendas):
            available.append(p)

    return available

