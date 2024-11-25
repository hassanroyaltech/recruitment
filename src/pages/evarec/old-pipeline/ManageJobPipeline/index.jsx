// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { TabPane } from 'reactstrap';
import { generateHeaders } from '../../../../api/headers';

// Redux
import { connect } from 'react-redux';
// Axios
import axios from 'axios';

// import './_evassess-pipeline.scss';
// URLs
import urls from '../../../../api/urls';
import RecuiterPreference from '../../../../utils/RecuiterPreference';
import { commonAPI } from '../../../../api/common';

// Permissions

// Snack? I don't know what this is
import { useTranslation } from 'react-i18next';
import Snack from '../../Snack';

// Components
import PipelineTab from './PipelineTab';
import DetailTabsWrapper from './DetailTabsWrapper';
import JobCandidateModal from '../../../../components/Views/CandidateModals/evarecCandidateModal';
import ActivityTab from '../../../evassess/pipeline/ActivityTab';
import { showError } from '../../../../helpers';

const parentTranslationPath = 'EvarecRecManage';
/**
 * Return the Pipeline as a JSX element
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ManageJobPipeline = (props) => {
  // grab current state
  const [stages, setStages] = useState([]);
  const [jobUuid, setJobUuid] = useState('');
  const [profileUuid, setprofileUuid] = useState('');
  const [candidateUuid, setcandidateUuid] = useState('');
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState({});
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');
  const [jobCandidateModal, showJobCandidateModal] = useState(false);
  const [profile, setProfile] = useState([]);
  const [selectedCandidates] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [languages] = useState([]);
  const [template, setTemplate] = useState();
  const [questionnaires, setQuestionnaires] = useState();
  const [timezones, setTimezones] = useState();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [currentPipeline, setcurrentPipeline] = useState();
  const [candidatesCurrentStages, setCandidatesCurrentStages] = useState([]);
  const [candidateStageChange, setCandidateStageChange] = useState(false);
  const [data, setData] = useState();
  const [referenceData, setReferenceData] = useState(null);
  const { t } = useTranslation(parentTranslationPath);

  // Email Templates for Modal
  useEffect(() => {
    axios
      .request({
        method: 'view',
        url: RecuiterPreference.MailTemplateBySlug,
        header: {
          Accept: 'application/json',
        },
        headers: generateHeaders(),
        params: {
          slug: 'questionnaires_invite',
        },
      })
      .then((res) => {
        const { results } = res.data;
        if (results) setTemplate(results);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t]);

  /**
   * Returns the questionnaires associated with the application
   * @returns {Promise<T|void>}
   */
  const getQuestionnaires = async () => {
    const result = await axios
      .get(urls.questionnaire.questionnaire_GET, {
        params: {},
        headers: generateHeaders(),
      })
      .then((res) => {
        const { results } = res.data;
        if (results) setQuestionnaires(results.questionnaire);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
    return result;
  };

  // Pipelines for Modal
  useEffect(() => {
    getQuestionnaires();
  }, []);

  /**
   * Returns the timezones
   * @returns {Promise<void>}
   */
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

  // timezones for Modal
  useEffect(() => {
    getTimezones();
  }, []);

  const loadCandidateData = useCallback(() => {
    if (currentPipeline) {
      localStorage.setItem('pipeLineUuid', currentPipeline.job.pipeline_uuid);
      setData({
        candidates: {
          ...currentPipeline.candidate.reduce(
            // eslint-disable-next-line no-return-assign
            (obj, c) =>
              (
                // eslint-disable-next-line no-param-reassign
                (obj[c.uuid] = {
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
                }),
                obj
              ),
            {},
          ),
        },
        stages: {
          ...currentPipeline.stages.reduce(
            // eslint-disable-next-line no-return-assign
            (obj, s) =>
              (
                // eslint-disable-next-line no-param-reassign
                (obj[s.uuid] = {
                  id: s.uuid,
                  title: s.title,
                  order: s.order,
                  candidatesIds: s.candidate_uuid ? s.candidate_uuid : [],
                  totalCandidates: s.total,
                  total_with_filters: s.total_with_filters,
                  // eslint-disable-next-line no-sequences
                }),
                obj
              ),
            {},
          ),
        },
        stageOrder: currentPipeline.stage_order,
      });
    }
  }, [currentPipeline]);

  const reloadData = useCallback(() => {
    setCandidateStageChange((item) => !item);
  }, []);

  /**
   * Obtains the pipeline data and transforms it
   */
  useEffect(() => {
    if (!jobCandidateModal) loadCandidateData();
  }, [currentPipeline, jobCandidateModal, loadCandidateData]);

  /**
   * Return JSX
   */
  return (
    <>
      <div>
        <TabPane>
          <Switch>
            <Route
              exact
              path="/recruiter/job/manage/old-pipeline/:id?/:pathParam?"
              render={(prop) => (
                <ToastProvider
                  autoDismiss
                  autoDismissTimeout={3000}
                  components={{ Toast: Snack }}
                  placement="bottom-center"
                >
                  <PipelineTab
                    {...prop}
                    selectedCandidates={selectedCandidates}
                    user={user}
                    questionnaires={questionnaires}
                    timezones={timezones}
                    template={template}
                    languages={languages}
                    showJobCandidateModal={(
                      selectedCandidate,
                      uuid,
                      profileUuid,
                      score,
                      candidateUuid,
                      stages,
                      profile,
                      applied_at,
                      task,
                      reference_number,
                      applicant_number,
                    ) => {
                      setJobUuid(uuid);
                      setprofileUuid(profileUuid);
                      setScore(score);
                      setcandidateUuid(candidateUuid);
                      setStages(stages);
                      setProfile(profile);
                      setDate(applied_at);
                      showJobCandidateModal(!jobCandidateModal);
                      setSelectedCandidate(selectedCandidate);
                      setSelectedCandidateDetails(task);
                      setReferenceData({
                        reference_number,
                        applicant_number,
                      });
                    }}
                    candidateStageChange={candidateStageChange}
                    jobCandidateModal={jobCandidateModal}
                    ManageTabs={DetailTabsWrapper}
                    currentPipeline={currentPipeline}
                    currentJob={props?.currentJob}
                    setCandidatesCurrentStages={setCandidatesCurrentStages}
                    setcurrentPipeline={setcurrentPipeline}
                    data={data}
                    setData={setData}
                    {...prop}
                  />
                </ToastProvider>
              )}
            />
            <Route
              exact
              path="/recruiter/job/manage/logs/:id"
              render={(prop) => (
                <ActivityTab
                  {...prop}
                  job
                  ManageTabs={DetailTabsWrapper}
                  {...prop}
                />
              )}
            />
          </Switch>
        </TabPane>
      </div>
      <JobCandidateModal
        jobUuid={jobUuid}
        currentJob={props?.currentJob}
        jobPipelineUUID={props?.currentJob?.job?.pipelines?.[0]?.uuid}
        selectedCandidate={selectedCandidate}
        profileUuid={profileUuid}
        score={score}
        profile={profile}
        applied_at={date}
        stages={stages}
        candidateUuid={candidateUuid}
        show={jobCandidateModal}
        reloadData={reloadData}
        setCandidateStageChange={setCandidateStageChange}
        candidateStageChange={candidateStageChange}
        loadCandidateData={loadCandidateData}
        currentPipelineId={currentPipeline?.job?.pipeline_uuid}
        selectedCandidateDetails={selectedCandidateDetails}
        candidateStage={
          candidatesCurrentStages
          && selectedCandidate
          && candidatesCurrentStages?.length > 0
            ? candidatesCurrentStages?.find(
              (item) => item.uuid === selectedCandidate,
            )?.stage
            : 0
        }
        onClose={() => {
          setSelectedCandidate(null);
          setJobUuid('');
          setprofileUuid('');
          setScore('');
          setStages('');
          showJobCandidateModal(false);
        }}
        referenceData={referenceData}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});

export default connect(mapStateToProps)(ManageJobPipeline);
