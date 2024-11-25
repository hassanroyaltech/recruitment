import * as React from 'react';
import { Box, Typography } from '@mui/material';
import EditableInput from './EditableInput';

export default function InputTextToggler({
  initialValue,
  setInitialValue,
  handleDoubleClick,
  ...props
}) {
  return (
    <Box onDoubleClick={handleDoubleClick}>
      {initialValue.isText ? (
        <Typography>{initialValue.text}</Typography>
      ) : (
        <EditableInput initialValue={initialValue} {...props} />
      )}
    </Box>
  );
}
