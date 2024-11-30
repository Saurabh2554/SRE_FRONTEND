import React, { useState ,useEffect} from 'react';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';

import { Box, Grid, TextField, Button, MenuItem, Typography, Paper, IconButton, AppBar, Tabs, Tab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useMutation,useQuery,useLazyQuery } from "@apollo/client";
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT , GET_AUTH_VALUE,GET_API_TYPE, VALIDATE_API} from "../../graphql/query/query"; 
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
  const [tabValue, setTabValue] = useState('1');
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnit, setSubBusinessUnit] = useState("");
  const [serviceName, setServiceName] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [frequencyTime, setFrequencyTime] = useState('');
  const [recipientDL, setRecipientDL] = useState('');
  const [labelName,setLabelName] = useState('Body');
  const [authorizationType, setAuthorizationType] = useState('');
  const [isButtonEnabled, setButtonEnabled] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [apiresponse, setApiresonse] = useState({});

  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery(GET_ALL_BUSINESS_UNIT);
  const [fetchSubBusinessUnits, { data: subBusinessUnitData, loading: subBusinessUnitLoading }] = useLazyQuery(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);
  const { data: methodData, loading: methodLoading, error: methodError } = useQuery(GET_API_TYPE);
  const { data: authTypeChoicesData, loading: authTypeChoicesLoading, error: authTypeChoicesError } = useQuery(GET_AUTH_VALUE);
  const [createApiMonitor, { data, loading, error }] = useMutation(CREATE_API_MONITOR, { errorPolicy: "all" });
  const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API);

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
        authorizationObj[authInput.username] = authInput.password;
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

      if(authorizationType != 'API_KEY')
        authorizationObj['Authorization'] = authValue;
      
      setAuthHeader([authorizationObj]);
    }
  };

  useEffect(() => {
    setAuthInput({ username: '', password: '' });
  }, [authorizationType]);

  const handleSend = async () => {
    try {
      const Header = [...headerFields, ...AuthHeader];
      const result = await createApiMonitor({
        variables: {
          input: {
            businessUnit,
            subBusinessUnit,
            apiName: serviceName,
           
            apiUrl: url,
            apiCallInterval: parseInt(frequencyTime, 10),
            expectedResponseTime: parseInt(responseTime, 10), 
            //expectedStatusCode: 200, 
            headers: JSON.stringify(Header),
           // graphqlQuery: body,
            recipientDl: recipientDL,
            createdBy: 'user', 
          },
        },
      });
      if(error){
        SetSnackbarFields(true, error.message, "error");
        return
      }
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
    
    } catch (er) {
      SetSnackbarFields(true, "Unknown Error occured!", "error");
    }
  };


  const handleSave = async () => {
    if(!method || !url){
      SetSnackbarFields(true, "Enter a valid API Url!", "error");
    }
    else{
      const type = method.split(' ');

      if(type[0] === "REST"){
        const result = await validateApi({
          variables: {
            apiURL: url,
           // apiType: 'REST'
          }
        });
        
        setApiresonse(result.data);
      }
      else{
        if(!body){
          SetSnackbarFields(true, "Valid Query is required", "error");
        }
        else{
          console.log(JSON.stringify(body));
          console.log(url);
          const result = await validateApi({
            variables:{
              apiURL: url,
              //apiType: 'GraphQL',
              query: body
            }
          });
          setApiresonse(result.data);
        }
      }
    }
    if(apierror){
      SetSnackbarFields(true, "Invalid API URL!", "error");
    }
  };
  useEffect(() => {
    if(apiresponse && apiresponse.validateApi){
      const statuscode = apiresponse?.validateApi?.status;
      
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

  useEffect(() => {
    setBody('');
    if (method) {
      setLabelName(method === 'GraphQL API' ? 'Query' : 'Body');
      

    }
  }, [method]);

 

  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error loading Business Units: {businessUnitsError.message}</p>;
  if (methodLoading) return <p>Loading methods...</p>;
  if (methodError) return <p>Error loading methods: {methodError.message}</p>;
  if (authTypeChoicesLoading) return <p>Loading...</p>;
  if (authTypeChoicesError) return <p>Error loading data</p>;  

  return (<><MuiNavbar />
    <Box sx={{ padding: '30px', backgroundColor: '#f4f4f4', height: '100vh', marginTop: '70px' }}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
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
              label="API Type"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              variant="outlined"
            >
             {methodData.apiTypeChoices.map((option) => (
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
              startIcon={<SendIcon />}
              onClick={handleSend}
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
              <Tab label="Headers" value="1" />
              <Tab label="Authorization" value="2" />
              <Tab label={labelName} value="3" />
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
                <Grid container spacing={2}>
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
            <TextField
              fullWidth
              label={labelName}
              variant="outlined"
              multiline
              rows={6}
              value={body}
              placeholder={method === 'GraphQL API' ? 'Write Your Query Here' : 'Input Body'}
              onChange={(e) => setBody(e.target.value)}
            />
          </TabPanel>
        </TabContext>


        {/* Response Time, Frequency Time, and Recipient DL Fields */}
        <Grid container spacing={2} sx={{ marginTop: '20px' }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Response Time (in ms)"
                value={responseTime}
                onChange={(e) => setResponseTime(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Interval (min)"
                value={frequencyTime}
                onChange={(e) => setFrequencyTime(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Recipient DL"
                value={recipientDL}
                onChange={(e) => setRecipientDL(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
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
