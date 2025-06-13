import { useState, useEffect } from "react"
import { fetchSalones, fetchMenus, requestEvent } from "../../services/public.service";

export const useLandingData = () => {
    const [salonesData, setSalonesData] = useState([]);
    const [menuData, setMenuData] = useState([]);



    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({});


    useEffect(() => {
        const getSalones = async () => {
            try {
                const data = await fetchSalones();
                setSalonesData(data);
                if (data.length > 0) {
                    setFormData((last) => ({
                        ...last,
                        salon_id: data[0].id,
                    }));
                }
            } catch (error) {
                console.error("Error fetching salones:", error);
            }
        };

        const getMenus = async () => {
            try {
                const data = await fetchMenus();
                setMenuData(data);
                if (data.length > 0) {
                    setFormData((last) => ({
                        ...last,
                        platillo_id: data[0].id,
                    }));
                }
            } catch (error) {
                console.error("Error fetching menus:", error);
            }
        };

        getSalones();
        getMenus();
    }, []);

    function handleRsvFormChange(e) {
        const value = e.target.value;
        const name = e.target.name;

        const [key, subkey] = name.split('.');


        setFormData(last => {

            if (subkey) {
                return {
                    ...last,
                    [key]: {
                        ...(last[key] || {}),
                        [subkey]: value
                    }
                }
            }

            return {
                ...last,
                [name]: value
            }
        });

    }


    const handleConfirmApartado = async () => {

        setIsSubmitting(true);
        try {
            
            const response = await requestEvent(formData);

            return  response;

        } catch (error) {
            console.error("Error en el proceso de apartado:", error);
            alert("Ocurrió un error inesperado. Por favor, intenta más tarde.");
        } finally {
            setIsSubmitting(false);
            setFormData({});
        }
    };


    const cotizacion = (formData.invitados * menuData.find(m => m.id == formData.platillo_id)?.precio_mano_obra) + salonesData.find(s => s.id == formData.salon_id)?.costoRenta;

    
    return {
        salonesData,
        menuData,
        isSubmitting,
        formData,
        handleRsvFormChange,
        handleConfirmApartado,
        cotizacion
    }
}