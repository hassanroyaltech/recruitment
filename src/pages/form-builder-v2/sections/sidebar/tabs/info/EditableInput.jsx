import React from 'react';
import { styled, TextField } from '@mui/material';

const FormRename = styled('form')`
  display: flex;
  position: relative;
  height: max-content;
  align-self: center;
  justify-content: center;
  align-content: center;
  margin: 0 0.2em;
`;

const InputRename = styled(TextField)`
  overflow: hidden;
  margin-right: 0.2em;
  text-indent: 0.15em;
  align-text: right;
`;
// &:enabled, disabled {
// background: ;
// }

// TODO useEffect to select on focus
//onFocus={(e) => e.target.select()}
// eslint-disable-next-line react/display-name
export default React.forwardRef(
  ({ initialValue, handleRenameItemChange, handleRenameItemSubmit }, ref) => (
    <FormRename onSubmit={handleRenameItemSubmit}>
      <InputRename
        type="text"
        defaultValue={initialValue.text}
        ref={ref}
        onChange={handleRenameItemChange}
        inputProps={{
          sx: {
            height: '2em',
          },
        }}
      />
    </FormRename>
  ),
);
