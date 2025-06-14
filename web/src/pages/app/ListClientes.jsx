import { useClientesData } from "../../hooks/useClientesData";
import { Button } from "../../components/atoms/button/Button";



export const ListClientes = () => {

    const { loading, clientes } = useClientesData();

    if (loading) { 
        return <div>Cargando...</div>
     }



    return (
        <div className="row gy-4">
            <div className="col-12 fs-3">Tus clientes</div>
            <div className="col-12">
                <table className="table">
                    <thead>
                        <tr className="fw-bold">
                            <td>Nombre</td>
                            <td>Contacto</td>
                            <td>Eventos</td>
                            <td className="text-end">Importe promedio</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            clientes.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.name}</td>
                                    <td>{cliente.email}</td>
                                    <td>{cliente.eventos.length} Eventos rsv</td>
                                    <td className="text-end">$ {cliente.eventos.length > 0 ? (cliente.eventos.reduce((accum, value) => accum + value.importe, 0) / cliente.eventos.length).toLocaleString() : "-"}</td>
                                    <td><Button>Ver</Button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}