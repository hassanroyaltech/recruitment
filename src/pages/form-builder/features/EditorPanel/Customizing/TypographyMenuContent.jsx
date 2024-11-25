import React from 'react';
import { styled, Box, Divider } from '@mui/material';
import Accordion from '../../../components/Accordion';
import TypographyMenuContentAccordionBody from './TypographyMenuContentAccordionBody';

const MenuContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  '.settings-item-box': {
    display: 'flex',
    padding: theme.spacing(1, 0),
    '.MuiTypography-root': {
      flex: '0 112px',
      alignSelf: 'center',
    },
    '.MuiBox-root': {
      flex: 1,
    },
  },
}));

export default function TypographyMenuContent({ fieldsItems, setFieldsItems }) {
  return (
    <MenuContainer>
      <Divider />
      <Accordion
        TransitionProps={{ unmountOnExit: true }}
        items={Object.values(fieldsItems)
          .filter((f) => f.type === 'inline')
          .map((f) => ({
            header: f.style.type,
            body: (
              <TypographyMenuContentAccordionBody
                item={f}
                setFieldsItems={setFieldsItems}
              />
            ),
          }))}
      />
    </MenuContainer>
  );
}
