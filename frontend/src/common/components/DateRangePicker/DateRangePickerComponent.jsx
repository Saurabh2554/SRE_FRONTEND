import React, { useState } from "react";
import { Box, Typography,TextField } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";

export const DateRangePickerComponent = () => {
  const [value, setValue] = useState([dayjs(), dayjs()]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
            </>
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

