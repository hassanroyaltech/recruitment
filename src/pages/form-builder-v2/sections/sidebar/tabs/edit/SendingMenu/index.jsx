import * as React from 'react';
import { styled, Box } from '@mui/material';
import Canvas from '../../../../../features/Canvas';

const MenuContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 3, 2),
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  '.MuiButton-root': {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3),
    '.MuiButton-endIcon': {
      marginLeft: 'auto',
    },
  },
}));

export default function SendingMenu() {
  return (
    <MenuContainer>
      <Canvas width={362} height={340} />
      content
    </MenuContainer>
  );
}
