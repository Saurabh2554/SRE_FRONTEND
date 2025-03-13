import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './ResponseTimeChart.css'; 
import annotationPlugin from 'chartjs-plugin-annotation'; 
import { Chart as ChartJS, registerables, ChartOptions, TooltipItem } from 'chart.js';
import 'chartjs-adapter-date-fns';
//import { AssertionAndLimitQueryType, ResponseTimeType } from '../../../graphql/types';


ChartJS.register(...registerables, annotationPlugin);

// type ResponseTimeChartProps = {
//   graphUnit?:{
//     stepSize: number;
//     unit: string; 
//   };
//   responseTimes?: ResponseTimeType[];
//   expectedresTimes?:AssertionAndLimitQueryType
// }
// type InteractionMode = 'nearest' | 'x' | 'y' | 'index' | 'dataset' | 'point' | undefined;
// type Unit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year' | undefined
// type Axis = 'x' | 'y' | 'xy' |'r' | undefined


const ResponseTimeChart = ({graphUnit,responseTimes,expectedresTimes }) => {
  const labels = responseTimes?.map(response => new Date(response?.timestamp));
 
 // console.log("response time success status ",responseTimes);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimes?.map(response =>{ return response?.responsetime} ),
        borderColor: responseTimes?.map(response => {return response?.success? ((response?.responsetime ?? 0) <= (expectedresTimes?.degradedResponseTime ?? 0) ? 'green' : (response?.responsetime ?? 0) <= (expectedresTimes?.failedResponseTime ?? 0) ? '#f7be00' :  'rgba(255, 0, 0)') : 'rgba(255, 0, 0)'}) ,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true,
        pointRadius: 0,
        
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
                unit: graphUnit?.unit , //as Unit, // Set the unit to 'hour' (adjust as needed) 
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
          stepSize: graphUnit?.stepSize // Prevent excessive label rotation
      }
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
        annotations:{ 
           line1:{
            
            type: 'line'  ,
            yMin: expectedresTimes?.degradedResponseTime ?? 0, // Set the y-value for the threshold line
            yMax: expectedresTimes?.degradedResponseTime ?? 0, // Same value for a horizontal line
            borderColor: '#f7be00',
            borderWidth: 2,
            mode: 'horizontal',
            label: {
              content: `Expected Response Time: ${expectedresTimes?.degradedResponseTime} ms`, // Tooltip content
              position: 'end',
              color: 'white',
              
              backgroundColor: 'red',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
             // Enable hover interaction
          //hoverBackgroundColor: '#f7be00', // Optional for visual feedback
          borderDash: [5, 5], // Dashed line for better visibility
          },
           line2: {
            
            type: 'line' ,
            yMin: expectedresTimes?.failedResponseTime ?? 0, // Set the y-value for the threshold line
            yMax: expectedresTimes?.failedResponseTime ?? 0, // Same value for a horizontal line
            borderColor: 'red',
            borderWidth: 2,
            label: {
              content: `Expected Response Time: ${expectedresTimes?.failedResponseTime} ms`, // Tooltip content
              enabled: true, // Enable label for annotation
              position: 'end',
              color: 'white',
              backgroundColor: 'red',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
             // Enable hover interaction
          hoverBackgroundColor: '#f7be00', // Optional for visual feedback
          borderDash: [5, 5], // Dashed line for better visibility
          },
        },
      },
      tooltip: {
        mode: 'nearest', //as InteractionMode, // Ensures the tooltip connects to the nearest point
        intersect: false, // Allows tooltip to show when hovering anywhere on the vertical line
        callbacks: {
          title: (tooltipItems) => {
            const context = tooltipItems[0].chart.ctx;
            const chartArea = tooltipItems[0].chart.chartArea;
            const xPosition = tooltipItems[0].element.x;
            const yTop = chartArea.top;
            const yBottom = chartArea.bottom;
  
            // Draw vertical line
            context.save();
            context.beginPath();
            context.moveTo(xPosition, yTop);
            context.lineTo(xPosition, yBottom);
            
            context.lineWidth = 1;
            context.strokeStyle = 'rgba(133,133,133, 0.1)';
            context.stroke();
            context.restore();
  
            return tooltipItems[0].label;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest', // as InteractionMode, // Evertical line interaction
      axis: 'x', // as Axis, 
      intersect: false, // Ensures the vertical line appears even when not directly over a point
    },
    elements: {
      point: {
        radius: 4, // Adjust point radius for better visibility
        hoverRadius: 6, // Enlarges points on hover
      },
    },

  };

  const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    beforeDraw: (chart ) => {
      const activeElements = chart.tooltip?.getActiveElements();
      if (activeElements && activeElements.length > 0) {
        const ctx = chart.ctx;
        const activePoint = activeElements[0];
        const x = activePoint.element.x;
        const topY = chart.chartArea.top;
        const bottomY = chart.chartArea.bottom;
  
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(133,133,133, 0.8)'; // Adjust the line color and transparency
        ctx.stroke();
        ctx.restore();
      }
    },
  };
  
  ChartJS.register(verticalLinePlugin);
  const chartWidth = `${Math.max((responseTimes?.length ?? 0) * 5, 800)}px`;

  return ( <div className="chart-container">
    <div className="chart" style={{ minWidth: chartWidth }}>
      <Line data={data} options={options} />
    </div>
  </div>)
};

export default ResponseTimeChart;
