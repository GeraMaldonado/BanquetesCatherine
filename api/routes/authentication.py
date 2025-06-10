from flask import Blueprint, request, session
from model.Users import Users


authentication = Blueprint("authentication", __name__, url_prefix="/auth")


@authentication.post("/login")
def login():
    
    try:

        result = Users.login(**request.get_json())

        response = result.to_json()

        session["user"] = response

        return response, 200

    except Exception as e:

        return {"error": str(e)}, 400




@authentication.post("/logout")
def logout():
    
    session.pop("user")

    return {"message": "Logged out successfully"}, 200



