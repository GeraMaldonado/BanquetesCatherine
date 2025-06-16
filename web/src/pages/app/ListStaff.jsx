import { useStaffData } from '../../hooks/useStaffData';
import { Button } from '../../components/atoms/button/Button'

export const ListStaff = ({ }) => {
    
    const { staffData, loading, handleEliminarStaff, handleRegistrarNuevoStaff } = useStaffData();


    if (loading) {
        return <div className="container mt-5"><p className="text-center">Cargando lista del personal...</p></div>;
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Lista de Personal</h1>
            <Button onClick={handleRegistrarNuevoStaff} className="mb-3" primary>+ Nuevo colaborador</Button>
            {staffData.length === 0 ? (
                <p className="text-center">No hay miembros del personal para mostrar.</p>
            ) : (
                <div className="row">
                    <div className="col-6">
                        <div className="table-responsive">
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Nombre</th>
                                        <th scope='col'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staffData.map((staff) => (
                                        <tr key={staff.id}>
                                            <td>{staff.nombre}</td>
                                            <td><Button onClick={()=>handleEliminarStaff(staff.id)} accent>Eliminar</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
