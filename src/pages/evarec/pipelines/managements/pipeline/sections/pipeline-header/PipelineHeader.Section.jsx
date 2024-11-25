import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// import { copyTextToClipboard } from '../../../../../../../helpers';
import './PipelineHeader.Style.scss';
import {
  FilterModal,
  CheckboxesComponent,
  PopoverComponent,
  DialogComponent,
} from '../../../../../../../components';
import {
  NotesDialog,
  TeamsDialog,
  ManageWeightsDialog,
  MoveToManagementDialog,
  JobPipelinesManagementDialog,
  ShareProfileDialog,
  SendQuestionnaireDialog,
  SendVideoAssessmentDialog,
  ManageQuestionnairesDialog,
  FormInviteManagementDialog,
  SendCentralAssessmentDialog,
  AssignCandidatesToUsersDialog,
  OffersInviteManagementDialog,
} from './dialogs';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { GetAllActiveJobs } from '../../../../../../../services';
import { FiltersDisplaySection, InvitedTeamsSection } from './sections';
import {
  FilterDialogCallLocationsEnum,
  IntegrationsPartnersEnum,
  MeetingFromFeaturesEnum,
  PipelineDetailsSectionEnum,
  PipelineMoveToTypesEnum,
  SortingCriteriaCallLocationsEnum,
  SortingCriteriaEnum,
} from '../../../../../../../enums';
import { useSelector } from 'react-redux';
import { getIsAllowedPermissionV2, PagesFilterInitValue } from 'helpers';
import { ManageApplicationsPermissions, ScorecardPermissions } from 'permissions';
import CandidateMeetingsComponent from '../../../../../../../components/Elevatus/CandidateMeetingsComponent';
import InviteStatus from '../../../../../../evassess/pipeline/InviteStatus';
import { ScorecardSection } from './sections/scorecard/ScoreCard.Section';
import { VitallyTrack } from '../../../../../../../utils/Vitally';
import ExportDialog from './dialogs/export/Export.Dialog';
import QuickFiltersComponent from '../../../../../../../components/QuickFilters/QuickFilters.Component';

