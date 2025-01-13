import { TextField, MenuItem  } from '@mui/material';


const Tab4 = ({ state, setState }) => {
  return (
    <div>
     <TextField
        fullWidth
        select
        label="Monitoring frequency (in min)"
        value={state.frequencyTime}
        onChange={(e) => setState({ ...state, frequencyTime: e.target.value })}
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
            value={state.recipientDL}
            onChange={(e) => setState({ ...state, recipientDL: e.target.value })}
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
        <TextField
            id="filled-number"
            value={state.maxretry}
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setState({ ...state, maxretry: e.target.value })}
            onBlur={() => {
                if (state.maxretry > 10) setState({ ...state, maxretry: 10 });
                if (state.maxretry < 3) setState({ ...state, maxretry: 3 });
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
        />
        <TextField
            id="filled-number"
            value={state.retryafter}
            type="number"
            variant="outlined"
            size="small"
            onChange={(e) => setState({ ...state, retryafter: e.target.value })}
            onBlur={() => {
                if (state.retryafter > 600) setState({ ...state, retryafter: 600 });
                if (state.retryafter < 60) setState({ ...state, retryafter: 60 });
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
        />
      
      {/* Add the rest of Tab3 fields */}
    </div>
  );
};

export default Tab4
