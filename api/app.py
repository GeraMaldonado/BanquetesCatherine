from flask import Flask
from config import DATABASE_URL
from db import db

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

db.init_app(app)


with app.app_context():

    from model.Ingredientes import Ingredientes
    from model.Pagos import Pagos
    from model.Personal import Personal, Reservaciones_Personal
    from model.Platillos import Platillos, Instrucciones, InstruccionesIngredientes
    from model.Procurement import Procurement
    from model.Reservaciones import Reservaciones
    from model.Salones import Salones
    from model.Users import Users

    db.create_all()

from routes.platillos import platillos

app.register_blueprint(platillos)


if __name__ == "__main__":

    app.run(debug=True)