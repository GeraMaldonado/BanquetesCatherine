import { useLocation, useSearchParams, Navigate, Outlet } from "react-router-dom";


export const Error404Handler = () => {
    const location = useLocation();
    const [searchParams, _] = useSearchParams();

    const redirect = searchParams.get("redirect");

    return (
        (location.pathname === "/" && redirect) ?
            <Navigate to={redirect} />
            :
            <Outlet />
    )


}