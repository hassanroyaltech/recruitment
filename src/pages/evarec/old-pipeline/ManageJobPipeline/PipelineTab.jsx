/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useToasts } from 'react-toast-notifications';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';

import { reorder } from '../../../../shared/utils';
import { BoardsLoader } from '../../../../shared/Loaders';
import { Can } from '../../../../utils/functions/permissions';
import { evarecAPI } from '../../../../api/evarec';
import ShareProfileModal from '../../../../components/Elevatus/ShareProfileModal';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CheckboxesComponent, FilterModal } from '../../../../components';
import SendQuestionnaire from '../../../evassess/pipeline/SendQuestionnaire';
import ManageWeights from '../../ManageWeights';
import TeamsModal from '../../../../components/Views/TeamsModal/TeamsModal';
import SendVideoAssessment from '../../../evassess/pipeline/SendVideoAssessment';
// import './ManageAssessmentTabs.css';
// import Select from 'react-select';
// // Permissions
import Pipeline from './Pipeline';
import AddNewStageColumn from './AddNewStageColumn';
import AddNoteModal from '../../../../components/Views/NotesModal/AddNoteModal';
import {
  copyTextToClipboard,
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
  showSuccess,
} from '../../../../helpers';
import {
  FilterDialogCallLocationsEnum,
  ProfileManagementFeaturesEnum,
  SubscriptionServicesEnum,
} from '../../../../enums';
import NoPermissionComponent from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageApplicationsPermissions } from '../../../../permissions';
import { CandidateManagementDialog } from '../../shared';
import { ManageQuestionnairesDialog } from '../../pipelines/managements/pipeline/sections/pipeline-header/dialogs/ManageQuestionnairs.Dialog';
// import InviteCandidates from './components/InviteCandidates';
// import InviteStatus from './components/InviteStatus';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

const ContextContainer = styled.div`
  /* width: 100%; */
  display: flex;
`;

