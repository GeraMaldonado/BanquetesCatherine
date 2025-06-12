import { useState } from "react";

export const useFilters = () => {
    const [filters, setFilters] = useState({});

    const handleFilterChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? checked : value // Handle checkbox 'checked' property
        }));
    };

    console.log("Current Filters:", filters); // Better logging for debugging

    return { filters, handleFilterChange };
};