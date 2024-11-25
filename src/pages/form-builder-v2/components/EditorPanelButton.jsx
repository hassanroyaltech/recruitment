import * as React from 'react';
import MuiButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { CornerRightIcon } from '../../form-builder/icons';

const Button = styled(MuiButton)(({ theme }) => ({
  ...theme.typography.caption,
  height: theme.spacing(12),
  borderRadius: 0,
  width: '100%',
  boxShadow: '0px -1px 0px 0px #F2F2F2 inset',
  padding: theme.spacing(0, 4, 0, 5),
  justifyContent: 'space-between',
  '&:hover': {
    color: theme.palette.dark.$80,
    boxShadow: 'none',
  },
  '&:active': {
    color: theme.palette.dark.main,
    boxShadow: 'none',
  },
}));

export default function customButton(props) {
  return (
    <Button {...props}>
      <Typography variant="capiton">{props.title || ''}</Typography>
      <Stack direction="row" spacing={2}>
        <Box display="flex" alignItems="center">
          {props.children}
        </Box>
        <Box display="flex" alignItems="center">
          <CornerRightIcon />
        </Box>
      </Stack>
    </Button>
  );
}
