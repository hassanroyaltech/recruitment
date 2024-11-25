import * as React from 'react';
import PT from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import { TrashIcon } from '../../../form-builder/icons';

function ActionModal({ handleClose, handleAction, bodyText, btnText }) {
  return (
    <Box>
      <Typography variant="body13" color="dark.$60">
        {bodyText}
      </Typography>
      <Box display="flex" justifyContent="flex-end" sx={{ mt: 8 }}>
        <Button
          startIcon={<TrashIcon />}
          onClick={handleAction}
          sx={{ color: 'dark.main', mr: 4 }}
        >
          {`Yes, ${btnText}`}
        </Button>
        <Button sx={{ color: 'dark.main' }} onClick={handleClose}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

ActionModal.propTypes = {
  bodyText: PT.string,
  btnText: PT.string.isRequired,
  handleClose: PT.func.isRequired,
  handleAction: PT.func.isRequired,
};
ActionModal.defaultProps = {
  bodyText: '',
};

export default ActionModal;
