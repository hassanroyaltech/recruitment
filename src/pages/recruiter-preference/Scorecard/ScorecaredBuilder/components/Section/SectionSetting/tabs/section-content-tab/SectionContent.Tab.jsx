import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ScorecardTranslationDialog } from '../../../../TranslationDialog/ScorecardTranslationDialog';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import AddTranslationButton from '../../../../AddTranslationsButton/AddTranslationButton.Component';
import { Box, ButtonBase, FormGroup, Typography } from '@mui/material';
import { SimpleSortable } from '../../../../../../../../form-builder-v2/features/Dragndrop/SimpleSortable';
import { DraggableCardIcon } from '../../../../../../../../form-builder/icons';
import {
  ScoreCalculationTypeEnum,
  ScorecardRangesEnum,
  ScorecardStylesEnum,
} from '../../../../../../../../../enums';
import Hint from '../../../../BulbHint/Hint.Component';

export const SectionContentTab = ({
  isLoading,
  parentTranslationPath,
  translationPath,
  templateData,
  setTemplateData,
  currentSection,
  localItemsOrder,
  setLocalItemsOrder,
  handleTitleChange,
  titleValue,
  sectionSetting,
  handleSettingChange,
  calculationMethod,
  setCalculationMethod,
  // ratingSections
  handleGlobalSettingChange,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenTranslation, setIsOpenTranslation] = useState(false);
  const [scoreRanges] = useState(Object.values(ScorecardRangesEnum));
  const [scoreStyles] = useState(Object.values(ScorecardStylesEnum));
  const handleTranslate = (translations) => {
    setIsOpenTranslation(false);
    handleTitleChange({ val: translations.title });
  };

  return (
    <div className="scorecard-tab-wrapper">
      <div className="general-tab-wrapper section-setting-scroll">
        <div className="d-flex-v-center-h-end mt-2 mb-0">
          <AddTranslationButton
            onClick={() => {
              setIsOpenTranslation(true);
            }}
          />
        </div>
        <span className="px-2 fz-12px c-black-light-color">
          {t('section-title')}
        </span>
        <SharedInputControl
          isFullWidth
          stateKey="title"
          searchKey="search"
          innerInputWrapperClasses="border-0"
          placeholder="untitled-scorecard"
          wrapperClasses="mb-0 px-2 mx-0 w-100"
          textFieldWrapperClasses={'w-100'}
          fieldClasses="input-font-weight-700 "
          onValueChanged={(newValue) =>
            handleTitleChange({
              val: newValue.value,
              lang: 'en',
            })
          }
          parentTranslationPath={parentTranslationPath}
          editValue={titleValue?.en || ''}
        />
        <div className="d-block mb-2  separator-sidebar-scorecard"></div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span className="px-2 fz-12px c-black ">{t('section-blocks')}</span>
          <Box sx={{ mb: 2, px: 3 }}>
            {!currentSection.blocks.length && (
              <Typography sx={{ mt: 2, color: 'dark.$40' }}>
                {t('add-blocks-to-control-them')}
              </Typography>
            )}
            <SimpleSortable
              data={localItemsOrder || []}
              setDataOrder={(newOrder) => {
                setLocalItemsOrder(newOrder);
              }}
              element={({ id, title, activeId, listeners }) => (
                <FormGroup
                  id={id}
                  sx={{
                    py: 3,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <Typography sx={{ color: 'dark.main', m: 0 }}>
                    {title?.en}
                  </Typography>

                  <DraggableCardIcon
                    {...listeners}
                    sx={{ ml: 'auto', cursor: activeId ? 'grabbing' : 'grab' }}
                  />
                </FormGroup>
              )}
            />
          </Box>
        </Box>
        <div className="d-block mb-2  separator-sidebar-scorecard"></div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span className="px-2 fz-12px c-black ">{t('field-settings')}</span>
          <Box sx={{ mb: 2, px: 3 }}>
            <div className="d-flex-v-center-h-between mb-2 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('score-range')}
              </Typography>
              <SharedAutocompleteControl
                isFullWidth
                disableClearable
                placeholder="select-range"
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'score',
                    id: 'score_range',
                  })
                }
                stateKey="score_range"
                sharedClassesWrapper="mb-0"
                initValues={scoreRanges}
                editValue={sectionSetting?.score?.score_range}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                initValuesKey="key"
                getOptionLabel={(option) => t(option.label)}
              />
            </div>
            <div className="d-flex-v-center-h-between mb-1 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('style')}
              </Typography>
              <SharedAutocompleteControl
                isFullWidth
                disableClearable
                placeholder="select-style"
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'score',
                    id: 'score_style',
                  })
                }
                stateKey="score_style"
                sharedClassesWrapper="mb-0"
                initValues={scoreStyles}
                editValue={sectionSetting?.score?.score_style}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                initValuesKey="key"
                getOptionLabel={(option) => t(option.label)}
              />
            </div>
          </Box>
          <span className="px-2 fz-12px c-black ">{t('range-tips')}</span>
          <Box sx={{ mb: 2, px: 3 }}>
            <div className="d-flex-v-center-h-between mb-2 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('min-label')}
              </Typography>
              <SharedInputControl
                wrapperClasses="m-0"
                isFullWidth
                stateKey="min"
                placeholder="min-label"
                editValue={sectionSetting?.range_labels?.min}
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'range_labels',
                    id: 'min',
                  })
                }
                parentTranslationPath={parentTranslationPath}
                type="text"
              />
            </div>
            {sectionSetting?.score?.score_range
              === ScorecardRangesEnum.zeroTen.key && (
              <div className="d-flex-v-center-h-between mb-2 w-100 ">
                <Typography
                  className="d-inline-flex"
                  sx={{ width: '150px', color: 'dark.$40' }}
                >
                  {t('med-label')}
                </Typography>
                <SharedInputControl
                  wrapperClasses="m-0"
                  isFullWidth
                  stateKey="med"
                  placeholder="med-label"
                  editValue={sectionSetting?.range_labels?.med}
                  onValueChanged={(newValue) =>
                    handleSettingChange({
                      val: newValue.value,
                      parent: 'range_labels',
                      id: 'med',
                    })
                  }
                  parentTranslationPath={parentTranslationPath}
                  type="text"
                />
              </div>
            )}
            <div className="d-flex-v-center-h-between mb-2 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('max-label')}
              </Typography>
              <SharedInputControl
                wrapperClasses="m-0"
                isFullWidth
                stateKey="max"
                placeholder="max-label"
                editValue={sectionSetting?.range_labels?.max}
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'range_labels',
                    id: 'max',
                  })
                }
                parentTranslationPath={parentTranslationPath}
                type="text"
              />
            </div>
          </Box>
          <div className="d-block mb-2  separator-sidebar-scorecard"></div>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span className="px-2 fz-12px c-black ">{t('weight-scoring')}</span>
            <Box className="d-flex" sx={{ mb: 2, px: 3 }}>
              <Typography
                className="d-inline-flex"
                sx={{ pt: 2, color: 'dark.$40' }}
              >
                {t('weight-scoring-section-msg')}
              </Typography>
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  handleGlobalSettingChange({
                    val:
                      calculationMethod === ScoreCalculationTypeEnum.weight.key
                        ? ScoreCalculationTypeEnum.default.key
                        : ScoreCalculationTypeEnum.weight.key,

                    id: 'score_calculation_method',
                  });
                  // setCalculationMethod(
                  //   calculationMethod === ScoreCalculationTypeEnum.weight.key
                  //     ? ScoreCalculationTypeEnum.default.key
                  //     : ScoreCalculationTypeEnum.weight.key
                  // );
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    calculationMethod === ScoreCalculationTypeEnum.weight.key
                      ? 'on c-black'
                      : 'off'
                  }`}
                />
              </ButtonBase>
            </Box>
            <div className="px-2">
              <Hint title={t('changes-you-apply-msg')} />
            </div>
          </Box>
        </Box>
      </div>
      {isOpenTranslation && (
        <ScorecardTranslationDialog
          activeItem={{
            title: titleValue,
          }}
          isOpen={isOpenTranslation || false}
          onSave={handleTranslate}
          handleCloseDialog={() => {
            setIsOpenTranslation(false);
          }}
          titleText="section-title-translation"
          parentTranslationPath={parentTranslationPath}
          requiredKey="title"
        />
      )}
    </div>
  );
};

SectionContentTab.propTypes = {
  isLoading: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
