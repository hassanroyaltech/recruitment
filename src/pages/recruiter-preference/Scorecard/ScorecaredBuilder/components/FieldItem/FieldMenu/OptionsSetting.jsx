import React from 'react';
import { Box, Button, ButtonBase, IconButton, Typography } from '@mui/material';
import '../../Section/SectionSetting/SectionSetting.Style.scss';
import { useTranslation } from 'react-i18next';
import { SharedInputControl } from '../../../../../../setups/shared';
import { CrossIcon } from '../../../../../../form-builder/icons';
import { PlusIcon } from '../../../../../../../assets/icons';

export const OptionsSetting = ({
  currentBlock,
  setCurrentBlock,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const handleRemoveOption = (idx) => {
    setCurrentBlock((items) => ({
      ...items,
      options: items?.options?.filter((x, i) => i !== idx),
    }));
  };
  const handleAddOption = () => {
    setCurrentBlock((items) => ({
      ...items,
      options: [...(items?.options || []), ''],
    }));
  };

  const handleChange = ({ index, val }) => {
    let localeOptions = currentBlock.options || [];
    localeOptions[index] = val;
    setCurrentBlock((items) => ({
      ...items,
      options: localeOptions,
    }));
  };
  return (
    <>
      <div className="d-block my-2  separator-sidebar-scorecard"></div>
      <span className="px-2 fz-12px c-black mb-2">{t('options')}</span>
      <Box sx={{ mb: 2, px: 3 }}>
        {(currentBlock?.options || []).map((option, index) => (
          <div
            className="d-flex-v-center-h-between mb-2 w-100 "
            key={`scorecard-option${index}`}
          >
            <Typography
              className="d-inline-flex  "
              sx={{ width: '150px', color: 'dark.$40' }}
            >
              {`${t('option')} ${index + 1}`}
            </Typography>
            <SharedInputControl
              wrapperClasses="m-0"
              isFullWidth
              placeholder={`${t('option')} ${index + 1}`}
              editValue={option}
              onValueChanged={(newValue) =>
                handleChange({
                  val: newValue.value,
                  index,
                })
              }
              parentTranslationPath={parentTranslationPath}
              type="text"
            />
            {currentBlock?.options?.length > 1 && (
              <IconButton
                onClick={() => handleRemoveOption(index)}
                sx={{ ml: 2.5 }}
                variant="rounded"
                color="error"
              >
                <CrossIcon />
              </IconButton>
            )}
          </div>
        ))}

        <ButtonBase
          className="btns theme-transparent px-1 mx-0 miw-0"
          onClick={() => {
            handleAddOption();
          }}
        >
          <span>
            <PlusIcon />
          </span>{' '}
          {t('add-option')}
        </ButtonBase>
      </Box>
    </>
  );
};
