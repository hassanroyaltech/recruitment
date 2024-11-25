import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  CheckboxesComponent,
  CollapseComponent,
  PopoverComponent,
  SwitchComponent,
} from '../../../../../../../../../components';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import {
  CandidateVisibilityOptionsEnums,
  DynamicFormTypesEnum,
  OffersStatusesEnum,
  PipelineStagePeriodTypesEnum,
  PipelineStagePreconditionTypesEnum,
  PipelineStageResponsibilityTypesEnum,
  ScorecardPreconditionTypesEnum,
  SystemActionsEnum,
} from '../../../../../../../../../enums';
import {
  CandidateActionsSection,
  StageActionsSection,
  StagePreconditionSection,
  StageResponsibilitySection,
  // StageWorkflowsSection,
} from './sections';
import './ActiveStage.Style.scss';

export const ActiveStageSection = ({
  state,
  activeStage,
  stageItem,
  parentTranslationPath,
  translationPath,
  isLoading,
  errors,
  onDeleteStageClicked,
  saveHandler,
  onCancelHandler,
  // isLoadingWorkflowTypes,
  onStateChanged,
  onRemoveItemClicked,
  isSubmitted,
  onEmailAnnotationChanged,
  stageActionsTypes,
  getActiveStagePreconditionTypeByKey,
  // stageWorkflowsTypes,
  stagePreconditionTypes,
  budgetedJobTypes,
  stageUsersTypes,
  stageCandidateActionsEnum,
  actionsRulesTypes,
  getAllSavedStages,
  emailAnnotations,
  pipelineQuestionnaires,
  addItemHandler,
  changedStagesRef,
  onActiveStageChanged,
  collapseToggleHandler,
  openActionCollapseIndex,
  isOpenActionsCollapse,
  // isOpenTeamWorkflowCollapse,
  isOpenPreconditionCollapse,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const actionCollapseRef = useRef(null);
  const preconditionCollapseRef = useRef(null);
  // const workflowCollapseRef = useRef(null);
  const [durationTypes] = useState(() =>
    Object.values(PipelineStagePeriodTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [candidateVisibilityOptions] = useState(() =>
    Object.values(CandidateVisibilityOptionsEnums).map((item) => ({
      ...item,
      label: t(item.label),
    })),
  );
  const [actionsPopoverAttachedWith, setActionsPopoverAttachedWith] = useState(null);
  const [preconditionPopoverAttachedWith, setPreconditionPopoverAttachedWith]
    = useState(null);
  // const [teamWorkflowPopoverAttachedWith, setTeamWorkflowPopoverAttachedWith]
  //   = useState(null);

  /**
   * @param key - expected values 'actions', 'team-workflow'
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the toggle for the active stage popovers
   */
  const popoverToggleHandler = useCallback(
    (key) =>
      (event = null) => {
        if (key === 'actions')
          setActionsPopoverAttachedWith((event && event.currentTarget) || null);
        // if (key === 'team-workflow')
        //   setTeamWorkflowPopoverAttachedWith((event && event.currentTarget) || null);
        if (key === 'precondition')
          setPreconditionPopoverAttachedWith((event && event.currentTarget) || null);
      },
    [],
  );

  /**
   * @param stageIndex - expected values 'actions', 'team-workflow'
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change for the active stage by breadcrumb
   */
  const onBreadcrumbItemClicked = useCallback(
    (stageIndex) => () => {
      onActiveStageChanged(stageIndex);
    },
    [onActiveStageChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the current value for responsible_move_to
   */
  const getSelectedResponsibleMoveTo = useMemo(
    () => () =>
      (stageItem.responsible_move_to || []).map((item) => item.relation_uuid),
    [stageItem.responsible_move_to],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to disable the saving for single stage button if not changed
   */
  const getIsChangedStage = useMemo(
    () => () => changedStagesRef.current.indexOf(activeStage) !== -1,
    [activeStage, changedStagesRef],
  );

  const getSelectedOption = useMemo(
    () => (option, checkedValue) => {
      if (option?.key === CandidateVisibilityOptionsEnums.VIEW_ALL_APPLICANTS.key)
        if (checkedValue) return [1, 2];
        else
          return stageItem.visibility_candidate.can.filter(
            (it) => it !== option.key,
          );
      // prev without 2
      else if (
        option?.key === CandidateVisibilityOptionsEnums.VIEW_TOTAL_APPLICANTS.key
      )
        if (checkedValue) return [1];
        else return [];
    },
    [stageItem],
  );
  return (
    <div className="active-stage-section-wrapper">
      <div className="stages-breadcrumb-wrapper">
        {state.stages.map((item, index) => (
          <React.Fragment key={`breadcrumb${activeStage}-${index + 1}`}>
            {index > 0 && <span className="fas fa-arrow-right px-1" />}
            <ButtonBase
              className={`btns theme-transparent${
                (activeStage === index
                  && !(
                    isSubmitted
                    && Object.keys(errors).some((item) =>
                      item.includes(`stages[${index}]`),
                    )
                  )
                  && ' is-active')
                || ''
              }${
                (isSubmitted
                  && Object.keys(errors).some((item) =>
                    item.includes(`stages[${index}]`),
                  )
                  && ' c-error c-error-hover')
                || ''
              }`}
              onClick={onBreadcrumbItemClicked(index)}
            >
              <span>
                {item.title || `${t(`${translationPath}stage-#`)} ${index + 1}`}
              </span>
            </ButtonBase>
          </React.Fragment>
        ))}
      </div>
      <div className="active-stage-body-wrapper">
        <SharedInputControl
          placeholder="stage-title"
          errors={errors}
          stateKey="title"
          errorPath={`stages[${activeStage}].title`}
          parentId="stages"
          parentIndex={activeStage}
          editValue={stageItem.title}
          isDisabled={isLoading}
          themeClass="theme-header"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isFullWidth
        />
        <div className="w-100 mb-3">
          <CheckboxesComponent
            idRef={`isSkippable${activeStage}`}
            singleChecked={stageItem.is_skippable}
            isDisabled={stageItem.is_skippable_disabled}
            label="this-stage-is-skippable"
            onSelectedCheckboxChanged={(event, isChecked) => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_skippable',
                value: isChecked,
              });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isWithTimeFrameRef"
              isChecked={stageItem.is_with_timeframe}
              label="timeframe"
              switchLabelClasses="fw-bold c-black-light"
              isReversedLabel
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_with_timeframe',
                  value: isChecked,
                });
                if (isChecked) {
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'timeframe_duration',
                    value: 0,
                  });
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'timeframe_duration_type',
                    value: PipelineStagePeriodTypesEnum.Days.key,
                  });
                } else {
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'timeframe_duration',
                    value: null,
                  });
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'timeframe_duration_type',
                    value: null,
                  });
                }
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}timeframe-description`)}</span>
        </div>
        {stageItem.is_with_timeframe && (
          <div className="d-flex-v-center">
            <span className="c-black-light mb-3">
              {t(`${translationPath}max-duration-description`)}
            </span>
            <span className="d-inline-flex px-2">
              <div className="d-inline-flex px-2">
                <SharedInputControl
                  editValue={stageItem.timeframe_duration}
                  parentId="stages"
                  parentIndex={activeStage}
                  stateKey="timeframe_duration"
                  isSubmitted={isSubmitted}
                  errors={errors}
                  wrapperClasses="small-control"
                  errorPath={`stages[${activeStage}].timeframe_duration`}
                  onValueChanged={onStateChanged}
                  type="number"
                  min={0}
                  floatNumbers={0}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
              <div className="d-inline-flex px-2">
                <SharedAutocompleteControl
                  editValue={stageItem.timeframe_duration_type}
                  placeholder="select-duration"
                  // title="condition"
                  stateKey="timeframe_duration_type"
                  parentId="stages"
                  parentIndex={activeStage}
                  disableClearable
                  sharedClassesWrapper="small-control"
                  errorPath={`stages[${activeStage}].timeframe_duration_type`}
                  onValueChanged={(newValue) => {
                    onStateChanged(newValue);
                  }}
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
        <div className="d-flex-v-center mb-3">
          <span>
            <SwitchComponent
              idRef="isWithActions"
              isChecked={stageItem.is_with_actions}
              label="stage-actions"
              switchLabelClasses="fw-bold c-black-light"
              isReversedLabel
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_with_actions',
                  value: isChecked,
                });
                if (stageItem.actions && stageItem.actions.length > 0 && !isChecked)
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'actions',
                    value: [],
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}stage-actions-description`)}</span>
        </div>
        {errors[`stages[${activeStage}].actions`]
          && errors[`stages[${activeStage}].actions`].error
          && isSubmitted && (
          <div className="c-error fz-10 mb-2">
            <span>{errors[`stages[${activeStage}].actions`].message}</span>
          </div>
        )}
        {stageItem.is_with_actions && (
          <div className="active-stage-actions-wrapper">
            <div className="active-stage-actions-header">
              <span>
                <span>{t(`${translationPath}actions-on-candidate`)}</span>
                <span className="c-gray">
                  <span>.</span>
                  <span>{stageItem.actions && stageItem.actions.length}</span>
                </span>
              </span>
              <span>
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={popoverToggleHandler('actions')}
                  disabled={
                    !stageItem.actions || stageItem.actions.length === 0 || isLoading
                  }
                >
                  <span className="fas fa-ellipsis-h" />
                </ButtonBase>

                {actionsPopoverAttachedWith && (
                  <PopoverComponent
                    idRef="activeStageActionsPopover"
                    attachedWith={actionsPopoverAttachedWith}
                    handleClose={() => popoverToggleHandler('actions')()}
                    popoverClasses="active-stage-actions-popover-wrapper"
                    component={
                      <ButtonBase
                        className="btns theme-transparent active-stage-actions-popover-btn mx-0"
                        onClick={() => {
                          onStateChanged({
                            parentId: 'stages',
                            parentIndex: activeStage,
                            id: 'actions',
                            value: [],
                          });
                          popoverToggleHandler('actions')();
                        }}
                      >
                        <span className={SystemActionsEnum.delete.icon} />
                        <span className="px-2">
                          {t(`${translationPath}remove-actions`)}
                        </span>
                      </ButtonBase>
                    }
                  />
                )}

                {stageItem.actions && stageItem.actions.length > 0 && (
                  <ButtonBase
                    className="btns-icon theme-transparent"
                    ref={actionCollapseRef}
                    onClick={collapseToggleHandler('actions')}
                  >
                    <span
                      className={`fas fa-chevron-${
                        (isOpenActionsCollapse && 'up') || 'down'
                      }`}
                    />
                  </ButtonBase>
                )}
              </span>
            </div>
            <CollapseComponent
              isOpen={isOpenActionsCollapse}
              component={
                <div className="active-stage-actions-body">
                  {stageItem.actions
                    && stageItem.actions.map((element, elementIndex, elements) => (
                      <StageActionsSection
                        key={`stageActionsKey${activeStage + 1}-${elementIndex + 1}`}
                        // isOpenChanged={isOpenChanged}
                        onStateChanged={onStateChanged}
                        onRemoveItemClicked={onRemoveItemClicked}
                        isSubmitted={isSubmitted}
                        index={activeStage}
                        language_id={state.language_id}
                        onEmailAnnotationChanged={onEmailAnnotationChanged}
                        translationPath={translationPath}
                        collapseToggleHandler={collapseToggleHandler}
                        openActionCollapseIndex={openActionCollapseIndex}
                        element={element}
                        elements={elements}
                        durationTypes={durationTypes}
                        // pipeline_uuid={state.uuid}
                        emailAnnotations={emailAnnotations}
                        pipelineQuestionnaires={pipelineQuestionnaires}
                        stageActionsTypes={stageActionsTypes}
                        actionsRulesTypes={actionsRulesTypes}
                        errors={errors}
                        elementIndex={elementIndex}
                        isLoading={isLoading}
                        addItemHandler={addItemHandler}
                        parentTranslationPath={parentTranslationPath}
                      />
                    ))}
                </div>
              }
            />

            <div className="active-stage-actions-footer">
              <ButtonBase
                className="btns theme-transparent px-3 mx-0"
                disabled={!stageItem.is_with_actions}
                onClick={() => {
                  addItemHandler({
                    parentIndex: activeStage,
                    key: 'actions',
                    items: stageItem.actions,
                  })();
                  if (!isOpenActionsCollapse) collapseToggleHandler('actions')();
                }}
              >
                <span className="fas fa-plus" />
                <span className="px-1">{t(`${translationPath}add-action`)}</span>
              </ButtonBase>
            </div>
          </div>
        )}
        <div className="separator-h mb-3" />
        {/* Todo: remove the comment on this code & fix the rules logic */}
        {/*<div className="d-flex-v-center mb-2">*/}
        {/*  <span>*/}
        {/*    <SwitchComponent*/}
        {/*      idRef="isWithWorkFlows"*/}
        {/*      isChecked={stageItem.is_with_workflows}*/}
        {/*      label="stage-workflows"*/}
        {/*      switchLabelClasses="fw-bold c-black-light"*/}
        {/*      isReversedLabel*/}
        {/*      isFlexEnd*/}
        {/*      onChange={(event, isChecked) => {*/}
        {/*        onStateChanged({*/}
        {/*          parentId: 'stages',*/}
        {/*          parentIndex: activeStage,*/}
        {/*          id: 'is_with_workflows',*/}
        {/*          value: isChecked,*/}
        {/*        });*/}
        {/*        if (*/}
        {/*          stageItem.workflows*/}
        {/*          && stageItem.workflows.length > 0*/}
        {/*          && !isChecked*/}
        {/*        )*/}
        {/*          onStateChanged({*/}
        {/*            parentId: 'stages',*/}
        {/*            parentIndex: activeStage,*/}
        {/*            id: 'workflows',*/}
        {/*            value: [],*/}
        {/*          });*/}
        {/*      }}*/}
        {/*      parentTranslationPath={parentTranslationPath}*/}
        {/*      translationPath={translationPath}*/}
        {/*    />*/}
        {/*  </span>*/}
        {/*</div>*/}
        {/*<div className="description-text mb-3">*/}
        {/*  <span>{t(`${translationPath}stage-workflows-description`)}</span>*/}
        {/*</div>*/}
        {/*{errors[`stages[${activeStage}].workflows`]*/}
        {/*  && errors[`stages[${activeStage}].workflows`].error*/}
        {/*  && isSubmitted && (*/}
        {/*  <div className="c-error fz-10 mb-2">*/}
        {/*    <span>{errors[`stages[${activeStage}].workflows`].message}</span>*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*{stageItem.is_with_workflows && (*/}
        {/*  <div className="active-stage-workflows-wrapper">*/}
        {/*    <div className="active-stage-workflows-header">*/}
        {/*      <span>*/}
        {/*        <span>{t(`${translationPath}team-workflows`)}</span>*/}
        {/*        <span className="c-gray">*/}
        {/*          <span>.</span>*/}
        {/*          <span>{stageItem.workflows && stageItem.workflows.length}</span>*/}
        {/*        </span>*/}
        {/*      </span>*/}
        {/*      <span>*/}
        {/*        <ButtonBase*/}
        {/*          className="btns-icon theme-transparent"*/}
        {/*          ref={workflowCollapseRef}*/}
        {/*          handleClose={() => popoverToggleHandler('team-workflow')()}*/}
        {/*          disabled={*/}
        {/*            !stageItem.workflows*/}
        {/*            || stageItem.workflows.length === 0*/}
        {/*            || isLoading*/}
        {/*          }*/}
        {/*        >*/}
        {/*          <span className="fas fa-ellipsis-h" />*/}
        {/*        </ButtonBase>*/}

        {/*        {teamWorkflowPopoverAttachedWith && (*/}
        {/*          <PopoverComponent*/}
        {/*            idRef="activeStageWorkflowsPopover"*/}
        {/*            attachedWith={teamWorkflowPopoverAttachedWith}*/}
        {/*            handleClose={popoverToggleHandler('team-workflow')}*/}
        {/*            popoverClasses="active-stage-actions-popover-wrapper"*/}
        {/*            component={*/}
        {/*              <ButtonBase*/}
        {/*                className="btns theme-transparent active-stage-actions-popover-btn mx-0"*/}
        {/*                onClick={() => {*/}
        {/*                  onStateChanged({*/}
        {/*                    parentId: 'stages',*/}
        {/*                    parentIndex: activeStage,*/}
        {/*                    id: 'workflows',*/}
        {/*                    value: [],*/}
        {/*                  });*/}
        {/*                  popoverToggleHandler('team-workflow')();*/}
        {/*                }}*/}
        {/*              >*/}
        {/*                <span className={SystemActionsEnum.delete.icon} />*/}
        {/*                <span className="px-2">*/}
        {/*                  {t(`${translationPath}remove-workflows`)}*/}
        {/*                </span>*/}
        {/*              </ButtonBase>*/}
        {/*            }*/}
        {/*          />*/}
        {/*        )}*/}

        {/*        {stageItem.workflows && stageItem.workflows.length > 0 && (*/}
        {/*          <ButtonBase*/}
        {/*            className="btns-icon theme-transparent"*/}
        {/*            onClick={collapseToggleHandler('team-workflow')}*/}
        {/*          >*/}
        {/*            <span*/}
        {/*              className={`fas fa-chevron-${*/}
        {/*                (isOpenTeamWorkflowCollapse && 'up') || 'down'*/}
        {/*              }`}*/}
        {/*            />*/}
        {/*          </ButtonBase>*/}
        {/*        )}*/}
        {/*      </span>*/}
        {/*    </div>*/}
        {/*    <CollapseComponent*/}
        {/*      isOpen={isOpenTeamWorkflowCollapse}*/}
        {/*      component={*/}
        {/*        <div className="active-stage-workflows-body">*/}
        {/*          {stageItem.workflows*/}
        {/*            && stageItem.workflows.map((element, elementIndex, elements) => (*/}
        {/*              <StageWorkflowsSection*/}
        {/*                key={`stageWorkflowsKey${activeStage + 1}-${*/}
        {/*                  elementIndex + 1*/}
        {/*                }`}*/}
        {/*                onStateChanged={onStateChanged}*/}
        {/*                onRemoveItemClicked={onRemoveItemClicked}*/}
        {/*                isSubmitted={isSubmitted}*/}
        {/*                index={activeStage}*/}
        {/*                translationPath={translationPath}*/}
        {/*                element={element}*/}
        {/*                elements={elements}*/}
        {/*                durationTypes={durationTypes}*/}
        {/*                pipeline_uuid={state.uuid}*/}
        {/*                isLoadingWorkflowTypes={isLoadingWorkflowTypes}*/}
        {/*                stageWorkflowsTypes={stageWorkflowsTypes}*/}
        {/*                errors={errors}*/}
        {/*                elementIndex={elementIndex}*/}
        {/*                isLoading={isLoading}*/}
        {/*                addItemHandler={addItemHandler}*/}
        {/*                parentTranslationPath={parentTranslationPath}*/}
        {/*              />*/}
        {/*            ))}*/}
        {/*        </div>*/}
        {/*      }*/}
        {/*    />*/}

        {/*    <div className="active-stage-workflows-footer">*/}
        {/*      <ButtonBase*/}
        {/*        className="btns theme-transparent px-3 mx-0"*/}
        {/*        disabled={!stageItem.is_with_workflows}*/}
        {/*        onClick={() => {*/}
        {/*          addItemHandler({*/}
        {/*            parentIndex: activeStage,*/}
        {/*            key: 'workflows',*/}
        {/*            items: stageItem.workflows,*/}
        {/*          })();*/}
        {/*          if (!isOpenTeamWorkflowCollapse)*/}
        {/*            setIsOpenTeamWorkflowCollapse(true);*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <span className="fas fa-plus" />*/}
        {/*        <span className="px-1">{t(`${translationPath}add-workflow`)}</span>*/}
        {/*      </ButtonBase>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
        {/*<div className="separator-h mb-3" />*/}

        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isWithResponsibility"
              isChecked={stageItem.is_with_responsibility}
              label="stage-responsibility"
              switchLabelClasses="fw-bold c-black-light"
              isReversedLabel
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_with_responsibility',
                  value: isChecked,
                });
                if (!isChecked) {
                  if (
                    stageItem.responsible_move_in
                    && stageItem.responsible_move_in.length > 0
                  )
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'responsible_move_in',
                      value: [],
                    });
                  if (stageItem.is_everyone_move_in)
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'is_everyone_move_in',
                      value: false,
                    });
                  if (
                    stageItem.responsible_move_out
                    && stageItem.responsible_move_out.length > 0
                  )
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'responsible_move_out',
                      value: [],
                    });
                  if (stageItem.is_everyone_move_out)
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'is_everyone_move_out',
                      value: false,
                    });
                } else {
                  if (!stageItem.is_everyone_move_in)
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'is_everyone_move_in',
                      value: true,
                    });
                  if (!stageItem.is_everyone_move_out)
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'is_everyone_move_out',
                      value: true,
                    });
                }
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}stage-responsibility-description`)}</span>
        </div>
        {stageItem.is_with_responsibility && (
          <div className="stage-responsibility-wrapper">
            <StageResponsibilitySection
              onStateChanged={onStateChanged}
              activeStage={activeStage}
              stageItem={stageItem}
              onRemoveItemClicked={onRemoveItemClicked}
              enableKey="is_everyone_move_in"
              arrayKey="responsible_move_in"
              titleDescription="responsible-to-move-candidate-in"
              managementTitle="responsibility-management-in"
              managementTitleDescription="responsibility-management-in-description"
              stageUsersTypes={stageUsersTypes}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <div className="separator-h mb-3" />
            <StageResponsibilitySection
              onStateChanged={onStateChanged}
              activeStage={activeStage}
              stageItem={stageItem}
              onRemoveItemClicked={onRemoveItemClicked}
              enableKey="is_everyone_move_out"
              arrayKey="responsible_move_out"
              titleDescription="responsible-to-move-candidate-out"
              managementTitle="responsibility-management-out"
              managementTitleDescription="responsibility-management-out-description"
              stageUsersTypes={stageUsersTypes}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <div className="separator-h mb-3" />
            <div className="enable-move-to px-2">
              <SharedAutocompleteControl
                isHalfWidth
                // title="action-type"
                labelValue="enable-move-to"
                errors={errors}
                stateKey="responsible_move_to"
                parentId="stages"
                parentIndex={activeStage}
                placeholder="select-stages"
                editValue={getSelectedResponsibleMoveTo()}
                isDisabled={isLoading}
                isSubmitted={isSubmitted}
                onValueChanged={({ value }) => {
                  const localSelectedValues = value.map((item) => ({
                    relation_type: PipelineStageResponsibilityTypesEnum.Stage.key,
                    relation_uuid: item,
                  }));
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'responsible_move_to',
                    value: localSelectedValues,
                  });
                }}
                type={DynamicFormTypesEnum.array.key}
                initValues={getAllSavedStages(stageItem.uuid, state.stages)}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                initValuesKey="uuid"
                initValuesTitle="title"
                getOptionLabel={(option) => option.title || 'N/A'}
              />
            </div>
          </div>
        )}
        <div className="separator-h mb-3" />
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isWithResponsibility"
              isChecked={stageItem.is_with_candidate_actions}
              label="candidate-actions"
              switchLabelClasses="fw-bold c-black-light"
              isReversedLabel
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_with_candidate_actions',
                  value: isChecked,
                });
                if (!isChecked) {
                  if (
                    stageItem.candidate_actions
                    && stageItem.candidate_actions.length > 0
                  )
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'candidate_actions',
                      value: [],
                    });
                  if (stageItem.is_every_actions)
                    onStateChanged({
                      parentId: 'stages',
                      parentIndex: activeStage,
                      id: 'is_every_actions',
                      value: false,
                    });
                } else if (!stageItem.is_every_actions)
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'is_every_actions',
                    value: true,
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}candidate-actions-description`)}</span>
        </div>
        {stageItem.is_with_candidate_actions && (
          <div className="candidate-actions-wrapper">
            <CandidateActionsSection
              onStateChanged={onStateChanged}
              activeStage={activeStage}
              stageItem={stageItem}
              onRemoveItemClicked={onRemoveItemClicked}
              enableKey="is_every_actions"
              arrayKey="candidate_actions"
              titleDescription="candidate-actions-title-description"
              managementTitle="candidate-actions-management"
              managementTitleDescription="candidate-actions-management-description"
              stageCandidateActionsEnum={stageCandidateActionsEnum}
              errors={errors}
              isLoading={isLoading}
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        )}
        <div className="separator-h mb-3" />
        <div className="d-flex-v-center mb-2">
          <span>
            <SwitchComponent
              idRef="isWithPrecondition"
              isChecked={stageItem.is_with_precondition}
              label="stage-precondition"
              switchLabelClasses="fw-bold c-black-light"
              isReversedLabel
              isFlexEnd
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'is_with_precondition',
                  value: isChecked,
                });
                if (
                  !isChecked
                  && stageItem.precondition
                  && stageItem.precondition.length > 0
                )
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: 'precondition',
                    value: [],
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}stage-precondition-description`)}</span>
        </div>

        {errors[`stages[${activeStage}].precondition`]
          && errors[`stages[${activeStage}].precondition`].error
          && isSubmitted && (
          <div className="c-error fz-10 mb-2">
            <span>{errors[`stages[${activeStage}].precondition`].message}</span>
          </div>
        )}
        {stageItem.is_with_precondition && (
          <div className="active-stage-precondition-wrapper">
            <div className="active-stage-precondition-header">
              <span>
                <span>{t(`${translationPath}precondition`)}</span>
                <span className="c-gray">
                  <span>.</span>
                  <span>
                    {stageItem.precondition && stageItem.precondition.length}
                  </span>
                </span>
              </span>
              <span>
                <ButtonBase
                  className="btns-icon theme-transparent"
                  ref={preconditionCollapseRef}
                  onClick={popoverToggleHandler('precondition')}
                  disabled={
                    !stageItem.precondition
                    || stageItem.precondition.length === 0
                    || isLoading
                  }
                >
                  <span className="fas fa-ellipsis-h" />
                </ButtonBase>

                {preconditionPopoverAttachedWith && (
                  <PopoverComponent
                    idRef="activeStagePreconditionPopover"
                    attachedWith={preconditionPopoverAttachedWith}
                    handleClose={() => popoverToggleHandler('precondition')()}
                    popoverClasses="active-stage-precondition-popover-wrapper"
                    component={
                      <ButtonBase
                        className="btns theme-transparent active-stage-precondition-popover-btn mx-0"
                        onClick={() => {
                          onStateChanged({
                            parentId: 'stages',
                            parentIndex: activeStage,
                            id: 'precondition',
                            value: [],
                          });
                          popoverToggleHandler('precondition')();
                        }}
                      >
                        <span className={SystemActionsEnum.delete.icon} />
                        <span className="px-2">
                          {t(`${translationPath}remove-precondition`)}
                        </span>
                      </ButtonBase>
                    }
                  />
                )}

                {stageItem.precondition && stageItem.precondition.length > 0 && (
                  <ButtonBase
                    className="btns-icon theme-transparent"
                    onClick={collapseToggleHandler('precondition')}
                  >
                    <span
                      className={`fas fa-chevron-${
                        (isOpenPreconditionCollapse && 'up') || 'down'
                      }`}
                    />
                  </ButtonBase>
                )}
              </span>
            </div>
            <CollapseComponent
              isOpen={isOpenPreconditionCollapse}
              component={
                <div className="active-stage-precondition-body">
                  {stageItem.precondition
                    && stageItem.precondition.map((element, elementIndex, elements) => (
                      <StagePreconditionSection
                        key={`stagePreconditionKey${activeStage + 1}-${
                          elementIndex + 1
                        }`}
                        onStateChanged={onStateChanged}
                        onRemoveItemClicked={onRemoveItemClicked}
                        isSubmitted={isSubmitted}
                        index={activeStage}
                        element={element}
                        elements={elements}
                        stagePreconditionTypes={stagePreconditionTypes}
                        getActiveStagePreconditionTypeByKey={
                          getActiveStagePreconditionTypeByKey
                        }
                        budgetedJobTypes={budgetedJobTypes}
                        errors={errors}
                        elementIndex={elementIndex}
                        isLoading={isLoading}
                        addItemHandler={addItemHandler}
                        stages={state.stages}
                        currentStageUUID={stageItem.uuid}
                        getAllSavedStages={getAllSavedStages}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                    ))}
                </div>
              }
            />

            {stageItem.precondition.length < stagePreconditionTypes.length && (
              <div className="active-stage-precondition-footer">
                <ButtonBase
                  className="btns theme-transparent px-3 mx-0"
                  disabled={!stageItem.is_with_precondition}
                  onClick={() => {
                    addItemHandler({
                      parentIndex: activeStage,
                      key: 'precondition',
                      items: stageItem.precondition,
                    })();
                    if (!isOpenPreconditionCollapse)
                      collapseToggleHandler('precondition')();
                  }}
                >
                  <span className="fas fa-plus" />
                  <span className="px-1">
                    {t(`${translationPath}add-precondition`)}
                  </span>
                </ButtonBase>
              </div>
            )}
          </div>
        )}

        <div className="separator-h mb-3" />
        <SharedInputControl
          editValue={stageItem.stage_limit}
          isQuarterWidth
          inlineLabel="stage-limit"
          placeholder="stage-limit"
          parentId="stages"
          parentIndex={activeStage}
          stateKey="stage_limit"
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath={`stages[${activeStage}].stage_limit`}
          onValueChanged={onStateChanged}
          type="number"
          wrapperClasses="px-0"
          inlineLabelClasses="fw-bold fz-16px c-black-light"
          min={0}
          floatNumbers={0}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}stage-limit-description`)}
          </span>
        </div>
        <div className="separator-h mb-3" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef={`hiddenForExternalProviderSwitchRef${activeStage}`}
            label="hidden-for-external-provider"
            isChecked={stageItem.is_hide_external_provider}
            switchLabelClasses="fw-bold c-black-light"
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_hide_external_provider',
                value: isChecked,
              });
            }}
            isDisabled={stageItem.is_hide_external_provider_disabled}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}hidden-for-external-provider-description`)}
          </span>
        </div>
        <div className="separator-h mb-2" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef={`ShowStageInSelfServicesSwitchRef${activeStage}`}
            label="show-stage-self-service"
            isChecked={stageItem.is_with_visibility_candidate}
            switchLabelClasses="fw-bold c-black-light"
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_with_visibility_candidate',
                value: isChecked,
              });
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                subParentId: 'visibility_candidate',
                id: 'can',
                value: [CandidateVisibilityOptionsEnums.VIEW_TOTAL_APPLICANTS.key],
              });
              if (!isChecked)
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: 'visibility_candidate',
                  value: [],
                });
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}show-stage-self-service-description`)}
          </span>
        </div>
        <div className="mb-3">
          {candidateVisibilityOptions.map((option) => (
            <CheckboxesComponent
              key={option.key}
              idRef={`${option.key}-visibility-candidate-option`}
              singleChecked={
                !!stageItem.visibility_candidate?.can?.includes(option.key)
              }
              label={option.label}
              onSelectedCheckboxChanged={(event, checkedValue) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  subParentId: 'visibility_candidate',
                  id: 'can',
                  value: option ? getSelectedOption(option, checkedValue) : [],
                });
              }}
              isDisabled={
                !stageItem.is_with_visibility_candidate
                // || (stageItem.is_with_visibility_candidate
                //   && option.key
                //     === CandidateVisibilityOptionsEnums.VIEW_TOTAL_APPLICANTS.key)
              }
            />
          ))}
        </div>
        <div className="separator-h mb-2" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="enableOnboardingSwitchRef"
            label="enable-onboarding"
            isChecked={stageItem?.is_onboarding_enabled}
            switchLabelClasses="fw-bold c-black-light"
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_onboarding_enabled',
                value: isChecked,
              });
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}enable-onboarding-description`)}
          </span>
        </div>
        <div className="separator-h mb-2" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="enableVacancyStatusSwitchRef"
            label="enable-vacancy-status"
            isChecked={stageItem?.is_vacancy_status_enabled}
            switchLabelClasses="fw-bold c-black-light"
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              // const localeStages = [...state.stages];
              // state.stages.forEach((item, index) => {
              //   if (item.uuid === stageItem.uuid)
              //     localeStages[index].is_vacancy_status_enabled = isChecked;
              //   else localeStages[index].is_vacancy_status_enabled = false;
              // });
              // onStateChanged({
              //   id: 'stages',
              //   value: localeStages,
              // });
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_vacancy_status_enabled',
                value: isChecked,
              });
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}enable-vacancy-status-description`)}
          </span>
        </div>
        <div className="separator-h mb-2" />
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="enableShowStageSwitchRef"
            label="enable-show-stage"
            isChecked={stageItem?.is_display_stage_enabled}
            switchLabelClasses="fw-bold c-black-light"
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: 'is_display_stage_enabled',
                value: isChecked,
              });
            }}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}enable-show-stage-description`)}
          </span>
        </div>
        <div className="separator-h mb-2" />
        {/*<div className="d-inline-flex">*/}
        {/*  <SwitchComponent*/}
        {/*    idRef="autoMoveSwitchRef"*/}
        {/*    label="auto-move"*/}
        {/*    isChecked={state.is_auto_move}*/}
        {/*    switchLabelClasses="fw-bold c-black-light"*/}
        {/*    isReversedLabel*/}
        {/*    isFlexEnd*/}
        {/*    onChange={(event, isChecked) => {*/}
        {/*      onStateChanged({*/}
        {/*        parentId: 'stages',*/}
        {/*        parentIndex: activeStage,*/}
        {/*        id: 'is_auto_move',*/}
        {/*        value: isChecked,*/}
        {/*      });*/}
        {/*    }}*/}
        {/*    isDisabled*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div className="mb-3">*/}
        {/*  <span className="description-text">*/}
        {/*    {t(`${translationPath}auto-move-description`)}*/}
        {/*  </span>*/}
        {/*</div>*/}
        {/*<div className="separator-h mb-3" />*/}
        <span className="header-text c-black-light">
          {t(`${translationPath}delete-stage`)}
        </span>
        <div className="mb-3">
          <span className="description-text">
            {t(`${translationPath}delete-stage-description`)}
          </span>
        </div>
        <ButtonBase
          className="btns theme-outline mx-0"
          onClick={onDeleteStageClicked(activeStage, stageItem, state.stages)}
          disabled={!stageItem.can_delete}
        >
          <span className={SystemActionsEnum.delete.icon} />
          <span className="px-2">{t(`${translationPath}delete-stage`)}</span>
        </ButtonBase>
      </div>
      <div className="separator-h my-3" />
      <div className="d-flex-v-center-h-end mb-2">
        <ButtonBase
          className="btns theme-transparent mx-2"
          onClick={onCancelHandler}
        >
          <span>{t('cancel')}</span>
        </ButtonBase>
        <ButtonBase
          className={`btns theme-solid mx-2${
            (stageItem.uuid && ' bg-secondary') || ''
          }`}
          disabled={!getIsChangedStage() || isLoading}
          onClick={saveHandler(activeStage)}
        >
          <span>
            {t(
              `${translationPath}${(stageItem.uuid && 'update') || 'create'}-stage`,
            )}
          </span>
        </ButtonBase>
      </div>
    </div>
  );
};

ActiveStageSection.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  activeStage: PropTypes.number.isRequired,
  changedStagesRef: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  stageItem: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
    timeframe_duration: PropTypes.number,
    stage_limit: PropTypes.number,
    can_delete: PropTypes.bool,
    is_skippable: PropTypes.bool,
    is_skippable_disabled: PropTypes.bool,
    is_hide_external_provider: PropTypes.bool,
    is_hide_external_provider_disabled: PropTypes.bool,
    is_with_timeframe: PropTypes.bool,
    is_onboarding_enabled: PropTypes.bool,
    is_vacancy_status_enabled: PropTypes.bool,
    is_display_stage_enabled: PropTypes.bool,
    timeframe_duration_type: PropTypes.oneOf(
      Object.values(PipelineStagePeriodTypesEnum).map((item) => item.key),
    ),
    is_with_candidate_actions: PropTypes.bool,
    is_every_actions: PropTypes.bool,
    candidate_actions: PropTypes.instanceOf(Array),
    is_with_responsibility: PropTypes.bool,
    is_with_actions: PropTypes.bool,
    actions: PropTypes.instanceOf(Array),
    is_with_workflows: PropTypes.bool,
    workflows: PropTypes.arrayOf(
      PropTypes.shape({
        transaction_key: PropTypes.number,
        template_uuid: PropTypes.string,
        rules: PropTypes.instanceOf(Array),
      }),
    ),
    is_with_precondition: PropTypes.bool,
    precondition: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(
          Object.values(PipelineStagePreconditionTypesEnum).map((item) => item.key),
        ),
        scorecard_status: PropTypes.oneOf(
          Object.values(ScorecardPreconditionTypesEnum).map((item) => item.key),
        ),
        template_type: PropTypes.arrayOf(PropTypes.string),
        template_status: PropTypes.arrayOf(
          PropTypes.oneOf(Object.values(OffersStatusesEnum).map((item) => item.key)),
        ),
        job_target: PropTypes.arrayOf(PropTypes.string),
        budgeted_type: PropTypes.arrayOf(PropTypes.string),
        final_elimination: PropTypes.arrayOf(
          PropTypes.shape({
            uuid: PropTypes.string,
            number: PropTypes.number,
          }),
        ),
      }),
    ),
    is_everyone_move_in: PropTypes.bool,
    responsible_move_in: PropTypes.instanceOf(Array),
    is_everyone_move_out: PropTypes.bool,
    responsible_move_out: PropTypes.instanceOf(Array),
    responsible_move_to: PropTypes.arrayOf(
      PropTypes.shape({
        relation_type: PropTypes.number,
        relation_uuid: PropTypes.string,
      }),
    ),
    is_with_visibility_candidate: PropTypes.bool,
    visibility_candidate: PropTypes.arrayOf(
      PropTypes.shape({
        can: PropTypes.arrayOf(
          PropTypes.oneOf(
            Object.values(CandidateVisibilityOptionsEnums).map((item) => item.key),
          ),
        ),
      }),
    ),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onDeleteStageClicked: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  onCancelHandler: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  onRemoveItemClicked: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  // isLoadingWorkflowTypes: PropTypes.bool.isRequired,
  onEmailAnnotationChanged: PropTypes.func.isRequired,
  getAllSavedStages: PropTypes.func.isRequired,
  stageActionsTypes: PropTypes.instanceOf(Array).isRequired,
  // stageWorkflowsTypes: PropTypes.instanceOf(Array).isRequired,
  stagePreconditionTypes: PropTypes.instanceOf(Array).isRequired,
  budgetedJobTypes: PropTypes.instanceOf(Array).isRequired,
  stageUsersTypes: PropTypes.instanceOf(Array).isRequired,
  stageCandidateActionsEnum: PropTypes.instanceOf(Array).isRequired,
  actionsRulesTypes: PropTypes.instanceOf(Array).isRequired,
  addItemHandler: PropTypes.func.isRequired,
  onActiveStageChanged: PropTypes.func.isRequired,
  emailAnnotations: PropTypes.arrayOf(PropTypes.string).isRequired,
  pipelineQuestionnaires: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  collapseToggleHandler: PropTypes.func.isRequired,
  getActiveStagePreconditionTypeByKey: PropTypes.func.isRequired,
  openActionCollapseIndex: PropTypes.number,
  isOpenActionsCollapse: PropTypes.bool.isRequired,
  isOpenTeamWorkflowCollapse: PropTypes.bool.isRequired,
  isOpenPreconditionCollapse: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
ActiveStageSection.defaultProps = {
  translationPath: '',
  openActionCollapseIndex: null,
};
