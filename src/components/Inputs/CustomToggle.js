import React from 'react';

const CustomToggle = ({ defaultChecked }) => (
  <label className="custom-toggle">
    <input defaultChecked={defaultChecked} type="checkbox" />
    <span
      className="custom-toggle-slider custom-toggle-white rounded-circle"
      data-label-off="OFF"
      data-label-on="ON"
    />
  </label>
);
export default CustomToggle;
