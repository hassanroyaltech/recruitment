/**
 * ----------------------------------------------------------------------------------
 * @title CreateJobTemplate.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the CreateJobTemplate component which allow user to create job
 * template
 * ----------------------------------------------------------------------------------
 */
// import React components
import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

// import Material UI components
import { Step, Stepper, Typography } from '@mui/material';

// import Shared components
import SimpleHeader from 'components/Elevatus/TimelineHeader';

// Common API Service
import { commonAPI } from 'api/common';

import { getUniqueID } from 'shared/utils';

import { evarecAPI } from 'api/evarec';
import { useTranslation } from 'react-i18next';
import { StepperConnector, StepperIcon, StepperLabel } from '../Stepper';

// import forms components
import PositionForm from '../create/forms/PositionForm';
import AdvancedForm from '../create/forms/AdvancedForm';
import { useTitle } from '../../../hooks';
import { showError, showSuccess } from '../../../helpers';
import { makeStyles } from '@mui/styles';
import i18next from 'i18next';
import { ChatGPTJobDetailsDialog } from '../../evassess/templates/dialogs/ChatGPTJobDetails.Dialog';
import { GPTAutoFillJobPost } from '../../../services';

const translationPath = '';
const parentTranslationPath = 'EvaRecTemplate';

// import evarec API endpoints

const steps = ['position', 'advanced'];
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

/**
 * The main CreateJobTemplate component, this is rendered when we click
 * on 'Create an application' in the sidebar
 * @returns {JSX.Element}
 * @constructor
 */
