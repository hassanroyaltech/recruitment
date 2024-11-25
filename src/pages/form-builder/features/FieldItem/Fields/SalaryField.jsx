import React, { forwardRef, useCallback, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import { TextField, Typography } from '@mui/material';
import { EnToArUni } from '../../../../../helpers';
const CurrencyCardField = forwardRef(({ onChange, prefix, ...props }, ref) => (
  <NumberFormat
    {...props}
    getInputRef={ref}
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      });
    }}
    decimalSeparator="."
    isNumericString
    prefix={prefix}
  />
));

CurrencyCardField.displayName = 'CurrencyCardField';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    title,
    charMin,
    charMax,
    placeholder,
    currency,
    handleSetValue,
    initialValue,
    currentInputLang,
    disabled,
    isRequired,
    isSubmitted,
    showNumberOnEnglish
  }) => {
    const [value, setValue] = React.useState(
      EnToArUni(initialValue, currentInputLang),
    );

    useEffect(() => {
      setValue(EnToArUni(initialValue, currentInputLang));
    }, [currentInputLang, initialValue]);

    const debounceFn = React.useCallback(
      _.debounce((v) => handleSetValue(v), 800, { trailing: true }),
      [],
    );

    const handleChange = (e) => {
      // const localValue = EnToArUni(e.target.value, showNumberOnEnglish ? 'en' : currentInputLang);
      setValue(e.target.value);
      debounceFn(EnToArUni(e.target.value, 'en', true));
    };
    return (
      <>
        <TextField
          disabled={disabled}
          placeholder={placeholder}
          value={EnToArUni(value,  showNumberOnEnglish ? 'en' : currentInputLang, true)}
          onChange={handleChange}
          name={title}
          id={`${title}-currency`}
          className={
            (!disabled && isRequired && isSubmitted && !value && 'is-required') || ''
          }
          InputProps={{
            // inputComponent: CurrencyCardField,
            inputProps: {
              minLength: charMin,
              maxLength: charMax,
              // prefix: currency?.symbol,
            },
          }}
        />
        <Typography sx={{ display: 'flex', alignItems: 'center', ml: 4, mr: 2 }}>
          {currency || ' '}
        </Typography>
      </>
    );
  },
);
