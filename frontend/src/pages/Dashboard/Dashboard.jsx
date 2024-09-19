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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useQuery, gql } from '@apollo/client';
import { red } from "@mui/material/colors";
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

const demoBusinessUnit = [
  {
    value: "Experience",
    label: "Experience",
  },
  {
    value: "Option 2",
    label: "Option 2",
  },
  {
    value: "Option 3",
    label: "Option 3",
  },
];

const GET_MODELS = gql`
  query myQuery {allBusinessUnit {
    id
    businessUnitDescription
    businessUnitDl
    businessUnitName
    createdBy
}}
`;

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [responseDetails, setResponseDetails] = useState([]);
  const [error, setError] = useState(null);
  const { loading, data } = useQuery(GET_MODELS);
  console.log("this is graphQL",data);
  useEffect(() => {
    if (url) {
      const interval = setInterval(() => {
        fetchApiData();
      }, 60000); // Run every 1 minute

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [url]);

  const fetchApiData = async () => {
    const startTime = performance.now(); // Start time measurement

    try {
      const res = await fetch(url);

      const endTime = performance.now(); // End time measurement
      const responseTime = (endTime - startTime).toFixed(2); // Calculate response time in milliseconds

      setResponseDetails((prevDetails) => [
        ...prevDetails,
        {
          timestamp: new Date().toLocaleTimeString(),
          responseTime: responseTime,
          statusCode: res.status,
        },
      ]);

      setError(null);
    } catch (err) {
      const endTime = performance.now(); // End time measurement in case of an error
      const responseTime = (endTime - startTime).toFixed(2);

      setResponseDetails((prevDetails) => [
        ...prevDetails,
        {
          timestamp: new Date().toLocaleTimeString(),
          responseTime: responseTime,
          statusCode: "Error",
        },
      ]);

      setError({
        message: "Failed to fetch data from the URL",
        responseTime: responseTime,
        details: err.toString(),
      });
    }
  };

  

  // const getdetails=(e)=>{
  //   const { loading, error, data } = useQuery(GET_MODELS);
  //   console.log(data);
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchApiData();
  };

  
   return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2}>
            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
              <Typography
                component="h1"
                variant="h5"
                fontFamily={"Lato"}
                marginRight={2}
              >
                Business Unit
              </Typography>
              <TextField
                select
                required
                id="business_unit_"
                name="Business Unit"
                type="text"
                defaultValue="Experience"
                size="small"
              >
                {demoBusinessUnit.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
              <Typography
                component="h1"
                variant="h5"
                fontFamily={"Lato"}
                marginRight={2}
              >
                Product
              </Typography>
              <TextField
                select
                required
                id="business_unit_"
                name="Business Unit"
                type="text"
                defaultValue="Experience"
                size="small"
              >
                {demoBusinessUnit.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={4} sx={{ display: "flex", alignItems: "stretch" }}>
              <Typography
                component="h1"
                variant="h5"
                fontFamily={"Lato"}
                marginRight={2}
              >
                Service Name
              </Typography>
              <TextField
                select
                required
                id="business_unit_"
                name="Business Unit"
                type="text"
                defaultValue="Experience"
                size="small"
              >
                {demoBusinessUnit.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
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
            
            

            
          </Grid>
        </form>
        
        
      </Box>
    </>
  );
}
