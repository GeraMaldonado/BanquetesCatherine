import { getData, postData, deleteData } from '../utils/api.utils'


export const fetchStaffMembers = async () => await getData(`/hr/personal`);



export const fetchAvailableStaffByDate = async (dateAvailable) => await getData(`/hr/personal?availability=${dateAvailable}`);


export const updatePlantilla = async (eventID, plantilla) => await postData(`/events/reservaciones/${eventID}/update-staff`, plantilla);


export const nuevoStaff = async (name) => await postData("/hr/personal", {"nombre": name})

export const deleteStaff = async (id) => await deleteData(`/hr/personal/${id}`)