import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

export const ApiDataGrid = ({ metrics }) => {
  // Define columns for the DataGrid
  const columns = [
   // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'apiName', headerName: 'API Name', width: 200 },
    { field: 'apiUrl', headerName: 'API URL', width: 250 },
    { field: 'apiType', headerName: 'API Type', width: 100 },
    { field: 'expectedResponseTime', headerName: 'Expected Response Time (ms)', width: 200 },
    { field: 'availability_uptime', headerName: 'Availability (%)', width: 200 },
  ];

  return (
    <Box sx={{ height: 400, width: '90%' }}>
      <Typography variant="h6" gutterBottom>
        API Metrics
      </Typography>

      {/* MUI DataGrid for displaying metrics */}
      <DataGrid
        rows={metrics} // The data
        columns={columns} // The column definition
        pageSize={5} // Number of rows per page
        rowsPerPageOptions={[5, 10, 25]} // Page size options
        pagination // Enable pagination
        autoHeight // Automatically adjust height to the content
      />
    </Box>
  );
};

