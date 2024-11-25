import * as React from 'react';
import { styled, Box, Button } from '@mui/material';
import { FlagIcon, TrashIcon } from '../../../../../../form-builder/icons';

const MenuContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 3, 2),
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  '.MuiButton-root': {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3),
    '.MuiButton-endIcon': {
      marginLeft: 'auto',
    },
  },
}));

export default function SecondaryLang({
  setDataSectionItems,
  templateData,
  setTemplateData,
}) {
  const handleRemoveSecondaryLang = () => {
    const localTemplateData = { ...(templateData || {}) };
    setTemplateData((data) => ({
      ...data,
      secondaryLang: '',
    }));
    setDataSectionItems((items) => {
      const localItems = JSON.parse(JSON.stringify(items));
      Object.entries(localItems).map(([key, value]) => {
        value.items.map((item, index) => {
          delete localItems[key].items[index].languages[
            localTemplateData.secondaryLang
          ];
          return undefined;
        });
        return undefined;
      });
      return localItems;
    });
  };
  const handleMakeSecondaryLangPrimary = () => {
    setTemplateData((data) => ({
      ...data,
      primaryLang: data.secondaryLang,
      secondaryLang: data.primaryLang,
    }));
  };
  return (
    <MenuContainer>
      <Button startIcon={<FlagIcon />} onClick={handleMakeSecondaryLangPrimary}>
        Mark as primary
      </Button>
      <Button startIcon={<TrashIcon />} onClick={handleRemoveSecondaryLang}>
        Remove
      </Button>
    </MenuContainer>
  );
}
