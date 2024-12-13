import React, { useState ,useEffect} from 'react';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';

import { Box, Grid, TextField, Button, MenuItem, Typography, Paper, IconButton, AppBar, Tabs, Tab, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Radio, RadioGroup, FormControl, FormControlLabel} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import Link from '@mui/material/Link';
import { useMutation,useQuery,useLazyQuery } from "@apollo/client";
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT , GET_AUTH_VALUE,GET_API_TYPE, VALIDATE_API, VALIDATE_TEAMS_CHANNEL} from "../../graphql/query/query"; 
import {CREATE_API_MONITOR} from '../../graphql/mutation/mutation';



export default function NewService() {
  const [method, setMethod] = useState('');
  const [url, setUrl] = useState('');
  const [start, setStart] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [headerFields, setHeaderFields] = useState([{ key: '', value: '' }]); // For dynamic headers
  const [authInput, setAuthInput] = useState({ username: '', password: '' });
  const [AuthHeader, setAuthHeader] = useState([{ key: '', value: ''}]);
  const [addheaderto, setAddheaderto] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [body, setBody] = useState('');
  const [bodyType, setBodytype] = useState('none');
  const [raw, setRaw] = useState('JSON');
  const [tabValue, setTabValue] = useState('1');
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnit, setSubBusinessUnit] = useState("");
  const [serviceName, setServiceName] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [frequencyTime, setFrequencyTime] = useState('');
  const [recipientDL, setRecipientDL] = useState('');
  const [authorizationType, setAuthorizationType] = useState('');
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [apiresponse, setApiresonse] = useState({});
  const [teamsChannelWebhookURL, setWebhookURL] = useState('');
  const [maxretry, setmaxretry] = useState(3);
  const [retryafter, setretryafter] = useState(60);

  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery(GET_ALL_BUSINESS_UNIT);
  const [fetchSubBusinessUnits, { data: subBusinessUnitData, loading: subBusinessUnitLoading }] = useLazyQuery(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);
  const { data: methodData, loading: methodLoading, error: methodError } = useQuery(GET_API_TYPE);
  const { data: authTypeChoicesData, loading: authTypeChoicesLoading, error: authTypeChoicesError } = useQuery(GET_AUTH_VALUE);
  const [createApiMonitor, { data, loading, error }] = useMutation(CREATE_API_MONITOR, { errorPolicy: "all" });
  const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API,{
    fetchPolicy: 'network-only',
  });
  const [validateTeamsChannel, {data: validateteams, loading: teamschannelloading, error: teamschannelerror}] = useLazyQuery(VALIDATE_TEAMS_CHANNEL);

  const handleBusinessUnitChange = (e) => {
    const selectedBusinessUnit = e.target.value;
    setBusinessUnit(selectedBusinessUnit);
    
    fetchSubBusinessUnits({
      variables: {
        id: selectedBusinessUnit,
      },
    });
  };

  const handleSubBusinessUnitChange = (e) => {
    setSubBusinessUnit(e.target.value);
  };
  // Handle dynamic header fields
  const handleAddHeaderField = () => {
    setHeaderFields([...headerFields, { key: '', value: '' }]);
  };

  const handleRemoveHeaderField = (index) => {
    console.log(index ,"iiiinnnnddddeeeexxxx")
    setHeaderFields(headerFields.filter((_, i) => i !== index));
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addHeaderFields = () => {
    
    let authValue = '';
    const authorizationObj ={};
    if(authorizationType === 'API_KEY' && (authInput.username !== '' && authInput.password !== '') ){
      if(addheaderto == 'Header'){
        authorizationObj['key'] = authInput.username;
        authorizationObj['value'] = authInput.password;
      }
      else if(addheaderto == 'QueryParams'){
        const encodedValue = encodeURIComponent(authInput.password);

        setUrl((prevUrl) => {
          const separator = prevUrl.includes('?') ? '&' : '?';
          return `${prevUrl}${separator}${authInput.username}=${encodedValue}`;
        });
      }
    }
    else if( authorizationType === 'BEARER'){
      authValue = `Bearer ${authInput.username}`;
    }
    else if(authorizationType === 'BASIC' ){
      if(authInput.username && authInput.password){
        const encodedCredentials = btoa(`${authInput.username}:${authInput.password}`);
        authValue = `Basic ${encodedCredentials}`;
      }
    }
    
    if(authValue != '' || (authorizationType === 'API_KEY' && addheaderto != '')){

      if(authorizationType != 'API_KEY'){
        authorizationObj['key'] = 'Authorization';
        authorizationObj['value'] = authValue;
      }
      
      setAuthHeader([authorizationObj]);
    }
  };

  useEffect(() => {
    setAuthInput({ username: '', password: '' });
  }, [authorizationType]);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      if(teamsChannelWebhookURL ){
        console.log(teamsChannelWebhookURL);
        const result = await validateTeamsChannel({
          variables : {
            channelUrl : teamsChannelWebhookURL
          },
        });
        
        if(result && !result?.data?.validateTeamsChannel?.success){
          SetSnackbarFields(true, "Invalid Teams Channel URL", "error");
          return;
        }
        console.log(result);
      }


      const Header = [...headerFields, ...AuthHeader];
      const result = await createApiMonitor({
        variables: {
          input: {
            businessUnit,
            subBusinessUnit,
            apiName: serviceName,
            methodType: method,
            apiUrl: url,
            apiCallInterval: parseInt(frequencyTime, 10),
            expectedResponseTime: parseInt(responseTime, 10), 
            //expectedStatusCode: 200, 
            headers: JSON.stringify(Header),
            requestBody: bodyType == 'GraphQL' ? JSON.stringify({query: body.trim()})  : (raw == 'JSON' ? JSON.stringify(body) : body),
            recipientDl: recipientDL,
            createdBy: 'user', 
            teamsChannelWebhookURL : teamsChannelWebhookURL,
            maxRetries : +maxretry,
            retryAfter : +retryafter
          },
        },
      });
      if(result && result?.data?.createApiMonitor?.success){
        console.log(result.data);
        console.log("Fffffffffff");
        ResetStates();
        SetSnackbarFields(true, result?.data?.createApiMonitor?.message, "success");
      }
      if(error){
        SetSnackbarFields(true, error.message, "error");
        return;
      }
      
    } catch (er) {
      SetSnackbarFields(true, "Unknown Error occured!", "error");
    }
  };

  const ResetStates = () =>{
    setBusinessUnit('');
    setSubBusinessUnit('');
    setServiceName('');
    setMethod('');
    setUrl('');
    setHeaderFields([{ key: '', value: '' }]);
    setResponseTime('');
    setFrequencyTime('');
    setRecipientDL('');
    setBody('');
    setAuthorizationType('');
    setUsername('');
    setPassword('');
    setTabValue('1');
    setButtonEnabled(false); 
    setAuthInput({ username: '', password: '' });
    setWebhookURL('');
  };
  const handleSave = async () => {
   
    const Header = [...headerFields, ...AuthHeader];

    if(url){
      const result = await validateApi({
        variables: {
          apiUrl: url,
          methodType: method,
          headers: JSON.stringify(Header),
          requestBody: bodyType == 'GraphQL' ? JSON.stringify({query: body.trim()})  : body
        }
      });
      console.log(result);
      if(apierror){
        console.log(apierror);
        SetSnackbarFields(true, apierror.message || "Invalid API!", "error");
        return
      }
      setApiresonse(result.data);


    } 
  };
  useEffect(() => {
    if(apiresponse && apiresponse.validateApi){
      const statuscode = apiresponse?.validateApi?.status;
      if(!apiresponse?.validateApi?.success){
        SetSnackbarFields(true, apiresponse?.validateApi?.message || "Invalid API!", "error");
      }
      console.log(statuscode);
      if(statuscode>= 200 && statuscode<300){
        setButtonEnabled(true);
        SetSnackbarFields(true, "API validated successfully!", "success");
      }
    }
  },[apiresponse]);

  const SetSnackbarFields =  (open, message, severity) => {
    setOpenSnackbar(open);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  useEffect(() => {
      setButtonEnabled(false);
      setOpenSnackbar(false);
      setApiresonse({});
  },[url]);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBodychange = (event) => {
    setBodytype(event.target.value);

    if(event.target.value === 'GraphQL'){
      method != 'POST' && setMethod('POST');
      const found = headerFields?.some(vv => vv.key.toLowerCase() == 'content-type' && vv.value.toLowerCase() == 'application/json');

      if(!found){
        if(headerFields[0]?.key == ''){
          setHeaderFields([{key: 'Content-Type', value:'application/json'}]);
        }
        else{
          setHeaderFields([...headerFields, {key: 'Content-Type', value:'application/json'}]);
        }
      }
    }
    else{
      setHeaderFields(headerFields?.filter((vv,id) => vv?.key.toLowerCase() != 'content-type' && vv?.value.toLowerCase() != 'application/json'))
    }
  };
  
  const handleRawChange = (event) => {
    setRaw(event.target.value);

  };

  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error loading Business Units: {businessUnitsError.message}</p>;
  if (methodLoading) return <p>Loading methods...</p>;
  if (methodError) return <p>Error loading methods: {methodError.message}</p>;
  if (authTypeChoicesLoading) return <p>Loading...</p>;
  if (authTypeChoicesError) return <p>Error loading data</p>;  

  return (<><MuiNavbar />
    <Box sx={{ padding: '30px', backgroundColor: '#f4f4f4', height: '100vh', marginTop: '70px' }}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
      <form onSubmit={handleSend} autoComplete="off">
        <Grid container spacing={2} alignItems="center">
          
            <Grid item xs={12} md={4}>
              <TextField
                select
                required
                fullWidth
                label="Business Unit"
                value={businessUnit}
                onChange={handleBusinessUnitChange}
                variant="outlined"
              >
                {businessUnitsData.allBusinessUnit.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.businessUnitName}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                required
                fullWidth
                label="Sub Business Unit"
                value={subBusinessUnit}
                onChange={handleSubBusinessUnitChange}
                variant="outlined"
                disabled={!subBusinessUnitData || subBusinessUnitLoading}
              >
                {subBusinessUnitData && subBusinessUnitData.subBusinessUnitPerBusinessUnit.map((subUnit) => (
                <MenuItem key={subUnit.id} value={subUnit.id}>
                  {subUnit.subBusinessUnitName}
                </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Service Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                variant="outlined"
              />
            </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              required
              fullWidth
              label="API Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              variant="outlined"
            >
             {methodData.methodTypeChoices?.map((option) => (
                <MenuItem key={option.key} value={option.key}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              type='submit'
              startIcon={<SendIcon />}
              
              disabled= {!isButtonEnabled}
            >
              Send
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              color={isButtonEnabled? "success": "secondary"}
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleSave}
            >
              {isButtonEnabled ? "Validated" : "Validate"}
            </Button>
          </Grid>
        </Grid>


        {/* Navbar for Headers, Authorization, and Body */}
        <TabContext value={tabValue}>
          <AppBar position="static" sx={{ marginTop: '20px',backgroundColor: '#FFFFFF' }} elevation={0}>
            <TabList onChange={handleTabChange}>
              <Tab label= {`Headers (${headerFields.length})`} value="1" />
              <Tab label="Authorization" value="2" />
              <Tab label="Body" value="3" />
            </TabList>
          </AppBar>

          {/* Headers Tab */}
          <TabPanel value="1">
            <Grid container spacing={2}>
              

              {/* Dynamic Header Fields */}
              {headerFields.map((field, index) => (
                <Grid container item spacing={2} key={index}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Key"
                      variant="outlined"
                      value={field.key}
                      onChange={(e) => {
                        const newFields = [...headerFields];
                        newFields[index].key = e.target.value;
                        setHeaderFields(newFields);
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Value"
                      variant="outlined"
                      value={field.value}
                      onChange={(e) => {
                        const newFields = [...headerFields];
                        newFields[index].value = e.target.value;
                        setHeaderFields(newFields);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton onClick={() => handleRemoveHeaderField(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddHeaderField}
                  sx={{ marginTop: '10px' }}
                >
                  Add Header
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Authorization Tab */}
          <TabPanel value="2">
          {authTypeChoicesLoading ? (
                <p>Loading Authorization Types...</p>
              ) : authTypeChoicesError ? (
                <p>Error loading Authorization Types: {authTypeChoicesError.message}</p>
              ) : (
                <Grid container >
                  <Grid item xs={12} md={7} mb={3}>
                    <TextField
                      select
                      fullWidth
                      label="Authorization Type"
                      value={authorizationType}
                      onChange={(e)=>setAuthorizationType(e.target.value)}
                      variant="outlined"
                    >
                      {authTypeChoicesData.authTypeChoices.map((choice) => (
                        <MenuItem key={choice.key} value={choice.key}>
                          {choice.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {(authorizationType === 'BASIC'|| authorizationType==='API_KEY'||authorizationType ==='BEARER' ) && (
                    <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label={authorizationType === 'BASIC' ? (authorizationType === 'BEARER' ? 'Token' : 'Username' ) : (authorizationType === 'BEARER' ? 'Token' : 'Key' ) }
                          variant="outlined"
                          name='username'
                          value={authInput.username}
                          onChange={handleAuthChange}
                          onBlur = { addHeaderFields}
                        />
                      </Grid>
                      {(authorizationType === 'BASIC' || authorizationType==='API_KEY') && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label={authorizationType === 'BASIC' ? 'Password' : 'Value'}
                          variant="outlined"
                          type="password"
                          name='password'
                          value={authInput.password}
                          onChange={handleAuthChange}
                          onBlur = {addHeaderFields}
                        />
                      </Grid>)}
                      {(authorizationType==='API_KEY') && (
                        <Grid item xs={12} md={4}>
                          <TextField 
                          select
                          fullWidth
                          label="Add to"
                          value={addheaderto}
                          onChange={(e) => setAddheaderto(e.target.value)}
                          onBlur={addHeaderFields}
                          >
                          <MenuItem key="Header" value="Header">
                            Header
                            </MenuItem>
                            <MenuItem key="QueryParams" value="QueryParams">
                            Query Params
                            </MenuItem>
                          </TextField>
                        </Grid>
                      )}
                      </Grid>
                    </>
                  )}
                </Grid>
                
              )}

           
          </TabPanel>

          {/* Body Tab */}
          <TabPanel value="3">
            <FormControl>
              <RadioGroup
                row
                value={bodyType}
                onChange={handleBodychange}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio size="small"/>}
                  label="none"
                />
                <FormControlLabel
                  value="raw"
                  control={<Radio size="small"/>}
                  label="raw"
                />
                <FormControlLabel
                  value="GraphQL"
                  control={<Radio size="small"/>}
                  label="GraphQL"
                />
              </RadioGroup>
            </FormControl>
            {
                  bodyType === 'raw' && 
                  <TextField 
                    select
                    size="small"
                    value={raw}
                    onChange={handleRawChange}
                  >
                    <MenuItem value={"JSON"}>JSON</MenuItem>
                    <MenuItem value={'Text'}>Text</MenuItem>
                    <MenuItem value={'XML'}>XML</MenuItem>
                  </TextField>
                }
            { bodyType == 'none' ? <h4>This request does not have a body</h4>:
            <TextField
              fullWidth
              label={bodyType === 'GraphQL' ? 'Query' : "Body"}
              variant="outlined"
              multiline
              rows={6}
              value={body}
              sx={{ marginTop: 2 }}
              placeholder={bodyType === 'GraphQL' ? 'Write Your Query Here' : 'Input Body'}
              onChange={(e) => setBody(e.target.value)}
            />}
          </TabPanel>
        </TabContext>


        {/* Response Time, Frequency Time, and Recipient DL Fields */}
        <Grid container spacing={2} sx={{ marginTop: '20px'}}>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Expected Response Time (in ms)"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                select
                label="Monitoring frequency (in min)"
                value={frequencyTime}
                onChange={(e) => setFrequencyTime(e.target.value)}
                variant="outlined"
                required
                SelectProps={{
                  MenuProps: {
                    style: { maxHeight: 280 } 
                  }
                }}
              >
                {[...Array(12)]?.map((_, i) => (
                  <MenuItem key={i} value={(i + 1) * 5}>
                    {(i + 1) * 5}
                  </MenuItem>
                ))}
              </TextField>
              
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                required
                label="Email for alerts"
                value={recipientDL}
                onChange={(e) => setRecipientDL(e.target.value)}
                variant="outlined"
                type="email"
                multiline
                maxRows={2}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Teams Channel URL for alerts"
                value={teamsChannelWebhookURL}
                onChange={(e) => setWebhookURL(e.target.value)}
                variant="outlined"
                
              />
            </Grid>
            <Grid item xs={12} md={1} sx={{marginTop : "30px",marginLeft: "-10px"}}>
              <Tooltip title={<><Link href = 'https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=newteams%2Cdotnet' target= '_blank' color="inherit">Generate WebHook Url</Link></>}>
               <HelpIcon sx={{cursor : 'pointer'}} />
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={6} sx={{marginTop:'10px'}}>
                  Retry on error a maximum of &nbsp;&nbsp;
                  <TextField
                    id="filled-number"
                    value={maxretry}
                    type="number"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {setmaxretry(e.target.value)}}
                    onBlur={() => {
                      if (maxretry > 10) setmaxretry(10);
                      if (maxretry < 3) setmaxretry(3);
                    }}
                    sx={{width:'60px','& .MuiInputBase-root': {
                      height: '25px', 
                    },
                    '& .MuiInputBase-input': {
                      padding: '5px', 
                    },}}
                    inputProps={{
                      min: 3, 
                      max: 10, 
                    }}
                  /> &nbsp; times, with an interval of &nbsp;&nbsp;
                  <TextField
                    id="filled-number"
                    value={retryafter}
                    type="number"
                    variant="outlined"
                    size="small"
                    onChange={(e) => {setretryafter(e.target.value)}}
                    onBlur={() => {
                      if (retryafter > 600) setretryafter(600);
                      if (retryafter < 60) setretryafter(60);
                    }}
                    sx={{width:'70px','& .MuiInputBase-root': {
                      height: '25px', 
                    },
                    '& .MuiInputBase-input': {
                      padding: '5px', 
                    },}}
                    inputProps={{
                      min: 60, 
                      max: 600, 
                    }}
                  /> &nbsp; seconds.
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
    {/* <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          API validated successfully!!
        </Alert>
    </Snackbar> */}
    <ReusableSnackbar open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} handleClose={handleCloseSnackbar} />
    </>
  );
}