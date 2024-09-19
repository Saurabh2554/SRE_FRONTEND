import React from "react";
import { Line } from "react-chartjs-2";

const ChartComponent = ({ chartData, chartOptions }) => {
  return (
    <div style={{ height: "400px", width:"800px",overflowY: "scroll" }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;
