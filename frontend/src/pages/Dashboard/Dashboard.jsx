import { MuiNavbar } from "../../common/components/Navbar/navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// import dayjs from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

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

export default function Dashboard() {
  const handleSubmit = () => {};
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
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker label="Basic date picker" />
                </DemoContainer>
              </LocalizationProvider> */}

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
              <Tooltip title="Search" cursor="pointer">
                <ArrowForwardIcon
                  style={{
                    //marginTop: "18px",
                    cursor: "pointer",
                    color: "#000000",
                  }}
                  fontSize="large"
                />
              </Tooltip>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}
