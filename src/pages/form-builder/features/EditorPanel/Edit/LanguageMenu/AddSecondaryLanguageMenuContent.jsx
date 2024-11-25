import * as React from 'react';
import { styled, Box, Button } from '@mui/material';
import { CheckIcon } from '../../../../icons';
import inputFields from '../../../../data/inputFields';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

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
  const { t } = useTranslation(parentTranslationPath);
  const handleSecondaryLang = (secondaryLang) => {
    const localTemplateData = { ...(templateData || {}) };
    setTemplateData((data) => ({
      ...data,
      secondaryLang,
    }));
    if (!localTemplateData.secondaryLang)
      setDataSectionItems((items) => {
        const localItems = JSON.parse(JSON.stringify(items));
        let isChanged = false;
        Object.entries(localItems).map(([key, value]) => {
          value.items.map((item, index) => {
            if (!Object.hasOwn(item.languages, secondaryLang)) {
              if (!isChanged) isChanged = true;
              const localDefaultField
                = (localItems[key].items[index].type !== 'inline'
                  && inputFields[localItems[key].items[index].type].languages[
                    secondaryLang
                  ])
                || null;
              localItems[key].items[index].languages = {
                ...localItems[key].items[index].languages,
                [secondaryLang]:
                  (localDefaultField && {
                    ...localItems[key].items[index].languages[
                      localTemplateData.primaryLang
                    ],
                    title: localDefaultField.title,
                    placeholder: localDefaultField.title,
                    buttonLabel: localDefaultField.buttonLabel,
                  })
                  || localItems[key].items[index].languages[
                    localTemplateData.primaryLang
                  ],
              };
              return undefined;
            }
            if (
              ['select', 'custom_select', 'checkbox', 'radio'].includes(item.type)
            ) {
              const missingOptions = item.languages[
                templateData.primaryLang
              ].options.filter(
                (element) =>
                  !item.languages[secondaryLang].options.some(
                    (option) => option.id === element.id,
                  ),
              );
              if (missingOptions.length) {
                if (!isChanged) isChanged = true;
                localItems[key].items[index].languages[secondaryLang].options
                  = item.languages[templateData.primaryLang].options;
              } else {
                if (!isChanged) isChanged = true;
                // map codes and disable
                localItems[key].items[index].languages[secondaryLang].options
                  = localItems[key].items[index].languages[secondaryLang].options.map(
                    (it) => {
                      const foundPrimaryOption = item.languages[
                        templateData.primaryLang
                      ].options.find((item) => item.id === it.id);
                      return {
                        ...it,
                        code: foundPrimaryOption?.code,
                        isVisible: foundPrimaryOption?.isVisible,
                      };
                    },
                  );
              }
            }
            return undefined;
          });
          return undefined;
        });
        if (isChanged) return { ...localItems };
        return items;
      });
  };
  return (
    <MenuContainer>
      {Object.entries(templateData.languages)
        .filter(([k]) => templateData.primaryLang !== k)
        .map(([k, { name }]) => (
          <Button
            key={`templateDataLanguagesKey${k}`}
            startIcon={
              templateData.secondaryLang === k ? (
                <CheckIcon />
              ) : (
                <Box sx={{ width: 20, height: 20 }} />
              )
            }
            onClick={() => handleSecondaryLang(k)}
          >
            {`${t(`${translationPath}${name}`)} (${k.toUpperCase()})`}
          </Button>
        ))}
    </MenuContainer>
  );
}
