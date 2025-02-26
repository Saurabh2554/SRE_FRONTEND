import React ,{ useState }from 'react';
import { useParams } from 'react-router-dom';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {Box, Grid, Typography,Tooltip,Button, Dialog,DialogContent,DialogTitle,IconButton,  } from '@mui/material';
import { ApiMetricesType,QueryGetAllMetricesArgs,AssertionAndLimitQueryType} from "../../graphql/types";
import ResponseTimeChart from '../../common/components/Detailed_Graph/ResponseTimeChart';
import SuccessFailurePieChart from '../../common/components/Pie_Chart/SuccessFailurePieChart';
import { GET_METRICES_BY_ID } from "../../graphql/query/query"; 
import { useQuery,useMutation } from '@apollo/client';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import CloseIcon from "@mui/icons-material/Close";
import NewServiceUpdate from '../New_Service/newServiceUpdate';
import {UPDATE_API_MONITOR} from '../../graphql/mutation/mutation';
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';
import NoData from "../../common/Resources/NoData.jpg";
import { Tabs, Tab } from '@mui/material';
import {  styled } from '@mui/system';

  const CustomTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: 'none', 
    minHeight: 'unset', // Remove excess height
    '& .MuiTabs-indicator': {
      backgroundColor: '#4A90E2', // Blue indicator
      height: '2px', // height of indicator
    },
  }));
  
  // Styled Tab
  const CustomTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none', // Disable uppercase
    minWidth: 'unset', // Default minwidth removed , reset to revert
    fontSize: '13px', 
    fontWeight:'450',
    color: '#000', 
    marginRight: theme.spacing(0), // spacing between tabs
    '&.Mui-selected': {
      color: '#4A90E2', // Blue color for selected tab
    },
  }));
  

