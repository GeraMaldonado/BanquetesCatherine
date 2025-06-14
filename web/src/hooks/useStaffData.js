import { useState, useEffect } from "react"
import { fetchStaffMembers, deleteStaff, nuevoStaff } from "../services/staff.services"

export const useStaffData = () => {

    const [staffData, setStaffData] = useState([])
    const [loading, setLoading] = useState(false)


    const fetch = async () => {
        setLoading(true)
        const data = await fetchStaffMembers()
        setStaffData(data)
        setLoading(false)
    }

    useEffect(() => {
        fetch()
    }, [])

    async function handleRegistrarNuevoStaff() {
        const newName = prompt("¿Cual es el nombre?");

        await nuevoStaff(newName);
        await fetch();
    }

    async function handleEliminarStaff(id) {
        await deleteStaff(id);
        await fetch();
    }

    return { staffData, loading, handleEliminarStaff, handleRegistrarNuevoStaff  }
}