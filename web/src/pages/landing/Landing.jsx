import { useRef, useState } from "react";
import { Button } from "../../components/atoms/button/Button"
import { Image } from "../../components/atoms/image/Image"

import { useLandingData } from "./useLandingData";


export const Landing = ({ }) => {

    const cotizadorRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        salonesData,
        menuData,
        isSubmitting,
        formData,
        handleRsvFormChange,
        handleConfirmApartado,
        cotizacion
    } = useLandingData();


    const handleScrollToCotizador = () => {
        cotizadorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };


    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleFormSubmit = async () => {
        const result = await handleConfirmApartado();

        if (result.error) {
            alert("Ha ocurrido un error!")
        }

        alert("Solicitud exitosa! Inicia sesión para dar seguimiento.")

        
        handleCloseModal()
    }


    return (
        <>
            <div className="container">
                <div className="row py-3 gy-5">
                    <div className="col-12 d-flex justify-content-between align-items-center position-sticky bg-white py-2" style={{ top: "0", left: 0, zIndex: 1020 }}> {/* Aumentado z-index y fondo para visibilidad */}
                        <span className="fs-4 fw-bold d-flex align-items-center">
                            <Image src="LOGO.svg" style={{ height: "35px" }} className="me-3" />
                            Catherine Co.
                        </span>
                        <Button navigateTo="login" primary>Login</Button>

                    </div>
                    <div className="col-12 position-relative">
                        <Image src="boda.jpg" className="w-100 rounded rounded-4" style={{ height: "80vh", objectFit: "cover", objectPosition: "center", filter: "brightness(70%)" }} />
                        <div className="w-100 h-100 position-absolute top-0 start-0 d-flex align-items-center flex-column text-white justify-content-center">
                            <h1>Tu Evento Soñado Comienza Aquí</h1>
                            <h6>Crea memorias inolvidables con nuestro excepcional servicio de catering. Comienza cotizando tu evento.</h6>
                            <Button secondary className="px-5 mt-4" onClick={handleScrollToCotizador}>Ir a cotizar</Button>
                        </div>
                    </div>
                    <div className="col-12 d-flex flex-column align-items-center">
                        <div className="col-12 fs-4 fw-bold mb-4">Salones con convenio</div>
                        <div className="col-12 d-flex overflow-x-auto py-3">
                            {
                                salonesData?.map(salon => (
                                    <div key={salon._id} className="col-12 col-md-4 col-lg-3 me-4 d-flex flex-column flex-shrink-0" style={{ width: "280px" }}>
                                        <Image src={salon.thumbnail} className="rounded" style={{ height: "180px", objectFit: "cover" }} />
                                        <b className="mt-2">{salon.name}</b>
                                        <p className="text-muted small">$ {salon.costoRenta.toLocaleString()} MXN | Hasta {salon.capacidadMaxima} p.</p>
                                    </div>
                                )) ?? <div>Cargando...</div>
                            }
                        </div>
                    </div>
                    <div className="col-12 d-flex flex-column align-items-center">
                        <div className="col-12 fs-4 fw-bold mb-4">Menú disponible</div>
                        <div className="col-12 d-flex overflow-x-auto py-3">
                            {
                                menuData.map(platillo => (
                                    <div key={platillo._id} className="col-12 col-md-4 col-lg-3 me-4 d-flex flex-column flex-shrink-0" style={{ width: "280px" }}>
                                        <Image src={platillo.thumbnail} className="rounded" style={{ height: "180px", objectFit: "cover" }} />
                                        <b className="mt-2">{platillo.nombre}</b>
                                        <b className="my-2">$ {platillo.precio_mano_obra.toLocaleString()} MXN p.p.</b>
                                        <p className="text-muted small">{platillo.descripcion}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-12 d-flex flex-column align-items-center mb-5" id="cotizador" ref={cotizadorRef}>
                        <div className="col-12 fs-4 fw-bold mb-4 text-center">¿Listo para planear tu evento?</div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-2"></div>
                                <div className="col-4 border-end px-4">
                                    <label htmlFor="salonSelect" className="form-label">Escoge un salón de eventos</label>
                                    <select id="salonSelect" className="form-select" value={formData.salon_id} name="salon_id" onChange={handleRsvFormChange}>
                                        {
                                            salonesData.map(salon => (
                                                <option key={salon.id} value={salon.id}>{salon.name}</option>
                                            ))
                                        }
                                    </select>
                                    <label className="mt-3 form-label" htmlFor="menuSelect">¿Qué menú darás a tus invitados?</label>
                                    <select id="menuSelect" className="form-select" value={formData.platillo_id} name="platillo_id" onChange={handleRsvFormChange}>
                                        {
                                            menuData.map(platillo => (
                                                <option key={platillo.id} value={platillo.id}>{platillo.nombre} - ${platillo.precio_mano_obra} pp</option>
                                            ))
                                        }
                                    </select>
                                    <label className="mt-3 form-label" htmlFor="guestCountInput" >Cantidad de invitados</label>
                                    <input id="guestCountInput" type="number" className="form-control" value={formData.invitados} name="invitados" onChange={handleRsvFormChange} min="1" />
                                    <label className="mt-3 form-label" htmlFor="eventDateInput">Fecha de tu evento</label>
                                    <input id="eventDateInput" type="datetime-local" className="form-control" value={formData?.fecha} name="fecha" onChange={handleRsvFormChange} />
                                </div>
                                <div className="col-4 d-flex flex-column justify-content-center">
                                    <h1>
                                        ${(cotizacion || 0).toLocaleString()} MXN
                                    </h1>
                                    <label htmlFor="">Costo estimado de tu evento</label>
                                    <br />
                                    <p>Incluye:</p>
                                    <ul>
                                        <li>Platillos</li>
                                        <li>Renta del salón</li>
                                        <li>Servicio de meseros</li>
                                    </ul>
                                    <Button className="mt-2" accent onClick={handleOpenModal}>¡Solicitar apartado!</Button>
                                </div>
                                <div className="col-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Bootstrap */}
            {isModalOpen && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} aria-labelledby="apartadoModalLabel" aria-hidden={!isModalOpen}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="apartadoModalLabel">Confirmar Solicitud de Apartado</h5>
                                <Button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></Button>
                            </div>
                            <div className="modal-body">
                                <p>Por favor, proporciona los siguientes detalles adicionales para tu evento:</p>
                                <h6 className="mt-3 mb-2">Datos del Cliente</h6>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="clientNameInput" className="form-label">Nombre(s)</label>
                                        <input type="text" className="form-control" id="clientNameInput" name="user.name" value={formData.user?.name} onChange={handleRsvFormChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="clientEmailInput" className="form-label">Correo Electrónico (será tu usuario)</label>
                                    <input type="email" className="form-control" id="clientEmailInput" name="user.email" value={formData.user?.email} onChange={handleRsvFormChange} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="clientPasswordInput" className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" id="clientPasswordInput" name="user.password" value={formData.user?.password} onChange={handleRsvFormChange} required />
                                    <div id="passwordHelpBlock" className="form-text">
                                        Tu contraseña debe tener al menos 8 caracteres.
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <Button type="button" secondary onClick={handleCloseModal}>Cancelar</Button>
                                <Button type="button" primary onClick={handleFormSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? 'Procesando...' : 'Confirmar Apartado'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}