export default function ApiDetailsPage() {
  
  const { id } = useParams();
  const { loading, error, data, refetch } = useQuery<{getAllMetrices: ApiMetricesType[]},QueryGetAllMetricesArgs>(GET_METRICES_BY_ID, {
    variables: { 
      apiMonitoringId: id,
    },
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [timeRange, setTimeRange] = useState('12'); // This State will be removed as setTimeRange is not being used
  const [graphUnit,setGraphUnit] = useState({
    stepSize : 1,
    unit : 'hour'
  });
  const[openDialog, setOpenDialog] = useState(false)
  const [updateApiMonitor, { data:UpdatedData, loading:updateStatus, error:updateError }] = useMutation(UPDATE_API_MONITOR, { errorPolicy: "all" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
 

const setGraphUnitHandler =(stepsize:number, unit:string='hour')=>{
  setGraphUnit({
    stepSize: stepsize,
    unit : unit
  })
}

const SetSnackbarFields =  (open:boolean, message:string, severity:string) => {
  setOpenSnackbar(open);
  setSnackbarMessage(message);
  setSnackbarSeverity(severity);
};
const handleCloseSnackbar = (event:any, reason:string) => {
  if (reason === "clickaway") {
    return;
  }
  setOpenSnackbar(false);
};

const handleButtonClick =async(event:any)=>{

 try{
  if(event.target.innerText ==='Deactivate'){
    const result = await updateApiMonitor({
      variables:{
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

const handleTimeRangeChange = (event:any, newValue:string) => {
  
  setTimeRange(newValue);
  const now = new Date();
  let timeUnit;
  let toDate:Date = responseTimes?.length > 0 ? new Date(responseTimes.at(-1)?.timestamp) : now; // Fallback to 'now'

   if (+newValue === 12) {
    timeUnit="hours";
      setGraphUnitHandler(1);

  } else if (+newValue === 24) {
    timeUnit="hours";
      setGraphUnitHandler(2)
  }
  else if (+newValue === 48) {
    timeUnit="hours";
    setGraphUnitHandler(4)
}
else if (+newValue === 72) {
  timeUnit="hours";
  setGraphUnitHandler(8)
}
else if (+newValue === 1) {
  timeUnit="months";
  setGraphUnitHandler(1, 'day')
}


  // Update the state for date range
  setDateRange([null, toDate]);

  // Fetch data with the selected time range
  
  refetch({
    apiMonitoringId: id,
    timeRange:+newValue,
    timeUnit:timeUnit,
  });


};

let expectedresTimes:AssertionAndLimitQueryType | undefined = data?.getAllMetrices[0]?.assertionAndLimit[0];

   if (loading) return <p>Loading...</p>;
  if (error) return <Box display="flex" justifyContent="center" alignItems="center" height="400px">
  <img src={NoData} alt="Default Placeholder" style={{ width: "50%", opacity: 0.7, marginTop: "200px" }} />
  
</Box>;

  const { apiName, apiUrl, avg_response_size,isApiActive, avg_latency,availability_uptime,methodType, response_time ,success_rates,error_rates,error_count,percentile_50,percentile_90,percentile_99,avg_first_byte_time} = data?.getAllMetrices[0] || {};

  
  const responseTimes = response_time?.map((item) => ({
    responsetime: item?.responsetime ?? 0,  // Provide a default value if needed
    timestamp: item?.timestamp ?? "",       // Default empty string if undefined
    success: item?.success ?? false         // Default false if undefined
})) ?? [];


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
        <Typography sx={{ fontWeight: 'light' }}>{
        isApiActive?<>
        <CircleIcon component="svg" sx={{ fontSize: '15px' }} color="success"/> Active</>:
        <><CircleIcon component="svg" sx={{ fontSize: '15px' }} color="error"/> Inactive</>
        }
        </Typography>
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
  <Grid item xs={12} md={12}>
    <Typography variant="subtitle2" sx={{ fontWeight: '650' }} >PERFORMANCE</Typography>

    <Grid container spacing={2} sx={{marginTop:'3px'}}>
      {/* P50 Section */}
      <Tooltip title={<> 50% of the response times <br /> are lower than the displayed value </>}>
      <Grid item xs={12} md={3}>
        <Typography variant="caption">P50 (in ms)</Typography>
        <Typography>{percentile_50?.currPercentileResTime}&nbsp;&nbsp;
        <span style={{ color: (percentile_50?.percentageDiff ?? 0) < 0 ? 'red' : 'green' , fontSize: '0.75rem' }}>
        {(percentile_50?.percentageDiff ?? 0) < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_50?.percentageDiff}
          
          </span></Typography>
      </Grid>
      </Tooltip>

      {/* P100 Section */}
      <Tooltip title={<> 90% of the response times <br /> are lower than the displayed value </>}>
        <Grid item xs={12} md={3}>
          <Typography variant="caption">P90 (in ms)</Typography>
          <Typography>{percentile_90?.currPercentileResTime} &nbsp;&nbsp;
          <span style={{ color: (percentile_90?.percentageDiff ?? 0) < 0 ? 'red' : 'green', fontSize: '0.75rem'  }}> 
          {(percentile_90?.percentageDiff ??0 ) < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
            {percentile_90?.percentageDiff}
            

            </span></Typography>
            
        </Grid>
        </Tooltip>
      {/* P100 Section */}

      <Tooltip title={<> 99% of the response times <br /> are lower than the displayed value </>}>  
      <Grid item xs={12} md={3}>
        <Typography variant="caption">P99 (in ms)</Typography>
        <Typography>{percentile_99?.currPercentileResTime} &nbsp;&nbsp;
        <span style={{ color: (percentile_99?.percentageDiff ?? 0) < 0 ? 'red' : 'green',fontSize: '0.75rem' }}> 
        {(percentile_99?.percentageDiff ?? 0) < 0 ? <ArrowDropDownIcon fontSize="small" style={{ verticalAlign: 'middle' }}/> : <ArrowDropUpIcon fontSize="small" style={{ verticalAlign: 'middle' }} />}
          {percentile_99?.percentageDiff}
          

          </span></Typography>
      </Grid>
      </Tooltip>

      {/* Availability Percentage */}
    
      <Grid item xs={12} md={3}>
        <Typography variant="caption">Availability</Typography>
        <Typography>{availability_uptime}%</Typography>
      </Grid>
 
    </Grid> 
    
  </Grid>
  <Grid item xs={12} md={12} sx={{marginTop:'10px'}}>
  <Grid container spacing={2}>
    
      {/* Avg Latency */}
    <Grid item xs={12} md={3}>
        <Typography variant="caption">Avg Latency</Typography>
        <Typography>{avg_latency} sec</Typography>
      </Grid>
      {/* avg_response_size */}
    <Grid item xs={12} md={3}>
    <Typography variant="caption">Avg Response Size</Typography>
      {((avg_response_size ?? 0) / 1024 >= 1)
        ? ((avg_response_size ?? 0) / (1024 * 1024) >= 1)
          ? <Typography>{((avg_response_size ?? 0) / (1024 * 1024)).toFixed(2)} MB</Typography>
          : <Typography>{((avg_response_size ?? 0) / 1024).toFixed(2)} KB</Typography>
        : <Typography>{(avg_response_size ?? 0).toFixed(2)} Bytes</Typography>
      }

        
      </Grid>
      {/*  */}
      <Tooltip title={<> Average time elapsed to receive <br/>the first byte of the response. </>}>
    <Grid item xs={12} md={3}>
        <Typography variant="caption">Avg First byte Time</Typography>
        <Typography>{avg_first_byte_time} sec</Typography>
      </Grid>
      </Tooltip>
      {/* Failures */}
    <Grid item xs={12} md={3}>
        <Typography variant="caption">Failures</Typography>
        <Typography>{error_count}</Typography>
      </Grid>
  </Grid>
  </Grid>
  {/* Deleted Code Block */}
  
  
 

</Grid>

<Grid container spacing={2} style={{ marginTop: "30px" }}>

      <Grid item xs={12} md={9} >
      <Grid container alignItems="center"  style={{ marginBottom: "20px" }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight:'20px'}} >Analysis</Typography>
      <CustomTabs value={timeRange} onChange={handleTimeRangeChange} aria-label="custom tabs">
      <CustomTab label="12H" key="12" value="12" />
      <CustomTab label="24H" key="24" value="24" />
      <CustomTab label="48H" key="48" value="48" />
      <CustomTab label="72H" key="72" value="72" />
      <CustomTab label="1M" key="1" value="1" />

    </CustomTabs>
    </Grid>
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'20px'}}>
    <CircleIcon sx = {{fontSize:"15px" }} color='success' />&nbsp;  Passed Results &nbsp;&nbsp;&nbsp;
    <CircleIcon sx = {{fontSize:"15px" }} color='warning' /> &nbsp; Degerated Results &nbsp;&nbsp;&nbsp;
    <CircleIcon sx = {{fontSize:"15px" }} color='error' /> &nbsp;Failed Results
    </div>
      
            <ResponseTimeChart graphUnit={graphUnit} responseTimes={responseTimes} expectedresTimes={expectedresTimes}/>
      </Grid>
      <Grid item xs={12} md={3}  >
      <SuccessFailurePieChart success_rates={success_rates} error_rates={error_rates}  />
      </Grid>
      
      
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