export const PipelineHeaderSection = ({
  activePipeline,
  activeJob,
  jobUUID,
  selectedCandidates,
  hiddenStages,
  onHiddenStagesChanged,
  onActiveJobChanged,
  onSetActiveJobChanged,
  onActivePipelineChanged,
  onOpenedDetailsSectionChanged,
  onForceToReloadCandidatesChanged,
  onChangeTheActiveJobData,
  getTotalSelectedCandidates,
  // getReturnedData,
  isLoading,
  fromModule,
  isBulkSelect,
  onIsBulkSelectChanged,
  isOpenDialogs,
  isEvaSSESS,
  onIsOpenDialogsChanged,
  popoverAttachedWith,
  onPopoverAttachedWithChanged,
  activeJobPipelineUUID,
  onCandidatesFiltersChanged,
  selectedConfirmedStages,
  onSelectedConfirmedStagesChanged,
  getPipelinePreMoveCheck,
  getIsDisabledTargetStage,
  parentTranslationPath,
  translationPath,
  reinitializeFilteredCandidates,
  scorecardDrawersHandler,
  filters,
  getIsConnectedPartner,
  isConnectionLoading,
  onFiltersChanged,
  showMoveJobToArchivedHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const history = useHistory();
  const userReducer = useSelector((state) => state?.userReducer);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  /**
   * @param popoverKey - the key of the popover
   * @param event - the event of attached item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the popover
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = undefined) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all stages are visible
   */
  const getIsVisibleAll = useCallback(
    () => hiddenStages && hiddenStages.length === 0,
    [hiddenStages],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if some stages are visible
   */
  const getIsSomeVisible = useCallback(
    () =>
      hiddenStages
      && activePipeline
      && hiddenStages.length < activePipeline.stages.length
      && hiddenStages.length > 0,
    [activePipeline, hiddenStages],
  );

  /**
   * @param stageUUID
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all stages are visible
   */
  const getIsVisibleStage = useCallback(
    (stageUUID) => hiddenStages && !hiddenStages.includes(stageUUID),
    [hiddenStages],
  );

  /**
   * @param {filters, tags}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to filters changed
   */

  /**
   * @param stageUUID
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all stages are visible
   */
  const onFiltersResetClicked = useCallback(() => {
    onFiltersChanged({ tags: [], filters: { ...PagesFilterInitValue } });
  }, [onFiltersChanged]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the invited teams from an active job
   */
  const getInvitedTeams = useCallback(
    () =>
      activeJob
      && activeJob.teams_invite
      && activeJob.teams_invite.map((item) => ({
        url: item.profile_image && item.profile_image.url,
        name: `${item.first_name}${(item.last_name && ` ${item.last_name}`) || ''}`,
      })),
    [activeJob],
  );

  /**
   * @param stageUUID
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all stages are visible
   */
  const goBackHandler = useCallback(() => {
    history.push(fromModule.backUrl);
  }, [history, fromModule]);

  /**
   * @param stageUUID
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the visible stage status
   */
  const onIsVisibleStageChanged = useCallback(
    (stageUUID) => (event, isChecked) => {
      const localHiddenStages = [...(hiddenStages || [])];
      if (isChecked) {
        const stageIndex = localHiddenStages.indexOf(stageUUID);
        if (stageIndex !== -1) localHiddenStages.splice(stageIndex, 1);
      } else localHiddenStages.push(stageUUID);
      if (onHiddenStagesChanged) onHiddenStagesChanged(localHiddenStages);
    },
    [hiddenStages, onHiddenStagesChanged],
  );

  /**
   * @param stageUUID
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the visible stage status
   */
  const onIsAllVisibleStageChanged = useCallback(
    (event, isChecked) => {
      const localHiddenStages = [...(hiddenStages || [])];
      if (isChecked) localHiddenStages.length = 0;
      else if (activePipeline && activePipeline.stages)
        activePipeline.stages.map((item) => localHiddenStages.push(item.uuid));

      if (onHiddenStagesChanged) onHiddenStagesChanged(localHiddenStages);
    },
    [activePipeline, hiddenStages, onHiddenStagesChanged],
  );

  const onApplyHandler = useCallback(
    (filterType, oldFilters, tags, filters) => {
      onFiltersChanged({ tags, filters });
      onIsOpenDialogsChanged('filters', false);
      VitallyTrack('EVA-REC - Search on Candidate');
    },
    [onFiltersChanged, onIsOpenDialogsChanged],
  );

  const onSaveMoveToHandler = useCallback(() => {
    onForceToReloadCandidatesChanged();
  }, [onForceToReloadCandidatesChanged]);

  return (
    <div className="pipeline-header-actions-wrapper actions-wrapper">
      <div className="d-flex-h-between flex-wrap mb-3">
        <div className="d-inline-flex-v-center">
          <ButtonBase
            className="btns theme-transparent mx-0 miw-0 c-gray-primary"
            onClick={goBackHandler}
          >
            <span>{t(`${translationPath}${fromModule.title}`)}</span>
          </ButtonBase>
          {activeJob && (
            <span>
              <span className="fas fa-long-arrow-alt-right mx-2" />
              <span className="c-black-light mx-2">{activeJob.title}</span>
            </span>
          )}
        </div>
        <div className="d-inline-flex-v-center flex-wrap">
          <InvitedTeamsSection
            invitedTeams={getInvitedTeams()}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <ButtonBase
            className="btns-icon theme-transparent"
            onClick={() => {
              onOpenedDetailsSectionChanged(PipelineDetailsSectionEnum.Info.key);
            }}
            disabled={isLoading}
          >
            <span className={PipelineDetailsSectionEnum.Info.icon} />
          </ButtonBase>
          <ButtonBase
            className="btns-icon theme-transparent"
            onClick={() => onIsOpenDialogsChanged('manageQuestionnaires', true)}
          >
            <span className="fas fa-question" />
          </ButtonBase>
          <ButtonBase
            className="btns-icon theme-transparent"
            onClick={() => onIsOpenDialogsChanged('notes', true)}
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId:
                  ManageApplicationsPermissions.NotesEvaRecApplication.key,
              })
            }
          >
            <span className={PipelineDetailsSectionEnum.Notes.icon} />
          </ButtonBase>
          <ButtonBase
            className="btns-icon theme-transparent"
            onClick={() => {
              onOpenedDetailsSectionChanged(PipelineDetailsSectionEnum.Logs.key);
            }}
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageApplicationsPermissions.ViewLogs.key,
              })
            }
          >
            <span className={PipelineDetailsSectionEnum.Logs.icon} />
          </ButtonBase>
          {/*<ButtonBase*/}
          {/*  className="btns-icon theme-transparent"*/}
          {/*  disabled*/}
          {/*  onClick={(event) =>*/}
          {/*    onPopoverAttachedWithChanged('others', event.currentTarget)*/}
          {/*  }*/}
          {/*>*/}
          {/*  <span className="fas fa-ellipsis-h" />*/}
          {/*</ButtonBase>*/}
        </div>
      </div>
      <div className="d-flex-v-center-h-between flex-wrap">
        <SharedAPIAutocompleteControl
          editValue={activeJob && activeJob.uuid}
          placeholder="select-job"
          title="job"
          disableClearable
          stateKey="uuid"
          getOptionLabel={(option) => option.title}
          searchKey="search"
          getDataAPI={GetAllActiveJobs}
          extraProps={{
            ...(activeJob
              && activeJob.uuid && {
              with_than: [activeJob && activeJob.uuid],
              job_type: 'active-archived',
            }),
          }}
          // savingKey="uuid"
          dataKey="jobs"
          controlWrapperClasses="px-2"
          isEntireObject
          isRequired
          errors={{
            uuid: {
              error: !isLoading && (!activeJob || !activeJob.uuid),
              message: t('Shared:this-field-is-required'),
            },
          }}
          isSubmitted
          isDisabled={isLoading}
          errorPath="uuid"
          onValueChanged={onActiveJobChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className="d-flex-between">
          <ButtonBase
            className="btns theme-transparent mb-3"
            onClick={() => onForceToReloadCandidatesChanged()}
          >
            <span className="fas fa-sync-alt" />
            <span className="px-1">{t(`${translationPath}refresh-pipeline`)}</span>
          </ButtonBase>
          {activeJob?.score_card_uuid && (
            <ButtonBase
              className="btns theme-transparent mb-3"
              onClick={() => onIsOpenDialogsChanged('scoresSummary', true)}
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: ScorecardPermissions.ScorecardViewScoreSummary.key,
                  permissions: permissions,
                })
              }
            >
              <span className="fas fa-arrow-up rotate-45-reverse " />
              <span className="px-1">{t(`${translationPath}scores-summary`)}</span>
            </ButtonBase>
          )}
          <ButtonBase
            className="btns theme-transparent mb-3"
            onClick={() => onIsOpenDialogsChanged('addCandidate', true)}
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageApplicationsPermissions.AddCandidate.key,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-candidate`)}</span>
          </ButtonBase>
          {!userReducer?.results?.user?.is_provider && (
            <ButtonBase
              className="btns theme-transparent mb-3"
              onClick={() => onIsOpenDialogsChanged('assignJob', true)}
            >
              <span className="px-1">{t(`${translationPath}assign-job`)}</span>
            </ButtonBase>
          )}
        </div>
      </div>
      {activeJob?.score_card_uuid && (
        <ScorecardSection
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          activeJob={activeJob}
          scorecardDrawersHandler={scorecardDrawersHandler}
          onIsOpenDialogsChanged={onIsOpenDialogsChanged}
        />
      )}
      <div className="separator-h" />
      <QuickFiltersComponent
        filterEditValue={filters.filters}
        filterEditValueTags={filters.tags}
        callLocation={FilterDialogCallLocationsEnum.EvaRecPipelines.key}
        isOpen={isOpenDialogs.filters}
        isWithSliders
        onApply={onApplyHandler}
        showTags
        job_uuid={jobUUID}
        showAssessmentTestFilter
        isShowHeightAndWeight
        isShowVideoAssessmentFilter
        isShowQuestionnaireFilter
        isShowAssigneeFilter
      />
      <div className="separator-h mb-3" />
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex">
          <SharedAutocompleteControl
            editValue={activeJobPipelineUUID}
            placeholder="select-pipeline"
            title="pipeline"
            stateKey="uuid"
            getOptionLabel={(option) => option.title}
            isRequired
            sharedClassesWrapper="px-2"
            errors={{
              uuid: {
                error: activeJob && !activeJobPipelineUUID,
                message: t('Shared:this-field-is-required'),
              },
            }}
            initValues={activeJob && activeJob.pipelines}
            isSubmitted
            isDisabled={isLoading}
            errorPath="uuid"
            initValuesKey="uuid"
            initValuesTitle="title"
            onValueChanged={onActivePipelineChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <ButtonBase
            className="btns-icon theme-transparent miw-0 mt-1"
            onClick={() => onIsOpenDialogsChanged('jobPipelinesManagement', true)}
          >
            <span className="fas fa-cog" />
          </ButtonBase>
        </div>
        <div className="d-inline-flex-v-center flex-wrap">
          {(isBulkSelect && (
            <>
              <span className="d-inline-flex-v-center c-black-light mb-3">
                <span>{getTotalSelectedCandidates()}</span>
                <span className="px-2">{t(`${translationPath}selected`)}</span>
                <ButtonBase
                  className="btns-icon theme-transparent"
                  onClick={() => onIsBulkSelectChanged(false)}
                >
                  <span className="fas fa-times" />
                </ButtonBase>
                <div className="separator-v mih-32px mx-1" />
              </span>
              <ButtonBase
                className={`btns theme-transparent miw-0 mb-3${
                  (popoverAttachedWith.moveTo && ' is-active') || ''
                }`}
                disabled={selectedCandidates.length === 0}
                onClick={(event) => popoverToggleHandler('moveTo', event)}
              >
                <span className="fas fa-share" />
                <span className="px-2">{t(`${translationPath}move-to`)}</span>
                <span
                  className={`fas fa-chevron-${
                    (popoverAttachedWith.moveTo && 'up') || 'down'
                  }`}
                />
              </ButtonBase>
              <ButtonBase
                className={`btns theme-transparent miw-0 mb-3${
                  (popoverAttachedWith.actions && ' is-active') || ''
                }`}
                disabled={selectedCandidates.length === 0}
                onClick={(event) => popoverToggleHandler('actions', event)}
              >
                <span>{t(`${translationPath}actions`)}</span>
                <span
                  className={`px-2 fas fa-chevron-${
                    (popoverAttachedWith.actions && 'up') || 'down'
                  }`}
                />
              </ButtonBase>
            </>
          )) || (
            <>
              <SharedInputControl
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                // editValue={candidatesFilters.search}
                isDisabled={isLoading}
                stateKey="search"
                placeholder="search"
                wrapperClasses="px-2"
                onInputBlur={(newValue) => {
                  onCandidatesFiltersChanged({ search: newValue.value });
                  VitallyTrack('EVA-REC - Search on Candidate');
                }}
                executeOnInputBlur
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onCandidatesFiltersChanged({ search: event.target.value });
                    VitallyTrack('EVA-REC - Search on Candidate');
                  }
                }}
                startAdornment={
                  <div className="start-adornment-wrapper">
                    <span className="fas fa-search" />
                  </div>
                }
              />
              <ButtonBase
                className="btns theme-transparent miw-0 mb-3"
                onClick={() => onIsOpenDialogsChanged('filters', true)}
              >
                {/* <span className="fas fa-sliders-h" /> */}
                <span>{t(`${translationPath}filters`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent miw-0 mb-3"
                // disabled
                onClick={(e) => popoverToggleHandler('sort', e)}
              >
                {/* <span className="fas fa-sliders-h" /> */}
                <span>{t(`${translationPath}sort`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent miw-0 mb-3"
                // disabled
                onClick={(e) => popoverToggleHandler('headerActions', e)}
              >
                {/* <span className="fas fa-sliders-h" /> */}
                <span>{t(`${translationPath}actions`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent mb-3"
                onClick={() => onIsBulkSelectChanged(true)}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageApplicationsPermissions.BulkSelect.key,
                  })
                }
              >
                <span>{t(`${translationPath}bulk-select`)}</span>
              </ButtonBase>
              {/* <ButtonBase */}
              {/*  className={`btns theme-transparent miw-0 mb-3${ */}
              {/*    (popoverAttachedWith.actions && ' is-active') || '' */}
              {/*  }`} */}
              {/*  onClick={(event) => popoverToggleHandler('actions', event)} */}
              {/* > */}
              {/*  <span>{t(`${translationPath}actions`)}</span> */}
              {/*  <span */}
              {/*    className={`px-2 fas fa-chevron-${ */}
              {/*      (popoverAttachedWith.actions && 'up') || 'down' */}
              {/*    }`} */}
              {/*  /> */}
              {/* </ButtonBase> */}
              {!userReducer?.results?.user?.is_provider && (
                <ButtonBase
                  className="btns theme-transparent miw-0 mb-3"
                  onClick={() => onIsOpenDialogsChanged('manageWeights', true)}
                  disabled={
                    !activePipeline
                    || !activePipeline.stages
                    || !activePipeline.stages.length
                    || !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageApplicationsPermissions.MangeWeight.key,
                    })
                  }
                >
                  {/* <span className="fas fa-balance-scale" /> */}
                  <span>{t(`${translationPath}weights`)}</span>
                </ButtonBase>
              )}
              <ButtonBase
                className={`btns theme-transparent miw-0 mb-3${
                  (popoverAttachedWith.customView && ' is-active') || ''
                }`}
                onClick={(event) => popoverToggleHandler('customView', event)}
              >
                <span className="fas fa-ellipsis-h" />
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent miw-0 mb-3"
                onClick={() => onIsOpenDialogsChanged('teams', true)}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageApplicationsPermissions.MangeTeams.key,
                  })
                }
              >
                <span className="fas fa-users" />
                <span className="px-1">{t(`${translationPath}teams`)}</span>
              </ButtonBase>
            </>
          )}

          {/* {activeJob && activeJob.reference_number && ( */}
          {/*  <ButtonBase */}
          {/*    className="btns theme-transparent mb-3" */}
          {/*    onClick={() => copyTextToClipboard(activeJob.reference_number)} */}
          {/*  > */}
          {/*    <span>{t(`${translationPath}reference-number-copy`)}</span> */}
          {/*    <span className="px-1">{activeJob.reference_number}</span> */}
          {/*    <span className="fas fa-copy" /> */}
          {/*  </ButtonBase> */}
          {/* )} */}
          <PopoverComponent
            idRef="moveToAndStagesPopoverRef"
            attachedWith={popoverAttachedWith.moveTo}
            handleClose={() => popoverToggleHandler('moveTo')}
            popoverClasses="pipeline-move-to-popover-wrapper"
            component={
              <div className="pipeline-move-to-popover-items-wrapper">
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  disabled={selectedCandidates.length === 0}
                  onClick={() => {
                    onIsBulkSelectChanged(false);
                    popoverToggleHandler('moveTo');
                  }}
                >
                  <span className="fas fa-times" />
                  <span className="px-2">{t(`${translationPath}deselect-all`)}</span>
                </ButtonBase>
                {isEvaSSESS && (
                  <ButtonBase className="btns theme-transparent w-100 mx-0 fj-start">
                    <span className="far fa-bell" />
                    <span className="px-2">
                      {t(`${translationPath}remind-about-selected`)}
                    </span>
                  </ButtonBase>
                )}
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  disabled={
                    selectedCandidates.length === 0
                    || !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.ShareEvaRecApplication.key,
                    })
                  }
                  onClick={() => {
                    onIsOpenDialogsChanged('shareProfile', true);
                    popoverToggleHandler('moveTo');
                  }}
                >
                  <span className="fas fa-external-link-alt" />
                  <span className="px-2">
                    {t(`${translationPath}share-selected`)}
                  </span>
                </ButtonBase>
                <div className="separator-h my-2" />
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  // disabled={!selectedCandidates.length}
                  onClick={() => {
                    onOpenedDetailsSectionChanged(
                      PipelineDetailsSectionEnum.Info.key,
                    );
                    onPopoverAttachedWithChanged('moveTo', null);
                  }}
                >
                  <span className="fas fa-external-link-alt" />
                  <span className="px-2">{t(`${translationPath}view-info`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  onClick={() => {
                    onOpenedDetailsSectionChanged(
                      PipelineDetailsSectionEnum.Logs.key,
                    );
                    popoverToggleHandler('moveTo');
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageApplicationsPermissions.ViewLogs.key,
                    })
                  }
                >
                  <span className="far fa-clock" />
                  <span className="px-2">{t(`${translationPath}view-log`)}</span>
                </ButtonBase>
                <div className="separator-h my-2" />
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  onClick={() => {
                    onIsOpenDialogsChanged(
                      'moveToManagement',
                      PipelineMoveToTypesEnum.Stage.key,
                    );
                    popoverToggleHandler('moveTo');
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.MoveEvaRecApplication.key,
                    })
                  }
                >
                  <span className="fas fa-share" />
                  <span className="px-2">
                    {t(`${translationPath}move-to-stage`)}
                  </span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  onClick={() => {
                    onIsOpenDialogsChanged(
                      'moveToManagement',
                      PipelineMoveToTypesEnum.Pipeline.key,
                    );
                    popoverToggleHandler('moveTo');
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.ChangePipelines.key,
                    })
                  }
                >
                  <span className="fas fa-share" />
                  <span className="px-2">
                    {t(`${translationPath}move-to-pipeline`)}
                  </span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  onClick={() => {
                    onIsOpenDialogsChanged(
                      'moveToManagement',
                      PipelineMoveToTypesEnum.Job.key,
                    );
                    popoverToggleHandler('moveTo');
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.MoveToAnotherJob.key,
                    })
                  }
                >
                  <span className="fas fa-share" />
                  <span className="px-2">{t(`${translationPath}move-to-job`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent w-100 mx-0 fj-start"
                  onClick={() => {
                    onIsOpenDialogsChanged(
                      'moveToManagement',
                      PipelineMoveToTypesEnum.Flow.key,
                    );
                    popoverToggleHandler('moveTo');
                  }}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.MoveToOnboarding.key,
                    })
                  }
                >
                  <span className="fas fa-share" />
                  <span className="px-2">{t(`${translationPath}move-to-flow`)}</span>
                </ButtonBase>
                {/*<div className="separator-h my-2" />*/}
                {/*<ButtonBase*/}
                {/*  className="btns theme-transparent w-100 mx-0 fj-start"*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  <span className="far fa-envelope" />*/}
                {/*  <span className="px-2">{t(`${translationPath}send-email`)}</span>*/}
                {/*</ButtonBase>*/}
                {/*<div className="separator-h my-2" />*/}
                {/*<ButtonBase*/}
                {/*  className="btns theme-transparent w-100 mx-0 fj-start"*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  <span className="fas fa-plus" />*/}
                {/*  <span className="px-2">{t(`${translationPath}add-action`)}</span>*/}
                {/*</ButtonBase>*/}
                {/*<div className="separator-h my-2" />*/}
                {/*<ButtonBase*/}
                {/*  className="btns theme-transparent w-100 mx-0 fj-start"*/}
                {/*  disabled*/}
                {/*>*/}
                {/*  <span className="fas fa-plus" />*/}
                {/*  <span className="px-2">*/}
                {/*    {t(`${translationPath}manage-card-view`)}*/}
                {/*  </span>*/}
                {/*</ButtonBase>*/}
              </div>
            }
          />
          <PopoverComponent
            idRef="customViewPopoverRef"
            attachedWith={popoverAttachedWith.customView}
            handleClose={() => popoverToggleHandler('customView')}
            popoverClasses="stages-display-popover"
            component={
              <div className="stage-display-items-wrapper">
                <div className="stage-display-item">
                  <CheckboxesComponent
                    idRef="checkAllRef"
                    singleChecked={getIsVisibleAll()}
                    singleIndeterminate={getIsSomeVisible()}
                    onSelectedCheckboxChanged={onIsAllVisibleStageChanged}
                    label="all"
                    parentTranslationPath={parentTranslationPath}
                    translationPathForData={translationPath}
                    translationPath={translationPath}
                  />
                </div>
                {activePipeline
                  && activePipeline.stages
                  && activePipeline.stages.map((item, index) => (
                    <div
                      className="stage-display-item"
                      key={`stagesDisplayKeys${index + 1}`}
                    >
                      <CheckboxesComponent
                        idRef={`stagesDisplayRef${index + 1}`}
                        singleChecked={getIsVisibleStage(item.uuid)}
                        label={item.title}
                        onSelectedCheckboxChanged={onIsVisibleStageChanged(
                          item.uuid,
                        )}
                      />
                    </div>
                  ))}
              </div>
            }
          />
          <PopoverComponent
            idRef="customActionsPopoverRef"
            attachedWith={popoverAttachedWith.actions}
            handleClose={() => popoverToggleHandler('actions')}
            popoverClasses="stages-display-popover"
            component={
              <div className="d-flex-column stage-display-items-wrapper">
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) => popoverToggleHandler('sendActions', event)}
                >
                  <span>{t(`${translationPath}send`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('export', event.currentTarget)
                  }
                >
                  <span>{t(`${translationPath}export`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('shareProfile', event.currentTarget)
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.ShareEvaRecApplication.key,
                    })
                  }
                >
                  <span>{t(`${translationPath}share-profile`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('scheduleInterview', event.currentTarget)
                  }
                  // disabled={
                  //   !getIsAllowedPermissionV2({
                  //     permissions,
                  //     permissionId:
                  //       ManageApplicationsPermissions.SendVideoAssessment.key,
                  //   })
                  // }
                >
                  <span>{t(`${translationPath}schedule-interview`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('assignCandidates', event.currentTarget)
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: ManageApplicationsPermissions.AssignUser.key,
                      permissions,
                    })
                  }
                >
                  <span>{t(`${translationPath}assign`)}</span>
                </ButtonBase>
              </div>
            }
          />
          <PopoverComponent
            idRef="sendActionsPopoverRef"
            attachedWith={popoverAttachedWith.sendActions}
            handleClose={() => popoverToggleHandler('sendActions')}
            popoverClasses="stages-display-popover"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            component={
              <div className="d-flex-column stage-display-items-wrapper">
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('sendQuestionnaire', event.currentTarget)
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.SendQuestionnaire.key,
                    })
                  }
                >
                  <span>{t(`${translationPath}questionnaire`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged(
                      'sendVideoAssessment',
                      event.currentTarget,
                    )
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.SendVideoAssessment.key,
                    })
                  }
                >
                  <span>{t(`${translationPath}video-assessment`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged(
                      'sendCentralAssessment',
                      event.currentTarget,
                    )
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.SendVideoAssessment.key,
                    }) || isConnectionLoading
                  }
                >
                  <span>{t(`${translationPath}assessment-test`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged(
                      'sendCentralAssessmentReminder',
                      event.currentTarget,
                    )
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId:
                        ManageApplicationsPermissions.SendVideoAssessment.key,
                    })
                  }
                >
                  <span>{t(`${translationPath}assessment-reminder`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('sendForm', event.currentTarget)
                  }
                  // disabled={
                  //   !getIsAllowedPermissionV2({
                  //     permissions,
                  //     permissionId:
                  //       ManageApplicationsPermissions.SendOffer.key,
                  //   })
                  // }
                >
                  <span>{t(`${translationPath}form`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('sendOffer', event.currentTarget)
                  }
                >
                  <span>{t(`${translationPath}offer`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary fj-start"
                  onClick={(event) =>
                    onIsOpenDialogsChanged('sendOfferReminder', event.currentTarget)
                  }
                >
                  <span>{t(`${translationPath}offer-reminder`)}</span>
                </ButtonBase>
              </div>
            }
          />
          <PopoverComponent
            idRef="sortingViewPopoverRef"
            attachedWith={popoverAttachedWith.sort}
            handleClose={() => popoverToggleHandler('sort')}
            popoverClasses="stages-display-popover"
            component={
              <div className="d-flex-column stage-display-items-wrapper">
                {Object.values(SortingCriteriaEnum)
                  .filter(
                    (criteria) =>
                      criteria.hiddenIn
                      && criteria.hiddenIn.indexOf(
                        SortingCriteriaCallLocationsEnum.PipelineHeader.key,
                      ) === -1,
                  )
                  .map((criteria) => (
                    <ButtonBase
                      key={criteria.id}
                      className="btns theme-transparent mx-0 miw-0 c-gray-primary"
                      onClick={() => {
                        popoverToggleHandler('sort');
                        onCandidatesFiltersChanged({
                          order_by: criteria.order_by,
                          order_type: criteria.order_type,
                        });
                      }}
                    >
                      <span>{t(`${translationPath}${criteria.title}`)}</span>
                    </ButtonBase>
                  ))}
              </div>
            }
          />
          <PopoverComponent
            idRef="actionsViewPopoverRef"
            attachedWith={popoverAttachedWith.headerActions}
            handleClose={() => popoverToggleHandler('headerActions')}
            popoverClasses="stages-display-popover"
            component={
              <div className="d-flex-column stage-display-items-wrapper">
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary"
                  onClick={(event) => {
                    popoverToggleHandler('headerActions');
                    onIsOpenDialogsChanged('inviteStatus', event.currentTarget);
                  }}
                >
                  <span>{t(`${translationPath}invite-status`)}</span>
                </ButtonBase>
              </div>
            }
          />
        </div>
      </div>
      <FiltersDisplaySection
        filters={filters}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onFiltersChanged={onFiltersChanged}
        onFiltersResetClicked={onFiltersResetClicked}
      />
      {isOpenDialogs.moveToManagement && (
        <MoveToManagementDialog
          jobUUID={jobUUID}
          jobPipelineUUID={activeJobPipelineUUID}
          activeJob={activeJob}
          activePipeline={activePipeline}
          selectedCandidates={selectedCandidates}
          getIsDisabledTargetStage={getIsDisabledTargetStage}
          isOpen={Boolean(isOpenDialogs.moveToManagement)}
          selectedPipelineMoveToType={isOpenDialogs.moveToManagement}
          getPipelinePreMoveCheck={getPipelinePreMoveCheck}
          onSave={onSaveMoveToHandler}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('moveToManagement', null);
          }}
          selectedConfirmedStages={selectedConfirmedStages}
          onSelectedConfirmedStagesChanged={onSelectedConfirmedStagesChanged}
          getTotalSelectedCandidates={getTotalSelectedCandidates}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          reinitializeFilteredCandidates={reinitializeFilteredCandidates}
          showMoveToArchivedAfterSave={showMoveJobToArchivedHandler}
          onboardingTeams={activeJob.onboarding_teams || {}}
          isFromBulkSelect={true}
          isShowMoveToOptions={true}
        />
      )}
      <NotesDialog
        jobUUID={jobUUID}
        isOpen={isOpenDialogs.notes}
        isOpenChanged={() => {
          onIsOpenDialogsChanged('notes', false);
        }}
      />
      <TeamsDialog
        jobUUID={jobUUID}
        isOpen={isOpenDialogs.teams}
        onSave={() => {
          if (onChangeTheActiveJobData) onChangeTheActiveJobData();
        }}
        isOpenChanged={() => {
          onIsOpenDialogsChanged('teams', false);
        }}
        selectedCandidates={selectedCandidates}
      />
      <ManageWeightsDialog
        jobUUID={jobUUID}
        isOpen={isOpenDialogs.manageWeights}
        onSave={onForceToReloadCandidatesChanged}
        isOpenChanged={() => {
          onIsOpenDialogsChanged('manageWeights', false);
        }}
      />

      <ManageQuestionnairesDialog
        jobUUID={jobUUID}
        isOpen={isOpenDialogs.manageQuestionnaires}
        isOpenChanged={() => {
          onIsOpenDialogsChanged('manageQuestionnaires', false);
        }}
      />

      {isOpenDialogs.filters && (
        <FilterModal
          filterEditValue={filters.filters}
          filterEditValueTags={filters.tags}
          callLocation={FilterDialogCallLocationsEnum.EvaRecPipelines.key}
          isOpen={isOpenDialogs.filters}
          isWithSliders
          onClose={() => {
            onIsOpenDialogsChanged('filters', false);
          }}
          onApply={onApplyHandler}
          showTags
          job_uuid={jobUUID}
          showAssessmentTestFilter
          isShowHeightAndWeight={true}
          isShowVideoAssessmentFilter={true}
          isShowQuestionnaireFilter={true}
          isShowDynamicProperty={true}
          isShowAssigneeFilter={true}
          isShowAge={true}
        />
      )}
      {/*<FiltersDialog*/}
      {/*  jobUUID={jobUUID}*/}
      {/*  isOpen={isOpenDialogs.filters}*/}
      {/*  isOpenChanged={() => {*/}
      {/*    onIsOpenDialogsChanged('filters', false);*/}
      {/*  }}*/}
      {/*  saveFilters={(params) => {*/}
      {/*    console.log(params);*/}
      {/*    onCandidatesFiltersChanged(params);*/}
      {/*    setFilters(params);*/}
      {/*  }}*/}
      {/*/>*/}

      <JobPipelinesManagementDialog
        jobUUID={jobUUID}
        isOpen={isOpenDialogs.jobPipelinesManagement}
        onSave={onSetActiveJobChanged}
        activeJob={activeJob} // needed for deleted pipelines update
        isOpenChanged={() => {
          onIsOpenDialogsChanged('jobPipelinesManagement', false);
        }}
      />

      {isOpenDialogs.sendQuestionnaire && (
        <SendQuestionnaireDialog
          jobUUID={jobUUID}
          pipelineUUID={activePipeline.origin_pipeline_uuid}
          isOpen={isOpenDialogs.sendQuestionnaire}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendQuestionnaire', false);
          }}
          selectedCandidates={reinitializeFilteredCandidates(selectedCandidates)}
        />
      )}

      {isOpenDialogs.shareProfile && (
        <ShareProfileDialog
          jobUUID={jobUUID}
          isOpen={isOpenDialogs.shareProfile}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('shareProfile', false);
          }}
          selectedCandidates={reinitializeFilteredCandidates(selectedCandidates)}
        />
      )}

      {isOpenDialogs.sendVideoAssessment && (
        <SendVideoAssessmentDialog
          jobUUID={jobUUID}
          isOpen={isOpenDialogs.sendVideoAssessment}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendVideoAssessment', false);
          }}
          selectedCandidates={reinitializeFilteredCandidates(selectedCandidates)}
        />
      )}
      {isOpenDialogs.sendForm && (
        <FormInviteManagementDialog
          isOpen={isOpenDialogs.sendForm}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          // selectedConfirmedStages={selectedConfirmedStages}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendForm', false);
          }}
        />
      )}
      {isOpenDialogs.inviteStatus && (
        <InviteStatus
          isOpen={isOpenDialogs.inviteStatus}
          closeModal={() => {
            onIsOpenDialogsChanged('inviteStatus', false);
          }}
          onClick={() => {
            onIsOpenDialogsChanged('inviteStatus', false);
          }}
          parentTranslationPath="EvaSSESSPipeline"
          forEvaRec
          jobUUID={jobUUID}
        />
      )}

      {isOpenDialogs.scheduleInterview && (
        <DialogComponent
          maxWidth="md"
          titleText="schedule-interview"
          contentClasses="px-0"
          dialogContent={
            <CandidateMeetingsComponent
              type="ats"
              from_feature={MeetingFromFeaturesEnum.ATS.key}
              selectedConfirmedStages={selectedConfirmedStages}
              totalSelectedCandidates={getTotalSelectedCandidates()}
              candidateList={selectedCandidates}
            />
          }
          wrapperClasses="schedule-interview-dialog-wrapper"
          isOpen={isOpenDialogs.scheduleInterview}
          onCloseClicked={() => {
            onIsOpenDialogsChanged('scheduleInterview', false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenDialogs.sendCentralAssessment && (
        <SendCentralAssessmentDialog
          isOpen={isOpenDialogs.sendCentralAssessment}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          type="ats"
          isDisabledTestlify={
            !getIsConnectedPartner({
              key: IntegrationsPartnersEnum.Testlify.key,
            })
          }
          // selectedConfirmedStages={selectedConfirmedStages}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendCentralAssessment', false);
          }}
        />
      )}
      {isOpenDialogs?.sendCentralAssessmentReminder && (
        <SendCentralAssessmentDialog
          titleText={'send-assessment-reminder'}
          isOpen={isOpenDialogs?.sendCentralAssessmentReminder}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          type="ats"
          isReminder={true}
          isDisabledTestlify
          // selectedConfirmedStages={selectedConfirmedStages}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendCentralAssessmentReminder', false);
          }}
        />
      )}
      {isOpenDialogs?.export && (
        <ExportDialog
          isOpen={isOpenDialogs?.export}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          job_uuid={(activeJob && activeJob.uuid) || null}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('export', false);
          }}
          onSave={onForceToReloadCandidatesChanged}
        />
      )}
      {isOpenDialogs?.assignCandidates && (
        <AssignCandidatesToUsersDialog
          titleText={'assign-candidates-to-user-employee'}
          isOpen={isOpenDialogs?.assignCandidates}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          job_uuid={(activeJob && activeJob.uuid) || null}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('assignCandidates', false);
          }}
          onSave={onForceToReloadCandidatesChanged}
        />
      )}

      {isOpenDialogs.sendOffer && (
        <OffersInviteManagementDialog
          isOpen={isOpenDialogs.sendOffer}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendOffer', false);
          }}
        />
      )}
      {isOpenDialogs.sendOfferReminder && (
        <OffersInviteManagementDialog
          isOpen={isOpenDialogs.sendOfferReminder}
          selectedCandidates={reinitializeFilteredCandidates(
            selectedCandidates,
            true,
          )}
          titleText="send-offer-reminder"
          isReminder={true}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          job_pipeline_uuid={activeJobPipelineUUID}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('sendOfferReminder', false);
          }}
        />
      )}
    </div>
  );
};

