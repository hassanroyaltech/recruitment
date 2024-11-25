/* eslint-disable react/prop-types */
// import React components
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

// import Material UI components
import { makeStyles } from '@mui/styles';
import { Step, Stepper, Typography } from '@mui/material';

// import Moment to format date and time
import moment from 'moment';
// Common API Service
import { commonAPI } from '../../../api/common';

import { getUniqueID } from '../../../shared/utils';

// Logger
import { evarecAPI } from '../../../api/evarec';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { useQuery, useTitle } from '../../../hooks';
import { StepperConnector, StepperIcon, StepperLabel } from '../Stepper';
// import forms components
import ChooseJobTemplate from './forms/ChooseJobTemplate';
import Congratulations from './forms/Congratulations';
import PositionForm from './forms/PositionForm';
import AdvancedForm from './forms/AdvancedForm';
import PromoteForm from './forms/PromoteForm';
import { InviteTeamForm } from './forms/InviteTeamForm';
import PublishForm from './forms/PublishForm';
import {
  getErrorByName,
  getIsAllowedPermissionV2,
  showError,
} from '../../../helpers';
import {
  GetAllIntegrationsConnections,
  GetJobRequisitionById,
} from '../../../services';
import {
  EvaluationsPermissions,
  ManageApplicationsPermissions,
} from '../../../permissions';
import { TranslationsDialog } from './forms/Translations.Dialog';
import EvaluateForm from './forms/EvaluateForm';
import {
  IndeedQuestionsTypesEnum,
  JobInviteRecruiterTypesEnum,
  ScorecardAssigneeTypesEnum,
} from '../../../enums';
import IndeedQuestionsForm from './forms/indeed-questions/IndeedQuestionsForm';
import * as yup from 'yup';
import Confetti from 'react-confetti';
import useVitally from '../../../hooks/useVitally.Hook';
const translationPath = '';
const parentTranslationPath = 'CreateJob';

// import evarec API endpoints

const steps = [
  'Position',
  'Advanced',
  'Evaluate',
  'indeed-questions',
  'Promote',
  'Invite Team',
  'Publish',
];
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    background: 'none',
    width: '120%',
    position: 'relative',
    left: '-10%',
    padding: 0,
  },
}));

const mutateQuestionsData = (questionsArray) => {
  if (!questionsArray.length) return [];
  return (questionsArray || []).map((item) => ({
    description: '',
    title: item?.question || '',
    type: item?.type,
    is_required: item?.required || false,
    uuid: item?.id || '',
    ...(item?.options?.length && {
      answers: (item?.options || []).map((el) => ({
        value: el.value || '',
        title: el?.label || '',
        stage_uuid: null,
        to_disqualified: false,
      })),
    }),
  }));
};
/**
 * The main CreateJob component, this is rendered when we click
 * on 'Create an application' in the sidebar
 * @returns {JSX.Element}
 * @constructor
 */
