/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title EvassessCandidateModal.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the EvassessCandidateModal component.
 *
 * This modal has three tabs:
 * - Video Assessment
 * - Evaluation
 * - Questionnaire
 *
 * ----------------------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Modal,
  TabContent,
  TabPane,
} from 'reactstrap';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import urls from '../../../../api/urls';
import { generateHeaders } from 'api/headers';
import { evassessAPI } from '../../../../api/evassess';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { useSelector } from 'react-redux';
import Loader from '../../../Elevatus/Loader';
import { ModalVideoAssessmentTab } from '../../../Modals/ModalVideoAssessmentTab';
import DiscussionForm from '../../../Elevatus/DiscussionForm';
import QuestionnaireTab from '../evarecCandidateModal/QuestionnaireTab';
import EvaluationTab from '../evarecCandidateModal/EvaluationTab';
import { getCandidateEvaluation } from '../../../../shared/APIs/VideoAssessment/Evaluations';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../../helpers';
import { SubscriptionServicesEnum } from '../../../../enums';
import NoPermissionComponent from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageAssessmentsPermissions } from '../../../../permissions';
import { CandidateAssessmentComponent } from '../../../Elevatus/CandidateAssessmentComponent';
import { CandidateAssessmentSummaryComponent } from '../../../Elevatus/CandidateAssessmentSummaryComponent';
import {
  GenerateSemanticaAssessmentSummary,
  GetSemanticaAssessmentSummary,
} from '../../../../services';
import useVitally from '../../../../hooks/useVitally.Hook';

/**
 * Tab specifications for the VideoAssessment modal
 * @param activeItem
 * @param onChange
 * @param displayedStages
 * @param stageOptions
 * @param onStageChange
 * @param reportUrl
 * @param currentStage
 * @param questionnaires
 * @param evaluations
 * @returns {JSX.Element}
 * @constructor
 */

