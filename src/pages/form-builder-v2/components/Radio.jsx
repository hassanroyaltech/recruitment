import React from 'react';
import { styled } from '@mui/material/styles';
import Radio from '@mui/material/Radio';

// TODO disabled style once available
// 'input:disabled ~ &': {
// },
const Icon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 20,
  height: 20,
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

const CheckedIcon = styled(Icon)(({ theme }) => ({
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

export default function CustomRadio(props) {
  return (
    <Radio
      sx={{
        ...props.style,
        mr: 2,
        p: 0,
        '&:hover': {
          bgcolor: 'transparent',
        },
      }}
      disableRipple
      checkedIcon={<CheckedIcon />}
      icon={<Icon />}
      {...props}
    />
  );
}
