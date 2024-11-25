import React, { useState } from 'react';
import {
  styled,
  Box,
  FormControl,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import {
  TabsUnstyled,
  TabsListUnstyled,
  TabPanelUnstyled,
  buttonUnstyledClasses,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';
import Radio from '../../../components/Radio';

// TODO theme, colors, reuse tab components
const CardItemTabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-size: 0.875rem;
`;

const CardItemTab = styled(TabUnstyled)`
  cursor: pointer;
  color: #242533;
  font-size: 13px;
  font-weight: 400;
  background-color: transparent;
  width: 100%;
  padding: 8px 12px;
  border: none;
  display: flex;
  justify-content: center;

  &:not(:last-child) {
    border-right: 1px solid #eeeef2;
  }

  &:hover {
    background-color: #644ded0a;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: #644ded0a;
    color: black;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  border: 1px solid #eeeef2;
  border-radius: 6px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

export default function RulesTabPanel({ handleRoleChange, fillBy }) {
  const [radioValue, setRadioValue] = useState(fillBy);
  const [optionalRadioValue, setOptionalRadioValue] = useState(fillBy);
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
    handleRoleChange(e);
  };
  const handleOptionalRadioChange = (e) => {
    setOptionalRadioValue(e.target.value);
    handleRoleChange(e);
  };
  return (
    <Box>
      <TabsUnstyled defaultValue={0}>
        <TabsList>
          <CardItemTab>Prefilled</CardItemTab>
          <CardItemTab>Must be filled by</CardItemTab>
          <CardItemTab>Optional by</CardItemTab>
        </TabsList>
        <CardItemTabPanel value={0}>
          This field will be prefilled with data you put. You can fill out the field
          or put variable inside, just make sure it will not be empty.
        </CardItemTabPanel>
        <CardItemTabPanel value={1}>
          <FormControl>
            <FormLabel id="controlled-radio-buttons-group">
              Select the role, who is able to fill out this field.
            </FormLabel>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={radioValue}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                value="sender"
                control={<Radio />}
                label="Must be filled by the sender"
              />
              <FormControlLabel
                value="recipient"
                control={<Radio />}
                label="Must be filled by the recipient"
              />
            </RadioGroup>
          </FormControl>
        </CardItemTabPanel>
        <CardItemTabPanel value={2}>
          <FormControl>
            <FormLabel id="controlled-radio-buttons-group">
              Select the role, who is able to fill out this field.
            </FormLabel>
            <RadioGroup
              aria-labelledby="controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={optionalRadioValue}
              onChange={handleOptionalRadioChange}
            >
              <FormControlLabel
                value="sender"
                control={<Radio />}
                label="by the sender"
              />
              <FormControlLabel
                value="recipient"
                control={<Radio />}
                label="by the recipient"
              />
            </RadioGroup>
          </FormControl>
        </CardItemTabPanel>
      </TabsUnstyled>
    </Box>
  );
}
