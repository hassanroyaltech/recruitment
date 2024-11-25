// React and reactstrap
import React from 'react';
import { Button } from 'reactstrap';

// MUI components
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * Returns a ValidationDialog components
 * @param title
 * @param subtitle
 * @param description
 * @param confirmLabel
 * @param errors
 * @param isOpen
 * @param onClose
 * @returns {JSX.Element}
 * @constructor
 */
const ValidationDialog = ({
  title,
  subtitle,
  description,
  confirmLabel,
  errors,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title || t(`${translationPath}please-fields`)}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {subtitle || t(`${translationPath}please-fields-2`)}
          {errors?.length > 0
            && errors.map((error, index) =>
              error?.length > 1 ? (
                error.map((subError, subIndex) => (
                  <p
                    className="m-0 text-xs text-danger"
                    key={[index, subIndex].join('-')}
                  >
                    {subError}
                  </p>
                ))
              ) : (
                <p className="m-o text-xs text-danger" key={index}>
                  {error}
                </p>
              ),
            )}
          <br />
          {description || t(`${translationPath}thank-you`)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {confirmLabel || t(`${translationPath}ok`)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationDialog;
