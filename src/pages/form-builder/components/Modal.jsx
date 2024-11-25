import * as React from 'react';
import { Box, Modal, IconButton, Typography, Backdrop } from '@mui/material';
import { CrossIcon } from '../icons';
import Fade from './Fade';

export default function CustomModal({
  children,
  component,
  backdropComponent,
  backdropProps,
  title,
  titleVariant,
  modalId,
  width,
  ...props
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {React.cloneElement(children, {
        id: modalId || Date.now(),
        onClick: handleOpen,
      })}
      <Modal
        {...props}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={backdropComponent || Backdrop}
        BackdropProps={{
          ...backdropProps,
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              transform: 'translate(-50%, -50%)',
              top: '50%',
              left: '50%',
              px: 6,
              pt: 5,
              pb: '17px',
              width,
              minWidth: width,
              boxShadow: 24,
              borderRadius: '8px',
              boxSizing: 'border-box',
              background: (theme) => theme.palette.light.main,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              flexItem
              sx={{ mb: 4 }}
            >
              <Typography variant={titleVariant || 'h3'}>{title}</Typography>
              <IconButton>
                <CrossIcon onClick={handleClose} />
              </IconButton>
            </Box>
            {React.cloneElement(component, { handleClose })}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