const CreateJobTemplate = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const classes = useStyles();
  const history = useHistory();
  // determine the action => create job || update job
  // const [action, setAction] = useState('create');
  const [saving] = useState(false);
  const [dialog] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  // Declare states to hold forms data
  const [evaluations, setEvaluations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openChatGPTDialog, setOpenChatGPTDialog] = useState(false);
  const [gptDetails, setGPTDetails] = useState({
    job_title: '',
    year_of_experience: '',
    language: i18next.language,
    is_with_description: false,
    is_with_requirements: false,
    is_with_skills: false,
  });
  const gpaDescription = [
    { id: 90, title: 'Excellent' },
    { id: 80, title: 'Very Good' },
    { id: 70, title: 'Good' },
    { id: 60, title: 'Pass' },
    { id: 50, title: 'Weak' },
  ];

  // Tabs States

  // Tab one position data form
  const [positionData, setPositionData] = useState({});
  // Tab two advance data form with default value for gender
  const [advanceData, setAdvanceData] = useState({
    gender: '',
    min_salary: 0,
    hidden_columns: [],
  });

  useEffect(() => {
    /*
    if the action is edit template => Split the UUID from the URL then invoke view template function
    from evarec API => fill out the forms with response data
    */

    if (props.edit) {
      const url = window.location.pathname;
      const uuid = url.substring(url.lastIndexOf('/') + 1);

      evarecAPI
        .viewJobTemplate(uuid)
        .then((response) => {
          if (response.data.statusCode === 200) {
            const templateData = response.data.results;
            props.setTranslations(templateData?.translations);

            const gpa = gpaDescription.filter((ele) => ele.id === templateData.gpa);
            const experience = {
              id: templateData.years_of_experience[0]
                ? `${templateData.years_of_experience[0]}`
                : null,
              title: templateData.years_of_experience[0]
                ? `${templateData.years_of_experience[0]}`
                : null,
            };
            setPositionData((items) => ({
              ...items,
              title: templateData.title,
              // reference_number: data.results.reference_number,
              department_id:templateData?.department?.uuid,
              major_uuid: templateData.major_uuid?.map((a) => a.uuid) || [],
              type_uuid: templateData.type_uuid[0],
              career_level_uuid: templateData.career_level_uuid[0],
              years_of_experience: experience,
              industry_uuid: templateData.industry_uuid[0],
              degree_type: templateData.degree_type[0],
              deadline: templateData.deadline,
              questionnaire_uuid: templateData.questionnaire_uuid,
              skills: templateData.skills,
              position_title_uuid: templateData.position_title?.uuid, //check later
              review_date: templateData.review_date,
              expiry_date: templateData.expiry_date,
              note: templateData.note,
            }));
            setAdvanceData({
              nationality_uuid: templateData.nationality_uuid?.map((a) => a.uuid),
              country_uuid: templateData.country_uuid,
              city: templateData.city,
              gender: templateData.gender || '',
              gpa: gpa[0],
              min_salary: templateData.min_salary,
              max_salary: templateData.max_salary,
              visa_sponsorship: templateData.visa_sponsorship,
              willing_to_travel: templateData.willing_to_travel,
              willing_to_relocate: templateData.willing_to_relocate,
              owns_a_car: templateData.owns_a_car,
              languages: templateData.language_proficiency?.length
                ? templateData.language_proficiency
                : [{ uuid: getUniqueID(), score: null, id: getUniqueID() }],
              description: templateData.description,
              requirements: templateData.requirements,
              evaluation_uuid: templateData.evaluation_uuid,
              lat: templateData.lat || '',
              long: templateData.long || '',
              address:
                templateData.lat || templateData.long
                  ? `${templateData.lat}, ${templateData.long}`
                  : '',
              location_uuid: templateData?.location_uuid,
              hidden_columns: templateData?.hidden_columns || [],
            });
          }
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }
    // fetch reference_number from API
    // commonAPI.getReferenceNumber().then((response) => {
    //   if (response.data.statusCode === 200)
    //     setPositionData((positionData) => ({
    //       ...positionData,
    //       reference_number: response.data.results.reference_number,
    //     }));
    // });
  }, [t]);

  // Fetching Data from API || local storage for Advanced form
  const [is2ndTabDoneFetching] = useState(false);
  useEffect(() => {
    if (activeStep !== 1 || is2ndTabDoneFetching) return;
    if (!props.edit)
      setAdvanceData((items) => ({
        ...items,
        languages: advanceData.languages?.length
          ? advanceData.languages
          : [
            {
              uuid: getUniqueID(),
              score: null,
              id: getUniqueID(),
            },
          ],
      }));

    // Fetch Evaluations data from API
    commonAPI.getEvaluations().then((response) => {
      if (response.data.statusCode === 200) setEvaluations(response.data.results);
    });
  }, [activeStep]);
  const handleSelectLang = useCallback((lang) => {
    setGPTDetails((items) => ({ ...items, language: lang }));
  }, []);

  const handleGPTGenerateSkills = () => {
    if (gptDetails.job_title || positionData?.title)
      gptAutoFillJobPost({
        is_with_skills: true,
        job_title: gptDetails.job_title || positionData?.title || '',
        language: gptDetails?.language || 'en',
        job_type: gptDetails.job_type || positionData?.type_uuid || null,
        year_of_experience:
          gptDetails.year_of_experience
          || positionData?.years_of_experience?.id
          || null,
      });
    else {
      setGPTDetails((items) => ({
        ...items,
        is_with_skills: true,
        is_with_requirements: false,
        is_with_description: false,
        job_title: items.job_title || positionData?.title || '',
        job_type: items.job_type || positionData?.type_uuid || null,
        year_of_experience:
          items.year_of_experience || positionData?.years_of_experience?.id || null,
      }));
      setOpenChatGPTDialog(true);
    }
  };

  // Handle stepper to move between forms
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return (
        <PositionForm
          form={positionData}
          setForm={setPositionData}
          showPositionTitle
          activeField={props.activeField}
          setActiveField={props.setActiveField}
          gptDetails={gptDetails}
          isLoadingParent={isLoading}
          handleSelectLang={handleSelectLang}
          handleOpenGPTDialog={handleOpenGPTDialog}
          handleGPTGenerateSkills={handleGPTGenerateSkills}
          isTemplate
        />
      );
    case 1:
      return (
        <AdvancedForm
          form={advanceData}
          isEdit={props.edit}
          setForm={setAdvanceData}
          helpers={[evaluations]}
          activeField={props.activeField}
          setActiveField={props.setActiveField}
          gptDetails={{
            ...gptDetails,
            job_title: gptDetails.job_title || positionData?.title || '',
            year_of_experience:
                gptDetails.year_of_experience
                || positionData?.years_of_experience?.id
                || null,
          }}
          isTemplate
        />
      );
    default:
      return null;
    }
  };

  /**
   * Handler to go to the next step in the proces
   */
  const handleNext = () => {
    const validations = [];
    if (!positionData?.title)
      validations.push(t(`${translationPath}job-title-is-required`));
    if (!positionData?.expiry_date)
      validations.push(t(`${translationPath}expiry-date-is-required`));

    if (validations?.length) {
      validations.map((err) => showError(err));
      return;
    }
    switch (activeStep) {
    case 0: {
      return setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    case 1: {
      return setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    default:
      return setActiveStep((prevActiveStep) => prevActiveStep + 1);
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

  const handleSubmit = async () => {
    setIsWorking(true);
    // Validation on Languages Proficiency
    const languagesProficiency = advanceData.languages?.filter(
      (e) => e.uuid !== null && e.score !== null,
    );

    const evaluation_uuid
      = advanceData?.evaluation_uuid && advanceData?.evaluation_uuid?.uuid
        ? advanceData?.evaluation_uuid?.uuid
        : advanceData?.evaluation_uuid;

    let newAddress = '';

    if (advanceData && advanceData.address)
      newAddress = advanceData.address.split(',');
    const createJobTemplateData = {
      language_uuid: user?.language[0].id,

      // Position Data
      title: positionData.title,
      expiry_date: positionData.expiry_date,
      note: positionData.note,
      // reference_number: positionData.reference_number,
      type_uuid: positionData.type_uuid ? [positionData.type_uuid.uuid] : [] || [],
      years_of_experience: positionData.years_of_experience?.id
        ? [positionData.years_of_experience.id]
        : [] || [],
      industry_uuid: positionData.industry_uuid
        ? [positionData.industry_uuid.uuid]
        : [] || [],
      degree_type: positionData.degree_type
        ? [positionData.degree_type.uuid]
        : [] || [],
      career_level_uuid: positionData.career_level_uuid
        ? [positionData.career_level_uuid.uuid]
        : [] || [],
      major_uuid: positionData.major_uuid || [],
      skills: positionData.skills || [],
      position_title_uuid: positionData.position_title_uuid,
      department_uuid:positionData.department_id,

      // Advanced Data
      nationality_uuid: advanceData.nationality_uuid || [],
      country_uuid: advanceData.country_uuid
        ? advanceData.country_uuid.uuid
        : ' ' || ' ',
      address: advanceData.address || null,
      location_uuid: advanceData?.location_uuid,
      lat: newAddress[0] || null,
      long: newAddress[1] || null,
      city: advanceData.city || null,
      gender: advanceData?.gender?.uuid || '',
      willing_to_travel: advanceData.willing_to_travel || false,
      willing_to_relocate: advanceData.willing_to_relocate || false,
      owns_a_car: advanceData.owns_a_car || false,
      visa_sponsorship: advanceData.visa_sponsorship || false,
      min_salary: advanceData.min_salary || 0,
      max_salary: advanceData.max_salary || 0,
      gpa: advanceData.gpa ? advanceData.gpa.id : 0,
      description: advanceData.description || null,
      requirements: advanceData.requirements || null,
      language_proficiency: languagesProficiency?.length
        ? languagesProficiency?.map((l) => ({ uuid: l.uuid, score: l.score }))
        : [],
      evaluation_uuid,
      translations: props.translations,
      review_date: positionData.review_date,
      hidden_columns: advanceData?.hidden_columns || [],
    };
    /**
     * If action is Edit invoke updateJobTemplate API
     * @param {body}
     */
    if (props.edit) {
      const id = {
        uuid: window.location.pathname.substring(
          window.location.pathname.lastIndexOf('/') + 1,
        ),
      };
      // Concat Forms data with uuid
      const body = { ...id, ...createJobTemplateData };
      evarecAPI
        .updateJobTemplate(body)
        .then((res) => {
          setIsWorking(false);
          showSuccess(t(`${translationPath}job-template-updated-successfully`));
          setTimeout(() => {
            history.push('/recruiter/job/templates');
          }, 1000);
        })
        .catch((error) => {
          setIsWorking(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    } else
    /**
     * If action is Create invoke createJobTemplate API
     * @param {createJobTemplateData}
     */
      evarecAPI
        .createJobTemplate(createJobTemplateData)
        .then((res) => {
          setIsWorking(false);
          showSuccess(t(`${translationPath}job-template-created-successfully`));
          window?.ChurnZero?.push([
            'trackEvent',
            'Create a new job template',
            'Create a new job template from EVA REC',
            1,
            {},
          ]);
          setTimeout(() => {
            history.push('/recruiter/job/templates');
          }, 1000);
        })
        .catch((error) => {
          setIsWorking(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  };

  useTitle(
    props.edit
      ? t(`${translationPath}edit-job-template`)
      : t(`${translationPath}create-job-template`),
  );

  const reshapeAutoFillBody = useCallback((val) => {
    const { is_with_description, is_with_requirements, is_with_skills } = val;
    if (!(is_with_description || is_with_requirements || is_with_skills))
      return false;
    let body = {
      language: val.language || 'en',
      post_fields: {
        available_data: {
          job_title: val?.job_title,
          ...((val?.year_of_experience || val?.year_of_experience === 0) && {
            experience: `${val?.year_of_experience} years`,
          }),
          ...(val?.job_type && {
            job_type: val?.job_type.name[i18next.language] || val?.job_type.name.en,
          }),
          language: val.language,
        },
        missing_data: {
          ...(is_with_skills && { skills: [] }),
          ...(is_with_description && { description: '' }),
          ...(is_with_requirements && { requirements: '' }),
        },
      },
    };
    return body;
  }, []);

  const gptAutoFillJobPost = useCallback(
    async (val, canRegenerate = true) => {
      const body = reshapeAutoFillBody(val);
      handleCloseGPTDialog();
      if (!body) return;
      try {
        setIsLoading(true);
        const res = await GPTAutoFillJobPost(body);
        setIsLoading(false);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptAutoFillJobPost(val, false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          const missingKeys = Object.keys(body?.post_fields?.missing_data || {});
          if (missingKeys.includes('skills') && results?.skills?.length > 0)
            setPositionData((items) => ({ ...items, skills: results.skills }));
          if (
            missingKeys.includes('description')
            || missingKeys.includes('requirements')
          )
            setAdvanceData((items) => ({
              ...items,
              ...(missingKeys.includes('description')
                && results?.description?.length > 0 && {
                description: (results?.description || []).join('<br/>'),
              }),
              ...(missingKeys.includes('requirements')
                && results?.requirements?.length > 0 && {
                requirements: (results?.requirements || []).join('<br/>'),
              }),
            }));
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [reshapeAutoFillBody, t],
  );
  const handleOpenGPTDialog = () => {
    setGPTDetails((items) => ({
      ...items,
      is_with_skills: false,
      is_with_requirements: false,
      is_with_description: false,
      job_title: items.job_title || positionData?.title || '',
      job_type: items.job_type || positionData?.type_uuid || null,
      year_of_experience:
        items.year_of_experience || positionData?.years_of_experience?.id || null,
    }));
    setOpenChatGPTDialog(true);
  };
  const handleCloseGPTDialog = () => {
    setOpenChatGPTDialog(false);
    setGPTDetails((items) => ({ ...items, callBack: null }));
  };

  const handleAutoFillThroughGPT = useCallback(
    (val) => {
      setGPTDetails((items) => ({ ...items, ...val, callBack: null }));
      gptAutoFillJobPost(val);
    },
    [gptAutoFillJobPost],
  );

  /**
   * @returns {JSX Element}
   */
  return (
    <>
      <SimpleHeader
        name={
          props.edit
            ? t(`${translationPath}edit-job-template`)
            : t(`${translationPath}create-job-template`)
        }
        parentName={t(`${translationPath}eva-rec`)}
      />
      <div className="content-page ">
        <div className="content">
          <Container fluid>
            {dialog}
            <div
              className="content-page mt--7 p-sm-5 p-1 pt-5 ml-auto mr-auto overflow-hidden create-assessment-content"
              style={{ background: 'inherit' }}
            >
              <div>
                <div className={classes.root}>
                  <Stepper
                    alternativeLabel
                    activeStep={activeStep}
                    connector={<StepperConnector />}
                    className={classes.stepper}
                  >
                    {steps.map((label, index) => (
                      <Step key={`recStepsKeys${index + 1}`} style={{ padding: 0 }}>
                        <StepperLabel
                          StepIconComponent={(props) => <StepperIcon {...props} />}
                        >
                          {t(`${translationPath}${label}`)}
                        </StepperLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === steps.length ? (
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
                        {activeStep === steps.length - 1 ? (
                          <Button
                            color="primary"
                            className="step-button"
                            onClick={handleSubmit}
                            disabled={isWorking}
                          >
                            {isWorking && (
                              <i className="fas fa-circle-notch fa-spin mr-2" />
                            )}
                            {`${
                              isWorking
                                ? t(`${translationPath}saving`)
                                : t(`${translationPath}finish`)
                            }`}
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            className="step-button"
                            onClick={handleNext}
                            disabled={saving}
                          >
                            {saving && (
                              <i className="fas fa-circle-notch fa-spin mr-2" />
                            )}
                            {`${
                              saving
                                ? t(`${translationPath}saving`)
                                : activeStep === 0
                                  ? t(`${translationPath}next`)
                                  : activeStep === steps.length - 2
                                    ? t(`${translationPath}publish`)
                                    : t(`${translationPath}next`)
                            }`}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      {openChatGPTDialog && (
        <ChatGPTJobDetailsDialog
          isOpen={openChatGPTDialog}
          state={gptDetails}
          setState={setGPTDetails}
          onClose={() => {
            handleCloseGPTDialog();
          }}
          onSave={(val) => {
            handleAutoFillThroughGPT(val);
          }}
          isLoading={isLoading}
          isWithlanguage
          isJobTitleRequired
          isForJobTemplate
          isWithJobType
        />
      )}
    </>
  );
};

export default CreateJobTemplate;
