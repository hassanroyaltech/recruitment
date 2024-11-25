import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  countriesList,
  gender,
  age,
  days,
  months,
  employment,
  education,
  timezones,
  satisfaction,
  period,
  income,
} from '../../../../data/optionsDataLists';

const arr = [
  ['Countries', countriesList],
  ['Gender', gender],
  ['Age', age],
  ['Days', days],
  ['Months', months],
  ['Employment', employment],
  ['Education', education],
  ['Timezones', timezones],
  ['Satisfaction', satisfaction],
  ['Time period', period],
  ['Income', income],
];

export default function OptionModalList({ setMultilineValue }) {
  const handleItemSelect = (value) => {
    setMultilineValue(value.join('\n'));
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 184,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 684,
        marginRight: 5,
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
      <li key="section-predef-list">
        <ul>
          <ListSubheader>Predefined lists</ListSubheader>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleItemSelect([''])}>
              <ListItemText primary="Add manually" />
            </ListItemButton>
          </ListItem>
          {arr.map(([k, v]) => (
            <ListItem disablePadding key={`item-${k}`}>
              <ListItemButton onClick={() => handleItemSelect(v)}>
                <ListItemText primary={`${k}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </ul>
      </li>
    </List>
  );
}
