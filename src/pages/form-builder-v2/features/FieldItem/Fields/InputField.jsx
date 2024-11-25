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
  }) => {
    const [value, setValue] = React.useState(
      initialValue || initialValue === 0 ? initialValue : '',
    );
    const [, startTransition] = useTransition();

    const handleChange = (e) => {
      setValue(e.target.value);
      startTransition(() => handleSetValue(e.target.value));
    };

    React.useEffect(() => {
      setValue(initialValue || initialValue === 0 ? initialValue : '');
    }, [initialValue]);

    return (
      <TextField
        disabled={disabled}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxRows={rowMax}
        minRows={rowMin}
        multiline={multiline}
        required={isRequired}
        rows={
          (multiline && !rowMin && !rowMax && rowMin !== 0 && rowMax !== 0 && 3)
          || undefined
        }
        className={
          (!disabled
            && errors[id]
            && errors[id].error
            && isSubmitted
            && !value
            && 'is-required')
          || ''
        }
        inputProps={{
          sx: ['inline'].includes(type) && {
            fontFamily: style.fontFamily,
            fontSize: `${style.fontSize}px !important`,
            lineHeight: `${style.fontSize}px`,
            fontStyle: style.textDecoration.includes('italic') && 'italic',
            fontWeight: style.textDecoration.includes('bold') && 700,
            textDecoration:
              style.textDecoration.includes('underline') && 'underline',
            textAlign: style.textAlign,
          },
          maxLength: charMax,
          minLength: charMin,
          readOnly,
        }}
        helperText={isSubmitted && errors[id] && errors[id].message}
        error={isSubmitted && errors[id] && errors[id].error}
      />
    );
  },
);
