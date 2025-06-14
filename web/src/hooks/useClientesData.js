import { useState, useEffect } from "react";
import { fetchClientes, fetchClienteById, modificarCliente } from "../services/clientes.service"

export const useClientesData = () => {

    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(false)

    const fetch =  async () => {
        setLoading(true)
        const data = await fetchClientes()
        setClientes(data)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])


    return {loading, clientes}
}


export const useClienteData = (id) => {

    const [cliente, setCliente] = useState({})
    const [loading, setLoading] = useState(false)

    const fetch =  async () => {
        setLoading(true)
        const data = await fetchClienteById(id)
        setCliente(data)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])

    
    async function handleModificarCliente(newData) {
        await modificarCliente(newData)
        await fetch()
    }


    return {loading, cliente, handleModificarCliente}

}