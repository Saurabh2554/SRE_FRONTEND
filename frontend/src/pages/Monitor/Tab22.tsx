import React, { useState, useMemo } from 'react';
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  AppBar,
  Tab,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_AUTH_VALUE } from '../../graphql/query/query';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Tab22 = ({ state, setState }) => {
  const [tabValue, setTabValue] = useState('1');
  const {
    data: authTypeChoicesData,
    loading: authTypeChoicesLoading,
    error: authTypeChoicesError,
  } = useQuery(GET_AUTH_VALUE);
  const [options] = useState(['none', 'raw', 'GraphQl']);

  const renderedOptions = useMemo(() => {
    return options.map((vv, id) => {
      return (
        <FormControlLabel
          value={vv}
          control={<Radio size="small" />}
          label={vv}
          key={id}
        />
      );
    });
  }, [options]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const addHeaderFields = () => {
    let authValue = '';
    const authorizationObj = {};
    let url = state.url;
    if (
      state.authorizationType === 'API_KEY' &&
      state.authInput.username !== '' &&
      state.authInput.password !== ''
    ) {
      if (state.addheaderto == 'Header') {
        authorizationObj['key'] = state.authInput.username;
        authorizationObj['value'] = state.authInput.password;
      } else if (state.addheaderto == 'QueryParams') {
        const encodedValue = encodeURIComponent(state.authInput.password);
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}${state.authInput.username}=${encodedValue}`;
      }
    } else if (state.authorizationType === 'BEARER') {
      authValue = `Bearer ${state.authInput.username}`;
    } else if (state.authorizationType === 'BASIC') {
      if (state.authInput.username && state.authInput.password) {
        const encodedCredentials = btoa(
          `${state.authInput.username}:${state.authInput.password}`
        );
        authValue = `Basic ${encodedCredentials}`;
      }
    }

    if (
      authValue != '' ||
      (state.authorizationType === 'API_KEY' && state.addheaderto != '')
    ) {
      if (state.authorizationType != 'API_KEY') {
        authorizationObj['key'] = 'Authorization';
        authorizationObj['value'] = authValue;
      }

      setState({ ...state, authHeader: [authorizationObj], url: url });
    }
  };
  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, authInput: { ...state.authInput, [name]: value } });
  };

  const handleBodychange = (event) => {
    let headerFieldTemp = [];
    let method = '';
    let bodyType = event.target.value;

    if (event.target.value == 'GraphQl') {
      if (method !== 'POST') {
        method = 'POST';
      }
      const found = state.headerFields?.some(
        (vv) =>
          vv.key.toLowerCase() == 'content-type' &&
          vv.value.toLowerCase() == 'application/json'
      );

      if (!found) {
        if (state.headerFields[0]?.key == '') {
          headerFieldTemp = [
            { key: 'Content-Type', value: 'application/json' },
          ];
        } else {
          headerFieldTemp = [
            ...state.headerFields,
            { key: 'Content-Type', value: 'application/json' },
          ];
        }
      }
    } else {
      if (event.target.value === 'raw') {
        method = 'POST';
      }
      headerFieldTemp = state.headerFields?.filter(
        (vv, id) =>
          vv?.key.toLowerCase() != 'content-type' &&
          vv?.value.toLowerCase() != 'application/json'
      );
    }
    setState(
      ((prevState) => {
        return {
          ...state,
          headerFields: headerFieldTemp,
          method: method,
          bodyType: bodyType,
          raw: 'JSON',
        };
      })()
    );
  };
  return (
    <div>
      <TabContext value={tabValue}>
        <AppBar
          position="static"
          sx={{ marginTop: '20px', backgroundColor: '#FFFFFF' }}
          elevation={0}
        >
          <TabList onChange={handleTabChange}>
            <Tab
              label={`Headers${state.headerFields.length > 0 ? ` (${state.headerFields.length})` : ''}`}
              value="1"
            />
            <Tab label="Authorization" value="2" />
            <Tab label="Body" value="3" />
          </TabList>
        </AppBar>

        {/* Headers Tab */}
        <TabPanel value="1">
          <Grid container spacing={2}>
            {/* Dynamic Header Fields */}
            {state.headerFields?.map((field, index) => (
              <Grid container item spacing={2} key={index}>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Key"
                    variant="outlined"
                    value={field.key}
                    onChange={(e) => {
                      const newFields = [...state.headerFields];
                      newFields[index].key = e.target.value;
                      setState({ ...state, headerFields: newFields });
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
                      const newFields = [...state.headerFields];
                      newFields[index].value = e.target.value;
                      setState({ ...state, headerFields: newFields });
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() =>
                      setState({
                        ...state,
                        headerFields: state.headerFields.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                startIcon={<AddCircleIcon />}
                onClick={() =>
                  setState({
                    ...state,
                    headerFields: [
                      ...state.headerFields,
                      { key: '', value: '' },
                    ],
                  })
                }
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
            <p>
              Error loading Authorization Types: {authTypeChoicesError.message}
            </p>
          ) : (
            <Grid container>
              <Grid item xs={12} md={7} mb={3}>
                <TextField
                  select
                  fullWidth
                  label="Authorization Type"
                  value={state.authorizationType}
                  onChange={(e) =>
                    setState({ ...state, authorizationType: e.target.value })
                  }
                  variant="outlined"
                >
                  {authTypeChoicesData?.authTypeChoices?.map((choice) => (
                    <MenuItem key={choice.key} value={choice.key}>
                      {choice.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {(state.authorizationType === 'BASIC' ||
                state.authorizationType === 'API_KEY' ||
                state.authorizationType === 'BEARER') && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label={
                          state.authorizationType === 'BASIC'
                            ? state.authorizationType === 'BEARER'
                              ? 'Token'
                              : 'Username'
                            : state.authorizationType === 'BEARER'
                              ? 'Token'
                              : 'Key'
                        }
                        variant="outlined"
                        name="username"
                        value={state.authInput.username}
                        onChange={handleAuthChange}
                        onBlur={addHeaderFields}
                      />
                    </Grid>
                    {(state.authorizationType === 'BASIC' ||
                      state.authorizationType === 'API_KEY') && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label={
                            state.authorizationType === 'BASIC'
                              ? 'Password'
                              : 'Value'
                          }
                          variant="outlined"
                          type="password"
                          name="password"
                          value={state.authInput.password}
                          onChange={handleAuthChange}
                          onBlur={addHeaderFields}
                        />
                      </Grid>
                    )}
                    {state.authorizationType === 'API_KEY' && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          select
                          fullWidth
                          label="Add to"
                          value={state.addheaderto}
                          onChange={(e) =>
                            setState({ ...state, addheaderto: e.target.value })
                          }
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
            <RadioGroup row value={state.bodyType} onChange={handleBodychange}>
              {renderedOptions}
            </RadioGroup>
          </FormControl>
          {state.bodyType === 'raw' && (
            <TextField
              select
              size="small"
              value={state.raw}
              onChange={(event) =>
                setState({ ...state, raw: event.target.value })
              }
            >
              <MenuItem value={'JSON'}>JSON</MenuItem>
              <MenuItem value={'Text'}>Text</MenuItem>
              <MenuItem value={'XML'}>XML</MenuItem>
            </TextField>
          )}
          {state.bodyType == 'none' ? (
            <h4>This request does not have a body</h4>
          ) : (
            <TextField
              fullWidth
              label={state.bodyType === 'GraphQL' ? 'Query' : 'Body'}
              variant="outlined"
              multiline
              rows={6}
              value={state.body}
              sx={{ marginTop: 2 }}
              placeholder={
                state.bodyType === 'GraphQL'
                  ? 'Write Your Query Here'
                  : 'Input Body'
              }
              onChange={(e) => setState({ ...state, body: e.target.value })}
            />
          )}
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default Tab22;
