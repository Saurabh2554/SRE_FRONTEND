import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

export function DateRangePickerComponent({ onDateChange }) {
  const today = dayjs();
  const endDate = today.add(1, 'day');
  const oneWeekAgo = today.subtract(7, 'day');

  // State for the date range
  const [dateRange, setDateRange] = useState([oneWeekAgo, endDate]);

  const debouncedOnDateChange = debounce((newDateRange) => {
    onDateChange(newDateRange);
  }, 300);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      console.log('Selected Date Range:', dateRange);
      debouncedOnDateChange(dateRange);
    }
  }, [dateRange]);

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
}
