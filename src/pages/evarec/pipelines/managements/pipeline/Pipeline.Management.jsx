import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useTitle } from '../../../../../hooks';
import './PipelineManagement.Style.scss';
import {
  GetAllIntegrationsConnections,
  GetAllStagesCandidates,
  GetJobById,
  PipelinePreMoveTo
} from '../../../../../services';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  PagesFilterInitValue,
  showError,
} from '../../../../../helpers';
import { PipelineSection, PipelineHeaderSection, PipelineDrawer } from './sections';
import { CandidateManagementDialog } from '../../../shared';
import {
  JobHiringStatusesEnum,
  PipelineBulkSelectTypesEnum,
  PipelineMoveToTypesEnum,
  PipelinePreMoveErrorTypesEnum,
  PipelineStageResponsibilityTypesEnum,
  PipelineStagesEnum,
  ProfileManagementFeaturesEnum,
  ProfileSourcesTypesEnum,
  ScorecardAppereanceEnum,
} from '../../../../../enums';
import moment from 'moment';
import { PipelineStageMovementTypes } from '../../../../../enums/Pages/PipelineStageMovementTypes.Enum';
import {
  AssignJobDialog,
  MoveJobToClosedDialog,
  ScoresSummaryDialog,
} from './sections/pipeline-header/dialogs';
import { Backdrop, CircularProgress } from '@mui/material';
import {
  ManageApplicationsPermissions,
  ScorecardPermissions,
} from '../../../../../permissions';
import { updateSelectedBranch } from '../../../../../stores/actions/selectedBranchActions';
import { useDispatch, useSelector } from 'react-redux';
import { ScorecardDetailsDrawer } from './sections/scorecard-details-drawer/ScorecardDetails.Drawer';
import { EvaluateDrawer } from '../../../../recruiter-preference/Scorecard/ScorecaredBuilder/evaluate-drawer/EvaluateDrawer';
import { AssignScorecardDialog } from './sections/pipeline-header/dialogs/AssignScorecard.Dialog';
const mutateFilters = ({ filters, tags }) => ({
  applicant_number: filters?.applicant_number,
  job_position: filters?.job_position,
  national_id: filters?.national_id,
  candidate_name: filters?.candidate_name,
  reference_number: filters?.reference_number,
  skills: filters?.skills,
  // candidate_property: filters?.candidate_property,
  source_type: filters?.source_type && filters?.source_type.key,
  source_uuid:
    filters?.source_type?.key
    && (((filters?.source_type?.key === ProfileSourcesTypesEnum.Agency.key
      || filters?.source_type?.key === ProfileSourcesTypesEnum.University.key)
      && filters?.source?.user_uuid)
      || filters?.source?.uuid),
  ...(filters?.is_include === true
  || filters?.is_include === 'true'
  || filters?.is_include === false
  || filters?.is_include === 'false'
    ? {
      is_include:
          filters?.is_include === true || filters?.is_include === 'true' ? true : 0,
    }
    : { is_include: null }),
  major: filters?.major ? filters?.major.map((item) => item.uuid) : [],
  job_type: filters?.job_type ? filters?.job_type.map((item) => item.uuid) : [],
  degree_type: filters?.degree_type
    ? filters?.degree_type.map((item) => item.uuid)
    : [],
  industry: filters?.industry ? filters?.industry.map((item) => item.uuid) : [],
  career_level: filters?.career_level
    ? filters?.career_level.map((item) => item.uuid)
    : [],
  country: filters?.country ? filters?.country.map((item) => item.uuid) : [],
  nationality: filters?.nationality
    ? filters?.nationality.map((item) => item.uuid)
    : [],
  languages_proficiency: filters?.language
    ? filters?.language.map((item) => item.uuid)
    : [],
  gender: filters?.gender ? filters?.gender.uuid : null,
  years_of_experience:
    filters?.years_of_experience > 0 ? filters?.years_of_experience : null,
  score: filters?.score > 0 ? filters?.score : null,
  query: filters?.query ? filters?.query.map((item) => item) : [],
  tag: tags
    ?.filter((item) => item?.key)
    .map((item) => ({
      ...item,
      value: item?.value.map((val) => val?.uuid),
    })),
  assigned_employee_uuid: filters?.assigned_employee_uuid?.map(
    (it) => it?.user_uuid,
  ),
  assigned_user_uuid: filters?.assigned_user_uuid?.map((it) => it?.uuid),
  assessment_test_status: filters?.assessment_test_status?.key,
  from_height: filters?.from_height,
  to_height: filters?.to_height,
  from_weight: filters?.from_weight,
  to_weight: filters?.to_weight,
  age_gte: filters?.age_gte,
  age_lte: filters?.age_lte,
  va_assessment_status: filters?.va_assessment_status?.key,
  questionnaire_status: filters?.questionnaire_status?.key,
  va_assessment_uuid: filters?.va_assessment_uuid?.map((it) => it?.uuid),
  questionnaire_uuid: filters?.questionnaire_uuid?.map(
    (it) => it?.job_questionnaire_uuid,
  ),
  dynamic_properties: filters?.candidate_property || [],
  candidate_property: [],
  has_assignee: filters?.has_assignee?.key,
});
const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'PipelineManagement.';
export const PipelineManagement = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}pipeline-management`));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const params = useParams();
  const history = useHistory();
  const [isEvaSSESS, setIsEvaSSESS] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openedDetailsSection, setOpenedDetailsSection] = useState(null);
  const [temporaryMovedCandidates, setTemporaryMovedCandidates] = useState({
    candidates: [],
    stage_uuid: null,
    is_successfully_confirmed: false,
  });
  const isJobUUIDChangedRef = useRef(true);
  const [hiddenStages, setHiddenStages] = useState([]);
  // const [draggingCandidate, setDraggingCandidate] = useState(null);
  const [isDisabledAllDragging, setIsDisabledAllDragging] = useState(false);
  const [isForceToReloadCandidates, setIsForceToReloadCandidates] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [jobUUID, setJobUUID] = useState(null);
  // array of object of
  // {candidate: {}, stage:{}}
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  // this is to hold the stages that are waiting to confirm by toaster right after select the stages
  const [selectedOnHoldStages, setSelectedOnHoldStages] = useState([]);
  // this is to save the stage that confirmed to select all candidates in it even the unloaded once
  const [selectedConfirmedStages, setSelectedConfirmedStages] = useState([]);
  // store the stage uuid if the user check select all candidates to update the
  // selected candidates array
  const [selectedAllLoadedStageCandidates, setSelectedAllLoadedStageCandidates]
    = useState([]);
  const [isBulkSelect, setIsBulkSelect] = useState(false);
  const [backDropLoader, setBackDropLoader] = useState(false);
  const [filters, setFilters] = useState(
    sessionStorage.getItem('pipelineFilter')
      ? JSON.parse(sessionStorage.getItem('pipelineFilter'))
      : { filters: { ...PagesFilterInitValue }, tags: [] },
  );
  const destroySessionFiltersRef = useRef(true);
  // to be activated in future for details open & close
  // const [detailsSideMenu, setDetailsSideMenu] = useState({
  //   info: false,
  //   settings: false,
  // });
  const query = useQuery();
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state?.userReducer);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const branchRef = useRef(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    notes: false, // to be added to the side menu
    teams: false, // to be added to the side menu
    manageWeights: false,
    manageQuestionnaires: false,
    share: false,
    filters: false,
    addCandidate: false,
    sendQuestionnaire: false,
    sendVideoAssessment: false,
    shareProfile: false,
    jobPipelinesManagement: false,
    moveToManagement: null, // the type of the init selected move to (enum key)
    candidateModal: false,
    assignJob: false,
    scheduleInterview: false,
    sendForm: false,
    assignScorecard: false,
    scoresSummary: false,
    inviteStatus: false,
    sendCentralAssessment: false,
    sendCentralAssessmentReminder: false,
    moveJobToClosed: false,
    assignCandidates: false,
    sendOffer: false,
    sendOfferReminder: false,
    export: false,
  });
  const [isConnectionLoading, setConnectionsIsLoading] = useState(false);
  const [connections, setConnections] = useState({
    results: [],
    totalCount: 0,
  });
  const [activeStage, setActiveStage] = useState(null);
  const [firstPageStagesCandidates, setFirstPageStagesCandidates] = useState([]);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    others: null,
    customView: null,
    moveTo: null,
    actions: null,
    sendActions: null,
    exportActions: null,
    sort: null,
    headerActions: null,
  });
  const [candidatesFilters, setCandidatesFilters] = useState(
    sessionStorage.getItem('pipelineFilter')
      ? mutateFilters(JSON.parse(sessionStorage.getItem('pipelineFilter')))
      : {},
  );
  // this is for the dropdown returned values
  const [activeJobPipelineUUID, setActiveJobPipelineUUID] = useState(null);
  const activeJobPipelineUUIDRef = useRef(null);
  // this is for the pipeline details result
  const [activePipeline, setActivePipeline] = useState(null);

  /**
   * @param newValue - array of objects
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of selected candidates from child
   */
  const onSelectedCandidatesChanged = useCallback((newValue) => {
    setSelectedCandidates(newValue);
  }, []);

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the update the dragging candidate details from child
   */
  const onTemporaryMovedCandidatesChanged = useCallback((newValue) => {
    setTemporaryMovedCandidates((items) => ({
      ...items,
      ...newValue,
    }));
  }, []);

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the candidates filters from child
   */
  const onCandidatesFiltersChanged = useCallback((newValue) => {
    setCandidatesFilters((items) => ({
      ...items,
      ...newValue,
    }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reset all selection states (each state hold different jobs) when call it
   */
  const onResetSelectedCandidates = useCallback(() => {
    setSelectedConfirmedStages((items) => (items.length > 0 ? [] : items));
    setSelectedOnHoldStages((items) => (items.length > 0 ? [] : items));
    setSelectedAllLoadedStageCandidates((items) => (items.length > 0 ? [] : items));
    setSelectedCandidates((items) => (items.length > 0 ? [] : items));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to force the child to reload the candidates on anytime
   */
  const onForceToReloadCandidatesChanged = useCallback(() => {
    setIsForceToReloadCandidates((item) => !item);
    onResetSelectedCandidates();
  }, [onResetSelectedCandidates]);

  // Handle filters dialog change
  const onFiltersChanged = useCallback(({ filters, tags }) => {
    const toBeSendJSON = mutateFilters({ filters, tags });
    setCandidatesFilters((items) => ({
      ...items,
      ...toBeSendJSON,
    }));
    // onCandidatesFiltersChanged(toBeSendJSON);
    setFilters({
      tags,
      filters,
    });
  }, []);

  useEffect(() => {
    if (filters) sessionStorage.setItem('pipelineFilter', JSON.stringify(filters));
  }, [filters]);

  // Delete the filters from session storage when refresh the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('pipelineFilter');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      if (destroySessionFiltersRef.current)
        sessionStorage.removeItem('pipelineFilter');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  /**
   * @param newValue - array of uuids
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of stage selected
   * all loaded candidates from child
   */
  const onSelectedAllLoadedStageCandidatesChanged = useCallback((newValue) => {
    setSelectedAllLoadedStageCandidates((items) =>
      (!newValue || newValue.length === 0) && items.length === 0
        ? items
        : newValue || [],
    );
  }, []);

  /**
   * @param newValue - array of stages uuids
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of confirm stage selected
   * all loaded candidates from child
   */
  const onSelectedConfirmedStagesChanged = useCallback((newValue) => {
    setSelectedConfirmedStages((items) =>
      (!newValue || newValue.length === 0) && items.length === 0
        ? items
        : newValue || [],
    );
  }, []);

  /**
   * @param newValue - array of stages uuids
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of holding stage selected
   * all loaded candidates from child
   */
  const onSelectedOnHoldStagesChanged = useCallback((newValue) => {
    setSelectedOnHoldStages((items) =>
      (!newValue || newValue.length === 0) && items.length === 0
        ? items
        : newValue || [],
    );
  }, []);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of active job from child
   */
  const onActiveJobChanged = useCallback(
    (newValue) => {
      if (newValue.value) {
        setFirstPageStagesCandidates([]);
        setActiveJobPipelineUUID(null);
        setActivePipeline(null);
        onResetSelectedCandidates();
        setJobUUID((newValue.value && newValue.value.uuid) || null);
        history.push(newValue.value.uuid);
        isJobUUIDChangedRef.current = true;
      }
      // if (!newValue.value) setActivePipeline(null);
    },
    [history, onResetSelectedCandidates],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of active pipeline from child
   */
  const onActivePipelineChanged = useCallback(
    (newValue) => {
      setActiveJobPipelineUUID(newValue.value);
      setFirstPageStagesCandidates([]);
      onResetSelectedCandidates();
    },
    [onResetSelectedCandidates],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of active job (state) from child
   */
  const onSetActiveJobChanged = useCallback(
    // here insure new value of job id changed
    (newValue) => {
      if (
        !newValue.pipelines.some(
          (pipeline) => pipeline.uuid === activeJobPipelineUUIDRef.current,
        )
      )
        onActivePipelineChanged(newValue.pipelines[0]);
      setActiveJob(newValue);
    },
    [onActivePipelineChanged],
  );

  /**
   * @param candidateUUID - string
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the selected candidate index
   */
  const getSelectedCandidateIndex = useMemo(
    () => (candidateUUID) =>
      selectedCandidates.findIndex((item) => item.candidate.uuid === candidateUUID),
    [selectedCandidates],
  );

  /**
   * @param candidateUUID - string
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the candidate selected or not
   */
  const getIsSelectedCandidate = useMemo(
    () => (candidateUUID) => getSelectedCandidateIndex(candidateUUID) !== -1,
    [getSelectedCandidateIndex],
  );

  const reinitializeFilteredCandidates = useMemo(
    () =>
      (candidatesArray, isWithExtraDetails = false) => {
        const tempStageList = [];
        return candidatesArray
          .map((item) => ({
            ...item,
            bulkSelectType: selectedConfirmedStages.includes(item.stage.uuid)
              ? PipelineBulkSelectTypesEnum.Stage.key
              : PipelineBulkSelectTypesEnum.Candidate.key,
          }))
          .filter((item) => {
            if (item.bulkSelectType === PipelineBulkSelectTypesEnum.Candidate.key)
              return true;
            if (
              item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key
              && tempStageList.indexOf(item.stage.uuid) === -1
            ) {
              tempStageList.push(item.stage.uuid);
              return true;
            }
            return false;
          })
          .map((item) => ({
            ...(isWithExtraDetails && item),
            type:
              (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key
                && PipelineBulkSelectTypesEnum.Stage.key)
              || PipelineBulkSelectTypesEnum.Candidate.key,
            uuid:
              (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key
                && item.stage.uuid)
              || item.candidate.uuid,
          }));
      },
    [selectedConfirmedStages],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the total selected candidates (with bulk)
   */
  const getTotalSelectedCandidates = useMemo(
    () =>
      (localSelectedCandidates = selectedCandidates) => {
        if (!activePipeline || !activePipeline.stages) return 0;
        const confirmStagesDetails = activePipeline.stages.filter((item) =>
          selectedConfirmedStages.includes(item.uuid),
        );
        return (
          reinitializeFilteredCandidates(localSelectedCandidates).filter(
            (item) => item.type !== PipelineBulkSelectTypesEnum.Stage.key,
          ).length
          + confirmStagesDetails.reduce(
            (total, item) => total + (item.total_candidates || 0),
            0,
          )
        );
      },
    [
      activePipeline,
      reinitializeFilteredCandidates,
      selectedCandidates,
      selectedConfirmedStages,
    ],
  );

  /**
   * @param stageUUID - string
   * @param totalStageCandidates - number
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all the candidates are
   * selected (for each stage)
   */
  const getIsSelectedAllCandidates = useMemo(
    () => (stageUUID, totalStageCandidates) =>
      (totalStageCandidates > 0
        && selectedCandidates.filter((item) => item.stage.uuid === stageUUID).length
          === totalStageCandidates)
      || selectedConfirmedStages.includes(stageUUID),
    [selectedConfirmedStages, selectedCandidates],
  );

  /**
   * @param stageUUID - string
   * @param totalStageCandidates - number
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if some candidates are
   * selected (for each stage)
   */
  const getIsSelectedSomeCandidates = useMemo(
    () => (stageUUID, totalStageCandidates) =>
      selectedCandidates.some((item) => item.stage.uuid === stageUUID)
      && selectedCandidates.filter((item) => item.stage.uuid === stageUUID).length
        < totalStageCandidates
      && !selectedConfirmedStages.includes(stageUUID),
    [selectedCandidates, selectedConfirmedStages],
  );

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of stages or pipeline details changed from the child's
   * (but without change the uuid or the selected uuid)
   */
  const onActivePipelineDetailsChanged = useCallback((newValue) => {
    setActivePipeline(newValue);
    setActiveJob((item) => {
      const localItem = { ...item };
      const changedPipelineIndex = (localItem.pipelines || []).findIndex(
        (element) => element.uuid === newValue.uuid,
      );
      if (changedPipelineIndex !== -1) {
        localItem.pipelines[changedPipelineIndex] = newValue || {};
        return { ...localItem, pipelines: [...localItem.pipelines] };
      }
      return item;
    });
  }, []);

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of activeStage details changed from the child's
   * (but without change the uuid or the selected uuid)
   */
  const onActiveStageDetailsChanged = useCallback((newValue) => {
    setActiveStage(newValue);
  }, []);

  /**
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is disabled all dragging
   * from child to prevent the move for candidates during saving another moving process
   */
  const onIsDisabledAllDraggingChanged = useCallback((newValue) => {
    setIsDisabledAllDragging(newValue);
  }, []);

  /**
   * @param newValue - key (enum key value)
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open details' section
   * from child
   */
  const onOpenedDetailsSectionChanged = useCallback((newValue) => {
    setOpenedDetailsSection(newValue);
    if (!newValue) setActiveStage(null);
  }, []);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of hidden stages from child
   */
  const onHiddenStagesChanged = useCallback((newValue) => {
    setHiddenStages(newValue);
  }, []);

  /**
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of bulk select from child
   */
  const onIsBulkSelectChanged = useCallback(
    (newValue) => {
      if (!newValue) onResetSelectedCandidates();

      setIsBulkSelect(newValue);
    },
    [onResetSelectedCandidates],
  );

  /**
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of search from child
   */
  const onIsLoadingChanged = useCallback((newValue) => {
    setIsLoading(newValue);
  }, []);

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the rerender for candidates
   * after saving (add) new candidate
   */
  const onSaveCandidateHandler = useCallback(() => {
    onIsOpenDialogsChanged('addCandidate', false);
    setTimeout(() => {
      onForceToReloadCandidatesChanged();
    }, 2000);
  }, [onForceToReloadCandidatesChanged, onIsOpenDialogsChanged]);

  const onJobAssignHandler = useCallback(() => {
    onIsOpenDialogsChanged('assignJob', false);
    onForceToReloadCandidatesChanged();
  }, [onForceToReloadCandidatesChanged, onIsOpenDialogsChanged]);

  /**
   * @param key
   * @param newValue - eventTarget
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of attached popovers from child
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  // /**
  //  * @param newValue
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to handle the change of active pipeline
  //  * (returned data) from dynamic autocomplete data
  //  */
  // const getReturnedData = useCallback((dataList) => {
  //   if (dataList && dataList.length > 0 && isJobUUIDChangedRef.current) {
  //     isJobUUIDChangedRef.current = false;
  //     setActiveJobPipelineUUID(dataList[0]);
  //     setSelectedCandidates((items) => (items.length ? [] : items));
  //   }
  // }, []);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of selected candidates from child
   */
  const getActiveJobByUUID = useCallback(
    async (job_uuid, noRedirect, company_uuid) => {
      setIsLoading(true);
      const response = await GetJobById({ job_uuid, company_uuid });
      setIsLoading(false);
      if (response && response.status === 200)
        setActiveJob(response.data.results.job);
      else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        if (!noRedirect) GlobalHistory.push('/recruiter/job/manage/active');
      }
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of active job data but without change uuid
   */
  const onChangeTheActiveJobData = useCallback(
    (noRedirect) => {
      getActiveJobByUUID(activeJob && activeJob.uuid, noRedirect);
    },
    [activeJob, getActiveJobByUUID],
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of selected candidates from child
   */
  const onLoadedCandidatesChanged = useCallback(
    async (newCandidates, stage_uuid, isMoreCandidates = false) => {
      setActivePipeline((items) => {
        const localItems = { ...items };
        const changedStageIndex = items.stages.findIndex(
          (item) => item.uuid === stage_uuid,
        );
        if (changedStageIndex !== -1)
          if (isMoreCandidates) {
            localItems.stages[changedStageIndex].candidates.push(
              ...newCandidates.candidates,
            );
            localItems.stages[changedStageIndex].total_candidates
              = newCandidates.total_candidates;
            localItems.stages[changedStageIndex].total_before_filter
              = newCandidates.total_before_filter;
            return localItems;
          } else {
            localItems.stages[changedStageIndex] = {
              candidates: [],
              ...localItems.stages[changedStageIndex],
              ...newCandidates,
            };
            return localItems;
          }
        return items;
      });
    },
    [],
  );

  // this is to change the location of the candidates to the pipeline after move successfully
  useEffect(() => {
    if (temporaryMovedCandidates.is_successfully_confirmed) {
      onForceToReloadCandidatesChanged();
      // I need this because during load the candidates again the candidate modal can be opened
      const localTemporaryMovedCandidates = { ...temporaryMovedCandidates };
      setActivePipeline((items) => {
        const localItems = { ...items };
        if (localTemporaryMovedCandidates.candidates.length === 0) return items;
        localItems.stages = localItems.stages.map((stage) => {
          if (stage.uuid !== localTemporaryMovedCandidates.stage_uuid) {
            const removedCandidates = stage.candidates.filter((candidate) =>
              localTemporaryMovedCandidates.candidates.some(
                (element) => element.uuid === candidate.uuid,
              ),
            );

            if (removedCandidates.length > 0)
              return {
                ...stage,
                candidates: stage.candidates.filter(
                  (candidate) =>
                    !removedCandidates.some(
                      (element) => element.uuid === candidate.uuid,
                    ),
                ),
                total_candidates: stage.total_candidates - removedCandidates.length,
                total_before_filter:
                  stage.total_before_filter - removedCandidates.length,
              };
            else return stage;
          } else {
            localTemporaryMovedCandidates.candidates
              = localTemporaryMovedCandidates.candidates.map((candidate) => ({
                ...candidate,
                stage_uuid: stage.uuid,
                move_to_stage_at: moment().unix(),
              }));
            return {
              ...stage,
              candidates: [
                ...(stage.candidates || []),
                ...localTemporaryMovedCandidates.candidates,
              ],
              total_candidates:
                stage.total_candidates
                + localTemporaryMovedCandidates.candidates.length,
              total_before_filter:
                stage.total_before_filter
                + localTemporaryMovedCandidates.candidates.length,
            };
          }
        });

        return localItems;
      });
      // setTemporaryMovedCandidates({
      //   candidates: [],
      //   stage_uuid: null,
      //   is_successfully_confirmed: false,
      // });
    }
  }, [onForceToReloadCandidatesChanged, temporaryMovedCandidates]);

  /**
   * @param { stageUUID, isWithMessage, currentStages, toCheckCandidates, currentDraggingCandidate } - string
   * @param isWithMessage - bool - to display the reason for the candidate if true
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if some candidates are not droppable on the current stage
   */
  const getIsDroppableSelectedCandidates = useCallback(
    ({
      stageUUID,
      isWithMessage = false,
      currentStages,
      toCheckCandidates,
      currentDraggingCandidate,
    }) => {
      const stageIndex = currentStages.findIndex((item) => item.uuid === stageUUID);
      if (stageIndex === -1) return false;
      const localSelectedCandidates = [...(toCheckCandidates || [])];
      if (
        currentDraggingCandidate
        && !localSelectedCandidates.some(
          (item) => item.candidate.uuid === currentDraggingCandidate.candidate.uuid,
        )
      )
        localSelectedCandidates.push(currentDraggingCandidate);
      if (
        localSelectedCandidates.some(
          (item) =>
            (item.stage.move_in_out_type === PipelineStageMovementTypes.In.key
              || item.stage.move_in_out_type
                === PipelineStageMovementTypes.NotInNorOut.key)
            && item.stage.uuid !== stageUUID,
        )
      ) {
        if (isWithMessage) {
          const unauthorizedSelectedCandidateStages = [];
          localSelectedCandidates.map((item) => {
            if (
              (item.stage.move_in_out_type === PipelineStageMovementTypes.In.key
                || item.stage.move_in_out_type
                  === PipelineStageMovementTypes.NotInNorOut.key)
              && item.stage.uuid !== stageUUID
              && !unauthorizedSelectedCandidateStages.some(
                (element) => element.uuid === item.uuid,
              )
            )
              unauthorizedSelectedCandidateStages.push(item.stage);
            return undefined;
          });
          unauthorizedSelectedCandidateStages.map((item) =>
            showError(
              `${t(
                `${translationPath}unauthorized-to-move-candidates-description`,
              )} "${item.title}"`,
            ),
          );
        }
        return false;
      }
      if (currentStages[stageIndex].type !== PipelineStagesEnum.DISQUALIFIED.key) {
        const unskippableStagesBeforeCurrentOne = currentStages.filter(
          (item, index) => index < stageIndex && !item.is_skippable,
        );
        if (
          unskippableStagesBeforeCurrentOne.length > 0
          && unskippableStagesBeforeCurrentOne.some((item) =>
            localSelectedCandidates.some(
              (element) => element.stage.order < item.order,
            ),
          )
        ) {
          if (isWithMessage)
            unskippableStagesBeforeCurrentOne
              .filter((item) =>
                localSelectedCandidates.some(
                  (element) => element.stage.order < item.order,
                ),
              )
              .map((item) =>
                showError(
                  `${t(`${translationPath}unskippable-stage-description`)} "${
                    item.title
                  }"`,
                ),
              );

          return false;
        }
      }
      return true;
    },
    [t],
  );

  /**
   * @param { candidates, targetStageItem, isWithMessage, isReturnAsBoolean, isDisableOnFirstInvalidCandidate }
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the candidates that can be moved to the target stage after filter them
   */
  const getFilteredCandidates = useCallback(
    ({
      candidates,
      targetStageItem,
      isWithMessage = false,
      isReturnAsBoolean = false,
      isDisableOnFirstInvalidCandidate = false,
    }) => {
      const localCandidates = [...candidates];
      let filterNotFromTargetStage = localCandidates.filter(
        (candidate) => candidate.stage.uuid !== targetStageItem.uuid,
      );
      // filter exists inside the bulk since the backend will check them in method getPipelinePreMoveCheck
      const bulkStagesItems = filterNotFromTargetStage.filter((item) =>
        selectedConfirmedStages.includes(item.stage.uuid),
      );
      filterNotFromTargetStage = filterNotFromTargetStage.filter(
        (item) => !selectedConfirmedStages.includes(item.stage.uuid),
      );
      const candidatesCountBeforeCheck = filterNotFromTargetStage.length;

      // start handle max allow to drop on stage
      if (
        (targetStageItem.stage_limit || targetStageItem.stage_limit === 0)
        && filterNotFromTargetStage.length + targetStageItem.total_before_filter
          > targetStageItem.stage_limit
      ) {
        if (isWithMessage)
          showError(
            `${t(`${translationPath}exceeded-target-stage-limit`)} ${t(
              `${translationPath}max`,
            )} (${targetStageItem.stage_limit})`,
          );
        if (isReturnAsBoolean) return false;
        return [];
      }
      // end handle max allow to drop on stage
      // start handle move to stages if not empty
      if (
        // selectedConfirmedStages.length === 0
        // &&
        filterNotFromTargetStage.some(
          (candidate) =>
            candidate.stage.responsible_move_to
            && candidate.stage.responsible_move_to.length > 0
            && !candidate.stage.responsible_move_to.some(
              (stage) =>
                stage.relation_type
                  === PipelineStageResponsibilityTypesEnum.Stage.key
                && stage.relation_uuid === targetStageItem.uuid,
            ),
        )
      ) {
        if (isWithMessage) {
          const unauthorizedSelectedCandidates = filterNotFromTargetStage.filter(
            (candidate) =>
              candidate.stage.responsible_move_to
              && candidate.stage.responsible_move_to.length > 0
              && !candidate.stage.responsible_move_to.some(
                (stage) =>
                  stage.relation_type
                    === PipelineStageResponsibilityTypesEnum.Stage.key
                  && stage.relation_uuid === targetStageItem.uuid,
              ),
          );
          showError(
            <div>
              <div className="mb-2">
                {t(`${translationPath}can-not-move-to-this-stage-description`)}
              </div>
              <ul className="px-3 mb-0">
                {unauthorizedSelectedCandidates.map((item) => (
                  <li
                    key={`unauthorizedSelectedCandidatesKeys${item.candidate.uuid}`}
                  >
                    {item.candidate.name || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>,
          );
        }
        filterNotFromTargetStage = filterNotFromTargetStage.filter(
          (candidate) =>
            candidate.stage.responsible_move_to
            && candidate.stage.responsible_move_to.length > 0
            && candidate.stage.responsible_move_to.some(
              (stage) =>
                stage.relation_type
                  === PipelineStageResponsibilityTypesEnum.Stage.key
                && stage.relation_uuid === targetStageItem.uuid,
            ),
        );
        if (isDisableOnFirstInvalidCandidate) {
          if (isReturnAsBoolean) return false;
          return [...filterNotFromTargetStage, ...bulkStagesItems];
        }
      }
      // end handle move to stages if not empty
      // start handle precondition types
      if (
        filterNotFromTargetStage.some(
          (item) =>
            !item.candidate.is_move_all_stages
            && !item.candidate.stages_can_move?.some(
              (item) => item === targetStageItem.uuid,
            ),
        )
      ) {
        if (isWithMessage) {
          const unauthorizedSelectedCandidates = filterNotFromTargetStage.filter(
            (item) =>
              !item.candidate.is_move_all_stages
              && !item.candidate.stages_can_move?.some(
                (item) => item === targetStageItem.uuid,
              ),
          );
          showError(
            <div>
              <div className="mb-2">
                {t(`${translationPath}can-not-move-to-this-stage-description`)}
              </div>
              <ul className="px-3 mb-0">
                {unauthorizedSelectedCandidates.map((item) => (
                  <li
                    key={`unauthorizedSelectedCandidatesKeys${item.candidate.uuid}`}
                  >
                    {item.candidate.name || 'N/A'}
                  </li>
                ))}
              </ul>
            </div>,
          );
        }
        filterNotFromTargetStage = filterNotFromTargetStage.filter(
          (item) =>
            item.candidate.is_move_all_stages
            || item.candidate.stages_can_move?.some(
              (item) => item === targetStageItem.uuid,
            ),
        );
        if (isDisableOnFirstInvalidCandidate) {
          if (isReturnAsBoolean) return false;
          return [...filterNotFromTargetStage, ...bulkStagesItems];
        }
      }
      // end handle precondition types
      if (isReturnAsBoolean)
        return filterNotFromTargetStage.length === candidatesCountBeforeCheck;
      return [...filterNotFromTargetStage, ...bulkStagesItems];
    },
    [selectedConfirmedStages, t],
  );

  const getActivePipelineByUUID = useCallback(
    (pipeline_uuid) => {
      if (!activeJob) return;
      const selectedJobPipeline = activeJob.pipelines.find(
        (item) => item.uuid === pipeline_uuid,
      );
      if (selectedJobPipeline && selectedJobPipeline.stages)
        selectedJobPipeline.stages = selectedJobPipeline.stages.map((stage) => ({
          candidates: [],
          ...stage,
        }));
      setActivePipeline(selectedJobPipeline);
    },
    [activeJob],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the candidates backend check to inform user which candidates will not affect
   * on bulk move
   */
  const getPipelinePreMoveCheck = useCallback(
    async (localCandidates, move_to_stage_uuid) => {
      if (selectedConfirmedStages.length === 0)
        return {
          totalCanMove: localCandidates.length,
          totalCanNotMove: 0,
          totalCandidates: localCandidates.length,
        };
      const localFilter = { ...candidatesFilters };
      const localDynamicCandidateProperties = [
        ...(localFilter?.dynamic_properties || []),
      ];
      if (localFilter?.dynamic_properties) delete localFilter?.dynamic_properties;
      const dynamicCandidatePropertiesParams = {};
      localDynamicCandidateProperties
        ?.filter((item) => item?.value?.length > 0)
        .map((item, index) => {
          dynamicCandidatePropertiesParams[`dynamic_properties[${index}][uuid]`]
            = item.uuid;
          dynamicCandidatePropertiesParams[`dynamic_properties[${index}][value]`]
            = item.value;
          return undefined;
        });
      const preMoveResponse = await PipelinePreMoveTo({
        job_uuid: jobUUID,
        job_pipeline_uuid: activeJobPipelineUUID,
        selected_candidates: reinitializeFilteredCandidates(localCandidates),
        move_to_type: PipelineMoveToTypesEnum.Stage.key,
        move_to_stage_uuid,
        ...localFilter,
      });
      if (preMoveResponse && preMoveResponse.status === 202) {
        const {
          data: { results },
        } = preMoveResponse;
        if (results.cannot_move_candidates.length > 0) {
          if (
            results.cannot_move_candidates.some(
              (item) =>
                item.error_type === PipelinePreMoveErrorTypesEnum.StageLimit.key,
            )
          )
            showError(
              <div>
                <div className="mb-2">
                  {t(`${translationPath}stage-unmoved-candidates-description`)}
                </div>
                <ul className="px-3 mb-0">
                  {results.cannot_move_candidates
                    .filter(
                      (item) =>
                        item.error_type
                        === PipelinePreMoveErrorTypesEnum.StageLimit.key,
                    )
                    .map((item) => (
                      <li
                        key={`limitSelectedCandidatesPreKeys${item.candidate_uuid}`}
                      >
                        {item.name || 'N/A'}
                      </li>
                    ))}
                </ul>
              </div>,
            );
          if (
            results.cannot_move_candidates.some(
              (item) =>
                item.error_type === PipelinePreMoveErrorTypesEnum.Precondition.key,
            )
          )
            showError(
              <div>
                <div className="mb-2">
                  {t(`${translationPath}can-not-move-to-this-stage-description`)}
                </div>
                <ul className="px-3 mb-0">
                  {results.cannot_move_candidates
                    .filter(
                      (item) =>
                        item.error_type
                        === PipelinePreMoveErrorTypesEnum.Precondition.key,
                    )
                    .map((item) => (
                      <li
                        key={`unauthorizedSelectedCandidatesPreKeys${item.candidate_uuid}`}
                      >
                        {item.name || 'N/A'}
                      </li>
                    ))}
                </ul>
              </div>,
            );
          return {
            totalCanMove:
              results.can_move_candidates
              + localCandidates.filter(
                (item) => !selectedConfirmedStages.includes(item.stage.uuid),
              ).length,
            totalCanNotMove: results.total_cannot_move_candidates,
            totalCandidates: results.total_of_candidates,
            candidatesToMove: results.list_move_candidates,
          };
        }
        return {
          totalCanMove:
            results.can_move_candidates
            + localCandidates.filter(
              (item) => !selectedConfirmedStages.includes(item.stage.uuid),
            ).length,
          totalCanNotMove: results.total_cannot_move_candidates,
          totalCandidates: results.total_of_candidates,
          candidatesToMove: results.list_move_candidates,
        };
      } else showError(t('Shared:failed-to-get-saved-data'), preMoveResponse);
      return {
        totalCanMove: 0,
        totalCanNotMove: localCandidates.length,
        totalCandidates: localCandidates.length,
      };
    },
    [
      activeJobPipelineUUID,
      candidatesFilters,
      jobUUID,
      reinitializeFilteredCandidates,
      selectedConfirmedStages,
      t,
    ],
  );

  const getAllStagesCandidates = useCallback(
    async (job_uuid, job_pipeline_uuid) => {
      setIsLoading(true);
      const response = await GetAllStagesCandidates({
        job_pipeline_uuid,
        job_uuid,
        filters: candidatesFilters,
      });
      setIsLoading(false);
      setIsDisabledAllDragging(false);
      // this is to clear the temporary cache candidates until the load for candidates new status done
      setTemporaryMovedCandidates(
        (items) =>
          (items.stage_uuid && {
            candidates: [],
            stage_uuid: null,
            is_successfully_confirmed: false,
          })
          || items,
      );
      if (response && response.status === 200) {
        const connectStagesWithCandidatesDetails = response.data.results.stages.map(
          (item) => {
            item.candidates
              = (response.data.results.candidate
                && response.data.results.candidate.filter(
                  (candidate) => candidate.stage_uuid === item.uuid,
                ))
              || [];
            if (item.candidates.length > 10) item.candidates.length = 10;
            return item;
          },
        );
        setActivePipeline((items) => {
          if (!items || items.uuid !== job_pipeline_uuid) return items;
          const localItems = { ...items, stages: [...(items.stages || [])] };
          localItems.stages.map((item, index) => {
            const currentStageDetails = connectStagesWithCandidatesDetails.find(
              (stage) => stage.uuid === item.uuid,
            );
            if (
              currentStageDetails !== -1
              && localItems.stages[index]
              && items.uuid === job_pipeline_uuid
            ) {
              localItems.stages[index].total_candidates
                = currentStageDetails.total_with_filters;
              localItems.stages[index].total_before_filter
                = currentStageDetails.total;
              localItems.stages[index].candidates
                = currentStageDetails.candidates || [];
            } else if (
              localItems.stages[index]
              && items.uuid === job_pipeline_uuid
            ) {
              localItems.stages[index].candidates = [];
              localItems.stages[index].total_candidates = 0;
              localItems.stages[index].total_before_filter = 0;
            }
            return undefined;
          });
          return localItems;
        });
        setFirstPageStagesCandidates(connectStagesWithCandidatesDetails);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        GlobalHistory.push('/recruiter/job/manage/active');
      }
    },
    [candidatesFilters, t],
  );

  const candidateManagementOpenChangeHandler = useCallback(() => {
    setIsOpenDialogs((...items) => ({
      ...items,
      addCandidate: false,
    }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return if target stage disabled or not
   */
  const getIsDisabledTargetStage = useMemo(
    () =>
      ({
        candidates,
        targetStageItem,
        currentDraggingCandidate,
        currentStages,
        isWithMessage = false,
        isReturnAsBoolean = true,
        isDisableOnFirstInvalidCandidate = true,
      }) =>
        targetStageItem.move_in_out_type === PipelineStageMovementTypes.Out.key
        || targetStageItem.move_in_out_type
          === PipelineStageMovementTypes.NotInNorOut.key
        || !getIsDroppableSelectedCandidates({
          stageUUID: targetStageItem && targetStageItem.uuid,
          isWithMessage,
          currentStages,
          toCheckCandidates: candidates,
          currentDraggingCandidate,
        })
        || !getFilteredCandidates({
          candidates,
          targetStageItem,
          isWithMessage,
          isReturnAsBoolean,
          isDisableOnFirstInvalidCandidate,
        }),
    [getFilteredCandidates, getIsDroppableSelectedCandidates],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if partner connected or not
   */
  const getIsConnectedPartner = useMemo(
    () =>
      ({ key }) =>
        connections.results.some(
          (item) => item.partner === key && item.is_connected,
        ),
    [connections.results],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const getAllIntegrationsConnections = useCallback(async () => {
    setConnectionsIsLoading(true);
    const response = await GetAllIntegrationsConnections({
      page: 1,
      limit: 99,
    });
    setConnectionsIsLoading(false);
    if (response && response.status === 200) {
      const { results } = response.data;
      const { paginate } = response.data;
      if (filters.page <= 1)
        setConnections({
          results: results,
          totalCount: paginate.total,
        });
      else
        setConnections((items) => ({
          results: [...items.results, ...results],
          totalCount: paginate.total || [...items.results, ...results].length,
        }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [filters, t]);

  // to get the active pipeline uuid from url if exist
  useEffect(() => {
    const localJobUUID = params && params.id;
    if (localJobUUID) setJobUUID(localJobUUID);
    //   setActivePipeline((item) => ({
    //   ...item,
    //   job_uuid: localJobUUID,
    // }));
  }, [params]);

  // to save the active pipeline uuid in a ref
  useEffect(() => {
    activeJobPipelineUUIDRef.current = activeJobPipelineUUID;
  }, [activeJobPipelineUUID]);

  useEffect(() => {
    const company_uuid = query?.get('company_uuid');
    if (
      !branchRef.current
      && company_uuid
      && JSON.parse(localStorage.getItem('selectedBranch'))?.uuid !== company_uuid
    ) {
      branchRef.current = true;
      const localCurrentBranch = userReducer?.results?.user?.companies?.find(
        (item) => item.uuid === company_uuid,
      );
      dispatch(updateSelectedBranch(localCurrentBranch, userReducer?.results?.user));
    }
  }, [dispatch, query, userReducer?.results?.user]);

  // to get the job details on change the job uuid
  useEffect(() => {
    const company_uuid = query?.get('company_uuid');
    if (jobUUID && !company_uuid) getActiveJobByUUID(jobUUID);
    else if (jobUUID && company_uuid && selectedBranchReducer?.uuid === company_uuid)
      getActiveJobByUUID(jobUUID, true, company_uuid);
  }, [getActiveJobByUUID, jobUUID, query, selectedBranchReducer?.uuid]);

  useEffect(() => {
    if (history.location.pathname.includes('recruiter/assessment/manage'))
      setIsEvaSSESS(true);
  }, [history]);

  // this is to load the selected pipeline details
  useEffect(() => {
    if (activeJobPipelineUUID) getActivePipelineByUUID(activeJobPipelineUUID);
  }, [activeJobPipelineUUID, getActivePipelineByUUID]);

  // this is to assign the selected pipeline to the active pipeline uuid
  useEffect(() => {
    if (activeJob && activeJob.pipelines && activeJob.pipelines.length > 0)
      setActiveJobPipelineUUID((item) =>
        !item ? activeJob.pipelines[0].uuid : item,
      );
  }, [activeJob]);

  // this is to load the first page candidate on change the selected pipeline
  useEffect(() => {
    if (activeJob && activeJob.uuid && activeJobPipelineUUID)
      getAllStagesCandidates(activeJob.uuid, activeJobPipelineUUID);
  }, [
    activeJob,
    activeJobPipelineUUID,
    getAllStagesCandidates,
    isForceToReloadCandidates,
  ]);

  useEffect(() => {
    const source = query?.get('source');
    const pipeline_uuid = query?.get('pipeline_uuid');
    if (pipeline_uuid) setActiveJobPipelineUUID(pipeline_uuid);
    if (
      source === 'self-service'
      || source === 'self-service-close'
      || source === 'score-card'
      || source === 'share-scores-summary'
      || source === 'score-card-evaluate'
      || source === 'documents'
      || source === 'onboarding'
    )
      setBackDropLoader(true);
    if (source === 'share-scores-summary')
      onIsOpenDialogsChanged('scoresSummary', true);
  }, [onIsOpenDialogsChanged, query]);

  // useEffect(() => {
  //   onForceToReloadCandidatesChanged();
  // }, [candidatesFilters, onForceToReloadCandidatesChanged]);
  const [scorecardDrawers, setScorecardDrawers] = useState({
    isOpenDetails: false,
    isOpenPreview: false,
  });

  const scorecardDrawersHandler = useCallback((key, val) => {
    setScorecardDrawers((items) => ({ ...items, [key]: val }));
  }, []);
  const scorecardData = useMemo(
    () => activeJob?.job_score_card || {},
    [activeJob?.job_score_card],
  );

  const scorecardAssignHandler = useCallback(async ({ value }) => {
    setActiveJob((items) => ({
      ...items,
      job_score_card: {
        ...items?.job_score_card,
        ...value,
      },
    }));
  }, []);
  const showMoveJobToArchivedHandler = useCallback(
    (stageUUID) => {
      if (
        !stageUUID
        || !activePipeline?.stages?.length
        || activeJob?.vacancy_status !== JobHiringStatusesEnum.InProgress.key
      )
        return;
      const isShowMoveToArchived = (activePipeline.stages || []).find(
        (stage) => stage.uuid === stageUUID,
      )?.is_vacancy_status_enabled;
      if (isShowMoveToArchived) onIsOpenDialogsChanged('moveJobToClosed', true);
    },
    [activeJob?.vacancy_status, activePipeline?.stages, onIsOpenDialogsChanged],
  );

  useEffect(() => {
    void getAllIntegrationsConnections();
  }, [getAllIntegrationsConnections]);

  return (
    <div className="pipeline-management-wrapper page-wrapper pt-2">
      <Backdrop
        className="spinner-wrapper"
        style={{ zIndex: 9999 }}
        open={backDropLoader}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
      <PipelineHeaderSection
        activePipeline={activePipeline}
        activeJob={activeJob}
        jobUUID={jobUUID}
        hiddenStages={hiddenStages}
        isLoading={isLoading}
        onHiddenStagesChanged={onHiddenStagesChanged}
        selectedCandidates={selectedCandidates}
        onActiveJobChanged={onActiveJobChanged}
        // getReturnedData={getReturnedData}
        isBulkSelect={isBulkSelect}
        onIsBulkSelectChanged={onIsBulkSelectChanged}
        onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
        onForceToReloadCandidatesChanged={onForceToReloadCandidatesChanged}
        getPipelinePreMoveCheck={getPipelinePreMoveCheck}
        isEvaSSESS={isEvaSSESS}
        isOpenDialogs={isOpenDialogs}
        onIsOpenDialogsChanged={onIsOpenDialogsChanged}
        popoverAttachedWith={popoverAttachedWith}
        onPopoverAttachedWithChanged={onPopoverAttachedWithChanged}
        onActivePipelineChanged={onActivePipelineChanged}
        onChangeTheActiveJobData={onChangeTheActiveJobData}
        onSetActiveJobChanged={onSetActiveJobChanged}
        getTotalSelectedCandidates={getTotalSelectedCandidates}
        // candidatesFilters={candidatesFilters}
        getIsDisabledTargetStage={getIsDisabledTargetStage}
        onCandidatesFiltersChanged={onCandidatesFiltersChanged}
        onSelectedConfirmedStagesChanged={onSelectedConfirmedStagesChanged}
        activeJobPipelineUUID={activeJobPipelineUUID}
        selectedConfirmedStages={selectedConfirmedStages}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        reinitializeFilteredCandidates={reinitializeFilteredCandidates}
        scorecardDrawersHandler={scorecardDrawersHandler}
        filters={filters}
        getIsConnectedPartner={getIsConnectedPartner}
        isConnectionLoading={isConnectionLoading}
        onFiltersChanged={onFiltersChanged}
        showMoveJobToArchivedHandler={showMoveJobToArchivedHandler}
      />
      {activePipeline && activeJob && firstPageStagesCandidates.length > 0 && (
        <div className="pipeline-management-body-wrapper">
          <PipelineSection
            onIsLoadingChanged={onIsLoadingChanged}
            activePipeline={activePipeline}
            // activeJob={activeJob}
            jobUUID={jobUUID}
            form_builder={activeJob.form_builder}
            getPipelinePreMoveCheck={getPipelinePreMoveCheck}
            // pipelineUUID={activeJob.pipeline_uuid}
            activeJob={activeJob}
            activeJobPipelineUUID={activeJobPipelineUUID}
            hiddenStages={hiddenStages}
            isBulkSelect={isBulkSelect}
            isLoading={isLoading}
            onActivePipelineDetailsChanged={onActivePipelineDetailsChanged}
            onSetActiveJobChanged={onSetActiveJobChanged}
            getIsSelectedCandidate={getIsSelectedCandidate}
            isDisabledAllDragging={isDisabledAllDragging}
            selectedAllLoadedStageCandidates={selectedAllLoadedStageCandidates}
            onSelectedAllLoadedStageCandidatesChanged={
              onSelectedAllLoadedStageCandidatesChanged
            }
            isConnectionLoading={isConnectionLoading}
            getIsConnectedPartner={getIsConnectedPartner}
            selectedConfirmedStages={selectedConfirmedStages}
            onSelectedConfirmedStagesChanged={onSelectedConfirmedStagesChanged}
            selectedOnHoldStages={selectedOnHoldStages}
            onSelectedOnHoldStagesChanged={onSelectedOnHoldStagesChanged}
            firstPageStagesCandidates={firstPageStagesCandidates}
            isForceToReloadCandidates={isForceToReloadCandidates}
            onForceToReloadCandidatesChanged={onForceToReloadCandidatesChanged}
            onIsDisabledAllDraggingChanged={onIsDisabledAllDraggingChanged}
            getIsDisabledTargetStage={getIsDisabledTargetStage}
            getIsSelectedAllCandidates={getIsSelectedAllCandidates}
            getIsSelectedSomeCandidates={getIsSelectedSomeCandidates}
            popoverAttachedWith={popoverAttachedWith}
            onPopoverAttachedWithChanged={onPopoverAttachedWithChanged}
            onSelectedCandidatesChanged={onSelectedCandidatesChanged}
            getIsDroppableSelectedCandidates={getIsDroppableSelectedCandidates}
            getFilteredCandidates={getFilteredCandidates}
            selectedCandidates={selectedCandidates}
            activeStage={activeStage}
            temporaryMovedCandidates={temporaryMovedCandidates}
            onLoadedCandidatesChanged={onLoadedCandidatesChanged}
            onTemporaryMovedCandidatesChanged={onTemporaryMovedCandidatesChanged}
            candidatesFilters={candidatesFilters}
            setCandidatesFilters={setCandidatesFilters}
            setActiveStage={setActiveStage}
            onIsOpenDialogsChanged={onIsOpenDialogsChanged}
            isOpenDialogs={isOpenDialogs}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getAllStagesCandidates={getAllStagesCandidates}
            onChangeTheActiveJobData={onChangeTheActiveJobData}
            setBackDropLoader={setBackDropLoader}
            reinitializeFilteredCandidates={reinitializeFilteredCandidates}
            onJobAssignHandler={onJobAssignHandler}
            scorecardAssignHandler={scorecardAssignHandler}
            destroySessionFiltersRef={destroySessionFiltersRef}
            showMoveJobToArchivedHandler={showMoveJobToArchivedHandler}
          />
        </div>
      )}
      {activeJob?.score_card_uuid && (
        <>
          <ScorecardDetailsDrawer
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            drawerOpen={scorecardDrawers?.isOpenDetails || false}
            closeHandler={() => {
              scorecardDrawersHandler('isOpenDetails', false);
            }}
            scorecardData={activeJob?.job_score_card || {}}
            activeJobUUID={activeJob?.uuid || ''}
            scorecardDrawersHandler={scorecardDrawersHandler}
          />
          <EvaluateDrawer
            drawerOpen={scorecardDrawers?.isOpenPreview || false}
            isPreview={true}
            closeHandler={() => {
              scorecardDrawersHandler('isOpenPreview', false);
            }}
            labels={scorecardData.template_labels || []}
            title={scorecardData.title || {}}
            description={scorecardData.description || {}}
            submitStyle={
              scorecardData?.card_setting?.appearance?.submit_style
              || ScorecardAppereanceEnum.steps.key
            }
            sections={scorecardData.sections || []}
            globalSetting={scorecardData?.card_setting || {}}
          />
        </>
      )}
      <PipelineDrawer
        jobUUID={jobUUID}
        openedDetailsSection={openedDetailsSection}
        onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
        onActivePipelineDetailsChanged={onActivePipelineDetailsChanged}
        onActiveStageDetailsChanged={onActiveStageDetailsChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        activePipeline={activePipeline}
        onActivePipelineChanged={onActivePipelineChanged}
        activeStage={activeStage}
        activeJob={activeJob}
        setActiveStage={setActiveStage}
      />
      {isOpenDialogs.addCandidate && (
        <CandidateManagementDialog
          isOpen={isOpenDialogs.addCandidate}
          feature={ProfileManagementFeaturesEnum.Job.key}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          isOpenChanged={candidateManagementOpenChangeHandler}
          onSave={onSaveCandidateHandler}
          activeJobPipelineUUID={activeJobPipelineUUID}
          componentPermission={ManageApplicationsPermissions}
        />
      )}
      {isOpenDialogs.assignJob && (
        <AssignJobDialog
          isOpen={isOpenDialogs.assignJob}
          feature={ProfileManagementFeaturesEnum.Job.key}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          isOpenChanged={candidateManagementOpenChangeHandler}
          onSave={onJobAssignHandler}
          activeJobPipelineUUID={activeJobPipelineUUID}
        />
      )}
      {isOpenDialogs.moveJobToClosed && (
        <MoveJobToClosedDialog
          isOpen={isOpenDialogs.moveJobToClosed}
          job_uuid={(activeJob && activeJob.uuid) || null}
          onSave={(value) => setActiveJob((items) => ({ ...items, ...value }))}
          isOpenChanged={() => onIsOpenDialogsChanged('moveJobToClosed', false)}
          activeJobPipelineUUID={activeJobPipelineUUID}
        />
      )}
      {isOpenDialogs.assignScorecard && (
        <AssignScorecardDialog
          scorecardData={scorecardData}
          scorecard_uuid={activeJob?.score_card_uuid}
          isOpen={isOpenDialogs.assignScorecard}
          jobRequisitionUUID={(activeJob && activeJob.job_requisition_uuid) || null}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          isOpenChanged={() => onIsOpenDialogsChanged('assignScorecard', false)}
          onSave={scorecardAssignHandler}
          activeJobPipelineUUID={activeJobPipelineUUID}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isReminderDisabled={
            !getIsAllowedPermissionV2({
              permissionId: ScorecardPermissions.ManageReminderSetting.key,
              permissions: permissionsReducer,
            })
          }
        />
      )}
      {isOpenDialogs.scoresSummary && (
        <ScoresSummaryDialog
          scorecardData={scorecardData}
          scorecard_uuid={activeJob?.score_card_uuid}
          isOpen={isOpenDialogs.scoresSummary}
          job_uuid={(activeJob && activeJob.uuid) || null}
          pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
          activePipeline={activePipeline}
          activeJob={activeJob}
          isOpenChanged={() => {
            if (query.get('source') === 'share-scores-summary') {
              window.opener = null;
              window.open('', '_self');
              window.close();
              return;
            }
            onIsOpenDialogsChanged('scoresSummary', false);
          }}
          isFromShare={query.get('source') === 'share-scores-summary'}
          onSave={onJobAssignHandler}
          activeJobPipelineUUID={activeJobPipelineUUID}
          scorecardAssignHandler={scorecardAssignHandler}
          jobRequisitionUUID={(activeJob && activeJob.job_requisition_uuid) || null}
          setBackDropLoader={setBackDropLoader}
        />
      )}
    </div>
  );
};

PipelineManagement.propTypes = {};

export default PipelineManagement;
