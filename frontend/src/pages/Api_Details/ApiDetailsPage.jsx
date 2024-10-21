import React ,{ useState, useEffect }from 'react';
import { useParams } from 'react-router-dom';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {Box, Grid, Typography, Paper } from '@mui/material';

import ResponseTimeChart from '../../common/components/Detailed_Graph/ResponseTimeChart';
import SuccessFailurePieChart from '../../common/components/Pie_Chart/SuccessFailurePieChart';
import HeatmapChart from '../../common/components/HeatMap/HeatmapChart';
import {ApiDataGrid} from "../../common/components/DataGrid/ApiDataGrid";
import { useLocation } from 'react-router-dom';
import { GET_METRICES_BY_ID } from "../../graphql/query/query"; 
import { useQuery } from '@apollo/client';



const boxstyle = {
    position: "absolute",
    top: "50%",
    transform: "translate(5%, -50%)",
    width: "100%",
    height: "70%",
    padding: '20px'
  };

export default function ApiDetailsPage() {
  
  
  const { id } = useParams(); // Extract the fields later AB100
  const { loading, error, data } = useQuery(GET_METRICES_BY_ID, {
    variables: { apiMonitoringId: id },
  });

  const [successRate, setSuccessRate] = useState(97.19); // Example percentages
  const [errorRate, setErrorRate] = useState(2.29);
  const [percentiles, setPercentiles] = useState({
    p50: 120,
    p90: 200,
    p95: 240,
  });

  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  const { apiName, apiUrl, apiType, avg_response_size, avg_latency, response_time ,success_rates,error_rates} = data?.getAllMetrices[0] || {};
  console.log("Ayush",apiName, apiUrl, apiType, avg_response_size, avg_latency, response_time);

  const responseTimes = response_time.map(({ responsetime, timestamp }) => ({
    responsetime,
    timestamp,
  }));

  return (<>
    <MuiNavbar/>
    <div style={{ padding: '20px', transform: "translate(0%, 5%)"}}>
        
    <Grid container spacing={2} style={{ marginTop:"10px"}}>
      
      <Grid item xs={12} md={6}>
      <Paper elevation={3} style={{ padding: '20px',height: '400px' }}>
      <Typography  >
        API Performance Metrics
      </Typography>
      <Typography >API Name : {apiName}</Typography>
      <Typography >API ID : {id}</Typography>
      <Typography >API URL : {apiUrl}</Typography>
      <Typography >API Type : {apiType}</Typography>
      

        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
      <Paper elevation={3} style={{ padding: '20px' }}>
            <ResponseTimeChart responseTimes={responseTimes} />
            </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        
          
        <Paper elevation={3} style={{ padding: '20px',height: '253px' }}> 
          <HeatmapChart />
          </Paper>
      
    </Grid>
      <Grid item xs={12} md={3}>      
      <Paper elevation={3} style={{ padding: '20px' }}>    
            <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates} />
            </Paper>
          
      </Grid>
      <Grid item xs={12} md={3}>      
      <Paper elevation={3} style={{ padding: '20px' }}>    
            <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates} />
            </Paper>
          
      </Grid>

      
    </Grid>
  </div>
  </>
  );
}
