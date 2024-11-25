import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { SwitchComponent } from '../../../../../../../../../components';
import {
  SharedAutocompleteControl,
  SharedColorPickerControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import {
  VisaStagePeriodTypesEnum,
  SystemActionsEnum,
  VisaDefaultStagesEnum,
} from '../../../../../../../../../enums';
import './ActiveStage.Style.scss';

export const ActiveStageSection = ({
  state,
  activeStage,
  stageItem,
  parentTranslationPath,
  translationPath,
  isLoading,
  errors,
  durationTypes,
  onDeleteStageClicked,
  onStateChanged,
  isSubmitted,
  stageReminderTypes,
  isLoadingReminderTypes,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the current active stage is default
   */
  const getIsDefaultStage = useMemo(
    () => () =>
      Object.values(VisaDefaultStagesEnum).some(
        (item) => item.key === stageItem.value,
      ),
    [stageItem.value],
  );

  return (
    <div className="active-stage-section-wrapper">
      <div className="px-3">
        <div
          className="stage-tag-wrapper mx-3 mb-3"
          style={{ backgroundColor: stageItem.stage_color }}
        >
          <span
            className="fas fa-circle"
            style={{
              color: stageItem.stage_color,
              filter: 'brightness(80%)',
            }}
          />
          <span className="px-1">
            {stageItem.title
              || `${t(`${translationPath}stage-#`)} ${activeStage + 1}`}
          </span>
        </div>
        <div className="description-text mx-3 mb-3">
          <span>
            {t(
              `${translationPath}${
                ((!stageItem.value || stageItem.value === 'custom')
                  && 'custom-stage-description')
                || 'default-stage-description'
              }`,
            )}
          </span>
        </div>
      </div>
      <div className="active-stage-body-wrapper">
        <SharedInputControl
          inlineLabel="name"
          inlineLabelIcon="fas fa-align-left"
          placeholder="name"
          errors={errors}
          stateKey="title"
          isRequired
          errorPath={`stages[${activeStage}].title`}
          parentId="stages"
          parentIndex={activeStage}
          editValue={stageItem.title}
          isDisabled={isLoading}
          // themeClass="theme-header"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isFullWidth
        />
        <div className="separator-h mb-3" />
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isWithReminderRef"
              isChecked={stageItem.has_reminder}
              label="reminder-description"
              inlineLabel="reminder"
              inlineLabelIcon="far fa-clock"
              labelPlacement="end"
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'has_reminder',
                  value: isChecked,
                });
                if (stageItem.reminder && stageItem.reminder.action_type)
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    subParentId: 'reminder',
                    id: 'action_type',
                    value: null,
                  });
                if (isChecked) {
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    subParentId: 'reminder',
                    id: 'delay',
                    value: 0,
                  });
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    subParentId: 'reminder',
                    id: 'delay_type',
                    value: VisaStagePeriodTypesEnum.Days.key,
                  });
                } else
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'reminder',
                    value: null,
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        {stageItem.has_reminder && stageItem.reminder && (
          <div className="d-flex-v-center flex-wrap">
            <span className="space-before-items"></span>
            <span className="d-inline-flex">
              <div className="d-inline-flex">
                <SharedAutocompleteControl
                  editValue={stageItem.reminder.action_type}
                  placeholder="select-reminder-type"
                  // title="condition"
                  stateKey="action_type"
                  parentId="stages"
                  parentIndex={activeStage}
                  subParentId="reminder"
                  disableClearable
                  isDisabled={isLoadingReminderTypes}
                  sharedClassesWrapper="small-control px-2"
                  errorPath={`stages[${activeStage}].reminder.action_type`}
                  onValueChanged={onStateChanged}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  isRequired
                  initValues={stageReminderTypes}
                  initValuesKey="value"
                  initValuesTitle="title"
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
              <div className="d-inline-flex">
                <SharedInputControl
                  editValue={stageItem.reminder.delay}
                  parentId="stages"
                  parentIndex={activeStage}
                  subParentId="reminder"
                  stateKey="delay"
                  isSubmitted={isSubmitted}
                  errors={errors}
                  isRequired
                  wrapperClasses="small-control px-2"
                  errorPath={`stages[${activeStage}].reminder.delay`}
                  onValueChanged={onStateChanged}
                  type="number"
                  min={0}
                  floatNumbers={0}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className="d-inline-flex">
                <SharedAutocompleteControl
                  editValue={stageItem.reminder.delay_type}
                  placeholder="select-duration"
                  // title="condition"
                  stateKey="delay_type"
                  parentId="stages"
                  parentIndex={activeStage}
                  subParentId="reminder"
                  disableClearable
                  isRequired
                  sharedClassesWrapper="small-control px-2"
                  errorPath={`stages[${activeStage}].reminder.delay_type`}
                  onValueChanged={onStateChanged}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  initValues={durationTypes}
                  initValuesTitle="value"
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
            </span>
          </div>
        )}
        <div className="separator-h mb-3" />
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isEffectCountRef"
              isChecked={stageItem.is_effective}
              isDisabled={getIsDefaultStage()}
              label="rules-description"
              inlineLabel="rules"
              labelPlacement="end"
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_effective',
                  value: isChecked,
                });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isVisibleInDashboardRef"
              isChecked={stageItem.in_dashboard}
              label="dashboard-description"
              inlineLabel="dashboard"
              labelPlacement="end"
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'in_dashboard',
                  value: isChecked,
                });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="d-flex-v-center mb-2">
          <SharedColorPickerControl
            editValue={stageItem.stage_color}
            parentId="stages"
            parentIndex={activeStage}
            inlineLabel="stage-color"
            stateKey="stage_color"
            isSubmitted={isSubmitted}
            errors={errors}
            wrapperClasses="small-control px-0"
            isRequired
            errorPath={`stages[${activeStage}].stage_color`}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="separator-h mb-3" />
        <ButtonBase
          className="btns theme-outline mx-0"
          onClick={onDeleteStageClicked(activeStage, stageItem, state.stages)}
          disabled={!stageItem.can_delete}
        >
          <span className={SystemActionsEnum.delete.icon} />
          <span className="px-2">{t(`${translationPath}delete-stage`)}</span>
        </ButtonBase>
      </div>
    </div>
  );
};

ActiveStageSection.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  activeStage: PropTypes.number.isRequired,
  stageItem: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string,
    can_delete: PropTypes.bool,
    has_reminder: PropTypes.bool,
    reminder: PropTypes.shape({
      action_type: PropTypes.string,
      delay: PropTypes.number,
      delay_type: PropTypes.oneOf(
        Object.values(VisaStagePeriodTypesEnum).map((item) => item.key),
      ),
    }),
    order: PropTypes.number,
    is_effective: PropTypes.bool,
    in_dashboard: PropTypes.bool,
    stage_color: PropTypes.string,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  durationTypes: PropTypes.instanceOf(Array).isRequired,
  stageReminderTypes: PropTypes.instanceOf(Array).isRequired,
  isLoadingReminderTypes: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onDeleteStageClicked: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ActiveStageSection.defaultProps = {
  translationPath: '',
};
