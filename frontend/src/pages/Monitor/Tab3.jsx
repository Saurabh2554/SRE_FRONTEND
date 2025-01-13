import { TextField, MenuItem  } from '@mui/material';

const Tab3 = ({ state, setState }) => {
    return (
      <div>
        <TextField
            fullWidth
            label="Expected Response Time (in ms)"
            value={state.responseTime}
            onChange={(e) => setState({ ...state, responseTime: e.target.value })}
            variant="outlined"
            required
        />
        {/* Add the rest of Tab3 fields */}
      </div>
    );
  };

  export default Tab3;