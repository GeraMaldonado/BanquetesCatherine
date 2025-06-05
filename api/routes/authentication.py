from flask import Blueprint


authentication = Blueprint("authentication", __name__, url_prefix="/auth")


@authentication.post("/login")
def login():
    pass


@authentication.post("/logout")
def logout():
    pass


