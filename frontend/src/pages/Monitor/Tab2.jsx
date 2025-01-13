import React, { useState ,useEffect} from 'react';
import {Radio, RadioGroup, FormControl, FormControlLabel} from '@mui/material';
import { Box, Grid, TextField, Button, MenuItem,  Tooltip } from '@mui/material';
import { useMutation,useQuery,useLazyQuery } from "@apollo/client";
import { GET_API_TYPE, VALIDATE_API} from "../../graphql/query/query"; 
import Tab22 from './Tab22';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const Tab2 = ({ state,enableButton,isButtonEnabled, setState,snackbarState,SetSnackbarFields }) => {

  const { data: methodData, loading: methodLoading, error: methodError } = useQuery(GET_API_TYPE);

  const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API,{
      fetchPolicy: 'network-only',
    });

  useEffect(() => {
        enableButton(false);
        SetSnackbarFields(false,"","")
    },[state.url]);

  const handleValidateUrl = async () => {
   
    const Header = [...state.headerFields, ...state.authHeader];

    if(state.url){
      const result = await validateApi({
        variables: {
          apiUrl: state.url,
          methodType: state.method,
          headers: JSON.stringify(Header),
          requestBody: state.bodyType == 'GraphQL' ? JSON.stringify({query: state.body.trim()})  : state.body
        }
      });

      if(apierror || !validateapi?.validateApi?.success){
        console.log(apierror, " ",validateapi," ",result)
        SetSnackbarFields(true, apierror?.message || "Invalid API!", "error");
        return
      }
      enableButton(true);
      SetSnackbarFields(true, "Api validated successfully!" || "Invalid API!", "success");
    } 
  };


  return (
    <>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={2}>
      <TextField
        select
        required
        fullWidth
        label="API Method"
        value={state.method}
        onChange={(e) => setState({ ...state, method: e.target.value })}
        variant="outlined"
        >
        {methodData?.methodTypeChoices?.map((option) => (
            <MenuItem key={option.key} value={option.key}>
            {option.value}
            </MenuItem>
        ))}
      </TextField>
      </Grid>
      <Grid item xs={12} md={7}>
      <TextField
        fullWidth
        label="URL"
        variant="outlined"
        value={state.url}
        onChange={(e) => setState({ ...state, url: e.target.value })}
        required
      />
      </Grid>
      <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              color={isButtonEnabled? "success": "secondary"}
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleValidateUrl}
            >
              {isButtonEnabled ? "Validated" : "Validate"}
            </Button>
          </Grid>
      </Grid>
    <Tab22 state = {state} setState = {setState} snackbarState={snackbarState} SetSnackbarFields = {SetSnackbarFields} />
   
      {/* Add the rest of Tab2 fields */}
    </>
  );
};

export default Tab2;