export const CreateJob = ({ edit, modalTitle }) => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(
    edit
      ? t(`${translationPath}edit-an-application`)
      : t(`${translationPath}create-an-application`),
  );
  const { VitallyTrack } = useVitally();
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((reducerState) => reducerState.userReducer);
  const query = useQuery();
  const [jobRequisitionUUID, setJobRequisitionUUID] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  // THIS NEEDS TO BE IMPROVED (too generic accessing the user)
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  // Toast to display alert messages for the user
  const { addToast } = useToasts();

  const classes = useStyles();
  const history = useHistory();
  // determine the action => create job || update job
  const [action, setAction] = useState('create');

  const [form, setForm] = useState({});
  const [isFinished, setFinished] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  // Declare states to hold forms data
  const [isWorking, setIsWorking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [evaluations, setEvaluations] = useState(null);
  const [profileBuilders, setProfileBuilders] = useState(null);
  const [categories, setCategories] = useState(null);
  const [portalFlag, setPortalFlag] = useState(false);
  const gpaDescription = [
    { id: 90, title: t(`${translationPath}excellent`) },
    { id: 80, title: t(`${translationPath}very-good`) },
    { id: 70, title: t(`${translationPath}good`) },
    { id: 60, title: t(`${translationPath}pass`) },
    { id: 50, title: t(`${translationPath}weak`) },
  ];

  // Tabs States
  // Tab one state choose job template
  const [chooseJobData, setChooseJobData] = useState({
    isExternal: true,
    isInternal: false,
    pipeline_uuid: null,
    template_uuid: null,
  });
  // Tab two position data form
  const [positionData, setPositionData] = useState({});
  // Tab three advance data form with default value for gender
  const [advanceData, setAdvanceData] = useState({
    gender: '',
    min_salary: 0,
    hidden_columns: [],
  });
  // Tab four PUBLISH data form
  const [publishData, setPublishData] = useState({
    is_schedule: false,
  });
  // Tab five invite team data form
  const [teamData, setTeamData] = useState({
    options: [],
    recruiter: [],
    hiring_manager: [],
    hod: [],
    onboarding_team: [],
    other_team: [],
    teams: [],
    job_poster: [],
    job_recruiter: [],
  });
  // Tab five invite team data form
  const [evaluateData, setEvaluateData] = useState({
    decision_makers: [],
    committee_members: [],
    score_card_uuid: {},
    has_reminder: false,
    period_type: '',
    period: '',
    can_edit_score_card: true,
  });
  const [indeedQuestions, setIndeedQuestions] = useState({
    screenerQuestions: { questions: [] },
    demographicQuestions: { questions: [] },
  });
  const [errors, setErrors] = useState({});
  const [isConnectedToIndeed, setIsConnectedToIndeed] = useState(false);
  // state to store job url after create job
  const [jobUrl, setJobUrl] = useState(null);
  // State to store the date we create the job
  const [time, setTime] = useState(null);
  const [positionTitleUUID, setPositionTitleUUID] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [translations, setTranslations] = useState({});
  const questionsSchemaRef = useRef(
    yup.object().shape({
      questions: yup
        .array()
        .of(
          yup.object().shape({
            title: yup
              .string()
              .nullable()
              .required(t('Shared:this-field-is-required')),
            answers: yup.array().when('type', (value) => {
              if (
                value === IndeedQuestionsTypesEnum.select.key
                || value === IndeedQuestionsTypesEnum.multiselect.key
              )
                return yup
                  .array()
                  .of(
                    yup.object().shape({
                      title: yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                    }),
                  )
                  .min(1, t('Shared:this-field-is-required'))
                  .required(t('Shared:this-field-is-required'));
              return yup.mixed().nullable();
            }),
          }),
        )
        .nullable(),
    }),
  );
  const stepsMemo = useMemo(
    () =>
      isConnectedToIndeed
        ? steps
        : steps.filter((item) => item !== 'indeed-questions'),
    [isConnectedToIndeed],
  );

  const getAllIntegrationsConnections = useCallback(async () => {
    const response = await GetAllIntegrationsConnections({
      limit: 20,
    });
    if (response && response.status === 200) {
      const { results } = response.data;
      setIsConnectedToIndeed(
        (results || []).find((item) => item?.partner === 'indeed')?.is_connected,
      );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);
  useEffect(() => {
    void getAllIntegrationsConnections();
  }, [getAllIntegrationsConnections]);
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          screenerQuestions: questionsSchemaRef.current,
          demographicQuestions: questionsSchemaRef.current,
        }),
      },
      indeedQuestions,
    ).then((result) => {
      setErrors(result);
    });
  }, [indeedQuestions]);
  useEffect(() => {
    isConnectedToIndeed && getErrors();
  }, [getErrors, isConnectedToIndeed, indeedQuestions]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data by job requisition uuid
   */
  const getJobRequisitionById = useCallback(async () => {
    setIsWorking(true);
    const jobResponse = await GetJobRequisitionById({ uuid: jobRequisitionUUID });
    setIsWorking(false);
    if (jobResponse && jobResponse.status === 200) {
      const {
        data: { results },
      } = jobResponse;
      setPositionData((items) => ({
        ...items,
        title:
          results.job_title_name?.[i18next.language] || results.job_title_name?.en,
      }));
      setAdvanceData((items) => ({
        ...items,
        category_uuid: results.category_uuid,
      }));
    }
  }, [jobRequisitionUUID]);

  // Fetching data from API || local storage For First Tab
  useEffect(() => {
    // if the action is edit job => Split the UUID from the URL then invoke viewJob function
    // from evarec API => fill out the forms with response data
    if (edit) {
      setAction('updated');
      const url = window.location.pathname;
      const uuid = url?.substring(url?.lastIndexOf('/') + 1);
      evarecAPI
        .viewJob(uuid)
        .then((data) => {
          if (data?.data?.statusCode === 200) {
            const gpa = gpaDescription?.filter(
              (ele) => ele.id === data?.data?.results?.job?.gpa,
            );
            const experience = {
              id: data?.data?.results?.job?.years_of_experience?.[0]
                ? `${data?.data?.results?.job?.years_of_experience?.[0]}`
                : null,
              title: data?.data?.results?.job?.years_of_experience?.[0]
                ? `${data?.data?.results?.job?.years_of_experience?.[0]}`
                : null,
            };
            setTranslations(data?.data?.results?.job?.translations);
            setChooseJobData((items) => ({
              ...items,
              pipeline_uuid: data?.data?.results?.job?.origin_pipeline,
            }));
            setPositionData((items) => ({
              ...items,
              title: data?.data?.results?.job?.title,
              reference_number: data?.data?.results?.job?.reference_number,
              department_id:data?.data?.results?.job?.department_uuid?.uuid,
              major_uuid:
                data?.data?.results?.job?.major_uuid?.map((a) => a.uuid || a.id)
                || [],
              type_uuid: data?.data?.results?.job?.type_uuid?.[0] && {
                ...data?.data?.results?.job?.type_uuid?.[0],
                uuid:
                  data?.data?.results?.job?.type_uuid?.[0].id
                  || data?.data?.results?.job?.type_uuid?.[0].uuid,
              },
              career_level_uuid: data?.data?.results?.job
                ?.career_level_uuid?.[0] && {
                ...data?.data?.results?.job?.career_level_uuid?.[0],
                uuid:
                  data?.data?.results?.job?.career_level_uuid?.[0].id
                  || data?.data?.results?.job?.career_level_uuid?.[0].uuid,
              },
              years_of_experience: experience,
              industry_uuid: data?.data?.results?.job?.industry_uuid?.[0] && {
                ...data?.data?.results?.job?.industry_uuid?.[0],
                uuid:
                  data?.data?.results?.job?.industry_uuid?.[0].id
                  || data?.data?.results?.job?.industry_uuid?.[0].uuid,
              },
              degree_type: data?.data?.results?.job?.degree_type?.[0] && {
                ...data?.data?.results?.job?.degree_type?.[0],
                uuid:
                  data?.data?.results?.job?.degree_type?.[0].id
                  || data?.data?.results?.job?.degree_type?.[0].uuid,
              },
              deadline: data?.data?.results?.job?.deadline,
              questionnaire_uuid: data?.data?.results?.job?.questionnaire_uuid,
              skills: data?.data?.results?.job?.skills,
            }));
            setAdvanceData({
              nationality_uuid: data?.data?.results?.job?.nationality_uuid?.map(
                (a) => a.uuid || a.id,
              ),
              country_uuid: data?.data?.results?.job?.country_uuid && {
                ...data?.data?.results?.job?.country_uuid,
                uuid:
                  data?.data?.results?.job?.country_uuid.id
                  || data?.data?.results?.job?.country_uuid.uuid,
              },
              city: data?.data?.results?.job?.city,
              address: data?.data?.results?.job?.address
                ? data?.data?.results?.job?.address
                : `${data?.data?.results?.job?.lat || ''}, ${
                  data?.data?.results?.job?.long || ''
                }`,
              location_uuid: data?.data?.results?.job?.location_uuid,
              gender: data?.data?.results?.job?.gender || '',
              gpa: gpa?.[0],
              min_salary: data?.data?.results?.job?.min_salary,
              max_salary: data?.data?.results?.job?.max_salary,
              visa_sponsorship: data?.data?.results?.job?.visa_sponsorship,
              willing_to_travel: data?.data?.results?.job?.willing_to_travel,
              willing_to_relocate: data?.data?.results?.job?.willing_to_relocate,
              owns_a_car: data?.data?.results?.job?.owns_a_car,
              languages: data?.data?.results?.job?.language_proficiency?.length
                ? data?.data?.results?.job?.language_proficiency
                : [{ uuid: null, score: null, id: getUniqueID() }],
              description: data?.data?.results?.job?.description,
              requirements: data?.data?.results?.job?.requirements,
              profile_builder_uuid: data?.data?.results?.job?.profile_builder_uuid,
              evaluation_uuid: data?.data?.results?.job?.evaluation_uuid?.uuid,
              category_uuid: data?.data?.results?.job?.category?.uuid,
              lat: data?.data?.results?.job?.lat,
              long: data?.data?.results?.job?.long,
              total_candidates: data?.data?.results?.job?.total_candidates,
              hidden_columns: data?.data?.results?.job?.hidden_columns || [],
            });
            setTeamData({
              teams: data?.data?.results?.job?.teams_invite.map((item) => ({
                ...item,
                value: item.uuid,
              })),
              recruiter: data?.data?.results?.job?.onboarding_teams?.recruiter.map(
                (item) => ({
                  ...item,
                  value: item.uuid,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                }),
              ),
              job_poster: (data?.data?.results?.job?.job_poster && [
                {
                  ...data.data.results.job.job_poster,
                  value: data.data.results.job.job_poster.uuid,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                },
              ]) || [
                {
                  value: userReducer.results.user.uuid,
                  label: `${
                    userReducer.results.user.first_name?.[i18next.language]
                    || userReducer.results.user.first_name?.en
                  } ${
                    userReducer.results.user.last_name?.[i18next.language]
                    || userReducer.results.user.last_name?.en
                  }`,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                },
              ],
              job_recruiter: (data?.data?.results?.job?.job_recruiter && [
                {
                  ...data.data.results.job.job_recruiter,
                  value: data.data.results.job.job_recruiter.uuid,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                },
              ]) || [
                {
                  value: userReducer.results.user.uuid,
                  label: `${
                    userReducer.results.user.first_name?.[i18next.language]
                    || userReducer.results.user.first_name?.en
                  } ${
                    userReducer.results.user.last_name?.[i18next.language]
                    || userReducer.results.user.last_name?.en
                  }`,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                },
              ],
              hiring_manager:
                data?.data?.results?.job?.onboarding_teams?.hiring_manager.map(
                  (item) => ({
                    ...item,
                    value: item.uuid,
                    type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                  }),
                ),
              hod: data?.data?.results?.job?.onboarding_teams?.hod.map((item) => ({
                ...item,
                value: item.uuid,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              })),
              onboarding_team:
                data?.data?.results?.job?.onboarding_teams?.onboarding_team.map(
                  (item) => ({
                    ...item,
                    value: item.uuid,
                    type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                  }),
                ),
              other_team: data?.data?.results?.job?.onboarding_teams?.other_team.map(
                (item) => ({
                  ...item,
                  value: item.uuid,
                  type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
                }),
              ),
            });
            setPublishData({
              is_schedule: data?.data?.results?.job?.is_schedule,
              fromDate: data?.data?.results?.job?.is_schedule
                ? data?.data?.results?.job?.from_date
                : null,
              toDate: data?.data?.results?.job?.is_schedule
                ? data?.data?.results?.job?.to_date
                : null,
            });
            setForm({
              freeJobBoard: data?.data?.results?.job?.advertise?.free_job_board,
              featureJobPost: data?.data?.results?.job?.is_feature,
            });
            setIsPublished(data?.data?.results?.job?.is_published);
            setEvaluateData({
              decision_makers:
                data?.data?.results?.job?.job_score_card?.decision_makers?.map(
                  (item) => ({
                    ...item,
                    value: item.uuid,
                    type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
                  }),
                ) || [],
              committee_members:
                data?.data?.results?.job?.job_score_card?.committee_members?.map(
                  (item) => ({
                    ...item,
                    value: item.uuid,
                    type: ScorecardAssigneeTypesEnum.UsersAndEmployees.type,
                  }),
                ) || [],
              score_card_uuid: {
                uuid: data?.data?.results?.job?.score_card_uuid,
                min_committee_members:
                  data?.data?.results?.job?.job_score_card?.card_setting
                    ?.min_committee_members || '',
              },
              has_reminder: data?.data?.results?.job?.job_score_card?.has_reminder,
              period_type: data?.data?.results?.job?.job_score_card?.period_type,
              period: data?.data?.results?.job?.job_score_card?.period,
              can_edit_score_card: data?.data?.results?.job.can_edit_score_card,
              job_requisition_uuid: data?.data?.results?.job?.job_requisition_uuid,
            });
            setIndeedQuestions({
              screenerQuestions: {
                questions: mutateQuestionsData(
                  data?.data?.results?.job?.indeed_questionnaire?.screenerQuestions
                    ?.questions || [],
                ),
              },
              demographicQuestions: {
                questions: mutateQuestionsData(
                  data?.data?.results?.job?.indeed_questionnaire
                    ?.demographicQuestions?.questions || [],
                ),
              },
            });
          }
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }

    // get chainer keywords from YoshiGraph API
    // commonAPI.getChainerKeywords('Python Developer').then((data) => {
    // })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userReducer, edit]);

  useEffect(() => {
    if (!edit) {
      // fetch reference_number  from API
      commonAPI
        .getReferenceNumber()
        .then((res) => {
          if (res?.data?.statusCode === 200)
            setPositionData((items) => ({
              ...items,
              reference_number: res?.data?.results?.reference_number,
            }));
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
          history.push('/recruiter/job/manage');
        });
      setAdvanceData((items) => ({
        ...items,
        languages: [{ uuid: getUniqueID(), score: null, id: getUniqueID() }],
      }));
    }
  }, [history, t, edit]);

  // Fetching Data from API || local storage for Advanced form
  const [is2ndTabDoneFetching, setIs2ndTabDoneFetching] = useState(false);
  useEffect(() => {
    if (activeStep !== 1 || is2ndTabDoneFetching) return;

    // Fetch Evaluations data from API

    if (
      getIsAllowedPermissionV2({
        permissions,
        permissionId: EvaluationsPermissions.ViewEvaluationForms.key,
      })
    )
      commonAPI.getEvaluations().then((res) => {
        if (res?.data?.statusCode === 200) setEvaluations(res?.data?.results);
      });
    else setEvaluations([]);

    // Fetch Profile Builders data from API
    commonAPI
      .getProfileBuildersList(
        chooseJobData?.pipeline_uuid?.uuid || chooseJobData?.pipeline_uuid,
      )
      .then((data) => {
        if (data?.data?.statusCode === 200) setProfileBuilders(data?.data?.results);
      });

    // Fetch Categories data from API
    commonAPI.getCategories().then((res) => {
      if (res?.data?.statusCode === 200) {
        setCategories(res?.data?.results);
        if (res?.data?.results?.length) {
          const defaultVal = res?.data?.results?.filter(
            (element) => element?.is_default,
          );
          setAdvanceData((items) => ({
            ...items,
            category_uuid:
              items.category_uuid
              || (defaultVal?.length > 0 && defaultVal?.[0].uuid),
          }));
        }
      }
    });
    setIs2ndTabDoneFetching(true);
  }, [
    activeStep,
    chooseJobData.pipeline_uuid?.uuid,
    is2ndTabDoneFetching,
    permissions,
  ]);

  // Handle stepper to move between forms
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return (
        <PositionForm
          form={positionData}
          setForm={setPositionData}
          template={chooseJobData.template_uuid}
          activeField={activeField}
          setActiveField={setActiveField}
        />
      );
    case 1:
      return (
        <AdvancedForm
          job
          form={advanceData}
          setForm={setAdvanceData}
          helpers={[evaluations, categories, profileBuilders]}
          template={chooseJobData.template_uuid}
          activeField={activeField}
          setActiveField={setActiveField}
        />
      );
    case 2:
      return (
        <EvaluateForm
          edit={edit}
          form={evaluateData}
          setForm={setEvaluateData}
          jobRequisitionUUID={
            jobRequisitionUUID || evaluateData?.job_requisition_uuid
          }
        />
      );
    case isConnectedToIndeed ? 3 : -1:
      return (
        <IndeedQuestionsForm form={indeedQuestions} setForm={setIndeedQuestions} />
      );
    case isConnectedToIndeed ? 4 : 3:
      return <PromoteForm form={form} setForm={setForm} />;
    case isConnectedToIndeed ? 5 : 4:
      return (
        <InviteTeamForm
          form={teamData}
          setForm={setTeamData}
          jobRequisitionUUID={
            jobRequisitionUUID || evaluateData?.job_requisition_uuid
          }
          edit={edit}
        />
      );
    case isConnectedToIndeed ? 6 : 5:
      return <PublishForm form={publishData} setForm={setPublishData} />;
    default:
      return null;
    }
  };

  const closeDialog = () => setDialog(null);

  // render choose job template once the create job is clicked
  useEffect(() => {
    if (!edit)
      setDialog(
        <ChooseJobTemplate
          form={[positionData, advanceData, form, teamData, publishData]}
          setForm={[
            setPositionData,
            setAdvanceData,
            setForm,
            setTeamData,
            setPublishData,
          ]}
          setPortalFlag={setPortalFlag}
          gpaDescription={gpaDescription}
          modalTitle={modalTitle}
          data={chooseJobData}
          setData={setChooseJobData}
          isOpen
          onClose={() => {
            closeDialog();
            setPortalFlag(true);
            /** Comment out for test */
            history.push('/recruiter/job/manage');
          }}
          onSave={() => {
            setDialog(null);
            setActiveStep(0);
          }}
          position_title_uuid={positionTitleUUID}
          setTranslations={setTranslations}
        />,
      );
  }, [positionTitleUUID]);

  /**
   * Handler to go to the next step in the proces
   */
  const handleNext = () => {
    const validations = [];
    if (!positionData?.title)
      validations.push(t(`${translationPath}job-title-is-required`));

    if (!positionData?.reference_number && portalFlag)
      validations.push(t(`${translationPath}reference-number-is-required`));

    if (!positionData?.industry_uuid && portalFlag)
      validations.push(t(`${translationPath}industry-is-required`));

    if (!positionData?.type_uuid && portalFlag)
      validations.push(t(`${translationPath}job-type-is-required`));

    if (activeStep === 1 && !advanceData.profile_builder_uuid)
      validations.push(t(`${translationPath}profile-builder-is-required`));

    if (activeStep === 1 && !advanceData.category_uuid)
      validations.push(t(`${translationPath}category-is-required`));

    if (activeStep === 1 && !advanceData.city && portalFlag)
      validations.push(t(`${translationPath}city-is-required`));

    if (
      activeStep === 2
      && evaluateData?.score_card_uuid?.min_committee_members
      && evaluateData?.score_card_uuid?.min_committee_members
        > evaluateData?.committee_members.length
    )
      validations.push(
        `${t(`${translationPath}min-committee-members`)} (${
          evaluateData.score_card_uuid?.min_committee_members
        })`,
      );
    if (
      activeStep === 2
      && evaluateData?.score_card_uuid?.uuid
      && !evaluateData?.decision_makers.length
    )
      validations.push(t(`${translationPath}please-select-decision-maker`));
    if (
      isConnectedToIndeed
      && activeStep === 3
      && Object.keys(errors || {}).length > 0
    )
      validations.push(t(`${translationPath}please-fill-all-questions-data`));
    if (
      ((isConnectedToIndeed && activeStep === 5)
        || (!isConnectedToIndeed && activeStep === 4))
      && (!teamData.recruiter || teamData?.recruiter?.length === 0)
    )
      validations.push(
        t(
          `${t('Shared:please-select-at-least')} ${1} ${t(
            `${translationPath}recruiter`,
          )}`,
        ),
      );
    if (validations.length) {
      addToast(
        <ul className="m-0">
          {validations.map((e) => (
            <li key={`validationKey${e}`}>{e}</li>
          ))}
        </ul>,
        {
          appearance: 'error',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        },
      );
      return;
    }
    switch (activeStep) {
    case 0: {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }
    case 1: {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }
    default:
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  /**
   * Handler to go back a step
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**
   * Handler to reset to the first step
   */
  const handleReset = () => {
    setActiveStep(0);
  };

  const mutatedIndeedQuestions = useMemo(
    () => (key) =>
      (indeedQuestions?.[key].questions || []).map((item) => ({
        required: item.is_required,
        type: item.type,
        id: item.uuid,
        question: item.title,
        ...((item.type === IndeedQuestionsTypesEnum.select.key
          || item.type === IndeedQuestionsTypesEnum.multiselect.key) && {
          options: (item?.answers || []).map((el) => ({
            value: el.value,
            label: el?.title || '',
          })),
        }),
      })),
    [indeedQuestions],
  );
  const handleSubmit = async (params) => {
    if (publishData?.is_schedule && !publishData?.fromDate && !publishData?.toDate) {
      addToast('Schedule date is requried!', {
        appearance: 'error',
        autoDismissTimeout: 7000,
        autoDismiss: true,
      });
      return;
    }
    setIsSaving(true);
    setIsWorking(true);
    // DECLARE OBJECT => hold all data from create job forms to send it for CREATE job API
    /**
     *
     * @type {{
     *  job_requisition_uuid: string,
     *  questionnaire_uuid: (*|string),
     *  gender: (string|null),
     *  city: (*|null),
     *  description: (*|null),
     *  years_of_experience: (*|*[]),
     *  evaluation_uuid: (string|null),
     *  country_uuid: (*|string),
     *  teams_invite: ([]|*[]),
     *  title: *,
     *  industry_uuid: (*|*[]),
     *  language_proficiency: (*|*[]),
     *  skills: (*|*[]),
     *  willing_to_travel: (boolean|number),
     *  owns_a_car: (boolean),
     *  pipeline_uuid: (*|null),
     *  visa_sponsorship: (boolean),
     *  to_date: string,
     *  is_externally: boolean,
     *  type_uuid: (*|*[]),
     *  career_level_uuid: (*|*[]),
     *  min_salary: (number),
     *  gpa: (number),
     *  is_schedule: boolean,
     *  departments: [],
     *  deadline: (string|null),
     *  profile_builder_uuid: (*|string|null),
     *  willing_to_relocate: (boolean|number),
     *  requirements: (*|null),
     *  address: (*|null),
     *  from_date: string,
     *  template_uuid: (*|null),
     *  is_internally: boolean,
     *  reference_number: (string|string),
     *  is_feature: boolean,
     *  language_uuid: *,
     *  max_salary: (number),
     *  degree_type: (*|*[]),
     *  nationality_uuid: (*[]|*[]),
     *  major_uuid: (*[]|*[]),
     *  advertise: {free_job_board: boolean, providers: []}
     *  }}
     */
    // Validation on Languages Proficiency
    const languagesProficiency = advanceData?.languages?.filter(
      (e) => e.uuid !== null && e.score !== null,
    );

    let newAddress = '';

    if (advanceData && advanceData.address)
      newAddress = advanceData.address.split(',');
    const createJobData = {
      job_requisition_uuid: jobRequisitionUUID,
      departments: [],
      is_feature: form?.featureJobPost || false,
      // feature_job_post: form?.featureJobPost || false,
      language_uuid: user?.language[0].id,
      advertise: {
        providers: form.premiums || [],
        free_job_board: form.freeJobBoard || false,
      },

      // Dialog Data
      is_externally: chooseJobData.isExternal || false,
      is_internally: chooseJobData.isInternal || false,
      // If user closed the entry modal => the default pipeline will be assigned instead of null
      pipeline_uuid:
        chooseJobData.pipeline_uuid?.uuid || chooseJobData.pipeline_uuid,
      template_uuid: chooseJobData.template_uuid?.uuid || null,

      // Position Data
      title: positionData?.title,
      reference_number: positionData?.reference_number,
      department_uuid:positionData?.department_id,
      type_uuid:
        positionData?.type_uuid && positionData?.type_uuid?.uuid
          ? [positionData?.type_uuid?.uuid]
          : [] || [],
      years_of_experience:
        positionData?.years_of_experience && positionData?.years_of_experience?.id
          ? [positionData?.years_of_experience.id]
          : [] || [],
      industry_uuid:
        positionData?.industry_uuid && positionData?.industry_uuid?.uuid
          ? [positionData?.industry_uuid?.uuid]
          : [] || [],
      degree_type:
        positionData?.degree_type && positionData?.degree_type.uuid
          ? [positionData?.degree_type.uuid]
          : [] || [],
      career_level_uuid:
        positionData?.career_level_uuid && positionData?.career_level_uuid?.uuid
          ? [positionData?.career_level_uuid?.uuid]
          : [] || [],
      major_uuid: positionData?.major_uuid?.map((a) => a) || [],
      skills: positionData?.skills || [],

      // Advanced Data
      nationality_uuid: advanceData?.nationality_uuid || [],
      country_uuid:
        advanceData?.country_uuid && advanceData?.country_uuid?.uuid
          ? advanceData?.country_uuid?.uuid
          : null,
      address: advanceData?.address || null,
      location_uuid: advanceData?.location_uuid,
      city: advanceData?.city || null,
      gender: advanceData?.gender?.uuid || '',
      willing_to_travel: advanceData?.willing_to_travel || false,
      willing_to_relocate: advanceData?.willing_to_relocate || false,
      owns_a_car: advanceData?.owns_a_car || false,
      visa_sponsorship: advanceData?.visa_sponsorship || false,
      min_salary: advanceData?.min_salary || 0,
      max_salary: advanceData?.max_salary || 0,
      gpa: advanceData?.gpa ? advanceData?.gpa.id : 0,
      description: advanceData?.description || null,
      requirements: advanceData?.requirements || null,
      language_proficiency: languagesProficiency?.length
        ? languagesProficiency?.map((l) => ({ uuid: l.uuid, score: l.score }))
        : [],
      evaluation_uuid: advanceData?.evaluation_uuid || null,
      profile_builder_uuid:
        advanceData?.profile_builder_uuid
        && (typeof advanceData?.profile_builder_uuid === 'string'
          ? advanceData?.profile_builder_uuid
          : advanceData?.profile_builder_uuid.uuid),
      category_uuid: advanceData?.category_uuid,
      // Team Data
      teams_invite: teamData?.teams?.map((a) => a?.value) || [],
      job_poster: teamData?.job_poster?.[0]?.value || null,
      job_recruiter: teamData?.job_recruiter?.[0]?.value || null,
      onboarding_teams: {
        recruiter: teamData?.recruiter?.map((a) => a?.value) || [],
        hiring_manager: teamData?.hiring_manager?.map((a) => a?.value) || [],
        hod: teamData?.hod?.map((a) => a?.value) || [],
        onboarding_team: teamData?.onboarding_team?.map((a) => a?.value) || [],
        other_team: teamData?.other_team?.map((a) => a?.value) || [],
      },
      // Publish Data
      is_schedule: publishData?.is_schedule,
      from_date: `${moment(publishData?.fromDate || Date.now())
        .locale('en')
        .format('YYYY-MM-DD')} ${moment(publishData?.time || Date.now())
        .locale('en')
        .format('HH:mm')}`,
      to_date: `${moment(publishData?.toDate || Date.now())
        .locale('en')
        .format('YYYY-MM-DD')} ${moment(publishData?.time || Date.now())
        .locale('en')
        .format('HH:mm')}`,
      lat: newAddress[0] || null,
      long: newAddress[1] || null,
      translations,
      is_published: isPublished,
      //   scorecard data
      decision_makers: evaluateData?.decision_makers?.map((a) => a?.value) || [],
      committee_members: evaluateData?.committee_members?.map((a) => a?.value) || [],
      score_card_uuid: evaluateData?.score_card_uuid?.uuid || '',
      has_reminder: evaluateData.has_reminder,
      period_type: evaluateData.period_type,
      period: evaluateData.period,
      hidden_columns: advanceData?.hidden_columns || [],
      indeed_questionnaire: {
        screenerQuestions: {
          questions: mutatedIndeedQuestions('screenerQuestions'),
        },
        demographicQuestions: {
          questions: mutatedIndeedQuestions('demographicQuestions'),
        },
      },
    };
    // if action is edit job => invoke updateJob from evarec API
    if (edit) {
      const id = {
        uuid: window.location.pathname.substring(
          window.location.pathname.lastIndexOf('/') + 1,
        ),
      };
      const body = { ...id, ...createJobData };
      evarecAPI
        .updateJob(body)
        .then((res) => {
          if (res.data?.results?.is_published) setJobUrl(res.data?.results?.job_url);
          setTime(res.data?.results?.created_at);
          setIsWorking(false);
          setIsPublishing(false);
          setIsSaving(false);
          setFinished(true);
        })
        .catch((error) => {
          setIsWorking(false);
          setIsPublishing(false);
          setIsSaving(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
      // Refactor create job function => using the function inside evarecAPI
    } else
      evarecAPI
        .createJob({ ...createJobData, ...params })
        .then((res) => {
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC - Job Posting Creation',
            'Job Posting Creation from EVA-REC',
            1,
            {},
          ]);
          VitallyTrack(' EVA-REC - Post Job');
          if (res.data?.results?.is_published) setJobUrl(res.data?.results?.job_url);
          setTime(res.data?.results?.created_at);
          setIsWorking(false);
          setIsPublishing(false);
          setIsSaving(false);
          setFinished(true);
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA REC - Post a new job',
            'Post a new job from EVA REC',
            1,
            {},
          ]);
        })
        .catch((error) => {
          setIsWorking(false);
          setIsPublishing(false);
          setIsSaving(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  };

  const saveTranslations = useCallback(
    (translations) => {
      setTranslations((items) => ({ ...items, ...translations }));
    },
    [setTranslations],
  );

  // this is to get the job requisition by id
  useEffect(() => {
    if (jobRequisitionUUID) getJobRequisitionById();
  }, [jobRequisitionUUID, getJobRequisitionById]);

  useEffect(() => {
    const localJobRequisitionUUID = query.get('uuid');
    const position_title_uuid = query.get('position_title_uuid');
    if (localJobRequisitionUUID) setJobRequisitionUUID(localJobRequisitionUUID);
    if (position_title_uuid) setPositionTitleUUID(position_title_uuid);
  }, [query]);

  /**
   * Render JSX
   */
  return (
    <div className="content-page ">
      <div className="content">
        <Container fluid>
          {dialog}
          <div
            className="content-page p-sm-5 p-1 pt-5 ml-auto mr-auto overflow-hidden create-assessment-content"
            style={{ background: 'inherit' }}
          >
            <div>
              {isFinished ? (
                <>
                  {action === 'create' && jobUrl && (
                    <Confetti
                      numberOfPieces={200}
                      recycle={false}
                      gravity={0.1}
                      tweenDuration={8000}
                    />
                  )}
                  <Congratulations
                    type={action}
                    link={jobUrl}
                    title={positionData?.title}
                    id={positionData?.reference_number}
                    user={user}
                    time={time}
                  />
                </>
              ) : (
                <div className={classes.root}>
                  <Stepper
                    alternativeLabel
                    activeStep={activeStep}
                    connector={<StepperConnector />}
                    className={classes.stepper}
                  >
                    {stepsMemo.map((label) => (
                      <Step key={`stepsKey${label}`} style={{ padding: 0 }}>
                        <StepperLabel
                          StepIconComponent={(items) => <StepperIcon {...items} />}
                        >
                          {t(`${translationPath}${label.toLocaleLowerCase()}`)}
                        </StepperLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === stepsMemo.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        {t(`${translationPath}all-steps-completed`)}
                      </Typography>
                      <Button onClick={handleReset}>
                        {t(`${translationPath}reset`)}
                      </Button>
                    </div>
                  ) : (
                    <>
                      {getStepContent(activeStep)}

                      <div
                        style={{
                          marginTop: 30,
                          textAlign: 'center',
                        }}
                      >
                        <Button
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          className="step-button back-button"
                        >
                          {t(`${translationPath}back`)}
                        </Button>
                        {activeStep === stepsMemo.length - 1 ? (
                          <>
                            <Button
                              color="primary"
                              className="step-button"
                              onClick={() =>
                                handleSubmit(!edit && { is_published: false })
                              }
                              disabled={isWorking || isPublishing}
                            >
                              {isWorking && (
                                <i className="fas fa-circle-notch fa-spin mr-2" />
                              )}
                              {`${
                                isWorking
                                  ? t(`${translationPath}saving`)
                                  : t(
                                    `${translationPath}${
                                      edit ? 'update' : 'create'
                                    }`,
                                  )
                              }`}
                            </Button>
                            {!edit && (
                              <Button
                                color="primary"
                                className="step-button"
                                onClick={() => {
                                  setIsPublishing(true);
                                  handleSubmit({ is_published: true });
                                }}
                                disabled={
                                  isWorking
                                  || isPublishing
                                  || !getIsAllowedPermissionV2({
                                    permissions,
                                    permissionId:
                                      ManageApplicationsPermissions
                                        .CreateAndPublishJob.key,
                                  })
                                }
                              >
                                {isPublishing && (
                                  <i className="fas fa-circle-notch fa-spin mr-2" />
                                )}
                                {`${
                                  isPublishing
                                    ? t(`${translationPath}saving`)
                                    : t(`${translationPath}create-and-publish`)
                                }`}
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            color="primary"
                            className="step-button"
                            onClick={handleNext}
                            disabled={isSaving}
                          >
                            {isSaving && (
                              <i className="fas fa-circle-notch fa-spin mr-2" />
                            )}
                            {`${
                              isSaving
                                ? t(`${translationPath}saving`)
                                : t(`${translationPath}next`)
                            }`}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      {!!activeField && (
        <TranslationsDialog
          isOpen={activeField}
          isOpenChanged={() => {
            if (activeField) setActiveField(null);
          }}
          activeField={activeField}
          saveTranslations={saveTranslations}
          translations={translations}
        />
      )}
    </div>
  );
};

export default CreateJob;
