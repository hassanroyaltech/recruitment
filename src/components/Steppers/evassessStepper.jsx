/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title evassessStepper.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the EvassessStepper component which enables us to create and
 * edit video assessments and their templates.
 * ----------------------------------------------------------------------------------
 */
import React, { useEffect, useCallback } from 'react';
import { evassessAPI } from '../../api/evassess';
import { commonAPI } from '../../api/common';
// import ChooseAssessmentType from 'pages/evassess/create/ChooseAssessmentType';
import BasicInfo from '../../pages/evassess/create/BasicInfo';
import Questionnaire from '../../pages/evassess/create/Questionnaire';
import InviteTeam from '../../pages/evassess/create/InviteTeam';
import InviteCandidate from '../../pages/evassess/create/InviteCandidate';
// React and reactstrap
import { makeStyles, withStyles } from '@mui/styles';
import Congratulations from '../../components/Elevatus/Congratulations';
import { preferencesAPI } from '../../api/preferences';
// Stepper components from MUI
import {
  Step,
  StepConnector,
  StepIcon,
  StepLabel,
  Stepper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ButtonBase,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { GlobalHistory, showError } from '../../helpers';
import useVitally from '../../hooks/useVitally.Hook';

// Define a makeStyles hook
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
    width: '125%',
    position: 'relative',
    left: '-12.5%',
    padding: 0,
  },
}));

/** Stepper connector component */
const StepperConnector = withStyles(() => ({
  alternativeLabel: {
    top: 6,
    marginLeft: -14,
    marginRight: -14,
  },

  active: {
    '& $line': {
      borderTop: '2px solid var(--bc-primary, #051274)',
    },
  },

  completed: {
    '& $line': {
      borderTop: '2px solid var(--bc-primary, #051274)',
    },
  },

  line: {
    height: 2,
    border: 0,
    borderTop: '2px dashed #E9ECEF',
    borderRadius: 0.5,
    // backgroundColor: theme.colors.primary.borderGrey,
  },
}))(StepConnector);

/** Stepper icon component */
const StepperIcon = withStyles(() => ({
  root: {
    width: 12,
    height: 12,
    background: '#E2E2E2',
    fillOpacity: 0,
    borderRadius: 99999,
  },

  active: {
    // background: brandPurple,
    background: 'var(--bg-primary, #051274)',
    // color: "#4A90E2",
  },

  completed: {
    // background: brandPurple,
    background: 'var(--bg-primary, #051274)',
    // color: "#4A90E2",
  },
}))(StepIcon);

/** Stepper label component */
const StepperLabel = withStyles(() => ({
  alternativeLabel: {
    padding: 0,
    color: '#899298',
    height: 12,
  },

  label: {
    fontSize: '1rem',
    marginTop: 0,
    position: 'relative',
    left: '50%',
    top: -60,
    color: '#899298 !important',
    fontFamily: 'Ubuntu, Open Sans, sans-serif',
  },

  active: {
    // "& $label": {
    // color: `${brandPurple} !important`,
    color: 'var(--c-primary, #051274) !important',
    fontWeight: 500,
    // },
  },

  completed: {
    // color: `${brandPurple} !important`,
    color: 'var(--c-primary, #051274) !important',
    fontWeight: 500,
  },
}))(StepLabel);

