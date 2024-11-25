import React from 'react';
import { Checkbox, styled } from '@mui/material';
import { CheckMarkIcon } from '../icons';

const Icon = styled('span')(({ theme }) => ({
  borderRadius: '6px',
  width: 17.6,
  height: 17.6,
  backgroundColor: theme.palette.light.main,
  border: `2px solid ${theme.palette.dark.$16}`,
  '.Mui-focusVisible &': {
    border: '2px auto rgba(19,124,189,.6)',
  },
  'input:hover ~ &': {
    border: `2px solid ${theme.palette.secondary.$80}`,
    boxShadow: `0px 0px 0px 6px ${theme.palette.secondary.$a12}`,
  },
}));

const CheckedIcon = styled(CheckMarkIcon)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.$80,
  border: `2px solid ${theme.palette.secondary.$80}`,
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage: `radial-gradient(${theme.palette.light.main},${theme.palette.light.main} 28%,transparent 32%)`,
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.secondary.$80,
  },
}));

export default function BpCheckbox(props) {
  return (
    <Checkbox
      {...props}
      sx={{
        mr: 2,
        '& .MuiSvgIcon-root': {
          fontSize: '19.6px',
        },
      }}
      icon={<Icon />}
      checkedIcon={<CheckedIcon size={18} />}
      inputProps={{ 'aria-label': 'Checkbox' }}
    />
  );
}