PipelineHeaderSection.propTypes = {
  activeJob: PropTypes.instanceOf(Object),
  isOpenDialogs: PropTypes.shape({
    manageWeights: PropTypes.bool,
    manageQuestionnaires: PropTypes.bool,
    notes: PropTypes.bool,
    teams: PropTypes.bool,
    share: PropTypes.bool,
    filters: PropTypes.bool,
    jobPipelinesManagement: PropTypes.bool,
    // info: PropTypes.bool,
    addCandidate: PropTypes.bool,
    sendQuestionnaire: PropTypes.bool,
    shareProfile: PropTypes.bool,
    moveToManagement: PropTypes.number,
    sendVideoAssessment: PropTypes.bool,
    candidateModal: PropTypes.bool,
    scheduleInterview: PropTypes.bool,
    sendForm: PropTypes.bool,
    sendOffer: PropTypes.bool,
    sendOfferReminder: PropTypes.bool,
    sendCentralAssessment: PropTypes.bool,
    sendCentralAssessmentReminder: PropTypes.bool,
    assignCandidates: PropTypes.bool,
    inviteStatus: PropTypes.bool,
    export: PropTypes.bool,
  }).isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  popoverAttachedWith: PropTypes.shape({
    others: PropTypes.instanceOf(Object),
    customView: PropTypes.instanceOf(Object),
    moveTo: PropTypes.instanceOf(Object),
    actions: PropTypes.instanceOf(Object),
    sendActions: PropTypes.instanceOf(Object),
    headerActions: PropTypes.instanceOf(Object),
    sort: PropTypes.instanceOf(Object),
  }).isRequired,
  onPopoverAttachedWithChanged: PropTypes.func.isRequired,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    origin_pipeline_uuid: PropTypes.string,
    stages: PropTypes.instanceOf(Array),
  }),
  activeJobPipelineUUID: PropTypes.string,
  selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string),
  fromModule: PropTypes.shape({
    title: PropTypes.string,
    backUrl: PropTypes.string,
  }),
  hiddenStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  jobUUID: PropTypes.string,
  isLoading: PropTypes.bool,
  isEvaSSESS: PropTypes.bool.isRequired,
  isBulkSelect: PropTypes.bool.isRequired,
  onIsBulkSelectChanged: PropTypes.func.isRequired,
  onChangeTheActiveJobData: PropTypes.func.isRequired,
  onOpenedDetailsSectionChanged: PropTypes.func.isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ),
  onHiddenStagesChanged: PropTypes.func.isRequired,
  reinitializeFilteredCandidates: PropTypes.func.isRequired,
  onActiveJobChanged: PropTypes.func.isRequired,
  onForceToReloadCandidatesChanged: PropTypes.func.isRequired,
  getPipelinePreMoveCheck: PropTypes.func.isRequired,
  getTotalSelectedCandidates: PropTypes.func.isRequired,
  onActivePipelineChanged: PropTypes.func.isRequired,
  onSetActiveJobChanged: PropTypes.func.isRequired,
  // getReturnedData: PropTypes.func.isRequired,
  // candidatesFilters: PropTypes.shape({
  //   order_type: PropTypes.oneOf(['ASC', 'DESC']),
  //   order_by: PropTypes.number,
  //   search: PropTypes.string,
  // }),
  onCandidatesFiltersChanged: PropTypes.func,
  onSelectedConfirmedStagesChanged: PropTypes.func.isRequired,
  getIsDisabledTargetStage: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  scorecardDrawersHandler: PropTypes.func,
  filters: PropTypes.instanceOf(Object),
  onFiltersChanged: PropTypes.func,
  getIsConnectedPartner: PropTypes.func.isRequired,
  isConnectionLoading: PropTypes.bool.isRequired,
  showMoveJobToArchivedHandler: PropTypes.func,
};
PipelineHeaderSection.defaultProps = {
  activeJob: undefined,
  fromModule: {
    title: 'eva-rec',
    backUrl: '/recruiter/job/manage/active',
  },
  activePipeline: undefined,
  isLoading: undefined,
  jobUUID: undefined,
  selectedCandidates: [],
  candidatesFilters: undefined,
  onCandidatesFiltersChanged: undefined,
  activeJobPipelineUUID: undefined,
};
