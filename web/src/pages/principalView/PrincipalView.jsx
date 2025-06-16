import { useSession } from "../../providers/session.provider"
import { Navigate } from "react-router-dom";


export const RoleRouter = ({  }) => {

    const { currentUser } = useSession();

    if (currentUser.role == "ADMIN") {
        return <Navigate to="/app/eventos" />
    }

    if (currentUser.role == "CLIENTE") {
        return <Navigate to={"/app/customers/" + currentUser.id} />
    
    }

    if (currentUser.role == "GERENTE"){
        return <Navigate to="/app/eventos" />
    
    }
}