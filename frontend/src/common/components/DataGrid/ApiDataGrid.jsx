import React from 'react';
import { DataGrid, GridRenderCellParams,GridRowParams } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import moment from 'moment';
import CircleIcon from '@mui/icons-material/Circle';
import { ApiMetricesType, } from "../../../graphql/types";


// type ApiDataGridProps = {
//   metrics: ApiMetricesType[];
//   error?: string|null; // assuming error is a string (optional)
// };

// type RowType = {
//   last_Error_Occurred?: string;
//   isApiActive?: boolean;
//   apiName?: string | undefined| null; // Adjust type based on your actual data
// };

export const ApiDataGrid = ({ metrics, error}) => {
  console.log(metrics, "ttttttttttttttt")
  const navigate = useNavigate();

  const columns = [
    { field: 'apiName', headerName: 'Name', width: 200 },
    { field: 'apiUrl', headerName: 'URL', width: 250 }
   // { field: 'methodType', headerName: 'Method', width: 100 },

   // { field: 'availability_uptime', headerName: 'Availability (%)', width: 150 },
  //   { field: 'last_Error_Occurred', headerName: 'Last Error', width: 250,
  //     renderCell: (params:GridRenderCellParams<RowType, string | undefined>) => {

  //       return params?.row?.last_Error_Occurred? moment(params?.row?.last_Error_Occurred).format('MMMM Do YYYY, h:mm:ss a') : 'Never Failed Since Scheduled';
  //     }
  // },
   // { field: 'avg_latency', headerName: 'Avg Latency(sec)', width: 150 },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 150,
    //   renderCell: (params:GridRenderCellParams<RowType, string | undefined>) => {
    //     const isActive = params.row.isApiActive; 

    //     return (
    //       <Box display="flex" alignItems="center">
    //         <Typography variant="body2" sx={{ ml: 1, mt:2 }}>
    //           {isActive ?<> <CircleIcon sx = {{fontSize:"15px" }} color='success' />Active</> : <><CircleIcon color='error' sx= {{fontSize:"15px" }} /> Inactive</>}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
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
        autoPageSize={true}
        pageSizeOptions={[5, 10, 25]} 
        pagination 
        onRowClick={handleRowClick}
        
      />
    </Box> 
  
  );
};

