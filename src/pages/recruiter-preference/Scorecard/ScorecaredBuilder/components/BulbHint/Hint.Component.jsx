import React from 'react';

import { BulbIcon, PlusIcon } from '../../../../../../assets/icons';
import { TranslateIcon } from '../../../../../../assets/icons/Translate.Icon';
import ButtonBase from '@mui/material/ButtonBase';

const Hint = ({ title, borderRadius }) => (
  <div
    className="d-flex fz-12px"
    style={{
      border: '1px solid #E8DFD7',
      backgroundColor: '#FBFAF9',
      padding: '15px',
      borderRadius: borderRadius || 0,
    }}
  >
    <span
      style={{ minWidth: '25px', marginInlineStart: '2px', marginInlineEnd: '5px' }}
    >
      <BulbIcon />
    </span>

    {title}
  </div>
);

export default Hint;
