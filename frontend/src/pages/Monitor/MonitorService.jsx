import React, { useState } from 'react';
import Tab1 from './Tab1';
import Tab4 from './Tab4';
import Tab3 from './Tab3';
import Tab2 from './Tab2';
import { Box, Grid, TextField, Button, MenuItem, Typography, Paper, Stepper, Step, StepLabel } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';
import {VALIDATE_TEAMS_CHANNEL} from "../../graphql/query/query"; 
import { useMutation,useLazyQuery } from "@apollo/client";
import {CREATE_API_MONITOR} from '../../graphql/mutation/mutation';


const MonitorService = () => {
  const [validateTeamsChannel, {data: validateteams, loading: teamschannelloading, error: teamschannelerror}] = useLazyQuery(VALIDATE_TEAMS_CHANNEL,{
    fetchPolicy: 'network-only',
  });
  const [createApiMonitor, { data, loading, error }] = useMutation(CREATE_API_MONITOR, { errorPolicy: "all" });
  const [state, setState] = useState({
    tab1: {
      businessUnit: '',
      subBusinessUnit: '',
      serviceName: '',
    },
    tab2: {
      method: '',
      url: '',
      bodyType: 'none',
      raw: 'JSON',
      body: '',
      headerFields: [{ key: '', value: '' }],
      authorizationType: '',
      authInput: { username: '', password: '' },
      authHeader: [{ key: '', value: '' }],
      addheaderto: '',
    },
    tab3: {
        responseTime: '',
    },
    tab4: {
      frequencyTime: '',
      recipientDL: '',
      teamsChannelWebhookURL: '',
      maxretry: 3,
      retryafter: 60,
    },
  });
  const [snackbarState, setSnackBarState]=useState({
    open:false,
    message:'',
    severity:''
  })
  const handleCloseSnackbar = (event, reason) => {
    console.log(reason,"reason")
    if (reason === "clickaway") {
      return;
    }
    setSnackBarState({...snackbarState,open:false});
  };
  const SetSnackbarFields =  (open, message, severity) => {
    setSnackBarState({open, message,severity});
  };
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const steps = ['Domain', 'Request', 'Assertions & Limit', 'Scheduling & Alerting'];
  const [activeStep, setActiveStep] = useState(0);
 
  const handleStepClick = (step) => {
    if (step <= activeStep) {
      setActiveStep(step);
    }
  };
  const handleSend = async(e)=>{
    console.log(activeStep,"active-step.....")
    e.preventDefault()
    
    if(activeStep===3){
      try {
        const {businessUnit,subBusinessUnit,serviceName} = state.tab1
        const {url,method,headerFields,bodyType,body,raw,authHeader} = state.tab2
        const {responseTime} = state.tab3
        const {frequencyTime, recipientDL,teamsChannelWebhookURL,maxretry,retryafter} = state.tab4
        console.log(activeStep,"active-step-check-2.....")
        if(teamsChannelWebhookURL ){
 
          const result = await validateTeamsChannel({
            variables : {
              channelUrl : teamsChannelWebhookURL
            },
          });
          
          if(result && !result?.data?.validateTeamsChannel?.success){
            SetSnackbarFields(true, "Invalid Teams Channel URL! Either Provide a valid one or remove it", "error");
            return;
          }
        }

        

        // const Header = [...headerFields, ...authHeader];
        // const result = await createApiMonitor({
        //   variables: {
        //     input: {
        //       businessUnit,
        //       subBusinessUnit,
        //       apiName: serviceName,
        //       methodType: method,
        //       apiUrl: url,
        //       apiCallInterval: parseInt(frequencyTime, 10),
        //       expectedResponseTime: parseInt(responseTime, 10), 
        //       headers: JSON.stringify(Header),
        //       requestBody: bodyType == 'GraphQL' ? JSON.stringify({query: body.trim()})  : (raw == 'JSON' ? JSON.stringify(body) : body),
        //       recipientDl: recipientDL,
        //       createdBy: 'user', 
        //       teamsChannelWebhookURL : teamsChannelWebhookURL,
        //       maxRetries : +maxretry,
        //       retryAfter : +retryafter
        //     },
        //   },
        // });
        // if(result && result?.data?.createApiMonitor?.success){

        //   SetSnackbarFields(true, result?.data?.createApiMonitor?.message, "success");
         
        // }
        // if(error){
        //   SetSnackbarFields(true, error.message, "error");
        //   return;
        // }
        // window.location.reload()
      } catch (er) {
        console.log(er,"err")
        SetSnackbarFields(true, "Unknown Error occured!", "error");
      }
    }else{
       setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    
    return
   
  }
  
  return (
    <div style={{padding:20}}>
       
      <div style={{marginBottom:30}}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              onClick={() => handleStepClick(index)}
              style={{
                cursor: index <= activeStep ? 'pointer' : 'default',
                color: index <= activeStep ? 'inherit' : 'gray',
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      </div>
      <form onSubmit={handleSend} autoComplete="off">
      {activeStep === 0 && <Tab1 state={state.tab1}  setState={(newState) => setState({ ...state, tab1: newState })} />}
      {activeStep === 1 && <Tab2 state={state.tab2} snackbarState={snackbarState} SetSnackbarFields = {SetSnackbarFields} enableButton = {setIsButtonEnabled} isButtonEnabled = {isButtonEnabled} setState={(newState) => {setState({ ...state, tab2: newState })}} />}
      {activeStep === 2 && <Tab3 state={state.tab3}  setState={(newState) => setState({ ...state, tab3: newState })} />}
      {activeStep === 3 && <Tab4 state={state.tab4} snackbarState={snackbarState} SetSnackbarFields = {SetSnackbarFields} setState={(newState) => setState({ ...state, tab4: newState })} />}
      <Button
        variant="contained"
        fullWidth
        color="primary"
        type='submit'
        // startIcon={<SendIcon />}
        
        disabled= {activeStep===1 && !isButtonEnabled}
      >
       {activeStep===3 ? 'Send' : <span>Next <ArrowForwardIcon /></span>}
      </Button> 
       
      </form>
       <ReusableSnackbar open={snackbarState.open} message={snackbarState.message} severity={snackbarState.severity} handleClose={handleCloseSnackbar} />
    </div>
  );
};

export default MonitorService;