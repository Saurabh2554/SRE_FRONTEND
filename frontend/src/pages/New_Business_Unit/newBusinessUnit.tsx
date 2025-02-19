import Box from '@mui/material/Box';
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from '@apollo/client';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CREATE_BUSINESS_UNIT } from '../../graphql/mutation/mutation.tsx';
import { MuiNavbar } from '../../common/components/Navbar/navbar.tsx';
import {
  BusinessUnitCreateMutation,
  CreateBusinessUnitMutationVariables,
} from '../../graphql/types.tsx';

const center = {
  position: 'relative',
  top: '50%',
  left: '8%',
  marginBottom: '5%',
};
const boxstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '70%',
};

export default function NewBusinessUnit() {
  const [businessUnitName, setbusinessUnitName] = useState('');
  const [businessUnitDescription, setbusinessUnitDescription] = useState('');
  const [businessUnitDl, setbusinessUnitDl] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [createBusinessUnit, { loading, error }] = useMutation<
    BusinessUnitCreateMutation,
    CreateBusinessUnitMutationVariables
  >(CREATE_BUSINESS_UNIT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  const STATIC_CREATED_BY = 'static_email@example.com';

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const { data } = await createBusinessUnit({
        variables: {
          businessUnitName,
          businessUnitDescription,
          businessUnitDl,
        },
      });
      console.log('Business unit created:', data);
      setOpenSnackbar(true);

      setbusinessUnitName('');
      setbusinessUnitDescription('');
      setbusinessUnitDl('');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating business unit:', error.message);
      } else {
        console.error('Error creating sub-business unit');
      }
    }
  };

  const handleCloseSnackbar = (
    event: Event | React.SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <MuiNavbar />
      <Box sx={boxstyle}>
        <Container>
          <Box height={35} />
          <Box sx={center}>
            <Typography component="h1" variant="h4" fontFamily="Lato">
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
                  label="System Integeration" // Here current user will appear
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
                    color: '#ffffff',
                    backgroundColor: '#3B3B3D',
                    fontFamily: 'Lato',
                  }}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          //onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Business unit successfully created!
        </Alert>
      </Snackbar>
    </>
  );
}
