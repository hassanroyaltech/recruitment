import React from 'react';
import { ButtonBase } from '@mui/material';

export const RedirectToCandidateButton = ({ redirectLink }) => (
  <>
    <ButtonBase
      onClick={(e) => {
        e.stopPropagation();
        window.open(redirectLink, '_blank');
      }}
      className="btns-icon theme-transparent  px-2 miw-0 "
    >
      {' '}
      <span className="far fa-eye gray-medium-light-color" />
    </ButtonBase>
  </>
);
