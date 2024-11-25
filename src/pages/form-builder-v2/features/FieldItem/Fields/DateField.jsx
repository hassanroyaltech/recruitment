import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateIcon } from '../../../../form-builder/icons';

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
        <DatePicker
          disablePast={disablePastDates}
          disableFuture={disableFutureDates}
          disabled={disabled}
          inputFormat="dd/MM/yyyy"
          value={value}
          onChange={handleChange}
          components={{
            OpenPickerIcon: DateIcon,
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
