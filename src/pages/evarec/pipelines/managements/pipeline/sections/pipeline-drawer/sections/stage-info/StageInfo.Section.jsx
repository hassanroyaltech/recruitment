import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UpdateEvaRecPipelineStage } from '../../../../../../../../../services';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import * as yup from 'yup';
import '../../PipelineDrawer.Style.scss';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import ButtonBase from '@mui/material/ButtonBase';
import {
  SwitchComponent,
  TimelineComponent,
} from '../../../../../../../../../components';
import ClockIcon from '../../../../../../../../../assets/icons/clock.svg';
import ArrowDownIcon from '../../../../../../../../../assets/icons/caret_down.svg';
import {
  PipelineStageActionsTypesEnum,
  PipelineStagePeriodTypesEnum,
} from '../../../../../../../../../enums';

export const StageInfoSection = ({
  jobUUID,
  parentTranslationPath,
  translationPath,
  activePipeline,
  activeStage,
  onActivePipelineDetailsChanged,
  onActiveStageDetailsChanged,
  onOpenedDetailsSectionChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [stageActionsTypes] = useState(() =>
    Object.values(PipelineStageActionsTypesEnum),
  );
  const [durationTypes] = useState(() =>
    Object.values(PipelineStagePeriodTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const getSelectedTimeTypeValue = useMemo(
    () => (key) =>
      Object.values(PipelineStagePeriodTypesEnum).find((item) => item.key === key)
        ?.singleValue || 'N/A',
    [],
  );
  const [errors, setErrors] = useState(() => ({}));
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const changeEditValue = ({ id, value }) => {
    setEditMode((items) => ({ ...items, [id]: value }));
  };

  const doubleClickHandler = useCallback(
    (keys, activeItemJSON) => () => {
      if (keys.some((item) => !Object.hasOwn(editMode, item)))
        keys.map((key) => {
          changeEditValue({
            id: key,
            value: activeItemJSON[key] !== undefined ? activeItemJSON[key] : null,
          });
          return undefined;
        });
    },
    [editMode],
  );

  const onCloseEditModeHandler = (keys) => () => {
    setEditMode((items) => {
      keys.map((key) => {
        delete items[key];
        return undefined;
      });
      return { ...items };
    });
  };

  const submitValueHandler = useCallback(
    async ({ directSaveJson }) => {
      setIsSubmitted(true);
      if (Object.keys(errors).length > 0 && !directSaveJson) return;
      setIsLoading(true);
      const response = await UpdateEvaRecPipelineStage({
        // send body here
        job_uuid: jobUUID,
        pipeline_uuid: activePipeline.uuid,
        stage_uuid: activeStage.uuid,
        ...activeStage,
        ...editMode,
        ...(directSaveJson || {}),
      });
      setIsLoading(false);

      if (response && response.status === 202) {
        setIsSubmitted(true);
        const localStages = [...activePipeline.stages];
        const changedStageIndex = localStages.findIndex(
          (item) => item.uuid === activeStage.uuid,
        );
        if (changedStageIndex !== -1 && onActivePipelineDetailsChanged) {
          localStages[changedStageIndex] = {
            ...localStages[changedStageIndex],
            ...editMode,
            ...(directSaveJson || {}),
          };
          if (onActiveStageDetailsChanged)
            onActiveStageDetailsChanged({
              ...activeStage,
              ...editMode,
              ...(directSaveJson || {}),
            });
          if (onActivePipelineDetailsChanged)
            onActivePipelineDetailsChanged({
              ...activePipeline,
              stages: localStages,
            });
        }
        setEditMode({});
        showSuccess(t(`${translationPath}data-updated-successfully`));
      } else showError(t(`${translationPath}data-update-failed`), response);
    },
    [
      activePipeline,
      activeStage,
      editMode,
      errors,
      jobUUID,
      onActivePipelineDetailsChanged,
      onActiveStageDetailsChanged,
      t,
      translationPath,
    ],
  );

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') submitValueHandler({});
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get state errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          title: yup
            .string()
            .nullable()
            .default('-')
            .required(t('Shared:this-field-is-required')),
          description: yup
            .string()
            .nullable()
            .default('-')
            .required(t('Shared:this-field-is-required')),
          is_with_timeframe: yup
            .boolean()
            .nullable()
            .default(false)
            .required(t('Shared:this-field-is-required')),
          timeframe_duration: yup
            .number()
            .nullable()
            .default(1)
            .when(
              'is_with_timeframe',
              (value, field) =>
                (value
                  && field
                    .required(t('Shared:this-field-is-required'))
                    .min(1, `${t('Shared:this-field-must-be-more-than')} ${1}`))
                || field,
            ),
          timeframe_duration_type: yup
            .number()
            .nullable()
            .default(0)
            .when(
              'is_with_timeframe',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
        }),
      },
      editMode,
    ).then((result) => {
      setErrors(result);
    });
  }, [editMode, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors, editMode]);

  // to make sure that the edit mode is off on change the activePipeline or activeStage
  useEffect(() => {
    setEditMode({});
  }, [activePipeline, activeStage]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => onOpenedDetailsSectionChanged(null)}
          >
            <span className="fas fa-angle-double-right" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {t(`${translationPath}details`)}
          </label>
        </div>
      </div>
      <div className="details-body-wrapper">
        <div className="pipeline-side-drawer-info">
          <div className="info-cell">{t(`${translationPath}stage`)}</div>
          <div
            role="button"
            className="info-cell"
            onDoubleClick={doubleClickHandler(['title'], activeStage)}
            tabIndex={-1}
          >
            {(Object.hasOwn(editMode, 'title') && (
              <div className="d-inline-flex">
                <SharedInputControl
                  isFullWidth
                  editValue={editMode.title}
                  stateKey="title"
                  title="title"
                  errors={errors}
                  errorPath="title"
                  isSubmitted={isSubmitted}
                  isDisabled={isLoading}
                  onValueChanged={changeEditValue}
                  onKeyDown={onKeyDownHandler}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
                <ButtonBase
                  className="btns-icon theme-transparent mx-1 mt-1"
                  onClick={submitValueHandler}
                  disabled={isLoading}
                >
                  <span className="fas fa-check"></span>
                </ButtonBase>
                <ButtonBase
                  className="btns-icon theme-transparent c-danger mx-1 mt-1"
                  onClick={onCloseEditModeHandler(['title'])}
                >
                  <span className="fas fa-times"></span>
                </ButtonBase>
              </div>
            )) || <span>{activeStage.title}</span>}
          </div>
          {activeStage && activeStage.actions && activeStage.actions.length > 0 && (
            <>
              <div className="info-cell">{t(`${translationPath}actions`)}</div>
              <div className="info-cell">
                <TimelineComponent
                  data={activeStage.actions}
                  idRef="actionsLineRef"
                  wrapperClasses="actions-timeline-wrapper sm-size"
                  isWithSeparator
                  contentComponent={(item) => (
                    <div className="card-wrapper">
                      {t(`${translationPath}send`)}{' '}
                      {t(
                        `${translationPath}${
                          stageActionsTypes.find(
                            (action) => action.key === item.type,
                          )?.value
                        }`,
                      )}
                    </div>
                  )}
                />
              </div>
            </>
          )}
          <div className="info-cell" style={{ alignItems: 'center' }}>
            {t(`${translationPath}timeframe`)}
          </div>
          <div className="info-cell">
            <SwitchComponent
              isReversedLabel
              labelPlacement="end"
              isChecked={
                Object.hasOwn(editMode, 'is_with_timeframe')
                  ? editMode.is_with_timeframe
                  : activeStage.is_with_timeframe
              }
              label={
                (
                  Object.hasOwn(editMode, 'is_with_timeframe')
                    ? editMode.is_with_timeframe
                    : activeStage.is_with_timeframe
                )
                  ? t(`${translationPath}with-timeframe`)
                  : t(`${translationPath}without-timeframe`)
              }
              isDisabled={isLoading}
              onClick={doubleClickHandler(
                [
                  'timeframe_duration_type',
                  'timeframe_duration',
                  'is_with_timeframe',
                ],
                activeStage,
              )}
              onChange={(e, isChecked) => {
                changeEditValue({
                  id: 'is_with_timeframe',
                  value: isChecked,
                });
                if (!isChecked) {
                  if (
                    editMode.timeframe_duration
                    || editMode.timeframe_duration === 0
                  )
                    changeEditValue({
                      id: 'timeframe_duration',
                      value: null,
                    });
                  if (
                    editMode.timeframe_duration_type
                    || editMode.timeframe_duration_type === 0
                  )
                    changeEditValue({
                      id: 'timeframe_duration_type',
                      value: null,
                    });
                  if (activeStage.is_with_timeframe)
                    submitValueHandler({
                      directSaveJson: {
                        is_with_timeframe: isChecked,
                        timeframe_duration: null,
                        timeframe_duration_type: null,
                      },
                    });
                  else
                    onCloseEditModeHandler([
                      'is_with_timeframe',
                      'timeframe_duration_type',
                      'timeframe_duration',
                    ])();
                }
              }}
            />
          </div>

          {((activeStage && activeStage.is_with_timeframe)
            || Object.hasOwn(editMode, 'is_with_timeframe')) && (
            <>
              <div className="info-cell">{t(`${translationPath}timeframe`)}</div>
              <div className="info-cell">
                {((Object.hasOwn(editMode, 'timeframe_duration')
                  || Object.hasOwn(editMode, 'timeframe_duration_type')) && (
                  <span className="d-inline-flex px-2">
                    <div className="d-inline-flex timeframe-fields-wrapper">
                      <SharedInputControl
                        editValue={editMode.timeframe_duration}
                        wrapperClasses="small-control"
                        onValueChanged={changeEditValue}
                        stateKey="timeframe_duration"
                        type="number"
                        min={0}
                        errors={errors}
                        errorPath="timeframe_duration"
                        isSubmitted={isSubmitted}
                        floatNumbers={0}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isFullWidth
                      />
                      <SharedAutocompleteControl
                        editValue={editMode.timeframe_duration_type}
                        placeholder="select-duration"
                        disableClearable
                        errors={errors}
                        isSubmitted={isSubmitted}
                        errorPath="timeframe_duration_type"
                        onValueChanged={changeEditValue}
                        stateKey="timeframe_duration_type"
                        initValues={durationTypes}
                        initValuesTitle="value"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isFullWidth
                      />
                    </div>
                    <ButtonBase
                      className="btns-icon theme-transparent mx-1 mt-1"
                      onClick={submitValueHandler}
                      disabled={isLoading}
                    >
                      <span className="fas fa-check" />
                    </ButtonBase>
                    <ButtonBase
                      className="btns-icon theme-transparent c-danger mx-1 mt-1"
                      onClick={onCloseEditModeHandler([
                        'timeframe_duration_type',
                        'timeframe_duration',
                      ])}
                    >
                      <span className="fas fa-times" />
                    </ButtonBase>
                  </span>
                )) || (
                  <>
                    <img
                      src={ClockIcon}
                      alt={t(`${translationPath}timeframe-icon`)}
                      className="mx-2"
                      width="25"
                    />
                    <span className="d-flex-v-center">
                      <span>{activeStage.timeframe_duration}</span>
                      <span className="px-1">
                        {getSelectedTimeTypeValue(
                          activeStage.timeframe_duration_type,
                        )}
                      </span>
                      <div
                        tabIndex={-1}
                        role="button"
                        onDoubleClick={doubleClickHandler(
                          ['timeframe_duration_type', 'timeframe_duration'],
                          activeStage,
                        )}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitValueHandler({});
                        }}
                        className="pointer"
                      >
                        <img
                          src={ArrowDownIcon}
                          alt={t(`${translationPath}down-arrow`)}
                          className="mx-2"
                          width="8"
                        />
                      </div>
                    </span>
                  </>
                )}
              </div>
            </>
          )}
          <div className="info-cell" style={{ alignItems: 'center' }}>
            {t(`${translationPath}skip`)}
          </div>
          <div className="info-cell">
            <SwitchComponent
              isReversedLabel
              labelPlacement="end"
              isChecked={
                Object.hasOwn(editMode, 'is_skippable')
                  ? editMode.is_skippable
                  : activeStage.is_skippable
              }
              label={
                (
                  Object.hasOwn(editMode, 'is_skippable')
                    ? editMode.is_skippable
                    : activeStage.is_skippable
                )
                  ? t(`${translationPath}skippable`)
                  : t(`${translationPath}non-skippable`)
              }
              isDisabled={isLoading || activeStage.is_skippable_disabled}
              onChange={(e, isChecked) => {
                changeEditValue({
                  id: 'is_skippable',
                  value: isChecked,
                });
                submitValueHandler({
                  directSaveJson: {
                    is_skippable: isChecked,
                  },
                });
              }}
            />
          </div>
          <div className="info-cell" style={{ alignItems: 'center' }}>
            {t(`${translationPath}workflow`)}
          </div>
          <div className="info-cell">
            <SwitchComponent
              isReversedLabel
              labelPlacement="end"
              isChecked={activeStage.is_with_workflows}
              label="with-workflows"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isDisabled
            />
          </div>
        </div>
      </div>
    </>
  );
};

StageInfoSection.propTypes = {
  jobUUID: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.instanceOf(Array),
    stages: PropTypes.instanceOf(Array),
    team: PropTypes.instanceOf(Array),
    status: PropTypes.bool,
    language_id: PropTypes.string,
    position: PropTypes.instanceOf(Object),
    title: PropTypes.string,
    stages_count: PropTypes.number,
  }),
  activeStage: PropTypes.instanceOf(Object),
  onActivePipelineDetailsChanged: PropTypes.func,
  onActiveStageDetailsChanged: PropTypes.func,
  onOpenedDetailsSectionChanged: PropTypes.func,
};

StageInfoSection.defaultProps = {
  jobUUID: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  activePipeline: undefined,
  activeStage: undefined,
  onActivePipelineDetailsChanged: undefined,
  onActiveStageDetailsChanged: undefined,
};
