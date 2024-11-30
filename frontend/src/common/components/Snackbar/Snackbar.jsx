import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


export const ReusableSnackbar = ({open, handleClose, message, severity}) => {
    return(
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key="top-right" size="lg">
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};