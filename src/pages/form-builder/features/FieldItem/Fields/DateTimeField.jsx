import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DateIcon } from '../../../icons';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    handleSetValue,
    initialValue,
    disabled,
    isRequired,
    isSubmitted,
    disablePastDates,
    disableFutureDates,
  }) => {
    const [value, setValue] = React.useState(initialValue || null);

    React.useEffect(() => {
      setValue(initialValue || null);
    }, [initialValue]);

    const handleChange = (newValue) => {
      setValue((newValue && Date.parse(newValue)) || null);
      handleSetValue((newValue && Date.parse(newValue)) || null);
    };
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          disablePast={disablePastDates}
          disableFuture={disableFutureDates}
          disabled={disabled}
          value={value}
          onChange={handleChange}
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
          components={{
            OpenPickerIcon: DateIcon,
          }}
        />
      </LocalizationProvider>
    );
  },
);
