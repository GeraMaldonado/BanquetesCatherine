import { getData, putData, paramsFromObjetct, postData } from "../utils/api.utils"; 

export const fetchEvents = async (params = {}) => await getData("/events/reservaciones?" + paramsFromObjetct(params));

export const updateEvent = async (eventId, eventData) => await putData(`/events/reservaciones/${eventId}`, eventData);

export const eventRequest = async (data) => await postData("/reservaciones/solicitudes-banquete", data);