/**
 * This module defines the PipelineTab component which displays the Pipeline and
 * its PipelineItem objects.
 * It is where stages and cards are manipulated.
 * Uses redux to maintain statefulness
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PipelineTab = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  // // Dispatch with redux and obtain object state
  // const dispatch = useDispatch();
  // const { props.currentPipeline, loading } = useSelector(
  //   ({ jobReducer }) => jobReducer,
  //   shallowEqual,
  // );

  // Define props
  const { ManageTabs, history, paths } = props;

  // Initialize toast notificaitons
  const { addToast, removeAllToasts } = useToasts();

  // Define internal states
  const [state] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showShareCandidate, setShareCandidate] = useState(false);
  const [isOpenCandidateManagementDialog, setIsOpenCandidateManagementDialog]
    = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showManageQuestionnaires, setShowManageQuestionnaires] = useState(false);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // Get user object from localStorage

  // Timeout
  const timeoutRef = useRef(null);

  // Filters
  const [, setIsAllChecked] = useState(true);
  const [displayedStages, setDisplayedStages] = useState(
    props.data && props.data.stageOrder,
  );

  // Filters Modal
  const [filter, setFilter] = useState({
    limit: 30,
    page: 0,
    filters: null,
    tags: [],
  });

  // Drag and Drop
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState();

  // Checkbox
  const [selectedColumn, setSelectedColumn] = useState('');

  const [oldData, setOldData] = useState();
  const [, setToDo] = useState();

  const [isWorking, setIsWorking] = useState(false);
  // State to handle pipeline data

  const unselectAll = () => {
    setSelectedTaskIds([]);
  };

  /**
   *  Get the data from API using the job UUID
   */
  // useEffect(() => {
  //   dispatch(resetPipeline());
  //   dispatch(getJobPipeline(props.match.params.id));
  // }, [props.match.params.id]);

  // Open the notes and teams modal from the notifications list.
  useEffect(() => {
    if (window.location.pathname.includes('notes')) setShowNotesModal(true);
    else if (window.location.pathname.includes('teams')) setShowTeamsModal(true);
  }, []);
  const getPipeline = useCallback(() => {
    // setLoading(true);
    evarecAPI
      .getPipeline({
        filter: filter.filters,
        uuid: props.match.params.id,
        tags: filter.tags,
        pipeline_uuid:
          props.jobPipelineUUID || props.currentJob?.job?.pipelines?.[0]?.uuid,
      })
      .then((res) => {
        const { results } = res.data;

        if (results) {
          props.setcurrentPipeline(results);
          props.setCandidatesCurrentStages(
            results?.candidate.map((item) => ({
              uuid: item.uuid,
              stage: item.stage_uuid,
            })),
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, props.match.params.id]);
  useEffect(() => {
    getPipeline();
  }, [getPipeline, props.candidateStageChange]);

  // Transform stages data structure
  const getStages = (stage) => {
    const stagesData = [];
    for (const key in stage) stagesData.push(stage[key]);

    setStages(stagesData);
  };

  /**
   * This allows us to re-order stages
   */
  useEffect(() => {
    if (!displayedStages || !props.data) return;
    // Change display
    props.data.stageOrder.forEach((stage) => {
      const e = document.querySelector(`#stage-${stage}`);
      if (e) e.classList.add('d-none');
    });

    displayedStages.forEach((stage) => {
      const e = document.querySelector(`#stage-${stage}`);
      if (e) e.classList.remove('d-none');
    });
  }, [props.data, displayedStages]);

  /**
   * Set the displayed stages and the data
   */
  useEffect(() => {
    props.data && props.data.stages && getStages(props.data.stages);
    if (!props.data || displayedStages) return;
    setDisplayedStages(props.data.stageOrder);
  }, [props.data, displayedStages]);

  /**
   * Column selector handler
   * @param {number} n
   */
  const setNewSelectedColumn = (n) => {
    if (n === selectedColumn) {
      unselectAll();
      setSelectedColumn('');
      return;
    }
    setSelectedColumn(n);
  };

  /**
   * When dragging an item starts
   * @param start
   */
  const onDragStart = (start) => {
    // Save Previous Data
    if (state.type !== 'column') {
      const tempData = JSON.parse(JSON.stringify(props.data)); //
      setOldData(tempData);
    }

    const id = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === id);
    if (!selected) unselectAll();

    setDraggingTaskId(start.draggableId);
  };

  /**
   * When dragging an item ends
   * @param result
   */
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    // Check if we order the column not the candidate
    if (type === 'column') {
      setDraggingTaskId(null);
      const tempData = props.data;
      const newStageOrder = Array.from(tempData.stageOrder);
      newStageOrder.splice(source?.index, 1);
      newStageOrder.splice(destination?.index, 0, draggableId);
      const newData = { ...tempData, stageOrder: newStageOrder };
      props.setData(newData);
      // Put to API
      setIsLoading(true);
      evarecAPI
        .updateStageOrder(props.match.params.id, newStageOrder)
        .then(() => {
          showSuccess(t(`${translationPath}stage-moved`));
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          showError(t(`${translationPath}error-in-moving-stage`), err);
        });
      return;
    }

    // If we drag outside; do nothing. ▼
    if (!destination || result.reason === 'CANCEL') {
      setDraggingTaskId(null);
      return;
    }

    // If we drag to the same column; do nothing. ▼
    if (
      destination.droppableId === source.droppableId
      && destination?.index === source?.index
    ) {
      setDraggingTaskId(null);
      return;
    }
    // Reorder on the Front-end.
    const updated = reorderWithoutSend(
      props.data,
      selectedTaskIds,
      source,
      destination,
    );

    const prepJobUUID = props.match.params.id;
    const prepJobStageUUID = destination.droppableId;
    const prepJobCandidateUUID = !selectedTaskIds.length
      ? [draggableId]
      : selectedTaskIds;

    // Move to a stage
    setIsLoading(true);
    evarecAPI
      .moveToStage(prepJobUUID, prepJobStageUUID, prepJobCandidateUUID, null, null)
      .then((res) => {
        const { results } = res.data;
        if (results) {
          setToDo(results.move_id);

          // Start timeout
          timeoutRef.current = setTimeout(() => {
            // When timeout finishes,
            confirmMove(results.move_id, true, updated);
          }, 5000);

          // ToastPipeline
          removeAllToasts();
          addToast(t(`${translationPath}candidate(s)-moved`), {
            appearance: 'success',
            autoDismissTimeout: 4999,
            pauseOnHover: false,
            onUndo: () => {
              // Undo on Front-end
              props.setData(oldData);
              clearTimeout(timeoutRef.current);
              cancelMove(results.move_id);
              removeAllToasts();
              // Undo on Back-end
            },
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        showError(t(`${translationPath}error-in-moving-candidate`), err);
      });
  };

  /**
   * Confirm movement to another stage.
   * This is automatically triggered after the notification timeout is reached.
   * @param idToDo
   */
  const confirmMove = (idToDo, action, data) => {
    const tempData = data;
    evarecAPI
      .moveToStage(null, null, null, idToDo, true)
      .then((res) => {
        const { results } = res.data;
        if (results) {
          setToDo(null);
          const arr = Object.entries(results?.stages);
          for (let j = 0; j < arr.length; j++)
            for (const property in tempData?.stages)
              if (arr[j][0] === property) {
                tempData.stages[property].totalCandidates = arr[j][1];
                tempData.stages[property].total_with_filters = arr[j][1];
              }

          // UnSelect Candidates after moving them to another stage
          props.setData(tempData);
          setSelectedTaskIds([]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        showError(t(`${translationPath}error-in-confirm-candidate-move`), error);
      });
  };

  /**
   * Cancel a movement to another stage
   * This option is available while the notification timeout has not been reached.
   * @param idToDo
   */
  const cancelMove = (idToDo) => {
    evarecAPI
      .moveToStage(null, null, null, idToDo, false)
      .then(() => {
        setToDo(null);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        showError('', err);
      });
  };

  /**
   * Reorder on the frontend without sending to the API
   * @param data
   * @param selectedTaskIds
   * @param source
   * @param destination
   */
  const reorderWithoutSend = (data, selectedTaskIds, source, destination) => {
    // Reorder, Don't send! ▼
    const processed = reorder({
      data,
      selectedTaskIds,
      source,
      destination,
    });
    props.setData(processed.newData);
    setSelectedTaskIds(processed.newSelectedTaskIds);
    setDraggingTaskId(null);
    return processed.newData;
  };

  const toggleSelection = (taskId) => {
    const wasSelected = selectedTaskIds.includes(taskId);
    const newTaskIds = () => {
      if (!wasSelected) return [taskId];

      if (selectedTaskIds.length > 1) return [taskId];

      return [];
    };
    setSelectedTaskIds(newTaskIds);
  };

  /**
   * Toggle selection group
   * @param taskId
   */
  const toggleSelectionInGroup = (taskId) => {
    const index = selectedTaskIds.indexOf(taskId) || -1;
    if (index === -1) {
      setSelectedTaskIds((selectedTaskIds) => [...selectedTaskIds, taskId]);
      return;
    }
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);
    setSelectedTaskIds(shallow);
  };

  // Keys

  /**
   *
   * @param e
   */
  const onWindowKeyDown = useCallback((e) => {
    if (e.defaultPrevented) return;

    if (e.key === 'Escape') unselectAll();
  }, []);

  const onWindowTouchEnd = useCallback((e) => {
    if (e.defaultPrevented) return;

    unselectAll();
  }, []);
  useEffect(() => {
    // window.addEventListener("click", onWindowClick);
    window.addEventListener('keydown', onWindowKeyDown);
    window.addEventListener('touchend', onWindowTouchEnd);

    return () => {
      // window.removeEventListener("click", onWindowClick);
      window.removeEventListener('keydown', onWindowKeyDown);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  }, [onWindowKeyDown, onWindowTouchEnd]);

  // Modals
  const [, setIsInviteCandidateOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVideoAssessmentModalOpen, setIsVideoAssessmentModalOpen]
    = useState(false);
  const [, setIsInviteOpen] = useState(false);
  const [dialog, setDialog] = useState(null);

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsInviteOpen(false);
    setIsInviteCandidateOpen(false);
    setIsVideoAssessmentModalOpen(false);
  };
  const closeDialog = () => setDialog(null);

  const showSendQuestionnaireModal = () => {
    setIsAddModalOpen(true);
  };

  const showSendVideoAssessmentModal = () => {
    setIsVideoAssessmentModalOpen(true);
  };

  const showManageWeightsModal = () => {
    // Tracing
    setDialog(
      <ManageWeights
        isOpen
        closeModal={closeDialog}
        pipeline={props.match.params.id}
        onSave={() => {
          setLoading(true);
          getPipeline();
          closeDialog();
        }}
      />,
    );
  };

  const [isFiltering] = useState(false);

  const addNewCandidates = (stageId, candidatesToAdd) => {
    const tempData = JSON.parse(JSON.stringify(props.data));
    tempData.stages[stageId].candidatesIds.push(
      ...candidatesToAdd.map((c) => c.uuid),
    );
    // So, when moving candidates to stage then clicks the load more button
    // the candidates have been moved will be duplicated, this line of code
    // will remove the duplicates candidates uuid from stage array.
    tempData.stages[stageId].candidatesIds = tempData.stages[
      stageId
    ].candidatesIds.filter(
      (a, b) => tempData.stages[stageId].candidatesIds.indexOf(a) === b,
    );
    candidatesToAdd.map((c) => {
      tempData.candidates[c.uuid] = {
        ...c,
        id: c.uuid,
        candidate_uuid: c.candidate_uuid,
        user_uuid: c.uuid,
        job_uuid: c.job_uuid,
        name: c.name,
        email: c.email,
        is_new: c.is_new,
        description: c.description,
        is_completed: c.is_completed,
        register_at: c.apply_at,
        profile_image: c.profile_pic,
        score: c.score,
        profile_uuid: c.profile_uuid,
      };
    });
    props.setData(tempData);
  };

  const sortCandidates = (stageId, candidatesToAdd) => {
    const tempData = JSON.parse(JSON.stringify(props.data));
    tempData.stages[stageId].candidatesIds = [];
    tempData.stages[stageId].candidatesIds.push(
      ...candidatesToAdd.map((c) => c.uuid),
    );
    candidatesToAdd.map((c) => {
      tempData.candidates[c.uuid] = {
        ...c,
        id: c.uuid,
        candidate_uuid: c.candidate_uuid,
        user_uuid: c.uuid,
        job_uuid: c.job_uuid,
        name: c.name,
        email: c.email,
        is_new: c.is_new,
        description: c.description,
        is_completed: c.is_completed,
        register_at: c.apply_at,
        profile_image: c.profile_pic,
        score: c.score,
        profile_uuid: c.profile_uuid,
      };
    });
    props.setData(tempData);
  };

  // Change Stage Title
  const changeStageTitle = (stageId, newStageTitle) => {
    const tempData = JSON.parse(JSON.stringify(props.data));
    tempData.stages[stageId].title = newStageTitle;
    props.setData(tempData);
  };

  // Add New Stage
  const addNewStageToPipeline = (newStage) => {
    const tempData = JSON.parse(JSON.stringify(props.data));
    tempData.stageOrder.push(newStage.uuid);
    tempData.stages = {
      ...tempData.stages,
      [newStage.uuid]: {
        candidatesIds: [],
        id: newStage.uuid,
        order: newStage.order_view,
        title: newStage.title,
        totalCandidates: 0,
      },
    };
    props.setData(tempData);
    setDisplayedStages(tempData.stageOrder);
  };

  const toggleDisplayDropdown = (e) => {
    e.preventDefault();
    if (props.data?.stageOrder?.length === displayedStages.length) {
      setDisplayedStages([]);
      setIsAllChecked(true);
    } else {
      setDisplayedStages(props.data?.stageOrder);
      setIsAllChecked(false);
    }
  };

  const candidateManagementOpenChangeHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
  }, []);

  const onSaveCandidateHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
    setFilter((items) => ({ ...items }));
  }, []);

  // setIsAllChecked((isAllChecked) => (data?.stageOrder?.length === displayedStages.length
  //   ? setDisplayedStages([])
  //   : setDisplayedStages(data?.stageOrder)));

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  return (
    <>
      {showFilterModal && (
        <FilterModal
          filterEditValue={filter.filters}
          filterEditValueTags={filter.tags}
          callLocation={FilterDialogCallLocationsEnum.EvaRecPipelines.key}
          isOpen={showFilterModal}
          isWithSliders
          onClose={() => {
            setShowFilterModal(false);
          }}
          onApply={(filterType, filters, tags, filterModalstate) => {
            setFilter((items) => ({
              ...items,
              page: 0,
              filters: filterModalstate,
              tags,
            }));
            setLoading(true);
            setShowFilterModal(false);
          }}
          showTags
        />
      )}
      {showNotesModal && (
        <AddNoteModal
          type_panel="ats"
          isOpen={showNotesModal}
          onClose={() => {
            setShowNotesModal(false);
            history.replace({ ...history.location, state: {} });
          }}
          uuid={props.match?.params?.id}
          paths={paths}
          {...props}
        />
      )}
      {showManageQuestionnaires && (
        <ManageQuestionnairesDialog
          jobUUID={props.match?.params?.id} // not sure
          isOpen={showManageQuestionnaires}
          isOpenChanged={() => {
            setShowManageQuestionnaires(!showManageQuestionnaires);
          }}
          onClose={() => {
            setShowManageQuestionnaires(false);
          }}
        />
      )}
      {showTeamsModal && (
        <TeamsModal
          {...props}
          isOpen={!!showTeamsModal}
          onClose={() => {
            setShowTeamsModal(false);
          }}
          match={{ params: { id: props.match?.params?.id } }}
          uuid={props.match?.params?.id}
          type="ATS"
        />
      )}
      {showShareCandidate && selectedTaskIds?.length ? (
        <ShareProfileModal
          isOpen
          type="evarec"
          onClose={() => setShareCandidate(false)}
          uuid={selectedTaskIds}
          job_uuid={props.match?.params?.id}
        />
      ) : null}

      {props.currentPipeline?.candidate
        && props.currentPipeline?.job?.pipeline_uuid && (
        <SendQuestionnaire
          isOpen={isAddModalOpen}
          closeModal={closeModal}
          pipeline={props.currentPipeline?.job?.pipeline_uuid}
          jobUuid={props.currentPipeline.job.uuid}
          match={props.match}
          selectedCandidates={selectedTaskIds}
          candidates={props.currentPipeline?.candidate}
          type="ats"
        />
      )}
      {props.currentPipeline?.candidate
        && props.currentPipeline?.job?.pipeline_uuid && (
        <SendVideoAssessment
          isOpen={isVideoAssessmentModalOpen}
          closeModal={closeModal}
          pipeline={props.currentPipeline?.job?.pipeline_uuid}
          jobUuid={props.currentPipeline.job.uuid}
          match={props.match}
          selectedCandidates={selectedTaskIds}
          candidates={props.currentPipeline?.candidate}
          type="ats"
        />
      )}

      {dialog}
      <ManageTabs
        id={props?.match?.params?.id}
        tab="pipeline"
        rightTabs={
          <>
            {(Can('edit', 'ats') || Can('create', 'ats')) && (
              <>
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setIsOpenCandidateManagementDialog(true)}
                >
                  <span>{t(`${translationPath}add-candidate`)}</span>
                </NavItem>
                {props.currentJob?.job?.reference_number && (
                  <NavItem
                    color="link"
                    className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                    onClick={() =>
                      copyTextToClipboard(props.currentJob.job.reference_number)
                    }
                  >
                    <span>{t(`${translationPath}reference-number-copy`)}</span>
                    <span className="px-1">
                      {props.currentJob.job.reference_number}
                    </span>
                    <i className="fas fa-copy" />
                  </NavItem>
                )}
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setShowNotesModal(true)}
                >
                  <i className="far fa-sticky-note" /> {t(`${translationPath}notes`)}
                </NavItem>
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setShowManageQuestionnaires(true)}
                >
                  {t(`${translationPath}manage-questionnaires`)}
                </NavItem>
                <NavItem
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setShowTeamsModal(true)}
                >
                  <i className="fas fa-users" /> {t(`${translationPath}teams`)}
                </NavItem>
              </>
            )}
            <NavItem onMouseEnter={onPopperOpen}>
              <NavLink
                color="link"
                className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                onClick={() => {
                  showManageWeightsModal();
                }}
                // style={{
                //   cursor: !getIsAllowedPermissionV2({
                //     permissions,
                //     permissionId: CurrentFeatures.ai_weight.permissionsId,
                //   })
                //     ? 'not-allowed'
                //     : 'pointer',
                // }}
                // disabled={
                //   !getIsAllowedPermissionV2({
                //     permissions,
                //     permissionId: CurrentFeatures.ai_weight.permissionsId,
                //   })
                // }
              >
                <i className="fa fa-balance-scale" />{' '}
                {t(`${translationPath}manage-weights`)}
              </NavLink>
            </NavItem>
            <NavItem onMouseEnter={onPopperOpen}>
              <NavLink
                color="link"
                className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                disabled={
                  !selectedTaskIds
                  || selectedTaskIds.length === 0
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId:
                      ManageApplicationsPermissions.ShareEvaRecApplication.key,
                  })
                }
                onClick={() => setShareCandidate(true)}
              >
                <i className="fas fa-link" /> {t(`${translationPath}share`)}
              </NavLink>
            </NavItem>
            <NavItem className="float-right">
              <UncontrolledDropdown>
                <DropdownToggle
                  color=""
                  className="nav-link nav-link-shadow text-primary font-weight-normal"
                >
                  {t(`${translationPath}display-all`)}
                  <i className="fa fa-angle-down ml-2-reversed" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={(e) => {
                      toggleDisplayDropdown(e);
                    }}
                  >
                    <CheckboxesComponent
                      idRef="displayedStagesAllRef"
                      label="All"
                      singleChecked={
                        (props.data && props.data.stageOrder.length)
                        === (displayedStages && displayedStages.length)
                      }
                    />
                  </DropdownItem>

                  {props.data
                    && props.data.stageOrder.map((stageId, i) => {
                      const stage = props.data.stages[stageId]; // Column
                      return (
                        <DropdownItem
                          // toggle={false}
                          key={i}
                          onClick={() => {
                            setDisplayedStages((items) =>
                              items.includes(stage.id)
                                ? items.filter((d) => d !== stage.id)
                                : [...items, stage.id],
                            );
                          }}
                        >
                          <CheckboxesComponent
                            idRef={stage.title}
                            label={stage.title}
                            singleChecked={
                              (displayedStages
                                && displayedStages.includes(stage.id))
                              || false
                            }
                          />
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
            {(Can('edit', 'ats') || Can('create', 'ats')) && (
              <NavItem className="float-right">
                <UncontrolledDropdown>
                  <DropdownToggle
                    color=""
                    className="nav-link nav-link-shadow text-gray font-weight-normal"
                  >
                    {t(`${translationPath}action`)}
                    <i className="fas fa-angle-down ml-2-reversed" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <div onMouseEnter={onPopperOpen}>
                      <DropdownItem
                        onClick={() => {
                          showSendQuestionnaireModal();
                        }}
                        disabled={
                          selectedTaskIds.length === 0
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.SendQuestionnaire.key,
                          })
                        }
                        color="link"
                        className="btn-sm justfiy-self-end text-dark"
                      >
                        {t(`${translationPath}send-questionnaire`)}
                      </DropdownItem>
                    </div>
                    <DropdownItem
                      onClick={() => {
                        showSendVideoAssessmentModal();
                      }}
                      disabled={selectedTaskIds.length === 0}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      {t(`${translationPath}send-video-assessment`)}
                    </DropdownItem>
                    {/* <DropdownItem
                      onClick={() => {
                        showSendOfferModal();
                      }}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      Send Offer
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => {
                        showSendReminderModal();
                      }}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      Send Reminders
                    </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
            )}
            <NavItem>
              <NavLink
                color="link"
                className="btn nav-link nav-link-shadow px-2 float-right text-gray font-weight-normal"
                onClick={() => setShowFilterModal(true)}
              >
                <i className="fas fa-sliders-h" />
              </NavLink>
            </NavItem>
          </>
        }
      />

      <div
        className={`tab-pane active pt-3 scroll_content_x ${
          isFiltering ? 'loading-overlay' : ''
        }`}
        id="pipeline"
        role="tabpanel"
      >
        <div className="tab-content">
          <div
            className="tab-pane active p-0 testimonial-group"
            id="ats_view"
            role="tabpanel"
          >
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              {isWorking || loading || !props.data ? (
                <>
                  <p className="font-weight-400">
                    {t(
                      `${translationPath}please-wait-while-we-refresh-your-pipeline`,
                    )}
                  </p>
                  <BoardsLoader />
                </>
              ) : (
                // ) : !data ? (
                //   <Empty message="No Pipeline" />
                <>
                  <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                    isDragDisabled={isLoading}
                  >
                    {(provided) => (
                      <ContextContainer
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {props.data.stageOrder.map((stageId, index) => {
                          const stage = props.data.stages[stageId]; // Column
                          const candidates = stage.candidatesIds.map(
                            (candidateId) => props.data.candidates[candidateId],
                          );
                          return (
                            <Pipeline
                              {...props}
                              className="col-xs-6 col-sm-4 col-md-3 rounded overflow-auto pipeline-item mx-1"
                              key={stage.id}
                              id={stageId}
                              index={index}
                              stage={stage}
                              stages={stages}
                              candidates={candidates}
                              data={props.data}
                              toggleSelection={toggleSelection}
                              toggleSelectionInGroup={toggleSelectionInGroup}
                              selectedTaskIds={selectedTaskIds}
                              setSelectedTaskIds={(n) => setSelectedTaskIds(n)}
                              selectedColumn={selectedColumn}
                              setSelectedColumn={(n) => setNewSelectedColumn(n)}
                              unselectAll={unselectAll}
                              draggingTaskId={draggingTaskId}
                              addNewCandidates={addNewCandidates}
                              sortCandidates={sortCandidates}
                              changeStageTitle={changeStageTitle}
                              job_uuid={props.match?.params?.id}
                              isDisabled={isLoading}
                              filter={filter}
                            />
                          );
                        })}
                        <AddNewStageColumn
                          match={props.match}
                          addNewStageToPipeline={addNewStageToPipeline}
                        />
                        {provided.placeholder}
                      </ContextContainer>
                    )}
                  </Droppable>
                </>
              )}
            </DragDropContext>
          </div>
        </div>
      </div>
      {isOpenCandidateManagementDialog && (
        <CandidateManagementDialog
          isOpen={isOpenCandidateManagementDialog}
          feature={ProfileManagementFeaturesEnum.Job.key}
          job_uuid={props.currentJob?.job?.uuid}
          isOpenChanged={candidateManagementOpenChangeHandler}
          onSave={onSaveCandidateHandler}
        />
      )}
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

export default PipelineTab;
