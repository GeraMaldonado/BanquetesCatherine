import React, { useState, useEffect } from 'react';
import { postIngrediente, postPlatillo, fetchIngredientes } from "../../services/menu.service";
import { postSalon } from "../../services/salones.service";
import { fetchSalones, fetchMenus } from "../../services/public.service";
import { Button } from "../../components/atoms/button/Button"


export const Configuracion = () => {

    const [salones, setSalones] = useState([]);
    const [menus, setMenus] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);


    const [showSalonModal, setShowSalonModal] = useState(false);
    const [newSalon, setNewSalon] = useState({ gerente_id: '231a6998ab3249d98aed2486b7c3af7a', name: '', costoRenta: '', capacidadMaxima: '', thumbnail: '' });

    const [showPlatilloModal, setShowPlatilloModal] = useState(false);
    const [newPlatillo, setNewPlatillo] = useState({ nombre: '', descripcion: '', precio_mano_obra: '', thumbnail: '', instrucciones: [{ index: 1, descripcion: '', ingredientes: [{ ingrediente: '', cantidad: '' }] }] });

    const [showIngredienteModal, setShowIngredienteModal] = useState(false);
    const [newIngrediente, setNewIngrediente] = useState({ nombre: '', precio: '', unidad: '' });

    async function fetchData() {
        const ingredientes = await fetchIngredientes();
        setIngredientes(ingredientes);
        const menus = await fetchMenus();
        setMenus(menus);
        const salones = await fetchSalones();
        setSalones(salones);
    }


    useEffect(() => {
        fetchData()
    }, []);


    const handleSalonSubmit = async (e) => {
        e.preventDefault();
        console.log("Creando nuevo salón:", newSalon);
        await postSalon(newSalon);
        setShowSalonModal(false);
        fetchData()
    };
    
    const handlePlatilloSubmit = async (e) => {
        e.preventDefault();
        console.log("Creando nuevo platillo:", newPlatillo);
        await postPlatillo(newPlatillo);
        setShowPlatilloModal(false);
        fetchData()
    };
    
    const handleIngredienteSubmit = async (e) => {
        e.preventDefault();
        console.log("Creando nuevo ingrediente:", newIngrediente);
        await postIngrediente(newIngrediente);
        setShowIngredienteModal(false);
        fetchData()
    };

    const handleInputChange = (e, setState) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    };


    const handleInstruccionChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...newPlatillo.instrucciones];
        list[index][name] = value;
        setNewPlatillo({ ...newPlatillo, instrucciones: list });
    };

    const handleAddInstruccion = () => {
        setNewPlatillo(prevState => ({
            ...prevState,
            instrucciones: [...prevState.instrucciones, { index: prevState.instrucciones.length + 1, descripcion: '', ingredientes: [{ ingrediente: '', cantidad: '' }] }]
        }));
    };

    const handleRemoveInstruccion = (index) => {
        const list = [...newPlatillo.instrucciones];
        list.splice(index, 1);
        setNewPlatillo({ ...newPlatillo, instrucciones: list });
    };
    
    const handleIngredienteInstruccionChange = (instIndex, ingIndex, event) => {
        const { name, value } = event.target;
        const list = [...newPlatillo.instrucciones];
        list[instIndex].ingredientes[ingIndex][name] = value;
        setNewPlatillo({ ...newPlatillo, instrucciones: list });
    };

    const handleAddIngredienteInstruccion = (instIndex) => {
        const list = [...newPlatillo.instrucciones];
        list[instIndex].ingredientes.push({ ingrediente: '', cantidad: '' });
        setNewPlatillo({ ...newPlatillo, instrucciones: list });
    };

    const handleRemoveIngredienteInstruccion = (instIndex, ingIndex) => {
        const list = [...newPlatillo.instrucciones];
        list[instIndex].ingredientes.splice(ingIndex, 1);
        setNewPlatillo({ ...newPlatillo, instrucciones: list });
    };


    return (
        <div className="container mt-5">
            <h1 className="mb-4">Panel de Configuración</h1>

            <ul className="nav nav-tabs" id="configTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <Button className="active" id="salones-tab" data-bs-toggle="tab" data-bs-target="#salones" type="button" role="tab">Salones</Button>
                </li>
                <li className="nav-item" role="presentation">
                    <Button id="platillos-tab" data-bs-toggle="tab" data-bs-target="#platillos" type="button" role="tab">Platillos</Button>
                </li>
                <li className="nav-item" role="presentation">
                    <Button id="ingredientes-tab" data-bs-toggle="tab" data-bs-target="#ingredientes" type="button" role="tab">Ingredientes</Button>
                </li>
            </ul>

            <div className="tab-content" id="configTabContent">

                <div className="tab-pane fade show active" id="salones" role="tabpanel">
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                        <h2>Gestión de Salones</h2>
                        <Button primary onClick={() => setShowSalonModal(true)}>+ Crear Salón</Button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Vista Previa</th>
                                    <th>Nombre</th>
                                    <th>Capacidad Máx.</th>
                                    <th>Costo Renta</th>
                                    <th>Gerente</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salones.map(salon => (
                                    <tr key={salon.id}>
                                        <td><img src={salon.thumbnail} alt={salon.name} width="100" className="img-thumbnail" /></td>
                                        <td>{salon.name}</td>
                                        <td>{salon.capacidadMaxima} personas</td>
                                        <td>${salon.costoRenta.toFixed(2)}</td>
                                        <td>{salon.gerente.name}</td>
                                        <td>
                                            <Button dark className="btn-sm">Eliminar</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="tab-pane fade" id="platillos" role="tabpanel">
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                        <h2>Gestión de Platillos</h2>
                        <Button primary onClick={() => setShowPlatilloModal(true)}>+ Crear Platillo</Button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr><th>Nombre</th><th>Descripción</th><th>Costo Mano de Obra</th><th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {menus.map(menu => (
                                    <tr key={menu.id}>
                                        <td>{menu.nombre}</td>
                                        <td>{menu.descripcion}</td>
                                        <td>${menu.precio_mano_obra.toFixed(2)}</td>
                                        <td><Button dark className="btn-sm">Eliminar</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="tab-pane fade" id="ingredientes" role="tabpanel">
                     <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                        <h2>Gestión de Ingredientes</h2>
                        <Button primary onClick={() => setShowIngredienteModal(true)}>+ Crear Ingrediente</Button>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr><th>Nombre</th><th>Precio</th><th>Unidad</th><th>Acciones</th></tr>
                            </thead>
                            <tbody>
                                {ingredientes.map(ing => (
                                    <tr key={ing.id}>
                                        <td>{ing.nombre}</td>
                                        <td>${ing.precio.toFixed(2)}</td>
                                        <td>{ing.unidad}</td>
                                        <td><Button dark className="btn-sm">Eliminar</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal para Crear Salón */}
            {showSalonModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Nuevo Salón</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSalonModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSalonSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre del Salón</label>
                                        <input type="text" className="form-control" name="name" value={newSalon.name} onChange={(e) => handleInputChange(e, setNewSalon)} required />
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Costo de Renta</label>
                                            <input type="number" step="0.01" className="form-control" name="costoRenta" value={newSalon.costoRenta} onChange={(e) => handleInputChange(e, setNewSalon)} required />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Capacidad Máxima</label>
                                            <input type="number" className="form-control" name="capacidadMaxima" value={newSalon.capacidadMaxima} onChange={(e) => handleInputChange(e, setNewSalon)} required />
                                        </div>
                                    </div>
                                     <div className="mb-3">
                                        <label className="form-label">URL de Imagen (Thumbnail)</label>
                                        <input type="url" className="form-control" name="thumbnail" value={newSalon.thumbnail} onChange={(e) => handleInputChange(e, setNewSalon)} required />
                                    </div>
                                     <div className="mb-3">
                                        <label className="form-label">ID del Gerente</label>
                                        <input type="text" className="form-control" name="gerente_id" value={newSalon.gerente_id} onChange={(e) => handleInputChange(e, setNewSalon)} required />
                                    </div>
                                    <div className="modal-footer">
                                        <Button secondary onClick={() => setShowSalonModal(false)}>Cancelar</Button>
                                        <Button primary type="submit">Guardar Salón</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Modal para Crear Platillo */}
            {showPlatilloModal && (
                 <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                             <div className="modal-header">
                                <h5 className="modal-title">Crear Nuevo Platillo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPlatilloModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handlePlatilloSubmit}>
                                    {/* Campos básicos del platillo */}
                                    <input type="text" name="nombre" placeholder="Nombre del Platillo" className="form-control mb-2" value={newPlatillo.nombre} onChange={(e) => handleInputChange(e, setNewPlatillo)} required/>
                                    <textarea name="descripcion" placeholder="Descripción" className="form-control mb-2" value={newPlatillo.descripcion} onChange={(e) => handleInputChange(e, setNewPlatillo)} required></textarea>
                                    <input type="number" step="0.01" name="precio_mano_obra" placeholder="Precio Mano de Obra" className="form-control mb-2" value={newPlatillo.precio_mano_obra} onChange={(e) => handleInputChange(e, setNewPlatillo)} required/>
                                    <input type="url" name="thumbnail" placeholder="URL de Imagen" className="form-control mb-3" value={newPlatillo.thumbnail} onChange={(e) => handleInputChange(e, setNewPlatillo)} required/>

                                    {/* Sección de Instrucciones Dinámicas */}
                                    <h5>Instrucciones</h5>
                                    {newPlatillo.instrucciones.map((instruccion, instIndex) => (
                                        <div key={instIndex} className="p-3 border rounded mb-3 bg-light">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6>Paso {instIndex + 1}</h6>
                                                <Button dark type="button" className="btn-sm" onClick={() => handleRemoveInstruccion(instIndex)}>Eliminar Paso</Button>
                                            </div>
                                            <textarea name="descripcion" placeholder="Descripción del paso" value={instruccion.descripcion} className="form-control mb-2" onChange={(e) => handleInstruccionChange(instIndex, e)}></textarea>
                                            
                                            {/* Sección de Ingredientes por Instrucción */}
                                            <label className="form-label small">Ingredientes para este paso:</label>
                                            {instruccion.ingredientes.map((ing, ingIndex) => (
                                                <div key={ingIndex} className="row align-items-center mb-2">
                                                    <div className="col-md-6">
                                                        <select name="ingrediente" className="form-select" value={ing.ingrediente} onChange={(e) => handleIngredienteInstruccionChange(instIndex, ingIndex, e)}>
                                                            <option value="">Selecciona un ingrediente</option>
                                                            {ingredientes.map(i => <option key={i.id} value={i.id}>{i.nombre}</option>)}
                                                        </select>
                                                    </div>
                                                     <div className="col-md-4">
                                                        <input type="number" step="0.001" name="cantidad" placeholder="Cantidad" className="form-control" value={ing.cantidad} onChange={(e) => handleIngredienteInstruccionChange(instIndex, ingIndex, e)} />
                                                     </div>
                                                     <div className="col-md-2">
                                                         <Button dark type="button" className="btn-sm w-100" onClick={() => handleRemoveIngredienteInstruccion(instIndex, ingIndex)}>X</Button>
                                                     </div>
                                                </div>
                                            ))}
                                            <Button accent type="button" className="btn-sm" onClick={() => handleAddIngredienteInstruccion(instIndex)}>+ Añadir Ingrediente</Button>
                                        </div>
                                    ))}
                                    <Button secondary type="button" className="mb-3" onClick={handleAddInstruccion}>+ Añadir Paso</Button>
                                    
                                    <div className="modal-footer">
                                        <Button secondary onClick={() => setShowPlatilloModal(false)}>Cancelar</Button>
                                        <Button primary type="submit">Guardar Platillo</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal para Crear Ingrediente */}
            {showIngredienteModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                     <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Nuevo Ingrediente</h5>
                                <button type="button" className="btn-close" onClick={() => setShowIngredienteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleIngredienteSubmit}>
                                    <div className="mb-3"><input type="text" name="nombre" placeholder="Nombre" className="form-control" value={newIngrediente.nombre} onChange={(e) => handleInputChange(e, setNewIngrediente)} required /></div>
                                    <div className="mb-3"><input type="number" step="0.01" name="precio" placeholder="Precio" className="form-control" value={newIngrediente.precio} onChange={(e) => handleInputChange(e, setNewIngrediente)} required /></div>
                                    <div className="mb-3"><input type="text" name="unidad" placeholder="Unidad (ej. kg, pz)" className="form-control" value={newIngrediente.unidad} onChange={(e) => handleInputChange(e, setNewIngrediente)} required /></div>
                                    <div className="modal-footer">
                                        <Button secondary onClick={() => setShowIngredienteModal(false)}>Cancelar</Button>
                                        <Button primary type="submit">Guardar Ingrediente</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop para modales */}
            {(showSalonModal || showPlatilloModal || showIngredienteModal) && <div className="modal-backdrop fade show"></div>}
        </div>
    );
}

// Para que React pueda renderizar este componente, necesitamos exportarlo como default.
// En una estructura de proyecto real, esto usualmente se maneja en un archivo App.js o similar.
export default Configuracion;
