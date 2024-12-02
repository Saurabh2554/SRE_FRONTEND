import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResponseTimeChart.css'; 
import annotationPlugin from 'chartjs-plugin-annotation'; 
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';


ChartJS.register(...registerables, annotationPlugin);

const ResponseTimeChart = ({graphUnit,responseTimes, expectedResponseTime }) => {

  const labels = responseTimes.map(response => new Date(response.timestamp));
 
 // console.log("response time success status ",responseTimes);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes.map(response =>{ return response.responsetime} ),
        borderColor: responseTimes.map(response => {return response.success?'rgba(75, 192, 192, 1)': 'rgba(255, 0, 0)'}) ,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
        //pointRadius: 0,
        
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
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time', // Use time-based scale
            time: {
                unit: graphUnit.unit, // Set the unit to 'hour' (adjust as needed) 
                displayFormats: {
                  hour: 'yyyy-MM-dd hh:mm a'
              },
              
            },
            
        title: {
          display: true,
          text: 'Timestamp',
        },
        ticks: {
          autoSkip: true, // Automatically skip labels for clarity
          stepSize: graphUnit.stepSize // Prevent excessive label rotation
      }
      },
      y: {
        title: {
          display: true,
          text: 'Response Time (ms)',
        },
      },
    },
    // plugins: {
    //   annotation: {
    //     annotations: {
    //       thresholdLine: {
    //         type: 'line',
    //         yMin: (1033), // Set the y-value for the threshold line
    //         yMax: (1033), // Same value for a horizontal line
    //         borderColor: 'red',
    //         borderWidth: 2,
    //         label: {
    //           content: 'Threshold',
    //           enabled: true,
    //           position: 'end',
    //           color: 'red',
    //         },
    //       },
    //     },
    //   },
    // },

  };
  const chartWidth = `${Math.max(responseTimes.length * 20, 800)}px`;

  return ( <div className="chart-container">
    <div className="chart" style={{ minWidth: chartWidth }}>
      <Line data={data} options={options} />
    </div>
  </div>)
};

export default ResponseTimeChart;
