import { useQuery, useLazyQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Tooltip,
  Grid2,
} from '@mui/material';
import {
  GET_ALL_BUSINESS_UNIT,
  GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,
  GET_AUTH_VALUE,
  GET_API_TYPE,
  VALIDATE_API,
  VALIDATE_TEAMS_CHANNEL,
} from '../../graphql/query/query';

function Tab1({ state, setState }) {
  const {
    data: businessUnitsData,
    loading: businessUnitsLoading,
    error: businessUnitsError,
  } = useQuery(GET_ALL_BUSINESS_UNIT);
  const [
    fetchSubBusinessUnits,
    { data: subBusinessUnitData, loading: subBusinessUnitLoading },
  ] = useLazyQuery(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);

  const handleBusinessUnitChange = (e) => {
    const selectedBusinessUnit = e.target.value;
    setState({ ...state, businessUnit: selectedBusinessUnit });
    handleSubBusinessunit(selectedBusinessUnit);
  };

  const handleSubBusinessunit = (selectedBusinessUnit) => {
    if (selectedBusinessUnit) {
      fetchSubBusinessUnits({
        variables: {
          id: selectedBusinessUnit,
        },
      });
    }
  };

  useEffect(() => {
    handleSubBusinessunit(state.businessUnit);
    console.log(state);
  }, [businessUnitsData]);

  return (
    <div>
      <Grid2
        container
        direction="column"
        rowSpacing={5}
        sx={{ marginBottom: '3rem' }}
      >
        <Grid2 item xs={12} md={4}>
          <TextField
            select
            required
            fullWidth
            label="Business Unit"
            value={state.businessUnit}
            onChange={handleBusinessUnitChange}
            variant="outlined"
          >
            {businessUnitsData?.businessUnit?.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.businessUnitName}
              </MenuItem>
            ))}
          </TextField>
        </Grid2>
        <Grid2 item xs={12} md={4}>
          <TextField
            select
            required
            fullWidth
            label="Sub Business Unit"
            value={state.subBusinessUnit}
            onChange={(e) =>
              setState({ ...state, subBusinessUnit: e.target.value })
            }
            variant="outlined"
            disabled={!subBusinessUnitData || subBusinessUnitLoading}
          >
            {subBusinessUnitData?.subBusinessUnitPerBusinessUnit?.map(
              (subUnit) => (
                <MenuItem key={subUnit.id} value={subUnit.id}>
                  {subUnit.subBusinessUnitName}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid2>
        <Grid2 item xs={12} md={4}>
          <TextField
            required
            fullWidth
            label="Service Name"
            value={state.serviceName}
            onChange={(e) =>
              setState({ ...state, serviceName: e.target.value })
            }
            variant="outlined"
          />
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Tab1;
