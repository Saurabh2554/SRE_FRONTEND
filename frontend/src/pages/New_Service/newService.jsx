import React, { useState ,useEffect} from 'react';
import { MuiNavbar } from "../../common/components/Navbar/navbar";
import { ReusableSnackbar } from '../../common/components/Snackbar/Snackbar';

import { Box, Grid, TextField, Button, MenuItem, Typography, Paper, IconButton, AppBar, Tabs, Tab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useMutation,useQuery,useLazyQuery } from "@apollo/client";
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT , GET_AUTH_VALUE,GET_API_TYPE, VALIDATE_API} from "../../graphql/query/query"; 
import {CREATE_API_MONITOR} from '../../graphql/mutation/mutation';

// const methods = [
//   { value: 'GET', label: 'GET' },
//   { value: 'POST', label: 'POST' },
// ];



export default function NewService() {
  const [method, setMethod] = useState('');
  const [url, setUrl] = useState('');
  const [start, setStart] = useState('');
  const [pageSize, setPageSize] = useState('');
  const [headerFields, setHeaderFields] = useState([{ key: '', value: '' }]); // For dynamic headers
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
  const [createApiMonitor, { data, loading, error }] = useMutation(CREATE_API_MONITOR);
  const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API);

  const handleBusinessUnitChange = (e) => {
    const selectedBusinessUnit = e.target.value;
    setBusinessUnit(selectedBusinessUnit);
    console.log("Before Update label",businessUnit);
    
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

  const handleSend = async () => {
    try {
      const result = await createApiMonitor({
        variables: {
          input: {
            businessUnit,
            subBusinessUnit,
            apiName: serviceName,
            apiType: method,
            apiUrl: url,
            apiCallInterval: parseInt(frequencyTime, 10),
            expectedResponseTime: parseInt(responseTime, 10), 
            //expectedStatusCode: 200, 
            headers: JSON.stringify(headerFields),
           // graphqlQuery: body,
            recipientDl: recipientDL,
            createdBy: 'user', 
          },
        },
      });
      console.log('Mutation result:', result.data);
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
    } catch (error) {
      console.error('Error creating API monitor:', error);
    }
  };


  const handleSave = async () => {
    if(!method || !url){
      console.log("Enter a valid API url");
    }
    else{
      const type = method.split(' ');

      if(type[0] === "REST"){
        const result = await validateApi({
          variables: {
            apiURL: url,
            apiType: type[0]
          }
        });
        
        setApiresonse(result.data);
      }
      else{
        if(!body){
          console.log("Valid query is required");
        }
        else{
          console.log(JSON.stringify(body));
          console.log(url);
          const result = await validateApi({
            variables:{
              apiURL: url,
              apiType: type[0],
              query: body
            }
          });
          setApiresonse(result.data);
          console.log(result);
        }
      }
    }
    if(apierror){
      console.log("api not valid");
      setOpenSnackbar(true);
      setSnackbarMessage("Invalid API URL!");
      setSnackbarSeverity("error");
    }
  };
  useEffect(() => {
    if(apiresponse && apiresponse.validateApi){
      const statuscode = apiresponse?.validateApi?.status;
      console.log("response received");
      console.log(apiresponse);
      console.log(statuscode);
      if(statuscode>= 200 && statuscode<300){
        console.log("statuscode received");
        setButtonEnabled(true);
        setOpenSnackbar(true);
        setSnackbarMessage("API validated successfully!");
        setSnackbarSeverity("success");
      }
    }
  },[apiresponse]);

  useEffect(() => {
    if(!url){
      setButtonEnabled(false);
      setOpenSnackbar(false);
      setApiresonse({});
    }
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
                <MenuItem key={option.key} value={option.value}>
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
                        <MenuItem key={choice.key} value={choice.value}>
                          {choice.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {(authorizationType === 'Basic Authentication'|| authorizationType==='API Key'||authorizationType ==='Bearer Token (OAuth)' ) && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={authorizationType === 'Basic Authentication' ? (authorizationType === 'Bearer Token (OAuth)' ? 'Token' : 'Username' ) : (authorizationType === 'Bearer Token (OAuth)' ? 'Token' : 'Key' ) }
                          variant="outlined"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </Grid>
                      {(authorizationType === 'Basic Authentication'|| authorizationType==='API Key' ) && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label={authorizationType === 'Basic Authentication' ? 'Password' : 'Value'}
                          variant="outlined"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </Grid>)}
                    </>
                  )}

                  {authorizationType === 'Custom Authentication'&& (
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
                        Add Rows
                      </Button>
                    </Grid>
                  </Grid>
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
                label="Frequency Time"
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
