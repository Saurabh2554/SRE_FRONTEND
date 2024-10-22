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
  const { apiName, apiUrl, apiType, avg_response_size, avg_latency,availability_uptime, response_time ,success_rates,error_rates,error_count,percentile_50,percentile_90,percentile_99} = data?.getAllMetrices[0] || {};
  console.log("Ayush",apiName, apiUrl, apiType, avg_response_size, avg_latency, response_time);

  const responseTimes = response_time.map(({ responsetime, timestamp }) => ({
    responsetime,
    timestamp,
  }));

  return (<>
    <MuiNavbar/>
    <div style={{  transform: "translate(0%, 5%)"}}>
    <Grid container spacing={3}>
    <Grid item xs={12} md={9} >
        
      
    <Grid container spacing={2} style={{ marginTop: "10px",padding: '20px' }}>
  
  {/* Monitoring Results Section */}
  <Grid item xs={12} md={3}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >MONITORING RESULTS</Typography>

    {/* Availability Percentage */}
    
      <Grid item xs={12} md={12}>
        <Typography variant="caption">Availability Percentage</Typography>
        <Typography>{availability_uptime}%</Typography>
      </Grid>

      
      
    
  </Grid>
  {/* Alerts */}
  <Grid item xs={12} md={3}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >ALERTS</Typography>
    <Grid item xs={12} md={12}>
        <Typography variant="caption">Failures</Typography>
        <Typography>{error_count}</Typography>
      </Grid>
  </Grid>

  {/* Performance Section */}
  <Grid item xs={12} md={6}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >PERFORMANCE</Typography>

    <Grid container spacing={2}>
      {/* P50 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P50</Typography>
        <Typography>{percentile_50.currPercentileResTime} / {percentile_50.percentageDiff}</Typography>
      </Grid>

      {/* P100 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P90</Typography>
        <Typography>{percentile_90.currPercentileResTime} / {percentile_90.percentageDiff}</Typography>
      </Grid>
      {/* P100 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P99</Typography>
        <Typography>{percentile_99.currPercentileResTime} / {percentile_99.percentageDiff}</Typography>
      </Grid>
    </Grid>
  </Grid>

</Grid>

<Grid container spacing={2} style={{ marginTop: "10px" ,padding: '20px' }}>

      <Grid item xs={12} md={12} style={{ marginTop:"30px" }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }} >PERFORMANCE</Typography>
      
            <ResponseTimeChart responseTimes={responseTimes} />
      </Grid>
      
      
</Grid>
{/*For Heatmap */}
   {/* <Grid container spacing={2} style={{ marginTop: "10px" }}>
   <Grid item xs={12} md={12} style={{ marginTop:"50px" ,height: '253px'}}>
      
      <HeatmapChart />
      </Grid>

   </Grid> */}
</Grid>

<Grid item xs={12} md={3}> 
<Paper elevation={3} style={{marginLeft:"10px" ,marginTop:"20px",padding: '20px' ,height: '100%' }}>    
            <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates} />
            <Typography variant="caption" sx={{ fontWeight: 'bold', marginTop:"100px",fontSize:'15px'}} >Notifications</Typography>

            </Paper>

  </Grid>
</Grid>
  
      
      
    
  </div>
  </>
  );
}
