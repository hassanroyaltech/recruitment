import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../../../setups/shared';
import {
  GetAllBuilderTemplates,
  GetAllFormsTypes,
  GetAllSetupsJobTargetTypes,
  GetBuilderFormTypes,
} from '../../../../../../../../../../../services';
import {
  DefaultFormsTypesEnum,
  DynamicFormTypesEnum,
  OffersStatusesEnum,
  PipelineStagePreconditionTypesEnum,
  ScorecardPreconditionTypesEnum,
  SystemActionsEnum,
} from '../../../../../../../../../../../enums';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export const StagePreconditionSection = ({
  elementIndex,
  index,
  element,
  elements,
  isLoading,
  isSubmitted,
  errors,
  stagePreconditionTypes,
  getActiveStagePreconditionTypeByKey,
  budgetedJobTypes,
  onStateChanged,
  onRemoveItemClicked,
  stages,
  currentStageUUID,
  getAllSavedStages,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [scorecardPreconditionTypesEnum] = useState(
    Object.values(ScorecardPreconditionTypesEnum).map((item) => ({
      ...item,
      label: t(item.value),
    })),
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change for precondition type
   */
  const onPreconditionTypeChanged = useCallback(
    (oldValue) => (newValue) => {
      onStateChanged({
        ...newValue,
        id: 'template_uuid',
        value: [],
      });

      if (oldValue) {
        if (getActiveStagePreconditionTypeByKey(oldValue).isWithTemplateStatus)
          onStateChanged({
            ...newValue,
            id: 'template_status',
            value: null,
          });
        if (getActiveStagePreconditionTypeByKey(oldValue).templateTypesVersion)
          onStateChanged({
            ...newValue,
            id: 'template_type',
            value: [],
          });
      }

      onStateChanged({
        ...newValue,
        id: 'template_status',
        value: null,
      });
      if (newValue.value === PipelineStagePreconditionTypesEnum.FinalElimination.key)
        onStateChanged({
          ...newValue,
          id: 'final_elimination',
          value: [
            {
              uuid: null,
              number: null,
            },
          ],
        });
      else if (oldValue === PipelineStagePreconditionTypesEnum.FinalElimination.key)
        onStateChanged({
          ...newValue,
          id: 'final_elimination',
          value: null,
        });
      else if (oldValue === PipelineStagePreconditionTypesEnum.Scorecard.key)
        onStateChanged({
          ...newValue,
          id: 'scorecard_status',
          value: null,
        });
      onStateChanged(newValue);
    },
    [getActiveStagePreconditionTypeByKey, onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the return for the available precondition types
   */
  const getAvailablePreconditionTypes = useMemo(
    () => (currentType) =>
      stagePreconditionTypes.filter(
        (item) =>
          (currentType && item.key === currentType)
          || !elements.some((localElement) => localElement.type === item.key),
      ),
    [elements, stagePreconditionTypes],
  );

  const onFinialEliminationAddOrRemove = useCallback(
    (newValue, currentElimination) => () => {
      const localEliminations = [...currentElimination];
      if (Object.hasOwn(newValue, 'spliceIndex')) {
        localEliminations.splice(newValue.spliceIndex, 1);
        onStateChanged({ ...newValue, value: localEliminations });
      } else {
        localEliminations.push({
          uuid: null,
          number: null,
        });
        onStateChanged({ ...newValue, value: localEliminations });
      }
    },
    [onStateChanged],
  );

  return (
    <div className="stage-precondition-section-wrapper section-wrapper">
      <div className="stage-precondition-count-wrapper">{elementIndex + 1}</div>
      <div className="stage-precondition-body-wrapper">
        <div className="precondition-row-wrapper">
          <div className="d-flex-v-start flex-wrap">
            {stagePreconditionTypes.length > 1 && (
              <SharedAutocompleteControl
                isQuarterWidth
                inlineLabel="type"
                errors={errors}
                stateKey="type"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                placeholder="select-precondition-type"
                editValue={element.type}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={onPreconditionTypeChanged(element.type)}
                initValues={getAvailablePreconditionTypes(element.type)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].type`}
                getOptionLabel={(option) => option.value}
              />
            )}
            {element.type
              && getActiveStagePreconditionTypeByKey(element.type)
                .templateTypesVersion && (
              <SharedAPIAutocompleteControl
                isHalfWidth={stagePreconditionTypes.length <= 1}
                isQuarterWidth={stagePreconditionTypes.length > 1}
                inlineLabel="template-type"
                placeholder="select-template-type"
                errors={errors}
                stateKey="template_type"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                editValue={element.template_type[0]}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={(newValue) => {
                  if (element.template_uuid && element.template_uuid.length > 0)
                    onStateChanged({
                      ...newValue,
                      id: 'template_uuid',
                      value: [],
                    });
                  onStateChanged({
                    ...newValue,
                    value: (newValue.value && [newValue.value]) || [],
                  });
                }}
                translationPath={translationPath}
                getDataAPI={
                  getActiveStagePreconditionTypeByKey(element.type)
                    .templateTypesVersion === 'v2'
                    ? GetBuilderFormTypes
                    : GetAllFormsTypes
                }
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].template_type`}
                getOptionLabel={(option) => option.name || 'N/A'}
                filterOptions={(options) =>
                  options.filter(
                    (item) => item.code !== DefaultFormsTypesEnum.Flows.key,
                  )
                }
                type={DynamicFormTypesEnum.select.key}
                extraProps={{
                  // isFormBuilderV1:
                  //     !getActiveStagePreconditionTypeByKey(element.type)
                  //       .templateTypesVersion
                  //     || getActiveStagePreconditionTypeByKey(element.type)
                  //       .templateTypesVersion === 'v1',
                  ...(element.template_type && {
                    with_than: element.template_type,
                  }),
                }}
              />
            )}
            {element.type
              && (getActiveStagePreconditionTypeByKey(element.type).templateType
                || (element.template_type && element.template_type.length > 0)) && (
              <SharedAPIAutocompleteControl
                isHalfWidth={stagePreconditionTypes.length <= 1}
                isQuarterWidth={stagePreconditionTypes.length > 1}
                inlineLabel="templates"
                placeholder="select-templates"
                errors={errors}
                stateKey="template_uuid"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                editValue={element.template_uuid}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={onStateChanged}
                translationPath={translationPath}
                getDataAPI={GetAllBuilderTemplates}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].template_uuid`}
                getOptionLabel={(option) => option.title || 'N/A'}
                type={DynamicFormTypesEnum.array.key}
                extraProps={{
                  form_type_uuid:
                      element.template_type && element.template_type[0],
                  code:
                      getActiveStagePreconditionTypeByKey(element.type)
                        .templateType || undefined,
                  with_than: element.template_uuid,
                }}
              />
            )}
            {element.type
              && getActiveStagePreconditionTypeByKey(element.type)
                .isWithTemplateStatus && (
              <SharedAutocompleteControl
                isHalfWidth={stagePreconditionTypes.length <= 1}
                isQuarterWidth={stagePreconditionTypes.length > 1}
                inlineLabel={
                  getActiveStagePreconditionTypeByKey(element.type)
                    .inlineStatusLabel
                }
                errors={errors}
                stateKey="template_status"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                placeholder={
                  getActiveStagePreconditionTypeByKey(element.type)
                    .statusPlaceholder
                }
                editValue={element.template_status}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                type={DynamicFormTypesEnum.array.key}
                onValueChanged={onStateChanged}
                initValues={
                  getActiveStagePreconditionTypeByKey(element.type).statuses
                }
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].template_status`}
                getOptionLabel={(option) =>
                  t(`${translationPath}${option.status}`) || 'N/A'
                }
              />
            )}
            {element.type === PipelineStagePreconditionTypesEnum.JobTargets.key && (
              <SharedAPIAutocompleteControl
                isHalfWidth
                inlineLabel="job-targets"
                placeholder="select-job-targets"
                errors={errors}
                stateKey="job_target"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                editValue={element.job_target}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={onStateChanged}
                translationPath={translationPath}
                getDataAPI={GetAllSetupsJobTargetTypes}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].job_target`}
                getOptionLabel={(option) =>
                  `${
                    option.name && (option.name[i18next.language] || option.name.en)
                  }` || 'N/A'
                }
                type={DynamicFormTypesEnum.array.key}
                extraProps={{
                  ...(element.job_target && {
                    with_than: element.job_target,
                  }),
                }}
              />
            )}
            {element.type === PipelineStagePreconditionTypesEnum.JobTypes.key && (
              <SharedAutocompleteControl
                isHalfWidth
                inlineLabel="job-types"
                placeholder="select-job-types"
                errors={errors}
                stateKey="budgeted_type"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                editValue={element.budgeted_type}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                type={DynamicFormTypesEnum.array.key}
                onValueChanged={onStateChanged}
                initValues={budgetedJobTypes}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].budgeted_type`}
                getOptionLabel={(option) => option.value || 'N/A'}
              />
            )}
            {element.type
              === PipelineStagePreconditionTypesEnum.FinalElimination.key && (
              <div className="precondition-final-elimination-wrapper">
                {element.final_elimination
                  && element.final_elimination.map((item, eliminationIndex, items) => (
                    <div
                      key={`finalEliminationKeys${index}-${elementIndex}-${
                        eliminationIndex + 1
                      }`}
                      className="precondition-final-elimination-item"
                    >
                      <div className="precondition-final-elimination-content">
                        <div className="precondition-final-elimination-controls">
                          <SharedAutocompleteControl
                            isHalfWidth
                            labelValue="stage"
                            errors={errors}
                            stateKey="uuid"
                            parentId="stages"
                            searchKey="search"
                            parentIndex={index}
                            subParentId="precondition"
                            subParentIndex={elementIndex}
                            subSubParentId="final_elimination"
                            subSubParentIndex={eliminationIndex}
                            placeholder="select-stage"
                            editValue={item.uuid}
                            isDisabled={isLoading}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            initValues={getAllSavedStages(
                              currentStageUUID,
                              stages.filter(
                                (stageItem) =>
                                  !items.some(
                                    (eliminationItem) =>
                                      stageItem.uuid
                                      && stageItem.uuid === eliminationItem.uuid
                                      && stageItem.uuid !== item.uuid,
                                  ),
                              ),
                            )}
                            translationPath={translationPath}
                            parentTranslationPath={parentTranslationPath}
                            errorPath={`stages[${index}].precondition[${elementIndex}].final_elimination[${eliminationIndex}].uuid`}
                            initValuesKey="uuid"
                            initValuesTitle="title"
                            getOptionLabel={(option) => option.title || 'N/A'}
                          />
                          <SharedInputControl
                            editValue={item.number}
                            isHalfWidth
                            labelValue="candidates-number"
                            placeholder="candidates-number"
                            stateKey="number"
                            parentId="stages"
                            parentIndex={index}
                            subParentId="precondition"
                            subParentIndex={elementIndex}
                            subSubParentId="final_elimination"
                            subSubParentIndex={eliminationIndex}
                            isSubmitted={isSubmitted}
                            errors={errors}
                            errorPath={`stages[${index}].precondition[${elementIndex}].final_elimination[${eliminationIndex}].number`}
                            onValueChanged={onStateChanged}
                            type="number"
                            min={0}
                            floatNumbers={0}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                        </div>
                        {items.length > 1 && (
                          <ButtonBase
                            className="btns-icon theme-transparent c-warning-hover mt-3 mx-2"
                            onClick={onFinialEliminationAddOrRemove(
                              {
                                parentId: 'stages',
                                parentIndex: index,
                                subParentId: 'precondition',
                                subParentIndex: elementIndex,
                                spliceIndex: eliminationIndex,
                                id: 'final_elimination',
                              },
                              items,
                            )}
                          >
                            <span className={SystemActionsEnum.delete.icon} />
                          </ButtonBase>
                        )}
                      </div>

                      {index < items.length - 1 && (
                        <div className="separator-h mb-3" />
                      )}
                    </div>
                  ))}
                <ButtonBase
                  className="btns theme-transparent mx-2 mb-3"
                  onClick={onFinialEliminationAddOrRemove(
                    {
                      parentId: 'stages',
                      parentIndex: index,
                      subParentId: 'precondition',
                      subParentIndex: elementIndex,
                      id: 'final_elimination',
                    },
                    element.final_elimination,
                  )}
                >
                  <span className={SystemActionsEnum.add.icon} />
                  <span className="px-1">
                    {t(`${translationPath}add-more-stages`)}
                  </span>
                </ButtonBase>
              </div>
            )}
            {element.type
              === PipelineStagePreconditionTypesEnum.Recommendation.key && (
              <div className="precondition-recommendation-wrapper">
                <SharedAutocompleteControl
                  isFullWidth
                  inlineLabel="recommendation"
                  placeholder="select-if-recommended"
                  errors={errors}
                  stateKey="recommendation"
                  parentId="stages"
                  searchKey="search"
                  parentIndex={index}
                  subParentId="precondition"
                  subParentIndex={elementIndex}
                  editValue={
                    element.recommendation === 1 || element.recommendation === true
                      ? 1
                      : element.recommendation === 2
                        || element.recommendation === false
                        ? 2
                        : undefined
                  }
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  type={DynamicFormTypesEnum.select.key}
                  onValueChanged={(e) =>
                    onStateChanged({
                      ...e,
                      value:
                        e.value === 1 || e.value === true
                          ? true
                          : e.value === 2 || e.value === false
                            ? false
                            : undefined,
                    })
                  }
                  initValues={[
                    {
                      key: 1,
                      label: t('recommended'),
                    },
                    {
                      key: 2,
                      label: t('not-recommended'),
                    },
                  ]}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`stages[${index}].precondition[${elementIndex}].recommendation`}
                  initValuesKey="key"
                  initValuesTitle="label"
                />
              </div>
            )}
            {element.type === PipelineStagePreconditionTypesEnum.Scorecard.key && (
              <SharedAutocompleteControl
                isHalfWidth
                inlineLabel="scorecard-status"
                placeholder="select-scorecard-status"
                errors={errors}
                stateKey="scorecard_status"
                parentId="stages"
                searchKey="search"
                parentIndex={index}
                subParentId="precondition"
                subParentIndex={elementIndex}
                editValue={element.scorecard_status}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                type={DynamicFormTypesEnum.select.key}
                onValueChanged={onStateChanged}
                initValues={scorecardPreconditionTypesEnum}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                errorPath={`stages[${index}].precondition[${elementIndex}].scorecard_status`}
                initValuesKey="key"
                initValuesTitle="label"
              />
            )}
          </div>
          <ButtonBase
            className="btns-icon theme-transparent c-warning-hover mt-1 mx-2"
            onClick={onRemoveItemClicked({
              parentIndex: index,
              elementIndex,
              key: 'precondition',
              items: elements,
            })}
          >
            <span className={SystemActionsEnum.delete.icon} />
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

