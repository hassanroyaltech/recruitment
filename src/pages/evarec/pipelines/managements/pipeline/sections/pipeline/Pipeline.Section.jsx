import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './Pipeline.Style.scss';
import ButtonBase from '@mui/material/ButtonBase';
import { StageCandidatesSection } from './sections';
import { GetReorderDraggedItems } from '../../../../../../evabrand/helpers';
import {
  GetAllStagesCandidates,
  PipelineMoveTo,
  UpdateEvaRecJobPipelineStagesReorder,
} from '../../../../../../../services';
import {
  getIsAllowedPermissionV2,
  GetToasterInstance,
  showError,
  showSuccess,
} from '../../../../../../../helpers';
import { PipelineStageMovementTypes } from '../../../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import { CheckboxesComponent } from '../../../../../../../components';
import JobCandidateModal from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/index.jsx';
import {
  PipelineBulkSelectTypesEnum,
  PipelineMoveToTypesEnum,
} from '../../../../../../../enums';
import i18next from 'i18next';
import { ManageApplicationsPermissions } from '../../../../../../../permissions';
import { useSelector } from 'react-redux';
import { useQuery } from '../../../../../../../hooks';
import useVitally from '../../../../../../../hooks/useVitally.Hook';

export const PipelineSection = ({
  activePipeline,
  activeJob,
  jobUUID,
  // pipelineUUID,
  onSelectedCandidatesChanged,
  getPipelinePreMoveCheck,
  selectedAllLoadedStageCandidates,
  onSelectedAllLoadedStageCandidatesChanged,
  selectedConfirmedStages,
  onSelectedConfirmedStagesChanged,
  selectedOnHoldStages,
  onSelectedOnHoldStagesChanged,
  getIsSelectedAllCandidates,
  getIsSelectedSomeCandidates,
  isBulkSelect,
  isLoading,
  onIsLoadingChanged,
  selectedCandidates,
  getIsSelectedCandidate,
  onActivePipelineDetailsChanged,
  onSetActiveJobChanged,
  onForceToReloadCandidatesChanged,
  hiddenStages,
  isForceToReloadCandidates,
  getIsDroppableSelectedCandidates,
  getFilteredCandidates,
  popoverAttachedWith,
  onPopoverAttachedWithChanged,
  isDisabledAllDragging,
  onIsDisabledAllDraggingChanged,
  setActiveStage,
  activeStage,
  candidatesFilters,
  setCandidatesFilters,
  onIsOpenDialogsChanged,
  isOpenDialogs,
  onLoadedCandidatesChanged,
  temporaryMovedCandidates,
  onTemporaryMovedCandidatesChanged,
  getIsDisabledTargetStage,
  // firstPageStagesCandidates,
  activeJobPipelineUUID,
  form_builder,
  parentTranslationPath,
  translationPath,
  onChangeTheActiveJobData,
  setBackDropLoader,
  reinitializeFilteredCandidates,
  onJobAssignHandler,
  scorecardAssignHandler,
  destroySessionFiltersRef,
  showMoveJobToArchivedHandler,
  getIsConnectedPartner,
  isConnectionLoading,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const query = useQuery();
  const selectedOnHoldStagesRef = useRef([]);
  const selectedConfirmedStagesRef = useRef([]);
  const selectAllToasterRef = useRef([]);
  // for current dragging candidate item (in bulk select mode or not)
  const [draggingCandidate, setDraggingCandidate] = useState(null);
  const [draggingCandidateDetails, setDraggingCandidateDetails] = useState(null);
  const confirmMoveTimesRef = useRef(null);
  const [activeItem, setActiveItem] = useState(null);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const { VitallyTrack } = useVitally();
  // const [isOpenCandidateDetailsDialog, setIsOpenCandidateDetailsDialog] = useState(false);

  /**
   * @param stageItem
   * @param stageIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the stage accept external candidates
   */
  const getIsDropCandidateDisabled = useCallback(
    (stageItem) =>
      stageItem.move_in_out_type === PipelineStageMovementTypes.Out.key
      || stageItem.move_in_out_type === PipelineStageMovementTypes.NotInNorOut.key,
    // || !getIsDroppableSelectedCandidates(stageItem.uuid),
    [],
  );
  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the update the dragging candidate details from child
   */
  const onDraggingCandidateDetailsChanged = useCallback((newValue) => {
    setDraggingCandidateDetails(newValue);
  }, []);

  /**
   * @param stageItem
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the stage can accept to remove any candidate from it
   */
  const getIsDragCandidateDisabled = useCallback(
    (stageItem) =>
      stageItem.move_in_out_type === PipelineStageMovementTypes.NotInNorOut.key
      || stageItem.move_in_out_type === PipelineStageMovementTypes.In.key,
    [],
  );

  /**
   * @param {isNext} - instance of object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the active candidate to the next or previous one
   */
  const onActiveCandidateChange = useCallback(
    ({ isNext } = { isNext: false }) =>
      () => {
        setActiveItem((items) => {
          const currentCandidateIndex = items.stage.candidates.findIndex(
            (item) => item.uuid === items.candidate.uuid,
          );
          if (currentCandidateIndex !== -1)
            if (isNext) {
              if (currentCandidateIndex + 1 < items.stage.candidates.length) {
                items.candidate = items.stage.candidates[currentCandidateIndex + 1];
                items.profile_uuid
                  = items.stage.candidates[currentCandidateIndex + 1].profile_uuid;
                items.candidateIndex = currentCandidateIndex + 1;
                return { ...items };
              }
            } else if (currentCandidateIndex - 1 >= 0) {
              items.candidate = items.stage.candidates[currentCandidateIndex - 1];
              items.profile_uuid
                = items.stage.candidates[currentCandidateIndex - 1].profile_uuid;
              items.candidateIndex = currentCandidateIndex - 1;
              return { ...items };
            } else {
              items.candidate = items.stage.candidates[0];
              items.candidateIndex = 0;
              return { ...items };
            }

          showError(
            `Sorry, but I can not found the ${
              (isNext && 'Next') || 'Previous'
            } Candidate for you`,
          );
          return items;
        });
      },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to scroll to the active candidate & make sure that the next candidate is loaded before
   * the user move to it by make the scroll at the end if (need to load more).
   */
  const scrollToActiveCandidateHandler = useCallback(() => {
    if (!activeItem) return;
    const currentStageElement = document.querySelector(
      `#stageId${activeItem.stage.uuid}`,
    );
    const currentCandidateElement = document.querySelector(
      `#candidateId${activeItem.candidate.uuid}`,
    );

    if (currentStageElement && currentCandidateElement) {
      const styles = window.getComputedStyle(currentCandidateElement);
      const elHeight
        = currentCandidateElement.clientHeight
        + parseFloat(styles['marginTop'])
        + parseFloat(styles['marginBottom']);
      const offset
        = Array.from(currentCandidateElement.parentNode.children).indexOf(
          currentCandidateElement,
        )
          * elHeight
        - elHeight / 2;
      currentStageElement.scrollTo({
        top: offset,
        behavior: 'smooth',
      });
    }
  }, [activeItem]);

  /**
   * @param stageUUID - string
   * @param stageUUID - string
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove the confirmation toaster if user uncheck the stage during its exist
   */
  const removeConfirmToasterHandler = useCallback(
    (stageUUID, isAlreadyRemoved = false) => {
      selectAllToasterRef.current = selectAllToasterRef.current.filter((item) => {
        if (item.stageUUID === stageUUID) {
          if (!isAlreadyRemoved) GetToasterInstance().dismiss(item.toaster);
          return false;
        }
        return true;
      });
    },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of the selected candidate
   */
  const selectCandidateChangeHandler = useCallback(
    (candidateItem, stageItem) => (event, isChecked) => {
      const localSelectedCandidates = [...(selectedCandidates || [])];
      if (isChecked) {
        localSelectedCandidates.push({
          stage: stageItem,
          candidate: candidateItem,
        });
        // to add the stage for all stage selected list when load more this logic while make it
        // selected too if all loaded selected only
        const currentStageSelectedCandidates = localSelectedCandidates.filter(
          (candidate) => candidate.stage.uuid === stageItem.uuid,
        );
        if (
          currentStageSelectedCandidates.length === stageItem.total_candidates
          && selectedAllLoadedStageCandidates.indexOf(stageItem.uuid) === -1
        ) {
          // note:- if u want to add in future the selected candidates to be stage to move even assign after
          // select then u can add this logic here by add them to the confirmation stages array (also)
          const localSelectLoadedStageCandidates = [
            ...(selectedAllLoadedStageCandidates || []),
          ];
          localSelectLoadedStageCandidates.push(stageItem.uuid);
          onSelectedAllLoadedStageCandidatesChanged(
            localSelectLoadedStageCandidates,
          );
        }
        // note: you can add here the else if selected candidate less than loaded but all loaded to show the confirmation
        // again from here
      } else {
        // this to remove the candidate from the list
        const candidateIndex = localSelectedCandidates.findIndex(
          (item) => item.candidate.uuid === candidateItem.uuid,
        );
        if (candidateIndex !== -1) {
          localSelectedCandidates.splice(candidateIndex, 1);
          const selectedAllIndex = selectedAllLoadedStageCandidates.indexOf(
            stageItem.uuid,
          );
          if (selectedAllIndex !== -1) {
            const localSelectLoadedStageCandidates = [
              ...(selectedAllLoadedStageCandidates || []),
            ];
            localSelectLoadedStageCandidates.splice(selectedAllIndex, 1);
            onSelectedAllLoadedStageCandidatesChanged(
              localSelectLoadedStageCandidates,
            );
          }
        }
        // this to remove the stage from bulk select & confirm if exist
        const stageIndexInConfirm = selectedConfirmedStagesRef.current.indexOf(
          stageItem.uuid,
        );
        const stageIndexInHold = selectedOnHoldStagesRef.current.indexOf(
          stageItem.uuid,
        );
        if (stageIndexInConfirm !== -1) {
          const localConfirmedStages = [...selectedConfirmedStagesRef.current];
          localConfirmedStages.splice(stageIndexInConfirm, 1);
          onSelectedConfirmedStagesChanged(localConfirmedStages);
        } else if (stageIndexInHold !== -1) {
          removeConfirmToasterHandler(stageItem.uuid);
          const localHoldStages = [...selectedOnHoldStagesRef.current];
          localHoldStages.splice(stageIndexInHold, 1);
          onSelectedOnHoldStagesChanged(localHoldStages);
        }
      }
      if (onSelectedCandidatesChanged)
        onSelectedCandidatesChanged(localSelectedCandidates);
    },
    [
      onSelectedAllLoadedStageCandidatesChanged,
      onSelectedCandidatesChanged,
      onSelectedConfirmedStagesChanged,
      onSelectedOnHoldStagesChanged,
      removeConfirmToasterHandler,
      selectedAllLoadedStageCandidates,
      selectedCandidates,
    ],
  );

  /**
   * @param stageUUID - string
   * @param stageTitle - string
   * @param totalCandidates - number
   * @param loadedCandidates - array of object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the stage can accept to remove any candidate from it
   */
  const selectAllCandidateChangeHandler = useCallback(
    (stageUUID, stageTitle, totalCandidates, loadedCandidates) =>
      (event, isChecked) => {
        const localSelectedStages = [...(selectedAllLoadedStageCandidates || [])];
        const localHoldStages = [...selectedOnHoldStagesRef.current];
        if (isChecked && !getIsSelectedSomeCandidates(stageUUID, totalCandidates)) {
          localSelectedStages.push(stageUUID);
          if (totalCandidates > loadedCandidates.length) {
            localHoldStages.push(stageUUID);
            onSelectedOnHoldStagesChanged(localHoldStages);
            selectAllToasterRef.current.push({
              stageUUID,
              toaster: showSuccess(
                `${t(
                  `${translationPath}select-all-stage-candidates-description`,
                )} ${stageTitle}, (${totalCandidates} ${t(
                  `${translationPath}candidates`,
                )}).`,
                {
                  actionHandler: () => {
                    const localSelectedOnHoldStages = [
                      ...selectedOnHoldStagesRef.current,
                    ];
                    const selectedHoldStageIndex
                      = localSelectedOnHoldStages.indexOf(stageUUID);
                    if (selectedHoldStageIndex !== -1) {
                      localSelectedOnHoldStages.splice(selectedHoldStageIndex, 1);
                      onSelectedOnHoldStagesChanged(localSelectedOnHoldStages);
                      const localConfirmStages = [
                        ...selectedConfirmedStagesRef.current,
                      ];
                      localConfirmStages.push(stageUUID);
                      onSelectedConfirmedStagesChanged(localConfirmStages);
                    }
                  },
                  actionHandlerText: 'ok',
                  pauseOnHover: false,
                  position: 'bottom-center',
                  onClose: () => {
                    removeConfirmToasterHandler(stageUUID, true);
                  },
                  style: { minWidth: 400 },
                },
              ),
            });
          }
        } else {
          const selectedStageIndex = localSelectedStages.indexOf(stageUUID);
          if (selectedStageIndex !== -1)
            localSelectedStages.splice(selectedStageIndex, 1);
          const localSelectedCandidates = [...(selectedCandidates || [])].filter(
            (item) => item.stage.uuid !== stageUUID,
          );
          const selectedHoldStageIndex = localHoldStages.indexOf(stageUUID);
          if (selectedHoldStageIndex !== -1) {
            localHoldStages.splice(selectedHoldStageIndex, 1);
            removeConfirmToasterHandler(stageUUID);
            onSelectedOnHoldStagesChanged(localHoldStages);
          }
          const localConfirmStages = [...selectedConfirmedStagesRef.current];
          const selectedConfirmStageIndex = localConfirmStages.indexOf(stageUUID);
          if (selectedConfirmStageIndex !== -1) {
            localConfirmStages.splice(selectedConfirmStageIndex, 1);
            onSelectedConfirmedStagesChanged(localConfirmStages);
          }
          onSelectedCandidatesChanged(localSelectedCandidates);
        }
        if (onSelectedAllLoadedStageCandidatesChanged)
          onSelectedAllLoadedStageCandidatesChanged(localSelectedStages);
      },
    [
      getIsSelectedSomeCandidates,
      onSelectedAllLoadedStageCandidatesChanged,
      onSelectedCandidatesChanged,
      onSelectedConfirmedStagesChanged,
      onSelectedOnHoldStagesChanged,
      removeConfirmToasterHandler,
      selectedAllLoadedStageCandidates,
      selectedCandidates,
      t,
      translationPath,
    ],
  );

  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reorder stages items or change the dragged candidate stage
   */
  const onDragEndHandler = async (dropEvent) => {
    if (draggingCandidate) setDraggingCandidate(null);
    if (!dropEvent.destination) return;

    if (dropEvent.type === 'candidate') {
      if (
        dropEvent.destination.index === dropEvent.source.index
        && dropEvent.destination.droppableId === dropEvent.source.droppableId
      )
        return;
      if (
        !getIsDroppableSelectedCandidates({
          stageUUID: dropEvent.destination.droppableId,
          isWithMessage: true,
          currentStages: activePipeline.stages,
          toCheckCandidates: selectedCandidates,
          currentDraggingCandidate: draggingCandidate,
        })
      )
        return;
      const localSelectedCandidates = [...(selectedCandidates || [])];
      const localTargetStageItem = activePipeline.stages.find(
        (stage) => stage.uuid === dropEvent.destination.droppableId,
      );
      if (
        draggingCandidateDetails
        && (!isBulkSelect
          || !localSelectedCandidates.some(
            (item) =>
              item.candidate.uuid === draggingCandidateDetails.candidate.uuid,
          ))
      ) {
        localSelectedCandidates.push(draggingCandidateDetails);
        setDraggingCandidateDetails(null);
      }
      const remainingCandidatesAfterFilter = getFilteredCandidates({
        candidates: localSelectedCandidates,
        targetStageItem: localTargetStageItem,
        isWithMessage: true,
      });

      const preMoveRes = await getPipelinePreMoveCheck(
        remainingCandidatesAfterFilter,
        dropEvent.destination.droppableId,
      );
      if (preMoveRes.totalCanMove <= 0) return;

      onIsDisabledAllDraggingChanged(true);
      onTemporaryMovedCandidatesChanged({
        candidates: remainingCandidatesAfterFilter.map((item) => ({
          ...item.candidate,
        })),
        stage_uuid: localTargetStageItem.uuid,
        is_successfully_confirmed: false,
      });
      // Start timeout
      confirmMoveTimesRef.current = setTimeout(async () => {
        const confirmResponse = await PipelineMoveTo({
          job_uuid: jobUUID,
          job_pipeline_uuid: activeJobPipelineUUID,
          selected_candidates: preMoveRes?.candidatesToMove
            ? preMoveRes.candidatesToMove.map((item) => ({
              uuid: item,
              type: PipelineBulkSelectTypesEnum.Candidate.key,
            }))
            : reinitializeFilteredCandidates(remainingCandidatesAfterFilter),
          move_to_type: PipelineMoveToTypesEnum.Stage.key,
          move_to_branch_uuid: null,
          move_to_job_uuid: null,
          move_to_job_pipeline_uuid: null,
          move_to_stage_uuid: dropEvent.destination.droppableId,
          move_to_notes: null,
        });
        // removed because there is loading for the candidates from start will happen
        // onIsDisabledAllDraggingChanged(false);
        if (confirmResponse && confirmResponse.status === 202) {
          showMoveJobToArchivedHandler(localTargetStageItem.uuid);
          VitallyTrack('EVA-REC - Move candidate between stages');
          setTimeout(() => {
            window?.ChurnZero?.push([
              'trackEvent',
              'EVA-REC - Move candidate between stages',
              'Move candidate between stages from EVA-REC',
              1,
              {},
            ]);
            if (isBulkSelect) {
              onSelectedConfirmedStagesChanged([]);
              onSelectedOnHoldStagesChanged([]);
              onSelectedAllLoadedStageCandidatesChanged([]);
              onSelectedCandidatesChanged([]);
            }
            onTemporaryMovedCandidatesChanged({
              is_successfully_confirmed: true,
            });
          }, 2000);
        } else {
          onTemporaryMovedCandidatesChanged({
            candidates: [],
            stage_uuid: null,
            is_successfully_confirmed: false,
          });
          showError(
            t(`${translationPath}candidates-stage-change-failed`),
            confirmResponse,
          );
        }
      }, 5001);

      // ToastPipeline
      showSuccess(t(`${translationPath}candidates-moved-successfully`), {
        actionHandler: () => {
          clearTimeout(confirmMoveTimesRef.current);
          // ChangeOrConfirmCandidateStage({
          //   move_id,
          //   action: false,
          // });
          onIsDisabledAllDraggingChanged(false);
          if (selectedCandidates.length) {
            onSelectedConfirmedStagesChanged([]);
            onSelectedOnHoldStagesChanged([]);
            onSelectedAllLoadedStageCandidatesChanged([]);
            onSelectedCandidatesChanged([]);
          }
          onTemporaryMovedCandidatesChanged({
            candidates: [],
            stage_uuid: null,
            is_successfully_confirmed: false,
          });
        },
        pauseOnHover: false,
        position: 'bottom-center',
        style: { minWidth: 400 },
      });
    }
    if (
      dropEvent.type !== 'stages'
      || dropEvent.destination.index === dropEvent.source.index
    )
      return;
    const reorderedItems = GetReorderDraggedItems(
      dropEvent,
      (activePipeline && activePipeline.stages) || [],
    );
    if (!reorderedItems) return;
    const toSaveReorderedStages = [...(reorderedItems || [])];
    onIsLoadingChanged(true);
    const response = await UpdateEvaRecJobPipelineStagesReorder({
      pipeline_uuid: activeJobPipelineUUID,
      list: toSaveReorderedStages.map((item, index) => ({
        uuid: item.uuid,
        order: index,
      })),
    });
    onIsLoadingChanged(false);
    if (response && response.status === 202) {
      reorderedItems.map((item, index) => {
        // eslint-disable-next-line no-param-reassign
        item.order = index;
        return undefined;
      });
      showSuccess(t(`${translationPath}stages-reordered-successfully`));
      onActivePipelineDetailsChanged({ ...activePipeline, stages: reorderedItems });
    } else showError(t(`${translationPath}stages-reorder-failed`));
  };

  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the selected candidateItem on the start of dragging
   */
  const onDragStartHandler = (dropEvent) => {
    if (dropEvent.type !== 'candidate') return;
    const localStageItem = activePipeline.stages.find(
      (item) => item.uuid === dropEvent.source.droppableId,
    );
    if (localStageItem)
      setDraggingCandidate({
        stage: localStageItem,
        candidate: {
          uuid: dropEvent.draggableId,
        },
      });
  };

  /**
   * @param wheelEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is move the scroll to the left or right on scroll over stages (during candidate dragging)
   * not working properly because of the library bug
   */
  const onScrollHandler = (wheelEvent) => {
    if (!draggingCandidate) return;
    if (i18next.dir() === 'ltr')
      wheelEvent.currentTarget.scrollTo({
        top: 0,
        left:
          wheelEvent.currentTarget.scrollLeft
          + wheelEvent.deltaY
          + ((wheelEvent.deltaY < 0 && -300) || +300),
        behavior: 'smooth',
      });
    else
      wheelEvent.currentTarget.scrollTo({
        top: 0,
        left:
          wheelEvent.currentTarget.scrollLeft
          - wheelEvent.deltaY
          + ((wheelEvent.deltaY > 0 && -300) || +300),
        behavior: 'smooth',
      });
  };
  /**
   * @param dropEvent
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the selected candidateItem on the start of dragging
   */
  const onCandidateClickedHandler = useCallback(
    (candidateItem, stageItem, candidateIndex) => {
      if (draggingCandidate) return;
      onIsOpenDialogsChanged('candidateModal', true);
      VitallyTrack('EVA-REC - Open Candidate Modal');
      window?.ChurnZero?.push([
        'trackEvent',
        'EVA-REC - Open Candidate Modal',
        'Open Candidate Modal from EVA-REC',
        1,
        {},
      ]);
      setActiveItem({
        stage: stageItem,
        candidate: candidateItem,
        profile_uuid: candidateItem.profile_uuid,
        candidateIndex,
      });
    },
    [draggingCandidate, onIsOpenDialogsChanged],
  );

  const GetCandidateDataHandler = useCallback(
    async ({ applicant_number }) => {
      const response = await GetAllStagesCandidates({
        job_pipeline_uuid: activeJobPipelineUUID,
        job_uuid: activeJob.uuid,
        filters: { applicant_number, is_include: true },
      });
      if (
        response
        && (response.status === 200 || response.status === 202)
        && response?.data?.results?.candidate[0]
      )
        onCandidateClickedHandler(
          response.data.results.candidate[0],
          activePipeline.stages.find(
            (it) => it.uuid === response.data.results?.candidate[0]?.stage_uuid,
          ),
        );
      else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setBackDropLoader(false);
      }
    },
    [
      t,
      activeJob,
      activeJobPipelineUUID,
      activePipeline,
      onCandidateClickedHandler,
      setBackDropLoader,
    ],
  );

  const redirectionHandler = useCallback(async () => {
    if (query.get('source') === 'self-service')
      window.location.assign(
        `${
          process.env.REACT_APP_SELFSERVICE_URL
        }/home/job-candidates-details?job_uuid=${
          activeJob.uuid
        }&company_uuid=${query.get('branch_uuid')}${
          query.get('shared_uuid') ? `&shared_uuid=${query.get('shared_uuid')}` : ''
        }&candidate_uuid=${query.get('candidate_uuid')}${
          query.get('page') ? `&page=${query.get('page')}` : ''
        }${query.get('limit') ? `&limit=${query.get('limit')}` : ''}${
          query.get('status') ? `&status=${query.get('status')}` : ''
        }`,
      );
  }, [activeJob, query]);

  // this is to make sure that the current active candidate is scrolled to if possible
  useEffect(() => {
    if (activeItem) scrollToActiveCandidateHandler();
  }, [activeItem, scrollToActiveCandidateHandler]);

  useEffect(() => {
    const source = query.get('source');
    const applicant_number = query.get('applicant_number');
    if (
      (source === 'self-service'
        || source === 'self-service-close'
        || source === 'share-email'
        || source === 'score-card-evaluate'
        || source === 'documents'
        || source === 'score-card'
        || source === 'onboarding')
      && applicant_number
    )
      GetCandidateDataHandler({ applicant_number });
  }, [GetCandidateDataHandler, query, setCandidatesFilters]);

  useEffect(() => {
    selectedOnHoldStagesRef.current = selectedOnHoldStages;
    selectedConfirmedStagesRef.current = selectedConfirmedStages;
  }, [selectedOnHoldStages, selectedConfirmedStages]);

  useEffect(
    () => () => {
      if (confirmMoveTimesRef.current) clearTimeout(confirmMoveTimesRef.current);
    },
    [],
  );

  return (
    <div className="pipeline-section-wrapper section-wrapper">
      <DragDropContext onDragEnd={onDragEndHandler} onDragStart={onDragStartHandler}>
        <Droppable
          direction="horizontal"
          type="stages"
          droppableId="stageManagementDroppableId"
        >
          {(droppableProvided) => (
            <div
              className="stages-items-wrapper"
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              onWheel={onScrollHandler}
            >
              {activePipeline.stages
                && activePipeline.stages.map(
                  (item, index, items) =>
                    item.candidates
                    && !(hiddenStages && hiddenStages.includes(item.uuid)) && (
                      <Draggable
                        key={`stageItemKey${index + 1}`}
                        draggableId={item.uuid}
                        index={index}
                        isDragDisabled={
                          items.length < 2
                          || isLoading
                          || isConnectionLoading
                          || isDisabledAllDragging
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.ReorderStages.key,
                          })
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`stage-item-wrapper${
                              ((items.length < 2
                                || isLoading
                                || isConnectionLoading
                                || isDisabledAllDragging)
                                && ' is-disabled')
                              || ''
                            }${(snapshot.isDragging && ' is-dragging') || ''}`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <div className="item-content-wrapper">
                              <div className="item-header-wrapper">
                                <span className="d-flex-v-center">
                                  {isBulkSelect && (
                                    <div className="checkbox-item-wrapper mx-2">
                                      <CheckboxesComponent
                                        idRef={`candidateSelectAllRef${index + 1}`}
                                        singleChecked={getIsSelectedAllCandidates(
                                          item.uuid,
                                          item.total_candidates,
                                        )}
                                        isDisabled={isDisabledAllDragging}
                                        singleIndeterminate={getIsSelectedSomeCandidates(
                                          item.uuid,
                                          item.total_candidates,
                                        )}
                                        onSelectedCheckboxChanged={selectAllCandidateChangeHandler(
                                          item.uuid,
                                          item.title,
                                          item.total_candidates,
                                          item.candidates,
                                        )}
                                      />
                                    </div>
                                  )}
                                  <span className="c-black-light px-2">
                                    {item.title}
                                  </span>
                                  <span>{item.candidates.length}</span>
                                  <span className="px-1">
                                    {t(`${translationPath}of`)}
                                  </span>
                                  <span>{item.total_candidates || 0}</span>
                                  {(item.stage_limit || item.stage_limit === 0) && (
                                    <span className="text-nowrap">
                                      <span className="px-1">
                                        {t(`${translationPath}max`)}
                                      </span>
                                      <span>({item.stage_limit})</span>
                                    </span>
                                  )}
                                </span>
                                <ButtonBase
                                  className={`btns-icon theme-transparent${
                                    (popoverAttachedWith.moveTo
                                      && item.uuid === activeStage
                                      && ' is-active')
                                    || ''
                                  }`}
                                  onClick={(event) => {
                                    onPopoverAttachedWithChanged(
                                      'moveTo',
                                      event.currentTarget,
                                    );
                                    setActiveStage(item);
                                  }}
                                >
                                  <span
                                    className={`fas fa-chevron-${
                                      (popoverAttachedWith.moveTo
                                        && item.uuid === activeStage
                                        && 'up')
                                      || 'down'
                                    }`}
                                  />
                                </ButtonBase>
                              </div>
                              <div className="item-body-wrapper">
                                <StageCandidatesSection
                                  stageItem={item}
                                  stageIndex={index}
                                  stages={items}
                                  job_uuid={jobUUID}
                                  draggingCandidate={draggingCandidate}
                                  draggingCandidateDetails={draggingCandidateDetails}
                                  temporaryMovedCandidates={temporaryMovedCandidates}
                                  onLoadedCandidatesChanged={
                                    onLoadedCandidatesChanged
                                  }
                                  onDraggingCandidateDetailsChanged={
                                    onDraggingCandidateDetailsChanged
                                  }
                                  onCandidateClickedHandler={
                                    onCandidateClickedHandler
                                  }
                                  isForceToReloadCandidates={
                                    isForceToReloadCandidates
                                  }
                                  getIsDropCandidateDisabled={
                                    getIsDropCandidateDisabled
                                  }
                                  selectedAllLoadedStageCandidates={
                                    selectedAllLoadedStageCandidates
                                  }
                                  selectCandidateChangeHandler={
                                    selectCandidateChangeHandler
                                  }
                                  getIsSelectedCandidate={getIsSelectedCandidate}
                                  getIsDragCandidateDisabled={
                                    getIsDragCandidateDisabled
                                  }
                                  isBulkSelect={isBulkSelect}
                                  selectedCandidates={selectedCandidates}
                                  isDisabledAllDragging={isDisabledAllDragging}
                                  onSelectedCandidatesChanged={
                                    onSelectedCandidatesChanged
                                  }
                                  // firstPageStagesCandidates={firstPageStagesCandidates}
                                  isLoading={isLoading || isConnectionLoading}
                                  pipeline_uuid={activePipeline.uuid}
                                  // activeJob={activeJob}
                                  candidatesFilters={candidatesFilters}
                                  setCandidatesFilters={setCandidatesFilters}
                                  isOpenDialogsChanged={isOpenDialogs}
                                  onIsOpenDialogsChanged={onIsOpenDialogsChanged}
                                  parentTranslationPath={parentTranslationPath}
                                  translationPath={translationPath}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ),
                )}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {/*currentPipelineId={currentPipeline?.job?.pipeline_uuid}*/}
      {isOpenDialogs?.candidateModal && (
        <JobCandidateModal
          jobUuid={jobUUID}
          currentJob={{
            job: activeJob,
          }}
          getIsConnectedPartner={getIsConnectedPartner}
          selectedCandidate={activeItem?.candidate?.uuid}
          profileUuid={activeItem?.candidate.profile_uuid}
          score={activeItem?.candidate?.score}
          totalCandidates={activeItem?.stage?.total_candidates}
          candidateIndex={activeItem?.candidateIndex}
          onActiveCandidateChange={onActiveCandidateChange}
          profile={[]}
          onDetailsChanged={({
            pipelineDetailsChanges,
            activeItemChanges,
            jobDetailsChanges,
            reloadCandidates = false,
            movedToStageUUID,
          }) => {
            if (activeItemChanges)
              setActiveItem((items) => ({ ...items, activeItemChanges }));
            if (pipelineDetailsChanges)
              onActivePipelineDetailsChanged({
                ...activePipeline,
                ...pipelineDetailsChanges,
              });
            if (jobDetailsChanges)
              onSetActiveJobChanged({
                ...activeJob,
                ...jobDetailsChanges,
              });
            if (reloadCandidates) onForceToReloadCandidatesChanged();
            if (movedToStageUUID) showMoveJobToArchivedHandler(movedToStageUUID);
          }}
          getIsDisabledTargetStage={getIsDisabledTargetStage}
          candidateStage={activeItem.stage.uuid}
          applied_at={activeItem?.applied_at}
          stages={activePipeline.stages}
          candidateUuid={activeItem?.candidate?.candidate_uuid}
          show={isOpenDialogs?.candidateModal}
          form_builder={form_builder}
          // setCandidateStageChange={onCandidate}
          // candidateStageChange={candidateStageChange}
          // loadCandidateData={loadCandidateData}
          jobPipelineUUID={activePipeline.uuid}
          currentPipelineId={activePipeline.origin_pipeline_uuid}
          selectedCandidateDetails={activeItem?.candidate}
          selectedCandidateStageDetails={activeItem?.stage}
          // candidateStage={
          //   candidatesCurrentStages &&
          // selectedCandidate &&
          // candidatesCurrentStages?.length > 0
          //     ? candidatesCurrentStages?.find(
          //       (item) => item.uuid === selectedCandidate
          //     )?.stage
          //     : 0
          // }
          onClose={() => {
            if (destroySessionFiltersRef) destroySessionFiltersRef.current = true;
            if (query.get('source') === 'self-service') {
              setBackDropLoader(true);
              redirectionHandler();
            } else if (
              query.get('source') === 'self-service-close'
              || query.get('source') === 'score-card'
              || query.get('source') === 'score-card-evaluate'
              || query.get('source') === 'documents'
              || query.get('source') === 'onboarding'
            ) {
              window.opener = null;
              window.open('', '_self');
              window.close();
              return;
            }
            setActiveItem(null);
            onIsOpenDialogsChanged('candidateModal', false);
          }}
          onChangeTheActiveJobData={onChangeTheActiveJobData}
          activeJobPipelineUUID={activeJobPipelineUUID}
          setBackDropLoader={setBackDropLoader}
          onJobAssignHandler={onJobAssignHandler}
          scorecardAssignHandler={scorecardAssignHandler}
          destroySessionFiltersRef={destroySessionFiltersRef}
        />
      )}
    </div>
  );
};

PipelineSection.propTypes = {
  activePipeline: PropTypes.instanceOf(Object).isRequired,
  form_builder: PropTypes.shape({
    sent_multiple_request: PropTypes.bool,
  }),
  popoverAttachedWith: PropTypes.shape({
    others: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.object,
    ]),
    customView: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.object,
    ]),
    moveTo: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.object,
    ]),
    actions: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.element,
      PropTypes.object,
    ]),
  }).isRequired,
  temporaryMovedCandidates: PropTypes.shape({
    candidates: PropTypes.arrayOf(Object),
    stage_uuid: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    is_successfully_confirmed: PropTypes.bool,
  }).isRequired,
  onTemporaryMovedCandidatesChanged: PropTypes.func.isRequired,
  reinitializeFilteredCandidates: PropTypes.func.isRequired,
  getPipelinePreMoveCheck: PropTypes.func.isRequired,
  onLoadedCandidatesChanged: PropTypes.func.isRequired,
  onPopoverAttachedWithChanged: PropTypes.func.isRequired,
  onActivePipelineDetailsChanged: PropTypes.func.isRequired,
  onSetActiveJobChanged: PropTypes.func.isRequired,
  getIsDroppableSelectedCandidates: PropTypes.func.isRequired,
  getFilteredCandidates: PropTypes.func.isRequired,
  isBulkSelect: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onIsLoadingChanged: PropTypes.func.isRequired,
  isDisabledAllDragging: PropTypes.bool.isRequired,
  onIsDisabledAllDraggingChanged: PropTypes.func.isRequired,
  getIsSelectedCandidate: PropTypes.func.isRequired,
  onSelectedAllLoadedStageCandidatesChanged: PropTypes.func.isRequired,
  onSelectedConfirmedStagesChanged: PropTypes.func.isRequired,
  onSelectedOnHoldStagesChanged: PropTypes.func.isRequired,
  getIsSelectedAllCandidates: PropTypes.func.isRequired,
  getIsSelectedSomeCandidates: PropTypes.func.isRequired,
  isForceToReloadCandidates: PropTypes.bool.isRequired,
  onForceToReloadCandidatesChanged: PropTypes.func.isRequired,
  getIsDisabledTargetStage: PropTypes.func.isRequired,
  selectedAllLoadedStageCandidates: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOnHoldStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeJob: PropTypes.instanceOf(Object),
  jobUUID: PropTypes.string,
  activeJobPipelineUUID: PropTypes.string,
  search: PropTypes.string,
  onSelectedCandidatesChanged: PropTypes.func.isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      // this is to identify if all candidates even the unloaded once are selected
      bulkSelectType: PropTypes.number,
    }),
  ).isRequired,
  hiddenStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStage: PropTypes.instanceOf(Object),
  setActiveStage: PropTypes.func,
  candidatesFilters: PropTypes.shape({
    order_type: PropTypes.oneOf(['ASC', 'DESC']),
    order_by: PropTypes.number,
    search: PropTypes.string,
  }),
  setCandidatesFilters: PropTypes.func,
  onIsOpenDialogsChanged: PropTypes.func,
  isOpenDialogs: PropTypes.shape({
    notes: PropTypes.bool,
    teams: PropTypes.bool,
    manageWeights: PropTypes.bool,
    manageQuestionnaires: PropTypes.bool,
    share: PropTypes.bool,
    filters: PropTypes.bool,
    addCandidate: PropTypes.bool,
    sendQuestionnaire: PropTypes.bool,
    sendVideoAssessment: PropTypes.bool,
    shareProfile: PropTypes.bool,
    jobPipelinesManagement: PropTypes.bool,
    moveToManagement: PropTypes.number,
    candidateModal: PropTypes.bool,
    sendForm: PropTypes.bool,
    scheduleInterview: PropTypes.bool,
    destroySessionFiltersRef: PropTypes.instanceOf(Object),
  }),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onChangeTheActiveJobData: PropTypes.func,
  setBackDropLoader: PropTypes.func,
  onJobAssignHandler: PropTypes.func,
  scorecardAssignHandler: PropTypes.func,
  showMoveJobToArchivedHandler: PropTypes.func,
  getIsConnectedPartner: PropTypes.func.isRequired,
  isConnectionLoading: PropTypes.bool.isRequired,
  destroySessionFiltersRef: PropTypes.instanceOf(Object),
};

PipelineSection.defaultProps = {
  jobUUID: undefined,
  activeJobPipelineUUID: undefined,
  activeJob: undefined,
  activeStage: undefined,
  setActiveStage: undefined,
  candidatesFilters: undefined,
  setCandidatesFilters: undefined,
  onIsOpenDialogsChanged: undefined,
  isOpenDialogs: undefined,
  onChangeTheActiveJobData: undefined,
  setBackDropLoader: undefined,
};
