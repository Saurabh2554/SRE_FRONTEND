import { MuiNavbar } from "../../common/components/Navbar/navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";

const center = {
  position: "relative",
  top: "50%",
  left: "16%",
  marginBottom: "5%",
};
const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "70%",
};

// const GET_DATA = gql`
//   query {
//     getData {
//       // your query fields here
//     }
//   }
// `;

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

export default function NewService() {
  const handleSubmit = () => {};
  // const { loading, error, data } = useQuery(GET_DATA);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
        <Container>
          <Box height={35} />
          <Box sx={center}>
            <Typography component="h1" variant="h4" fontFamily={"Lato"}>
              Monitor New Service
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  id="business_unit_"
                  label="Business Unit"
                  name="Business Unit"
                  type="text"
                  defaultValue="Experience"
                >
                  {demoBusinessUnit.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  id="sub_business_unit_"
                  label="Sub Business Unit"
                  name="Sub Business Unit"
                  type="text"
                  defaultValue="Experience"
                >
                  {demoBusinessUnit.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="service_name"
                  label="Service Name"
                  name="Service Name"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="url"
                  label="URL"
                  name="URL"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  id="header"
                  label="Header"
                  name="Header"
                  type="text"
                  defaultValue="Experience"
                >
                  {demoBusinessUnit.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="payload"
                  label="Payload"
                  name="Payload"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="response_time"
                  label="Response Time (in ms)"
                  name="Response Time (in ms)"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="frequency_time"
                  label="Frequency Time "
                  name="Frequency Time "
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="recipient_dl"
                  label="Recipient DL "
                  name="Recipient DL "
                  type="text"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  sx={{
                    borderRadius: 28,
                    color: "#ffffff",
                    backgroundColor: "#3B3B3D",
                    fontFamily: "Lato",
                  }}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </>
  );
}
