import * as React from 'react';
import { TextField } from '@mui/material';
import { useTransition } from 'react';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    placeholder,
    multiline,
    charMax,
    charMin,
    rowMax,
    rowMin,
    style,
    type,
    handleSetValue,
    initialValue,
    disabled,
    readOnly,
    isRequired,
    isSubmitted,
    errors,
    id,
  }) => (
    <div id={id}>
      hello{id} {type}
    </div>
  ),
);
