/**
 * -----------------------------------------------------------------------------------
 * @title PipelineTab.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the PipelineTab component which we use in the EVA-SSESS.
 * -----------------------------------------------------------------------------------
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { reorder } from '../../../shared/utils';
import { BoardsLoader } from '../../../shared/Loaders';
import '../../../assets/scss/elevatus/_evassess-manage-tabs.scss';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import TeamsModal from '../../../components/Views/TeamsModal/TeamsModal';
import AddNoteModal from '../../../components/Views/NotesModal/AddNoteModal';

import ShareProfileModal from '../../../components/Elevatus/ShareProfileModal';

// Permissions
import { evassessAPI } from '../../../api/evassess';
import { CheckboxesComponent } from '../../../components/Checkboxes/Checkboxes.Component';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import AddNewStageColumn from './AddNewStageColumn';
import InviteCandidates from './InviteCandidates';
import InviteStatus from './InviteStatus';
import SendQuestionnaire from './SendQuestionnaire';
import { Pipeline } from './Pipeline';
import PipelineFilters from './PipelineFilters';
import {
  getAssessmentPipeline,
  MoveCandidateStage,
  MoveCandidateStageAction,
  OrderStages,
} from '../../../shared/APIs/VideoAssessment/Pipelines';
import ManageWeights from '../../evarec/ManageWeights';
import { SubscriptionServicesEnum } from '../../../enums';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import SendReminderModal from '../../../components/Views/SendReminderModal/SendReminderModal';
import {
  CreateAssessmentPermissions,
  ManageAssessmentsPermissions,
} from '../../../permissions';

const ContextContainer = styled.div`
  /* width: 100%; */
  display: flex;