const translationPath = 'EvassessCandidateModalComponent.';
const VideoModalTabs = ({
  activeItem,
  onChange,
  stageOptions,
  onStageChange,
  reportUrl,
  questionnaires,
  evaluations,
  parentTranslationPath,
  cerfScale,
  isCompleted,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const { VitallyTrack } = useVitally();
  const onPopperOpen = (event) => {
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

  return (
    <>
      <Nav
        tabs
        className="d-inline-flex align-items-center justify-content-between position-relative tabs-with-actions bg-light-gray"
      >
        <Nav tabs className="d-inline-flex border-0 first-tab">
          <NavItem>
            <NavLink
              active={activeItem === 'video'}
              onClick={() => onChange('video')}
            >
              {t(`${translationPath}video-assessment`)}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeItem === 'assessment-test'}
              onClick={() => onChange('assessment-test')}
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageAssessmentsPermissions.SendAssessment.key,
                })
              }
            >
              {t(`${translationPath}assessment-test`)}
            </NavLink>
          </NavItem>

          {evaluations && evaluations.length !== 0 && (
            <NavItem>
              <NavLink
                active={activeItem === 'evaluation'}
                onClick={() => {
                  onChange('evaluation');
                }}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.ManageEvaluation.key,
                  })
                }
              >
                {t(`${translationPath}evaluation`)}
              </NavLink>
            </NavItem>
          )}

          {questionnaires && questionnaires.length > 0 && (
            <NavItem>
              <NavLink
                active={activeItem === 'questionnaire'}
                onClick={() => onChange('questionnaire')}
              >
                {t(`${translationPath}questionnaire`)}
              </NavLink>
            </NavItem>
          )}
          {isCompleted && (
            <NavItem>
              <NavLink
                active={activeItem === 'summary'}
                onClick={() => onChange('summary')}
              >
                {t(`${translationPath}summary`)}
              </NavLink>
            </NavItem>
          )}
        </Nav>
        <Nav className="float-right d-inline-flex align-items-center last-tab">
          {(isCompleted && cerfScale && (
            <h4 className={'mx-3 my-0'}>
              {t(`ModalVideoAssessmentTab.language-proficiency`)} :{' '}
              <span> {cerfScale} </span>
            </h4>
          ))
            || ''}

          {getIsAllowedPermissionV2({
            permissions,
            permissionId: ManageAssessmentsPermissions.PersonalityAnalysis.key,
          }) && (
            <NavItem
              onMouseEnter={onPopperOpen}
              className="nav-link form-control-alternative px-2 font-weight-normal btn btn- bg-brand-light-blue"
              style={{
                cursor:
                  reportUrl
                  || getIsAllowedPermissionV2({
                    permissions,
                    permissionId:
                      ManageAssessmentsPermissions.PersonalityAnalysis.key,
                  })
                    ? 'pointer'
                    : 'not-allowed',
                backgroundColor:
                  reportUrl
                  || getIsAllowedPermissionV2({
                    permissions,
                    permissionId:
                      ManageAssessmentsPermissions.PersonalityAnalysis.key,
                  })
                    ? 'bg-brand-light-blue'
                    : 'lightgray',
              }}
            >
              <a
                href={reportUrl}
                onClick={() => {
                  VitallyTrack('EVA-SSESS - Click on personality report');
                  window?.ChurnZero?.push([
                    'trackEvent',
                    'EVA-SSESS - Click on personality report',
                    'Click on personality report',
                    1,
                    {},
                  ]);
                }}
                color="link"
                className="text-white font-14"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fa fa-users" />
                <span className="px-1">
                  {t(`${translationPath}personality-report`)}
                </span>
              </a>
            </NavItem>
          )}
          <NavItem className="float-right ml-2-reversed">
            <UncontrolledDropdown>
              <DropdownToggle
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.MangeStages.key,
                  })
                }
                color=""
                className="bg-brand-primary nav-link form-control-alternative px-2 font-weight-normal text-white"
              >
                <i className="fas fa-random mr-2-reversed" />
                {t(`${translationPath}move-stage`)}
                <i className="fas fa-angle-down ml-2-reversed" />
              </DropdownToggle>
              {stageOptions && stageOptions.length && (
                <DropdownMenu end>
                  {stageOptions
                    && stageOptions.map((s, index) => (
                      <DropdownItem
                        key={`stageOptionsKey${index + 1}`}
                        onClick={() => {
                          // handleStageChange(s);
                          onStageChange(s.uuid);
                        }}
                      >
                        <div className="custom-control">
                          <label className="text-capitalize" htmlFor={s.title}>
                            {s.title}
                          </label>
                        </div>
                      </DropdownItem>
                    ))}
                </DropdownMenu>
              )}
            </UncontrolledDropdown>
          </NavItem>
        </Nav>
      </Nav>
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};

/**
 * The modal component class
 */
