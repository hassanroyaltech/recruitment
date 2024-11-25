import React from 'react';
import MuiChip from '@mui/material/Chip';
import { styled, alpha } from '@mui/material/styles';

// TODO remove chip from components
const Chip = styled(MuiChip)(({ theme }) => ({
  borderRadius: '70px',
  background: `${alpha(theme.palette.dark.main, 0.06)}`,
  color: theme.palette.dark.$80,
  height: 'auto',
  '& .MuiChip-label': {
    padding: '0',
    fontSize: '13.5px',
    lineHeight: '14px',
  },
}));

export default function CustomChip(props) {
  return <Chip {...props} />;
}
