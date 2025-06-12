from flask import Flask
from flask_cors import CORS
from config import DATABASE_URL
from db import db


from routes.authentication import authentication
from routes.clients import clientes
from routes.events import events
from routes.menu import menu
from routes.public import public_routes
from routes.reporting import reporting
from routes.reservaciones import reservaciones
from routes.staff import hr
from routes.superuser import superuser_routes



app = Flask(__name__)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.secret_key = "banquetitos"

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

app.register_blueprint(authentication)
app.register_blueprint(clientes)
app.register_blueprint(events)
app.register_blueprint(menu)
app.register_blueprint(public_routes)
app.register_blueprint(reporting)
app.register_blueprint(reservaciones)
app.register_blueprint(hr)
app.register_blueprint(superuser_routes)


if __name__ == "__main__":

    app.run(debug=True)