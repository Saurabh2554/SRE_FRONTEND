import { MuiNavbar } from "../../common/components/Navbar/navbar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_SUB_BUSINESS_UNIT } from "../../graphql/mutation/mutation";
import { GET_ALL_BUSINESS_UNIT } from "../../graphql/query/query";  // Import the query
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { BusinessUnitType,SubBusinessUnitCreateMutation,CreateSubbusinessUnitMutationVariables } from "../../graphql/types";


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

export default function NewSubBusinessUnit() {
  const [businessUnit, setBusinessUnit] = useState("");
  const [subBusinessUnitName, setSubBusinessUnitName] = useState("");
  const [subBusinessUnitDl, setSubBusinessUnitDl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [subBusinessUnitDescription, setSubBusinessUnitDescription] = useState("");


  const { data: businessUnitsData, loading: businessUnitsLoading, error: businessUnitsError } = useQuery<{businessUnit:BusinessUnitType[]}>(GET_ALL_BUSINESS_UNIT);
  const [createSubBusinessUnit, { loading, error }] = useMutation<{createSubbusinessUnit:SubBusinessUnitCreateMutation},CreateSubbusinessUnitMutationVariables>(CREATE_SUB_BUSINESS_UNIT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error?.message}</p>;

  if (businessUnitsLoading) return <p>Loading Business Units...</p>;
  if (businessUnitsError) return <p>Error: {businessUnitsError.message}</p>;

  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await createSubBusinessUnit({
        variables: {
          businessUnit,
          subBusinessUnitName,
          subBusinessUnitDescription,
          subBusinessUnitDl,
        },
      });

      setOpenSnackbar(true);
      setBusinessUnit("");
      setSubBusinessUnitName("");
      setSubBusinessUnitDescription("");

      setSubBusinessUnitDl("");
    } catch (error) {
      console.error("Error creating sub-business unit:"
      );
    }
  };

  const handleCloseSnackbar = (event:Event | React.SyntheticEvent<Element, Event>, reason:string) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

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
                  id="business_unit"
                  label="Business Unit"
                  name="Business Unit"
                  value={businessUnit}
                  onChange={(e) => setBusinessUnit(e.target.value)}
                >
                  {businessUnitsData?.businessUnit?.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.businessUnitName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="sub_business_unit_name"
                  label="Sub-Business Unit Name"
                  name="Sub-Business Unit Name"
                  type="text"
                  value={subBusinessUnitName}
                  onChange={(e) => setSubBusinessUnitName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="sub_business_unit_description"
                    label="Sub-Business Unit Description"
                    name="Sub-Business Unit Description"
                    type="text"
                    value={subBusinessUnitDescription}
                    onChange={(e) => setSubBusinessUnitDescription(e.target.value)}
                  />
                </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="sub_business_unit_dl"
                  label="Sub-Business Unit DL"
                  name="Sub-Business Unit DL"
                  type="text"
                  value={subBusinessUnitDl}
                  onChange={(e) => setSubBusinessUnitDl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled
                  fullWidth
                  id="created_by"
                  label="Owner"
                  name="Created By"
                  type="text"
                  value="System Integeration" // Replace with current user
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

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
      <Alert
          // onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Sub-business unit successfully created!
        </Alert>
      </Snackbar>
    </>
  );
}