`;
const translationPath = 'PipelineTabComponent.';
const PipelineTab = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const searchedId = new URLSearchParams(useLocation()?.search).get(
    'candidate_uuid',
  );
  const { addToast, removeAllToasts } = useToasts(); // Toasts
  const { paths, ManageTabs, history } = props;

  const [showSendReminderModal, setShowSendReminderModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showShareCandidate, setShareCandidate] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState([]);
  const [DeleteAlert, setDeleteAlert] = useState(null);
  const [totalNumberOfCandidates, setTotalNumberOfCandidates] = useState(0);
  const [selectedStageTitle, setSelectedStageTitle] = useState('');
  const [isPipelineLoading, setIsPipelineLoading] = useState(false);
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);

  // Drag and Drop
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [selectedTaskItems, setSelectedTaskItems] = useState([]);
  const [draggingTaskId, setDraggingTaskId] = useState();

  // Checkbox
  const [selectedColumn, setSelectedColumn] = useState('');

  const [oldData, setOldData] = useState();
  const [toDo, setToDo] = useState();

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  useEffect(() => {
    if (history?.location?.state?.showNotes)
      setShowNotesModal(history?.location?.state?.showNotes);

    if (history?.location?.state?.showTeams)
      setShowTeamsModal(history?.location?.state?.showTeams);
  }, [history.location.state]);

  const [state] = useState({});

  // Drag and Drop Logic
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const timeoutRef = useRef(null);

  // initialData
  const [data, setData] = useState();
  // Filters
  const [displayedStages, setDisplayedStages] = useState(data && data.stageOrder);

  useEffect(() => {
    if (!displayedStages || !data) return;
    // Change display
    data.stageOrder.forEach((stage) => {
      const e = document.querySelector(`#stage-${stage}`);
      if (e) e.classList.add('d-none');
    });

    displayedStages.forEach((stage) => {
      const e = document.querySelector(`#stage-${stage}`);
      if (e) e.classList.remove('d-none');
    });
  }, [data, displayedStages]);

  useEffect(() => {
    if (!data || displayedStages) return;
    setDisplayedStages(data.stageOrder);
  }, [data, displayedStages]);

  const [isWorking, setIsWorking] = useState(false);

  // Data for the Invite + Questionnaire modal
  const [candidates, setCandidates] = useState();
  const [pipeline, setPipeline] = useState();
  // Now get the data from API
  const getPipeline = useCallback(() => {
    setIsWorking(true);
    getAssessmentPipeline(props.match.params.id, filters)
      .then((res) => {
        setPipeline(res.data.results?.assessment?.pipeline_uuid);
        setCandidates(res.data.results.candidate);
        if (searchedId) {
          const selectedCandidate = res.data.results.candidate.find(
            (item) => item.user_uuid === searchedId,
          );
          if (selectedCandidate)
            setSelectedTaskIds((items) => {
              items.push(selectedCandidate?.uuid);
              return [...items];
            });
        }
        setData({
          candidates: {
            ...res.data.results.candidate?.reduce(
              (obj, c) => (
                (obj[c.uuid] = {
                  id: c.uuid,
                  user_uuid: c.user_uuid,
                  name: `${c.first_name} ${c.last_name}`,
                  email: c.email,
                  is_new: c.is_new,
                  is_completed: c.is_completed,
                  register_at: c.register_at,
                  profile_image: c.profile_image,
                  total_comments: c.total_comments,
                  avg_rating: c.recruiter_avg_rating,
                  similarity: c.model_answer_similarity,
                }),
                obj
              ),
              {},
            ),
          },

          stages: {
            ...res.data.results.stages.reduce(
              (obj, s) => (
                (obj[s.uuid] = {
                  id: s.uuid,
                  title: s.title,
                  order: s.order,
                  totalCandidates: s.total_candidate,
                  candidatesIds: s.candidates_uuid,
                  total_candidates_with_filters: s.total_candidates_with_filters,
                }),
                obj
              ),
              {},
            ),
          },
          stageOrder: res.data.results.stage_order || [],
        });
        setIsWorking(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setIsWorking(false);
      });
  }, [filters]);
  useEffect(() => {
    getPipeline();
  }, [
    props.match.params.id,
    user.company_id,
    user.token,
    filters,
    props.reloadPipeline,
  ]);

  const onDragStart = (start) => {
    // Save Previous Data
    if (state.type !== 'column') {
      const tempData = JSON.parse(JSON.stringify(data)); //
      setOldData(tempData);
    }

    const id = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === id);
    if (!selected) unselectAll();

    setDraggingTaskId(start.draggableId);
  };

  const onDragEnd = async (result) => {
    setIsPipelineLoading(true);
    setIsDraggingDisabled(true);

    setTimeout(() => {
      setIsDraggingDisabled(false);
    }, 2000);

    const { destination, source, draggableId, type } = result;
    // Check if we order the column not the candidate
    if (type === 'column') {
      setDraggingTaskId(null);
      const tempData = data;
      const newStageOrder = Array.from(tempData.stageOrder);
      newStageOrder.splice(source.index, 1);
      newStageOrder.splice(destination.index, 0, draggableId);
      const newData = { ...tempData, stageOrder: newStageOrder };
      setData(newData);
      OrderStages(props.match.params.id, newStageOrder)
        .then(() => {
          addToast(t(`${translationPath}stage-moved-successfully`), {
            appearance: 'success',
            autoDismissTimeout: 3000,
          });
          setIsPipelineLoading(false);
        })
        .catch((error) => {
          showError(t(`${translationPath}stage-move-failed`), error);

          setIsPipelineLoading(false);
        });

      return;
    }

    // If we drag outside; do nothing. ▼
    if (!destination || result.reason === 'CANCEL') {
      setDraggingTaskId(null);
      setIsPipelineLoading(false);
      return;
    }

    // If we drag to the same column; do nothing. ▼
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      setDraggingTaskId(null);
      setIsPipelineLoading(false);
      return;
    }
    // Reorder on the Front-end.
    const updated = reorderWithoutSend(data, selectedTaskIds, source, destination);

    MoveCandidateStage(
      props.match.params.id,
      destination.droppableId,
      !selectedTaskIds.length ? [draggableId] : selectedTaskIds,
    )
      // return;
      // Get this move ID ▼
      .then((res) => {
        setSelectedColumn('');
        setToDo(res.data.results.move_id);
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Move candidate between stages',
          'Move candidate between stages from EVA-SSESS',
          1,
          {},
        ]);
        // Start timeout
        timeoutRef.current = setTimeout(() => {
          // When timeout finishes,
          doDo(res.data.results.move_id, true, updated);
        }, 5000);

        // ToastPipeline
        removeAllToasts();
        addToast(t(`${translationPath}candidate(s)-moved-successfully`), {
          appearance: 'success',
          pauseOnHover: false,
          onUndo: () => {
            // Undo on Front-end
            setData(oldData);

            clearTimeout(timeoutRef.current);
            removeAllToasts();
            setIsPipelineLoading(false);

            // Undo on Back-end
            // doDo(res.data.results.move_id, false);
          },
        });
      })
      .catch((error) => {
        setIsPipelineLoading(false);
        setIsDraggingDisabled(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  const doDo = async (idToDo, action, data) => {
    const tempData = data;
    MoveCandidateStageAction(idToDo, action, filters?.completeness?.id === 1 ? 1 : 0)
      .then((res) => {
        setToDo(null);
        setIsWorking(true);
        const arr = Object.entries(res?.data?.results?.stages);
        for (let j = 0; j < arr.length; j++)
          for (const property in tempData?.stages)
            if (arr[j][0] === property) {
              tempData.stages[property].totalCandidates = arr[j][1];
              tempData.stages[property].total_candidates_with_filters = arr[j][1];
            }

        // setData(tempData);
        // setSelectedTaskIds([]);
        // setSelectedTaskItems([]);
        unselectAll();
        setIsWorking(false);
        setIsPipelineLoading(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };
  const reorderWithoutSend = (data, selectedTaskIds, source, destination) => {
    // Reorder, Don't send! ▼
    const processed = reorder({
      data,
      selectedTaskIds,
      source,
      destination,
    });
    setData(processed.newData);
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

  const toggleSelectionInGroup = (taskId) => {
    const index = selectedTaskIds.indexOf(taskId);
    if (index === -1) {
      setSelectedTaskIds((items) => [...items, taskId]);
      return;
    }
    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);
    setSelectedTaskIds(shallow);
  };

  const unselectAll = () => {
    setSelectedTaskIds([]);
    setSelectedColumn('');
    setSelectedTaskItems([]);
  };

  // Keys

  const onWindowKeyDown = (e) => {
    if (e.defaultPrevented) return;

    if (e.key === 'Escape') unselectAll();
  };

  const onWindowTouchEnd = (e) => {
    if (e.defaultPrevented) return;

    unselectAll();
  };

  // Open the notes and teams modal from the notifications list.
  useEffect(() => {
    if (window.location.pathname.includes('notes')) setShowNotesModal(true);
    else if (window.location.pathname.includes('teams')) setShowTeamsModal(true);
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
  const [isInviteCandidateOpen, setIsInviteCandidateOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsInviteOpen(false);
    setIsInviteCandidateOpen(false);
  };

  const showSendQuestionnaireModal = () => {
    setIsAddModalOpen(true);
  };
  const showInviteCandidatesModal = () => {
    setIsInviteCandidateOpen(true);
  };

  const [isFiltering] = useState(false);

  /**
   * Add new candidates to the stage (when clicking loadMore from inside the stage)
   * @param stageId
   * @param candidatesToAdd
   */
  const addNewCandidates = (stageId, candidatesToAdd) => {
    const tempData = JSON.parse(JSON.stringify(data));
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
        name: `${c.first_name} ${c.last_name}`,
        email: c.email,
        is_new: c.is_new,
        is_completed: c.is_completed,
        register_at: c.register_at,
        profile_image: c.profile_image,
        total_comments: c.total_comments,
        avg_rating: c.recruiter_avg_rating,
        similarity: c.model_answer_similarity,
      };
    });
    setData(tempData);
  };

  // Change Stage Title
  const changeStageTitle = (stageId, newStageTitle) => {
    const tempData = JSON.parse(JSON.stringify(data));
    tempData.stages[stageId].title = newStageTitle;
    setData(tempData);
  };

  // Add New Stage
  const addNewStageToPipeline = (newStage) => {
    const tempData = JSON.parse(JSON.stringify(data));
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
    setData(tempData);
    setDisplayedStages(tempData.stageOrder);
  };

  const showManageWeightsModal = () => {
    // Tracing
    setDialog(
      <ManageWeights
        isOpen
        closeModal={closeDialog}
        pipeline={props.match.params.id}
        // setWeightsAreLoading={setIsWorking}
        parentTranslationPath={props.parentTranslationPath}
        evassess
        onSave={() => {
          getPipeline();
          closeDialog();
        }}
      />,
    );
  };

  const closeDialog = () => setDialog(null);

  const exportsCandidatesRates = () => {
    evassessAPI
      .exportCandidatesRates({ prep_assessment_uuid: props.match?.params?.id })
      .then((response) => {
        setDeleteAlert(null);
        downloadCSV(response?.data?.results?.link);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  const confirmedAlert = () => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}generating-report`)}
        showConfirm={false}
        onConfirm={() => {}}
        showCancel={false}
      />,
    );
    exportsCandidatesRates();
  };

  const downloadCSV = (filePath) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={
          <div className="h6 font-weight-normal text-gray">
            {t(`${translationPath}report-is-ready-click`)}
            <a
              download
              target="_blank"
              href={filePath}
              className="px-1"
              rel="noreferrer"
            >
              {t(`${translationPath}here`)}
            </a>
            {t(`${translationPath}to-download-it`)}
          </div>
        }
        showConfirm={false}
        onConfirm={() => {}}
        showCancel
        onCancel={() => setDeleteAlert(null)}
      />,
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onQuestionPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  useEffect(() => {
    if (data && data.stages && selectedColumn) {
      const totalCandidatesInStage = Object.entries(data.stages).filter(
        (item) => item[0] === selectedColumn,
      )[0][1].total_candidates_with_filters;
      setTotalNumberOfCandidates(totalCandidatesInStage);
    } else setTotalNumberOfCandidates(0);
  }, [data, selectedColumn]);

  return (
    <>
      {/* Modals  */}
      <ToastProvider placement="top-center">
        <PipelineFilters
          isOpen={showFilterModal}
          onClose={() => {
            setShowFilterModal(false);
          }}
          parentTranslationPath={props.parentTranslationPath}
          onApply={(filters) => {
            setFilters(filters);
            setSelectedTaskIds([]);
            setSelectedTaskItems([]);
            setSelectedColumn('');
            setShowFilterModal(false);
          }}
        />
        <SendReminderModal
          unselectAll={unselectAll}
          isOpen={showSendReminderModal}
          selectedColumn={selectedColumn}
          selectedTaskItems={selectedTaskItems}
          selectedStageTitle={selectedStageTitle}
          assessment_uuid={props.match?.params?.id}
          currentAssessment={props.currentAssessment}
          totalNumberOfCandidates={totalNumberOfCandidates}
          parentTranslationPath={props.parentTranslationPath}
          onClose={() => setShowSendReminderModal(false)}
        />
        {showNotesModal && (
          <AddNoteModal
            type_panel="prep_assessment"
            paths={paths}
            isOpen={showNotesModal}
            parentTranslationPath={props.parentTranslationPath}
            onClose={() => {
              setShowNotesModal(false);
              history.replace({ ...history.location, state: {} });
            }}
            {...props}
            uuid={props.match?.params?.id}
          />
        )}
        {showTeamsModal && (
          <TeamsModal
            paths={paths}
            isOpen={showTeamsModal}
            parentTranslationPath={props.parentTranslationPath}
            onClose={() => {
              setShowTeamsModal(false);
              history.replace({ ...history.location, state: {} });
            }}
            {...props}
          />
        )}
        {showShareCandidate && selectedTaskIds?.length ? (
          <ShareProfileModal
            isOpen
            assessment_uuid={props.match?.params?.id}
            type="evassess"
            match={props.match}
            parentTranslationPath={props.parentTranslationPath}
            onClose={() => setShareCandidate(false)}
            uuid={selectedTaskIds}
          />
        ) : null}

        {candidates && pipeline && isAddModalOpen && (
          <SendQuestionnaire
            isOpen={isAddModalOpen}
            closeModal={closeModal}
            pipeline={pipeline}
            parentTranslationPath={props.parentTranslationPath}
            match={props.match}
            user={user}
            selectedCandidates={selectedTaskIds}
            candidates={candidates}
          />
        )}

        {isInviteOpen && (
          <InviteStatus
            isOpen={isInviteOpen}
            closeModal={closeModal}
            parentTranslationPath={props.parentTranslationPath}
            onClick={() => setIsInviteOpen(!isInviteOpen)}
            match={props.match}
            user={user}
          />
        )}
        {isInviteCandidateOpen && (
          <InviteCandidates
            isOpen={isInviteCandidateOpen}
            closeModal={closeModal}
            parentTranslationPath={props.parentTranslationPath}
            match={props.match}
            user={user}
            language_id={props.currentAssessment?.language?.id}
          />
        )}
      </ToastProvider>
      {/* Modals */}

      <ManageTabs
        id={props?.match?.params?.id}
        isActive={props.isActive}
        rightTabs={
          <>
            {filters
            && filters.completeness
            && filters.completeness.id
            && filters.completeness.id === 1 ? (
                <ButtonBase
                  disabled={selectedTaskIds.length === 0 || isPipelineLoading}
                  onClick={() => setShowSendReminderModal(true)}
                  className="btn nav-link text-gray font-weight-normal nav-link-shadow"
                >
                  <i className="fas fa-stopwatch" />
                  <span className="px-1">{t(`${translationPath}send-reminder`)}</span>
                </ButtonBase>
              ) : (
                <></>
              )}
            {getIsAllowedPermissionV2({
              permissions,
              permissionId:
                ManageAssessmentsPermissions.NotesEvaSsessApplication.key,
            }) && (
              <NavItem
                color="link"
                className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                onClick={() => setShowNotesModal(true)}
              >
                <i className="far fa-sticky-note" />
                <span className="px-1">{t(`${translationPath}notes`)}</span>
              </NavItem>
            )}
            <>
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                  onClick={() => setShowTeamsModal(true)}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageAssessmentsPermissions.MangeTeams.key,
                    })
                  }
                >
                  <i className="fas fa-users" />
                  <span className="px-1">{t(`${translationPath}teams`)}</span>
                </NavLink>
              </NavItem>
            </>

            <NavItem>
              <NavLink
                color="link"
                className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                onClick={() => {
                  showManageWeightsModal();
                }}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.MangeWeights.key,
                  })
                }
              >
                <i className="fa fa-balance-scale" />
                <span className="px-1">{t(`${translationPath}manage-weights`)}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                color="link"
                className="btn nav-link nav-link-shadow text-gray font-weight-normal"
                disabled={
                  (selectedTaskIds?.length || 0) === 0
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.ShareApplicant.key,
                  })
                }
                onClick={() => setShareCandidate(true)}
              >
                <i className="fas fa-link" />
                <span className="px-1">{t(`${translationPath}share`)}</span>
              </NavLink>
            </NavItem>
            <NavItem className="float-right">
              <UncontrolledDropdown>
                <DropdownToggle
                  color=""
                  className="nav-link nav-link-shadow text-primary font-weight-normal"
                >
                  <span>{t(`${translationPath}display-all`)}</span>
                  <i className="fa fa-angle-down ml-2-reversed" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      if (
                        data
                        && data.stageOrder
                        && data.stageOrder.length
                        && displayedStages
                      )
                        if (data.stageOrder.length === displayedStages.length)
                          setDisplayedStages([]);
                        else setDisplayedStages(data.stageOrder);
                    }}
                  >
                    <CheckboxesComponent
                      idRef="displayedStagesAllRef"
                      label={t(`${translationPath}all`)}
                      singleChecked={
                        (data && data.stageOrder && data.stageOrder.length)
                        === (displayedStages && displayedStages.length)
                      }
                    />
                  </DropdownItem>

                  {data
                    && data.stageOrder.map((stageId, i) => {
                      const stage = data.stages[stageId]; // Column
                      return (
                        <DropdownItem
                          key={i}
                          onClick={() => {
                            setDisplayedStages((displayedStages) =>
                              displayedStages.includes(stage?.id)
                                ? displayedStages.filter((d) => d !== stage?.id)
                                : [...displayedStages, stage?.id],
                            );
                          }}
                        >
                          <CheckboxesComponent
                            idRef={stage.title}
                            label={stage.title}
                            singleChecked={
                              (displayedStages
                                && displayedStages.includes(stage?.id))
                              || false
                            }
                          />
                        </DropdownItem>
                      );
                    })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
            {getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                AddEvaSsessApplication:
                  CreateAssessmentPermissions.AddEvaSsessApplication,
                UpdateEvaSsessApplication:
                  CreateAssessmentPermissions.UpdateEvaSsessApplication,
              },
            }) && (
              <NavItem className="float-right">
                <UncontrolledDropdown>
                  <DropdownToggle
                    color=""
                    className="nav-link nav-link-shadow text-gray font-weight-normal"
                  >
                    <span>{t(`${translationPath}action`)}</span>
                    <i className="fas fa-angle-down ml-2-reversed" />
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem
                      disabled={
                        !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                            ManageAssessmentsPermissions.AddApplicants.key,
                        })
                      }
                      onClick={(e) => {
                        showInviteCandidatesModal();
                      }}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      <i className="fas fa-plus" />
                      <span className="px-1">
                        {t(`${translationPath}add-candidates`)}
                      </span>
                    </DropdownItem>
                    <div onMouseEnter={onQuestionPopperOpen}>
                      <DropdownItem
                        onClick={(e) => {
                          showSendQuestionnaireModal();
                        }}
                        disabled={
                          selectedTaskIds.length === 0
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageAssessmentsPermissions.SendQuestionnaire.key,
                          })
                        }
                        color="link"
                        className="btn-sm justfiy-self-end text-dark"
                      >
                        <i className="fas fa-paper-plane" />
                        <span className="px-1">
                          {t(`${translationPath}send-questionnaire`)}
                        </span>
                      </DropdownItem>
                    </div>
                    <DropdownItem
                      onClick={() => {
                        setIsInviteOpen(!isInviteOpen);
                        window?.ChurnZero?.push([
                          'trackEvent',
                          'EVA-SSESS - Click on invite status',
                          'Click on invite status',
                          1,
                          {},
                        ]);
                      }}
                      color="link"
                      className="btn-sm justfiy-self-end text-dark"
                    >
                      <i className="fas fa-user-plus" />
                      <span className="px-1">
                        {t(`${translationPath}invite-status`)}
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </NavItem>
            )}
            <NavItem className="float-right">
              <UncontrolledDropdown>
                <DropdownToggle
                  color=""
                  className="nav-link nav-link-shadow text-gray font-weight-normal"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissions,
                      permissionId: ManageAssessmentsPermissions.DownloadReport.key,
                    })
                  }
                >
                  <span>{t(`${translationPath}reports`)}</span>
                  <i className="fas fa-angle-down ml-2-reversed" />
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem
                    onClick={() => confirmedAlert()}
                    color="link"
                    className="btn-sm justfiy-self-end text-dark"
                  >
                    <i className="fas fa-file-export" />
                    <span className="px-1">
                      {t(`${translationPath}export-candidates-rate`)}
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </NavItem>
            {getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                AddEvaSsessApplication:
                  CreateAssessmentPermissions.AddEvaSsessApplication,
                UpdateEvaSsessApplication:
                  CreateAssessmentPermissions.UpdateEvaSsessApplication,
              },
            }) && (
              <NavItem>
                <NavLink
                  color="link"
                  className="btn nav-link nav-link-shadow px-2 float-right text-gray font-weight-normal"
                  onClick={() => setShowFilterModal(true)}
                >
                  <i className="fas fa-sliders-h" />
                </NavLink>
              </NavItem>
            )}
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
              {(!data || isWorking) && <BoardsLoader />}
              {data && !isWorking && (
                <>
                  <Droppable
                    droppableId="all-columns"
                    direction="horizontal"
                    type="column"
                  >
                    {(provided) => (
                      <ContextContainer
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {data.stageOrder.map((stageId, index) => {
                          const stage = data.stages[stageId]; // Column
                          const candidates = stage.candidatesIds.map(
                            (candidateId) => data.candidates[candidateId],
                          );
                          return (
                            <Pipeline
                              {...props}
                              className="col-xs-6 col-sm-4 col-md-3 rounded overflow-auto pipeline-item mx-1"
                              key={stage.id}
                              id={stageId}
                              index={index}
                              stage={stage}
                              candidates={candidates}
                              data={data}
                              toggleSelection={toggleSelection}
                              toggleSelectionInGroup={toggleSelectionInGroup}
                              selectedTaskIds={selectedTaskIds}
                              setSelectedTaskIds={(n) => setSelectedTaskIds(n)}
                              setSelectedTaskItems={setSelectedTaskItems}
                              selectedColumn={selectedColumn}
                              setSelectedColumn={setSelectedColumn}
                              unselectAll={unselectAll}
                              draggingTaskId={draggingTaskId}
                              addNewCandidates={addNewCandidates}
                              changeStageTitle={changeStageTitle}
                              assessment_uuid={props.match?.params?.id}
                              setSelectedStageTitle={setSelectedStageTitle}
                              parentTranslationPath={props.parentTranslationPath}
                              filters={filters}
                              isPipelineLoading={isPipelineLoading}
                              isDraggingDisabled={
                                isDraggingDisabled
                                || !getIsAllowedPermissionV2({
                                  permissions,
                                  permissionId:
                                    ManageAssessmentsPermissions
                                      .MoveEvaSsessApplication.key,
                                })
                              }
                            />
                          );
                        })}
                        <AddNewStageColumn
                          match={props.match}
                          parentTranslationPath={props.parentTranslationPath}
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
          {dialog}
          {DeleteAlert}
        </div>
      </div>

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
