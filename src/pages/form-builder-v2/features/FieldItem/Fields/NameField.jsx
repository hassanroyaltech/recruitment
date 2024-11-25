import * as React from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

export default function NameField({
  placeholder,
  handleSetValue,
  initialValue,
  disabled,
  isRequired,
  isSubmitted,
}) {
  const [firstName, middleName, lastName, fourthName] = placeholder.split(',');
  const [fullName, setFullName] = React.useState(
    Array.isArray(initialValue) ? initialValue : ['', '', '', ''],
  );

  const handleName = (e, idx) => {
    setFullName((arr) => arr.map((x, i) => (idx === i ? e.target.value : x)));
  };

  React.useEffect(() => {
    handleSetValue(fullName);
  }, [fullName, handleSetValue]);

  return (
    <>
      <TextField
        disabled={disabled}
        value={fullName[0] || ''}
        onChange={(e) => handleName(e, 0)}
        placeholder={firstName}
        sx={{ mr: 2 }}
        className={
          (!disabled
            && isRequired
            && isSubmitted
            && !fullName[0]
            && 'is-required')
          || ''
        }
      />
      <TextField
        disabled={disabled}
        value={fullName[1] || ''}
        onChange={(e) => handleName(e, 1)}
        placeholder={middleName}
        sx={{ mr: 2 }}
        className={(!disabled && isRequired && isSubmitted && !fullName[1]) || ''}
      />
      <TextField
        disabled={disabled}
        value={fullName[2] || ''}
        onChange={(e) => handleName(e, 2)}
        placeholder={lastName}
        sx={{ mr: 2 }}
        className={(!disabled && isRequired && isSubmitted && !fullName[2]) || ''}
      />
      <TextField
        disabled={disabled}
        value={fullName[3] || ''}
        onChange={(e) => handleName(e, 3)}
        placeholder={fourthName}
        className={
          (!disabled
            && isRequired
            && isSubmitted
            && !fullName[3]
            && 'is-required')
          || ''
        }
      />
    </>
  );
}

NameField.propTypes = {
  placeholder: PropTypes.string,
  handleSetValue: PropTypes.func,
  initialValue: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  isSubmitted: PropTypes.bool,
};

NameField.defaultProps = {
  placeholder: undefined,
  handleSetValue: undefined,
  initialValue: undefined,
  disabled: undefined,
  isRequired: undefined,
  isSubmitted: undefined,
};
