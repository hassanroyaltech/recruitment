import React from 'react';

const InputToggle = ({ checked, onChange }) => (
  // eslint-disable-next-line jsx-a11y/label-has-associated-control
  <label className="custom-toggle">
    <input
      checked={checked}
      type="checkbox"
      onChange={() => {
        if (onChange) onChange(!checked);
      }}
    />
    <span className="custom-toggle-slider rounded-circle" />
  </label>
);
export default InputToggle;
