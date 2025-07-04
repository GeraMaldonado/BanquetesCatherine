import { Outlet, Navigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useSession } from '../../../providers/session.provider';
import { Button } from '../../atoms/button/Button';
import { Image } from '../../atoms/image/Image';
import { NavBar } from './navbar';


const LoadingScreen = () => (
    <div className="vw-100 vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
        </div>
    </div>
);

export const AppLayout = () => {
    const { isAuthenticated, isLoading, currentUser, logout } = useSession();
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    const links = {
        "ADMIN": [
            {
                icon: "bi-calendar-event-fill",
                to: "/app/eventos"
            },
            {
                icon: "bi-people-fill",
                to: "/app/staff"
            },
            {
                icon: "bi-star-fill",
                to: "/app/customers"
            },
            {
                icon: "bi-bar-chart-fill",
                to: "/app/procurement"
            },
            {
                icon: "bi-sliders",
                to: "/app/configuracion"
            },
        ],
        "CLIENTE": []
    }



    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4">
                <RouterLink className="navbar-brand d-flex align-items-center" to="/app">
                    <Image src="/LOGO.svg" style={{ height: "30px" }} className="me-2" />
                    Catherine Co. App
                </RouterLink>
                <div className="ms-auto">
                    {currentUser && <span className="navbar-text me-3">Hola, {currentUser.name} ({currentUser.role})</span>}
                    <Button onClick={logout} secondary small>Cerrar Sesión</Button>
                </div>
            </nav>
            <main className="container mt-4 p-4 ps-5">
                <NavBar links={links[currentUser.role]} />
                <Outlet />
            </main>
        </div>
    );
};