import React, { useEffect, useState, useTransition } from 'react';
// import NumberFormat from 'react-number-format';
import { TextField } from '@mui/material';
import { EnToArUni } from '../../../../../helpers';

// const NumberCardField = forwardRef(({ onChange, ...props }, ref) => (
//   <NumberFormat
//     {...props}
//     getInputRef={ref}
//     onValueChange={(values) => {
//       onChange({
//         target: {
//           name: props.name,
//           value: values.value,
//         },
//       });
//     }}
//     isNumericString
//   />
// ));
//
// NumberCardField.displayName="NumberCardField";

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    title,
    charMin,
    charMax,
    placeholder,
    handleSetValue,
    initialValue,
    disabled,
    isRequired,
    isSubmitted,
    setErrors,
    id,
    currentInputLang,
    showNumberOnEnglish,
  }) => {
    const [, startTransition] = useTransition();
    const [value, setValue] = React.useState(EnToArUni(initialValue, 'en', true));

    const handleChange = (e) => {
      const value = e.target.value;
      const regex = /^[0-9٠-٩]*$/;
      if (regex.test(value)) {
        setValue(EnToArUni(e.target.value, 'en', true));
        startTransition(() => handleSetValue(EnToArUni(e.target.value, 'en', true)));
      }
    };

    useEffect(() => {
      setValue(EnToArUni(initialValue, 'en', true));
    }, [initialValue]);
    const validateNumber = React.useMemo(
      () => () => {
        const val = parseFloat(value);
        const min = parseFloat(charMin);
        const max = parseFloat(charMax);
        if (isNaN(val)) return;
        if (!isNaN(min) && val < min && isNaN(max))
          return `Please enter a valid number bigger than ${min}`;
        if (isNaN(min) && !isNaN(max) && val > max)
          return `Please enter a valid number smaller than ${max}`;
        if ((!isNaN(min) && val < min) || (!isNaN(max) && val > max))
          return `Please enter a valid number between ${min} and ${max}`;
      },
      [value, charMin, charMax],
    );
    React.useEffect(
      () => () =>
        setErrors
        && setErrors((errors) => {
          let err = errors;
          delete err[id];
          return err;
        }),
      [id, setErrors],
    );
    return (
      <TextField
        disabled={disabled}
        placeholder={placeholder}
        value={EnToArUni(value, showNumberOnEnglish ? 'en' : currentInputLang, true)}
        onChange={handleChange}
        name={title}
        id={`${title}-number`}
        className={
          (!disabled && isRequired && isSubmitted && !value && 'is-required') || ''
        }
        helperText={validateNumber()}
        error={validateNumber() ? true : false}
        onBlur={(e) => {
          if (setErrors)
            setErrors((errors) => ({ ...errors, [id]: validateNumber() }));
        }}
        InputProps={{
          // inputComponent: NumberCardField,
          inputMode: 'numeric',
          pattern: '[0-9٠-٩]*',
          inputProps: {
            type: 'text',
            min: parseFloat(charMin),
            max: parseFloat(charMax),
            step: '1',
          },
        }}
      />
    );
  },
);
