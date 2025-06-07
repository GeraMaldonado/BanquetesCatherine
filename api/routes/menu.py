from flask import Blueprint, request
from model.Platillos import Platillos, Instrucciones, InstruccionesIngredientes
from model.Ingredientes import Ingredientes
from db import add, find_by_id, delete



menu = Blueprint("menu", __name__, url_prefix="/menu")

@menu.post("/platillos")
def manager_add_platillo():
    payload = request.get_json()

    if isinstance(payload, dict):
        payload = [payload]


    inserted_platillos = []

    for recipe_data in payload:
        new_platillo = Platillos(
            nombre=recipe_data["nombre"],
            descripcion=recipe_data.get("descripcion"),
            precio_mano_obra=recipe_data["precio_mano_obra"],
            thumbnail = recipe_data.get("thumbnail")
        )
        add(new_platillo)

        for instruction_data in recipe_data.get("instrucciones", []):
            new_instruccion = Instrucciones(
                platillo_id=new_platillo.id,
                index=instruction_data["index"],
                descripcion=instruction_data["descripcion"]
            )
            add(new_instruccion)

            for ingredient_data in instruction_data.get("ingredientes", []):
                new_instruccion_ingrediente = InstruccionesIngredientes(
                    instruccion_id=new_instruccion.id,
                    ingrediente_id=ingredient_data["ingrediente"], 
                    cantidad=ingredient_data["cantidad"]
                )
                add(new_instruccion_ingrediente) 


        inserted_platillos.append({
            "id": new_platillo.id,
            "nombre": new_platillo.nombre,
            "status": "success"
        })

    return inserted_platillos, 200



@menu.put("/platillos/<int:platillo_id>")
def manager_update_platillo(platillo_id):
    pass

@menu.delete("/platillos/<platillo_id>")
def manager_delete_platillo(platillo_id):
    
    platillo = Platillos.query.where(Platillos.id == platillo_id).first()

    delete(platillo)

    return {"message": "Platillo deleted successfully"}, 200


@menu.get("/ingredientes")
def manager_list_ingredientes():
    
    ingredientes = Ingredientes.query.all()

    return [ingrediente.to_json() for ingrediente in ingredientes], 200



@menu.post("/ingredientes")
def manager_add_ingrediente():
    
    payload = request.get_json()

    if isinstance(payload, dict):

        payload = [payload]

    ingredientes = [Ingredientes(**item) for item in payload]

    for ingrediente in ingredientes:

        add(ingrediente)


    return ingrediente.to_json(), 200



@menu.put("/ingredientes/<int:ingrediente_id>")
def manager_update_ingrediente(ingrediente_id):
    pass

