import React, { useState } from 'react';

import { Box, Typography } from '@mui/material';
import '../../Section/SectionSetting/SectionSetting.Style.scss';
import { useTranslation } from 'react-i18next';
import { SharedInputControl } from '../../../../../../setups/shared';

import AddTranslationButton from '../../AddTranslationsButton/AddTranslationButton.Component';
import { ScorecardTranslationDialog } from '../../TranslationDialog/ScorecardTranslationDialog';

export const DesicionSetting = ({
  currentBlock,
  setCurrentBlock,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenTranslation, setIsOpenTranslation] = useState(false);

  const handleChange = ({ id, lang, val }) => {
    setCurrentBlock((items) => ({
      ...items,
      decision: {
        ...items.decision,
        [id]: {
          ...items.decision?.[id],
          [lang]: val,
        },
      },
    }));
  };
  const handleTranslate = (translations) => {
    setIsOpenTranslation(false);
    setCurrentBlock((items) => ({
      ...items,
      decision: {
        ...items.decision,
        ...translations,
      },
    }));
  };
  return (
    <>
      <div className="d-block my-2  separator-sidebar-scorecard"></div>
      <div className="d-flex-v-center-h-between mb-2">
        <span className="px-2 fz-12px c-black ">{t('decision-buttons')}</span>
        <div className="d-inline-flex px-2">
          <AddTranslationButton
            onClick={() => {
              setIsOpenTranslation(true);
            }}
          />
        </div>
      </div>
      <Box sx={{ mb: 2, px: 3 }}>
        <div className="d-flex-v-center-h-between mb-2 w-100 ">
          <Typography
            className="d-inline-flex  "
            sx={{ width: '150px', color: 'dark.$40' }}
          >
            {t('accept-label')}
          </Typography>
          <SharedInputControl
            wrapperClasses="m-0"
            isFullWidth
            stateKey="accept"
            placeholder="Accept label"
            editValue={currentBlock?.decision?.accept?.en}
            onValueChanged={(newValue) =>
              handleChange({
                val: newValue.value,
                lang: 'en',
                id: 'accept',
              })
            }
            parentTranslationPath={parentTranslationPath}
            type="text"
          />
        </div>
        <div className="d-flex-v-center-h-between mb-2 w-100 ">
          <Typography
            className="d-inline-flex  "
            sx={{ width: '150px', color: 'dark.$40' }}
          >
            {t('reject-label')}
          </Typography>
          <SharedInputControl
            wrapperClasses="m-0"
            isFullWidth
            stateKey="reject"
            placeholder="Accept label"
            editValue={currentBlock?.decision?.reject?.en}
            onValueChanged={(newValue) =>
              handleChange({
                val: newValue.value,
                lang: 'en',
                id: 'reject',
              })
            }
            parentTranslationPath={parentTranslationPath}
            type="text"
          />
        </div>
      </Box>
      {isOpenTranslation && (
        <ScorecardTranslationDialog
          activeItem={{
            accept: currentBlock?.decision?.accept || {},
            reject: currentBlock?.decision?.reject || {},
          }}
          isOpen={isOpenTranslation || false}
          onSave={handleTranslate}
          handleCloseDialog={() => {
            setIsOpenTranslation(false);
          }}
          titleText="decision-buttons-translation"
          parentTranslationPath={parentTranslationPath}
          requiredKey="accept"
          additionalKey="reject"
        />
      )}
    </>
  );
};
