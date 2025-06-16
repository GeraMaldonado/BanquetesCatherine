import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchClienteById, modificarCliente } from '../../services/clientes.service';
import { eventRequest } from '../../services/eventos.service';
import { formatDate } from '../../utils/date.utils';
import { Button } from '../../components/atoms/button/Button';
import { useSession } from '../../providers/session.provider'
import { fetchMenus, fetchSalones } from '../../services/public.service';

export const ClienteDetalle = ({ }) => {
    const { clienteId } = useParams();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useSession();

    useEffect(() => {
        if (!clienteId) {
            setError("No se proporcionó un ID de cliente en la URL.");
            setLoading(false);
            return;
        }

        const cargarCliente = async () => {
            setLoading(true);
            setError(null);
            try {

                const data = await fetchClienteById(clienteId);
                if (data) {
                    setCliente(data);
                } else {
                    setError(`No se encontró ningún cliente con el ID: ${clienteId}`);
                }
            } catch (err) {
                console.error("Error al cargar el cliente:", err);
                setError(err.message || "Ocurrió un error al cargar los datos del cliente.");
            } finally {
                setLoading(false);
            }
        };

        cargarCliente();
    }, [clienteId]);

    if (loading) {
        return <div className="container mt-5"><p className="text-center">Cargando información del cliente...</p></div>;
    }

    if (error) {
        return <div className="container mt-5"><p className="alert alert-danger text-center">Error: {error}</p></div>;
    }

    if (!cliente) {
        return <div className="container mt-5"><p className="text-center">No se encontró información para el cliente especificado.</p></div>;
    }

    return (
        <>
            <div className="row gy-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h1>Detalles del Cliente: {cliente.name}</h1>
                            <Button primary data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</Button>
                        </div>
                        <div className="card-body">
                            <p><strong>ID:</strong> {cliente.id}</p>
                            <p><strong>Usuario:</strong> {cliente.email}</p>
                        </div>
                    </div>
                </div>
                <div className="col-12 d-flex justify-content-between align-items-center fs-1 fw-bold">
                    {cliente.eventos.length} Evento{cliente.eventos.length > 1 ? 's' : ''}
                    {currentUser?.role === "CLIENTE" && <Button data-bs-toggle="modal" data-bs-target="#nuevaSolicitud" navigateTo="/evento/request" primary>+ Nueva solicitud de evento</Button>}
                </div>
                <div className="col-12">
                    <div className="row">
                        {
                            cliente.eventos?.map(event => (
                                <Link to={"/app/evento/" + event.id} className="col-4 text-normal text-decoration-none">
                                    <div className="card" >
                                        <div id={event.id} class="carousel slide" data-bs-ride="carousel">
                                            <div class="carousel-inner" style={{ height: '15rem' }}>
                                                <div class="carousel-item active">
                                                    <img src={event.salon.thumbnail} class="d-block w-100" />
                                                </div>
                                                <div class="carousel-item">
                                                    <img src={event.platillo.thumbnail} class="d-block w-100" />
                                                </div>
                                            </div>
                                            <button class="carousel-control-prev" type="button" data-bs-target={`#${event.id}`} data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Previous</span>
                                            </button>
                                            <button class="carousel-control-next" type="button" data-bs-target={`#${event.id}`} data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                <span class="visually-hidden">Next</span>
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <h4>$ {event.importe.toLocaleString()}</h4>
                                                <h4>{formatDate(event.fecha, "%d/%b/%Y")}</h4>
                                            </div>
                                            <div className="col-12">
                                                Te tiende: <span className="fst-italic">{event.salon.gerente.name}</span>
                                            </div>
                                            {
                                                event.confirmado ?
                                                    <span className='badge mt-3 bg-success'>Confirmado</span>
                                                    :
                                                    <span className='badge mt-3 bg-warning'>No confirmado</span>
                                            }
                                        </div>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            <ModificarClienteForm cliente={cliente} />
            <NuevaSolicitudEventoForm cliente={cliente} />
        </>
    );
}



const ModificarClienteForm = ({ cliente }) => {

    const modalForm = useRef(null);


    async function handleSave() {


        const formData = new FormData(modalForm.current);
        const form_json = Object.fromEntries(formData.entries())

        await modificarCliente(cliente.id, form_json);

        modalForm.current.reset();
        alert("Cliente modificado correctamente");
        window.location.reload();
    }

    return (
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modificar cliente</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form class="modal-body" ref={modalForm}>
                        <div className="row gy-3">
                            <div className="col-12">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input type="text" defaultValue={cliente.name} className="form-control" id="name" name="name" />
                            </div>
                            <div className="col-12">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" defaultValue={cliente.email} className="form-control" id="email" name="email" />
                            </div>
                        </div>
                    </form>
                    <div class="modal-footer">
                        <Button type="button" secondary data-bs-dismiss="modal">Close</Button>
                        <Button type="button" data-bs-dismiss="modal" onClick={handleSave} primary>Save changes</Button>
                    </div>
                </div >
            </div >
        </div >
    )
}


const NuevaSolicitudEventoForm = ({ cliente }) => {

    const [data, setData] = useState({ menus: [], salones: [] });


    const [selectedPlatilloId, setSelectedPlatilloId] = useState('');
    const [selectedSalonId, setSelectedSalonId] = useState('');
    const [invitados, setInvitados] = useState('');
    

    const [cotizacion, setCotizacion] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {

                const menusData = await fetchMenus();
                const salonesData = await fetchSalones();
                setData({ menus: menusData, salones: salonesData });
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };
        fetchData();
    }, []);

    const { menus, salones } = data || {};


    useEffect(() => {
        const platilloSeleccionado = menus.find(p => p.id === selectedPlatilloId);
        const salonSeleccionado = salones.find(s => s.id === selectedSalonId);
        const numInvitados = parseInt(invitados, 10) || 0;

        if (numInvitados > salonSeleccionado?.capacidadMaxima) {
            setInvitados(salonSeleccionado?.capacidadMaxima.toString());
        }

        if (platilloSeleccionado && salonSeleccionado && numInvitados > 0) {
            const costoPlatillos = platilloSeleccionado.precio_mano_obra * numInvitados;
            const costoTotal = salonSeleccionado.costoRenta + costoPlatillos;
            setCotizacion(costoTotal);
        } else {
            setCotizacion(0);
        }
    }, [selectedPlatilloId, selectedSalonId, invitados, menus, salones]);


    async function handleSave(e) {
        e.preventDefault();
        

        const form_json = {
            platillo_id: selectedPlatilloId,
            salon_id: selectedSalonId,
            invitados: parseInt(invitados, 10),
            fecha: document.getElementById('fecha').value,
            user_id: document.getElementById('user_id').value,
        };


        await eventRequest(form_json);

        alert(`¡Evento solicitado correctamente! Cotización final: ${cotizacion.toFixed(2)}`);
        window.location.reload();
    }


    const formatCurrency = (value) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    return (
        <div className="modal fade" id="nuevaSolicitud" tabIndex="-1" aria-labelledby="nuevaSolicitudLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="nuevaSolicitudLabel">Nueva Solicitud de Evento</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form onSubmit={handleSave}>
                        <input type="text" name='user_id' id='user_id' hidden value={cliente?.id} />
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="platillo_id" className="form-label">Menú (Platillo)</label>
                                    <select id="platillo_id" name="platillo_id" className='form-select' required
                                        value={selectedPlatilloId}
                                        onChange={(e) => setSelectedPlatilloId(e.target.value)}
                                    >
                                        <option value="">Selecciona un platillo...</option>
                                        {menus?.map(menu => (
                                            <option key={menu.id} value={menu.id}>{menu.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="salon_id" className="form-label">Salón</label>
                                    <select id="salon_id" name="salon_id" className='form-select' required
                                        value={selectedSalonId}
                                        onChange={(e) => setSelectedSalonId(e.target.value)}
                                    >
                                        <option value="">Selecciona un salón...</option>
                                        {salones?.map(salon => (
                                            <option key={salon.id} value={salon.id}>{salon.name} (Cap. {salon.capacidadMaxima})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="fecha" className="form-label">Fecha y Hora</label>
                                    <input type="datetime-local" id="fecha" name="fecha" className="form-control" required />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="invitados" className="form-label">Número de Invitados</label>
                                    <input type="number" id="invitados" name="invitados" className="form-control" placeholder="Ej. 85" min="1" required
                                        value={invitados}
                                        onChange={(e) => setInvitados(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            {/* --- NUEVA SECCIÓN DE COTIZACIÓN --- */}
                            <hr className="my-4" />
                            <div className="text-center">
                                <h5 className="mb-3">Cotización Estimada</h5>
                                {cotizacion > 0 ? (
                                    <div>
                                        <p className="mb-1">Renta del Salón: <strong>{formatCurrency(salones.find(s => s.id === selectedSalonId)?.costoRenta || 0)}</strong></p>
                                        <p className="mb-1">Costo de Platillos ({invitados} x {formatCurrency(menus.find(p => p.id === selectedPlatilloId)?.precio_mano_obra || 0)}): <strong>{formatCurrency((menus.find(p => p.id === selectedPlatilloId)?.precio_mano_obra || 0) * (parseInt(invitados) || 0))}</strong></p>
                                        <h4 className="mt-2">Total: <span className="text-success">{formatCurrency(cotizacion)}</span></h4>
                                    </div>
                                ) : (
                                    <p className="text-muted">Por favor, completa los campos para ver la cotización.</p>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button type="button" secondary data-bs-dismiss="modal">Cerrar</Button>
                            <Button type="submit" primary>Guardar Solicitud</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
