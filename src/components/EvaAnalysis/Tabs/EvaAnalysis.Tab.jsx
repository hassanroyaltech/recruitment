import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { showError, showSuccess } from '../../../helpers';
import { LoaderComponent } from '../../Loader/Loader.Component';
import { ChatGPTIcon } from '../../../assets/icons';
import {
  AddJobToPipeline,
  AddResumeToPipeline,
  GenerateFullProfileRecommendation,
  GenerateFullResumeRecommendation,
  GetCandidateSectionRecommendation,
  GetJobById,
  GetProfileRecommendation,
  GetResumeRecommendation,
  GetResumeSectionRecommendation,
} from '../../../services';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
} from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import './EvaAnalysis.Style.scss';
import Empty from '../../../pages/recruiter-preference/components/Empty';
import { DialogComponent } from '../../Dialog/Dialog.Component';
import { SharedAutocompleteControl } from '../../../pages/setups/shared';
import { useSelector } from 'react-redux';
import { PipelineStagesEnum } from '../../../enums';

const translationPath = 'EvaAnalysisTab.';
const parentTranslationPath = 'EvarecCandidateModel';

export const EvaAnalysisTab = ({
  source,
  job_uuid,
  profile_uuid,
  media_uuid,
  candidate_user_uuid,
  email,
  resume_uuid,
  applied_jobs_list,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [recommenderData, setRecommenderData] = useState(null);
  const addToPipelineDataRef = useRef({
    job_uuid: null,
    pipeline_uuid: null,
    stage_uuid: null,
    pipelinesList: [],
    showDialog: false,
  });
  const [addToPipelineData, setAddToPipelineData] = useState(
    addToPipelineDataRef.current,
  );
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(
    source === 'initial-approval' ? null : job_uuid,
  );

  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);

  const GetProfileRecommendationHandler = useCallback(async () => {
    setIsLoading(true);
    let response;

    if (source === 'rms')
      response = await GetResumeRecommendation({
        media_uuid,
        job_uuid: selectedJob,
      });
    else if (
      source === 'candidate-modal'
      || source === 'search-database'
      || source === 'initial-approval'
    )
      response = await GetProfileRecommendation({
        profile_uuid,
        job_uuid: selectedJob,
      });

    setIsLoading(false);
    if (response?.status === 200) setRecommenderData(response.data.result);
    else showError('Shared:failed-to-get-saved-data', response);
  }, [source, media_uuid, selectedJob, profile_uuid]);

  const RegenerateResponseHandler = useCallback(
    async (sectionName) => {
      setIsLoading(true);

      let response;
      if (source === 'rms')
        response = await GetResumeSectionRecommendation({
          media_uuid,
          job_uuid: [selectedJob],
          regenerate: true,
          sectionName,
        });
      else if (
        source === 'candidate-modal'
        || source === 'search-database'
        || source === 'initial-approval'
      )
        response = await GetCandidateSectionRecommendation({
          user_uuid: candidate_user_uuid,
          profile_language_uuid: profile_uuid,
          job_uuid: [selectedJob],
          regenerate: true,
          sectionName,
        });

      if (response.status === 200)
        setTimeout(() => {
          GetProfileRecommendationHandler().catch(() => {
            setIsLoading(false);
            showError('Shared:failed-to-get-saved-data');
          });
        }, 3000);
      else {
        showError('Shared:failed-to-get-saved-data', response);
        setIsLoading(false);
      }
    },
    [
      GetProfileRecommendationHandler,
      candidate_user_uuid,
      selectedJob,
      media_uuid,
      profile_uuid,
      source,
    ],
  );

  const RegenerateFullResponseHandler = useCallback(async () => {
    setIsLoading(true);

    let response;
    if (source === 'rms')
      response = await GenerateFullResumeRecommendation({
        media_uuid,
        job_uuid: [selectedJob],
        regenerate: true,
      });
    else if (
      source === 'candidate-modal'
      || source === 'search-database'
      || source === 'initial-approval'
    )
      response = await GenerateFullProfileRecommendation({
        user_uuid: candidate_user_uuid,
        profile_language_uuid: profile_uuid,
        job_uuid: [selectedJob],
        regenerate: true,
      });

    if (response.status === 200)
      setTimeout(() => {
        GetProfileRecommendationHandler().catch(() => {
          setIsLoading(false);
          showError('Shared:failed-to-get-saved-data');
        });
      }, 3000);
    else {
      showError('Shared:failed-to-get-saved-data', response);
      setIsLoading(false);
    }
  }, [
    GetProfileRecommendationHandler,
    candidate_user_uuid,
    selectedJob,
    media_uuid,
    profile_uuid,
    source,
  ]);

  const AddToPipelineHandler = useCallback(async () => {
    if (!selectedBranchReducer.uuid) return;
    setIsDialogLoading(true);
    let response;
    if (source === 'rms')
      response = await AddResumeToPipeline({
        items: [
          {
            email,
            rms_uuid: resume_uuid,
          },
        ],
        job_uuid: addToPipelineData.job_uuid,
        stage_uuid: addToPipelineData.stage_uuid,
      });
    else
      response = await AddJobToPipeline({
        branch_uuid: selectedBranchReducer.uuid,
        profile_uuid: [profile_uuid],
        job_uuid: addToPipelineData.job_uuid,
        stage_uuid: addToPipelineData.stage_uuid,
      });

    setIsDialogLoading(false);
    if (response.status === 200) {
      setAddToPipelineData((prev) => ({ ...prev, showDialog: false }));
      showSuccess(t(`${translationPath}added-to-pipeline-successfully`));

      GetProfileRecommendationHandler().catch(() => {
        setIsLoading(false);
      });
    } else showError('Shared:failed-to-get-saved-data', response);
  }, [
    GetProfileRecommendationHandler,
    addToPipelineData.job_uuid,
    addToPipelineData.stage_uuid,
    email,
    profile_uuid,
    resume_uuid,
    selectedBranchReducer.uuid,
    source,
    t,
  ]);

  const GetJobDetailsHandler = useCallback(
    async (selectedJob) => {
      if (!selectedBranchReducer.uuid) return;
      setIsDialogLoading(true);
      const response = await GetJobById({
        job_uuid: selectedJob,
        company_uuid: selectedBranchReducer.uuid,
      });
      setIsDialogLoading(false);

      if (response.status === 200)
        setAddToPipelineData((prev) => ({
          ...prev,
          pipelinesList: response.data?.results?.job?.pipelines || [],
          job_uuid: selectedJob,
        }));
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t, selectedBranchReducer.uuid],
  );

  useEffect(() => {
    if (selectedJob)
      GetProfileRecommendationHandler().catch(() => {
        setIsLoading(false);
      });
  }, [GetProfileRecommendationHandler, selectedJob]);

  return (
    <div className="eva-analysis-tab p-3">
      {isLoading && (
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { width: '100%', marginBottom: '1rem', height: '2rem' },
            },
          ]}
          numberOfRepeat={6}
        />
      )}
      {source === 'initial-approval' && (
        <div
          style={{
            ...(isLoading && { display: 'none' }),
          }}
        >
          <p>{t(`${translationPath}select-job-from-applied-jobs`)}</p>
          <SharedAutocompleteControl
            editValue={selectedJob}
            initValues={applied_jobs_list}
            stateKey="selected_job"
            onValueChanged={(e) => {
              setSelectedJob(e.value || null);
            }}
            placeholder="applied-jobs"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            initValuesTitle="title"
            initValuesKey="job_uuid"
            sharedClassesWrapper="px-0 py-2"
          />
        </div>
      )}
      {!isLoading
        && recommenderData === null
        && !(source === 'initial-approval' && !selectedJob) && (
        <Empty
          extraContent={
            <ButtonBase
              className="btns theme-solid my-3"
              onClick={() => RegenerateFullResponseHandler()}
            >
              {t(`${translationPath}regenerate-data`)}
            </ButtonBase>
          }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {recommenderData && (
        <div
          style={{
            ...(isLoading && { display: 'none' }),
          }}
        >
          <Accordion elevation={0} defaultExpanded>
            <AccordionSummary aria-controls="accordion" id="eva-analysis-summary">
              <div className="d-flex-v-center-h-between">
                <div className="d-flex-v-center">
                  <div>
                    <span className="fas fa-caret-down" />
                  </div>
                  <div className="mx-3 fz-16px">
                    {t(`${translationPath}summary`)}
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="px-4 pb-3">
                {recommenderData?.summary === null ? (
                  <ButtonBase
                    className="btns theme-outline"
                    onClick={() =>
                      RegenerateResponseHandler('summarization', 'summary')
                    }
                  >
                    <ChatGPTIcon color="var(--bc-primary)" />
                    <span className="mx-2">
                      {t(`${translationPath}generate-response`)}
                    </span>
                  </ButtonBase>
                ) : (
                  recommenderData?.summary
                )}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0}>
            <AccordionSummary aria-controls="accordion" id="eva-analysis-pros">
              <div className="d-flex-v-center-h-between">
                <div className="d-flex-v-center">
                  <div>
                    <span className="fas fa-caret-down" />
                  </div>
                  <div className="mx-3 fz-16px">{t(`${translationPath}pros`)}</div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="px-4 pb-3">
                {recommenderData?.pros === null ? (
                  <ButtonBase
                    className="btns theme-outline"
                    onClick={() => RegenerateResponseHandler('pros', 'pros')}
                  >
                    <ChatGPTIcon color="var(--bc-primary)" />
                    <span className="mx-2">
                      {t(`${translationPath}generate-response`)}
                    </span>
                  </ButtonBase>
                ) : (
                  <ul>
                    {recommenderData?.pros?.length > 0 ? (
                      recommenderData?.pros?.map((pro) => (
                        <li key={pro} className="mb-2">
                          {pro}
                        </li>
                      ))
                    ) : (
                      <li className="mb-2">
                        {t(`${translationPath}no-pros-detected`)}
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0}>
            <AccordionSummary aria-controls="accordion" id="eva-analysis-cons">
              <div className="d-flex-v-center-h-between">
                <div className="d-flex-v-center">
                  <div>
                    <span className="fas fa-caret-down" />
                  </div>
                  <div className="mx-3 fz-16px">{t(`${translationPath}cons`)}</div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="px-4 pb-3">
                {recommenderData?.cons === null ? (
                  <ButtonBase
                    className="btns theme-outline"
                    onClick={() => RegenerateResponseHandler('cons', 'cons')}
                  >
                    <ChatGPTIcon color="var(--bc-primary)" />
                    <span className="mx-2">
                      {t(`${translationPath}generate-response`)}
                    </span>
                  </ButtonBase>
                ) : (
                  <ul>
                    {recommenderData?.cons?.length > 0 ? (
                      recommenderData?.cons?.map((con) => (
                        <li key={con} className="mb-2">
                          {con}
                        </li>
                      ))
                    ) : (
                      <li>{t(`${translationPath}no-cons-detected`)}</li>
                    )}
                  </ul>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
          <Accordion elevation={0}>
            <AccordionSummary
              aria-controls="accordion"
              id="eva-analysis-job-suggestions"
            >
              <div className="d-flex-v-center-h-between">
                <div className="d-flex-v-center">
                  <div>
                    <span className="fas fa-caret-down" />
                  </div>
                  <div className="mx-3 fz-16px">
                    {t(`${translationPath}job-suggestions`)}
                  </div>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <ul className="px-4">
                {recommenderData?.job_suggestions?.map((job) => (
                  <li key={job.uuid} className="d-flex-v-center-h-between mb-2">
                    <div className="similarity-section">
                      <div
                        className={`similarity ${
                          (job.similarity >= 67 && 'high')
                          || (job.similarity < 67
                            && job.similarity >= 34
                            && 'medium')
                          || (job.similarity < 34 && 'low')
                        }`}
                      >
                        <CircularProgress
                          variant="determinate"
                          size={50}
                          value={job.similarity}
                        />
                      </div>
                      <div
                        className={`similarity-value ${
                          (job.similarity >= 67 && 'high')
                          || (job.similarity < 67
                            && job.similarity >= 34
                            && 'medium')
                          || (job.similarity < 34 && 'low')
                        }`}
                      >
                        {`${Math.round(job.similarity)}%`}
                      </div>
                    </div>
                    <div>{job.title}</div>
                    <ButtonBase
                      className={`btns ${
                        job.is_applied ? 'theme-outline' : 'theme-transparent'
                      }`}
                      onClick={() => {
                        if (!job.is_applied) {
                          GetJobDetailsHandler(job.uuid);
                          setAddToPipelineData({
                            ...addToPipelineDataRef.current,
                            showDialog: true,
                          });
                        }
                      }}
                      disabled={job.is_applied || !email}
                    >
                      {job.is_applied ? (
                        <span>{t(`${translationPath}applied`)}</span>
                      ) : (
                        <>
                          <span className="fas fa-plus" />
                          <span className="px-2">
                            {t(`${translationPath}add-to-pipeline`)}
                          </span>
                        </>
                      )}
                    </ButtonBase>
                  </li>
                ))}
                {recommenderData?.job_suggestions?.length === 0 && (
                  <li className="mb-2">
                    {t(`${translationPath}no-job-suggestions-detected`)}
                  </li>
                )}
              </ul>
            </AccordionDetails>
          </Accordion>
        </div>
      )}

      {addToPipelineData.showDialog && (
        <DialogComponent
          isOpen={addToPipelineData.showDialog}
          onCloseClicked={() => {
            setAddToPipelineData({
              ...addToPipelineDataRef.current,
              showDialog: false,
            });
          }}
          titleText="add-to-pipeline-confirm"
          saveText="add"
          saveIsDisabled={isDialogLoading || !addToPipelineData.stage_uuid}
          maxWidth="sm"
          dialogContent={
            <div>
              {isDialogLoading && (
                <LoaderComponent
                  isLoading={isDialogLoading}
                  isSkeleton
                  skeletonItems={[
                    {
                      variant: 'rectangular',
                      style: { width: '100%', marginBottom: '1rem', height: '2rem' },
                    },
                  ]}
                  numberOfRepeat={3}
                />
              )}
              <div style={{ ...(isDialogLoading && { display: 'none' }) }}>
                <SharedAutocompleteControl
                  isGlobalLoading={isDialogLoading}
                  placeholder="select-pipeline"
                  title="pipeline"
                  stateKey="pipeline_uuid"
                  getOptionLabel={(option) => option.title}
                  isRequired
                  sharedClassesWrapper="px-2"
                  initValues={addToPipelineData.pipelinesList}
                  errorPath="pipeline_uuid"
                  initValuesKey="pipeline_uuid"
                  isEntireObject
                  initValuesTitle="title"
                  onValueChanged={({ value }) => {
                    if (value) {
                      const applyStage = value.stages.find(
                        (item) => item.type === PipelineStagesEnum.APPLIED.key,
                      );
                      if (applyStage) {
                        setAddToPipelineData((prev) => ({
                          ...prev,
                          stage_uuid: applyStage.uuid,
                        }));
                        return;
                      }
                    }
                    setAddToPipelineData((prev) => ({
                      ...prev,
                      stage_uuid: null,
                    }));
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              </div>
            </div>
          }
          onSaveClicked={(e) => {
            e.preventDefault();
            AddToPipelineHandler();
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

EvaAnalysisTab.propTypes = {
  source: PropTypes.oneOf([
    'rms',
    'candidate-modal',
    'search-database',
    'initial-approval',
  ]),
  profile_uuid: PropTypes.string,
  media_uuid: PropTypes.string,
  candidate_user_uuid: PropTypes.string.isRequired,
  // candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  email: PropTypes.string,
  resume_uuid: PropTypes.string,
  applied_jobs_list: PropTypes.arrayOf(PropTypes.string),
};
