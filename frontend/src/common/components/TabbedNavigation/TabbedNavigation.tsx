// components/TabbedNavigation.js

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Tab,
  TextField,
  AppBar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_ALL_BUSINESS_UNIT,
  GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,
  GET_AUTH_VALUE,
  GET_API_TYPE,
} from '../../../graphql/query/query';

export default function TabbedNavigation({
  method,
  setMethod,
  url,
  setUrl,
  start,
  setStart,
  pageSize,
  setPageSize,
  headerFields,
  setHeaderFields,
  username,
  setUsername,
  password,
  setPassword,
  body,
  setBody,
  businessUnit,
  setBusinessUnit,
  subBusinessUnit,
  setSubBusinessUnit,
  serviceName,
  setServiceName,
  responseTime,
  setResponseTime,
  frequencyTime,
  setFrequencyTime,
  recipientDL,
  setRecipientDL,
  labelName,
  setLabelName,
  authorizationType,
  setAuthorizationType,
  fetchSubBusinessUnits,
  businessUnitsData,
  subBusinessUnitData,
  authTypeChoicesData,
  methodData,
  handleSend,
  handleSave,
  handleAddHeaderField,
  handleRemoveHeaderField,
  handleBusinessUnitChange,
  handleSubBusinessUnitChange,
  handleTabChange,
  tabValue,
}) {
  return (
    <TabContext value={tabValue}>
      <AppBar
        position="static"
        sx={{ marginTop: '20px', backgroundColor: '#FFFFFF' }}
        elevation={0}
      >
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
        {authTypeChoicesData ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={7} mb={3}>
              <TextField
                select
                fullWidth
                label="Authorization Type"
                value={authorizationType}
                onChange={(e) => setAuthorizationType(e.target.value)}
                variant="outlined"
              >
                {authTypeChoicesData.authTypeChoices.map((choice) => (
                  <MenuItem key={choice.key} value={choice.value}>
                    {choice.value}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {authorizationType === 'Basic Authentication' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        ) : (
          <p>Loading Authorization Types...</p>
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
          placeholder={
            method === 'GraphQL API' ? 'Write Your Query Here' : 'Input Body'
          }
          onChange={(e) => setBody(e.target.value)}
        />
      </TabPanel>
    </TabContext>
  );
}
