import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
// ---- INICIO DE MODIFICACIONES ----
// 1. Importar tu función de formato de fecha
import { formatDate } from '../../../utils/date.utils';
// ---- FIN DE MODIFICACIONES ----


// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CumulativeChart = ({ data, endDate }) => {
  const [chartData, setChartData] = useState(null);
  const [uniqueIngredients, setUniqueIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');

  useEffect(() => {
    if (data && data.length > 0) {
      const ingredients = new Map();
      data.forEach(d => {
        d.ingredientes.forEach(ing => {
          if (!ingredients.has(ing.id)) {
            ingredients.set(ing.id, ing.nombre);
          }
        });
      });
      const ingredientList = Array.from(ingredients, ([id, nombre]) => ({ id, nombre }));
      setUniqueIngredients(ingredientList);
      if (ingredientList.length > 0) {
        setSelectedIngredient(ingredientList[0].id);
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0 && selectedIngredient && endDate) {
      const allDates = eachDayOfInterval({
        start: new Date(),
        end: parseISO(endDate),
      });

      // ---- INICIO DE MODIFICACIONES ----
      // 2. Usar la función formatDate para las etiquetas del eje X
      const labels = allDates.map(date => {
        // Se crea el string de fecha en el formato requerido por tu función
        const dateString = `${format(date, 'yyyy-MM-dd')} 00:00`;
        // Se usa la función importada para formatear la etiqueta
        return formatDate(dateString, '%d/%b');
      });
      // ---- FIN DE MODIFICACIONES ----

      const getIngredientDataForDate = (date, ingredientId) => {
        const relevantData = data
          .filter(d => parseISO(d.fecha) <= date)
          .sort((a, b) => parseISO(b.fecha) - parseISO(a.fecha));

        if (relevantData.length > 0) {
          const ingredient = relevantData[0].ingredientes.find(ing => ing.id === ingredientId);
          return ingredient || { cantidad_necesaria_acumulada: 0, cantidad_esperada_recibir_acumulada: 0 };
        }
        return { cantidad_necesaria_acumulada: 0, cantidad_esperada_recibir_acumulada: 0 };
      };

      const necessaryData = [];
      const expectedData = [];

      allDates.forEach(date => {
        const ingredientData = getIngredientDataForDate(date, selectedIngredient);
        necessaryData.push(ingredientData.cantidad_necesaria_acumulada);
        expectedData.push(ingredientData.cantidad_esperada_recibir_acumulada);
      });
      
      const selectedIngredientInfo = uniqueIngredients.find(ing => ing.id === selectedIngredient);

      setChartData({
        labels,
        datasets: [
          {
            label: `Cantidad Necesaria Acumulada (${selectedIngredientInfo?.nombre || ''})`,
            data: necessaryData,
            borderColor: '#4A4A4A',
            tension: 0.4,
            pointRadius: 0,
            fill: false,
          },
          {
            label: `Cantidad Esperada Acumulada (${selectedIngredientInfo?.nombre || ''})`,
            data: expectedData,
            borderColor: 'orange',
            tension: 0.4,
            pointRadius: 0,
            fill: false,
          },
        ],
      });
    }
  }, [data, endDate, selectedIngredient, uniqueIngredients]);

  const handleIngredientChange = (event) => {
    setSelectedIngredient(event.target.value);
  };

  if (!chartData) {
    return <div>Cargando gráfico...</div>;
  }

  return (
    <div style={{ width: '90%', margin: 'auto' }}>
      <h2>Gráfico Acumulado de Ingredientes</h2>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="ingredient-select" className='me-3'>Selecciona un ingrediente: </label>
        <select id="ingredient-select" className='form-select w-25' value={selectedIngredient} onChange={handleIngredientChange}>
          {uniqueIngredients.map(ing => (
            <option key={ing.id} value={ing.id}>
              {ing.nombre}
            </option>
          ))}
        </select>
      </div>
      <Line 
        data={chartData} 
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: `Evolución Acumulada hasta ${format(parseISO(endDate), 'dd/MMM/yyyy')}`,
            },
          },
           scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Cantidad'
                }
            }
        }
        }} 
      />
    </div>
  );
};

export default CumulativeChart;