import { MuiNavbar } from "../../common/components/Navbar/navbar";
import Box from "@mui/material/Box";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";

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

const GET_DATA = gql`
  query {
    allBusinessUnit {
      businessUnitDl
      businessUnitName
      businessUnitDescription
    }
  }
`;
const CREATE_BUSINESS_UNIT = gql`
  mutation CreateBusinessUnit(
    $businessUnitName: String!
    $businessUnitDesc: String!
    $businessUnitDL: String!
    $createdBy: String!
  ) {
    createBusinessUnit(
      businessUnitName: $businessUnitName
      businessUnitDesc: $businessUnitDesc
      businessUnitDL: $businessUnitDL
      createdBy: $createdBy
    )
    businessUnitName
    businessUnitDesc
    businessUnitDL
    createdBy
  }
`;

export default function NewBusinessUnit() {
  const [businessUnitName, setbusinessUnitName] = useState("");
  const [businessUnitDesc, setbusinessUnitDesc] = useState("");
  const [businessUnitDL, setbusinessUnitDL] = useState("");
  const createdBy = "owner";

  const { loading, error, data } = useQuery(GET_DATA);
  //console.log(data, error, loading);

  const [createBusinessUnit] = useMutation(CREATE_BUSINESS_UNIT, {
    refetchQueries: [{ query: GET_DATA }],
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      "Submitting with variables:",
      businessUnitName,
      businessUnitDesc,
      businessUnitDL
    );

    try {
      const { data } = await createBusinessUnit({
        variables: {
          businessUnitName,
          businessUnitDesc,
          businessUnitDL,
          createdBy,
        },
        //refetchQueries: [{ query: GET_DATA }],
      });
      console.log("Business unit created:", data.createBusinessUnit);
      setbusinessUnitName("");
      setbusinessUnitDesc("");
      setbusinessUnitDL("");
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
                  value={businessUnitDesc}
                  onChange={(e) => setbusinessUnitDesc(e.target.value)}
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
                  value={businessUnitDL}
                  onChange={(e) => setbusinessUnitDL(e.target.value)}
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