const EvassessCandidateModal = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const isMountedRef = useRef(null);
  const { addToast } = useToasts(); // Toasts
  const [evaluationsLoaded, setEvaluationsLoaded] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [
    {
      evaluations,
      hasMoved,
      loading,
      questionnaires,
      selected_candidate,
      stage_uuid,
      summary,
      tab,
    },
    setState,
  ] = useState({
    rating: 4,
    stage_uuid: '',
    display_questionnaire: false,
    stages: [
      {
        title: 'stage 1',
        id: 1,
      },
    ],
    tab: 'video',
    // content_id: 'video',
    index: 1,
    loading: true,
    hasMoved: false,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    selected_candidate: [],
    evaluations: [],
    questionnaires: [],
    summary: null,
  });

  const setEvaluations = (value) => {
    setState((items) => ({ ...items, evaluations: value }));
  };

  /**
   * handler to select a tab
   * @param tab
   */
  const handleSelectTab = (tab) => {
    setState((items) => ({ ...items, tab }));
  };

  /**
   * Find a candidate (search by uuid)
   * @param uuid
   */
  const findCandidate = async (uuid) => {
    setState((items) => ({
      ...items,
      loading: true,
    }));
    await axios
      .get(urls.evassess.findCandidate, {
        headers: generateHeaders(),
        params: {
          uuid,
        },
      })
      .then((res) => {
        setState((items) => ({
          ...items,
          selected_candidate: {
            ...res.data.results,
            videos: res.data.results.videos?.sort((a, b) => a.order - b.order) || [],
          },
          stage_uuid: res.data.results.candidate.stage.uuid,
          loading: false,
        }));
      })
      .catch((e) => {
        props.handleClose();
        showError(t('Shared:failed-to-get-saved-data'), e);
      });
  };

  /**
   * Move candidate to another Stage via API
   * @param uuid
   * @returns {Promise<void>}
   */
  const moveCandidateStage = async (uuid) => {
    setState((items) => ({
      ...items,
      moving_loader: true,
    }));
    await axios
      .put(
        urls.evassess.MOVE_STAGE,
        {
          prep_assessment_uuid: props.assessment_uuid,
          prep_assessment_stage_uuid: uuid,
          prep_assessment_candidate_uuid: [
            selected_candidate.candidate.information.uuid,
          ],
          is_immediately: true,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        setState((items) => ({
          ...items,
          moving_loader: false,
          hasMoved: true,
        }));
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Move candidate between stages',
          'Move candidate between stages from EVA-SSESS',
          1,
          {},
        ]);
        addToast(t(`${translationPath}candidate-moved-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
      });
  };

  /**
   * Move candidate to another stage by update state and callign the API
   * @param stageId
   */
  const moveCandidate = (stageId) => {
    setState((prevState) => ({
      ...prevState,
      stage_uuid: stageId,
    }));
    moveCandidateStage(stageId);
  };

  /**
   * After component has updated, update candidate content, get new evaluations and
   * questionnaires
   * @param prevProps
   * @param prevState
   */
  // componentDidUpdate(prevProps, prevState) {
  //   if (
  //     props.selected_candidates.length > 0
  //     && prevProps.selected_candidates !== props.selected_candidates
  //     && props.selected_candidates
  //   ) {
  //     // Invoke Evaluation API If assessment has evaluation

  //   }
  // }

  /**
   * Get list of discussion content from API
   * @param candidate_uuid
   * @param page
   * @param limit
   */
  const getDiscussionList = async ({ candidate_uuid, page, limit }) => {
    const result = await axios.get(urls.evassess.getDiscussion_GET, {
      headers: generateHeaders(),
      params: {
        candidate_uuid,
        page,
        limit,
      },
    });
    return result;
  };

  /**
   * Add a new comment to the 'Discussion' section.
   * @param candidate_uuid
   * @param comment
   * @param media_uuid
   */
  const addDiscussion = async ({ candidate_uuid, comment, media_uuid }) => {
    await axios.post(
      urls.evassess.getDiscussion_WRITE,
      {
        candidate_uuid,
        comment,
        media_uuid,
      },
      {
        headers: generateHeaders(),
      },
    );
  };

  /**
   * Get evaluations from API
   * @param candidate_uuid
   * @returns {Promise<void>}
   */
  const getEvaluations = useCallback(
    async (candidate_uuid) => {
      setEvaluationsLoaded(true);
      const url = urls.evassess.CANDIDATE_EVALUATION_GET;
      const params = {
        assessment_uuid: props.assessment_uuid,
        candidate_uuid,
      };

      getCandidateEvaluation(url, params)
        .then((res) => {
          setState((items) => ({ ...items, evaluations: res?.data?.results }));
          setEvaluationsLoaded(false);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
          setEvaluationsLoaded(false);
        });
    },
    [props.assessment_uuid, t],
  );

  /**
   * Get questionnaires from API
   * @param candidate_uuid
   * @returns {Promise<void>}
   */
  const getQuestionnaires = async (candidate_uuid) => {
    await evassessAPI.getCandidatesQuestionnaire(candidate_uuid).then((res) => {
      setState((items) => ({ ...items, questionnaires: res.data.results }));
    });
  };

  useEffect(() => {
    const hasEvaluation
      = props?.currentAssessment?.evaluation?.hasOwnProperty('uuid');
    if (hasEvaluation) getEvaluations(props.selected_candidates);
  }, [
    getEvaluations,
    props?.currentAssessment?.evaluation,
    props.selected_candidates,
  ]);
  useEffect(() => {
    getQuestionnaires(props.selected_candidates);
  }, [props.selected_candidates]);
  useEffect(() => {
    findCandidate(props.selected_candidates);
  }, [props.selected_candidates]);
  useEffect(() => {
    const hasEvaluation = props?.assessmentEvaluation?.hasOwnProperty('uuid');
    if (props.share) {
      findCandidate(props.selected_candidates);
      if (hasEvaluation) getEvaluations(props.selected_candidates);

      getQuestionnaires(props.selected_candidates);
    }
  }, [
    getEvaluations,
    props?.assessmentEvaluation,
    props.selected_candidates,
    props.share,
  ]);
  const getPersonalityReportURL = useMemo(() => {
    if (selected_candidate?.candidate?.information?.user_uuid) {
      const personalityReportURL = `${process.env.REACT_APP_PERSONALITY_DOMAIN}/${selected_candidate?.candidate?.information?.user_uuid}`;
      return personalityReportURL;
    }
    return null;
  }, [selected_candidate?.candidate?.information?.user_uuid]);
  const getSemanticaAssessmentSummary = useCallback(async () => {
    if (!selected_candidate?.candidate?.information?.uuid) return;
    const response = await GetSemanticaAssessmentSummary({
      assessment_candidate_uuid: selected_candidate.candidate.information.uuid,
    });
    isMountedRef.current = true;
    if (response.status === 200)
      setState((items) => ({ ...items, summary: response.data.result }));
    else setState((items) => ({ ...items, summary: null }));
  }, [selected_candidate?.candidate?.information?.uuid]);
  useEffect(() => {
    getSemanticaAssessmentSummary();
  }, [getSemanticaAssessmentSummary]);

  const generateSemanticaAssessmentSummary = useCallback(
    async ({ prep_assessment_candidate_uuid }) => {
      setIsLoadingSummary(true);
      const response = await GenerateSemanticaAssessmentSummary({
        prep_assessment_candidate_uuid,
      });
      setIsLoadingSummary(false);
      if (response.status === 200) getSemanticaAssessmentSummary();
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [getSemanticaAssessmentSummary, t],
  );
  return (
    <Modal
      className="w-100 candidate-assessment-modal full-screen-modal full-screen-modal-dialog "
      isOpen={props.show}
      toggle={() => {
        props.handleClose();
      }}
    >
      <Tooltip title="Close modal" aria-label="Close modal">
        <span>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={() => {
              if (hasMoved && props.reloadData) props.reloadData();
              else props.handleClose();
            }}
            style={{
              position: 'absolute',
              top: 24,
              right: (i18next.dir() === 'ltr' && 24) || 'initial',
              left: (i18next.dir() === 'rtl' && 24) || 'initial',
              zIndex: 1,
            }}
          >
            <i className="fas fa-times text-white" />
          </button>
        </span>
      </Tooltip>
      {loading ? (
        <Loader speed={1} color="primary" />
      ) : (
        // The modal is divided into two columns, one taking 75% width, and holds
        // all the content of the tabs and header, the other, takes the remaining
        // 25% and holds the discussion sticky.
        <div className="d-flex flex-row overflow-auto">
          <div className="d-inline-flex flex-column col-9 p-0 overflow-auto">
            <div className="d-inline-flex flex-row align-items-center candidate-assessment-header bg-light-gray">
              <div className="ml-2-reversed d-inline-flex flex-column">
                <div className="h5 mb-0">
                  {selected_candidate.candidate.information.first_name}
                  <span className="px-1">
                    {selected_candidate.candidate.information.last_name}
                  </span>
                </div>
                <div className="h6 font-14 text-gray mb-0">
                  <span>{t(`${translationPath}email`)}</span>
                  <span>:</span>
                  <span className="text-primary px-1">
                    {selected_candidate.candidate.information.email}
                  </span>
                </div>
                <div className="h7" style={{ opacity: 0.5 }}>
                  {props.isCompleted ? (
                    <>{t(`${translationPath}application-submitted`)}</>
                  ) : (
                    <>{t(`${translationPath}not-submitted`)}</>
                  )}
                </div>
              </div>
            </div>
            {!loading && (
              <VideoModalTabs
                questionnaires={questionnaires}
                evaluations={evaluations}
                activeItem={tab}
                parentTranslationPath={props.parentTranslationPath}
                onChange={handleSelectTab}
                reportUrl={getPersonalityReportURL}
                stageOptions={selected_candidate.stages}
                onStageChange={moveCandidate}
                currentStage={stage_uuid}
                cerfScale={summary?.cerf_score}
                isCompleted={props.isCompleted}
              />
            )}
            <div className="candidate-assessment-content w-100 center overflow-auto">
              <TabContent
                activeTab={tab}
                className="candidate-assessment-tab-content"
              >
                <TabPane tabId="video">
                  <ModalVideoAssessmentTab
                    evaluation={evaluations}
                    candidate={selected_candidate}
                    parentTranslationPath={props.parentTranslationPath}
                    assessment_uuid={props.assessment_uuid}
                  />
                </TabPane>
                <TabPane tabId="assessment-test">
                  <CandidateAssessmentComponent
                    type="video_assessment"
                    candidateUuid={props.selected_candidates}
                    isDisabledTestlify
                  />
                </TabPane>

                <TabPane tabId="questionnaire">
                  <QuestionnaireTab
                    questionnaires={questionnaires}
                    uuid={props.assessment_uuid}
                    type="prep_assessment"
                    parentTranslationPath={props.parentTranslationPath}
                    candidate={selected_candidate}
                    candidate_uuid={props.selected_candidates}
                  />
                </TabPane>

                <TabPane tabId="evaluation">
                  <EvaluationTab
                    evaluations={evaluations}
                    setEvaluations={setEvaluations}
                    uuid={props.assessment_uuid}
                    type="prep_assessment"
                    parentTranslationPath={props.parentTranslationPath}
                    candidate={selected_candidate}
                    candidate_uuid={props.selected_candidates}
                    evaluationsLoaded={evaluationsLoaded}
                    getEvaluations={() => getEvaluations(props.selected_candidates)}
                  />
                </TabPane>
                <TabPane tabId="summary">
                  <CandidateAssessmentSummaryComponent
                    candidate_uuid={props.selected_candidates}
                    uuid={props.assessment_uuid}
                    assessmentSummary={summary}
                    isLoadingSummary={isLoadingSummary}
                    isMounted={!!isMountedRef.current}
                    prep_assessment_candidate_uuid={
                      selected_candidate.candidate.information.uuid
                    }
                    generateSemanticaAssessmentSummary={
                      generateSemanticaAssessmentSummary
                    }
                    similarity={props.similarity}
                    parentTranslationPath={props.parentTranslationPath}
                  />
                </TabPane>
              </TabContent>
            </div>
          </div>

          {/* *** Discussion Column *** */}
          <div className="d-inline-flex flex-column col-3 p-0 overflow-hidden discussion-sidebar-shadow discussion-grow-fullscreen">
            <DiscussionForm
              type="prep_assessment"
              uuid={props.assessment_uuid}
              parentTranslationPath={props.parentTranslationPath}
              candidateUuid={props.selected_candidates}
              getDiscussion={getDiscussionList}
              addDiscussion={addDiscussion}
              confirmAlert={() => {}}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};
export default EvassessCandidateModal;
