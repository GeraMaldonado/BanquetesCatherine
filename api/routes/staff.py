from flask import Blueprint


hr = Blueprint("hr", __name__, url_prefix="/hr")

@hr.get("/personal")
def list_personal_general():
    pass

@hr.post("/personal")
def add_personal_general():
    pass

@hr.get("/horarios")
def view_horarios():
    pass

@hr.post("/horarios")
def create_horario():
    pass

@hr.put("/horarios/<int:horario_id>")
def update_horario(horario_id):
    pass

@hr.delete("/horarios/<int:horario_id>")
def delete_horario(horario_id):
    pass