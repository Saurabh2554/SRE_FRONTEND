import {
  TextField,
  MenuItem,
  Grid2,
} from "@mui/material";
import {resTimes} from '../../constants/constants';
import { FormState } from './MonitorService';
import Assertions from "./Assertions";

type Tab3Types = {
  state: FormState["tab3"];
  setState: (newState: FormState["tab3"]) => void;
};
const Limits : React.FC <Tab3Types> = ({ state, setState }) => {
    return (
      <div>
        <Grid2
          container
          direction={"column"}
          rowSpacing={3}
          sx={{ marginBottom: "5rem" }}
        >
          <h4 style={{ marginBottom: 0 }}>Response time limits</h4>
          <Grid2 container>
            Responses will be marked as{" "}
            <span style={{ color: "#fca103" }}>&nbsp;degraded&nbsp;</span> after
            &nbsp;&nbsp;
            <TextField
              select
              size="small"
              sx={{ width: "8%", "& .MuiInputBase-root": { height: "25px" } }}
              value={state.degradedResponseTime}
              onChange={(e) =>
                setState({
                  ...state,
                  degradedResponseTime: Number(e.target.value),
                })
              }
              SelectProps={{
                MenuProps: {
                  style: { maxHeight: 350 },
                },
              }}
            >
              {resTimes.map((vv) => (
                <MenuItem key={vv.key} value={vv.value}>
                  {vv.key}
                </MenuItem>
              ))}
            </TextField>
            &nbsp;&nbsp;and will be marked as{" "}
            <span style={{ color: "red" }}>&nbsp;failed&nbsp;</span> after
            &nbsp;&nbsp;
            <TextField
              select
              size="small"
              sx={{ width: "8%", "& .MuiInputBase-root": { height: "25px" } }}
              value={state.failedResponseTime}
              onChange={(e) =>
                setState({
                  ...state,
                  failedResponseTime: Number(e.target.value),
                })
              }
              SelectProps={{
                MenuProps: {
                  style: { maxHeight: 350 },
                },
              }}
            >
              {resTimes.map((vv) => (
                <MenuItem key={vv.key} value={vv.value}>
                  {vv.key}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Assertions state={state} setState={setState} />
        </Grid2>

        {/* Add the rest of Tab3 fields */}
      </div>
    );
  };

  export default Limits;