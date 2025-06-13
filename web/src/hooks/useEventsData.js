import { fetchEvents, updateEvent } from "../services/eventos.service";
import { useState, useEffect, useMemo } from "react";

export const useEventsData = (filters) => {
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const getEvents = async () => {
        setLoading(true);
        const events = await fetchEvents(filters);
        setEvents(events);
        setLoading(false);
    }


    useEffect(() => {

        getEvents();

    }, [filters]);




    // Metodos y atributos para cuando solo usas una nota

    const event = events[0];
     


    
    return { events, event }
}


export const useEventData = (id) => {
    
    const [event, setEvent] = useState({});
    const [loading, setLoading] = useState(true);

    const getEvents = async () => {
        setLoading(true);
        const events = await fetchEvents({id:id});
        setEvent(events[0]);
        setLoading(false);
    }


    useEffect(() => {

        getEvents();

    }, []);
     

    async function handleConfirmEvent() {
        setLoading(true);
        const response = await updateEvent(id, {confirmado: event.confirmado ? false : true});
        
        if (!response.error) {
            await getEvents();
            setLoading(false);
        }

    }

    async function handleUpdateInvitados() {
        const newInvitados = prompt("Nueva cantidad de invitados:");

        if (!parseInt(newInvitados)) {
            alert("No has introducido un valorlor válido")
            return
        }
        
        
        const newValue = parseInt(newInvitados);
        
        setLoading(true);

        const response = await updateEvent(id, {invitados: newValue});
        
        if (!response.error) {
            await getEvents();
            setLoading(false);
        }

    }


    
    return { event, loading, handleConfirmEvent, handleUpdateInvitados }
}