import React from 'react';
import { useParams } from 'react-router-dom';
import { useEventData } from '../../hooks/useEventsData';
import { formatDate } from '../../utils/date.utils'
import { Button } from '../../components/atoms/button/button'

// Componente de Spinner para la carga
const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3 fs-5">Cargando datos del evento...</span>
    </div>
);

// Componente principal para mostrar los detalles del evento
export const EventoDetalle = () => {

    const { eventId } = useParams();
    const { event, loading, handleConfirmEvent, handleUpdateInvitados } = useEventData(eventId);

    // Función para formatear moneda
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };


    if (loading) {
        return <LoadingSpinner />;
    }

    if (!event) {
        return <div className="alert alert-danger text-center mt-4">No se pudo cargar la información del evento.</div>;
    }


    return (
        <div className="container mt-4 mb-5">
            <div className="row g-4">
                <div className="col-6 d-flex align-items-center">
                    <Button className="bi bi-arrow-90deg-left" navigateTo="/app/eventos"> Regresar</Button>
                </div>
                <div className="col-6 d-flex flex-column justify-content-center align-items-end">
                    Acciones rapidas
                    <div className="d-flex mt-3 gx-2">
                        <Button onClick={handleConfirmEvent} className={"mx-2 " + (event.confirmado ? "btn-danger" : "btn-warning")} >{event.confirmado ? "Cancelar confirmacion" : "Confirmar evento"}</Button>
                        <Button onClick={handleUpdateInvitados} className="ms-2" accent>Actualizar invitados</Button>
                    </div>
                </div>
                {/* Columna Izquierda: Detalles del Evento */}
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">Detalles del Evento</h4>
                        </div>
                        <div className="card-body">
                            {/* --- Sección de Datos Generales --- */}
                            <h5 className="card-title border-bottom pb-2 mb-3">Datos Generales</h5>
                            <dl className="row">
                                <dt className="col-sm-4">ID del Evento:</dt>
                                <dd className="col-sm-8 text-muted">{event.id}</dd>
                                
                                <dt className="col-sm-4">Fecha y Hora:</dt>
                                <dd className="col-sm-8 fw-bold">{formatDate(event.fecha, "%d de %b del %Y, %H:%M hrs")}</dd>
                                
                                <dt className="col-sm-4">Estado:</dt>
                                <dd className="col-sm-8">
                                    {event.confirmado ?
                                        <span className="badge bg-success">Confirmado</span> :
                                        <span className="badge bg-warning text-dark">Pendiente</span>
                                    }
                                </dd>

                                <dt className="col-sm-4">Nº de Invitados:</dt>
                                <dd className="col-sm-8">{event.invitados} personas (Capacidad al {(event.invitados / event.salon.capacidadMaxima * 100).toFixed(0)} %)</dd>
                                
                                <dt className="col-sm-4">Importe Total:</dt>
                                <dd className="col-sm-8 fs-5 text-accent fw-bold">{formatCurrency(event.importe)}</dd>
                            </dl>

                            <hr className="my-4" />

                            {/* --- Sección del Salón --- */}
                            {event.salon && (
                                <>
                                    <h5 className="card-title border-bottom pb-2 mb-3">Salón Contratado</h5>
                                    <dl className="row">
                                        <dt className="col-sm-4">Nombre:</dt>
                                        <dd className="col-sm-8">{event.salon.name}</dd>

                                        <dt className="col-sm-4">Capacidad Máxima:</dt>
                                        <dd className="col-sm-8">{event.salon.capacidadMaxima} personas</dd>

                                        <dt className="col-sm-4">Costo de Renta:</dt>
                                        <dd className="col-sm-8">{formatCurrency(event.salon.costoRenta)}</dd>

                                        <dt className="col-sm-4">Gerente a cargo:</dt>
                                        <dd className="col-sm-8">{event.salon.gerente.name} ({event.salon.gerente.email})</dd>
                                    </dl>
                                    <hr className="my-4" />
                                </>
                            )}
                            
                            {/* --- Sección del Platillo --- */}
                            {event.platillo && (
                                <>
                                    <h5 className="card-title border-bottom pb-2 mb-3">Platillo Seleccionado</h5>
                                    <dl className="row">
                                        <dt className="col-sm-4">Nombre:</dt>
                                        <dd className="col-sm-8">{event.platillo.nombre}</dd>

                                        <dt className="col-sm-4">Descripción:</dt>
                                        <dd className="col-sm-8">{event.platillo.descripcion}</dd>
                                        
                                        <dt className="col-sm-4">Costo de Mano de Obra:</dt>
                                        <dd className="col-sm-8">{formatCurrency(event.platillo.precio_mano_obra)} (por platillo)</dd>
                                    </dl>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Tarjetas Visuales */}
                <div className="col-lg-4">
                    <div className="d-flex flex-column gap-4">

                        {/* Card del Cliente */}
                        {event.user && (
                            <div className="card shadow-sm">
                                <div className="card-header">
                                    {/* Para el ícono, asegúrate de tener Bootstrap Icons instalado */}
                                    {/* <i className="bi bi-person-circle me-2"></i> */}
                                    Cliente
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{event.user.name}</h5>
                                    <p className="card-text text-muted">{event.user.email}</p>
                                    <span className="badge bg-secondary">{event.user.role}</span>
                                </div>
                            </div>
                        )}

                        {/* Card del Salón */}
                        {event.salon && (
                            <div className="card shadow-sm">
                                <img src={event.salon.thumbnail} className="card-img-top" alt={`Imagen de ${event.salon.name}`} style={{ height: '180px', objectFit: 'cover' }}/>
                                <div className="card-body">
                                    <h5 className="card-title">{event.salon.name}</h5>
                                    <p className="card-text">Un lugar perfecto para tu evento.</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Card del Platillo */}
                        {event.platillo && (
                            <div className="card shadow-sm">
                                <img src={event.platillo.thumbnail} className="card-img-top" alt={`Imagen de ${event.platillo.nombre}`} style={{ height: '180px', objectFit: 'cover' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{event.platillo.nombre}</h5>
                                    <p className="card-text text-muted fst-italic">"{event.platillo.descripcion}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};