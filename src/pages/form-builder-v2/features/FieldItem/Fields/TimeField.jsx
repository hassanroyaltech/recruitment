import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ClockIcon } from '../../../../form-builder/icons';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({ handleSetValue, initialValue, disabled, isRequired, isSubmitted }) => {
    const [value, setValue] = React.useState(initialValue || null);
    React.useEffect(() => {
      setValue(initialValue || null);
    }, [initialValue]);

    const handleChange = (newValue) => {
      setValue(newValue?.getTime() || null);
      handleSetValue(newValue?.getTime() || null);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          disabled={disabled}
          value={value}
          onChange={handleChange}
          components={{
            OpenPickerIcon: ClockIcon,
          }}
          renderInput={(params) => (
            <TextField
              className={
                (!disabled
                  && isRequired
                  && isSubmitted
                  && !value
                  && 'is-required')
                || ''
              }
              {...params}
            />
          )}
        />
      </LocalizationProvider>
    );
  },
);
