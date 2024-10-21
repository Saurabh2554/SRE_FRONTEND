import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResponseTimeChart.css'; 




const ResponseTimeChart = ({ responseTimes }) => {

  const labels = responseTimes.map(response => new Date(response.timestamp).toLocaleTimeString());
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes.map(response => response.responsetime),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
    },
  };

  return ( <div className="chart-container">
    <div className="chart" style={{ minWidth: `${responseTimes.length * 50}px` }}>
      <Line data={data} options={options} />
    </div>
  </div>)
};

export default ResponseTimeChart;