StagePreconditionSection.propTypes = {
  elementIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  element: PropTypes.shape({
    type: PropTypes.oneOf(
      Object.values(PipelineStagePreconditionTypesEnum).map((item) => item.key),
    ),
    scorecard_status: PropTypes.oneOf(
      Object.values(ScorecardPreconditionTypesEnum).map((item) => item.key),
    ),
    template_type: PropTypes.arrayOf(PropTypes.string),
    template_uuid: PropTypes.arrayOf(PropTypes.string),
    template_status: PropTypes.arrayOf(
      PropTypes.oneOf(Object.values(OffersStatusesEnum).map((item) => item.key)),
    ),
    recommendation: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    job_target: PropTypes.arrayOf(PropTypes.string),
    budgeted_type: PropTypes.arrayOf(PropTypes.string),
    final_elimination: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string,
        number: PropTypes.number,
      }),
    ),
  }).isRequired,
  elements: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  stagePreconditionTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string,
    }),
  ).isRequired,
  budgetedJobTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string,
    }),
  ).isRequired,
  stages: PropTypes.instanceOf(Array).isRequired,
  currentStageUUID: PropTypes.string,
  getAllSavedStages: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getActiveStagePreconditionTypeByKey: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  addItemHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

StagePreconditionSection.defaultProps = {
  currentStageUUID: undefined,
};
