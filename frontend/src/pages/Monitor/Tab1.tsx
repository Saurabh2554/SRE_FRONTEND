import { useQuery, useLazyQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  GET_ALL_BUSINESS_UNIT,
  GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,
} from "../../graphql/query/query";
import {
  TextField,
  MenuItem,
  Grid2,
} from "@mui/material";
import {
  BusinessUnitType,
  GetBusinessUnitQuery,
  GetBusinessUnitQueryVariables,
  GetSubBusinessUnitPerBusinessUnitQuery,
  GetSubBusinessUnitPerBusinessUnitQueryVariables,
} from "../../graphql/types";
import { FormState } from "./MonitorService";

type Tab1types = {
  state: FormState["tab1"];
  setState: (newState: FormState["tab1"]) => void;
};

const Tab1: React.FC<Tab1types> = ({ state, setState }) => {
  const {
    data: businessUnitsData,
    loading: businessUnitsLoading,
    error: businessUnitsError,
  } = useQuery<GetBusinessUnitQuery, GetBusinessUnitQueryVariables>(
    GET_ALL_BUSINESS_UNIT
  );
  const [
    fetchSubBusinessUnits,
    { data: subBusinessUnitData, loading: subBusinessUnitLoading, error },
  ] = useLazyQuery<
    GetSubBusinessUnitPerBusinessUnitQuery,
    GetSubBusinessUnitPerBusinessUnitQueryVariables
  >(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);

  const handleBusinessUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBusinessUnit = e.target.value;
    setState({ ...state, businessUnit: selectedBusinessUnit });
    handleSubBusinessunit(selectedBusinessUnit);
  };

  const handleSubBusinessunit = (selectedBusinessUnit: string) => {
    if (selectedBusinessUnit) {
      fetchSubBusinessUnits({
        variables: {
          id: selectedBusinessUnit,
        },
      });
    }
    return;
  };

  useEffect(() => {
    handleSubBusinessunit(state.businessUnit);
    console.log(state);
  }, [businessUnitsData]);

  return (
    <div>
      <Grid2
        container
        direction={"column"}
        rowSpacing={5}
        sx={{ marginBottom: "3rem" }}
      >
        <Grid2 container size={{ xs: 12, md: 12 }}>
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
              <MenuItem key={unit?.id} value={unit?.id}>
                {unit?.businessUnitName}
              </MenuItem>
            ))}
          </TextField>
        </Grid2>
        <Grid2 container size={{ xs: 12, md: 12 }}>
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
                <MenuItem key={subUnit?.id} value={subUnit?.id}>
                  {subUnit?.subBusinessUnitName}
                </MenuItem>
              )
            )}
          </TextField>
        </Grid2>
        <Grid2 container size={{ xs: 12, md: 12 }}>
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
};

export default Tab1;
