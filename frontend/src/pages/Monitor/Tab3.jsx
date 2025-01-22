import { TextField, MenuItem , Grid2, Menu } from '@mui/material';
import resTimes from '../../constants/constants';
const Tab3 = ({ state, setState }) => {


    return (
      <div>
        <Grid2 container direction={'column'} rowSpacing={3} sx={{marginBottom: '3rem'}}>    
          <h3>Response time limits</h3>
          <Grid2 item>
          Responses will be marked as <span style={{color:'#fca103'}}>degraded</span> after&nbsp;&nbsp;
            <TextField select size="small" sx={{width:'8%','& .MuiInputBase-root': {height: '25px'} }}
                value={state.degradedResponseTime}
                onChange={(e) => setState({ ...state, degradedResponseTime: e.target.value })}
                SelectProps={{
                    MenuProps: {
                    style: { maxHeight: 350 } 
                    }
                }}
            >
                {
                    resTimes.map(vv => 
                            <MenuItem key={vv.key} value={vv.value}>
                                {vv.key}
                            </MenuItem>
                    )
                }
            </TextField>
        &nbsp;&nbsp;and will be marked as <span style={{color:'red'}}>failed</span> after &nbsp;&nbsp;

        <TextField select size="small" sx={{width:'8%','& .MuiInputBase-root': {height: '25px'} }}
                value={state.failedResponseTime}
                onChange={(e) => setState({ ...state, failedResponseTime: e.target.value })}
                SelectProps={{
                    MenuProps: {
                    style: { maxHeight: 350 } 
                    }
                }}
        >
            {
                    resTimes.map(vv => 
                            <MenuItem key={vv.key} value={vv.value}>
                                {vv.key}
                            </MenuItem>
                    )
                }
        </TextField>
        </Grid2>
        </Grid2>

        {/* Add the rest of Tab3 fields */}
      </div>
    );
  };

  export default Tab3;