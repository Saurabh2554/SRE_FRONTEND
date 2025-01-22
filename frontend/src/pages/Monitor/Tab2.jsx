import React from 'react';
import { Grid, TextField, Button, MenuItem} from '@mui/material';
import { useQuery,useLazyQuery } from "@apollo/client";
import { GET_API_TYPE, VALIDATE_API} from "../../graphql/query/query"; 
import Tab22 from './Tab22';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const Tab2 = ({ state,enableButton,isButtonEnabled, setState,snackbarState,SetSnackbarFields }) => {

  const { data: methodData, loading: methodLoading, error: methodError } = useQuery(GET_API_TYPE);

  const [validateApi, {data: validateapi, loading: apiloading, error: apierror}] = useLazyQuery(VALIDATE_API,{
      fetchPolicy: 'network-only',
    });
  
  const handleUrlChange = (e) => {
    setState({...state, url: e.target.value});
    enableButton(false);
    SetSnackbarFields(false,"", "");
  };

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
      if(apierror || !(result.data.validateApi.success)){
        SetSnackbarFields(true, apierror?.message || "Invalid API!", "error");
        return
      }
      enableButton(true);
      SetSnackbarFields(true, "Api validated successfully!" || "Invalid API!", "success");
    }
    else{
      SetSnackbarFields(true, "Enter a valid API URL", "error");
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
      <Grid item xs={12} md={8}>
      <TextField
        fullWidth
        label="URL"
        variant="outlined"
        value={state.url}
        onChange={handleUrlChange}
        required
      />
      </Grid>
      <Grid item xs={12} md={2}>
      <Button
          variant="contained"
          color={isButtonEnabled? "success": "secondary"}
          startIcon={<CheckCircleOutlineIcon />}
          onClick={handleValidateUrl}
          sx={{width:'100%'}}
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