import { useSession } from "../../providers/session.provider"
import { Navigate } from "react-router-dom";


export const RoleRouter = ({  }) => {

    const { currentUser } = useSession();

    if (currentUser.role == "ADMIN") {
        return <Navigate to="/app/eventos" />
    }
}