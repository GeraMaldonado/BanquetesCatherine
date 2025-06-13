import { getData, putData } from '../utils/api.utils'


export const fetchClientes = async () => await getData("/clientes");

export const fetchClienteById = async (id) => await getData(`/clientes/${id}`);

export const modificarCliente = async (id, cliente) => await putData(`/clientes/${id}`, cliente);


