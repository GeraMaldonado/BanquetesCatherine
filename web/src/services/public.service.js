import { getData, postData } from "../utils/api.utils";

export const fetchSalones = async () => await getData("/public/salones");

export const fetchMenus = async () => await getData("/public/platillos");

export const requestEvent = async (formdata) => await postData("/public/solicitudes-banquete", formdata)