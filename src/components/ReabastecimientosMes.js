import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import {  
  Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

export function ReabastecimientosMes() {
  const distributorId = localStorage.getItem('distributorId');
  console.log(distributorId);
  const url = `http://127.0.0.1:8000/gas/distributor_data/${distributorId}/`; // para django

  const options = {};

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Promedio de reabastecimientos por mes',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setChartData({
          labels: Object.keys(data),
          datasets: [
            {
              label: 'Promedio de reabastecimientos por mes',
              data: Object.values(data),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
      })
      .catch(error => console.error('There has been a problem with your fetch operation:', error));
  }, [url]);

  return <Line options={options} data={chartData} />;
}
