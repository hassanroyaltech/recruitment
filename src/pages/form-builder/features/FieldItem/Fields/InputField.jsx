import * as React from 'react';
import { TextField } from '@mui/material';
import { useTransition } from 'react';
import { emailExpression } from 'utils';

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
    setErrors,
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

    const validateEmail = React.useMemo(
      () => () =>
        type === 'email'
        && value
        && !value.toLowerCase().match(emailExpression)
        && 'Please enter a valid email format',
      [value, type],
    );

    React.useEffect(
      () => () =>
        type === 'email'
        && setErrors
        && setErrors((errors) => {
          let err = errors;
          delete err[id];
          return err;
        }),
      [id, setErrors, type],
    );

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
          (!disabled && isRequired && isSubmitted && !value && 'is-required') || ''
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
        onBlur={(e) => {
          if (setErrors)
            setErrors((errors) => ({ ...errors, [id]: validateEmail() }));
        }}
        helperText={validateEmail()}
        error={validateEmail() ? true : false}
      />
    );
  },
);
