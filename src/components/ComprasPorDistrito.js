import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ComprasPorDistrito() {
  const distributorId = localStorage.getItem('distributorId');
  const url = `http://127.0.0.1:8000/gas/consumption_data/${distributorId}/`; // para django

  const options = {};

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Compras por distrito en porcentaje",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setChartData({
          labels: Object.keys(data),
          datasets: [
            {
              label: "Compras por distrito en porcentaje",
              data: Object.values(data),
              backgroundColor: "rgba(75, 50, 100, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      });
  }, [url]);

  return <Bar options={options} data={chartData} />;
}
