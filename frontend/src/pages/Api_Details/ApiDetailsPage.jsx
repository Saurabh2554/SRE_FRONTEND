import React ,{ useState, useEffect }from 'react';
import { useParams } from 'react-router-dom';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {Box, Grid, Typography, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

import ResponseTimeChart from '../../common/components/Detailed_Graph/ResponseTimeChart';
import SuccessFailurePieChart from '../../common/components/Pie_Chart/SuccessFailurePieChart';
import HeatmapChart from '../../common/components/HeatMap/HeatmapChart';
import {ApiDataGrid} from "../../common/components/DataGrid/ApiDataGrid";
import { useLocation } from 'react-router-dom';
import { GET_METRICES_BY_ID } from "../../graphql/query/query"; 
import { useQuery,useLazyQuery } from '@apollo/client';
import {DateRangePickerComponent} from "../../common/components/DateRangePicker/DateRangePickerComponent";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
  const { loading, error, data, refetch } = useQuery(GET_METRICES_BY_ID, {
    variables: { 
      apiMonitoringId: id

    },
  });
  console.log(data)
  const [dateRange, setDateRange] = useState([null, null]);
  
  const [successRate, setSuccessRate] = useState(97.19); // Example percentages
  const [errorRate, setErrorRate] = useState(2.29);
  const [percentiles, setPercentiles] = useState({
    p50: 120,
    p90: 200,
    p95: 240,
  });
  const [timeRange, setTimeRange] = useState('12h'); 
  const [graphUnit,setGraphUnit] = useState({
    stepSize : 15,
    unit : 'minute'
  });

 
   const handleDateChange2= (newDateRange) => {
    setDateRange(newDateRange);
    console.log('Selected Date Range:', newDateRange);
  
    if ( newDateRange[0] || newDateRange[1]) {
      const variables = {
        apiMonitoringId:id,
        fromDate: newDateRange[0]?.toISOString(),
        toDate: newDateRange[1]?.toISOString(),
      };
      console.log('Fetching metrics with:', variables);
      refetch(variables)
      
     
    }
  };

  //const handleTimeRangeChange = (event) => {}

  const handleTimeRangeChange2 = (event) => {
    const selectedRange = event.target.value;
    setTimeRange(selectedRange);

    // Calculate new date range based on selected range
    const now = new Date();
    let fromDate;
    if (selectedRange === '1h') {
        fromDate = new Date(now.getTime() - 60 * 60 * 1000);
    } else if (selectedRange === '12h') {
        fromDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    } else if (selectedRange === '24h') {
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const variables = {
        apiMonitoringId: id,
        fromDate: fromDate.toISOString(),
        toDate: now.toISOString(),
    };

    refetch(variables);
};

//Testing 

// useEffect(() => {
//   let fromDate = new Date(toDate - 12 * 60 * 60 * 1000);
//     let toDate = new Date(responseTimes.at(-1)?.timestamp);

//   // Fetch data for the last 12 hours
//   refetch({
//     apiMonitoringId: id,
//     fromDate: fromDate.toISOString(),
//     toDate:toDate.toISOString()
//   });
// }, []);

// useEffect(() => {
//   handleTimeRangeChange('12h');
// }, []);

// useEffect(() => {
//   const now = new Date();
//   const fromDate = new Date(now.getTime() - 12 * 60 * 60 * 1000); // Calculate the last 12 hours

//   // Refetch data for the past 12 hours
//   refetch({
//     apiMonitoringId: id,
//     fromDate: fromDate.toISOString(),
//     toDate: now.toISOString(),
//   });
// }, [id]);

const handleTimeRangeChange = (event) => {
  const selectedRange = event.target.value;
  //const selectedRange = typeof eventOrValue === 'string' ? eventOrValue : eventOrValue.target.value;

  setTimeRange(selectedRange);

  // Calculate date range based on the selected time range
  const now = new Date();
  let fromDate;
  let toDate = new Date(responseTimes.at(-1)?.timestamp);
  if (selectedRange === '1h') {
      fromDate = new Date(toDate - 60 * 60 * 1000);
      setGraphUnit({
        stepSize: 15,
        unit : 'minute'
      })
  } 
  else if (selectedRange === '12h') {
      fromDate = new Date(toDate - 12 * 60 * 60 * 1000);
      setGraphUnit({
        stepSize: 1,
        unit : 'hour'
      })
  } else if (selectedRange === '24h') {
      fromDate = new Date(toDate - 24 * 60 * 60 * 1000);
      setGraphUnit({
        stepSize: 2,
        unit : 'hour'
      })
  }
  else if (selectedRange === '48h') {
    fromDate = new Date(toDate - 48 * 60 * 60 * 1000);
    setGraphUnit({
      stepSize: 4,
      unit : 'hour'
    })
}
else if (selectedRange === '72h') {
  fromDate = new Date(toDate - 72 * 60 * 60 * 1000);
  setGraphUnit({
    stepSize: 8,
    unit : 'hour'
  })
}
else if (selectedRange === '1Mon') {
  fromDate = new Date(toDate - 720 * 60 * 60 * 1000);
  setGraphUnit({
    stepSize: 1,
    unit : 'day'
  })
}

  // Update the state for date range  1Mon
  setDateRange([fromDate, now]);

  // Fetch data with the selected time range
  refetch({
      apiMonitoringId: id,
      fromDate: fromDate.toISOString(),
      toDate:toDate.toISOString()
  });
};

const handleDateChange = (newDateRange) => {
  setDateRange(newDateRange);
  setTimeRange(null); // Reset the dropdown when custom dates are selected

  if (newDateRange[0] || newDateRange[1]) {
      const variables = {
          apiMonitoringId: id,
          fromDate: newDateRange[0]?.toISOString(),
          toDate: newDateRange[1]?.toISOString(),
      };

      console.log('Fetching metrics with custom date range:', variables);
      refetch(variables);
  }
};

// const [dateRange, setDateRange] = useState(() => {
//   let toDate = new Date(responseTimes.at(-1)?.timestamp);
//   let fromDate = new Date(toDate - 12 * 60 * 60 * 1000);
  
//   return [fromDate, toDate];
// });


   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  const { apiName, apiUrl, avg_response_size, avg_latency,availability_uptime,methodType, response_time ,success_rates,error_rates,error_count,percentile_50,percentile_90,percentile_99,expectedResponseTime} = data?.getAllMetrices[0] || {};
 // console.log("Ayush",apiName, apiUrl, avg_response_size, avg_latency, response_time);

  const responseTimes = response_time?.map(({ responsetime, timestamp,success }) => ({
    responsetime,
    timestamp,
    success
  }));


  return (<>
    <MuiNavbar/>
    <div style={{  transform: "translate(0%, 5%)"}}>
    <Grid container spacing={3}style={{ marginTop: "20px",padding: '20px',marginLeft:"10px" }}>
    <Grid container spacing={2} >
      {/* API Name  */}
      <Grid item xs={12} md={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >API Name </Typography>
    <Grid item xs={12} md={12}>
        <Typography>{apiName}</Typography>
      </Grid>
    </Grid>
     {/* API URL  */}
     <Grid item xs={12} md={4}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >API URL </Typography>
    <Grid item xs={12} md={12}>
        <Typography>{apiUrl}</Typography>
      </Grid>
    </Grid>
    {/* API Type  */}
    <Grid item xs={12} md={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >Method </Typography>
    <Grid item xs={12} md={12}>
        <Typography>{methodType}</Typography>
      </Grid>
    </Grid>
    {/* DatePicker */}
    <Grid item xs={12} md={5}>
    <DateRangePickerComponent onDateChange={handleDateChange} /> 
    </Grid>
      </Grid>
    
        
      
    <Grid container spacing={2} style={{ paddingTop: '50px' }}>

  {/* Performance Section */}
  <Grid item xs={12} md={5.5}>
    <Typography variant="subtitle2" sx={{ fontWeight: '450' }} >PERFORMANCE</Typography>

    <Grid container spacing={2}>
      {/* P50 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P50</Typography>
        <Typography>{percentile_50.currPercentileResTime}&nbsp;&nbsp;
        <span style={{ color: percentile_50.percentageDiff < 0 ? 'red' : 'green' , fontSize: '0.75rem' }}>
        {percentile_50.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_50.percentageDiff}
          
          </span></Typography>
      </Grid>

      {/* P100 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P90</Typography>
        <Typography>{percentile_90.currPercentileResTime} &nbsp;&nbsp;
        <span style={{ color: percentile_90.percentageDiff < 0 ? 'red' : 'green', fontSize: '0.75rem'  }}> 
        {percentile_90.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_90.percentageDiff}
          

          </span></Typography>
          
      </Grid>
      {/* P100 Section */}
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P99</Typography>
        <Typography>{percentile_99.currPercentileResTime} &nbsp;&nbsp;
        <span style={{ color: percentile_99.percentageDiff < 0 ? 'red' : 'green',fontSize: '0.75rem' }}> 
        {percentile_99.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_99.percentageDiff}
          

          </span></Typography>
      </Grid>
      
    </Grid>
    
    
  </Grid>
  {/* Monitoring Results Section */}
  <Grid item xs={12} md={2}>
    <Typography variant="subtitle2" sx={{ fontWeight: '450' }} >MONITORING RESULTS</Typography>

    {/* Availability Percentage */}
    
      <Grid item xs={12} md={12}>
        <Typography variant="caption">Availability Percentage</Typography>
        <Typography>{availability_uptime}%</Typography>
      </Grid>

      
      
    
  </Grid>
  {/* Alerts */}
  <Grid item xs={12} md={2}>
    <Typography variant="subtitle2" sx={{ fontWeight: '450' }} >ALERTS</Typography>
    <Grid item xs={12} md={12}>
        <Typography variant="caption">Failures</Typography>
        <Typography>{error_count}</Typography>
      </Grid>
  </Grid>

  
 

</Grid>

<Grid container spacing={2} style={{ marginTop: "30px" }}>

      <Grid item xs={12} md={9} >
      <Grid container alignItems="center"  style={{ marginBottom: "20px" }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }} >Analysis</Typography>
      <FormControl variant="outlined" size="small" style={{ minWidth: 120 ,marginLeft: "20px"}}>
                                    <InputLabel>Time Range</InputLabel>
                                    <Select
                                        value={timeRange}
                                        onChange={handleTimeRangeChange}
                                        label="Time Range"
                                        defaultValue='12h'
                                    >
                                        <MenuItem key="1h" value="1h">1 Hour</MenuItem>
                                        <MenuItem key="12h" value="12h">12 Hours</MenuItem>
                                        <MenuItem key="24h" value="24h">24 Hours</MenuItem>
                                        <MenuItem key="48h" value="48h">48 Hours</MenuItem>
                                        <MenuItem key="72h" value="72h">72 Hours</MenuItem>
                                        <MenuItem key="1Mon" value="1Mon">1 Month</MenuItem>
                                    </Select>
                                </FormControl>
                                </Grid>
      
            <ResponseTimeChart graphUnit={graphUnit} responseTimes={responseTimes} expectedResponseTime={expectedResponseTime}/>
      </Grid>
      <Grid item xs={12} md={3}  >
      <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates} circumference = {20} />
      </Grid>
      
      
      

{/*For Heatmap */}
   {/* <Grid container spacing={2} style={{ marginTop: "10px" }}>
   <Grid item xs={12} md={12} style={{ marginTop:"50px" ,height: '253px'}}>
      
      <HeatmapChart />
      </Grid>

   </Grid> */}
</Grid>

<Grid item xs={12} md={3} style={{marginTop:"70px"}}> 
        
              
            {/* <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates} circumference = {20} />
            <Typography variant="caption" sx={{ fontWeight: 'bold', marginTop:"100px",fontSize:'15px'}} >Notifications</Typography> */}

           

  </Grid>
</Grid>
  
      
      
    
  </div>
  </>
  );
}