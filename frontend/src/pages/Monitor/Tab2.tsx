import React from 'react';
import { Grid, TextField, Button, MenuItem} from '@mui/material';
import { useQuery,useLazyQuery } from "@apollo/client";
import { GET_API_TYPE, VALIDATE_API} from "../../graphql/query/query"; 
import Tab22 from './Tab22';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { FormState } from './MonitorService';
import {
  GetApiTypeQuery,
  ValidateApiQuery,
  ValidateApiQueryVariables,
} from "../../graphql/types";

type Tab2Types = {
  state: FormState["tab2"];
  setState: (newState: FormState["tab2"]) => void;
  isButtonEnabled: boolean;
  SetSnackbarFields: (
    open: boolean,
    message: string | null | undefined,
    severity: string
  ) => void;
  snackbarState: {
    open: boolean;
    message: string | null | undefined;
    severity: string;
  };
  enableButton: React.Dispatch<React.SetStateAction<boolean>>
};

const Tab2: React.FC <Tab2Types> =  ({ state,enableButton,isButtonEnabled, setState,snackbarState,SetSnackbarFields }) => {

  const {
    data: methodData,
    loading: methodLoading,
    error: methodError,
  } = useQuery<GetApiTypeQuery>(GET_API_TYPE);

  const [
    validateApi,
    { data: validateapi, loading: apiloading, error: apierror },
  ] = useLazyQuery<ValidateApiQuery, ValidateApiQueryVariables>(VALIDATE_API, {
    fetchPolicy: "network-only",
  });
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, url: e.target.value });
    enableButton(false);
    SetSnackbarFields(false, "", "");
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
      if(apierror || !(result?.data?.validateApi?.success)){
        SetSnackbarFields(true, apierror?.message || "Invalid API!", "error");
        return
      }
      enableButton(true);
      SetSnackbarFields(true, "Api validated successfully!", "success");
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
          
            <MenuItem key={option?.key} value={option?.key}>
              {option?.value}
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
    <Tab22 state = {state} setState = {setState}/>
      {/* Add the rest of Tab2 fields */}
    </>
  );
};

export default Tab2;