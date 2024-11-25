import React from 'react';
import { Box, Typography } from '@mui/material';

export default function HistoryTab() {
  return (
    <Box
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="caption11">History</Typography>
    </Box>
  );
}
