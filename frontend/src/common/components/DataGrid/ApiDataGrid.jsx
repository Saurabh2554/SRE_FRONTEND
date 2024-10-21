import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography ,Switch} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { styled } from '@mui/material/styles';


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 22,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(16px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#52d869' : '#52d869', // Green when active
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === 'dark' ? '#e11c1c' : '#e11c1c', // Red when inactive
    opacity: 1,
  },
}));


export const ApiDataGrid = ({ metrics,error }) => {

  const navigate = useNavigate();
  // Define columns for the DataGrid
  const columns = [
   // { field: 'id', headerName: 'ID', width: 90 },
    { field: 'apiName', headerName: 'API Name', width: 200 },
    { field: 'apiUrl', headerName: 'API URL', width: 250 },
    { field: 'apiType', headerName: 'API Type', width: 100 },
    //{ field: 'expectedResponseTime', headerName: 'Expected Response Time (ms)', width: 200 },
    { field: 'availability_uptime', headerName: 'Availability (%)', width: 200 },
    //{ field: 'success_rates', headerName: 'Success(%)', width: 200 },
    { field: 'avg_latency', headerName: 'Avg Latency(sec)', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const isActive = params.row.isApiActive; // Access is_api_active from the row data

        // Handle toggle action
        const handleToggle = () => {
          // Here you would usually handle the toggle logic, like updating the backend or state
          console.log(`Toggled status for API ${params.row.apiName}: ${!isActive ? 'Active' : 'Inactive'}`);
        };

        return (
          <Box display="flex" alignItems="center">
            <IOSSwitch
              checked={isActive} // Use the is_api_active field from the metrics
              onChange={handleToggle} // Toggle the status
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
        );
      },
    },
  ];

  
  
  const handleRowClick = (params) => {
    const apiId = params.row.id; 
    navigate(`/api-details/${apiId}`); // Navigate to api-details AB200
    //console.log("AB",params);
  };

  

  return (
    
     <Box sx={{ height: 400, width: '90%' }}> 
      <Typography variant="h6" gutterBottom>
        API Metrics
      </Typography>

      

      
      <DataGrid
        rows={metrics} // The data , set it to metrics later , currently with default 
        columns={columns} // The column definition
        pageSize={5} // Number of rows per page
        rowsPerPageOptions={[5, 10, 25]} // Page size options
        pagination // Enable pagination
        autoHeight // Automatically adjust height to the content
        onRowClick={handleRowClick}
        
      />
    </Box> 
  
  );
};

