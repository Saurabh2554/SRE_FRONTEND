import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AlertColor } from '@mui/material';

type ReusableSnackbarProps = {
    open?:boolean | undefined;
    message?:string | undefined | null;
    severity?: undefined | string;
    handleClose?:(event: Event |  React.SyntheticEvent<any, Event> , reason: string) => void;
}
 


export const ReusableSnackbar:React.FC<ReusableSnackbarProps> = ({open, handleClose, message, severity}) => {
    
    return(
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key="top-right" >
                <Alert onClose={handleClose as (event: React.SyntheticEvent<Element, Event>) => void  } severity={severity as AlertColor} sx={{ width: '100%' }} >
                    {message}
                </Alert>
            </Snackbar>
        </>
    );
};