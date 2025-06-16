import { Button } from "../../components/atoms/button/Button";
import { formatDate } from "../../utils/date.utils";
import { useEventsData } from "../../hooks/useEventsData";
import { useFilters } from "../../hooks/useFilters";
import { useEffect } from "react";
import { useSession } from "../../providers/session.provider"


export const ListEventos = () => {

    const { currentUser } = useSession();
    const { filters, handleFilterChange } = useFilters();
    const { events } = useEventsData(filters);


    useEffect(() => {
        if (currentUser.role != "GERENTE") return;
        handleFilterChange({
            target: {
                name: "salon_id",
                value: currentUser.salon_id,
            }
        })
    }, [currentUser])



    return (
        <div className="row gy-4">
            <div className="col-4 fs-3">Tus Eventos</div>
            <div className="col-8 d-flex justify-content-end align-items-center">
                Desde
                <div className="mx-3 me-5">
                    <input
                        type="date"
                        name="start_date"
                        className="form-control"
                        onChange={handleFilterChange}
                        value={filters.start_date || ''}
                    />
                </div>
                Hasta
                <div className="mx-3 me-5">
                    <input
                        type="date"
                        name="end_date"
                        className="form-control"
                        onChange={handleFilterChange}
                        value={filters.end_date || ''}
                    />
                </div>
                Confirmado
                <div className="form-check form-switch mx-3">
                    <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        name="confirmado"
                        onChange={handleFilterChange}
                        checked={!!filters.confirmado}
                    />
                </div>
            </div>
            <div className="col-12">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <td>Fecha</td>
                            <td>Cliente</td>
                            <td>Importe</td>
                            <td>Salón</td>
                            <td>Plantilla</td>
                            <td>Pagado</td>
                            <td>Confirmado</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            events.map(event => (
                                <tr key={event.id} >
                                    <td>{formatDate(event.fecha, "%d/%b/%Y %H:%M")}</td>
                                    <td>{event.user.name}</td>
                                    <td>$ {event.importe.toLocaleString()}</td>
                                    <td>{event.salon.name}</td>
                                    <td className={"bi text-center " + (!event.plantilla.length > 0 ? "bi-person-fill-x text-danger" : "bi-person-fill-check text-success")}></td>
                                    <td className={"bi text-center " + ((event.importe - event.pagos.reduce((accum, val) => accum + val, 0)) > 0 ? "bi-x-circle-fill text-danger" : "bi-check-circle-fill text-success")}></td>
                                    <td className={"bi text-center " + (!event.confirmado ? "bi-x-circle-fill text-danger" : "bi-check-circle-fill text-success")}></td>
                                    <td><Button className="bi bi-search" navigateTo={`/app/evento/${event.id}`}></Button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}