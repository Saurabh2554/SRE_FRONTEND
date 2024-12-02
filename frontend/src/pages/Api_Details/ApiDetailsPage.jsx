import React ,{ useState, useEffect }from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {Box, Grid, Typography, Paper, MenuItem, Select, FormControl, InputLabel,Tooltip,Button, Dialog,DialogContent,DialogTitle,IconButton,  } from '@mui/material';

import ResponseTimeChart from '../../common/components/Detailed_Graph/ResponseTimeChart';
import SuccessFailurePieChart from '../../common/components/Pie_Chart/SuccessFailurePieChart';
import HeatmapChart from '../../common/components/HeatMap/HeatmapChart';
import { GET_METRICES_BY_ID } from "../../graphql/query/query"; 
import { useQuery,useLazyQuery,useMutation } from '@apollo/client';
import {DateRangePickerComponent} from "../../common/components/DateRangePicker/DateRangePickerComponent";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from "@mui/icons-material/Close";
import NewServiceUpdate from '../New_Service/newServiceUpdate';
import {UPDATE_API_MONITOR} from '../../graphql/mutation/mutation';
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';
const boxstyle = {
    position: "absolute",
    top: "50%",
    transform: "translate(5%, -50%)",
    width: "100%",
    height: "70%",
    padding: '20px'
  };

