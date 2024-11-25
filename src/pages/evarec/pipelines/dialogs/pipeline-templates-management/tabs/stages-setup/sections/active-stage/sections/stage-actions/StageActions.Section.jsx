import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedTextEditorControl,
  SharedUploaderControl,
} from '../../../../../../../../../../setups/shared';
import {
  GetAllPipelineAssessments,
  GetAllPipelineEmailTemplates,
  GetPipelineAssessmentById,
  GetPipelineQuestionnaireById,
} from '../../../../../../../../../../../services';
import {
  PipelineRulesTypesEnum,
  PipelineStageActionsTypesEnum,
  SystemActionsEnum,
  UploaderPageEnum,
} from '../../../../../../../../../../../enums';
import { CollapseComponent } from '../../../../../../../../../../../components';
import { showError } from '../../../../../../../../../../../helpers';

export const StageActionsSection = ({
  // pipeline_uuid,
  elementIndex,
  index,
  element,
  elements,
  isLoading,
  isSubmitted,
  errors,
  stageActionsTypes,
  onStateChanged,
  onEmailAnnotationChanged,
  onRemoveItemClicked,
  // isOpenChanged,
  collapseToggleHandler,
  openActionCollapseIndex,
  durationTypes,
  addItemHandler,
  emailAnnotations,
  pipelineQuestionnaires,
  actionsRulesTypes,
  language_id,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const isBackToMe = useMemo(
    () =>
      ({ order, currentTypeIndex, localElements }) => {
        if (!order && order !== 0) return false;
        return localElements[order].rules.some(
          (rule) =>
            rule.type === PipelineRulesTypesEnum.Action.key
            && (rule.order === currentTypeIndex
              || isBackToMe({
                order: rule.order,
                currentTypeIndex,
                localElements,
              })),
        );
      },
    [],
  );
  /**
   * @param ruleIndex - number of rule index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is a callback method to return the available unselected actions (By order)
   * or the current rule (selected) action
   */
  const getAvailableActions = useMemo(
    () =>
      (ruleIndex, ruleItem, targetType = undefined) =>
        elements.reduce((total, item, index) => {
          if (
            index !== elementIndex
            && item.type
            && ((!targetType && item.type === ruleItem.previous_action_type)
              || (targetType && item.type === targetType))
            && (((ruleItem.order || ruleItem.order === 0)
              && index === ruleItem.order)
              || !elements.some((action, actionIndex) =>
                action.rules.some(
                  (rule) =>
                    actionIndex === index
                    && (rule.order === elementIndex
                      || isBackToMe({
                        order: rule.order,
                        currentTypeIndex: elementIndex,
                        localElements: elements,
                      })),
                ),
              ))
          )
            total.push({
              key: index,
              value: `${t(`${translationPath}action`)} #${index + 1}`,
            });
          return total;
        }, []),
    [elementIndex, elements, isBackToMe, t, translationPath],
  );

  const getAvailableRuleTypes = useMemo(
    () => () =>
      actionsRulesTypes.filter(
        (item) =>
          item.key !== PipelineRulesTypesEnum.Action.key
          || elements.filter((action) => action.type).length > 1,
      ),
    [actionsRulesTypes, elements],
  );

  const getAvailableActionTypes = useMemo(
    () => (ruleIndex, ruleItem) =>
      stageActionsTypes.filter(
        (item) => getAvailableActions(ruleIndex, ruleItem, item.key).length > 0,
      ),
    [getAvailableActions, stageActionsTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change for action type
   */
  const onActionTypeChanged = useCallback(
    (allActions, actionIndex, action) => (newValue) => {
      // if (newValue.value === PipelineStageActionsTypesEnum.VideoAssessment.key)
      //   onStateChanged({
      //     parentId: 'stages',
      //     parentIndex: index,
      //     subParentId: 'actions',
      //     subParentIndex: elementIndex,
      //     id: 'rules',
      //     value: [
      //       {
      //         type: PipelineRulesTypesEnum.Time.key, // this is the type of the rule type 1=> for after time, 2=> for after action
      //         previous_action_type: null,
      //         order: null,
      //         delay_duration: 0, // just a number from 1 to unknown (time as number)
      //         delay_duration_type: PipelineStagePeriodTypesEnum.Hours.key, // 1=> hours, 2=> days, 3=> weeks (if there is timeframe)
      //       },
      //     ],
      //   });

      if (
        element.rules
        && element.rules.length
        && newValue.value !== PipelineStageActionsTypesEnum.VideoAssessment.key
      )
        onStateChanged({
          parentId: 'stages',
          parentIndex: index,
          subParentId: 'actions',
          subParentIndex: elementIndex,
          id: 'rules',
          value: [],
        });
      if (allActions.length > 1) {
        let localElements = [...allActions];
        let isChangedElements = false;
        localElements = localElements.map((action) => {
          if (action.rules)
            action.rules.map((rule) => {
              if (rule.order === actionIndex) {
                isChangedElements = true;
                rule.order = null;
              }
              return rule;
            });

          return action;
        });
        if (isChangedElements)
          onStateChanged({
            parentId: newValue.parentId,
            parentIndex: newValue.parentIndex,
            id: 'actions',
            value: localElements,
          });
        // clear the rule that select a type no longer can be selected
        if (
          localElements.filter(
            (item, index) => index !== actionIndex && item.type === action.type,
          ).length > 1
        ) {
          isChangedElements = false;
          localElements.map((item, index) => {
            if (index !== actionIndex)
              item.rules.map((ruleItem, ruleIndex) => {
                if (ruleItem.previous_action_type === action.type) {
                  isChangedElements = true;
                  localElements[index].rules[ruleIndex].previous_action_type = null;
                }
                return undefined;
              });
            return undefined;
          });
          if (isChangedElements)
            onStateChanged({
              parentId: newValue.parentId,
              parentIndex: newValue.parentIndex,
              id: 'actions',
              value: localElements,
            });
        }
      }
      // clear the effected fields on action level on changing the type
      if (element.email_subject)
        onStateChanged({ ...newValue, id: 'email_subject', value: null });
      if (element.email_body)
        onStateChanged({ ...newValue, id: 'email_body', value: '' });
      if (element.attachments)
        onStateChanged({ ...newValue, id: 'attachments', value: [] });
      if (element.attachmentsFullFiles)
        onStateChanged({ ...newValue, id: 'attachmentsFullFiles', value: [] });
      if (element.relation_uuid)
        onStateChanged({ ...newValue, id: 'relation_uuid', value: null });
      onStateChanged(newValue);
    },
    [
      onStateChanged,
      index,
      elementIndex,
      element.rules,
      element.email_subject,
      element.email_body,
      element.attachments,
      element.attachmentsFullFiles,
      element.relation_uuid,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description callback method to return the dropdown API passed on the action type
   */
  const getTemplateAPIByType = useMemo(
    () => () => {
      if (element.type === PipelineStageActionsTypesEnum.VideoAssessment.key)
        return {
          getDataAPI: GetAllPipelineAssessments,
          getItemByIdAPI: GetPipelineAssessmentById,
          uniqueKey: 'uuid',
          dataKey: undefined,
        };
      return {
        getDataAPI: GetAllPipelineEmailTemplates,
        getItemByIdAPI: undefined,
        uniqueKey: 'id',
        dataKey: 'data',
      };
    },
    [element.type],
  );

  /**
   * @param key - the state of the changed dropdown key
   * @param ruleItem - the changed rule item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of the main rules dropdowns
   */
  const onRulesChanged = useCallback(
    (key, ruleItem) => (newValue) => {
      if (key === 'type' || key === 'previous_action_type') {
        if (key === 'type' && ruleItem.previous_action_type)
          onStateChanged({
            ...newValue,
            id: 'previous_action_type',
            value: null,
          });

        if (ruleItem.order || ruleItem.order === 0)
          onStateChanged({
            ...newValue,
            id: 'order',
            value: null,
          });

        if (ruleItem.delay_duration || ruleItem.delay_duration === 0)
          onStateChanged({
            ...newValue,
            id: 'delay_duration',
            value: null,
          });

        if (ruleItem.delay_duration_type || ruleItem.delay_duration_type === 0)
          onStateChanged({
            ...newValue,
            id: 'delay_duration_type',
            value: null,
          });
      }
      onStateChanged(newValue);
    },
    [onStateChanged],
  );

  const onFromTemplateChanged = useCallback(
    async (newValue) => {
      if (element.type !== PipelineStageActionsTypesEnum.Email.key) {
        onStateChanged(newValue);
        if (newValue.value)
          if (element.type === PipelineStageActionsTypesEnum.VideoAssessment.key) {
            const response = await GetPipelineAssessmentById({
              uuid: newValue.value,
            });
            if (response && response.status === 202) {
              const {
                data: { results },
              } = response;
              onStateChanged({
                ...newValue,
                id: 'email_body',
                value: results.email_body,
              });
              onStateChanged({
                ...newValue,
                id: 'email_subject',
                value: results.email_subject,
              });
              onStateChanged({
                ...newValue,
                id: 'attachments',
                value: (results.attachment || []).map((item) => item.original.uuid),
              });
              onStateChanged({
                ...newValue,
                id: 'attachmentsFullFiles',
                value: (results.attachment || []).map((item) => item.original),
              });
            } else showError(t('Shared:failed-to-get-saved-data'), response);
          } else {
            const response = await GetPipelineQuestionnaireById({
              uuid: newValue.value,
            });
            if (response && response.status === 200) {
              const {
                data: { results },
              } = response;
              onStateChanged({
                ...newValue,
                id: 'email_body',
                value: results.email_body,
              });
              onStateChanged({
                ...newValue,
                id: 'email_subject',
                value: results.email_subject,
              });
              onStateChanged({
                ...newValue,
                id: 'attachments',
                value: (results.attachment || []).map((item) => item.original.uuid),
              });
              onStateChanged({
                ...newValue,
                id: 'attachmentsFullFiles',
                value: (results.attachment || []).map((item) => item.original),
              });
            } else showError(t('Shared:failed-to-get-saved-data'), response);
          }

        return;
      }
      if (newValue && newValue.value) {
        onStateChanged({
          ...newValue,
          id: 'attachments',
          value: (newValue.value.attachment || []).map((item) => item.original.uuid),
        });
        onStateChanged({
          ...newValue,
          id: 'attachmentsFullFiles',
          value: (newValue.value.attachment || []).map((item) => item.original),
        });
        const currentLanguageTranslation
          = newValue.value.translation?.find(
            (item) => item.language.id === language_id,
          ) || newValue.value.translation?.[0];
        if (currentLanguageTranslation) {
          onStateChanged({
            ...newValue,
            id: 'email_subject',
            value: currentLanguageTranslation.subject,
          });
          onStateChanged({
            ...newValue,
            id: 'email_body',
            value: currentLanguageTranslation.body,
          });
        }
      }
      onStateChanged({
        ...newValue,
        value: (newValue.value && newValue.value.id) || null,
      });
    },
    [element.type, onStateChanged, t, language_id],
  );

  const onUploadChanged = useCallback(
    (newValue) => {
      onStateChanged({
        ...newValue,
        value: newValue.value.map((item) => item.uuid),
      });
      onStateChanged({
        ...newValue,
        id: 'attachmentsFullFiles',
        value: newValue.value,
      });
    },
    [onStateChanged],
  );

  return (
    <div className="stage-actions-section-wrapper section-wrapper">
      <div className="stage-action-count-wrapper">{elementIndex + 1}</div>
      <div className="stage-action-body-wrapper">
        <div className="action-row-wrapper">
          <div className="d-flex-v-start flex-wrap">
            <SharedAutocompleteControl
              isQuarterWidth
              // title="action-type"
              inlineLabel="send"
              errors={errors}
              stateKey="type"
              parentId="stages"
              searchKey="search"
              parentIndex={index}
              subParentId="actions"
              subParentIndex={elementIndex}
              placeholder="select-action-type"
              editValue={element.type}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={onActionTypeChanged(elements, elementIndex, element)}
              initValues={stageActionsTypes}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              errorPath={`stages[${index}].actions[${elementIndex}].type`}
              getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
            />
            {element.type && (
              <>
                {(element.type
                  === PipelineStageActionsTypesEnum.Questionnaire.key && (
                  <SharedAutocompleteControl
                    isQuarterWidth
                    inlineLabel="from-template"
                    placeholder="select-action"
                    errors={errors}
                    stateKey="relation_uuid"
                    parentId="stages"
                    parentIndex={index}
                    subParentId="actions"
                    subParentIndex={elementIndex}
                    editValue={element.relation_uuid}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    onValueChanged={onFromTemplateChanged}
                    translationPath={translationPath}
                    initValues={pipelineQuestionnaires}
                    initValuesTitle="title"
                    initValuesKey="uuid"
                    parentTranslationPath={parentTranslationPath}
                    errorPath={`stages[${index}].actions[${elementIndex}].relation_uuid`}
                    getFooterComponent={() => (
                      <ButtonBase
                        className="btns theme-transparent mx-0 mb-2"
                        onClick={onRemoveItemClicked({
                          parentIndex: index,
                          elementIndex,
                          key: 'actions',
                          items: elements,
                        })}
                      >
                        <span className={SystemActionsEnum.delete.icon} />
                        <span className="px-2">
                          {t(`${translationPath}remove-action`)}
                        </span>
                      </ButtonBase>
                    )}
                    isPopoverTheme
                    getOptionLabel={(option) => option.title}
                  />
                )) || (
                  <SharedAPIAutocompleteControl
                    isQuarterWidth
                    title="action"
                    inlineLabel="from-template"
                    placeholder="select-action"
                    errors={errors}
                    stateKey="relation_uuid"
                    parentId="stages"
                    searchKey="search"
                    parentIndex={index}
                    subParentId="actions"
                    subParentIndex={elementIndex}
                    editValue={element.relation_uuid}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    onValueChanged={onFromTemplateChanged}
                    translationPath={translationPath}
                    isEntireObject={
                      element.type === PipelineStageActionsTypesEnum.Email.key
                    }
                    getDataAPI={getTemplateAPIByType().getDataAPI}
                    getItemByIdAPI={getTemplateAPIByType().getItemByIdAPI}
                    uniqueKey={getTemplateAPIByType().uniqueKey}
                    dataKey={getTemplateAPIByType().dataKey}
                    parentTranslationPath={parentTranslationPath}
                    errorPath={`stages[${index}].actions[${elementIndex}].relation_uuid`}
                    getOptionLabel={(option) => option.title}
                    isPopoverTheme
                    getFooterComponent={() => (
                      <ButtonBase
                        className="btns theme-transparent mx-0 mb-2"
                        onClick={onRemoveItemClicked({
                          parentIndex: index,
                          elementIndex,
                          key: 'actions',
                          items: elements,
                        })}
                      >
                        <span className={SystemActionsEnum.delete.icon} />
                        <span className="px-2">
                          {t(`${translationPath}remove-action`)}
                        </span>
                      </ButtonBase>
                    )}
                    extraProps={{
                      ...(element.relation_uuid && {
                        with_than: [element.relation_uuid],
                      }),
                    }}
                  />
                )}
                <ButtonBase
                  className={`btns theme-outline collapse-btn mb-3${
                    (openActionCollapseIndex === elementIndex && ' is-active') || ''
                  }`}
                  onClick={collapseToggleHandler('action', elementIndex)}
                >
                  <span>{t(`${translationPath}view-edit`)}</span>
                  <span
                    className={`px-2 fas fa-chevron-${
                      (openActionCollapseIndex === elementIndex && 'up') || 'down'
                    }`}
                  />
                </ButtonBase>
              </>
            )}
          </div>
          <ButtonBase
            className="btns-icon theme-transparent c-warning-hover mt-1 mx-2"
            onClick={onRemoveItemClicked({
              parentIndex: index,
              elementIndex,
              key: 'actions',
              items: elements,
            })}
          >
            <span className={SystemActionsEnum.delete.icon} />
          </ButtonBase>
        </div>
        {/*{element.type === PipelineStageActionsTypesEnum.VideoAssessment.key && (*/}
        {/*  <div className="action-row-wrapper fj-start">*/}
        {/*    <SharedInputControl*/}
        {/*      editValue={element.available_for_duration}*/}
        {/*      inlineLabel="available-for"*/}
        {/*      placeholder="duration"*/}
        {/*      parentId="stages"*/}
        {/*      subParentId="actions"*/}
        {/*      subParentIndex={elementIndex}*/}
        {/*      parentIndex={index}*/}
        {/*      stateKey="available_for_duration"*/}
        {/*      isSubmitted={isSubmitted}*/}
        {/*      errors={errors}*/}
        {/*      wrapperClasses="small-control px-2"*/}
        {/*      errorPath={`stages[${index}].actions[${elementIndex}].available_for_duration`}*/}
        {/*      onValueChanged={onStateChanged}*/}
        {/*      type="number"*/}
        {/*      min={0}*/}
        {/*      floatNumbers={0}*/}
        {/*      parentTranslationPath={parentTranslationPath}*/}
        {/*      translationPath={translationPath}*/}
        {/*    />*/}
        {/*    <SharedAutocompleteControl*/}
        {/*      editValue={element.available_for_duration_type}*/}
        {/*      placeholder="select-duration-type"*/}
        {/*      // title="condition"*/}
        {/*      stateKey="available_for_duration_type"*/}
        {/*      parentId="stages"*/}
        {/*      parentIndex={index}*/}
        {/*      subParentId="actions"*/}
        {/*      subParentIndex={elementIndex}*/}
        {/*      disableClearable*/}
        {/*      sharedClassesWrapper="small-control px-2"*/}
        {/*      errorPath={`stages[${index}].actions[${elementIndex}].available_for_duration_type`}*/}
        {/*      onValueChanged={onStateChanged}*/}
        {/*      isSubmitted={isSubmitted}*/}
        {/*      errors={errors}*/}
        {/*      initValues={durationTypes}*/}
        {/*      initValuesTitle="value"*/}
        {/*      parentTranslationPath={parentTranslationPath}*/}
        {/*      translationPath={translationPath}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*)}*/}
        <CollapseComponent
          isOpen={Boolean(element.type && openActionCollapseIndex === elementIndex)}
          wrapperClasses="w-100"
          component={
            <div>
              <div className="separator-h" />
              <div className="d-flex-v-center-h-end p-2">
                <ButtonBase
                  className="btns theme-transparent mx-0"
                  onClick={collapseToggleHandler('action', null)}
                >
                  <span>{t(`${translationPath}close-editor`)}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              </div>
              <div className="separator-h mb-3" />
              <div className="editor-body-wrapper">
                <SharedInputControl
                  isHalfWidth
                  title="email-subject"
                  errors={errors}
                  stateKey="email_subject"
                  parentId="stages"
                  searchKey="search"
                  parentIndex={index}
                  subParentId="actions"
                  subParentIndex={elementIndex}
                  errorPath={`stages[${index}].actions[${elementIndex}].email_subject`}
                  editValue={element.email_subject}
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  isRequired
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                />
                <SharedAutocompleteControl
                  isHalfWidth
                  title="email-annotations"
                  placeholder="select-email-annotations"
                  errors={errors}
                  stateKey="email_annotations"
                  parentId="stages"
                  parentIndex={index}
                  subParentId="actions"
                  subParentIndex={elementIndex}
                  editValue={element.email_annotations}
                  isDisabled={isLoading}
                  isStringArray
                  isSubmitted={isSubmitted}
                  onValueChanged={onEmailAnnotationChanged(
                    index,
                    elementIndex,
                    element,
                  )}
                  translationPath={translationPath}
                  initValues={emailAnnotations}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`stages[${index}].actions[${elementIndex}].email_annotations`}
                  getOptionLabel={(option) => option}
                />
                <div className="px-2">
                  <SharedTextEditorControl
                    isFullWidth
                    labelValue="email-body"
                    placeholder="enter-email-body"
                    errors={errors}
                    stateKey="email_body"
                    isRequired
                    parentId="stages"
                    parentIndex={index}
                    subParentId="actions"
                    subParentIndex={elementIndex}
                    editValue={element.email_body}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    errorPath={`stages[${index}].actions[${elementIndex}].email_body`}
                  />
                </div>
                <SharedUploaderControl
                  isFullWidth
                  errors={errors}
                  uploaderPage={UploaderPageEnum.ATSAttachment}
                  stateKey="attachments"
                  parentId="stages"
                  parentIndex={index}
                  subParentId="actions"
                  subParentIndex={elementIndex}
                  errorPath={`stages[${index}].actions[${elementIndex}].attachments`}
                  fileTypeText="files"
                  isDisabled={isLoading}
                  editValue={element.attachmentsFullFiles}
                  isSubmitted={isSubmitted}
                  onValueChanged={onUploadChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
              <div className="separator-h mb-3" />
            </div>
          }
        />
        {element.rules
          && element.rules.map((ruleItem, ruleIndex) => (
            <div
              className="action-row-wrapper"
              key={`ruleKey${index + 1}-${elementIndex + 1}-${ruleIndex + 1}`}
            >
              <div className="d-flex-v-start flex-wrap">
                <SharedAutocompleteControl
                  isQuarterWidth
                  // title="action-type"
                  inlineLabel="after"
                  errors={errors}
                  stateKey="type"
                  parentId="stages"
                  searchKey="search"
                  parentIndex={index}
                  subParentId="actions"
                  subParentIndex={elementIndex}
                  subSubParentId="rules"
                  subSubParentIndex={ruleIndex}
                  placeholder="select-rule-type"
                  editValue={ruleItem.type}
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  onValueChanged={onRulesChanged('type', ruleItem)}
                  initValues={getAvailableRuleTypes()}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`stages[${index}].actions[${elementIndex}].rules[${ruleIndex}].type`}
                  getOptionLabel={(option) => option.title}
                />
                <div className="d-flex flex-wrap">
                  {ruleItem.type === PipelineRulesTypesEnum.Action.key && (
                    <>
                      <SharedAutocompleteControl
                        isQuarterWidth
                        inlineLabel="specify-action"
                        errors={errors}
                        stateKey="previous_action_type"
                        parentId="stages"
                        searchKey="search"
                        parentIndex={index}
                        subParentId="actions"
                        subParentIndex={elementIndex}
                        subSubParentId="rules"
                        subSubParentIndex={ruleIndex}
                        placeholder="select-action-type"
                        editValue={ruleItem.previous_action_type}
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        onValueChanged={onRulesChanged(
                          'previous_action_type',
                          ruleItem,
                        )}
                        initValues={getAvailableActionTypes(ruleIndex, ruleItem)}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        errorPath={`stages[${index}].actions[${elementIndex}].rules[${ruleIndex}].previous_action_type`}
                        getOptionLabel={(option) =>
                          t(`${translationPath}${option.title}`)
                        }
                      />
                      <SharedAutocompleteControl
                        isQuarterWidth
                        // title="action-type"
                        // inlineLabel="after"
                        errors={errors}
                        stateKey="order"
                        parentId="stages"
                        searchKey="search"
                        parentIndex={index}
                        subParentId="actions"
                        subParentIndex={elementIndex}
                        subSubParentId="rules"
                        subSubParentIndex={ruleIndex}
                        placeholder="select-action"
                        editValue={ruleItem.order}
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        onValueChanged={onStateChanged}
                        initValues={getAvailableActions(ruleIndex, ruleItem)}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        errorPath={`stages[${index}].actions[${elementIndex}].rules[${ruleIndex}].order`}
                        getOptionLabel={(option) => option.title}
                      />
                    </>
                  )}
                  {ruleItem.type
                    && (ruleItem.type !== PipelineRulesTypesEnum.Action.key
                      || ruleItem.previous_action_type) && (
                    <>
                      {/*<div className="durations-field-wrapper">*/}
                      <SharedInputControl
                        isQuarterWidth
                        editValue={ruleItem.delay_duration}
                        inlineLabel="specify-time"
                        placeholder="duration"
                        parentId="stages"
                        subParentId="actions"
                        subParentIndex={elementIndex}
                        subSubParentId="rules"
                        subSubParentIndex={ruleIndex}
                        parentIndex={index}
                        stateKey="delay_duration"
                        isSubmitted={isSubmitted}
                        errors={errors}
                        // wrapperClasses="small-control px-2"
                        errorPath={`stages[${index}].actions[${elementIndex}].rules[${ruleIndex}].delay_duration`}
                        onValueChanged={onStateChanged}
                        type="number"
                        min={0}
                        floatNumbers={0}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                      <SharedAutocompleteControl
                        isQuarterWidth
                        editValue={ruleItem.delay_duration_type}
                        placeholder="select-duration-type"
                        stateKey="delay_duration_type"
                        parentId="stages"
                        parentIndex={index}
                        subParentId="actions"
                        subParentIndex={elementIndex}
                        subSubParentId="rules"
                        subSubParentIndex={ruleIndex}
                        disableClearable
                        // sharedClassesWrapper="small-control px-2"
                        errorPath={`stages[${index}].actions[${elementIndex}].rules[${ruleIndex}].delay_duration_type`}
                        onValueChanged={onStateChanged}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        initValues={durationTypes}
                        initValuesTitle="value"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                      {/*</div>*/}
                    </>
                  )}
                </div>
              </div>
              <ButtonBase
                className="btns-icon theme-transparent c-warning-hover mt-1 mx-2"
                disabled={isLoading}
                onClick={onRemoveItemClicked({
                  parentIndex: index,
                  subParentId: 'actions',
                  subParentIndex: elementIndex,
                  elementIndex: ruleIndex,
                  key: 'rules',
                  items: element.rules,
                })}
              >
                <span className={SystemActionsEnum.delete.icon} />
              </ButtonBase>
            </div>
          ))}
        {element.rules.length === 0 && element.type && (
          <ButtonBase
            className="btns theme-transparent mx-3 mb-3"
            onClick={addItemHandler({
              parentIndex: index,
              subParentId: 'actions',
              subParentIndex: elementIndex,
              key: 'rules',
              items: element.rules,
            })}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-rule`)}</span>
          </ButtonBase>
        )}
      </div>
    </div>
  );
};

StageActionsSection.propTypes = {
  // pipeline_uuid: PropTypes.string.isRequired,
  elementIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  collapseToggleHandler: PropTypes.func.isRequired,
  openActionCollapseIndex: PropTypes.number,
  element: PropTypes.shape({
    type: PropTypes.oneOf(
      Object.values(PipelineStageActionsTypesEnum).map((item) => item.key),
    ),
    relation_uuid: PropTypes.string,
    // available_for_duration: PropTypes.number,
    // available_for_duration_type: PropTypes.number,
    email_subject: PropTypes.string,
    email_annotations: PropTypes.string,
    email_body: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.string),
    attachmentsFullFiles: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
    rules: PropTypes.instanceOf(Array),
  }).isRequired,
  elements: PropTypes.instanceOf(Array).isRequired,
  durationTypes: PropTypes.instanceOf(Array).isRequired,
  actionsRulesTypes: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  stageActionsTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.string,
    }),
  ).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  onEmailAnnotationChanged: PropTypes.func.isRequired,
  // isOpenChanged: PropTypes.func.isRequired,
  addItemHandler: PropTypes.func.isRequired,
  emailAnnotations: PropTypes.arrayOf(PropTypes.string).isRequired,
  pipelineQuestionnaires: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  language_id: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

StageActionsSection.defaultProps = {
  openActionCollapseIndex: null,
  language_id: null,
};
