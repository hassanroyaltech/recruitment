import * as React from 'react';
import { MenuItem, MenuList, Typography } from '@mui/material';
import { LinkIcon, FileBrandedIcon } from '../../icons';

export default function CreatorSaveTemplateMenu({ handleClose, isLoading }) {
  const handleCreatorSaveTemplateMenuItemClick = () => {
    handleClose();
  };
  return (
    <MenuList id="split-button-menu" autoFocusItem>
      <MenuItem
        color="primary"
        disabled={isLoading}
        onClick={() => handleCreatorSaveTemplateMenuItemClick()}
      >
        <LinkIcon size="24" />
        <Typography sx={{ mr: 1 }}>Continue invite people</Typography>
      </MenuItem>
      <MenuItem
        color="primary"
        disabled={isLoading}
        onClick={() => handleCreatorSaveTemplateMenuItemClick()}
      >
        <FileBrandedIcon />
        <Typography sx={{ mr: 1 }}>Save as template</Typography>
      </MenuItem>
    </MenuList>
  );
}
