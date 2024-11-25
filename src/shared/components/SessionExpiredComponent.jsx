import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
const SessionExpiredComponent = ({ openDialog, onSessionDialogClose }) => {
  const { t } = useTranslation('Shared');

  const handleClose = () => {
    onSessionDialogClose();
  };

  return (
    <Dialog open={openDialog}>
      <DialogTitle>{t('session-expired')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('your-session-has-expired-please-login-again')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredComponent;