/**
 * This function component renders content below the stepper for the
 * video assessment
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'EvaSSESSStepperComponent.';
const EvassessStepper = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const classes = useStyles();
  const [state, setState] = React.useState('');
  const [errors, setErrors] = React.useState([]);
  const [videoAssessmentCreated, setVAC] = React.useState(false);
  const [videoAssessmentEdited, setVAE] = React.useState(false);
  const [linkVA, setLinkVA] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openEmailErr] = React.useState(false);
  // const [dialog, setDialog] = React.useState(null);
  /**
   * Step One - Basic Information
   * Related constants and states
   * Index 0
   */
  const [assessmentTitle, setAssessmentTitle] = React.useState();
  const [type, setType] = React.useState('1');
  const [pipeline, setPipeline] = React.useState('Please select a pipeline');
  const [language, setLanguage] = React.useState('');
  const [pipelineList, setPipelineList] = React.useState([]);
  const [evaluation, setEvaluation] = React.useState(null);
  const [evaluationList, setEvaluationList] = React.useState([]);
  const [templateList, setTemplateList] = React.useState([]);
  const [video, setVideo] = React.useState('');
  const [candidatesFromCSV, setCandidatesFromCSV] = React.useState('');
  const [canEdit, setCanEdit] = React.useState(true);
  const { VitallyTrack } = useVitally();

  /**
   * Step Two - Questionnaire
   * Related constants and states
   * Index 1
   */
  const [questions, setQuestions] = React.useState([
    {
      title: '',
      model_answer: '',
      time_limit: '',
      number_of_retake: '',
      expected_keyword: [],
    },
  ]);

  /**
   * Step Three - Invite Team
   * Related constants and states
   * Index 2
   */
  const [teams, setTeams] = React.useState([]);

  /**
   * Step Four - Invite Applicants
   * Related constants and states
   * Index 3
   */
  const [candidates, setCandidates] = React.useState([
    {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
  ]);
  const [emailVariables, setEmailVariables] = React.useState([]);
  const [emailSubject, setEmailSubject] = React.useState('');
  const [emailBody, setEmailBody] = React.useState('');
  const [date, setDate] = React.useState('');
  const [privacy, setPrivacy] = React.useState('private');
  const [emailAttachments, setEmailAttachments] = React.useState([]);
  const [selectedTemplatUuid, setSelectedTemplatUuid] = React.useState('');

  /**
   * States for Edit Assessment
   */
  const [selectedCategory, setSelectedCategory] = React.useState({});
  const [selectedCSV_file, setSelectedCSV_file] = React.useState([]);
  const getAssessment = useCallback(() => {
    evassessAPI
      .getAssessment(props.uuid)
      .then((response) => {
        const { data } = response;

        // Set all state variables
        setAssessmentTitle(data.results.title);
        setSelectedCategory(data.results.category);
        setCanEdit(data.results.can_edit);
        setEmailBody(data.results.email_body);
        setEmailSubject(data.results.email_subject);
        setTeams(data.results.teams_invited);
        setDate(data.results.deadline);
        setPrivacy(data.results.is_public ? 'public' : 'private');
        setQuestions(data.results.questions);
        setType(data.results.type === 'Hidden' ? '0' : '1');
        setPipeline(data.results.pipeline.uuid);
        setLanguage(data.results.language.id);
        setEvaluation(data.results.evaluation?.uuid);
        setEmailAttachments(
          (data.results.attachment
            && data.results.attachment.map((item) => item.original))
            || [],
        );
        setSelectedTemplatUuid(data.results?.template_uuid || '');
        if (
          data.results
          && data.results.introduction_video
          && data.results.introduction_video.original
        )
          setVideo(data.results.introduction_video.original);
        setSelectedCSV_file(
          data.results.csv_file?.original && [data.results.csv_file.original],
        );
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [props.uuid, t]);
  useEffect(() => {
    /**
     * Obtain the assessment we want to edit using the UUID passed in the props
     * Next we need to pass the resultant data into the Stepper component in order
     * to set all the different state (or properties) related to it and fill out the
     * fields.
     */
    if (props.editFlag === true) getAssessment();
  }, [getAssessment, props.editFlag]);

  useEffect(() => {
    // Not yet returned by API
    // setVideo(data.results.video);
    /**
     * Obtain video assessment categories
     * These can be:
     *  - Hiring
     *  - Sales Training
     *  - Medical Check
     *  - and others
     *
     *  This also sets the category onOpen based on the assessment data obtained
     *  in the previous function
     */
    if (props.editFlag === false)
      evassessAPI
        .getVideoAssessmentCategories()
        .then((res) => {
          if (res.data.results && res.data.results.length > 0)
            setSelectedCategory(res.data.results[0]);
          else {
            showError(t(`${translationPath}there-is-no-categories`));
            GlobalHistory.push('/recruiter/assessment/manage/list');
          }
          // setDialog(
          //   <ChooseAssessmentType
          //     modalTitle="edit-assessment"
          //     Categories={res.data.results}
          //     isOpen
          //     onClose={() => setDialog(null)}
          //     onSave={(c) => {
          //       setSelectedCategory(c);
          //     }}
          //     translationPath={translationPath}
          //     parentTranslationPath={props.parentTranslationPath}
          //     preSelected={selectedCategory}
          //   />,
          // );
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  }, [props.editFlag, props.parentTranslationPath, t]);
  /**
   * Step Names
   * @type {string[]}
   */
  const steps = [
    'basic-information',
    'questionnaire',
    'invite-team',
    'invite-candidate',
  ];

  /**
   * Remove a candidate from the array by index
   * @param index
   */
  const removeCandidate = (index) => {
    setCandidates((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  /**
   * Add a candidate to the array [set it as empty]
   */
  const addCandidate = () => {
    setCandidates((items) => {
      items.push({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
      });
      return [...items];
    });
  };

  /**
   * Switcher to move through the stepper
   * @param stepIndex
   * @returns {JSX.Element|string}
   */
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return (
        <BasicInfo
          canEdit={canEdit}
          assessmentTitle={assessmentTitle}
          setTitle={setAssessmentTitle}
          setType={setType}
          type={type}
          setLanguage={setLanguage}
          language={language}
          setPipeline={setPipeline}
          pipeline={pipeline}
          pipelineList={pipelineList}
          evaluation={evaluation}
          setEvaluation={setEvaluation}
          evaluationList={evaluationList}
          templateList={templateList}
          setSelectedTemplate={setSelectedTemplate}
          selectedTemplatUuid={selectedTemplatUuid}
          parentTranslationPath={props.parentTranslationPath}
          setVideo={setVideo}
          video={video}
          uuid={props.uuid}
        />
      );
    case 1:
      return (
        <Questionnaire
          canEdit={canEdit}
          handleq={handleq}
          // setQuestions={setQuestions}
          questions={questions}
          addQuestion={addQuestion}
          parentTranslationPath={props.parentTranslationPath}
          removeQuestion={removeQuestion}
        />
      );
    case 2:
      return (
        <InviteTeam
          setTeams={setTeams}
          teams={teams}
          parentTranslationPath={props.parentTranslationPath}
        />
      );
    case 3:
      return (
        <InviteCandidate
          setLanguage={setLanguage}
          language={language}
          setCandidates={handleCandidates}
          candidates={candidates}
          addCandidate={addCandidate}
          removeCandidate={removeCandidate}
          emailVariables={emailVariables}
          setEmailSubject={setEmailSubject}
          emailSubject={emailSubject}
          onEmailBodyChanged={(newValue) => setEmailBody(newValue)}
          emailBody={emailBody}
          setDate={setDate}
          setPrivacy={setPrivacy}
          privacy={privacy}
          date={date}
          setCandidatesFromCSV={setCandidatesFromCSV}
          candidatesFromCSV={candidatesFromCSV}
          emailAttachments={emailAttachments}
          parentTranslationPath={props.parentTranslationPath}
          onEmailAttachmentsChanged={(newAttachment) =>
            setEmailAttachments(newAttachment)
          }
          setSelectedCSV_file={setSelectedCSV_file}
          selectedCSV_file={selectedCSV_file}
          uuid={props.uuid}
        />
      );
    default:
      return 'Unknown stepIndex';
    }
  };

  /**
   *  This will retrieve the list of pipelines, evaluations and templates
   *  from their respective APIs during the Effect hook.
   */
  useEffect(() => {
    // Set the selected category
    setSelectedCategory(props.selectedCategory);
    preferencesAPI.getPipelineList().then((response) => {
      const { data } = response;
      if (data.statusCode === 200) {
        setPipeline(data.results[0].uuid);
        setLanguage(data.results[0].language_id);
        setPipelineList(data.results);
      }
    });
    commonAPI.getEvaluations().then((response) => {
      if (response.data.statusCode === 200) setEvaluationList(response.data.results);
    });
    evassessAPI.getTemplateList().then((response) => {
      if (response.data.statusCode === 200) setTemplateList(response.data.results);
    });
  }, [props.selectedCategory]);

  /**
   * Get the list of email annotations during the Effect hook
   */
  useEffect(() => {
    preferencesAPI
      .getEmailVariables()
      .then((res) => {
        setEmailVariables(
          res.data.results.video_assessment
            .concat(res.data.results.candidate)
            .concat(res.data.results.company),
        );
      })
      .catch(() => {
        // addToast("Error in getting variables", {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
      });
  }, []);

  /**
   * Get the list of templates
   * Added TRY/CATCH because the default value selected
   * Choose a Template does not have a uuid
   */
  const setSelectedTemplate = (uuid) => {
    try {
      // Tracing
      evassessAPI
        .getTemplate(uuid)
        .then((response) => {
          const { data } = response;
          if (data.statusCode === 200) {
            data.results.title
              ? setAssessmentTitle(data.results.title)
              : setAssessmentTitle('');
            data.results.type
              ? setType(data.results.type.value.toString())
              : setType('1');
            data.results.category
              ? setSelectedCategory(data.results.category)
              : setSelectedCategory(selectedCategory || {});
            data.results.video
              ? setVideo(data.results.video.original)
              : setVideo([]);

            if (data.results.evaluation) setEvaluation(data.results.evaluation);

            const newData = data.results.questions.map((question) => ({
              ...question,
              tagsinput: question.expected_keyword
                ? question.expected_keyword.map((keyword) => keyword.title)
                : [],
              expected_keyword: question.expected_keyword
                ? question.expected_keyword.map((keyword) => keyword.title)
                : [],
            }));
            setQuestions(newData);
          }
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
      setSelectedTemplatUuid(uuid);
    } catch (err) {
      setSelectedTemplatUuid(null);
    }
  };

  /**
   * Handler to set the questions array
   * @param value
   * @param name
   * @param i
   */
  const handleq = (value, name, i) => {
    const arr = questions;
    if (!arr[i]) arr[i] = {};

    arr[i][name] = value;
    setQuestions(arr);
  };

  /**
   * Handler to set the candidates array
   * @param newValues
   * @param i
   */
  const handleCandidates = (newValues, i) => {
    setCandidates((items) => {
      items[i] = newValues;
      return [...items];
    });
  };

  /**
   * Add a question to the array [set it as empty]
   */
  const addQuestion = () => {
    const arr = questions;
    arr[questions.length] = {
      title: '',
      model_answer: '',
      time_limit: '',
      number_of_retake: '',
    };
    setQuestions(arr);
  };

  /**
   * Remove a question from the array by index
   * @param index
   */
  const removeQuestion = (index) => {
    const arr = questions;
    arr.splice(index, 1);
    setQuestions(arr);
  };

  /**
   * Handler to open a dialog
   */
  const handleDialogOpen = () => {
    setOpen(true);
  };

  /**
   * Handler to close a dialog
   */
  const handleClose = () => {
    setOpen(false);
  };

  /**
   * This handles movement to the next step in the stepper
   * Some requirements are asserted in the first two steps [0, and 1]
   */
  const handleNext = () => {
    // Switch between steps
    switch (activeStep) {
    // If case 0 (Basic Information) step
    case 0: {
      if (!assessmentTitle || !type) return handleDialogOpen();

      return setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    // If case 1 (Questionnaire) step
    case 1: {
      let noError;
      // This will stop people from moving forward without valid questions
      if (!questions) return handleDialogOpen();

      let error = false;
      questions.map((item) => {
        if (
          !item.title
            || !item.time_limit
            || (!item.number_of_retake && item.number_of_retake !== 0)
        ) {
          error = true;
          noError = false;
        } else noError = !error || true;
        return undefined;
      });

      if (!noError) return handleDialogOpen();

      return setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    //  Default behavior
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
   * Handler to reset and go back to the first step
   */
  const handleReset = () => {
    setActiveStep(0);
  };

  /**
   * Function to handle submission of data to the API
   * to create an assessment
   */
  // eslint-disable-next-line consistent-return
  const handleSubmit = () => {
    const canValidate = [];
    candidates.forEach((candidate) => {
      if (!candidate.first_name || !candidate.last_name || !candidate.email)
        canValidate.push('invalid');
    });
    if (
      !emailBody
      || !emailSubject
      || !date
      || (candidates.length === 1
        && !Object.values(candidates[0]).every((item) => !item)
        && canValidate.length)
      || (candidates.length > 1 && canValidate.length)
    )
      return handleDialogOpen();

    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    const attachment = emailAttachments.map((item) => item.uuid);
    if (props.editFlag === true) {
      const newData = questions.map((question) => ({
        ...question,
        expected_keyword: question.expected_keyword?.map(
          (expected) => expected.title || expected,
        ),
      }));
      setQuestions(newData);
      const newTeamsData = teams.map((team) => (team.uuid ? team.uuid : team));
      setTeams(newTeamsData);

      evassessAPI
        .editAssessment(
          props.uuid,
          assessmentTitle,
          pipeline,
          type,
          newData,
          emailSubject,
          emailBody,
          date,
          candidates,
          video.uuid,
          newTeamsData,
          candidatesFromCSV,
          selectedCategory,
          privacy,
          evaluation,
          attachment,
          selectedCSV_file,
          selectedTemplatUuid,
        )
        .then((response) => {
          if (response.data.statusCode === 202) {
            setLinkVA(response.data.results.invitation_url);
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
            setVAE(true);
            setErrors([]);
          } else {
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
            handleDialogOpen();
          }
        });
    } else
    /**
     * Create the assessment (submit to API)
     */
      evassessAPI
        .createAssessment(
          assessmentTitle,
          pipeline,
          type,
          questions,
          emailSubject,
          emailBody,
          date,
          candidates,
          video.uuid,
          teams,
          candidatesFromCSV,
          selectedCategory,
          privacy,
          evaluation,
          attachment,
          selectedTemplatUuid,
        )
        .then((response) => {
          if (response.data.statusCode === 201) {
            VitallyTrack('EVA-SSESS - Invite candidate to the assessment');
            window?.ChurnZero?.push([
              'trackEvent',
              'EVA-SSESS - Create new assessment',
              'Create new assessment',
              1,
              {},
            ]);
            if ((questions || []).find((item) => item?.expected_keyword?.length > 0))
              window?.ChurnZero?.push([
                'trackEvent',
                'EVA-SSESS - Add expected keywords',
                'Add expected keywords',
                1,
                {},
              ]);
            if ((questions || []).find((item) => item?.model_answer))
              window?.ChurnZero?.push([
                'trackEvent',
                'EVA-SSESS - Add Model Answer',
                'Add Model Answer',
                1,
                {},
              ]);
            setLinkVA(response.data.results.invitation_url);
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
            setVAC(true);
          } else {
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
            handleDialogOpen();
          }
        })
        .catch((error) => {
          showError(t('Shared:failed-to-create'), error);
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        });
  };

  /**
   * Render JSX
   */
  return (
    <div>
      {/* This is the modal for categories - removing it will remove from created and edited. */}
      {/* {dialog} */}
      {videoAssessmentCreated || videoAssessmentEdited ? (
        <Congratulations
          type="created"
          link={linkVA}
          parentTranslationPath={props.parentTranslationPath}
        />
      ) : (
        <div className={classes.root}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<StepperConnector />}
            className={classes.stepper}
          >
            {steps.map((label, index) => (
              <Step key={`stepperLabelsKey${index + 1}`} style={{ padding: 0 }}>
                <StepperLabel
                  StepIconComponent={(labelProps) => <StepperIcon {...labelProps} />}
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
              <ButtonBase onClick={handleReset}>
                {t(`${translationPath}reset`)}
              </ButtonBase>
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
                <ButtonBase
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="btns theme-solid bg-secondary"
                >
                  {t(`${translationPath}back`)}
                </ButtonBase>
                {activeStep === steps.length - 1 ? (
                  <ButtonBase
                    color="primary"
                    className="btns theme-solid"
                    onClick={handleSubmit}
                    disabled={state.loading}
                  >
                    {state.loading && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                    )}
                    {`${
                      state.loading
                        ? t(`${translationPath}saving`)
                        : t(`${translationPath}finish`)
                    }`}
                  </ButtonBase>
                ) : (
                  <ButtonBase
                    color="primary"
                    className="btns theme-solid"
                    onClick={handleNext}
                    disabled={state.loading}
                  >
                    {state.loading && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                    )}
                    {`${
                      state.loading
                        ? t(`${translationPath}saving`)
                        : activeStep === 0
                          ? t(`${translationPath}next`)
                          : activeStep === steps.length - 2
                            ? t(`${translationPath}next`)
                            : t(`${translationPath}next`)
                    }`}
                  </ButtonBase>
                )}
              </div>
            </>
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t(`${translationPath}required-field-description`)}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t(`${translationPath}required-star-description`)}
                {errors.length > 0
                  && errors.map((error, index) =>
                    error.length > 1 ? (
                      error.map((subError, subIndex) => (
                        <p
                          key={`asteriskKeys${(subIndex + 1) * (index + 1)}`}
                          className="m-0 text-xs text-danger"
                        >
                          {subError}
                        </p>
                      ))
                    ) : (
                      <p
                        key={`asteriskKeys${error}`}
                        className="m-o text-xs text-danger"
                      >
                        {error}
                      </p>
                    ),
                  )}{' '}
                <br />
                {t(`${translationPath}thank-you`)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <ButtonBase onClick={handleClose} className="btns theme-solid">
                {t(`${translationPath}ok`)}
              </ButtonBase>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openEmailErr}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {t(`${translationPath}please-enter-a-valid-email`)}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {t(`${translationPath}valid-email-description`)}
                <br />
                <br />
                {t(`${translationPath}thank-you`)}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <ButtonBase onClick={handleClose} className="btns theme-solid">
                {t(`${translationPath}ok`)}
              </ButtonBase>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};
export default EvassessStepper;
