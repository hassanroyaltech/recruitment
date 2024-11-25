/* eslint-disable import/no-unresolved */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title EvarecCandidateModal.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the EvarecCandidateModal component.
 *
 * This modal has three tabs:
 * - Video Assessment
 * - Evaluation
 * - Questionnaire
 * - Summary
 *
 * ----------------------------------------------------------------------------------
 */

// import React component
import React, {
  useEffect,
  useCallback,
  useReducer,
  useState,
  useRef,
  useMemo,
} from 'react';

// import Redux
import { connect, useSelector } from 'react-redux';
import { getJobCandidate } from '../../../../stores/actions/jobActions';

// import Shared components
import CandidateDiscussionForm from '../../../../components/Elevatus/CandidateDiscussionForm';

// Moment (for dates)
import moment from 'moment';

// Letter avatar
import LetterAvatar from '../../../../components/Elevatus/LetterAvatar';
import Skeleton from '@mui/material/Skeleton';
import i18next from 'i18next';
// import Tabs components
import VideoAssessmentModal from '../../../../components/Elevatus/VideoAssessmentModal';
import axios from 'axios';
import { generateHeaders } from '../../../../api/headers';
import urls from '../../../../api/urls';
import { evarecAPI } from '../../../../api/evarec';
import {
  Button,
  Dialog,
  MenuItem,
  TextField,
  DialogContent,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  ButtonBase,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import VideoTab from './VideoTab';
import AttachmentTab from './AttachmentTab';
import CandidateQuestionnaireTab from './CandidateQuestionnaireTab';
import CandidateEvaluationTab from './CandidateEvaluationTab';
import 'react-circular-progressbar/dist/styles.css';
import ResumeTab from './SummaryTab/ResumeTab';
import ProfileTab from './SummaryTab/ProfileTab';
import EmailsTab from './EmailsTab';
// import ScheduleMeetingTab from './ScheduleMeetingTab';
import { getQuestionnairesListByPipeline } from '../../../../shared/APIs/VideoAssessment/Questionnaires';
import { CandidateAssessmentComponent } from '../../../Elevatus/CandidateAssessmentComponent';
import { CandidateShareComponent } from '../../../Elevatus/CandidateShareComponent';
import { CandidateMeetingsComponent } from '../../../Elevatus/CandidateMeetingsComponent';
import { LogsComponent } from './LogsTab';
import {
  SubscriptionServicesEnum,
  DynamicFormTypesEnum,
  AssigneeTypesEnum,
  ProfileManagementFeaturesEnum,
  PipelineBulkSelectTypesEnum,
  PipelineMoveToTypesEnum,
  PipelineStageCandidateActionsEnum,
  SystemActionsEnum,
  IntegrationsPartnersEnum,
  MeetingFromFeaturesEnum,
  ScoreCalculationTypeEnum,
  AssignCandidatesToUsersTypesEnum,
} from '../../../../enums';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
  showSuccess,
} from '../../../../helpers';
import { NoPermissionComponent } from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ProfileManagementComponent } from '../../../ProfileManagement/ProfileManagement.Component';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../pages/setups/shared';
import {
  getSetupsUsersById,
  ATSUpdateAssignedUser,
  GetAllSetupsUsers,
  PipelineMoveTo,
} from '../../../../services';
import { OffersTab } from './OffersTab';
import { HiringTab } from './HiringTab';
import { ProfileSourceManagementDialog } from '../../../ProfileManagement/dialogs';
import { ManageApplicationsPermissions } from 'permissions';
import { VisaStatusTab } from './VisaStatusTab/VisaStatus.Tab';
import { TooltipsComponent } from '../../../Tooltips/Tooltips.Component';
import { AppliedJobsTab } from './AppliedJobs/AppliedJobs.Tab';
import { FormsTab } from './FormsTab';
import { TasksTab } from './CreateTaskTab/Tasks.Tab';
import './DetailModalTabs.Style.scss';
import { EvaRecManageVisaPermissions } from '../../../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import PushToPartnerTab from './PushToPartner/PushToPartner.Tab';
import { EvaAnalysisTab } from '../../../EvaAnalysis/Tabs/EvaAnalysis.Tab';
import { ChatGPTIcon } from '../../../../assets/icons';
import { useQuery } from '../../../../hooks';
import { ScorecardTab } from './ScorecardTab/Scorecard.Tab';
import { TotalScoreCard } from './ScorecardTab/cards/total-score/TotalScore.Card';
import { DocumentsTab } from './DocumentsTab';
import useVitally from '../../../../hooks/useVitally.Hook';
import { OnboardingTab } from './OnboardingTab';
import BinzagerSAPTab from './BinzagerSAP/BinzagerSAP.Tab';
const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * The main modal as a functional component
 * @returns {JSX}
 */
const JobCandidateModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenSourceManagementDialog, setIsOpenSourceManagementDialog]
    = useState(false);
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const { VitallyTrack } = useVitally();
  const query = useQuery();

  const GetTabBySource = useCallback((sourceValue) => {
    switch (sourceValue) {
    case 'self-service':
      return 2;
    case 'self-service-close':
      return 2;
    case 'share-email':
      return 13;
    case 'score-card-evaluate':
      return 23;
    case 'documents':
      return 25;
    default:
      return 1;
    }
  }, []);

  const defaultState = {
    rating: 4,
    stages: [
      {
        title: 'stage 1',
        id: 1,
      },
    ],
    index: 1,
    rates: [],
    tab: GetTabBySource(query.get('source')),
    avgRating: 0,
    reportUrl: '',
    discussion: [],
    stage_uuid: '',
    attachments: [],
    hasMoved: false,
    evaluations: [],
    questionnaires: [],
    candidateDetail: {},
    selected_candidate: [],
    loadingEvaluation: false,
    display_questionnaire: false,
    loadingCandidateDetails: false,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    assigneeType: props.selectedCandidateDetails?.assigned_user_type,
    assignee: props.selectedCandidateDetails?.assigned_user_uuid,
    totalCandidateScore: null,
  };
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const currentCandidateUUIDRef = useRef(null);
  const [state, setState] = useReducer(reducer, defaultState);
  const [candidateStage, setCandidateStage] = useState(0);
  const [stageLoading, setStageLoading] = useState(false);
  const [listOfQuestionnaires, setListOfQuestionnaires] = useState([]);
  const [listOfVideoAssessments, setListOfVideoAssessments] = useState([]);
  const [ratingLoader, setRatingLoader] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const bodyContentRef = useRef(null);
  const isScoreZero = useMemo(() => Math.round(props.score) === 0, [props.score]);
  const scoreClass = useMemo(() => {
    if (isScoreZero) return '';
    if (props.score >= 67) return 'high';
    if (props.score >= 34) return 'medium';
    return 'low';
  }, [props.score, isScoreZero]);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const userReducer = useSelector((state) => state?.userReducer);

  useEffect(() => {
    if (!props.show) return;
    getQuestionnairesListByPipeline(props.currentPipelineId)
      .then((res) => {
        setListOfQuestionnaires(res.data?.results);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-questionnaires`), error);
      });
  }, [t, props.show, props.currentPipelineId, userReducer]);

  useEffect(() => {
    if (!props.show) return;
    if (
      !getIsAllowedPermissionV2({
        permissions,
        permissionId: ManageApplicationsPermissions.SendVideoAssessment.key,
      })
    )
      return;

    // Get video assessments data from API
    evarecAPI
      .getVideoAssessments()
      .then((res) => {
        setListOfVideoAssessments(res.data?.results);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-video-assessments`), error);
      });
  }, [t, props.show, userReducer, permissions]);

  /**
   * @param type - key of PipelineStageCandidateActionsEnum
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the if the candidate can access the action or the tab
   */
  const getIsDisabledTabOrAction = useMemo(
    () => (type) =>
      props.selectedCandidateStageDetails
      && !props.selectedCandidateStageDetails.is_every_actions
      && !props.selectedCandidateStageDetails.candidate_actions.some(
        (item) => item.type === type,
      ),
    [props.selectedCandidateStageDetails],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the template management is open status change from child
   */
  const isOpenProfileSourceChanged = useCallback(() => {
    setIsOpenSourceManagementDialog(false);
  }, []);

  // Side menu options
  const sideMenuOptions = [
    {
      title: t(`${translationPath}profile`),
      icon: 'fas fa-user',
      isHidden: false,
      isDisabled: getIsDisabledTabOrAction(
        PipelineStageCandidateActionsEnum.ProfileEdit.key,
      ),
      key: 1,
    },
    {
      title: t(`${translationPath}resume`),
      icon: 'fas fa-file-invoice',
      isHidden: false,
      isDisabled: getIsDisabledTabOrAction(
        PipelineStageCandidateActionsEnum.Resume.key,
      ),
      key: 2,
    },
    {
      title: t(`${translationPath}introduction`),
      icon: 'fas fa-microphone',
      isHidden: false,
      hasPermission: true,
      // permissionsId: CurrentFeatures.introduction_video.permissionsId,
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.introduction_video.permissionsId,
      // }),
      key: 3,
    },
    {
      title: t(`${translationPath}attachments`),
      icon: 'fas fa-paperclip',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.Attachments.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.ManageAttachments.key,
        }),
      key: 4,
    },
    {
      title: t(`${translationPath}evaluation`),
      icon: 'fas fa-sliders-h',
      isHidden: false,
      hasPermission: true,
      // permissionsId: CurrentFeatures.evaluation.permissionsId,
      isDisabled:
        // !getIsAllowedPermissionV2({
        //   permissions,
        //   permissionId:CurrentFeatures.evaluation.permissionsId,
        // }) ||
        !props?.currentJob?.job?.evaluation_uuid?.uuid
        || getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.Evaluations.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.ManageEvaluation.key,
        }),
      key: 5,
    },
    {
      title: t(`${translationPath}questionnaire`),
      icon: 'fas fa-clipboard-list',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.Questionnaires.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.SendQuestionnaire.key,
        }),
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.questionnaire.permissionsId,
      // }),
      key: 6,
    },
    {
      title: t(`${translationPath}exams`),
      icon: 'fas fa-check-square',
      isHidden: true,
      isDisabled: false,
      key: 7,
    },
    {
      title: t(`${translationPath}video-assessment`),
      icon: 'fas fa-video',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.VideoAssessments.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.SendVideoAssessment.key,
        }),
      key: 8,
    },
    {
      title: t(`${translationPath}assessment-test`),
      icon: 'fas fa-file-invoice',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.AssessmentTests.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          defaultPermissions: {
            SendAssessment: ManageApplicationsPermissions.SendAssessment,
            AssessmentTest: ManageApplicationsPermissions.SendAssessment,
          },
        }),
      key: 9,
    },
    {
      title: t(`${translationPath}meetings`),
      icon: 'fas fa-calendar-alt',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.Meetings.key)
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.ScheduleMeeting.key,
        }),
      hasPermission: true,
      // permissionsId: CurrentFeatures.schedule_interview.permissionsId,
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.schedule_interview.permissionsId,
      // }),
      key: 10,
    },
    {
      title: t(`${translationPath}offers`),
      icon: 'fas fa-suitcase',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.FormBuilder.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.SendOffer.key,
        }),
      hasPermission: true,
      // permissionsId: CurrentFeatures.offer.permissionsId,
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.offer.permissionsId,
      // }),
      key: 11,
    },
    {
      title: t(`${translationPath}forms`),
      icon: 'far fa-file-alt',
      isHidden: false,
      isDisabled: getIsDisabledTabOrAction(
        PipelineStageCandidateActionsEnum.Forms.key,
      ),
      // || !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: ManageApplicationsPermissions.SendOffer.key,
      // }),
      hasPermission: true,
      // permissionsId: CurrentFeatures.offer.permissionsId,
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.offer.permissionsId,
      // }),
      key: 12,
    },
    {
      title: t(`${translationPath}share`),
      icon: 'fas fa-share-alt',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.Share.key)
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.ShareEvaRecApplication.key,
        }),
      key: 13,
    },
    {
      title: t(`${translationPath}logs`),
      icon: 'fas fa-history',
      isHidden: false,
      hasPermission: true,
      isDisabled: !getIsAllowedPermissionV2({
        permissions,
        permissionId: ManageApplicationsPermissions.ViewLogs.key,
      }),
      // permissionsId: CurrentFeatures.eva_rec_log.permissionsId,
      // isDisabled: !getIsAllowedPermissionV2({
      //   permissions,
      //   permissionId: CurrentFeatures.eva_rec_log.permissionsId
      // }),
      key: 14,
    },
    {
      title: t(`${translationPath}emails`),
      icon: 'fas fa-envelope',
      isHidden: false,
      isDisabled: getIsDisabledTabOrAction(
        PipelineStageCandidateActionsEnum.Emails.key,
      ),
      key: 15,
    },
    // {
    //   title: t(`${translationPath}new-meetings`),
    //   icon: 'fas fa-calendar',
    //   isHidden: false,
    //   isDisabled: false,
    // },
    {
      title: t(`${translationPath}hiring`),
      icon: 'fas fa-address-book',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.PushToHRMS.key)
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.PushToHRMS.key,
        }),
      key: 16,
    },
    {
      title: t(`${translationPath}visa-status`),
      icon: 'fas fa-ticket-alt',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.VisaStatus.key)
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: EvaRecManageVisaPermissions.ViewCandidateVisa.key,
        }),
      key: 17,
    },
    {
      title: t(`${translationPath}applied-jobs`),
      isHidden: false,
      icon: 'fas fa-briefcase',
      isDisabled:
        getIsDisabledTabOrAction(
          PipelineStageCandidateActionsEnum.AppliedJobs.key,
        )
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.AppliedJobs.key,
        }),
      key: 18,
    },
    {
      title: t(`${translationPath}create-task`),
      icon: 'fas fa-plus',
      isHidden: false,
      // isDisabled:
      //     getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.VisaStatus.key)
      //     || !getIsAllowedPermissionV2({
      //       permissions,
      //       permissionId: VisasPermissions.ViewCandidateVisa.key,
      //     }),
      key: 19,
    },
    {
      title: t(`${translationPath}push-to-jisr`),
      icon: 'fas fa-location-arrow',
      isHidden:
        !props.getIsConnectedPartner
        || !props.getIsConnectedPartner({ key: IntegrationsPartnersEnum.Jisr.key }),
      // isDisabled:
      //     getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.PushToHRMS.key)
      //     || !getIsAllowedPermissionV2({
      //       permissions,
      //       permissionId: ManageApplicationsPermissions.PushToHRMS.key,
      //     }),
      key: 20,
    },
    {
      title: t(`${translationPath}eva-analysis`),
      icon: <ChatGPTIcon color="var(--bc-primary)" />,
      isHidden: false,
      key: 21,
      isSVGIcon: true,
    },
    {
      title: t(`${translationPath}push-to-deel`),
      icon: 'fas fa-location-arrow',
      isHidden:
        !props.getIsConnectedPartner
        || !props.getIsConnectedPartner({ key: IntegrationsPartnersEnum.Deel.key }),
      // isDisabled:
      //     getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.PushToHRMS.key)
      //     || !getIsAllowedPermissionV2({
      //       permissions,
      //       permissionId: ManageApplicationsPermissions.PushToHRMS.key,
      //     }),
      key: 22,
    },
    {
      title: t(`${translationPath}scorecard`),
      icon: 'fas fa-star',
      isHidden: false,
      isDisabled:
        !props?.currentJob?.job?.score_card_uuid
        || getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.Scorecard.key),
      key: 23,
    },
    {
      title: t(`${translationPath}push-to-oracle-hcm`),
      icon: 'fas fa-location-arrow',
      isHidden:
        !props.getIsConnectedPartner
        || !props.getIsConnectedPartner({ key: IntegrationsPartnersEnum.Oracle.key }),
      key: 24,
    },
    {
      title: t(`${translationPath}documents`),
      icon: 'fas fa-newspaper',
      isHidden: false,
      isDisabled:
        getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.Documents.key)
        || !getIsAllowedPermissionV2({
          permissions,
          permissionId: ManageApplicationsPermissions.CandidateDocuments.key,
        }),
      key: 25,
    },
    {
      title: t(`${translationPath}onboarding`),
      icon: 'fas fa-plane-arrival',
      isHidden: false,
      isDisabled: getIsDisabledTabOrAction(
        PipelineStageCandidateActionsEnum.Onboarding.key,
      ),
      key: 26,
    },
    {
      title: t(`${translationPath}push-to-upside-lms`),
      icon: 'fas fa-location-arrow',
      isHidden:
        !props.getIsConnectedPartner
        || !props.getIsConnectedPartner({
          key: IntegrationsPartnersEnum.UpsideLMS.key,
        }),
      key: 27,
    },
    {
      title: t(`${translationPath}push-to-binzager-sap`),
      icon: 'fas fa-location-arrow',
      key: 28,
    },
  ];

  const setReportUrl = (value) => {
    setState({ id: 'reportUrl', value });
  };

  /**
   * Handler to select a tab
   * @param newTab
   */
  const handleSelectTab = useCallback(
    (newTab) => {
      if (newTab === 5) getEvaluationsList(props.selectedCandidate, props.jobUuid);
      setState({ id: 'tab', value: newTab });
    },
    [props.jobUuid, props.selectedCandidate],
  );

  /**
   * Get the data of the candidate
   * @param uuid
   * @returns {Promise<void>}
   */
  const findCandidate = useCallback(
    (profileUuid) => {
      setState({ id: 'loadingCandidateDetails', value: true });

      /**
       * Get candidate information
       */
      evarecAPI
        .getCandidate(profileUuid)
        .then((res) => {
          setState({ id: 'candidateDetail', value: res.data.results });
          setState({ id: 'loadingCandidateDetails', value: false });

          // If the applicant does not have video cv => set the active tab to summary
          if (
            res.data.results.video_url === null
            && !getIsDisabledTabOrAction(
              getIsDisabledTabOrAction(
                PipelineStageCandidateActionsEnum.ProfileEdit.key,
              ),
            )
          )
            setState({ id: 'tab', value: GetTabBySource(query.get('source')) });
        })
        .catch((error) => {
          setState({ id: 'loadingCandidateDetails', value: false });
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [getIsDisabledTabOrAction, t, query],
  );

  const getIsDisabledStage = useMemo(
    () =>
      ({ getIsDisabledTargetStage, stages, candidateAndStageDetails, option }) =>
        candidateAndStageDetails
        && stages
        && getIsDisabledTargetStage({
          candidates: [candidateAndStageDetails],
          targetStageItem: option,
          currentStages: stages,
        }),
    [],
  );

  const onEditProfileClicked = useCallback(() => {
    setIsEditProfile((item) => !item);
  }, []);

  const onProfileSaved = useCallback(() => {
    findCandidate(props.profileUuid);
    setIsEditProfile((item) => !item);
  }, [props.profileUuid, findCandidate]);

  // const getRatings = (candidateUuid) => {
  //   evarecAPI.getCandidateRating(candidateUuid)
  //     .then((res) => {
  //       setState({ id: 'avgRating', value: res.data.results.avg_rating });
  //       setState({ id: 'rates', value: res.data.results });
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  /**
   * Move a candidate to another stage
   * @returns {Promise<void>}
   */
  const moveCandidateStage = async () => {
    setStageLoading(true);
    const confirmResponse = await PipelineMoveTo({
      job_uuid: props.jobUuid,
      job_pipeline_uuid: props.jobPipelineUUID,
      selected_candidates: [
        {
          type: PipelineBulkSelectTypesEnum.Candidate.key,
          uuid: props.selectedCandidate,
        },
      ],
      move_to_type: PipelineMoveToTypesEnum.Stage.key,
      move_to_branch_uuid: null,
      move_to_job_uuid: null,
      move_to_job_pipeline_uuid: null,
      move_to_stage_uuid: candidateStage,
      move_to_notes: null,
    });
    setStageLoading(false);
    if (confirmResponse && confirmResponse.status === 202) {
      VitallyTrack('EVA-REC - Move candidate between stages');
      window?.ChurnZero?.push([
        'trackEvent',
        'EVA-REC - Move candidate between stages',
        'Move candidate between stages from EVA-REC',
        1,
        {},
      ]);
      setState({ id: 'hasMoved', value: true });
      showSuccess(t(`${translationPath}candidate-has-been-moved-successfully`));
      if (props.onDetailsChanged) {
        props.onDetailsChanged({
          reloadCandidates: true,
          movedToStageUUID: candidateStage,
        });
        if (props.onClose) props.onClose();
      }
      if (props.reloadData) props.reloadData(!props.candidateStageChange);
    } else showError(t('Shared:failed-to-update'), confirmResponse);
  };

  /**
   * Move candidate to another stage (activated by dropdown)
   * @param stageId
   */

  const moveCandidate = useCallback((stageId) => {
    setCandidateStage(stageId);
    setState({ id: 'stage_uuid', value: stageId });
  }, []);

  /**
   * Get evaluations list
   * @param uuid
   * @param jobUuid
   */
  const getEvaluationsList = (uuid, jobUuid) => {
    setState({ id: 'loadingEvaluation', value: true });
    evarecAPI.getEvaluation(uuid, jobUuid).then((res) => {
      setState({ id: 'evaluations', value: res.data.results });
      setState({ id: 'loadingEvaluation', value: false });
    });
  };

  const reloadEvaluationsList = (uuid, jobUuid) => {
    setRatingLoader(true);
    evarecAPI
      .getEvaluation(uuid, jobUuid)
      .then((res) => {
        setState({ id: 'evaluations', value: res.data.results });
        setRatingLoader(false);
      })
      .catch((error) => {
        setRatingLoader(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  useEffect(() => {
    if (
      props.selectedCandidate
      && currentCandidateUUIDRef.current !== props.selectedCandidate
    ) {
      currentCandidateUUIDRef.current = props.selectedCandidate;

      findCandidate(props.profileUuid);

      /**
       * Get Questionnaire list form API
       */
      evarecAPI.getCandidateQuestionnaire(props.selectedCandidate).then((res) => {
        setState({ id: 'questionnaires', value: res.data.results });
      });

      const hasEvaluation = Object.hasOwn(
        props?.currentJob?.job?.evaluation_uuid || {},
        'title',
      );
      if (hasEvaluation) {
        // getEvaluationsList(props.selectedCandidate, props.jobUuid);
      }
    }
  }, [props.selectedCandidate, props.currentJob?.job?.evaluation_uuid]);

  /**
   * This will be invoked if the modal opened from Shared Card.
   */
  useEffect(() => {
    if (props.share) {
      findCandidate(props.profileUuid);
      if (props.hasEvaluation) {
        // getEvaluationsList(props.selectedCandidate, props.jobUuid);
      }
      evarecAPI.getCandidateQuestionnaire(props.selectedCandidate).then((res) => {
        setState({ id: 'questionnaires', value: res.data.results });
      });
    }
  }, []);

  /**
   * Get Discussion list
   * @param job_candidate_uuid
   * @param page
   * @param limit
   */
  const getDiscussionList = ({ job_candidate_uuid, page, limit }) =>
    axios.get(urls.evarec.ats.DISCUSSION_GET, {
      headers: generateHeaders(),
      params: {
        job_candidate_uuid,
        page,
        limit,
      },
    });

  // noinspection JSValidateJSDoc
  /**
   * Add a comment to the discussion
   * @param candidate_uuid
   * @param comment
   * @param mediaUuid
   * @returns {Promise<AxiosResponse<any>>}
   */
  const addDiscussion = ({ candidateUuid, comment, mediaUuid }) =>
    axios.post(
      urls.evarec.ats.DISCUSSION_WRITE,
      {
        candidateUuid,
        comment,
        mediaUuid,
      },
      {
        headers: generateHeaders(),
      },
    );

  const onDialogClose = () => {
    setReportUrl('');
    setCandidateStage(0);
    props.onClose();
    setState({ id: 'tab', value: 1 });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

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
  const updateAssigneeHandler = useCallback(
    async ({
      assigned_user_uuid,
      assigned_user_type,
      job_candidate_uuid,
      job_uuid,
    }) => {
      setState({ id: 'loadingCandidateDetails', value: true });
      const response = await ATSUpdateAssignedUser({
        assigned_user_uuid,
        job_uuid,
        assigned_user_type,
        job_candidate_uuid,
        candidate_uuid: [
          {
            type: AssignCandidatesToUsersTypesEnum.JobCandidate.key,
            uuid: job_candidate_uuid,
          },
        ],
      });
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess('updated successfully');
        findCandidate(props.profileUuid);
        if (props.onDetailsChanged)
          props.onDetailsChanged({ reloadCandidates: true });
        if (props.reloadData) props.reloadData();
      } else showError(t('Shared:failed-to-update'), response);
      setState({ id: 'loadingCandidateDetails', value: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.reloadData, findCandidate, props.profileUuid, t],
  );

  useEffect(() => {
    if (props.selectedCandidateDetails) {
      setState({
        id: 'assigneeType',
        value: props.selectedCandidateDetails.assigned_user_type,
      });
      setState({
        id: 'assignee',
        value: props.selectedCandidateDetails.assigned_user_uuid,
      });
    }
  }, [props.selectedCandidateDetails]);

  useEffect(() => {
    setIsEditProfile((item) => (item ? false : item));
  }, [state.tab]);

  useEffect(() => {
    if (props.show) props.setBackDropLoader(false);
  }, [props.show, props.setBackDropLoader]);

  // set active tab to first available tab if profile is disabled
  useEffect(() => {
    if (
      getIsDisabledTabOrAction(PipelineStageCandidateActionsEnum.ProfileEdit.key)
      && props?.selectedCandidateStageDetails?.candidate_actions?.length > 0
    )
      handleSelectTab(
        props?.selectedCandidateStageDetails?.candidate_actions?.[0]?.type,
      );
  }, [
    getIsDisabledTabOrAction,
    handleSelectTab,
    props?.selectedCandidateStageDetails?.candidate_actions,
  ]);

  const handleTotalScoreChange = useCallback((value) => {
    setState({ id: 'totalCandidateScore', value });
  }, []);
  const getPersonalityReportURL = useMemo(() => {
    if (state?.candidateDetail?.identity?.uuid) {
      const personalityReportURL = `${process.env.REACT_APP_PERSONALITY_DOMAIN}/${state?.candidateDetail?.identity?.uuid}`;
      return personalityReportURL;
    }
    return null;
  }, [state?.candidateDetail?.identity?.uuid]);

  // Check the current tab to keep or remove filters
  useEffect(() => {
    if (props?.destroySessionFiltersRef)
      if ([12, 11, 17].includes(state.tab))
        props.destroySessionFiltersRef.current = false;
      else props.destroySessionFiltersRef.current = true;
  }, [state.tab]);
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xl"
        open={props.show}
        onClose={props.onClose}
        className="evarec-candidate-dialog-wrapper"
      >
        <DialogContent>
          <div className="dialog-close-button p-2 mb-2">
            {props.onActiveCandidateChange
              && (props.candidateIndex || props.candidateIndex === 0) && (
              <div className="d-inline-flex px-2">
                <TooltipsComponent
                  title="previous"
                  parentTranslationPath="Shared"
                  translationPath=""
                  contentComponent={
                    <span className="mx-1">
                      <ButtonBase
                        className="btns-icon theme-transparent mx-0"
                        disabled={
                          props.candidateIndex === 0
                            || state.loadingCandidateDetails
                        }
                        onClick={props.onActiveCandidateChange()}
                      >
                        <span className="fas fa-chevron-left fz-14px" />
                      </ButtonBase>
                    </span>
                  }
                />
                <TooltipsComponent
                  title="next"
                  parentTranslationPath="Shared"
                  translationPath=""
                  contentComponent={
                    <span className="mx-1">
                      <ButtonBase
                        className="btns-icon theme-transparent mx-0"
                        disabled={
                          props.totalCandidates - 1 === props.candidateIndex
                            || state.loadingCandidateDetails
                        }
                        onClick={props.onActiveCandidateChange({
                          isNext: true,
                        })}
                      >
                        <span className="fas fa-chevron-right fz-14px" />
                      </ButtonBase>
                    </span>
                  }
                />
              </div>
            )}
            <TooltipsComponent
              title="close-modal"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              contentComponent={
                <span className="mx-1">
                  <ButtonBase
                    className="btns-icon theme-transparent mx-0"
                    onClick={onDialogClose}
                  >
                    <span className="fas fa-times fa-1x" />
                  </ButtonBase>
                </span>
              }
            />
          </div>

          <div className="d-flex flex-column overflow-auto eva-rec-dialog-wrapper">
            {state.loadingCandidateDetails ? (
              <div className="dialog-header dialog-header-loader">
                <div className="d-flex">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={120}
                    height={120}
                  />
                  <div className="mt-4">
                    <Skeleton
                      className="mb-2"
                      variant="rectangular"
                      width={200}
                      height={20}
                    />
                    <Skeleton
                      className="mb-2"
                      variant="rectangular"
                      width={320}
                      height={10}
                    />
                    <Skeleton
                      className="mb-2"
                      variant="rectangular"
                      width={300}
                      height={10}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="circular"
                    width={100}
                    height={100}
                  />
                  <div className="mt-3">
                    <Skeleton
                      className="mb-2"
                      variant="rectangular"
                      width={40}
                      height={40}
                    />
                    <Skeleton
                      className="mb-2"
                      variant="rectangular"
                      width={290}
                      height={20}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <Skeleton
                    className="mr-2-reversed"
                    variant="rectangular"
                    width={220}
                    height={80}
                  />
                  <Skeleton variant="rectangular" width={110} height={80} />
                </div>
              </div>
            ) : (
              <div className="dialog-header">
                <div className="candidate-info">
                  {state?.candidateDetail?.identity?.profile_pic ? (
                    <img
                      alt="candidate"
                      src={state?.candidateDetail?.identity?.profile_pic}
                    />
                  ) : (
                    <LetterAvatar
                      extraLarge
                      name={`${state?.candidateDetail?.basic_information?.first_name} ${state?.candidateDetail?.basic_information?.last_name}`}
                    />
                  )}

                  <div className="ml-3-reversed pr-4-reversed d-flex flex-column title-info-column">
                    <h6 className="h5 mb-0 t-90p">
                      {state?.candidateDetail?.basic_information?.first_name}{' '}
                      {state?.candidateDetail?.basic_information?.last_name}
                    </h6>
                    {(props.selectedCandidateDetails?.reference_number
                      || state?.candidateDetail?.identity?.reference_number
                      || props.referenceData?.reference_number) && (
                      <div className="h6 font-14 text-gray mb-0">
                        {t(`${translationPath}candidate-reference-number`)}
                        {':'}
                        <span className="text-primary px-1">
                          {props.selectedCandidateDetails?.reference_number
                            || state?.candidateDetail?.identity?.reference_number
                            || props.referenceData?.reference_number}
                        </span>
                      </div>
                    )}
                    {(props.selectedCandidateDetails?.applicant_number
                      || props.referenceData?.applicant_number) && (
                      <div className="h6 font-14 text-gray mb-0">
                        {t(`${translationPath}application-reference-number`)}
                        {':'}
                        <span className="text-primary px-1">
                          {props.selectedCandidateDetails?.applicant_number
                            || props.referenceData?.applicant_number}
                        </span>
                      </div>
                    )}
                    <div className="h6 font-14 text-gray mb-0">
                      <span>{t(`${translationPath}applied-via`)}</span>
                      <span>
                        <span className="portal-source-tag-wrapper">
                          <span className="px-1">
                            {state.candidateDetail?.basic_information?.source
                              || 'N/A'}
                          </span>
                          <ButtonBase
                            className="btns-icon theme-transparent mx-1"
                            disabled={
                              state.loadingCandidateDetails
                              || userReducer.results?.user?.is_provider
                            }
                            onClick={() => {
                              setIsOpenSourceManagementDialog(true);
                            }}
                          >
                            <span className={SystemActionsEnum.edit.icon} />
                          </ButtonBase>
                        </span>
                      </span>
                      <span>
                        {moment
                          .unix(
                            props.applied_at
                              || props.selectedCandidateDetails.apply_at,
                          )
                          .locale(i18next.language || 'en')
                          .format('DD MMM YYYY')}
                      </span>
                    </div>
                    {!userReducer.results?.user?.is_provider && (
                      <div
                        className="personality-report-wrapper"
                        style={{
                          pointerEvents: !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.PersonalityAnalysis.key,
                          })
                            ? 'none'
                            : '',
                        }}
                      >
                        {/*{state?.candidateDetail?.personality_report*/}
                        {/*&& state.candidateDetail?.personality_report.status*/}
                        {/*  === 'under_processing' ? (*/}
                        {/*    <Button*/}
                        {/*      className="personality-report-title"*/}
                        {/*      data-tooltip={t(`${translationPath}under-processing`)}*/}
                        {/*    >*/}
                        {/*      <i className="fas fa-user" />*/}
                        {/*      {t(`${translationPath}personality-report`)}*/}
                        {/*    </Button>*/}
                        {/*  ) : (   )}*/}
                        <div onMouseEnter={onPopperOpen}>
                          <a
                            href={getPersonalityReportURL}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              ...(!getPersonalityReportURL && {
                                pointerEvents: 'none',
                              }),
                            }}
                          >
                            <Button className="personality-report-title">
                              <i className="fas fa-user" />
                              {t(`${translationPath}personality-report`)}
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="vertical-divider-s" />
                <div>
                  <div className="ai-matching-progress-wrapper">
                    {(props.selectedCandidateDetails.score_found && (
                      <>
                        <div className="ai-matching-progress-solid">
                          <CircularProgress variant="determinate" value={100} />
                        </div>
                        <div className={`ai-matching-progress ${scoreClass}`}>
                          <CircularProgress
                            variant="determinate"
                            value={+props.score || 0}
                          />
                        </div>
                        <div className={`ai-matching-progress-value ${scoreClass}`}>
                          {`${Math.round(props.score)}%`}
                        </div>
                      </>
                    )) || (
                      <div className="ai-matching-progress-under-process-text">
                        <span>{t(`${translationPath}under-processing`)}</span>
                      </div>
                    )}
                    <span
                      className={`ai-matching-text ${
                        !props.selectedCandidateDetails.score_found ? 'px-2' : ''
                      }`}
                    >
                      <i className="fas fa-robot" />
                      <span className="ai-matching-title">
                        {t(`${translationPath}a-i-matching`)}
                      </span>
                    </span>
                  </div>
                  {props.selectedCandidateDetails?.is_overqualified_exp && (
                    <div className="d-flex m-2 ">
                      <span className="text-gray fz-12px">
                        {t(`${translationPath}years-experience-is-overqualified`)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="vertical-divider-s" />

                {props.getIsDisabledTargetStage && (
                  <div className="header-stage">
                    <TextField
                      disabled={
                        !getIsAllowedPermissionV2({
                          permissions,
                          permissionId:
                            ManageApplicationsPermissions.MoveEvaRecApplication.key,
                        })
                      }
                      sx={{ width: '5rem' }}
                      select
                      variant="outlined"
                      value={candidateStage || props.candidateStage || ''}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <span className="input-stage">
                              {t(`${translationPath}stage`)}:
                            </span>
                            <div className="vertical-divider" />
                          </InputAdornment>
                        ),
                      }}
                    >
                      <MenuItem value={0} onClick={() => setCandidateStage(0)}>
                        {t(`${translationPath}select-stage`)}
                      </MenuItem>
                      {props.stages
                        && props.stages.length > 0
                        && props.stages.map((item, index, stages) => (
                          <MenuItem
                            key={`${index + 1}-stage`}
                            value={item.uuid}
                            disabled={getIsDisabledStage({
                              getIsDisabledTargetStage:
                                props.getIsDisabledTargetStage,
                              stages,
                              candidateAndStageDetails: {
                                stage: props.selectedCandidateStageDetails,
                                candidate: props.selectedCandidateDetails,
                              },
                              option: item,
                            })}
                            onClick={() => {
                              moveCandidate(item.uuid);
                            }}
                          >
                            {item.title}
                          </MenuItem>
                        ))}
                    </TextField>
                    <div
                      className={`move-candidate-stage-button ${
                        stageLoading
                        || candidateStage === 0
                        || candidateStage === props.candidateStage
                          ? 'is-disabled'
                          : ''
                      }`}
                    >
                      <Button
                        disabled={
                          stageLoading
                          || candidateStage === 0
                          || candidateStage === props.candidateStage
                          || !getIsAllowedPermissionV2({
                            permissions,
                            permissionId:
                              ManageApplicationsPermissions.MoveEvaRecApplication
                                .key,
                          })
                        }
                        onClick={() => moveCandidateStage(candidateStage)}
                      >
                        {t(`${translationPath}move`)}
                        {stageLoading && (
                          <span className="pl-1-reversed text-success text-sm">
                            <i className="fas fa-circle-notch fa-spin" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {!userReducer.results?.user?.is_provider && (
                  <>
                    <div className="vertical-divider-s" />
                    <div className="w-25">
                      {/*{props.onActiveCandidateChange*/}
                      {/*  && (props.candidateIndex || props.candidateIndex === 0) && (*/}
                      {/*  <div className="d-flex mb-3 px-2">*/}
                      {/*    <ButtonBase*/}
                      {/*      className="btns theme-transparent mx-2"*/}
                      {/*      disabled={props.candidateIndex === 0}*/}
                      {/*      onClick={props.onActiveCandidateChange()}*/}
                      {/*    >*/}
                      {/*      <span>{t(`${translationPath}previous`)}</span>*/}
                      {/*    </ButtonBase>*/}
                      {/*    <ButtonBase*/}
                      {/*      className="btns theme-transparent mx-2"*/}
                      {/*      disabled={*/}
                      {/*        props.totalCandidates - 1 === props.candidateIndex*/}
                      {/*      }*/}
                      {/*      onClick={props.onActiveCandidateChange({*/}
                      {/*        isNext: true,*/}
                      {/*      })}*/}
                      {/*    >*/}
                      {/*      <span>{t(`${translationPath}next`)}</span>*/}
                      {/*    </ButtonBase>*/}
                      {/*  </div>*/}
                      {/*)}*/}
                      <div className="d-flex flex-wrap">
                        <SharedAutocompleteControl
                          isFullWidth
                          searchKey="search"
                          initValuesKey="key"
                          isDisabled={
                            !getIsAllowedPermissionV2({
                              permissionId:
                                ManageApplicationsPermissions.AssignUser.key,
                              permissions,
                            })
                          }
                          initValues={assigneeTypes}
                          stateKey="assigneeType"
                          onValueChanged={(e) => {
                            setState({ id: 'assigneeType', value: e.value });
                            setState({ id: 'assignee', value: null });
                          }}
                          title="assignee-type"
                          editValue={state.assigneeType}
                          placeholder="select-assignee-type"
                          parentTranslationPath={parentTranslationPath}
                        />
                        {state.assigneeType && (
                          <>
                            {state.assigneeType
                              === AssigneeTypesEnum.Employee.key && (
                              <SharedAPIAutocompleteControl
                                title="assignee"
                                isFullWidth
                                placeholder={t('select-assignee')}
                                isDisabled={
                                  !getIsAllowedPermissionV2({
                                    permissionId:
                                      ManageApplicationsPermissions.AssignUser.key,
                                    permissions,
                                  })
                                }
                                stateKey="assignee"
                                onValueChanged={(e) => {
                                  setState({
                                    id: 'assignee',
                                    value: e.value,
                                  });
                                  if (e.value)
                                    updateAssigneeHandler({
                                      assigned_user_uuid: e.value,
                                      assigned_user_type:
                                        AssigneeTypesEnum.Employee.key,
                                      job_uuid: props.jobUuid,
                                      job_candidate_uuid:
                                        props.selectedCandidateDetails?.uuid,
                                    });
                                }}
                                idRef="assignee"
                                getOptionLabel={(option) =>
                                  `${
                                    option.first_name
                                    && (option.first_name[i18next.language]
                                      || option.first_name.en)
                                  }${
                                    option.last_name
                                    && ` ${
                                      option.last_name[i18next.language]
                                      || option.last_name.en
                                    }`
                                  }${
                                    (!option.has_access
                                      && state.assignee !== option.uuid
                                      && ` ${t('Shared:dont-have-permissions')}`)
                                    || ''
                                  }`
                                }
                                type={DynamicFormTypesEnum.select.key}
                                getDataAPI={GetAllSetupsUsers}
                                getItemByIdAPI={getSetupsUsersById}
                                translationPath={translationPath}
                                parentTranslationPath={parentTranslationPath}
                                searchKey="search"
                                editValue={state.assignee}
                                extraProps={{
                                  committeeType: 'all',
                                  ...((state.assignee
                                    || state?.candidateDetail?.assigned_user_uuid) && {
                                    with_than: [
                                      state.assignee
                                        || state?.candidateDetail?.assigned_user_uuid,
                                    ],
                                  }),
                                }}
                                getDisabledOptions={(option) => !option.has_access}
                              />
                            )}
                            {state.assigneeType === AssigneeTypesEnum.User.key && (
                              <SharedAPIAutocompleteControl
                                isFullWidth
                                title="assignee"
                                stateKey="assignee"
                                placeholder="select-assignee"
                                isDisabled={
                                  !getIsAllowedPermissionV2({
                                    permissionId:
                                      ManageApplicationsPermissions.AssignUser.key,
                                    permissions,
                                  })
                                }
                                onValueChanged={(e) => {
                                  setState({ id: 'assignee', value: e.value });
                                  if (e.value)
                                    updateAssigneeHandler({
                                      assigned_user_uuid: e.value,
                                      assigned_user_type: AssigneeTypesEnum.User.key,
                                      job_uuid: props.jobUuid,
                                      job_candidate_uuid:
                                        props.selectedCandidateDetails?.uuid,
                                    });
                                }}
                                editValue={state.assignee}
                                searchKey="search"
                                getDataAPI={GetAllSetupsUsers}
                                // getItemByIdAPI={getSetupsUsersById}
                                parentTranslationPath={parentTranslationPath}
                                getOptionLabel={(option) =>
                                  `${
                                    option.first_name
                                    && (option.first_name[i18next.language]
                                      || option.first_name.en)
                                  }${
                                    option.last_name
                                    && ` ${
                                      option.last_name[i18next.language]
                                      || option.last_name.en
                                    }`
                                  }`
                                }
                                extraProps={{
                                  ...((state.assignee
                                    || state?.candidateDetail?.assigned_user_uuid) && {
                                    with_than: [
                                      state.assignee
                                        || state?.candidateDetail?.assigned_user_uuid,
                                    ],
                                  }),
                                }}
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="candidate-content-wrapper candidate-content-overflow-wrapper">
              <div className="candidate-side-menu-wrapper">
                {sideMenuOptions
                  .filter((item) => !item.isHidden)
                  .filter(
                    (it) =>
                      !(
                        [4, 13, 15].includes(it.key)
                        && userReducer?.results?.user?.is_provider
                      ),
                  )
                  .map((item) => (
                    <div
                      key={`${item.key}-menu-option`}
                      className={`menu-button-wrapper 
                  ${item.key === state.tab ? 'is-active' : ''}
                  ${item.isDisabled ? 'is-disabled' : ''}`}
                      onMouseEnter={onPopperOpen}
                    >
                      <Button
                        disabled={item.isDisabled}
                        onClick={() => handleSelectTab(item.key)}
                      >
                        {item.isSVGIcon ? (
                          <i className="pr-3">{item.icon}</i>
                        ) : (
                          <i className={`${item.icon} pr-3`} />
                        )}
                        {item.title}
                      </Button>
                    </div>
                  ))}
              </div>

              <div className="candidate-side-menu-wrapper-mobile pr-1-reversed">
                <Tabs
                  scrollButtons="auto"
                  variant="scrollable"
                  value={state.tab || 1}
                >
                  {sideMenuOptions.map((item) => (
                    <Tab
                      key={`${item.key}-tab`}
                      label={item.title}
                      onClick={() => handleSelectTab(item.key)}
                    />
                  ))}
                </Tabs>
              </div>

              {state.loadingCandidateDetails ? (
                <div
                  className={`candidate-assessment-content candidate-content-item${
                    userReducer.results?.user?.is_provider ? ' is-provider' : ''
                  }`}
                >
                  <Skeleton
                    className="mb-3"
                    variant="rectangular"
                    width={620}
                    height={200}
                  />
                  <Skeleton
                    className="mb-3"
                    variant="rectangular"
                    width={620}
                    height={350}
                  />
                  <Skeleton
                    className="mb-3"
                    variant="rectangular"
                    width={620}
                    height={200}
                  />
                </div>
              ) : (
                <div
                  className={`candidate-assessment-content candidate-assessment-wrapper candidate-content-item${
                    userReducer.results?.user?.is_provider ? ' is-provider' : ''
                  }`}
                  ref={bodyContentRef}
                >
                  {state.tab === 1
                    && !getIsDisabledTabOrAction(
                      PipelineStageCandidateActionsEnum.ProfileEdit.key,
                    )
                    && ((!isEditProfile && (
                      <ProfileTab
                        profile={state?.candidateDetail}
                        onEditProfileClicked={onEditProfileClicked}
                        mode
                        hideImage
                        company_uuid={
                          state.candidateDetail
                          && state.candidateDetail.identity
                          && state.candidateDetail.identity.company_uuid
                        }
                        isDisabledEditing={getIsDisabledTabOrAction(
                          PipelineStageCandidateActionsEnum.ProfileEdit.key,
                        )}
                      />
                    )) || (
                      <ProfileManagementComponent
                        job_uuid={props.jobUuid}
                        onSave={onProfileSaved}
                        onFailed={onEditProfileClicked}
                        isFullWidthFields
                        candidate_uuid={
                          state.candidateDetail
                          && state.candidateDetail.identity
                          && state.candidateDetail.identity.uuid
                        }
                        company_uuid={
                          state.candidateDetail
                          && state.candidateDetail.identity
                          && state.candidateDetail.identity.company_uuid
                        }
                        profile_uuid={
                          (state.candidateDetail
                            && state.candidateDetail.profile_uuid)
                          || props.profileUuid
                        }
                        from_feature={ProfileManagementFeaturesEnum.Job.key}
                        componentPermission={ManageApplicationsPermissions}
                      />
                    ))}
                  {state.tab === 2 && <ResumeTab profile={state?.candidateDetail} />}
                  {state.tab === 3 && (
                    <div className="video-item-wrapper pt-0 mb-3 pb-3">
                      <VideoTab
                        video={state?.candidateDetail?.video_url}
                        loading={false}
                      />
                    </div>
                  )}
                  {state.tab === 4 && (
                    <AttachmentTab candidate={props.selectedCandidate} />
                  )}
                  {state.tab === 5 && (
                    <CandidateEvaluationTab
                      type="ats"
                      evaluations={state.evaluations}
                      candidateUuid={props.selectedCandidate}
                      loadingEvaluation={state.loadingEvaluation}
                      ratingLoader={ratingLoader}
                      setRatingLoader={setRatingLoader}
                      reloadData={() => {
                        reloadEvaluationsList(
                          props.selectedCandidate,
                          props.jobUuid,
                        );
                      }}
                    />
                  )}
                  {state.tab === 6 && (
                    <CandidateQuestionnaireTab
                      type="ats"
                      job_uuid={props.jobUuid}
                      candidate={props.selectedCandidate}
                      candidate_uuid={props.candidateUuid}
                      questionnaires={state.questionnaires}
                      listOfQuestionnaires={listOfQuestionnaires}
                      pipeline_uuid={props.currentPipelineId}
                    />
                  )}
                  {/* exams 7 */}
                  {state.tab === 8 && (
                    <VideoAssessmentModal
                      type="ats"
                      permissions={permissions}
                      jobUuid={props.jobUuid}
                      setReportUrl={setReportUrl}
                      reportUrl={state.reportUrl}
                      candidate={state.candidateDetail}
                      candidate_uuid={props.selectedCandidate}
                      listOfVideoAssessments={listOfVideoAssessments}
                    />
                  )}
                  {state.tab === 9 && (
                    <CandidateAssessmentComponent
                      type="ats"
                      candidateUuid={props.selectedCandidate}
                      candidate_profile_uuid={props.profileUuid}
                      isDisabledTestlify={
                        !props.getIsConnectedPartner
                        || !props.getIsConnectedPartner({
                          key: IntegrationsPartnersEnum.Testlify.key,
                        })
                      }
                    />
                  )}
                  {state.tab === 10 && (
                    <CandidateMeetingsComponent
                      type="ats"
                      from_feature={MeetingFromFeaturesEnum.ATS.key}
                      candidateList={
                        state.candidateDetail
                        && props.selectedCandidate && [
                          {
                            ...state.candidateDetail,
                            uuid: props.selectedCandidate,
                          },
                        ]
                      }
                      activeJobPipelineUUID={props.activeJobPipelineUUID}
                    />
                  )}
                  {state.tab === 11 && (
                    <OffersTab
                      activeJobPipelineUUID={props.activeJobPipelineUUID}
                      candidate_uuid={props.candidateUuid}
                      stage_uuid={props.candidateStage}
                      pipeline_uuid={props.currentPipelineId}
                      form_builder={props.form_builder}
                      job_uuid={props.jobUuid}
                      onDetailsChanged={props.onDetailsChanged}
                      selectedCandidateDetails={props.selectedCandidateDetails}
                      onChangeTheActiveJobData={props.onChangeTheActiveJobData}
                    />
                  )}
                  {state.tab === 12 && (
                    <FormsTab
                      activeJobPipelineUUID={props.activeJobPipelineUUID}
                      candidate_uuid={props.candidateUuid}
                      job_candidate_uuid={props.selectedCandidate}
                      job_stage_uuid={props.candidateStage}
                      job_uuid={props.jobUuid}
                      candidate={state.candidateDetail}
                    />
                  )}
                  {state.tab === 13 && (
                    <CandidateShareComponent
                      type="ats"
                      jobCandidate={props.selectedCandidate}
                      candidate_uuid={props.candidateUuid}
                      job_uuid={props.jobUuid}
                    />
                  )}
                  {state.tab === 14 && (
                    <LogsComponent
                      bodyRef={bodyContentRef}
                      job_uuid={props.jobUuid}
                      job_candidate_uuid={props.selectedCandidate}
                    />
                  )}
                  {state.tab === 15 && (
                    <EmailsTab
                      bodyRef={bodyContentRef}
                      job_uuid={props.jobUuid}
                      candidate_uuid={props.selectedCandidate}
                      candidate={state?.candidateDetail}
                    />
                  )}
                  {/* {state.tab === 13 && (
                    <ScheduleMeetingTab
                      bodyRef={bodyContentRef}
                      job_uuid={props.jobUuid}
                      candidate_uuid={props.selectedCandidate}
                      candidate={state?.candidateDetail}
                    />
                  )} */}
                  {state.tab === 16 && (
                    <HiringTab
                      candidateDetail={state?.candidateDetail}
                      job_uuid={props.jobUuid}
                      parentTranslationPath={parentTranslationPath}
                      // stages={props.stages}
                      // stage_uuid={props?.selectedCandidateDetails?.stage_uuid}
                    />
                  )}
                  {state.tab === 17 && (
                    <VisaStatusTab
                      candidateDetail={state?.candidateDetail}
                      job_uuid={props.jobUuid}
                      parentTranslationPath="VisaPage"
                      // activeJobPipelineUUID={props.activeJobPipelineUUID}
                      pipeline_uuid={props.currentPipelineId}
                      stage_uuid={props.candidateStage}
                    />
                  )}
                  {state.tab === 18 && (
                    <AppliedJobsTab candidate_uuid={props.candidateUuid} />
                  )}
                  {state.tab === 19 && (
                    <TasksTab
                      candidate_uuid={props.candidateUuid}
                      job_uuid={props.jobUuid}
                    />
                  )}
                  {state.tab === 21 && (
                    <EvaAnalysisTab
                      source="candidate-modal"
                      job_uuid={props.jobUuid}
                      profile_uuid={
                        (state.candidateDetail
                          && state.candidateDetail.profile_uuid)
                        || props.profileUuid
                      }
                      candidate_user_uuid={state.candidateDetail.identity?.uuid}
                    />
                  )}
                  {state.tab === 20 && (
                    <PushToPartnerTab
                      partner={IntegrationsPartnersEnum.Jisr}
                      currentJob={props.currentJob}
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                  {state.tab === 22 && (
                    <PushToPartnerTab
                      partner={IntegrationsPartnersEnum.Deel}
                      currentJob={props.currentJob}
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                  {state.tab === 23 && (
                    <ScorecardTab
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      job_uuid={props.jobUuid}
                      activeJob={props?.currentJob?.job}
                      candidate_uuid={props.candidateUuid}
                      handleTotalScoreChange={handleTotalScoreChange}
                      scorecardAssignHandler={props?.scorecardAssignHandler}
                    />
                  )}
                  {state.tab === 24 && (
                    <PushToPartnerTab
                      partner={IntegrationsPartnersEnum.Oracle}
                      currentJob={props.currentJob}
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}

                  {state.tab === 25 && (
                    <DocumentsTab
                      candidateDetail={state?.candidateDetail}
                      job_uuid={props.jobUuid}
                      parentTranslationPath={parentTranslationPath}
                      job_candidate_uuid={props.selectedCandidate}
                    />
                  )}

                  {state.tab === 26 && (
                    <OnboardingTab
                      selectedCandidateDetails={props.selectedCandidateDetails}
                      job_uuid={props.jobUuid}
                      parentTranslationPath={parentTranslationPath}
                      candidate_uuid={props.candidateUuid}
                      job_candidate_uuid={props.selectedCandidate}
                      activeJob={props?.currentJob?.job}
                      activeJobPipelineUUID={props.activeJobPipelineUUID}
                      stage_uuid={props.candidateStage}
                      pipeline_uuid={props.currentPipelineId}
                    />
                  )}

                  {state.tab === 27 && (
                    <PushToPartnerTab
                      partner={IntegrationsPartnersEnum.UpsideLMS}
                      isReloadAfterSave={true}
                      currentJob={props.currentJob}
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}

                  {state.tab === 28 && (
                    <BinzagerSAPTab
                      candidateDetail={state?.candidateDetail}
                      job_candidate_uuid={props.selectedCandidate}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      activeJob={props?.currentJob?.job}
                      job_uuid={props.jobUuid}
                      candidate_uuid={props.candidateUuid}
                    />
                  )}
                </div>
              )}

              {/* *** Discussion Column *** */}
              {!userReducer.results?.user?.is_provider && (
                <div className="candidate-discussion-wrapper">
                  <CandidateDiscussionForm
                    type="ats"
                    isShowScorecard={state.tab === 23}
                    totalScorecardComponent={
                      state?.totalCandidateScore?.progress
                      && !state.loadingCandidateDetails && (
                        <TotalScoreCard
                          state={state?.totalCandidateScore || {}}
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                          isWeightScoring={
                            props?.currentJob?.job?.job_score_card?.card_setting
                              ?.score_calculation_method
                            === ScoreCalculationTypeEnum.weight.key
                          }
                        />
                      )
                    }
                    rates={state.rates}
                    uuid={props.jobUuid}
                    confirmAlert={() => {}}
                    avgRating={state.avgRating}
                    addDiscussion={addDiscussion}
                    getDiscussion={getDiscussionList}
                    candidateUuid={props.selectedCandidate}
                    wrapperClasses="candidate-discussion-form"
                    reportUrl={state.candidateDetail?.personality_report}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ProfileSourceManagementDialog
        isOpen={isOpenSourceManagementDialog}
        candidate_uuid={
          state.candidateDetail
          && state.candidateDetail.identity
          && state.candidateDetail.identity.uuid
        }
        company_uuid={
          state.candidateDetail
          && state.candidateDetail.identity
          && state.candidateDetail.identity.company_uuid
        }
        source_type={
          state.candidateDetail
          && state.candidateDetail.basic_information
          && state.candidateDetail.basic_information.source_type
        }
        source_uuid={
          state.candidateDetail
          && state.candidateDetail.basic_information
          && state.candidateDetail.basic_information.source_uuid
        }
        onSave={() => {
          findCandidate(state.candidateDetail && state.candidateDetail.profile_uuid);
        }}
        isOpenChanged={isOpenProfileSourceChanged}
        job_uuid={props.jobUuid}
      />
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

const mapDispatchToProps = {
  getJobCandidate,
};
export default connect(null, mapDispatchToProps)(JobCandidateModal);
