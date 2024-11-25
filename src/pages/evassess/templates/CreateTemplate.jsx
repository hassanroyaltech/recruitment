/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
/**
 * ----------------------------------------------------------------------------------
 * @title CreateTemplate.jsx
 * ----------------------------------------------------------------------------------
 * This module allows us to create a template. It defines the stepper and renders
 * the various step components inside that.
 * ----------------------------------------------------------------------------------
 */

// React and reactstrap
import React, { useState, useCallback } from 'react';
import { Button, Container } from 'reactstrap';

// MUI
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

// Redux
import { connect } from 'react-redux';

// API
import urls from 'api/urls';

// Router
import { Redirect } from 'react-router-dom';

// Header
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import SimpleHeader from '../../../components/Elevatus/TimelineHeader';

// Step components
import BasicInfo from '../create/BasicInfo';
import Questionnaire from '../create/Questionnaire';
import { HttpServices, showError, showSuccess } from '../../../helpers';

import { ChatGPTJobDetailsDialog } from './dialogs/ChatGPTJobDetails.Dialog';
import i18next from 'i18next';
import { GPTGenerateQuestionnaire } from '../../../services/ChatGPT.Services';

/**
 * CreateTemplate class component
 */
const translationPath = 'CreateTemplateComponent.';
const parentTranslationPath = 'EvaSSESSTemplates';
const CreateTemplate = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openChatGPTDialog, setOpenChatGPTDialog] = useState(false);
  const [gptDetails, setGPTDetails] = useState({
    job_title: '',
    year_of_experience: '',
    is_with_keywords: false,
    is_with_model_answer: false,
    language: i18next.language,
    number_of_questions: 'three',
  });
  const [state, setState] = useState({
    submitted: false,
    title: '',
    category: '',
    type: '1',
    video: '',
    questions: [
      {
        title: '',
        model_answer: '',
        time_limit: '',
        number_of_retake: '',
        expected_keyword: [],
      },
    ],
    user: JSON.parse(localStorage.getItem('user'))?.results,
    activeStep: 0,
    dialogOpen: false,
    errors: [],
  });
  /**
   * Async for each loop
   * @param array
   * @param callback
   * @returns {Promise<void>}
   */
  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++)
      await callback(array[index], index, array);
  };

  /**
   * Set the state (mapping between function and class components)
   * @param field
   * @returns {function(*): void}
   */
  const handleChange = (field) => (value) => {
    setState((items) => ({ ...items, [field]: value }));
  };

  /**
   * Handler for questions
   * @param value
   * @param name
   * @param i
   */
  const handleq = (value, name, i, isEdit) => {
    const { questions } = state;
    if (!questions[i]) questions[i] = {};
    if (isEdit) questions[i] = value;
    else questions[i][name] = value;
    setState((items) => ({ ...items, questions }));
  };

  const handleReplaceQuestions = (questions) => {
    setState((items) => ({ ...items, questions }));
  };

  /**
   * Add a question
   */
  const addQuestion = () => {
    const questions = [...state.questions];
    questions.push({
      title: '',
      model_answer: '',
      time_limit: '',
      number_of_retake: '',
    });
    setState((items) => ({ ...items, questions }));
  };

  /**
   * Delete a question
   * @param index
   */
  const deleteQuestion = (index) => {
    setState((items) => {
      const localItems = { ...items };
      localItems.questions.splice(index, 1);
      return localItems;
    });
  };

  /**
   * Handler to open a dialog
   */
  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleCloseGPTDialog = () => {
    setOpenChatGPTDialog(false);
    setGPTDetails((items) => ({ ...items, callBack: null }));
  };

  /**
   * Handle submit by setting state and creating the template
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    let noError = true;
    state.questions.map((item) => {
      noError = !(!item?.title || !item?.time_limit || !item?.number_of_retake);
    });

    if (!noError || !state.title || !state.category) {
      handleDialogOpen();
      return;
    }

    setState((items) => ({
      ...items,
      submitted: true,
    }));
    const newQuestions = [];
    if (state.questions.length > 0)
      await asyncForEach(state.questions, async (question) => {
        newQuestions.push({
          title: question.title,
          time_limit: question.time_limit ? question.time_limit : 15,
          model_answer: question.model_answer || '',
          number_of_retake: question.number_of_retake
            ? question.number_of_retake
            : 0,
          expected_keyword: question.expected_keyword,
        });
      });

    HttpServices.post(urls.evassess.template_WRITE, {
      title: state.title,
      type: state.type,
      video_uuid:
        state.video && state.video.uuid.length > 0 ? state.video.uuid : null,
      questions: newQuestions,
      category_uuid: state.category ? state.category : null,
    })
      .then(({ data }) => {
        setState((prevState) => ({
          ...prevState,
          submitted: false,
          errors: [],
        }));
        addToast(t(`${translationPath}saved-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.history.push('/recruiter/assessment/templates');
      })
      .catch((error) => {
        if (!error.response) return <Redirect to="/" />;
        showError(t('Shared:failed-to-get-saved-data'), error);

        setState((prevState) => ({
          ...prevState,
          submitted: false,
          errors: error.response.data.errors || [],
        }));
      });
  };

  /**
   * Get data inside stepper
   * @param stepIndex
   * @returns {JSX.Element|string}
   */
  const getStepContent = (stepIndex) => {
    const { title, type, video, questions, category } = state;
    switch (stepIndex) {
    case 0:
      return (
        <BasicInfo
          panelType="template"
          canEdit
          assessmentTitle={title}
          category={category}
          setTitle={handleChange('title')}
          setCatgeory={handleChange('category')}
          setType={handleChange('type')}
          type={type}
          setVideo={handleChange('video')}
          video={video}
          openChatGPTDialog={openChatGPTDialog}
          setOpenChatGPTDialog={setOpenChatGPTDialog}
          gptDetails={gptDetails}
          setGPTDetails={setGPTDetails}
        />
      );
    case 1:
      return (
        <Questionnaire
          canEdit
          assessmentTitle={title}
          handleq={handleq}
          questions={questions}
          addQuestion={addQuestion}
          parentTranslationPath="EvaSSESS"
          removeQuestion={deleteQuestion}
          gptDetails={gptDetails}
          genarateSingleQuestion={genarateSingleQuestion}
          handleReplaceQuestions={handleReplaceQuestions}
          openChatGPTDialog={openChatGPTDialog}
          setOpenChatGPTDialog={setOpenChatGPTDialog}
          setGPTDetails={setGPTDetails}
          isLoading={isLoading}
          isWithChatGPTButton
        />
      );
    default:
      return 'Unknown stepIndex';
    }
  };

  /**
   * Handler to open a dialog
   */
  const handleOpenDialog = () => {
    setState((items) => ({ ...items, dialogOpen: true }));
  };

  /**
   * Handler to close a dialog
   */
  const handleCloseDialog = () => {
    setOpen(false);
  };

  /**
   * Handler to go back a step
   */
  const handleBack = () => {
    if (state.activeStep === 0)
      props.history.push('/recruiter/assessment/templates');
    else
      return setState((items) => ({ ...items, activeStep: items.activeStep - 1 }));
  };

  /**
   * Handler to go to the next step
   */
  const handleNext = () => {
    if (!state.title || !state.category) {
      handleDialogOpen();
      return;
    }

    const { activeStep, title, type, questions } = state;
    switch (activeStep) {
    case 0: {
      if (!title || !type || !state.category) return handleOpenDialog();

      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
    case 1: {
      if (!questions) return handleOpenDialog();

      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
    default:
      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
  };

  /**
   * Render the JSX component
   * @returns {JSX.Element}
   */
  /**
   * Set variables based on state
   */
  const { activeStep, submitted, videoLoader, errors } = state;

  /**
   * Define steps array
   */
  const steps = [
    t(`${translationPath}basic-information`),
    t(`${translationPath}questions`),
  ];
  const gptGenerateAssessment = useCallback(
    async (val, callBack, canRegenerate = true) => {
      try {
        handleCloseGPTDialog();
        setIsLoading(true);
        const res = await GPTGenerateQuestionnaire({
          ...val,
          number_of_questions: val.isMultiple ? val.number_of_questions : 'one',
          type: 'text',
        });
        setIsLoading(false);
        if (res && res.status === 200) {
          let questions = [];
          let results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateAssessment(val, callBack, false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          if (
            (!val.isMultiple || val.number_of_questions === 'one')
            && results?.question
          )
            results = [results];
          if (results?.length > 0) {
            results.forEach((item) => {
              questions.push({
                title: item?.question || '',
                model_answer: (item?.answers || []).join('\n') || '',
                time_limit: '',
                number_of_retake: '',
                expected_keyword: item?.expected_keywords || [],
              });
            });
            if (
              (val?.is_with_keywords
                && results.some(
                  (item) =>
                    item?.expected_keywords?.length === 0
                    || !item?.expected_keywords,
                ))
              || (val?.is_with_model_answer
                && results.some(
                  (item) => item?.answers?.length === 0 || !item?.answers,
                ))
            )
              showSuccess(t(`Shared:success-get-gpt-help-with-missing`));
            else showSuccess(t(`Shared:success-get-gpt-help`));
          }
          if (!callBack) setState((items) => ({ ...items, questions }));
          else callBack(questions);
        } else
          showError(t('Shared:error-get-gpt-help'), res, {
            type: 'warning',
          });
      } catch (error) {
        setIsLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [t],
  );
  const handelGetQuestionsThroughGPT = useCallback(
    (val) => {
      setGPTDetails((items) => ({ ...items, ...val, callBack: null }));
      gptGenerateAssessment(val, val.callBack);
    },
    [gptGenerateAssessment],
  );
  const genarateSingleQuestion = (callBack) => {
    if (gptDetails?.job_title || state?.title)
      gptGenerateAssessment(
        {
          ...gptDetails,
          job_title: gptDetails?.job_title || state?.title,
          isMultiple: false,
        },
        (q) => callBack(q),
      );
    else {
      setGPTDetails((items) => ({
        ...items,
        isMultiple: false,
        callBack: (q) => callBack(q),
      }));
      setOpenChatGPTDialog(true);
    }
  };

  return (
    <>
      <SimpleHeader
        name={t(`${translationPath}create-template`)}
        parentName={t(`${translationPath}eva-ssess`)}
        child_name={`${state.title}`}
      />
      <div className="content-page">
        <div className="content">
          <Container fluid>
            <div
              className="content-page mt--8 p-sm-5 p-1 pt-5 overflow-hidden"
              style={{ background: 'inherit' }}
            >
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
                    disabled={submitted || videoLoader}
                  >
                    {(submitted || videoLoader) && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                    )}
                    {state.videoLoader
                      ? t(`${translationPath}uploading-video`)
                      : submitted
                        ? t(`${translationPath}saving`)
                        : t(`${translationPath}save`)}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="step-button"
                    onClick={handleNext}
                    disabled={videoLoader}
                  >
                    {videoLoader && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                    )}
                    {`${
                      videoLoader
                        ? t(`${translationPath}saving`)
                        : t(`${translationPath}next`)
                    }`}
                  </Button>
                )}
              </div>

              <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {t(`${translationPath}fill-fields-description`)}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {t(`${translationPath}required-fields-description`)}
                    {errors
                      && errors.length > 0
                      && errors.map((error, key) =>
                        error.length > 1 ? (
                          error.map((subError, subIndex) => (
                            <p
                              key={`errors${key + 1}${subIndex + 1}`}
                              className="m-0 text-xs text-danger"
                            >
                              {subError}
                            </p>
                          ))
                        ) : (
                          <p
                            key={`errorMessageKey${error}`}
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
                  <Button onClick={handleCloseDialog} color="primary">
                    {t(`${translationPath}ok`)}
                  </Button>
                </DialogActions>
              </Dialog>
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
            handelGetQuestionsThroughGPT(val);
          }}
          isLoading={isLoading}
          isMultiple={gptDetails?.isMultiple}
          jobTitleLabel="assessment-title"
          isJobTitleRequired
          isWithQuestionsNumber
          isWithlanguage
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(CreateTemplate);
