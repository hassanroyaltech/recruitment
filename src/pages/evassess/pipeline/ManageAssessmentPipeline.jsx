/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-children-prop */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { Nav, NavItem, NavLink, TabPane } from 'reactstrap';

import { connect, useSelector } from 'react-redux';
import axios from 'axios';
import { commonAPI } from '../../../api/common';
import { useTranslation } from 'react-i18next';
import PipelineTab from './PipelineTab';
// Toasts for pipeline tab
import Snack from './Snack';

import { VideosTab } from './VideosTab';
import { EleModal } from '../../../components/Elevatus/EleModal';
import EvassessCandidateModal from '../../../components/Views/CandidateModals/evassessCandidateModal/EvassessCandidateModal';
import '../../../assets/scss/elevatus/_evassess-pipeline.scss';
import RecuiterPreference from '../../../utils/RecuiterPreference';
import ActivityTab from './ActivityTab';
import { useTitle } from '../../../hooks';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import { SubscriptionServicesEnum } from '../../../enums';
import { NoPermissionComponent } from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageAssessmentsPermissions } from '../../../permissions';

const video_assessment_route = 'assessment';
const manage_assessment_route = '/manage';
const parentTranslationPath = 'EvaSSESSPipeline';
const translationPath = 'ManageAssessmentPipelineComponent.';

const ManageAssessmentTabs = ({ id, isActive, rightTabs }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const { t } = useTranslation(parentTranslationPath);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

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
        className="d-flex-v-center-h-between align-items-center position-relative tabs-with-actions"
      >
        <Nav tabs className="d-inline-flex border-0">
          <NavItem>
            <NavLink
              active={isActive('pipeline')}
              to={`/recruiter/assessment/manage/pipeline/${id}`}
              tag={Link}
            >
              {t(`${translationPath}pipeline`)}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={isActive('videos')}
              to={`/recruiter/assessment/manage/videos/${id}`}
              tag={Link}
            >
              {t(`${translationPath}videos`)}
            </NavLink>
          </NavItem>
          <NavItem onMouseEnter={onPopperOpen}>
            <NavLink
              active={isActive('logs')}
              to={`/recruiter/assessment/manage/logs/${id}`}
              tag={Link}
              style={{
                cursor: !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageAssessmentsPermissions.ViewLogs.key,
                })
                  ? 'not-allowed'
                  : 'pointer',
              }}
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageAssessmentsPermissions.ViewLogs.key,
                })
              }
            >
              {t(`${translationPath}logs`)}
            </NavLink>
          </NavItem>
        </Nav>
        <Nav className="d-inline-flex align-items-center">{rightTabs}</Nav>
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

