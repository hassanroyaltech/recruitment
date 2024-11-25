import React from 'react';
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Since this component should be card but button is used to ez access to startIcon prop
const DraggableCard = styled(MuiButton)(({ theme }) => ({
  ...theme.typography.body14controls,
  maxWidth: '150px',
  minWidth: '146px',
  height: '56px',
  padding: '14px 15px 14px 13.67px',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.dark.$8}`,
  backgroundColor: theme.palette.light.main,
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: theme.palette.secondary.$a6,
    border: `1px solid ${theme.palette.secondary.$80}`,
  },
  '&:active': {
    boxShadow: '0px 4px 13px 0px #090B2114, 0px 0px 2px 0px #10111E33',
    '& .MuiSvgIcon-root > path': {
      stroke: theme.palette.dark.$40,
    },
  },
  '& .MuiSvgIcon-root > path': {
    stroke: theme.palette.secondary.$80,
  },
}));

export default function DraggableButton(props) {
  return <DraggableCard {...props}>{props.children}</DraggableCard>;
}
