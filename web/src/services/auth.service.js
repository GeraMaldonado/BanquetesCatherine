import { postData } from "../utils/api.utils";
const AUTH_STORAGE_KEY = 'currentUser';


export const login = async (credentials) => {
    try {

        const response = await postData('/auth/login', credentials);

        if (response.error) {
            throw new Error(response.error);
        }

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
        return response;


    } catch (error) {
        console.error('Error en el servicio de login:', error);
        // Si el error ya es una instancia de Error (lanzado por apiService o aquí), lo relanzamos.
        // De lo contrario, creamos uno nuevo.
        throw error instanceof Error ? error : new Error(error.message || 'Error durante el inicio de sesión.');
    }
};

/**
 * Cierra la sesión del usuario actual eliminando sus datos de localStorage.
 */
export const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Aquí podrías añadir lógica adicional, como redirigir al login o notificar a otros componentes.
};


export const getCurrentUser = () => {
    const user = localStorage.getItem(AUTH_STORAGE_KEY);
    return user ? JSON.parse(user) : null;
};