const ManageAssessmentPipeline = (props) => {
  const companyId = useSelector((state) => state?.companyIdReducer);
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}manage-pipelines`));
  const [videoAssessmentModal, setVideoAssessmentModal] = useState(false);
  const [videoAssessmentModal2, setVideoAssessmentModal2] = useState(false);
  const [selectedCandidates] = useState([]);

  const paths = {
    pipeline: `recruiter/${video_assessment_route}${manage_assessment_route}/pipeline/:id`,
    videos: `recruiter/${video_assessment_route}${manage_assessment_route}/videos/:id`,
    notes: `recruiter/${video_assessment_route}${manage_assessment_route}/pipeline/:id/notes`,
    teams: `recruiter/${video_assessment_route}${manage_assessment_route}/pipeline/:id/teams`,
    logs: `recruiter/${video_assessment_route}${manage_assessment_route}/logs/:id`,
  };

  const isActive = (check) => props.location.pathname.includes(check);

  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [languages] = useState([]);
  const [selected_candidates, setSelected_candidates] = useState([]);
  const [assessment_uuid, setAssessment_uuid] = useState('');
  const [reloadPipeline, setReloadPipeline] = useState(false);
  const [completed, setCompleted] = useState();
  const [similarity, setSimilarity] = useState();
  const currentLanguage = localStorage.getItem('platform_language');

  // Email Templates for Modal
  const [template, setTemplate] = useState();
  const getTemplate = useCallback(async () => {
    const userToken
      = (localStorage.getItem('token')
        && JSON.parse(localStorage.getItem('token')).token)
      || '';

    await axios
      .request({
        method: 'view',
        url: RecuiterPreference.MailTemplateBySlug,
        header: {
          Accept: 'application/json',
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': currentLanguage,
          'Accept-Company': companyId || localStorage.getItem('company_id'),
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          slug: 'questionnaires_invite',
        },
      })
      .then((res) => {
        setTemplate(res.data.results);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [companyId, currentLanguage, t, user.company_id, user.token]);
  useEffect(() => {
    getTemplate();
  }, [getTemplate, companyId, user.company_id, user.token]);

  const [timezones, setTimezones] = useState();
  // timezones for Modal
  useEffect(() => {
    const getTimezones = () => {
      commonAPI
        .getTimeZones()
        .then((res) => {
          setTimezones(res.data.results);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    };
    getTimezones();
  }, [t, user.company_id, user.token]);

  return (
    <>
      <TabPane>
        <span className="p-2 c-black-light fw-bold">
          {props.assessment?.title || t(`${translationPath}assessment-title`)}
        </span>
        <Switch>
          <Route
            exact
            path="/recruiter/assessment/manage/pipeline/:id?/:pathParam?"
            render={(localProps) => (
              <ToastProvider
                autoDismiss
                autoDismissTimeout={5000}
                components={{ Toast: Snack }}
                placement="bottom-center"
              >
                <PipelineTab
                  {...localProps}
                  selectedCandidates={selectedCandidates}
                  user={user}
                  // questionnaires={questionnaires}
                  parentTranslationPath={parentTranslationPath}
                  timezones={timezones}
                  template={template}
                  languages={languages}
                  showModal1={() => setVideoAssessmentModal(!videoAssessmentModal)}
                  showModal2={(
                    local_selected_candidates,
                    uuid,
                    isCompleted,
                    similarity,
                  ) => {
                    setAssessment_uuid(uuid);
                    setSelected_candidates(local_selected_candidates);
                    setVideoAssessmentModal2(true);
                    setCompleted(isCompleted);
                    setSimilarity(similarity);
                  }}
                  isActive={isActive}
                  paths={paths}
                  reloadPipeline={reloadPipeline}
                  ManageTabs={ManageAssessmentTabs}
                  currentAssessment={props.assessment}
                  {...localProps}
                />
              </ToastProvider>
            )}
          />
          <Route
            exact
            path="/recruiter/assessment/manage/videos/:id"
            render={(localProps) => (
              <VideosTab
                isActive={isActive}
                paths={paths}
                parentTranslationPath={parentTranslationPath}
                ManageTabs={ManageAssessmentTabs}
                {...localProps}
              />
            )}
          />

          <Route
            exact
            path="/recruiter/assessment/manage/logs/:id"
            render={(localProps) => (
              <ActivityTab
                isActive={isActive}
                paths={paths}
                parentTranslationPath={parentTranslationPath}
                ManageTabs={ManageAssessmentTabs}
                {...localProps}
              />
            )}
          />
        </Switch>
      </TabPane>
      {videoAssessmentModal2 && (
        <EleModal
          show={videoAssessmentModal2}
          // handleClose={() => setVideoAssessmentModal2(false)}
          children={
            <EvassessCandidateModal
              assessment_uuid={assessment_uuid}
              currentAssessment={props.assessment}
              selected_candidates={selected_candidates}
              isCompleted={completed}
              parentTranslationPath={parentTranslationPath}
              show={videoAssessmentModal2}
              reloadData={() => {
                getTemplate();
                setReloadPipeline((items) => !items);
                setVideoAssessmentModal2(false);
              }}
              handleClose={() => {
                setSelected_candidates('');
                setVideoAssessmentModal2(false);
              }}
              similarity={similarity}
            />
          }
        />
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(ManageAssessmentPipeline);
