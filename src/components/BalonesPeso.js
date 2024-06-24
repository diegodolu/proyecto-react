import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import {  
  Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export function BalonesPeso() {
  const distributorId = localStorage.getItem('distributorId');
  const url = `http://127.0.0.1:8000/gas/weight_data/${distributorId}/`; // para django

  const options = {};

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ventas de balones de 10kg',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
      // Agrega aquí más conjuntos de datos para otros pesos de balón si los hay
    ]
  });

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const labels = Object.keys(data);
        const data10kg = labels.map(label => data[label]['10kg'] || 0);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Ventas de balones de 10kg',
              data: data10kg,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
            // Agrega aquí más conjuntos de datos para otros pesos de balón si los hay
          ]
        });
      });
  }, [url]);

  return <Bar options={options} data={chartData} />;
}