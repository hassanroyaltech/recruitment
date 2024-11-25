/**
 * -----------------------------------------------------------------------------------
 * @title SharedResume.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the ShareProfileModal component which we use in the EVA-SSESS, ATS, RMS.
 * -----------------------------------------------------------------------------------
 * @todo - check Eva-SSESS is working fine after fixing error in API
 * - change the name of component to be general
 */
import React, { useCallback, useEffect, useState } from 'react';
import { BoardsLoader } from '../../../shared/Loaders';
import { evarecAPI } from '../../../api/evarec';
import { evassessAPI } from '../../../api/evassess';
import { CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import NavbarPreLogin from '../../auth/NavbarPreLogin';
import ResumeCard from './ResumeCard';
import ShareCard from '../search/ShareCard';
import SharedCard from '../../evassess/pipeline/SharedCard';
import { useTitle } from '../../../hooks';
import { showError } from '../../../helpers';
import { GetAllIntegrationsConnections } from '../../../services';

const translationPath = '';
const parentTranslationPath = 'EvarecRecRms';

/**
 * This renders the body of the shared resumes
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const BodyContent = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [applicants, setApplicants] = useState([]);
  const [assessmentUUID, setAssessmentUUID] = useState();
  const [assessmentEvaluation, setAssessmentEvaluation] = useState();
  const [jobUUID, setJobUUID] = useState();
  const [ATSModal, setATSModal] = useState(false);
  const [VAModal, setVAModal] = useState(false);
  const [type, setType] = useState();
  const [loading, isLoading] = useState(false);
  const [stages, setStages] = useState();
  const [hasEvaluation, setHasEvaluation] = useState();
  const [connections, setConnections] = useState({
    results: [],
    totalCount: 0,
  });
  const [filters] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const { user }
    = (localStorage.getItem('user')
      && JSON.parse(localStorage.getItem('user'))?.results)
    || '';

  useTitle(t(`${translationPath}shared-applicants`));
  /**
   * Effect to determine which API should invoke depends on window pathname,
   * then change the state of applicants, and the type (rms, ats, eva-ssess)
   * to render the cards.
   */
  useEffect(() => {
    isLoading(true);
    if (window.location.pathname.toString().includes('rms'))
      evarecAPI
        .getSharedResumes(props.match.params.token)
        .then((res) => {
          isLoading(false);
          setApplicants(res.data.results);
          setType('rms');
        })
        .catch((error) => {
          isLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else if (window.location.pathname.toString().includes('database'))
      evarecAPI
        .getSharedCandidate(props.match.params.token)
        .then((res) => {
          isLoading(false);
          setApplicants(res?.data?.results?.applicants);
          setType('database');
        })
        .catch((error) => {
          isLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else if (window.location.pathname.toString().includes('ats'))
      evarecAPI
        .getEvaRecScoreByToken(props.match.params.token)
        .then((res) => {
          isLoading(false);
          setApplicants(res.data.results.applicants);
          setJobUUID(res?.data?.results?.applicants?.[0]?.job_uuid);
          setHasEvaluation(
            Object.hasOwn(res?.data?.results?.evaluation_uuid || {}, 'title'),
          );
          setStages(res?.data?.results?.stages || []);
          setType('ats');
        })
        .catch((error) => {
          isLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else if (window.location.pathname.toString().includes('assessment'))
      evassessAPI
        .getSharedCandidateProfile(props.match.params.token)
        .then((res) => {
          isLoading(false);
          setApplicants(res?.data?.results?.candidates);
          setAssessmentUUID(res?.data?.results?.assessment_uuid);
          setAssessmentEvaluation(res?.data?.results?.evaluation_uuid);
          setType('assessment');
        })
        .catch((error) => {
          isLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  }, [props.match.params.token, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const getAllIntegrationsConnections = useCallback(async () => {
    isLoading(true);
    const response = await GetAllIntegrationsConnections(filters);
    isLoading(false);
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

  /**
   * Effect will be invoked to get Stages, and check if job has evaluation.
   */
  // useEffect(() => {
  //   if (jobUUID) {
  //     evarecAPI.getPipeline(true, [], jobUUID).then((res) => {
  //       setStages(res?.data?.results?.stages);
  //     });
  //     evarecAPI.viewJob(jobUUID).then((res) => {
  //       setHasEvaluation(res?.data?.results?.job?.evaluation_uuid.hasOwnProperty('title'));
  //     });
  //   }
  // }, [jobUUID]);

  useEffect(() => {
    getAllIntegrationsConnections();
  }, [getAllIntegrationsConnections, filters]);

  return (
    <div className="content content-page bg-white">
      {!user && (
        <>
          <NavbarPreLogin {...props} />
          <div className="circles-w-l" />
          <div className="circles-w-r" />
        </>
      )}
      {loading ? (
        <BoardsLoader />
      ) : (
        <div className={` ${user ? 'pt-3 px-3' : 'container text-center'}`}>
          <h3 className="mb-0">
            {t(`${translationPath}list-of-shared-applicants`)}
          </h3>
          <hr />
          <CardBody className="d-flex justify-content-center">
            <div className="d-flex-h-center w-100 flex-wrap">
              {type === 'rms'
                && applicants?.map((resume, index) => (
                  <ResumeCard
                    // toggleSelection={(id) => toggleSelection(id)}
                    key={`rmsApplicationCardKey${index + 1}`}
                    withCheckbox={false}
                    uuid={resume.uuid}
                    profile_pic={resume.basic_information?.profile_pic}
                    title={resume.basic_information?.personal_name}
                    email={resume.email}
                    score={resume.similarity}
                    isSelected={resume.isSelected}
                    isCompleted={resume.is_complete}
                    skills={resume.skills}
                    experiences={resume.experience?.[0]}
                    education={resume.education?.[0]}
                    candidate_uuid={resume.user_uuid}
                    user_uuid={resume.user_uuid}
                    index={index}
                    url={resume.url}
                    resumeData={resume}
                  />
                ))}
              {(type === 'ats' || type === 'database')
                && applicants?.map((applicant, index) => (
                  <ShareCard
                    key={`atsApplicationKey${index + 1}`}
                    connections={connections}
                    title={`${applicant.first_name} ${applicant.last_name}`}
                    email={applicant?.email}
                    position={applicant.position}
                    comapny={applicant?.company_name}
                    isSelected={applicant.isSelected}
                    tabs={applicant.skills}
                    uuid={applicant.uuid}
                    user_uuid={applicant.user_uuid}
                    profile_uuid={applicant.profile_uuid}
                    score={applicant.score}
                    job_uuid={jobUUID}
                    stages={stages}
                    date={applicant.register_at}
                    onClick={() => setATSModal(true)}
                    ATSModal={ATSModal}
                    setATSModal={setATSModal}
                    hasEvaluation={hasEvaluation}
                    is_completed_profile
                    isShareResume
                    profile_pic={applicant.profile_image?.url}
                  />
                ))}
              {type === 'assessment'
                && applicants?.map((candidate, index) => (
                  <SharedCard
                    {...candidate}
                    key={`applicationKey${index + 1}`}
                    isNew={candidate.is_new}
                    register_at={candidate.register_at}
                    isCompleted={candidate.is_completed}
                    comments={candidate.total_comments}
                    avg_rating={candidate.avg_rating}
                    title={`${candidate.first_name} ${candidate.last_name}`}
                    email={candidate?.email}
                    subtitle={candidate.email}
                    rating={candidate.rating}
                    uuid={candidate.uuid}
                    profile_image={candidate.profile_image}
                    user_uuid={candidate.user_uuid}
                    isSelected={false}
                    onClick={() => setVAModal(candidate.uuid)}
                    VAModal={VAModal === candidate.uuid}
                    setVAModal={setVAModal}
                    assessmentUUID={assessmentUUID}
                    assessmentEvaluation={assessmentEvaluation}
                  />
                ))}
            </div>
          </CardBody>
        </div>
      )}
    </div>
  );
};

/**
 * This renders the headers and takes the above body
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SharedResumes = (props) => <BodyContent {...props} />;

export default SharedResumes;
