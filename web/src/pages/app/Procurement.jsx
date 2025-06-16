import { useState, useEffect, useRef } from "react";
import { getProcurementReportData, postProcurement, fetchIngredientes } from "../../services/menu.service";
import CumulativeChart from "../../components/organisms/chart/procurement"; // Importa el componente de la gráfica


export const Procurement = () => {
    const horizonteRef = useRef(null);
    const [procurement, setProcurement] = useState([]);
    const [endDateForChart, setEndDateForChart] = useState("");

    // --- NUEVOS ESTADOS PARA EL FORMULARIO DE REGISTRO ---
    const [showNewDeliveryForm, setShowNewDeliveryForm] = useState(false); // Estado para mostrar/ocultar el formulario
    const [availableIngredients, setAvailableIngredients] = useState([]); // Almacena la lista de todos los ingredientes
    const [deliveryDate, setDeliveryDate] = useState(''); // Fecha para la nueva entrega
    const [deliveryIngredients, setDeliveryIngredients] = useState([
        { ingrediente_id: '', cantidad: '' }
    ]); // Array para los ingredientes de la nueva entrega

    // Función para la carga inicial de datos del reporte y de ingredientes
    async function initialFetch() {
        const fechaHorizonte = horizonteRef.current.value;
        
        // Se obtienen los datos para la gráfica
        const req = await getProcurementReportData(fechaHorizonte);
        setProcurement(req);
        setEndDateForChart(fechaHorizonte);

        // Se obtienen los ingredientes para el formulario de nueva entrega
        try {
            const ingredientsData = await fetchIngredientes();
            setAvailableIngredients(ingredientsData);
        } catch (error) {
            console.error("Error al obtener los ingredientes:", error);
            // Opcional: manejar el error en la UI
        }
    }

    useEffect(() => {
        const today = new Date();
        today.setDate(today.getDate() + 15);

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        if (horizonteRef.current) {
            horizonteRef.current.value = formattedDate;
        }

        initialFetch();
    }, []);

    function handleHorizonteChange() {
        initialFetch();
    }

    // --- MANEJADORES PARA EL FORMULARIO DE NUEVA ENTREGA ---

    // Maneja cambios en los inputs de cada fila de ingrediente
    const handleIngredientChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...deliveryIngredients];
        list[index][name] = value;
        setDeliveryIngredients(list);
    };

    // Agrega una nueva fila para un ingrediente
    const addIngredientRow = () => {
        setDeliveryIngredients([...deliveryIngredients, { ingrediente_id: '', cantidad: '' }]);
    };

    // Elimina una fila de ingrediente
    const removeIngredientRow = (index) => {
        const list = [...deliveryIngredients];
        list.splice(index, 1);
        setDeliveryIngredients(list);
    };
    
    // Maneja el envío del formulario de nueva entrega
    const handleNewDeliverySubmit = async (event) => {
        event.preventDefault();

        // Filtra para no enviar ingredientes sin seleccionar o con cantidad 0
        const ingredientesParaEnviar = deliveryIngredients.filter(
            (ing) => ing.ingrediente_id && ing.cantidad > 0
        ).map(ing => ({
            ...ing,
            cantidad: parseFloat(ing.cantidad) // Asegura que la cantidad sea un número
        }));

        if (!deliveryDate || ingredientesParaEnviar.length === 0) {
            alert("Por favor, completa la fecha y al menos un ingrediente.");
            return;
        }
        
        // Formatea la fecha para que coincida con "YYYY-MM-DD HH:mm"
        const formattedDeliveryDate = deliveryDate.replace('T', ' ');

        const newDeliveryData = {
            fecha_recepcion: formattedDeliveryDate,
            ingredientes: ingredientesParaEnviar,
        };

        try {
            await postProcurement(newDeliveryData);
            alert("Nueva entrega registrada con éxito.");
            // Limpia el formulario y lo oculta
            setDeliveryDate('');
            setDeliveryIngredients([{ ingrediente_id: '', cantidad: '' }]);
            setShowNewDeliveryForm(false);
            // Opcional: Vuelve a cargar los datos de la gráfica para reflejar la nueva entrega
            initialFetch();
        } catch (error) {
            console.error("Error al registrar la nueva entrega:", error);
            alert("Hubo un error al registrar la entrega. Por favor, intenta de nuevo.");
        }
    };

    return (
        <div className="row">
            <div className="col-1"></div>
            <div className="col-10">
                <div className="row gy-5">
                    {/* Sección del reporte de necesidades */}
                    <div className="col-12 fs-3 fw-bold d-flex justify-content-between align-items-end">
                        Necesidades para los siguientes días
                        <span className="fs-6 ms-3 fw-normal text-end">Eventos hasta el <input onChange={handleHorizonteChange} type="date" className="form-control" ref={horizonteRef} /></span>
                    </div>
                    <div className="col-12 ">
                        <CumulativeChart data={procurement} endDate={endDateForChart} />
                    </div>

                    {/* --- NUEVA SECCIÓN PARA REGISTRAR ENTREGA --- */}
                    <div className="col-12">
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="fs-4 fw-bold">Registrar Nueva Entrega de Ingredientes</h3>
                            <button className="btn btn-primary" onClick={() => setShowNewDeliveryForm(!showNewDeliveryForm)}>
                                {showNewDeliveryForm ? 'Ocultar Formulario' : 'Registrar Nueva Entrega'}
                            </button>
                        </div>

                        {showNewDeliveryForm && (
                            <form onSubmit={handleNewDeliverySubmit} className="mt-4 p-4 border rounded bg-light">
                                <div className="mb-3">
                                    <label htmlFor="fecha_recepcion" className="form-label fw-bold">Fecha y Hora de Recepción</label>
                                    <input
                                        type="datetime-local"
                                        id="fecha_recepcion"
                                        className="form-control"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <h5 className="mt-4">Ingredientes</h5>
                                
                                {deliveryIngredients.map((ingrediente, index) => (
                                    <div key={index} className="row g-2 mb-2 align-items-center">
                                        <div className="col-md-6">
                                            <label className="form-label visually-hidden">Ingrediente</label>
                                            <select
                                                name="ingrediente_id"
                                                className="form-select"
                                                value={ingrediente.ingrediente_id}
                                                onChange={(e) => handleIngredientChange(index, e)}
                                                required
                                            >
                                                <option value="">Selecciona un ingrediente...</option>
                                                {availableIngredients.map((ing) => (
                                                    <option key={ing.id} value={ing.id}>
                                                        {ing.nombre} ({ing.unidad})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                             <label className="form-label visually-hidden">Cantidad</label>
                                            <input
                                                name="cantidad"
                                                type="number"
                                                className="form-control"
                                                placeholder="Cantidad"
                                                value={ingrediente.cantidad}
                                                onChange={(e) => handleIngredientChange(index, e)}
                                                required
                                                min="0.01"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            {deliveryIngredients.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => removeIngredientRow(index)}
                                                >
                                                    Eliminar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary me-2"
                                        onClick={addIngredientRow}
                                    >
                                        Añadir Ingrediente
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Registrar Entrega
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-1"></div>
        </div>
    );
}