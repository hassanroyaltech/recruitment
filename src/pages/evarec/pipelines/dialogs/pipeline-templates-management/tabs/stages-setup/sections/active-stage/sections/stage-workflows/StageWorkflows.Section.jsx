import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../../../setups/shared';
import {
  GetAllSetupsWorkflowsTemplates,
  GetSetupsWorkflowTemplateById,
} from '../../../../../../../../../../../services';
import { SystemActionsEnum } from '../../../../../../../../../../../enums';

export const StageWorkflowsSection = ({
  pipeline_uuid,
  elementIndex,
  index,
  element,
  elements,
  isLoading,
  isLoadingWorkflowTypes,
  isSubmitted,
  errors,
  stageWorkflowsTypes,
  onStateChanged,
  onRemoveItemClicked,
  durationTypes,
  addItemHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change for workflow type
   */
  const onWorkflowTypeChanged = useCallback(
    (newValue) => {
      onStateChanged({
        parentId: 'stages',
        parentIndex: index,
        subParentId: 'workflows',
        subParentIndex: elementIndex,
        id: 'template_uuid',
        value: null,
      });
      if (element.rules && element.rules.length)
        onStateChanged({
          parentId: 'stages',
          parentIndex: index,
          subParentId: 'workflows',
          subParentIndex: elementIndex,
          id: 'rules',
          value: [],
        });
      onStateChanged(newValue);
    },
    [element.rules, elementIndex, index, onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change for workflow type for rules
   */
  const onRuleWorkflowTypeChanged = useCallback(
    (ruleIndex) => (newValue) => {
      onStateChanged({
        parentId: 'stages',
        parentIndex: index,
        subParentId: 'workflows',
        subParentIndex: elementIndex,
        subSubParentId: 'rules',
        subSubParentIndex: ruleIndex,
        id: 'template_uuid',
        value: null,
      });
      onStateChanged(newValue);
    },
    [elementIndex, index, onStateChanged],
  );

  return (
    <div className="stage-workflows-section-wrapper section-wrapper">
      <div className="stage-workflows-count-wrapper">{elementIndex + 1}</div>
      <div className="stage-workflows-body-wrapper">
        <div className="workflows-row-wrapper">
          <div className="d-flex-v-start flex-wrap">
            <SharedAutocompleteControl
              isHalfWidth
              // title="action-type"
              inlineLabel="send"
              errors={errors}
              stateKey="transaction_key"
              parentId="stages"
              searchKey="search"
              parentIndex={index}
              subParentId="workflows"
              subParentIndex={elementIndex}
              placeholder="select-workflow-type"
              editValue={element.transaction_key}
              isDisabled={isLoading || isLoadingWorkflowTypes}
              isSubmitted={isSubmitted}
              onValueChanged={onWorkflowTypeChanged}
              initValues={stageWorkflowsTypes}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              errorPath={`stages[${index}].workflows[${elementIndex}].transaction_key`}
              initValuesTitle="title"
              getOptionLabel={(option) =>
                (option.title
                  && (option.title[i18next.language] || option.title.en))
                || 'N/A'
              }
            />
            {element.transaction_key && (
              <>
                <SharedAPIAutocompleteControl
                  isHalfWidth
                  title="template"
                  inlineLabel="from-template"
                  placeholder="select-template"
                  errors={errors}
                  stateKey="template_uuid"
                  parentId="stages"
                  searchKey="search"
                  parentIndex={index}
                  subParentId="workflows"
                  subParentIndex={elementIndex}
                  editValue={element.template_uuid}
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  translationPath={translationPath}
                  getDataAPI={GetAllSetupsWorkflowsTemplates}
                  getItemByIdAPI={GetSetupsWorkflowTemplateById}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`stages[${index}].workflows[${elementIndex}].template_uuid`}
                  getOptionLabel={(option) =>
                    (option.title
                      && (option.title[i18next.language] || option.title.en))
                    || 'N/A'
                  }
                  isPopoverTheme
                  getFooterComponent={() => (
                    <ButtonBase
                      className="btns theme-transparent mx-0 mb-2"
                      onClick={onRemoveItemClicked({
                        parentIndex: index,
                        elementIndex,
                        key: 'workflows',
                        items: elements,
                      })}
                    >
                      <span className={SystemActionsEnum.delete.icon} />
                      <span className="px-2">
                        {t(`${translationPath}remove-workflow`)}
                      </span>
                    </ButtonBase>
                  )}
                  extraProps={{
                    pipeline_uuid,
                    type: element.transaction_key,
                    ...(element.template_uuid && {
                      with_than: [element.template_uuid],
                    }),
                  }}
                />
              </>
            )}
          </div>
          <ButtonBase
            className="btns-icon theme-transparent c-warning-hover mt-1 mx-2"
            onClick={onRemoveItemClicked({
              parentIndex: index,
              elementIndex,
              key: 'workflows',
              items: elements,
            })}
          >
            <span className={SystemActionsEnum.delete.icon} />
          </ButtonBase>
        </div>
        {elements.length > 1
          && element.rules
          && element.rules.map((ruleItem, ruleIndex) => (
            <div
              className="workflows-row-wrapper"
              key={`workflowsRuleKey${index + 1}-${elementIndex + 1}-${
                ruleIndex + 1
              }`}
            >
              <div className="d-flex-v-start flex-wrap">
                <SharedAutocompleteControl
                  isHalfWidth
                  // title="action-type"
                  inlineLabel="after"
                  errors={errors}
                  stateKey="transaction_key"
                  parentId="stages"
                  searchKey="search"
                  parentIndex={index}
                  subParentId="workflows"
                  subParentIndex={elementIndex}
                  subSubParentId="rules"
                  subSubParentIndex={ruleIndex}
                  placeholder="select-workflow-type"
                  editValue={ruleItem.transaction_key}
                  isDisabled={isLoading || isLoadingWorkflowTypes}
                  isSubmitted={isSubmitted}
                  onValueChanged={onRuleWorkflowTypeChanged(ruleIndex)}
                  initValues={stageWorkflowsTypes}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  errorPath={`stages[${index}].workflows[${elementIndex}].rules[${ruleIndex}].transaction_key`}
                  initValuesTitle="title"
                  getOptionLabel={(option) =>
                    (option.title
                      && (option.title[i18next.language] || option.title.en))
                    || 'N/A'
                  }
                />
                {ruleItem.transaction_key && (
                  <>
                    <SharedAPIAutocompleteControl
                      isHalfWidth
                      title="template"
                      inlineLabel="from-template"
                      placeholder="select-template"
                      errors={errors}
                      stateKey="template_uuid"
                      parentId="stages"
                      searchKey="search"
                      parentIndex={index}
                      subParentId="workflows"
                      subParentIndex={elementIndex}
                      subSubParentId="rules"
                      subSubParentIndex={ruleIndex}
                      editValue={ruleItem.template_uuid}
                      isDisabled={isLoading}
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      translationPath={translationPath}
                      getDataAPI={GetAllSetupsWorkflowsTemplates}
                      getItemByIdAPI={GetSetupsWorkflowTemplateById}
                      parentTranslationPath={parentTranslationPath}
                      errorPath={`stages[${index}].workflows[${elementIndex}].rules[${ruleIndex}].template_uuid`}
                      getOptionLabel={(option) =>
                        (option.title
                          && (option.title[i18next.language] || option.title.en))
                        || 'N/A'
                      }
                      isPopoverTheme
                      getFooterComponent={() => (
                        <ButtonBase
                          className="btns theme-transparent mx-0 mb-2"
                          onClick={onRemoveItemClicked({
                            parentIndex: index,
                            elementIndex,
                            key: 'workflows',
                            items: elements,
                          })}
                        >
                          <span className={SystemActionsEnum.delete.icon} />
                          <span className="px-2">
                            {t(`${translationPath}remove-workflow`)}
                          </span>
                        </ButtonBase>
                      )}
                      extraProps={{
                        pipeline_uuid,
                        type: ruleItem.transaction_key,
                        ...(ruleItem.template_uuid && {
                          with_than: [ruleItem.template_uuid],
                        }),
                      }}
                    />
                  </>
                )}
                {ruleItem.template_uuid && (
                  <>
                    <SharedInputControl
                      editValue={ruleItem.delay_duration}
                      inlineLabel="with-delay"
                      placeholder="duration"
                      parentId="stages"
                      subParentId="workflows"
                      subParentIndex={elementIndex}
                      subSubParentId="rules"
                      subSubParentIndex={ruleIndex}
                      parentIndex={index}
                      stateKey="delay_duration"
                      isSubmitted={isSubmitted}
                      errors={errors}
                      wrapperClasses="small-control px-2"
                      errorPath={`stages[${index}].workflows[${elementIndex}].rules[${ruleIndex}].delay_duration`}
                      onValueChanged={onStateChanged}
                      type="number"
                      min={0}
                      floatNumbers={0}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                    <SharedAutocompleteControl
                      editValue={ruleItem.delay_duration_type}
                      placeholder="select-duration-type"
                      stateKey="delay_duration_type"
                      parentId="stages"
                      parentIndex={index}
                      subParentId="workflows"
                      subParentIndex={elementIndex}
                      subSubParentId="rules"
                      subSubParentIndex={ruleIndex}
                      disableClearable
                      sharedClassesWrapper="small-control px-2"
                      errorPath={`stages[${index}].workflows[${elementIndex}].rules[${ruleIndex}].delay_duration_type`}
                      onValueChanged={onStateChanged}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      initValues={durationTypes}
                      initValuesTitle="value"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </>
                )}
              </div>
              <ButtonBase
                className="btns-icon theme-transparent c-warning-hover mt-1 mx-2"
                onClick={onRemoveItemClicked({
                  parentIndex: index,
                  subParentId: 'workflows',
                  subParentIndex: elementIndex,
                  elementIndex,
                  key: 'rules',
                  items: element.rules,
                })}
              >
                <span className={SystemActionsEnum.delete.icon} />
              </ButtonBase>
            </div>
          ))}
        {element.template_uuid && elements.length > 1 && (
          <ButtonBase
            className="btns theme-transparent mx-3 mb-3"
            onClick={addItemHandler({
              parentIndex: index,
              subParentId: 'workflows',
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

StageWorkflowsSection.propTypes = {
  pipeline_uuid: PropTypes.string.isRequired,
  elementIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  element: PropTypes.shape({
    transaction_key: PropTypes.number,
    template_uuid: PropTypes.string,
    rules: PropTypes.instanceOf(Array),
  }).isRequired,
  elements: PropTypes.instanceOf(Array).isRequired,
  durationTypes: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingWorkflowTypes: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  stageWorkflowsTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.instanceOf(Object),
    }),
  ).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  addItemHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
