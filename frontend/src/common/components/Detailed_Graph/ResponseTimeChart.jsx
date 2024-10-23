import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResponseTimeChart.css'; 
import annotationPlugin from 'chartjs-plugin-annotation'; 
import { Chart as ChartJS, registerables } from 'chart.js';


ChartJS.register(...registerables, annotationPlugin);
const ResponseTimeChart = ({responseTimes, expectedResponseTime }) => {

  const labels = responseTimes.map(response => new Date(response.timestamp).toLocaleTimeString());
  console.log("response time success status ",responseTimes)
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes.map(response => response.responsetime),
        borderColor: responseTimes.map(response => {console.log("saurabh",response.success);return response.success?'rgba(75, 192, 192, 1)': 'rgba(255, 0, 0)'}) ,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
      },
    ],
    options: {
      plugins: {
        annotation: {
          annotations: {
            box1: {
              // Indicates the type of annotation
              type: 'box',
              xMin: 1,
              xMax: 2,
              yMin: 50,
              yMax: 70,
              backgroundColor: 'rgba(255, 99, 132, 0.25)'
            }
          }
        }
      }
    }
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
    plugins: {
      annotation: {
        annotations: {
          thresholdLine: {
            type: 'line',
            yMin: (expectedResponseTime), // Set the y-value for the threshold line
            yMax: (expectedResponseTime), // Same value for a horizontal line
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: 'Threshold',
              enabled: true,
              position: 'end',
              color: 'red',
            },
          },
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
