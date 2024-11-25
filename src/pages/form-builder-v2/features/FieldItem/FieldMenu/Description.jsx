import React from 'react';
import Typography from '@mui/material/Typography';

export default function Description({ description }) {
  return (
    <Typography variant="caption" weight="regular" sx={{ mt: 2 }}>
      {description}
    </Typography>
  );
}
