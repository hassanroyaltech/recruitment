/* eslint-disable no-undef */
/**
 * ----------------------------------------------------------------------------------
 * @title Questionnaire.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the Questionnaire component. The questionnaire is the
 * second step in the EvassessStepper and may contain multiple QuestionCard
 * components
 * ----------------------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import QuestionCard from '../../../pages/evassess/create/QuestionCard';
import { evassessAPI } from '../../../api/evassess';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../../assets/icons';
import PopoverComponent from '../../../components/Popover/Popover.Component';
import { TaskReminderFrequencyEnum, TaskReminderTypesEnum } from '../../../enums';
import {
  GPTGenerateAssessment,
  GPTGenerateExpectedKeywords,
  GPTGenerateModelAnswer,
} from '../../../services/ChatGPT.Services';
import i18next from 'i18next';
import { showError, showSuccess } from '../../../helpers';
import { question } from 'plotly.js/src/fonts/ploticon';
// Main class component
const translationPath = 'QuestionnaireComponent.';
const Questionnaire = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESS');
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState({});

  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    questionNumber: props.questions || [],
    questions: props.questions || [],
    timeLimits: [],
    retakes: [],
    loading: false,
  });

  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);

  // Add a question - should add callback
  const addQuestion = () => {
    setState((items) => ({
      ...items,
      questionNumber: state.questionNumber.concat(state.questionNumber.length),
    }));
    state.questions.push({
      title: '',
      model_answer: '',
      time_limit: '',
      number_of_retake: '',
      expected_keyword: [],
    });
    // props.addQuestion();
  };

  // Delete a question - should add callback
  const removeQuestion = (index) => {
    const arr = state.questionNumber;
    arr.splice(index, 1);

    props.removeQuestion(index);
    setState((items) => ({
      ...items,
      questions: props.questions || [],
      questionNumber: arr,
    }));
  };
  const handleLocaleState = (value, name, i, isEdit) => {
    const { questions } = state;
    if (!questions[i]) questions[i] = {};
    if (isEdit) questions[i] = value;
    else questions[i][name] = value;
    questions[i][name] = value;
    setState((items) => ({ ...items, questions }));
  };
  // Update question values
  const handleSetQuestionValues = (value, name, i, isEdit) => {
    props.handleq(value, name, i, isEdit);
    handleLocaleState(value, name, i, isEdit);
  };

  // API request to get number of valid time limits
  const getTimeLimits = useCallback(async () => {
    setState((items) => ({ ...items, loading: true }));
    await evassessAPI.getVideoAssessmentTimeLimits().then((response) => {
      if (response.data.statusCode === 200)
        if (response.data.results)
          setState((prevState) => ({
            ...prevState,
            timeLimits: response.data.results,
            loading: false,
          }));
    });
  }, []);

  // API request to get number of retakes dropdown
  const getNumberOfRetake = useCallback(async () => {
    setState((items) => ({ ...items, loading: true }));
    await evassessAPI.getVideoAssessmentNumberOfRetakes().then((response) => {
      if (response.data.statusCode === 200)
        if (response.data.results)
          setState((prevState) => ({
            ...prevState,
            retakes: response.data.results,
            loading: false,
          }));
    });
  }, []);
  // This needs better handling in case of errors from the API or connectivity
  useEffect(() => {
    getTimeLimits();
    getNumberOfRetake();
  }, [getTimeLimits, getNumberOfRetake]);

  const openGPTHelpPopover = useCallback((event) => {
    setPopoverAttachedWith(event.target);
  }, []);

  const gptGenerateModelAnswer = useCallback(
    async (canRegenerate = true) => {
      if (!activeQuestion?.question?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsLoading(true);
        const res = await GPTGenerateModelAnswer({
          question: activeQuestion?.question?.title,
          language: props?.gptDetails?.language || i18next.language,
        });
        setIsLoading(false);
        setActiveQuestion({});
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateModelAnswer(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          if (results?.length > 0)
            handleSetQuestionValues(
              (results || []).join('\n') || '',
              'model_answer',
              activeQuestion.index,
            );
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [
      activeQuestion.index,
      activeQuestion?.question?.title,
      handleSetQuestionValues,
      props?.gptDetails?.language,
      t,
    ],
  );

  const gptGenerateExpectedKeywords = useCallback(
    async (canRegenerate = true) => {
      if (!activeQuestion?.question?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsLoading(true);
        const res = await GPTGenerateExpectedKeywords({
          question: activeQuestion?.question?.title,
          language: props?.gptDetails?.language || i18next.language,
        });
        setIsLoading(false);
        setPopoverAttachedWith(null);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateExpectedKeywords(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          if (results.length > 0)
            handleSetQuestionValues(
              results,
              'expected_keyword',
              activeQuestion.index,
            );
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [
      activeQuestion.index,
      activeQuestion?.question?.title,
      handleSetQuestionValues,
      props?.gptDetails?.language,
      t,
    ],
  );
  const generateSingleQuestionByChatGPT = () => {
    setPopoverAttachedWith(null);
    if (props?.genarateSingleQuestion)
      props?.genarateSingleQuestion((questionsData) => {
        if (questionsData?.[0]) {
          let question = {
            ...state.questions[activeQuestion.index],
            title: questionsData?.[0].title || '',
            model_answer: questionsData?.[0]?.model_answer || '',
            expected_keyword: questionsData?.[0]?.expected_keyword || [],
          };
          handleSetQuestionValues(question, '', activeQuestion.index, true);
        }
      });
  };

  const repalceQuestions = (questions) => {
    if (questions?.length > 0) {
      setState((items) => ({
        ...items,
        questions,
        // questionNumber: questions
      }));
      props?.handleReplaceQuestions(questions);
    }
  };

  return (
    <>
      {props?.isWithChatGPTButton && (
        <div className="d-flex-v-center-h-end" style={{ marginBottom: '-15px' }}>
          <ButtonBase
            onClick={() => {
              props?.setOpenChatGPTDialog(true);
              props?.setGPTDetails((items) => ({
                ...items,
                job_title: items?.job_title || props?.assessmentTitle,
                is_with_keywords: false,
                is_with_model_answer: false,
                isMultiple: true,
                callBack: repalceQuestions,
              }));
              setActiveQuestion({});
            }}
            className="btns theme-solid py-1"
            disabled={!props.canEdit || isLoading || props?.isLoading}
          >
            {isLoading || props?.isLoading ? (
              <>
                {t(`${translationPath}generating`)}
                <span className="fas fa-circle-notch fa-spin m-1" />
              </>
            ) : (
              <>
                {t(`${translationPath}generate-questions`)}
                <span className="m-1">
                  <ChatGPTIcon />
                </span>
              </>
            )}
          </ButtonBase>
        </div>
      )}
      {state.questions
        && !state.loading
        && state.questions.map((option, index) => (
          <Card
            className="step-card"
            key={`questionsKey${index + 1}${(option?.expected_keyword || []).join(
              '',
            )}`}
          >
            <div className="d-flex-v-center-h-between">
              <h6 className="h6 text-bold-500">
                <span>{t(`${translationPath}question`)}</span>
                <span className="px-1">{index + 1}</span>
              </h6>
              <div>
                {props?.isWithChatGPTButton && (
                  <ButtonBase
                    onClick={(e) => {
                      openGPTHelpPopover(e);
                      setActiveQuestion({
                        index,
                        question: option,
                      });
                    }}
                    className="btns-icon theme-solid mx-2"
                    disabled={!props.canEdit || isLoading || props?.isLoading}
                  >
                    {activeQuestion?.index === index
                    && (isLoading || props?.isLoading) ? (
                        <span className="fas fa-circle-notch fa-spin m-1" />
                      ) : (
                        <ChatGPTIcon />
                      )}
                  </ButtonBase>
                )}
                {state.questions.length > 1 && (
                  <ButtonBase
                    className="btns-icon theme-transparent"
                    disabled={!props.canEdit || isLoading}
                    onClick={() => removeQuestion(index)}
                  >
                    <span className="fas fa-times" />
                  </ButtonBase>
                )}
              </div>
            </div>
            <div className="mt-4">
              <QuestionCard
                canEdit={props.canEdit}
                number={index}
                setQuestionValue={handleSetQuestionValues}
                questionValue={option || ''}
                addQuestion={
                  index === state.questions.length - 1 ? addQuestion : null
                }
                timeLimits={state.timeLimits}
                retakes={state.retakes}
                loading={state.loading}
                parentTranslationPath={props.parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
          </Card>
        ))}
      {props?.isWithChatGPTButton && popoverAttachedWith && (
        <PopoverComponent
          idRef={`questoinsGPTHelp-EVAS-SSESS`}
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setPopoverAttachedWith(null);
            setActiveQuestion({});
          }}
          component={
            <div className="d-inline-flex-column gap-1 py-1">
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => generateSingleQuestionByChatGPT()}
                disabled={!activeQuestion || isLoading}
              >
                {t(`${translationPath}generate-single-question`)}
              </ButtonBase>
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => gptGenerateModelAnswer()}
                disabled={!activeQuestion?.question?.title || isLoading}
              >
                {t(`${translationPath}generate-model-answer`)}
              </ButtonBase>

              <ButtonBase
                className="btns theme-transparent"
                onClick={() => gptGenerateExpectedKeywords()}
                disabled={!activeQuestion?.question?.title || isLoading}
              >
                {t(`${translationPath}generate-keywords`)}
              </ButtonBase>
            </div>
          }
        />
      )}
    </>
  );
};
export default Questionnaire;
