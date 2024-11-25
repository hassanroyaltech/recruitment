import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import formStyleImage from '../../../assets/formStyleImage.png';
import defaultScoring from '../../../assets/defaultScoring.png';
import weightScoring from '../../../assets/weightScoring.png';
import {
  ScoreCalculationTypeEnum,
  ScorecardRangesEnum,
  ScorecardStylesEnum,
} from '../../../../../../../enums';
import { ButtonBase, Typography } from '@mui/material';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { WeightManagementTab } from '../../../components/Section/SectionSetting/tabs/manage-weight-tab/WeightManagement.Tab';
import Hint from '../../../components/BulbHint/Hint.Component';
import { GetAllSetupsTaskStatuses } from '../../../../../../../services';
import i18next from 'i18next';

export const SettingsTab = ({
  parentTranslationPath,
  templateData,
  headerHeight,
  ratingSections,
  handleSettingChange,
  handleWeightChange,
  handleTemplateGeneral,
  isSubmitted,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [scoreRanges] = useState(Object.values(ScorecardRangesEnum));
  const [scoreStyles] = useState(Object.values(ScorecardStylesEnum));
  console.log(
    isSubmitted
      && !templateData?.task_status_uuid && {
      task_status_uuid: t('please-select-task-status'),
    },
  );
  return (
    <div
      className="scorecard-tab-wrapper"
      style={{
        height: `calc(100vh - ${headerHeight + 35}px)`,
        overflow: 'auto',
      }}
    >
      <div className="general-tab-wrapper">
        <div className="d-inline-flex-v-center">
          <ButtonBase
            className="btns btns-icon theme-transparent mx-0"
            onClick={() => {
              handleTemplateGeneral({
                val: !templateData?.status,
                name: 'status',
              });
            }}
          >
            <span
              className={`fas fa-toggle-${
                templateData?.status ? 'on c-black' : 'off'
              }`}
            />
          </ButtonBase>
          <span className="c-ui-dark-primary-100 px-1 font-weight-500">
            {t(templateData?.status ? 'active' : 'inactive')}
          </span>
        </div>
        <div className="d-flex mb-2">
          <span className="fz-22px font-weight-700 c-ui-dark-primary-100">
            {t('assign-settings')}
          </span>
        </div>
        <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-60 ">
          <div className="d-inline-flex-v-center">
            <Typography className="d-inline-flex  " sx={{ color: 'dark.$40' }}>
              {t('minimum-assign-number')}
            </Typography>
            <SharedInputControl
              wrapperClasses="m-0"
              isQuarterWidth
              stateKey="min_committee_member"
              placeholder="min-number"
              editValue={templateData?.card_setting?.min_committee_members}
              onValueChanged={(newValue) =>
                handleSettingChange({
                  val: newValue.value || 1,
                  id: 'min_committee_members',
                })
              }
              parentTranslationPath={parentTranslationPath}
              type="number"
              min={1}
            />
          </div>
        </div>
        <div className="d-block my-3  separator-scorecard"></div>
        <div className="d-flex mb-2">
          <span className="fz-22px font-weight-700 c-ui-dark-primary-100">
            {t('task-settings')}
          </span>
        </div>
        <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-60 ">
          <div className="d-inline-flex-v-center">
            <Typography className="d-inline-flex  " sx={{ color: 'dark.$40' }}>
              {t('task-status')}
            </Typography>
            <SharedAPIAutocompleteControl
              searchKey="search"
              stateKey="status"
              isRequired={true}
              isSubmitted={isSubmitted}
              placeholder="select-status"
              getDataAPI={GetAllSetupsTaskStatuses}
              editValue={templateData.task_status_uuid || ''}
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || ''))
                || ''
              }
              onValueChanged={(newValue) =>
                handleTemplateGeneral({
                  val: newValue.value,
                  name: 'task_status_uuid',
                })
              }
              controlWrapperClasses="mb-0 my-2"
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                ...(templateData?.task_status_uuid && {
                  with_than: [templateData?.task_status_uuid],
                }),
                status: true,
              }}
              inputClasses="small-size"
              errors={
                isSubmitted
                && !templateData?.task_status_uuid && {
                  task_status_uuid: {
                    error: true,
                    message: t('please-select-task-status'),
                  },
                }
              }
              errorPath={'task_status_uuid'}
            />
          </div>
        </div>
        <div className="d-block mb-3 mt-2 separator-scorecard"></div>
        <div className="d-flex mb-2">
          <span className="fz-22px font-weight-700 c-ui-dark-primary-100">
            {t('range-settings')}
          </span>
        </div>

        <div className="d-flex-h-between scorecard-appearance-section">
          <div className="scorecard-labels-desc">
            <span className="d-block font-weight-500 mb-2 fz-14px c-ui-dark-primary-100">
              {t('style-your-form')}
            </span>
            <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('score-range')}
              </Typography>
              <SharedAutocompleteControl
                isFullWidth
                placeholder="select-range"
                stateKey="score_range"
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'score',
                    id: 'score_range',
                  })
                }
                sharedClassesWrapper="mb-0"
                initValues={scoreRanges}
                editValue={templateData?.card_setting?.score?.score_range}
                parentTranslationPath={parentTranslationPath}
                initValuesKey="key"
                getOptionLabel={(option) => t(option.label)}
              />
            </div>
            <div className="d-flex-v-center-h-between score-sm-wrap mb-1 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('style')}
              </Typography>
              <SharedAutocompleteControl
                isFullWidth
                placeholder="select-style"
                stateKey="score_style"
                onValueChanged={(newValue) =>
                  handleSettingChange({
                    val: newValue.value,
                    parent: 'score',
                    id: 'score_style',
                  })
                }
                sharedClassesWrapper="mb-0"
                initValues={scoreStyles}
                editValue={templateData?.card_setting?.score?.score_style}
                parentTranslationPath={parentTranslationPath}
                initValuesKey="key"
                getOptionLabel={(option) => t(option.label)}
              />
            </div>
            <span className="d-block font-weight-500 mb-2 fz-14px c-ui-dark-primary-100">
              {t('range-tips')}
            </span>
            <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-100 ">
              <Typography
                className="d-inline-flex  "
                sx={{ width: '150px', color: 'dark.$40' }}
              >
                {t('min-label')}
              </Typography>
              <SharedInputControl
                wrapperClasses="m-0"
                isFullWidth
                stateKey="range_labels"
                placeholder="min-label"
                editValue={templateData?.card_setting?.range_labels?.min}
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
            {templateData?.card_setting?.score?.score_range
              === ScorecardRangesEnum.zeroTen.key && (
              <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-100 ">
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
                  editValue={templateData?.card_setting?.range_labels?.med}
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
            <div className="d-flex-v-center-h-between score-sm-wrap mb-2 w-100 ">
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
                editValue={templateData?.card_setting?.range_labels?.max}
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
          </div>
          <div>
            <img alt="Form style" src={formStyleImage} />
          </div>
        </div>
        <div className="d-block my-3  separator-scorecard"></div>
        <div className="d-flex mb-2">
          <span className="fz-22px font-weight-700 c-ui-dark-primary-100">
            {t('score-calculation')}
          </span>
        </div>
        <div className="d-flex-h-between scorecard-appearance-section col-gap-35">
          <div className="scorecard-labels-desc">
            <span className="d-block font-weight-500 mb-2 fz-14px c-ui-dark-primary-100">
              {t('default-scoring')}
            </span>
            <span className="d-block font-weight-400 fz-14px c-neutral-scale-3">
              {t('default-scoring-msg')}
            </span>
            <div className="d-inline-flex-v-center">
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  handleSettingChange({
                    val:
                      templateData?.card_setting?.score_calculation_method
                      === ScoreCalculationTypeEnum.weight.key
                        ? ScoreCalculationTypeEnum.default.key
                        : ScoreCalculationTypeEnum.weight.key,

                    id: 'score_calculation_method',
                  });
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    templateData?.card_setting?.score_calculation_method
                    === ScoreCalculationTypeEnum.default.key
                      ? 'on c-black'
                      : 'off'
                  }`}
                />
              </ButtonBase>
              <span className="c-ui-dark-primary-100 px-1 font-weight-500">
                {templateData?.card_setting?.score_calculation_method
                === ScoreCalculationTypeEnum.default.key
                  ? t('on')
                  : t('off')}
              </span>
            </div>
          </div>
          <div>
            <img alt="Default scoring" src={defaultScoring} />
          </div>
        </div>
        <div className="d-block my-3  separator-scorecard"></div>
        <div className="d-flex-h-between scorecard-appearance-section col-gap-35">
          <div className="scorecard-labels-desc">
            <span className="d-block font-weight-500 mb-2 fz-14px c-ui-dark-primary-100">
              {t('weight-scoring')}
            </span>
            <span className="d-block font-weight-400 fz-14px c-neutral-scale-3">
              {t('weight-scoring-msg')}
            </span>
            <div className="d-inline-flex-v-center">
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  handleSettingChange({
                    val:
                      templateData?.card_setting?.score_calculation_method
                      === ScoreCalculationTypeEnum.weight.key
                        ? ScoreCalculationTypeEnum.default.key
                        : ScoreCalculationTypeEnum.weight.key,

                    id: 'score_calculation_method',
                  });
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    templateData?.card_setting?.score_calculation_method
                    === ScoreCalculationTypeEnum.weight.key
                      ? 'on c-black'
                      : 'off'
                  }`}
                />
              </ButtonBase>
              <span className="c-ui-dark-primary-100 px-1 font-weight-500">
                {templateData?.card_setting?.score_calculation_method
                === ScoreCalculationTypeEnum.weight.key
                  ? t('on')
                  : t('off')}
              </span>
            </div>
            {templateData?.card_setting?.score_calculation_method
              === ScoreCalculationTypeEnum.weight.key && (
              <WeightManagementTab
                parentTranslationPath={parentTranslationPath}
                ratingSections={ratingSections}
                handleWeightChange={handleWeightChange}
              />
            )}
          </div>
          <div>
            <img alt="Weight scoring" src={weightScoring} />
            {templateData?.card_setting?.score_calculation_method
              === ScoreCalculationTypeEnum.weight.key
              && ratingSections.length > 0 && (
              <div className={'my-2 py-2 hint-weight'}>
                <Hint
                  borderRadius="4px"
                  title={t('please-enter-correct-weights')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SettingsTab.propTypes = {
  templateData: PropTypes.instanceOf(Object),
  handleChangeSubmitStyle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
