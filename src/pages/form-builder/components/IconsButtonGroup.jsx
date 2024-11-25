import React, { useEffect, useState } from 'react';
import { Icon, ToggleButton, ToggleButtonGroup, styled } from '@mui/material';

const CustomToggleButtonGroup = styled(ToggleButtonGroup)(({ style, theme }) => ({
  padding: theme.spacing(0),
  ...style,
}));

export default function IconButtonGroup({
  list,
  isExclusive = false,
  defaultValue,
  model = 'icon',
  border,
  style,
  setValue,
  value,
}) {
  const [toggleValue, setToggleValue] = useState(
    isExclusive ? defaultValue : [defaultValue].filter(Boolean),
  );

  const handleChange = (e, newValue) => {
    setToggleValue(newValue);
    if (setValue) setValue(newValue);
  };

  useEffect(() => {
    setToggleValue(value);
  }, [value]);

  return (
    <CustomToggleButtonGroup
      value={toggleValue}
      exclusive={isExclusive}
      onChange={handleChange}
      style={style}
    >
      {list.map(({ icon, value }, i) => (
        <ToggleButton model={model} key={i} border={border} value={value}>
          <Icon component={icon} />
        </ToggleButton>
      ))}
    </CustomToggleButtonGroup>
  );
}
