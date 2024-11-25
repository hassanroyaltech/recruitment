import * as React from 'react';
import { styled } from '@mui/material/styles';
import { FormGroup, FormControlLabel } from '@mui/material';
import Radio from '../../../components/Radio';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
      color: `var(--c-primary, ${theme.palette.primary.main})`,
    },
  }),
);

const MemoRadioItem = React.memo(
  ({ id, title, isChecked, isVisible, handleChange, disabled }) => (
    <StyledFormControlLabel
      label={title}
      checked={isChecked}
      control={
        <Radio
          disabled={disabled}
          checked={isChecked}
          sx={{ display: !isVisible && 'none' }}
          onClick={() => {
            handleChange(isChecked ? null : id);
          }}
          value={id}
          name="radio-buttons"
          inputProps={{ 'aria-label': { title } }}
        />
      }
    />
  ),
);

MemoRadioItem.displayName = 'MemoRadioItem';

export default function RadioList({
  list,
  initialValue,
  handleSetValue,
  disabled,
  isRequired,
  isSubmitted,
}) {
  // TODO figure out disabled state
  const handleChange = React.useCallback(
    (value, id, checked) => {
      handleSetValue(value, id, checked);
    },
    [handleSetValue],
  );

  return (
    <div>
      <FormGroup
        className={
          (!disabled
            && isRequired
            && isSubmitted
            && !initialValue
            && 'is-required')
          || ''
        }
      >
        {list.map(
          ({ isVisible, id, title }) =>
            (isVisible && (
              <MemoRadioItem
                disabled={disabled}
                key={id}
                id={id}
                title={title}
                isChecked={initialValue === id}
                isVisible={isVisible}
                handleChange={handleChange}
              />
            ))
            || null,
        )}
      </FormGroup>
    </div>
  );
}
