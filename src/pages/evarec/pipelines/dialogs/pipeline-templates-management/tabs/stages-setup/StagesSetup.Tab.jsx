import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteDialog } from '../../../../../../setups/shared';
import { ActiveStageSection, StagesNavigatorSection } from './sections';
import {
  DeletePipelineStage,
  // GetAllSetupsWorkflowsTemplatesTypes,
  UpdatePipelineStagesReorder,
} from '../../../../../../../services';
import {
  PipelineRulesTypesEnum,
  PipelineStageActionsTypesEnum,
  PipelineStageBudgetedJobTypesEnum,
  PipelineStageCandidateActionsEnum,
  PipelineStagePreconditionTypesEnum,
  PipelineStageUsersTypesEnum,
} from '../../../../../../../enums';
import { GetReorderDraggedItems } from '../../../../../../evabrand/helpers';
import { showError, showSuccess } from '../../../../../../../helpers';
import './StagesSetup.Style.scss';

export const StagesSetupTab = ({
  state,
  isSubmitted,
  isLoading,
  errors,
  onStateChanged,
  onIsLoadingChanged,
  // isOpenChanged,
  onStageChanged,
  changedStagesRef,
  parentTranslationPath,
  translationPath,
  onCancelHandler,
  saveHandler,
  activeItem,
  activePipelineItem,
  activeStage,
  onActiveStageChanged,
  getAllSavedStages,
  emailAnnotations,
  pipelineQuestionnaires,
  collapseToggleHandler,
  openActionCollapseIndex,
  isOpenActionsCollapse,
  isOpenPreconditionCollapse,
  isOpenTeamWorkflowCollapse,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localActiveItem, setLocalActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [stageActionsTypes] = useState(() =>
    Object.values(PipelineStageActionsTypesEnum),
  );
  // const [stageWorkflowsTypes, setStageWorkflowsTypes] = useState([]);
  // const [isLoadingWorkflowTypes, setIsLoadingWorkflowTypes] = useState(false);
  const [stageUsersTypes] = useState(() =>
    Object.values(PipelineStageUsersTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [actionsRulesTypes] = useState(
    Object.values(PipelineRulesTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const [stageCandidateActionsEnum] = useState(
    Object.values(PipelineStageCandidateActionsEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const [stagePreconditionTypes] = useState(() =>
    Object.values(PipelineStagePreconditionTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const [budgetedJobTypes] = useState(() =>
    Object.values(PipelineStageBudgetedJobTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  /**
   * @Description this method is to get active stage precondition type enum item by key
   */
  const getActiveStagePreconditionTypeByKey = useMemo(
    () => (key) => stagePreconditionTypes.find((item) => item.key === key),
    [stagePreconditionTypes],
  );

  /**
   * @param type
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the active action enum by type (key)
   */
  const getActionEnumByType = useCallback(
    (type) => stageActionsTypes.find((item) => item.key === type),
    [stageActionsTypes],
  );

  /**
   * @param parentIndex
   * @param key
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new items to the array
   */
  const addItemHandler = useCallback(
    ({ parentIndex, key, items = [], subParentId, subParentIndex }) =>
      () => {
        const localItems = [...items];
        let itemToPush = {
          relation_type: null,
          users: [],
        };
        if (key === 'actions')
          itemToPush = {
            type: null,
            // the email template uuid or video assessment uuid or questionnaires uuid
            relation_uuid: null,
            email_subject: null,
            email_annotations: null,
            email_body: null,
            attachments: [],
            attachmentsFullFiles: [],
            // available_for_duration: null, // will be used when the action type is video assessment
            // will be used when the action type is video assessment
            // available_for_duration_type: null,
            rules: [
              // can be empty
              // {
              //  type: null, // this is the type of the rule type 1=> for after time 2=> for after action
              //  previous_action_type: null, // if type is 2 what is the previous action type
              //  order: null, // if type is 2 what is the order of the action
              //  delay_duration: null, // just a number from 1 to unknown (time as number)
              //  delay_duration_type: null, // 1=> hours, 2=> days, 3=> weeks (if there is timeframe)
              // },
            ],
          };
        if (key === 'workflows')
          itemToPush = {
            // is is_with_workflows false then this must be empty
            transaction_key: null,
            template_uuid: null,
            rules: [],
          };
        if (key === 'precondition')
          itemToPush = {
            type: null,
            template_type: [],
            template_status: [],
            scorecard_status: null,
            job_target: [],
            budgeted_type: [],
          };
        if (subParentId === 'actions' && key === 'rules')
          itemToPush = {
            type: null, // this is the type of the rule type 1=> for after time 2=> for after action
            previous_action_type: null, // if type is 2 what is the previous action type
            order: null, // if type is 2 what is the order of the action
            delay_duration: null, // just a number from 1 to unknown (time as number)
            delay_duration_type: null, // 1=> hours, 2=> days, 3=> weeks (if there is timeframe)
          };
        if (subParentId === 'workflows' && key === 'rules')
          itemToPush = {
            type: null, // this is the type of the rule type 1=> for after time 2=> for after workflow
            template_uuid: null, // to be executed before (only if type 2) (must be one of the selected templates in workflow main array)
            delay_duration: null, // just a number from 1 to unknown (time as number)
            delay_duration_type: null, // 1=> hours, 2=> days, 3=> weeks (if there is timeframe)
          };
        localItems.push(itemToPush);
        onStateChanged({
          parentId: 'stages',
          parentIndex,
          subParentId,
          subParentIndex,
          id: key,
          value: localItems,
        });
      },
    [onStateChanged],
  );

  /**
   * @param parentIndex
   * @param elementIndex
   * @param key
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove items from the array
   */
  const onRemoveItemClicked = useCallback(
    ({ parentIndex, elementIndex, key, items = [], subParentId, subParentIndex }) =>
      () => {
        let localActions = [...items];
        localActions.splice(elementIndex, 1);
        if (key === 'actions')
          localActions = localActions.map((item) => {
            const localItem = { ...item };
            if (localItem.rules && localItem.rules.length > 0) {
              localItem.rules = localItem.rules.map((rule) => {
                if (rule.type !== PipelineRulesTypesEnum.Action.key) return rule;
                const localRule = { ...rule };
                if (localRule.order >= elementIndex) {
                  if (localRule.order === elementIndex) {
                    localRule.order = null;
                    localRule.previous_action_type = null;
                    localRule.delay_duration = null;
                    localRule.delay_duration_type = null;
                    localRule.type = null;
                  } else localRule.order -= 1;
                  return localRule;
                }
                return rule; // return this to reduce the number of re-rendered components (children)
              });
              return localItem;
            }
            return item; // return this to reduce the number of re-rendered components (children)
          });

        onStateChanged({
          parentId: 'stages',
          parentIndex,
          subParentId,
          subParentIndex,
          id: key,
          value: localActions,
        });
      },
    [onStateChanged],
  );
  const reorderStagesChangedHandler = async ({
    reorderedItems,
    sourceIndex,
    destinationIndex,
  }) => {
    const localReorderedItems = reorderedItems || [...(state.stages || [])];
    if (!reorderedItems) {
      localReorderedItems.splice(
        destinationIndex,
        0,
        localReorderedItems.splice(sourceIndex, 1)[0],
      );
      if (activeStage === destinationIndex) onActiveStageChanged(sourceIndex);
      if (activeStage === sourceIndex) onActiveStageChanged(destinationIndex);
    }
    localReorderedItems.map((item, index) => {
      // eslint-disable-next-line no-param-reassign
      item.order = index;
      return undefined;
    });
    const saveReorderForSavedStages = localReorderedItems.filter(
      (item) => item.uuid,
    );
    if (saveReorderForSavedStages.length > 0) {
      onIsLoadingChanged(true);
      const response = await UpdatePipelineStagesReorder({
        list: saveReorderForSavedStages.map((item) => ({
          uuid: item.uuid,
          order: item.order,
        })),
      });
      onIsLoadingChanged(false);
      if (response && response.status === 202) {
        onStageChanged({
          stageIndex: destinationIndex,
          oldStageLocation: sourceIndex,
          isReorderStage: true,
        });
        showSuccess(t(`${translationPath}stages-reordered-successfully`));
        onStateChanged({ id: 'stages', value: [...localReorderedItems] });
      } else showError(t(`${translationPath}stages-reorder-failed`));
    } else {
      onStageChanged({
        stageIndex: destinationIndex,
        oldStageLocation: sourceIndex,
        isReorderStage: true,
      });
      onStateChanged({ id: 'stages', value: [...localReorderedItems] });
    }
  };
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder stages items
   */
  const onDragEndHandler = (dropEvent) => {
    const reorderedItems = GetReorderDraggedItems(dropEvent, state.stages);
    if (!reorderedItems) return;
    if (activeStage === dropEvent.destination.index)
      onActiveStageChanged(dropEvent.source.index);
    else if (activeStage === dropEvent.source.index)
      onActiveStageChanged(dropEvent.destination.index);
    else if (
      dropEvent.destination.index < activeStage
      && dropEvent.source.index > activeStage
    )
      onActiveStageChanged(activeStage + 1);
    else if (
      dropEvent.destination.index > activeStage
      && dropEvent.source.index < activeStage
    )
      onActiveStageChanged(activeStage - 1);
    reorderStagesChangedHandler({
      reorderedItems,
      destinationIndex: dropEvent.destination.index,
      sourceIndex: dropEvent.source.index,
    });
  };

  /**
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new stage to the array
   */
  const addStageHandler = useCallback(
    (currentStages) => () => {
      const localStates = [...currentStages];
      localStates.push({
        title: '',
        order: localStates.length,
        pipeline_uuid:
          (activeItem && activeItem.uuid)
          || (activePipelineItem && activePipelineItem.pipeline.uuid),
        is_skippable: true,
        is_skippable_disabled: false,
        is_hide_external_provider: false,
        is_hide_external_provider_disabled: false,
        stage_limit: null,
        is_with_timeframe: true,
        timeframe_duration: null, // just a number from 1 to unknown (time as number) if there is timeframe
        timeframe_duration_type: null, // 1=> hours, 2=> days, 3=> weeks (if there is timeframe)
        is_with_actions: false,
        actions: [],
        is_with_precondition: false,
        precondition: [],
        is_with_workflows: false,
        workflows: [],
        is_with_candidate_actions: true,
        is_every_actions: true,
        candidate_actions: [
          // {
          //   type: 1, // one of PipelineStageCandidateActionsEnum
          //   form_types: null, // array of form builder types only if type is offers
          // },
        ],
        is_with_responsibility: true,
        is_everyone_move_in: true,
        responsible_move_in: [
          // {
          //   relation_type: 1, // 1=> teams, 2=> employees, 3=> users
          //   relation_uuid: null, // array of users or teams or employees uuids
          // },
        ],
        is_everyone_move_out: true,
        responsible_move_out: [
          // {
          //   relation_type: 1, // 1=> teams, 2=> employees, 3=> users
          //   relation_uuid: null, // array of users or teams or employees uuids
          // },
        ], // can include the is
        responsible_move_to: [], // if empty then can move to any stage (stages uuids)
        can_delete: true,
        is_auto_move: false,
        is_with_visibility_candidate: false,
        is_onboarding_enabled: false,
        is_display_stage_enabled: true,
        is_vacancy_status_enabled: false,
      });

      onStageChanged({ stageIndex: localStates.length - 1 });
      onStateChanged({
        id: 'stages',
        value: localStates,
      });
    },
    [activeItem, activePipelineItem, onStageChanged, onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the workflow options & enums
   */
  // const getWorkflowsTemplatesTypes = useCallback(async () => {
  //   setIsLoadingWorkflowTypes(true);
  //   const response = await GetAllSetupsWorkflowsTemplatesTypes();
  //   setIsLoadingWorkflowTypes(false);
  //   if (response && response.status === 200) {
  //     const {
  //       data: { results },
  //     } = response;
  //     setStageWorkflowsTypes(results.transactions);
  //   } else
  //     showError(t('Shared:failed-to-get-saved-data'), response);
  //     // isOpenChanged();
  //
  // }, [t]);

  /**
   * @param stageIndex
   * @param item
   * @param items
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove stages from the array
   */
  const onDeleteStageClicked = useCallback(
    (stageIndex, item, items = []) =>
      () => {
        const localStages = [...items];
        if (item.uuid) {
          setIsOpenDeleteDialog(true);
          setLocalActiveItem({ ...item, stageIndex });
        } else {
          localStages.splice(stageIndex, 1);
          localStages.map((element, index) => {
            // eslint-disable-next-line no-param-reassign
            element.order = index;
            return undefined;
          });
          onStateChanged({
            id: 'stages',
            value: localStages,
          });
          onStageChanged({ stageIndex: stageIndex, isRemove: true });
        }
      },
    [onStageChanged, onStateChanged],
  );

  /**
   * @param parentIndex
   * @param subParentIndex
   * @param element
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add the selected annotation to the email body
   */
  const onEmailAnnotationChanged = useCallback(
    (parentIndex, subParentIndex, element) => (newValue) => {
      const localAction = { ...element };
      if (localAction.email_body)
        localAction.email_body = `${localAction.email_body} ${newValue.value}`;
      else localAction.email_body = newValue.value;
      onStateChanged({
        parentId: 'stages',
        parentIndex,
        subParentIndex,
        subParentId: 'actions',
        id: 'email_body',
        value: localAction.email_body,
      });
      // here u may add the email_annotations change if necessary in the future
    },
    [onStateChanged],
  );

  // this to get table data on init
  // useEffect(() => {
  //   getWorkflowsTemplatesTypes();
  // }, [getWorkflowsTemplatesTypes]);

  return (
    <div className="stages-setup-tab-wrapper">
      <StagesNavigatorSection
        state={state}
        activeStage={activeStage}
        addStageHandler={addStageHandler}
        onActiveStageChanged={onActiveStageChanged}
        onDeleteStageClicked={onDeleteStageClicked}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDragEndHandler={onDragEndHandler}
        onStateChanged={onStateChanged}
        reorderStagesChangedHandler={reorderStagesChangedHandler}
        isLoading={isLoading}
        getActionEnumByType={getActionEnumByType}
      />
      {activeStage >= 0 && activeStage < state.stages.length && (
        <ActiveStageSection
          state={state}
          activeStage={activeStage}
          stageItem={state.stages[activeStage]}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isLoading={isLoading}
          errors={errors}
          onDeleteStageClicked={onDeleteStageClicked}
          saveHandler={saveHandler}
          onCancelHandler={onCancelHandler}
          onStateChanged={onStateChanged}
          collapseToggleHandler={collapseToggleHandler}
          openActionCollapseIndex={openActionCollapseIndex}
          isOpenActionsCollapse={isOpenActionsCollapse}
          isOpenTeamWorkflowCollapse={isOpenTeamWorkflowCollapse}
          onRemoveItemClicked={onRemoveItemClicked}
          isSubmitted={isSubmitted}
          onEmailAnnotationChanged={onEmailAnnotationChanged}
          stageActionsTypes={stageActionsTypes}
          getActionEnumByType={getActionEnumByType}
          getActiveStagePreconditionTypeByKey={getActiveStagePreconditionTypeByKey}
          stageCandidateActionsEnum={stageCandidateActionsEnum}
          // stageWorkflowsTypes={stageWorkflowsTypes}
          stageUsersTypes={stageUsersTypes}
          actionsRulesTypes={actionsRulesTypes}
          stagePreconditionTypes={stagePreconditionTypes}
          budgetedJobTypes={budgetedJobTypes}
          isOpenPreconditionCollapse={isOpenPreconditionCollapse}
          emailAnnotations={emailAnnotations}
          pipelineQuestionnaires={pipelineQuestionnaires}
          // isLoadingWorkflowTypes={isLoadingWorkflowTypes}
          addItemHandler={addItemHandler}
          onActiveStageChanged={onActiveStageChanged}
          getAllSavedStages={getAllSavedStages}
          changedStagesRef={changedStagesRef}
        />
      )}

      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={localActiveItem}
          successMessage="stage-deleted-successfully"
          onSave={() => {
            const localStages = [...state.stages];
            localStages.splice(localActiveItem.stageIndex, 1);
            localStages.map((element, index) => {
              // eslint-disable-next-line no-param-reassign
              element.order = index;
              return undefined;
            });
            onStageChanged({
              stageIndex: localActiveItem.stageIndex,
              isRemove: true,
            });
            // u may to need to call API to reorder the stages from backend on delete
            onStateChanged({ id: 'stages', value: localStages });
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setLocalActiveItem(null);
          }}
          descriptionMessage="stage-delete-description"
          deleteApi={DeletePipelineStage}
          apiProps={{
            uuid: localActiveItem && [localActiveItem.uuid],
          }}
          errorMessage="stage-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

StagesSetupTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  isOpenChanged: PropTypes.instanceOf(Object).isRequired,
  onStageChanged: PropTypes.func.isRequired,
  changedStagesRef: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  onCancelHandler: PropTypes.func.isRequired,
  getAllSavedStages: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  activePipelineItem: PropTypes.instanceOf(Object),
  activeStage: PropTypes.number.isRequired,
  onActiveStageChanged: PropTypes.func.isRequired,
  emailAnnotations: PropTypes.arrayOf(PropTypes.string).isRequired,
  pipelineQuestionnaires: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  collapseToggleHandler: PropTypes.func.isRequired,
  openActionCollapseIndex: PropTypes.number,
  isOpenActionsCollapse: PropTypes.bool.isRequired,
  isOpenPreconditionCollapse: PropTypes.bool.isRequired,
  isOpenTeamWorkflowCollapse: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
StagesSetupTab.defaultProps = {
  activeItem: null,
  activePipelineItem: null,
  openActionCollapseIndex: null,
};
