import React from 'react';
import { Grid } from '@mui/material';

export default function Sections({ children, setNodeRef, isOver, ...props }) {
  return (
    <Grid
      {...props}
      ref={setNodeRef}
      sx={{
        padding: props?.noTopPaddin ? '0px 1rem 1rem' : '1rem',
        background: (theme) => (isOver ? theme.palette.secondary.$a8 : ''),
        overflow: 'auto',
        maxHeight: '100%',
      }}
    >
      {children}
    </Grid>
  );
}
