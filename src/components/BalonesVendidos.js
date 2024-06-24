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

export function BalonesVendidos() {
  const distributorId = localStorage.getItem('distributorId');
  const url = `http://127.0.0.1:8000/gas/sales_data/${distributorId}/`; // para django

  const options = {};

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Ventas de balones convencionales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Ventas de balones premium',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  });

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const labels = Object.keys(data);
        const convencionalData = labels.map(label => data[label].convencional || 0);
        const premiumData = labels.map(label => data[label].premium || 0);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Ventas de balones convencionales',
              data: convencionalData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: 'Ventas de balones premium',
              data: premiumData,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            }
          ]
        });
      });
  }, [url]);

  return <Line options={options} data={chartData} />;
}