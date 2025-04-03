import {
  TextField,
  MenuItem,
  Grid2,
  AppBar,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { FormState } from "./MonitorService";
import { GET_ASSERTION_SOURCE_OPERATORS } from "../../graphql/query/query";
import { useQuery } from "@apollo/client";
import { SourceTypeOperatorChoice } from "../../graphql/types";

type Tab33Types = {
  state: FormState["tab3"];
  setState: (newState: FormState["tab3"]) => void;
};

const Tab33 : React.FC<Tab33Types> = ({ state, setState }) => {

    const { data, loading, error } = useQuery<{
      assertionSourceOperatorChoices: SourceTypeOperatorChoice[];
    }>(GET_ASSERTION_SOURCE_OPERATORS, {
      onCompleted: (data) => {
        const val = data?.assertionSourceOperatorChoices?.[0];
        setState({
          ...state,
          assertionLimit: state.assertionLimit?.map((item, index) =>
            index === 0 && item.source == ""
              ? {
                  ...item,
                  source: val?.source ?? "",
                  operator: val?.operators?.[0]?.operator ?? "",
                }
              : item
          ),
        });
      },
    });

    const handleSourceChange = async ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const source = e.target.value;
      const newFields = [...state.assertionLimit];
      newFields[index].source = source;

      if (source) {
        const op =
          data?.assertionSourceOperatorChoices?.find(
            (vv) => vv.source == source
          )?.operators?.[0]?.operator ?? "";
        newFields[index].operator = op;
      }

      setState({ ...state, assertionLimit: newFields });
    };

    const showRegex = (
      e: React.MouseEvent<HTMLAnchorElement> | undefined,
      index: number
    ) => {
      const fields = document.querySelectorAll(`.property-field-${index}`);
      const field2 = document.querySelector(`#showregex-${index}`);

      fields.forEach((field) => {
        if (field instanceof HTMLElement) {
          const currentDisplay = window.getComputedStyle(field).display;
          field.style.display = currentDisplay === "none" ? "block" : "none";
        }
      });

      if (field2 instanceof HTMLElement) {
        field2.style.display =
          field2.style.display === "none" ? "block" : "none";
      }
    };

    return (
      <>
        <div>
          <h4 style={{ margin: "0" }}>Assertions</h4>
          <p style={{ color: "#575757" }}>
            Use assertions to validate the status code, body, headers and
            response time of your API request. When one (or more) assertions
            fails, an alert is triggered.
          </p>
        </div>
        <Grid2 container>
            <AppBar
                position="static"
                sx={{ marginTop: "20px", marginBottom: 0, width: "85%" }}
                elevation={0}
            >
                <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    gap: 2,
                    p: 0.5,
                    backgroundColor: "#eaeaea",
                    fontWeight: "bold",
                    borderBottom: "2px solid #ccc",
                    color: "black",
                }}
                >
                <Typography>SOURCE</Typography>
                <Typography>PROPERTY</Typography>
                <Typography>COMPARISON</Typography>
                <Typography>TARGET</Typography>
                </Box>
            </AppBar>
          {state.assertionLimit.map((field, index) => (
            <Grid container item spacing={2} key={index} style={{marginTop: '5px'}}>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={field.source}
                  sx={{
                    "& .MuiInputBase-root": { height: "35px" },
                  }}
                  onChange={(e) => handleSourceChange(e, index)}
                >
                  {data?.assertionSourceOperatorChoices?.map((choice) => (
                    <MenuItem
                      key={choice?.source ?? ""}
                      value={choice?.source ?? ""}
                    >
                      {choice?.sourceLabel}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid
                item
                xs={2.5}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                {(field.source == "json_body" || field.source == "headers") && (
                  <>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder={
                        field.source == "json_body"
                          ? "$.store[0].name"
                          : "X-MyHeader"
                      }
                      value={field.property}
                      sx={{
                        "& .MuiInputBase-root": { height: "35px" },
                      }}
                      onChange={(e) => {
                        const newFields = [...state.assertionLimit];
                        newFields[index].property = e.target.value;
                        setState({ ...state, assertionLimit: newFields });
                      }}
                    />
                    {field.source == "headers" && (
                      <a
                        href="#"
                        style={{
                          paddingTop: "5px",
                          textAlign: "right",
                          display: "block",
                        }}
                        id={`showregex-${index}`}
                        onClick={(e) => {
                          showRegex(e, index);
                        }}
                      >
                        Add regex
                      </a>
                    )}
                    <>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="books(d+)"
                        value={field.regex}
                        className={`property-field-${index}`}
                        sx={{
                          "& .MuiInputBase-root": { height: "35px" },
                          paddingTop: "8px",
                          display: "none",
                        }}
                        onChange={(e) => {
                          const newFields = [...state.assertionLimit];
                          newFields[index].regex = e.target.value;
                          setState({ ...state, assertionLimit: newFields });
                        }}
                      />
                      <a
                        href="#"
                        style={{
                          textAlign: "right",
                          paddingTop: "5px",
                          display: "none",
                        }}
                        className={`property-field-${index}`}
                        onClick={(e) => {
                          showRegex(e, index);
                        }}
                      >
                        Remove regex
                      </a>
                    </>
                  </>
                )}
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={field.operator}
                  sx={{
                    "& .MuiInputBase-root": { height: "35px" },
                  }}
                  onChange={(e) => {
                    const newFields = [...state.assertionLimit];
                    newFields[index].operator = e.target.value;
                    setState({ ...state, assertionLimit: newFields });
                  }}
                >
                  {data?.assertionSourceOperatorChoices
                    ?.find((vv) => vv.source == field.source)
                    ?.operators?.map((choice) => (
                      <MenuItem key={choice?.label} value={choice?.operator}>
                        {choice?.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={2.5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={field.expectedValue}
                  sx={{
                    "& .MuiInputBase-root": { height: "35px" },
                  }}
                  onChange={(e) => {
                    const newFields = [...state.assertionLimit];
                    newFields[index].expectedValue = e.target.value;
                    setState({ ...state, assertionLimit: newFields });
                  }}
                />
              </Grid>
              {index !== 0 && (
                <Grid item xs={2}>
                  <IconButton
                    onClick={() =>
                      setState({
                        ...state,
                        assertionLimit: state.assertionLimit.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              startIcon={<AddCircleIcon />}
              onClick={() =>
                setState({
                  ...state,
                  assertionLimit: [
                    ...state.assertionLimit,
                    {
                      expectedValue: "",
                      operator:
                        data?.assertionSourceOperatorChoices?.[0]
                          ?.operators?.[0]?.operator ?? "",
                      property: "",
                      source:
                        data?.assertionSourceOperatorChoices?.[0]?.source ?? "",
                      regex: "",
                    },
                  ],
                })
              }
              sx={{ marginTop: "10px" }}
            >
              Add
            </Button>
          </Grid>
        </Grid2>
      </>
    );
};

export default Tab33;