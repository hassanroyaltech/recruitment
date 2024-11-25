import * as React from 'react';
import PT from 'prop-types';
import { Select, MenuItem } from '@mui/material';
import { CornerDownIcon } from '../../../../form-builder/icons';
import { FormsRolesEnum } from '../../../../../enums';

// eslint-disable-next-line react/display-name
function SelectField({
  list,
  placeholder,
  handleSetValue,
  initialValue,
  disabled,
  preview,
  fillBy,
  isRequired,
  isSubmitted,
  showDescriptionInsteadOfTitle,
  role,
  currentInputLang,
}) {
  const [value, setValue] = React.useState(initialValue);
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    setValue(e.target.value);
    handleSetValue(e.target.value);
  };

  return (
    <Select
      fullWidth
      disabled={disabled}
      displayEmpty
      variant="standard"
      id="modal-card-item-select"
      IconComponent={CornerDownIcon}
      value={value || ''}
      onChange={handleChange}
      className={
        (!disabled && isRequired && isSubmitted && !value && 'is-required') || ''
      }
      sx={{
        maxWidth: '100%',
        overflowY: 'hidden',
        ...(preview.isActive && {
          borderColor: preview.role === fillBy && '#9492FA',
        }),
      }}
      MenuProps={{
        maxWidth: '50%',
        getContentAnchorEl: null,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        variant: 'menu',
      }}
    >
      <MenuItem
        value=""
        // disabled
        sx={{
          overflowX: 'auto',
        }}
      >
        {placeholder || (currentInputLang === 'ar' ? 'اختار' : 'Select')}
      </MenuItem>
      {list.map(({ id, title, isVisible, description }) => (
        <MenuItem
          key={id}
          value={id}
          sx={{
            display: !isVisible && 'none',
            overflowX: 'auto',
          }}
        >
          {(preview.isActive
            && preview.role === FormsRolesEnum.Recipient.key
            && showDescriptionInsteadOfTitle
            && description)
          || (role === FormsRolesEnum.Recipient.key
            && showDescriptionInsteadOfTitle
            && description)
            ? description
            : title}
        </MenuItem>
      ))}
    </Select>
  );
}

SelectField.propTypes = {
  list: PT.array.isRequired,
  handleSetValue: PT.func.isRequired,
  placeholder: PT.string,
  intialId: PT.string,
};

SelectField.defaultProps = {
  placeholder: '',
  initialId: '',
};

export default React.memo(SelectField);
