import { getData, postData } from "../utils/api.utils";

export const getProcurementReportData = async (end) => await getData(`/reports/ingredientes-necesarios?end=${end}`)

export const postProcurement = async (data) => await postData("/menu/ingredientes/procurement", data);

export const fetchIngredientes = async () => await getData("/menu/ingredientes");

export const postPlatillo = async (data) => await postData("/menu/platillos", data);

export const postIngrediente = async (data) => await postData("/menu/ingredientes", data);