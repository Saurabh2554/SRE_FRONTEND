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
  left: "3%",
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

const GET_DATA = gql`
  query {
    allBusinessUnit {
      businessUnitName
      id
    }
  }
  
`;

export default function NewSubBusinessUnit() {
  const { loading, error, data } = useQuery(GET_DATA);
  console.log(data);
  const businessUnits = data?.allBusinessUnit;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const handleSubmit = () => {};
  return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
        <Container>
          <Box height={35} />
          <Box sx={center}>
            <Typography component="h1" variant="h4" fontFamily={"Lato"}>
              Create New Sub-Business Unit
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
                >
                  {businessUnits.map((unit) => (
                    <MenuItem key={unit.id} value={unit.businessUnitName}>
                      {unit.businessUnitName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="Name"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="sub_business_unit_dl"
                  label="Sub Business Unit DL"
                  name="Sub Business Unit DL"
                  type="text"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  id="created_by"
                  label="Owner" //Here current user will appear
                  name="Created By"
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
