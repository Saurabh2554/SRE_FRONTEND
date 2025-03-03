import { MuiNavbar } from "../../common/components/Navbar/navbar";
import {ApiDataGrid} from "../../common/components/DataGrid/ApiDataGrid";
import APImonitoringLogo from "../../common/Resources/APImonitoringLogo.png";
import {DateRangePickerComponent} from "../../common/components/DateRangePicker/DateRangePickerComponent";
import { useState,useEffect } from "react";
import "chart.js/auto"; // Import the necessary Chart.js components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { BusinessUnitType, SubBusinessUnitType,ApiMetricesType,QueryGetAllMetricesArgs, GetSubBusinessUnitPerBusinessUnitQueryVariables} from "../../graphql/types";
import {useQuery,useLazyQuery } from "@apollo/client";
import { GET_ALL_BUSINESS_UNIT ,GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,GET_ALL_METRICS } from "../../graphql/query/query"; 

window.onbeforeunload = confirmExit;
function confirmExit() {
    return "You have attempted to leave this page. Are you sure?";
}

const boxstyle = {
  position: "absolute",
  top: "50%",
  transform: "translate(3%, -45%)",
  width: "100%",
  height: "70%",
};


export default function Dashboard() {
  const [searchText,setSearchText]=useState("");
  const [metrics, setMetrics] = useState<ApiMetricesType[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnit, setSubBusinessUnit] = useState("");
  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery<{businessUnit:BusinessUnitType[]}>(GET_ALL_BUSINESS_UNIT);
  
  const [fetchSubBusinessUnits, { data: subBusinessUnitData, loading: subBusinessUnitLoading }] = useLazyQuery<{subBusinessUnitPerBusinessUnit:SubBusinessUnitType[]},GetSubBusinessUnitPerBusinessUnitQueryVariables>(GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT,{
   
  });

  const [fetchMetrics, { data: metricsData ,error: metricsDataError}] = useLazyQuery<{getAllMetrices: ApiMetricesType[]},QueryGetAllMetricesArgs>(GET_ALL_METRICS,{
    errorPolicy: "all", 
  });
 
  const handleBusinessUnitChange = (e:any) => {
    const selectedBusinessUnit = e.target.value;
    setBusinessUnit(selectedBusinessUnit);
    setMetrics([]);
    
    fetchSubBusinessUnits({
      variables: {
        id: selectedBusinessUnit,
      },
    });
  };

  const handleSubBusinessUnitChange = (e: any) => {
    const selectedSubBusinessUnit = e.target.value;
    setSubBusinessUnit(selectedSubBusinessUnit);

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

  const handleSearch = () => {
    if (businessUnit && subBusinessUnit && dateRange[0] && dateRange[1]) {
      const variables: QueryGetAllMetricesArgs = {
        businessUnit,
        subBusinessUnit,
        fromDate: dateRange[0]?.toISOString(),
        toDate: dateRange[1]?.toISOString(),
      };
  
      if (searchText) {
        variables.searchParam = searchText;
      }
  
      fetchMetrics({
        variables,
      });
    } else {
      console.log("Please select business unit, sub-business unit, and date range.");
    }
  };

  const handleDateChange = (newDateRange: [Date , Date]) => {
    setDateRange(newDateRange);
  
    if (businessUnit && subBusinessUnit && (newDateRange[0] || newDateRange[1])) {
      const variables:QueryGetAllMetricesArgs = {
        businessUnit,
        subBusinessUnit,
        fromDate: newDateRange[0]?.toISOString(),
        toDate: newDateRange[1]?.toISOString(),
      };
  
      if (searchText) {
        variables.searchParam = searchText;
      }
  
  
      fetchMetrics({
        variables,
      });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchText.trim() === "") {
        handleSearch();
      } else {
        handleSearch();
      }
    }, 500); // Debounce-Delay
    console.log("search-working")
    return () => {
      clearTimeout(handler); // Clear timeout on new input
    };
  }, [searchText]);

  useEffect(() => {
    if (metricsData) {
      setMetrics(metricsData?.getAllMetrices);
      console.log(metricsData, " yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy ")
    }
  }, [metricsData]);
  
  
  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error loading Business Units: {businessUnitsError.message}</p>;


  
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
                {businessUnitsData?.businessUnit?.map((unit) => (
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
                {subBusinessUnitData && subBusinessUnitData?.subBusinessUnitPerBusinessUnit?.map((subUnit:any) => (
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
                label="Search API"
                onChange={(e) => setSearchText(e.target.value)}
                variant="outlined"
                sx={{ width: "24%"}}
              >
                
              </TextField>
            </Grid>
            
          <Grid item xs={12}>
          {businessUnit && subBusinessUnit ? (
              <ApiDataGrid metrics={metrics} error={metricsDataError ? metricsDataError?.message: null} />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <img src={APImonitoringLogo} alt="Default Placeholder" style={{ width: "50%", opacity: 0.7, marginTop: "200px" }} />
              </Box>
            )}
        </Grid>
              
          </Grid>
        
      </Box>
    </>
  );
}
