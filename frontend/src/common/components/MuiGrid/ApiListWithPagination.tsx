// src/components/ApiListWithPagination.js
import React, { useState } from 'react';
import { Grid, Typography, TablePagination } from '@mui/material';

export function ApiListWithPagination({ metrics }) {
  const [page, setPage] = useState(0); // Tracks the current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Pagination logic: calculate the current slice of metrics to display
  const paginatedMetrics = metrics.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">APIs</Typography>
      </Grid>

      {/* Grid for displaying APIs */}
      {paginatedMetrics.length === 0 ? (
        <Grid item xs={12}>
          <Typography>No APIs found.</Typography>
        </Grid>
      ) : (
        paginatedMetrics.map((api) => (
          <Grid item xs={12} key={api.id}>
            <Typography>
              {api.apiName} - {api.apiUrl}
            </Typography>
          </Grid>
        ))
      )}

      {/* Pagination controls */}
      <Grid item xs={12}>
        <TablePagination
          component="div"
          count={metrics.length} // Total number of items
          page={page} // Current page
          onPageChange={handleChangePage} // Function to handle page changes
          rowsPerPage={rowsPerPage} // Rows per page
          onRowsPerPageChange={handleChangeRowsPerPage} // Function to handle rows per page change
          rowsPerPageOptions={[5, 10, 25]} // Rows per page options
        />
      </Grid>
    </Grid>
  );
}
