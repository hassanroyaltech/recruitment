import React, { useState } from 'react';
import { styled, Box, Popover, Typography } from '@mui/material';

const Menu = styled(({ transformOrigin, anchorOrigin, elevation, ...props }) => (
  <Popover
    elevation={elevation}
    anchorOrigin={
      anchorOrigin || {
        vertical: 'bottom',
        horizontal: 'right',
      }
    }
    transformOrigin={
      transformOrigin || {
        vertical: 'top',
        horizontal: 'right',
      }
    }
    {...props}
  />
  // TODO shadows from theme
))(({ theme, title, styles }) => ({
  '.MuiPaper-root.MuiPopover-paper': {
    ...styles,
  },
  '.MuiPopover-paper': {
    borderRadius: theme.spacing(2),
    //minWidth: 398,
    boxShadow: '0px 4px 13px 0px #090B2114, 0px 0px 2px 0px #10111E33',
    '>.MuiBox-root': {
      display: 'flex',
      '&:nth-of-type(1)': {
        padding: !title ? 0 : '15px 20px',
      },
    },
  },
}));

export default function PopoverMenu({
  children,
  id,
  title,
  anchorOrigin,
  transformOrigin,
  ...props
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {React.cloneElement(children[0], {
        id: `${id}-button`,
        onClick: handleOpen,
      })}
      <Menu
        {...props}
        title={title}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        id={`${id}-menu`}
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
      >
        <Box>{title && <Typography variant="caption">{title}</Typography>}</Box>
        <Box>{React.cloneElement(children[1], { handleClose })}</Box>
      </Menu>
    </>
  );
}
