import * as React from 'react';
import { styled, Box, Button } from '@mui/material';
import { TrashIcon } from '../../../../icons';

const MenuContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 3, 2),
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  '.MuiButton-root': {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3),
    '.MuiButton-startIcon': {
      marginRight: `${theme.spacing(2)} /* @noflip */`,
    },
  },
}));

export default function FileMenu({ handleClose, setFiles, uuid }) {
  const handleRemoveSecondaryLang = () => {
    setFiles((data) => data.filter((item) => item.uuid !== uuid));
    handleClose();
  };
  return (
    <MenuContainer>
      <Button startIcon={<TrashIcon />} onClick={handleRemoveSecondaryLang}>
        Remove
      </Button>
    </MenuContainer>
  );
}

MenuContainer.displayName = 'MenuContainer';
