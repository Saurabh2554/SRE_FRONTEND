import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const SuccessFailurePieChart = ({success_rates,error_rates}) => {
 
  const data = {
    labels: ['Success', 'Failure'],
    datasets: [
      {
        data: [success_rates, error_rates],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} style={{  marginTop:'50px', height:'100px' , width:'100px'}} />;
};

export default SuccessFailurePieChart;
