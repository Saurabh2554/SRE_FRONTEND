import React, { useEffect,useState } from "react";
import { Box, Typography,TextField } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";

export const DateRangePickerComponent = ({ onDateChange }) => {
    const today = dayjs();
  const oneWeekAgo = today.subtract(7, 'day');

  // State for the date range
  const [dateRange, setDateRange] = useState([oneWeekAgo, today]);
  useEffect(() => {
    // Notify parent component of the selected date range
    onDateChange(dateRange);
  }, [dateRange, onDateChange]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={dateRange}
          onChange={(newValue) => setDateRange(newValue)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <TextField {...endProps} />
            </>
          )}
        />
      </LocalizationProvider>
    </Box>
  );
};

