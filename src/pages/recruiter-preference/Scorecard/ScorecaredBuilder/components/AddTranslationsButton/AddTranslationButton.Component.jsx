import React from 'react';

import { PlusIcon } from '../../../../../../assets/icons';
import { TranslateIcon } from '../../../../../../assets/icons/Translate.Icon';
import ButtonBase from '@mui/material/ButtonBase';

const AddTranslationButton = ({ onClick }) => (
  <ButtonBase
    onClick={onClick}
    className="btns miw-0 "
    sx={{
      border: '2px solid',
      borderRadius: '54px !important',
      width: '55px',
      minHeight: '0px !important',
      height: '25px',
      backgroundColor: '#FBFAF9',
      borderColor: '#F0EAE4 !important',
    }}
  >
    <PlusIcon />
    <span style={{ paddingInline: '3px' }} />
    <TranslateIcon />
  </ButtonBase>
);

export default AddTranslationButton;
