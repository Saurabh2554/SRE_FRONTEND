import React from 'react';
import HeatMap from 'react-heatmap-grid';

const HeatmapChart = () => {
  const xLabels = [
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '13:00',
    '13:00',
    '13:00',
    '13:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '13:00',
    '13:00',
    '13:00',
    '13:00',
    '13:00',
  ]; // Example time labels
  const yLabels = [
    'API 1',
    'API 2',
    'API 3',
    'API 4',
    'API 5',
    'API 6',
    'API 7',
  ]; // Example API names
  const data = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8], //Hardcoded Values
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [2, 4, 6, 8, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
    [1, 3, 5, 7, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8],
  ];

  return (
    <div style={{ width: '500px', height: '400px' }}>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={data}
        squares
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgb(255, ${255 - value * 30}, ${255 - value * 30})`,
        })}
        cellRender={(value) => value && `${value}`} // Display cell values
      />
    </div>
  );
};

export default HeatmapChart;
