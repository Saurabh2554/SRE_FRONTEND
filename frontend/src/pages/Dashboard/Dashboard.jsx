import { MuiNavbar } from "../../common/components/Navbar/navbar";
import React, { useState,useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import the necessary Chart.js components
import ChartComponent from "./ChartComponent";


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
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT } from "../../graphql/query/query"; 

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
  left: "3%",
  marginBottom: "5%",
};
const boxstyle = {
  position: "absolute",
  top: "50%",
  transform: "translate(5%, -50%)",
  width: "100%",
  height: "70%",
};


export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [searchText,setSearchText]=useState("");
  const [responseDetails, setResponseDetails] = useState([]);
  const [error, setError] = useState(null);
  
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnit, setSubBusinessUnit] = useState("");
  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery(GET_ALL_BUSINESS_UNIT);
  const [fetchSubBusinessUnits, { data: subBusinessUnitData, loading: subBusinessUnitLoading }] = useLazyQuery(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT);
  
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

  const handleSearch =(e)=>{
    setSearchText(e.target.value);
  }

  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error loading Business Units: {businessUnitsError.message}</p>;
  

  

  

 

  
   return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
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

            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
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


            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
              <Typography
                component="h1"
                variant="h5"
                fontFamily={"Lato"}
                marginRight={5.5}
              >
                Select date 
              </Typography>
              <Typography
                component="h5"
                variant="subtitle2"
                marginRight={5.5}
                marginTop={1}
                fontFamily={"Lato"}
                color={'secondary'}
              >
                DD/MM/YYYY
              </Typography>
              

             
            </Grid>

            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch",mt:"20px" }}>
            <TextField
                fullWidth
                label="Search API"
                //value={subBusinessUnit}
                onChange={handleSearch}
                variant="outlined"
                
              >
                
              </TextField>
            </Grid>
            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch",mt:"20px" }}>
            <Button variant="outlined">Search</Button>
            </Grid>
            
            
            

            
          </Grid>
        
        
        
      </Box>
    </>
  );
}
