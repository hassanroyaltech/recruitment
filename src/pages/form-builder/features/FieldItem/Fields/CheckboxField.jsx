import * as React from 'react';
import { styled } from '@mui/material/styles';
import { FormGroup, FormControlLabel } from '@mui/material';
import Checkbox from '../../../components/Checkbox';
import { useCallback, useEffect } from 'react';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
      color: `var(--c-primary, ${theme.palette.primary.main})`,
    },
  }),
);

StyledFormControlLabel.displayName = 'StyledFormControlLabel';

const MemoListItem = React.memo(
  ({ id, title, isChecked, isVisible, handleChange, disabled }) => (
    <StyledFormControlLabel
      label={title}
      checked={isChecked}
      control={
        <Checkbox
          disabled={disabled}
          checked={isChecked}
          sx={{ display: !isVisible && 'none' }}
          onChange={(e) => handleChange(e, id)}
        />
      }
    />
  ),
);

MemoListItem.displayName = 'MemoListItem';

export default function CheckboxList({
  list,
  handleSetValue,
  initialValue,
  disabled,
  isRequired,
  isSubmitted,
}) {
  const [localValues, setLocalValues] = React.useState(initialValue || []);

  const handleChange = useCallback((e, id) => {
    setLocalValues((items) => {
      const localItems = [...items];
      if (e.target.checked) localItems.push(id);
      else {
        const idIndex = localItems.indexOf(id);
        if (idIndex !== -1) localItems.splice(idIndex, 1);
      }
      return localItems;
    });
  }, []);

  useEffect(() => {
    handleSetValue(localValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValues]);

  return (
    <FormGroup
      className={
        (!disabled
          && isRequired
          && isSubmitted
          && (!initialValue || initialValue.length === 0)
          && 'is-required')
        || ''
      }
    >
      {list.map(
        ({ id, title, isVisible }) =>
          (isVisible && (
            <MemoListItem
              key={id}
              id={id}
              title={title}
              disabled={disabled}
              isChecked={initialValue && initialValue.includes(id)}
              isVisible={isVisible}
              isRequired={isRequired}
              isSubmitted={isSubmitted}
              handleChange={handleChange}
            />
          ))
          || null,
      )}
    </FormGroup>
  );
}
