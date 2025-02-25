import { TextField, MenuItem , Grid2} from '@mui/material';
import { FormState } from './MonitorService';

type Tab4Types = {
  state: FormState["tab4"];
  setState: (newState: FormState["tab4"]) => void;
};
const Tab4 : React.FC <Tab4Types> = ({ state, setState }) => {
  return (
    <div>
    <Grid2 container direction={'column'} rowSpacing={5} sx={{marginBottom: '3rem'}}>
     <TextField
        fullWidth
        select
        label="Monitoring frequency (in min)"
        value={state.apiCallInterval}
        onChange={(e) => setState({ ...state, apiCallInterval: Number(e.target.value) })}
        variant="outlined"
        required
        SelectProps={{
            MenuProps: {
            style: { maxHeight: 280 } 
            }
        }}
        >
        {[...Array(12)]?.map((_, i) => (
            <MenuItem key={i} value={(i + 1) * 5}>
            {(i + 1) * 5}
            </MenuItem>
        ))}
        </TextField>
        <TextField
            fullWidth
            required
            label="Email for alerts"
            value={state.recipientDl}
            onChange={(e) => setState({ ...state, recipientDl: e.target.value })}
            variant="outlined"
            type="email"
            multiline
            maxRows={2}
        />
        <TextField
            fullWidth
            label="Teams Channel URL for alerts"
            value={state.teamsChannelWebhookURL}
            onChange={(e) => setState({ ...state, teamsChannelWebhookURL: e.target.value })}
            variant="outlined"
            
        />
        <Grid2 container>
        Retry on error a maximum of &nbsp;&nbsp;
        <TextField
            id="filled-number"
            value={state.maxRetries}
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setState({ ...state, maxRetries: Number(e.target.value) })}
            onBlur={() => {
                if (state.maxRetries > 10) setState({ ...state, maxRetries: 10 });
                if (state.maxRetries < 3) setState({ ...state, maxRetries: 3 });
            }}
            sx={{width:'60px','& .MuiInputBase-root': {
                height: '25px', 
            },
            '& .MuiInputBase-input': {
                padding: '5px', 
            },}}
            inputProps={{
                min: 3, 
                max: 10, 
            }}
        /> &nbsp; times, with an interval of &nbsp;&nbsp;
        <TextField
            id="filled-number"
            value={state.retryAfter}
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setState({ ...state, retryAfter: Number(e.target.value) })}
            onBlur={() => {
                if (state.retryAfter > 600) setState({ ...state, retryAfter: 600 });
                if (state.retryAfter < 60) setState({ ...state, retryAfter: 60 });
            }}
            sx={{width:'70px','& .MuiInputBase-root': {
                height: '25px', 
            },
            '& .MuiInputBase-input': {
                padding: '5px', 
            },}}
            inputProps={{
                min: 60, 
                max: 600, 
            }} 
        /> &nbsp; seconds.
        </Grid2>
      </Grid2>
      {/* Add the rest of Tab3 fields */}
    </div>
  );
};

export default Tab4
