import React, { useState } from 'react';
import _ from 'lodash';
import { Box, Button, Divider, Typography, IconButton } from '@mui/material';

import OptionsModal from './OptionsModal';
import OptionsList from './OptionsList';
import { generateUUIDV4 } from '../../../../../helpers';
import { PlusIcon } from '../../../../form-builder/icons';

export default function Options({
  language,
  setLanguage,
  langSaveTo,
  anotherLang,
  inputType,
  disabled,
}) {
  const [isAsc, setIsAsc] = useState(false);

  const handleAddOption = () => {
    // we'll remove it after adding localization
    const getTr = (language) => {
      switch (language) {
      case 'en':
        return 'Option';
      case 'ar':
        return 'الخيار';
      default:
        return 'Option';
      }
    };
    const id = generateUUIDV4();
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: [
          ...langs[langSaveTo].options,
          {
            id,
            title: `${getTr(langSaveTo)} ${langs[langSaveTo].options.length + 1}`,
            code: '',
            selectedId: '',
            isVisible: true,
            isChecked: false,
          },
        ],
      },
      ...(anotherLang && {
        [anotherLang]: {
          ...langs[anotherLang],
          options: [
            ...langs[anotherLang].options,
            {
              id,
              title: `${getTr(anotherLang)} ${
                langs[anotherLang].options.length + 1
              }`,
              code: '',
              selectedId: '',
              isVisible: true,
              isChecked: false,
            },
          ],
        },
      }),
    }));
  };
  const handleSorting = () => {
    setLanguage((langs) => ({
      ...langs,
      [langSaveTo]: {
        ...langs[langSaveTo],
        options: _.orderBy(
          langs?.[langSaveTo]?.options,
          ['title'],
          [isAsc ? 'asc' : 'desc'],
        ),
      },
      ...(anotherLang && {
        [anotherLang]: {
          ...langs[anotherLang],
          options: _.orderBy(
            langs?.[anotherLang]?.options,
            ['title'],
            [isAsc ? 'asc' : 'desc'],
          ),
        },
      }),
    }));
    setIsAsc((asc) => !asc);
  };

  return (
    <Box>
      <Box display="flex" sx={{ mt: 2 }}>
        <Box display="flex" alignItems="center" sx={{ mr: 'auto' }}>
          <Typography variant="caption" weight="regular" color="dark.main">
            Options
          </Typography>
          <Typography variant="caption" weight="regular" sx={{ mx: 1 }}>
            •
          </Typography>
          <Typography variant="caption" weight="regular">
            {language?.[langSaveTo]?.options?.length}
          </Typography>
        </Box>
        <Button onClick={handleSorting} variant="ghost" size="s" disabled={disabled}>
          <Typography
            variant="caption"
            align="center"
            sx={{ cursor: 'pointer', color: 'dark.$80' }}
          >
            Sort by {isAsc ? 'AZ' : 'ZA'}
          </Typography>
        </Button>
        <IconButton
          onClick={handleAddOption}
          variant="rounded"
          color="secondary"
          sx={{ mx: 1 }}
          disabled={disabled}
        >
          <PlusIcon color="light.main" />
        </IconButton>
        <OptionsModal
          anotherLang={anotherLang}
          setLanguage={setLanguage}
          langSaveTo={langSaveTo}
          disabled={disabled}
        />
      </Box>
      <Divider sx={{ mt: 1 }} />
      <OptionsList
        inputType={inputType}
        language={language}
        setLanguage={setLanguage}
        langSaveTo={langSaveTo}
        anotherLang={anotherLang}
        disabled={disabled}
      />
    </Box>
  );
}