export default function ApiDetailsPage() {
  
  
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { loading, error, data, refetch } = useQuery(GET_METRICES_BY_ID, {
    variables: { 
      apiMonitoringId: id,
    },
  });
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
    stepSize : 1,
    unit : 'hour'
  });
  const[openDialog, setOpenDialog] = useState(false)
  const [updateApiMonitor, { data:UpdatedData, loading:updateStatus, error:updateError }] = useMutation(UPDATE_API_MONITOR, { errorPolicy: "all" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

const setGraphUnitHandler =(stepsize, unit='hour')=>{
  setGraphUnit({
    stepSize: stepsize,
    unit : unit
  })
}

const SetSnackbarFields =  (open, message, severity) => {
  setOpenSnackbar(open);
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
};
const handleCloseSnackbar = (event, reason) => {
  if (reason === "clickaway") {
    return;
  }
  setOpenSnackbar(false);
};

const handleButtonClick =async(event)=>{

 try{
  if(event.target.innerText ==='Deactivate'){
    const result = await updateApiMonitor({
      variables:{
        input:{},
        apiMonitorId:id,
        isApiActive:false
      }
    })
    if(!updateError && result.data.updateApiMonitor.success){
      SetSnackbarFields(true, result.data.updateApiMonitor.message, "error");
      refetch({
        apiMonitoringId: id,
        fromDate: dateRange[0]?.toISOString(),
        toDate:dateRange[1]?.toISOString()
    });
    }
  }
  else if(event.target.innerText ==='Activate'){
    setOpenDialog(true)
  }
 } 
  
  catch (er){ 
    SetSnackbarFields(true, 'Some error occurred!', "error");
  }
    
}

const handleTimeRangeChange = (event) => {
  const selectedRange = event.target.value;
  //const selectedRange = typeof eventOrValue === 'string' ? eventOrValue : eventOrValue.target.value;

  setTimeRange(selectedRange);

  // Calculate date range based on the selected time range
  const now = new Date();
  let fromDate;
  let toDate = new Date(responseTimes.at(-1)?.timestamp); 
   if (selectedRange === '12h') {
      fromDate = new Date(toDate - 12 * 60 * 60 * 1000);
      setGraphUnitHandler(1)

  } else if (selectedRange === '24h') {
      fromDate = new Date(toDate - 24 * 60 * 60 * 1000);
      setGraphUnitHandler(2)
  }
  else if (selectedRange === '48h') {
    fromDate = new Date(toDate - 48 * 60 * 60 * 1000);
    setGraphUnitHandler(4)
}
else if (selectedRange === '72h') {
  fromDate = new Date(toDate - 72 * 60 * 60 * 1000);
  setGraphUnitHandler(8)
}
else if (selectedRange === '1Mon') {
  fromDate = new Date(toDate - 720 * 60 * 60 * 1000);
  setGraphUnitHandler(1, 'day')
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



   if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;
  const { apiName, apiUrl, avg_response_size,isApiActive, avg_latency,availability_uptime,methodType, response_time ,success_rates,error_rates,error_count,percentile_50,percentile_90,percentile_99,expectedResponseTime} = data?.getAllMetrices[0] || {};
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
    <Grid container spacing={2.5} >
      {/* API Name  */}
      <Grid item xs={12} md={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >API Name </Typography>
    <Grid item xs={12} md={12}>
        <Typography sx={{ fontWeight: 'light' }}>{apiName}</Typography>
      </Grid>
    </Grid>
     {/* API URL  */}
     <Grid item xs={12} md={5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >API URL </Typography>
    <Grid item xs={12} md={12}>
        <Typography sx={{ fontWeight: 'light' }}>{apiUrl}</Typography>
      </Grid>
    </Grid>
    {/* API Type  */}
    <Grid item xs={12} md={1.5}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >Method </Typography>
    <Grid item xs={12} md={12}>
        <Typography sx={{ fontWeight: 'light' }}>{methodType}</Typography>
      </Grid>
    </Grid>
    {/* DatePicker */}
    <Grid item xs={12} md={2}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >Status </Typography>
    <Grid item xs={12} md={12}>
        <Typography sx={{ fontWeight: 'light' }}>{isApiActive?<><CircleIcon sx = {{fontSize:"15px" }} color='success' size = 'small'/> Active</>:<><CircleIcon color='error' sx= {{fontSize:"15px" }} size = 'small'/> Inactive</>}</Typography>
      </Grid>
    </Grid>
    <Grid item xs={12} md={2}>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }} >Action </Typography>
    <Grid item xs={12} md={12}>
    <Button variant="contained" onClick={handleButtonClick} size="small" color = {isApiActive?'error':'success'} style={{ textTransform: 'capitalize' }}>
    {isApiActive ? 'Deactivate' : 'Activate'}
        </Button>
      </Grid>
    </Grid>
      </Grid>
    
        
      
    <Grid container spacing={2} style={{ paddingTop: '50px' }}>

  {/* Performance Section */}
  <Grid item xs={12} md={5.5}>
    <Typography variant="subtitle2" sx={{ fontWeight: '450' }} >PERFORMANCE</Typography>

    <Grid container spacing={2}>
      {/* P50 Section */}
      <Tooltip title={<> 50% of the response times <br /> are lower than the displayed value </>}>
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P50</Typography>
        <Typography>{percentile_50.currPercentileResTime}&nbsp;&nbsp;
        <span style={{ color: percentile_50.percentageDiff < 0 ? 'red' : 'green' , fontSize: '0.75rem' }}>
        {percentile_50.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_50.percentageDiff}
          
          </span></Typography>
      </Grid>
      </Tooltip>

      {/* P100 Section */}
      <Tooltip title={<> 95% of the response times <br /> are lower than the displayed value </>}>
        <Grid item xs={12} md={4}>
          <Typography variant="caption">P90</Typography>
          <Typography>{percentile_90.currPercentileResTime} &nbsp;&nbsp;
          <span style={{ color: percentile_90.percentageDiff < 0 ? 'red' : 'green', fontSize: '0.75rem'  }}> 
          {percentile_90.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
            {percentile_90.percentageDiff}
            

            </span></Typography>
            
        </Grid>
        </Tooltip>
      {/* P100 Section */}

      <Tooltip title={<> 99% of the response times <br /> are lower than the displayed value </>}>  
      <Grid item xs={12} md={4}>
        <Typography variant="caption">P99</Typography>
        <Typography>{percentile_99.currPercentileResTime} &nbsp;&nbsp;
        <span style={{ color: percentile_99.percentageDiff < 0 ? 'red' : 'green',fontSize: '0.75rem' }}> 
        {percentile_99.percentageDiff < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_99.percentageDiff}
          

          </span></Typography>
      </Grid>
      </Tooltip>
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
        >
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
      <Typography variant="caption" sx={{ fontWeight: 'bold', marginTop:"100px",fontSize:'15px'}} >Notifications</Typography> 
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
  
<Dialog
    open={openDialog}
    sx={{ width: "100%", margin: "0 auto" }}
  >
    <IconButton
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
      }}
      onClick={() => {
         setOpenDialog(false);
      }}
    >
      <CloseIcon />
    </IconButton>
    <DialogTitle>Restart Monitoring</DialogTitle>
    <DialogContent>
      <NewServiceUpdate id = {id} />
    </DialogContent>
  </Dialog>  
      
    
  </div>
  <ReusableSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} handleClose={handleCloseSnackbar} />
  </>
  );
}