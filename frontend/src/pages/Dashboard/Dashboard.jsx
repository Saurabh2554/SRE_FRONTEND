import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {ApiListWithPagination} from "../../common/components/MuiGrid/ApiListWithPagination";
import {ApiDataGrid} from "../../common/components/DataGrid/ApiDataGrid";
import APImonitoringLogo from "../../common/Resources/APImonitoringLogo.png";
import {DateRangePickerComponent} from "../../common/components/DateRangePicker/DateRangePickerComponent";
import React, { useState,useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import the necessary Chart.js components
import ChartComponent from "./ChartComponent";

import {  TablePagination } from '@mui/material';
import { Grid2 } from '@mui/material';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";



import { useMutation,useQuery,useLazyQuery } from "@apollo/client";
import { red } from "@mui/material/colors";
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,GET_ALL_METRICS } from "../../graphql/query/query"; 

// import dayjs from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

window.onbeforeunload = confirmExit;
function confirmExit() {
    return "You have attempted to leave this page. Are you sure?";
}

const center = {
  position: "relative",
  top: "50%",
  marginBottom: "5%",
};
const boxstyle = {
  position: "absolute",
  top: "50%",
  transform: "translate(3%, -45%)",
  width: "100%",
  height: "70%",
};


export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [searchText,setSearchText]=useState("");
  const [responseDetails, setResponseDetails] = useState([]);
  //const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnit, setSubBusinessUnit] = useState("");
  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery(GET_ALL_BUSINESS_UNIT);
  const [fetchSubBusinessUnits, { data: subBusinessUnitData, loading: subBusinessUnitLoading }] = useLazyQuery(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);
  const [fetchMetrics, { data: metricsData ,error: metricsDataError}] = useLazyQuery(GET_ALL_METRICS,{
    errorPolicy: "all", 
  });
 
  const handleBusinessUnitChange = (e) => {
    const selectedBusinessUnit = e.target.value;
    setBusinessUnit(selectedBusinessUnit);
    setMetrics([]);
    console.log("Before Update label",businessUnit);
    
    fetchSubBusinessUnits({
      variables: {
        id: selectedBusinessUnit,
      },
    });
  };

  const handleSubBusinessUnitChange = (e) => {
    const selectedSubBusinessUnit = e.target.value;
    setSubBusinessUnit(selectedSubBusinessUnit);
    // Fetch metrics when a sub-business unit is selected
    //fetchMetrics({ variables: { businessUnit, subBusinessUnit: selectedSubBusinessUnit } });
    console.log(dateRange[0].toISOString());
      console.log(dateRange[1].toISOString());

    if (dateRange[0] && dateRange[1]) {
      
      fetchMetrics({
        variables: {
          businessUnit,
          subBusinessUnit: selectedSubBusinessUnit,
          fromDate: dateRange[0].toISOString(),
          toDate: dateRange[1].toISOString(),   
        },
      });
    }
  };

  const handleSearch = (searchParam) => {
    if (businessUnit && subBusinessUnit && dateRange[0] && dateRange[1]) {
      const variables = {
        businessUnit,
        subBusinessUnit,
        fromDate: dateRange[0]?.toISOString(),
        toDate: dateRange[1]?.toISOString(),
      };
  
      if (searchText) {
        variables.searchParam = searchText;
      }
  
      console.log('Fetching metrics with:', variables);
  
      fetchMetrics({
        variables,
      });
    } else {
      console.log("Please select business unit, sub-business unit, and date range.");
    }
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    console.log('Selected Date Range:', newDateRange);
  
    if (businessUnit && subBusinessUnit && (newDateRange[0] || newDateRange[1])) {
      const variables = {
        businessUnit,
        subBusinessUnit,
        fromDate: newDateRange[0]?.toISOString(),
        toDate: newDateRange[1]?.toISOString(),
      };
  
      if (searchText) {
        variables.searchParam = searchText;
      }
  
      console.log('Fetching metrics with:', variables);
  
      fetchMetrics({
        variables,
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.trim() === "") {
        handleSearch(null);
      } else {
        handleSearch(searchText);
      }
    }, 500); // Debounce Wala Delay

    return () => {
      clearTimeout(handler); // Clear timeout on new input
    };
  }, [searchText]);

  useEffect(() => {
    console.log(metricsData);
    if (metricsData) {
      setMetrics(metricsData.getAllMetrices);
    }
  }, [metricsData]);
  
  
  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error loading Business Units: {businessUnitsError.message}</p>;
  console.log("Metrics Error :",metricsDataError);

  
   return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ display: "flex", alignItems: "stretch" }}>
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

            <Grid item xs={3} sx={{ display: "flex", alignItems: "stretch" }}>
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


            <Grid item xs={3} sx={{ display: "flex",marginLeft:"10%"   }}>
            <DateRangePickerComponent onDateChange={handleDateChange} />
          </Grid>

            <Grid item xs={12} sx={{ mt:"20px" }}>
            <TextField
                //fullWidth
                label="Search API"
                //value={subBusinessUnit}
                onChange={(e) => setSearchText(e.target.value)}
                variant="outlined"
                sx={{ width: "24%"}}
              >
                
              </TextField>
            </Grid>
            {/* <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch",mt:"20px" }}>
            <Button variant="outlined" onClick={handleSearch}>Search</Button>
            </Grid> */}
            {/* <Grid item xs={12}>
            <Typography variant="h6">APIs</Typography>
            {metrics.length === 0 ? (
              <p>No APIs found.</p>
            ) : (
              <ul>
                {metrics.map((api) => (
                  <li key={api.id}>{api.apiName} - {api.apiUrl}</li> // Display the desired fields
                ))}
              </ul>
            )}
          </Grid> */}
          <Grid item xs={12}>
          {businessUnit && subBusinessUnit ? (
              <ApiDataGrid metrics={metrics} error={metricsDataError ? metricsDataError.message : null} />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <img src={APImonitoringLogo} alt="Default Placeholder" style={{ width: "50%", opacity: 0.7, marginTop: "200px" }} />
              </Box>
            )}
          {/* <ApiDataGrid metrics={metrics} />  */}
        </Grid>
          {/* <Grid item xs={12}>
          <ApiListWithPagination metrics={metrics} /> 
        </Grid> */}
              
          </Grid>
        
      </Box>
    </>
  );
}
