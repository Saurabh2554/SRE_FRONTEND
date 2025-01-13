import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography ,Switch} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { styled } from '@mui/material/styles';
import moment from 'moment';
import CircleIcon from '@mui/icons-material/Circle';
import { light } from '@mui/material/styles/createPalette';


const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  marginTop:13,
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
    { field: 'apiName', headerName: 'Name', width: 200 },
    { field: 'apiUrl', headerName: 'URL', width: 250 },
    { field: 'methodType', headerName: 'Method', width: 100 },

    { field: 'availability_uptime', headerName: 'Availability (%)', width: 150 },
    { field: 'last_Error_Occurred', headerName: 'Last Error', width: 250,
      renderCell: (params) => {

        return params?.row?.last_Error_Occurred? moment(params?.row?.last_Error_Occurred).format('MMMM Do YYYY, h:mm:ss a') : 'Never Failed Since Scheduled';
      }
  },
    { field: 'avg_latency', headerName: 'Avg Latency(sec)', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const isActive = params.row.isApiActive; 

        // Handle toggle action
        const handleToggle = () => {
          // Here you would usually handle the toggle logic, like updating the backend or state
          console.log(`Toggled status for API ${params.row.apiName}: ${!isActive ? 'Active' : 'Inactive'}`);
        };

        return (
          <Box display="flex" alignItems="center">
            <Typography variant="body2" sx={{ ml: 1, mt:2, fontWeight:light }}>
              {isActive ?<> <CircleIcon sx = {{fontSize:"15px" }} color='success' size = 'small'/>Active</> : <><CircleIcon color='error' sx= {{fontSize:"15px" }} size = 'small'/> Inactive</>}
            </Typography>
          </Box>
        );
      },
    },
  ];

  
  
  const handleRowClick = (params) => {
    const apiId = params.row.id;
    navigate(`/api-details/${apiId}`); // Navigate to api-details AB200
  };

  

  return (
    
    <Box sx={{ height: 'auto', width: '90%', marginTop:'2%' }}>
      <Typography variant="h6" gutterBottom>
        API Metrics
      </Typography>

      <DataGrid
        rows={metrics} 
        columns={columns} 
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]} 
        pagination 
        autoHeight 
        onRowClick={handleRowClick}
        
      />
    </Box> 
  
  );
};

