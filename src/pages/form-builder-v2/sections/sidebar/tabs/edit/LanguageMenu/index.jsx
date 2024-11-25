import * as React from 'react';
import { styled, Box, Divider, Chip, Button } from '@mui/material';
import AddSecondaryLanguageMenuContent from './AddSecondaryLanguageMenuContent';
import SecondaryLanguageMenuContent from './SecondaryLanguageMenuContent';
import Popover from '../../../../../components/Popover';
import { CornerRightIcon, PlusIcon } from '../../../../../../form-builder/icons';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

const MenuContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 3, 2),
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  '& .MuiButton-root': {
    justifyContent: 'flex-start',
    padding: theme.spacing(3, 5),
    '.MuiButton-endIcon': {
      marginLeft: 'auto',
    },
  },
}));

export default function LanguageMenuContent({
  setDataSectionItems,
  templateData,
  setTemplateData,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const primary = templateData.languages[templateData.primaryLang];
  const secondary = templateData.languages[templateData.secondaryLang];
  const handleFieldsItems = (e) => e.preventDefault();
  return (
    <MenuContainer>
      <Button startIcon={<div>{primary.icon}</div>} onClick={handleFieldsItems}>
        {`${t(
          `${translationPath}${primary.name}`,
        )} (${templateData.primaryLang.toUpperCase()})`}{' '}
        <Chip
          variant="xs"
          radius="sharp"
          label={t(`${translationPath}primary`)}
          sx={{ ml: 2 }}
        />
      </Button>
      {templateData.secondaryLang && (
        <Popover
          styles={{ minWidth: 232 }}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Button
            startIcon={<div>{secondary.icon}</div>}
            endIcon={<CornerRightIcon />}
            onClick={handleFieldsItems}
          >
            {`${t(
              `${translationPath}${secondary.name}`,
            )} (${templateData.secondaryLang.toUpperCase()})`}
          </Button>
          <SecondaryLanguageMenuContent
            setDataSectionItems={setDataSectionItems}
            templateData={templateData}
            setTemplateData={setTemplateData}
          />
        </Popover>
      )}
      <Divider sx={{ my: 2 }} />
      <Popover
        styles={{ minWidth: 232 }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        title={t(`${translationPath}select-secondary-language`)}
      >
        <Button startIcon={<PlusIcon />} endIcon={<CornerRightIcon />}>
          {t(`${translationPath}add-language`)}
        </Button>
        <AddSecondaryLanguageMenuContent
          setDataSectionItems={setDataSectionItems}
          templateData={templateData}
          setTemplateData={setTemplateData}
        />
      </Popover>
    </MenuContainer>
  );
}
