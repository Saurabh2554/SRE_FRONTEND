import { MuiNavbar } from "../../common/components/Navbar/navbar";
import Box from "@mui/material/Box";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useMutation } from "@apollo/client";
import { CREATE_BUSINESS_UNIT } from "../../graphql/mutation/mutation";

const center = {
  position: "relative",
  top: "50%",
  left: "8%",
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

export default function NewBusinessUnit() {
  const [businessUnitName, setbusinessUnitName] = useState("");
  const [businessUnitDescription, setbusinessUnitDescription] = useState("");
  const [businessUnitDl, setbusinessUnitDl] = useState("");

  const [createBusinessUnit,{ data, loading, error }] = useMutation(CREATE_BUSINESS_UNIT);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSubmit =  (e) => {
    e.preventDefault();
    try {
      const data2  = createBusinessUnit({
        variables: {
          businessUnitName,
          businessUnitDescription,
          businessUnitDl,
          createdBy:"rjnsaurabh143@gmail.com"
        }
       
      });
      console.log("Business unit created:", data);
      setbusinessUnitName("");
      setbusinessUnitDescription("");
      setbusinessUnitDl("");
    } catch (error) {
      console.error("Error creating business unit:", error.message);
    }
  };
  return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
        <Container>
          <Box height={35} />
          <Box sx={center}>
            <Typography component="h1" variant="h4" fontFamily={"Lato"}>
              Create New Business Unit
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="business_unit_name"
                  label="Business Unit Name"
                  name="Business Unit Name"
                  type="text"
                  value={businessUnitName}
                  onChange={(e) => setbusinessUnitName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="business_desc"
                  label="Business Description"
                  name="Business Description"
                  type="text"
                  value={businessUnitDescription}
                  onChange={(e) => setbusinessUnitDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="business_unit_dl"
                  label="Business Unit DL"
                  name="Business Unit DL"
                  type="text"
                  value={businessUnitDl}
                  onChange={(e) => setbusinessUnitDl(e.target.value)}
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
