import React, { useState ,useEffect} from 'react';
import { Box, Grid, TextField, Button, MenuItem, Typography, Paper, IconButton, AppBar, Tabs, Tab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {Radio, RadioGroup, FormControl, FormControlLabel} from '@mui/material';
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_SERVICE_BY_ID,GET_AUTH_VALUE,VALIDATE_API } from '../../graphql/query/query';

export default function NewServiceUpdate({id}){
    
    const [recipientDL, setRecipientDL] = useState('');
    const [frequencyTime, setFrequencyTime] = useState('');
    const [responseTime, setResponseTime] = useState('');
    const [bodyType, setBodytype] = useState('none');
    const [raw, setRaw] = useState('JSON');
    const [body, setBody] = useState('');
    const [authorizationType, setAuthorizationType] = useState('');
    const [authInput, setAuthInput] = useState({ username: '', password: '' });
    const [addheaderto, setAddheaderto] = useState('');
    const [headerFields, setHeaderFields] = useState([{ key: '', value: '' }]);
    const [AuthHeader, setAuthHeader] = useState([{ key: '', value: ''}]);
    const [tabValue, setTabValue] = useState('1');
    const [isButtonEnabled, setButtonEnabled] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const { data: authTypeChoicesData, loading: authTypeChoicesLoading, error: authTypeChoicesError } = useQuery(GET_AUTH_VALUE);
    const { data: serviceData, loading: serviceLoading, error: serviceError,refetch } = useQuery(GET_SERVICE_BY_ID,{
        variables:{
            serviceId:id
        }
    });
    
    const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API);
    const {apiName, apiCallInterval,apiUrl,businessUnit,subBusinessUnit,methodType,headers, expectedResponseTime,requestBody} = serviceData?.getServiceById
    
    const handleBodychange = (event) => {
        setBodytype(event.target.value);

        if(event.target.value === 'GraphQL'){
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
    
    const addHeaderFields = () => {
    
        let authValue = '';
        const authorizationObj ={};
        if(authorizationType === 'API_KEY' && (authInput.username !== '' && authInput.password !== '') ){
          if(addheaderto == 'Header'){
            authorizationObj['key'] = authInput.username;
            authorizationObj['value'] = authInput.password;
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

    const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthInput((prev) => ({
        ...prev,
        [name]: value,
    }));
    }; 
    const SetSnackbarFields =  (open, message, severity) => {
        setOpenSnackbar(open);
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
      };
    const handleValidate = async () => {
   
        const Header = [...headerFields, ...AuthHeader];
    
        if(apiUrl){
          const result = await validateApi({
            variables: {
              apiUrl: apiUrl,
              methodType: methodType,
              headers: JSON.stringify(Header),
              requestBody: bodyType == 'GraphQL' ? JSON.stringify({query: body.trim()})  : body
            }
          });
          console.log(result);
          if(apierror){
            SetSnackbarFields(true, apierror.message || "Invalid API!", "error");
            return
          }
          const statuscode = result.data?.validateApi?.status;
          if(result.data?.validateApi?.success && statuscode>= 200 && statuscode<400){
            setButtonEnabled(true);
            SetSnackbarFields(true, "API validated successfully!", "success");
          }
    
    
        } 
      };

    useEffect(()=>{
      refetch()
     const parsedHeaders = JSON.parse(headers)
     
     setHeaderFields(parsedHeaders.filter(vv=>vv.key!=''))
     setFrequencyTime(apiCallInterval)
     setResponseTime(expectedResponseTime)
    
     
    },[id])
    return <>
    
    <Box sx={{ padding: '10px', backgroundColor: '#f4f4f4', height: '100vh', marginTop: '10px',width:"1000px" }}>
      <Paper elevation={3} sx={{ padding: '20px' }}>
        <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Business Unit"
                value={businessUnit?.businessUnitName}
                variant="outlined"
                disabled
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Sub Business Unit"
                value={subBusinessUnit?.subBusinessUnitName}
                variant="outlined"
                disabled
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Service Name"
                value={apiName}
                variant="outlined"
                disabled
              />
            </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              required
              fullWidth
              label="API Method"
              value={methodType}
              variant="outlined"
              disabled
            >
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="URL"
              variant="outlined"
              value={apiUrl}
              required
              disabled
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              startIcon={<SendIcon />}
            //   onClick={handleSend}
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
              onClick={handleValidate}
            >
              {isButtonEnabled ? "Validated" : "Validate"}
            </Button>
          </Grid>
        </Grid>


        
        <TabContext value={tabValue}>
          <AppBar position="static" sx={{ marginTop: '20px',backgroundColor: '#FFFFFF' }} elevation={0}>
            <TabList onChange={(e)=>setTabValue(e.target.value)}>
              <Tab label= {`Headers (${headerFields.length})`} value="1" />
              <Tab label="Authorization" value="2" />
              <Tab label="Body" value="3" />
            </TabList>
          </AppBar>

      
          <TabPanel value="1">
            <Grid container spacing={2}>
              

             
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
                    <IconButton onClick={() => setHeaderFields(headerFields.filter((_, i) => i !== index))}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  startIcon={<AddCircleIcon />}
                  onClick={(e)=>setHeaderFields([...headerFields, { key: '', value: '' }])}
                  sx={{ marginTop: '10px' }}
                >
                  Add Header
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

        
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
                    onChange={(e)=>setRaw(e.target.value)}
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
                select
                label="Interval (min)"
                value={frequencyTime}
                onChange={(e) => setFrequencyTime(e.target.value)}
                variant="outlined"
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                label="Recipient DL"
                value={recipientDL}
                onChange={(e) => setRecipientDL(e.target.value)}
                variant="outlined"
                type="email"
                multiline
                maxRows={2}
              />
            </Grid>
          </Grid>
      </Paper>
    </Box>
    </>
}