/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, CardBody, Col, Container, Row } from 'reactstrap';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { connect } from 'react-redux';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import urls from 'api/urls';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import SimpleHeader from '../../../components/Elevatus/TimelineHeader';
import BasicInfo from '../create/BasicInfo';
import Questionnaire from '../create/Questionnaire';
import Loader from '../../../components/Elevatus/Loader';
import { useTitle } from '../../../hooks';
import { HttpServices, showError, showSuccess } from '../../../helpers';
import { generateHeaders } from '../../../api/headers';
import i18next from 'i18next';
import axios from '../../../api/middleware';
import Helpers from '../../../utils/Helpers';
import { GPTGenerateQuestionnaire } from '../../../services';
import { ChatGPTJobDetailsDialog } from './dialogs/ChatGPTJobDetails.Dialog';

const translationPath = 'CreateTemplateComponent.';
const parentTranslationPath = 'EvaSSESSTemplates';
const TemplateForm = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [uuid, setUuid] = useState(null);
  const { addToast } = useToasts();
  useTitle(t(`${translationPath}edit-template`));
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
    loading: true,
    title: '',
    category: '',
    type: '1',
    uuid: '',
    questions: [
      {
        title: '',
        model_answer: '',
        time_limit: '',
        number_of_retake: '',
        expected_keyword: [],
      },
    ],
    video: '',
    user: JSON.parse(localStorage.getItem('user'))?.results,
    activeStep: 0,
    dialogOpen: false,
    errors: [],
  });

  const steps = [
    t(`${translationPath}basic-information`),
    t(`${translationPath}questions`),
  ];

  const findTemplate = useCallback(async () => {
    if (!uuid) return;
    setState((items) => ({ ...items, loading: true }));
    Axios.request({
      method: 'view',
      url: urls.evassess.template_GET,
      header: {
        Accept: 'application/json',
      },
      headers: generateHeaders(),
      params: {
        uuid,
      },
    })
      .then((response) => {
        setState((items) => ({
          ...items,
          loading: false,
          data: response.data.results,
          title: response.data.results.title,
          category: response.data.results.category?.uuid,
          uuid: response.data.results.uuid,
          type: response.data.results.type.title === 'Hidden' ? '0' : '1',
          questions: response.data.results.questions,
          VideoSelect: response.data.results.video
            ? response.data?.results?.video?.original
            : [],
          video: response.data?.results?.video?.original,
        }));
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setState((prevState) => ({
          ...prevState,
          type: 'error',
          loading: false,
        }));
      });
  }, [t, uuid]);

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++)
      await callback(array[index], index, array);
  };

  const handleChange = (field) => (value) => {
    setState((items) => ({ ...items, [field]: value }));
  };
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

  const deleteQuestion = (index) => {
    const questions = [...state.questions];
    questions.splice(index, 1);
    setState((items) => ({ ...items, questions }));
  };

  const handleSubmit = async () => {
    const { questions } = state;

    let noError;
    if (!questions) return handleOpenDialog();

    let error = false;
    for (let i = 0; i < questions.length; i++)
      if (
        !questions[i].title
        || !questions[i].time_limit
        || !questions[i].number_of_retake
      ) {
        error = true;
        noError = false;
      } else noError = !error || true;

    if (!noError) return handleOpenDialog();

    setState((items) => ({ ...items, submitted: true }));
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
          expected_keyword: question.expected_keyword
            ? question.expected_keyword.map((keyword) =>
              keyword.title ? keyword.title : keyword,
            )
            : [],
        });
      });

    HttpServices.put(urls.evassess.template_WRITE, {
      uuid: state.uuid,
      title: state.title,
      type: state.type,
      video_uuid:
        state.video && state.video.uuid.length > 0 ? state.video.uuid : null,
      questions: newQuestions,
      category_uuid: state.category ? state.category : null,
    })
      .then(() => {
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
          errors: error?.response?.data?.errors,
        }));
      });
  };
  const handleCloseGPTDialog = () => {
    setOpenChatGPTDialog(false);
    setGPTDetails((items) => ({ ...items, callBack: null }));
  };

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
          setType={handleChange('type')}
          parentTranslationPath="EvaSSESS"
          setCatgeory={handleChange('category')}
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
          parentTranslationPath="EvaSSESS"
          addQuestion={addQuestion}
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

  const handleOpenDialog = () => {
    setState((items) => ({ ...items, dialogOpen: true }));
  };

  const handleCloseDialog = () => {
    setState((items) => ({ ...items, dialogOpen: false }));
  };

  const handleBack = () => {
    if (state.activeStep === 0)
      props.history.push('/recruiter/assessment/templates');
    else
      return setState((items) => ({ ...items, activeStep: items.activeStep - 1 }));
  };

  const handleNext = () => {
    const { activeStep, title, type, questions } = state;
    switch (activeStep) {
    case 0: {
      if (!title || !type) return handleOpenDialog();

      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
    case 1: {
      let noError;
      if (!questions) return handleOpenDialog();

      let error = false;
      for (let i = 0; i < questions.length; i++)
        if (
          !questions[i].title
            || !questions[i].time_limit
            || !questions[i].number_of_retake
        ) {
          error = true;
          noError = false;
        } else noError = !error || true;

      if (!noError) return handleOpenDialog();

      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
    default:
      return setState((items) => ({ ...items, activeStep: items.activeStep + 1 }));
    }
  };

  const { activeStep, submitted, videoLoader, dialogOpen, errors } = state;

  useEffect(() => {
    if (props.match.params.uuid && props.match.params.uuid !== uuid)
      setUuid(props.match.params.uuid);
  }, [props.match.params.uuid, uuid]);
  useEffect(() => {
    findTemplate();
  }, [findTemplate, uuid]);

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
          if (results?.length > 0)
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
                  item?.expected_keywords?.length === 0 || !item?.expected_keywords,
              ))
            || (val?.is_with_model_answer
              && results.some((item) => item?.answers?.length === 0 || !item?.answers))
          )
            showSuccess(t(`Shared:success-get-gpt-help-with-missing`));
          else showSuccess(t(`Shared:success-get-gpt-help`));
          if (!callBack) setState((items) => ({ ...items, questions }));
          else callBack(questions);
        } else showError(t('Shared:failed-to-get-saved-data'), res);
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
        name={t(`${translationPath}edit-template`)}
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
              {state.loading ? (
                <CardBody className="text-center">
                  <Row>
                    <Col xl="12">
                      <Loader
                        width="730px"
                        height="49vh"
                        speed={1}
                        color="primary"
                      />
                    </Col>
                  </Row>
                </CardBody>
              ) : (
                getStepContent(activeStep)
              )}

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
                open={dialogOpen || false}
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
                            key={`templateMessageErrorKey${error}`}
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
          isJobTitleRequired
          jobTitleLabel="assessment-title"
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
export default connect(mapStateToProps)(TemplateForm);
