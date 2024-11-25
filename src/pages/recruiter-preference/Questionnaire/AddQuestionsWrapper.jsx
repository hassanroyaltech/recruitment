/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'api/middleware';
// reactstrap components
import urls from 'api/urls';
import { Card, Col } from 'reactstrap';
// import { useToasts } from 'react-toast-notifications';
import { getUniqueID } from 'shared/utils';
import { generateHeaders } from 'api/headers';
import { commonAPI } from 'api/common';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import QuestionCard from './QuestionCard';
import { showError, showSuccess } from '../../../helpers';
import { GPTGenerateQuestionnaire } from '../../../services';
import { ChatGPTJobDetailsDialog } from '../../evassess/templates/dialogs/ChatGPTJobDetails.Dialog';
import { ChatGPTIcon } from '../../../assets/icons';
import PopoverComponent from '../../../components/Popover/Popover.Component';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const Wrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 900px;
`;

const CardWrapper = styled(Card)`
  margin-top: 1rem;
  padding: 1.5rem;
`;
const TitleRow = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 0;
  & > * {
    font-weight: bold;
  }
`;
const AddQuestionsWrapper = ({
  data,
  goPrev,
  goNext,
  isActive,
  openDialog,
  currentUUID,
  initialQuestions,
  emailAttachments,
  gptDetails,
  setGPTDetails,
}) => {
  const { t } = useTranslation(mainParentTranslationPath);
  // const { addToast } = useToasts(); // Toasts
  const [questions, setQuestions] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [fileSizes, setFileSizes] = useState([]);
  const [openChatGPTDialog, setOpenChatGPTDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState({});
  const questionTypes = useMemo(
    () =>
      ['text', 'multiple_choice', 'checkbox'].map((type) => ({
        type,
        label: t(`${translationPath}${type}`),
      })),
    [t],
  );
  useEffect(() => {
    if (!initialQuestions) return;
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  /**
   * Effect to get file types and sizes from API.
   */
  useEffect(() => {
    // eslint-disable-next-line no-shadow
    commonAPI.getFileTypes().then((response) => {
      setFileTypes(response.data.results);
      // eslint-disable-next-line no-shadow
      commonAPI.getFileSizes().then((response) => {
        setFileSizes(response.data.results);
      });
    });
  }, []);

  const [isWorking, setIsWorking] = useState(false);
  const updateQuestion = (idToUpdate, newQuestion) => {
    setQuestions((items) => [
      ...items.map((q) => {
        if (q.uuid === idToUpdate) return newQuestion;

        return q;
      }),
    ]);
  };

  /**
   * Remove question
   * @param {*} questionToRemove
   */
  const removeQuestion = (questionToRemove) => {
    setQuestions((items) => [
      ...items.filter((q) => q.uuid !== questionToRemove.uuid),
    ]);
  };

  const addQuestion = () => {
    setQuestions((items) => [
      ...items,
      {
        description: '',
        title: '',
        type: 1,
        order: items.length,
        is_required: false,
        is_other: false,
        uuid: getUniqueID(),
      },
    ]);
  };

  const duplicateQuestion = (questionToDuplicate) => {
    setQuestions((items) => [
      ...items,
      { ...questionToDuplicate, uuid: getUniqueID() },
    ]);
  };

  // Finally Add Questionnaire
  const doAddQuestionnaire = async () => {
    // Make a deep copy of questions
    const copy = questions.map((object) => ({ ...object }));
    setIsWorking(true);
    await axios
      .post(
        urls.questionnaire.questionnaire_WRITE,
        {
          title: data.title,
          pipeline_uuid: data.pipeline_uuid,
          email_body: data.email_body,
          email_subject: data.email_subject,
          language_id: data.language_id,
          stage_uuid: data?.stage_uuid || null,
          attachment: emailAttachments.map((attachment) => attachment.uuid),
          questions: questions.map((q) => {
            delete q.uuid;
            if (q.type === 1)
              return {
                ...q,
                type: 'text',
                answers: null,
              };
            if (q.type === 'file')
              return {
                ...q,
                file_data: {
                  file_size: q.fileAnswer?.file_size || '1',
                  file_type: q.fileAnswer?.file_type || '2',
                },
              };
            if (q.type === 'yes_no')
              return {
                ...q,
                answers: [
                  {
                    title: t(`${translationPath}yes`),
                    stage_uuid: q.YesNoAnswer?.YesAnswer?.stage_uuid || null,
                    to_disqualified: false,
                  },
                  {
                    title: t(`${translationPath}no`),
                    stage_uuid: q.YesNoAnswer?.NoAnswer?.stage_uuid || null,
                    to_disqualified: false,
                  },
                ],
              };

            return q;
          }),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          'Create a questionnaire',
          'Create a questionnaire in recruiter preferences',
          1,
          {},
        ]);

        setIsWorking(false);
        goNext();
      })
      .catch((error) => {
        // Reassign the questions data to have uuid.
        setQuestions(copy);
        setIsWorking(false);

        showError(t(`${translationPath}error-in-adding-questionnaire`), error);
      });
  };

  const doUpdateQuestionnaire = async () => {
    // Make a deep copy of questions
    const copy = questions.map((object) => ({ ...object }));
    setIsWorking(true);
    await axios
      .put(
        urls.questionnaire.questionnaire_WRITE,
        {
          uuid: currentUUID,
          title: data.title,
          pipeline_uuid: data.pipeline_uuid,
          email_body: data.email_body,
          email_subject: data.email_subject,
          language_id: data.language_id,
          stage_uuid: data?.stage_uuid || null,
          attachment: emailAttachments.map((attachment) => attachment.uuid),
          questions: questions.map((q) => {
            delete q.uuid;
            if (q.type === 1)
              return {
                ...q,
                type: 'text',
                answers: null,
              };
            if (q.type === 'file')
              return {
                ...q,
                file_data: {
                  file_size: q.fileAnswer?.file_size || '1',
                  file_type: q.fileAnswer?.file_type || '2',
                },
              };
            if (q.type === 'yes_no')
              return {
                ...q,
                answers: [
                  {
                    title: t(`${translationPath}yes`),
                    stage_uuid: q.YesNoAnswer?.YesAnswer?.stage_uuid || null,
                    to_disqualified: false,
                  },
                  {
                    title: t(`${translationPath}no`),
                    stage_uuid: q.YesNoAnswer?.NoAnswer?.stage_uuid || null,
                    to_disqualified: false,
                  },
                ],
              };

            return q;
          }),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        setIsWorking(false);
        goNext();
      })
      .catch((error) => {
        // Reassign the questions data to have uuid.
        setQuestions(copy);
        setIsWorking(false);

        showError(t(`${translationPath}error-in-adding-questionnaire`), error);
      });
  };

  const getStageTitle = (stageUUID) => {
    if (!stageUUID) return t(`${translationPath}choose-stage`);

    return (
      data?.stages?.filter((s) => s.uuid === stageUUID).map((s) => s.title)[0]
      || t(`${translationPath}choose-stage`)
    );
  };
  const handleCloseGPTDialog = useCallback(() => {
    setOpenChatGPTDialog(false);
    setGPTDetails((items) => ({ ...items, callBack: null }));
  }, [setGPTDetails]);
  const gptGenerateAssessment = useCallback(
    async (val, callBack, canRegenerate = true) => {
      try {
        handleCloseGPTDialog();
        setIsLoading(true);
        const res = await GPTGenerateQuestionnaire({
          ...val,
          number_of_questions: val.isMultiple ? val.number_of_questions : 'one',
        });
        setIsLoading(false);
        if (res && res.status === 200) {
          let localeQuestions = [];
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
            results.forEach((item, index) => {
              localeQuestions.push({
                title: item?.question || '',
                description: '',
                type:
                  item.type === 'multiple_choices' ? 'multiple_choice' : item.type,
                order: index,
                is_required: false,
                is_other: false,
                uuid: getUniqueID(),
                answers:
                  item.type === 'multiple_choice' || item.type === 'multiple_choices'
                    ? (item?.options || []).map((ansewr) => ({
                      title: ansewr?.option || ansewr || '',
                      is_other: false,
                      stage_uuid: null,
                      to_disqualified: false,
                    }))
                    : (item.type === 'checkbox'
                        && (
                          (item?.answers?.length ? item.answers : item.options) || []
                        ).map((ansewr) => ({
                          title: ansewr || '',
                          is_other: false,
                          stage_uuid: null,
                          to_disqualified: false,
                        })))
                      || [],
              });
            });
          if (
            (results || []).some(
              (item) =>
                !item.question
                || (item.type === 'checkbox'
                  && (!item?.answers || item?.answers?.length === 0)
                  && (!item?.options || item?.options?.length === 0))
                || ((item.type === 'multiple_choices'
                  || item.type === 'multiple_choice')
                  && (!item?.options || item?.options?.length === 0)),
            )
          )
            showSuccess(t(`Shared:success-get-gpt-help-with-missing`));
          else showSuccess(t(`Shared:success-get-gpt-help`));
          if (!callBack) setQuestions(localeQuestions);
          else callBack(localeQuestions);
          setActiveQuestion({});
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        setIsLoading(false);
        setActiveQuestion({});
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [handleCloseGPTDialog, t],
  );

  const handelGetQuestionsThroughGPT = useCallback(
    (val) => {
      setGPTDetails((items) => ({ ...items, ...val, callBack: null }));
      gptGenerateAssessment(val, val.callBack);
    },
    [gptGenerateAssessment, setGPTDetails],
  );

  const replaceQuestion = (newQuestion, index) => {
    const localQuestions = [...questions];
    localQuestions[index] = newQuestion;
    setQuestions(localQuestions);
  };
  const genarateSingleQuestion = () => {
    if (!activeQuestion.type) return;
    setPopoverAttachedWith(null);
    if (gptDetails?.job_title || data?.title)
      gptGenerateAssessment(
        {
          ...gptDetails,
          job_title: gptDetails?.job_title || data?.title,
          ...activeQuestion,
          isMultiple: false,
        },
        (q) => {
          if (q?.[0]) replaceQuestion(q?.[0], activeQuestion.index);
        },
      );
    else {
      setGPTDetails((items) => ({
        ...items,
        isMultiple: false,
        type: activeQuestion.type,
        callBack: (q) => {
          if (q?.[0]) replaceQuestion(q?.[0], activeQuestion.index);
        },
      }));
      setOpenChatGPTDialog(true);
    }
  };

  const handleGPTButtonClick = (event) => (question) => {
    event && setPopoverAttachedWith(event.target);
    setActiveQuestion(question);
  };

  if (!isActive) return null;
  return (
    <Wrapper className="p-3">
      <div className="mx-auto d-flex justify-content-end">
        <ButtonBase
          onClick={() => {
            setOpenChatGPTDialog(true);
            setGPTDetails((items) => ({
              ...items,
              job_title: items.job_title || data?.title,
              isMultiple: true,
              callBack: null,
            }));
          }}
          disabled={isLoading}
          className="btns theme-solid py-1"
        >
          {isLoading ? (
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
        <ButtonBase className="btns theme-solid" onClick={openDialog}>
          {getStageTitle(data.stage_uuid)}
          <i className="ml-2-reversed fas fa-angle-down" />
        </ButtonBase>
      </div>
      <CardWrapper>
        <TitleRow>
          <h3 className="mb-0">
            {data?.title || t(`${translationPath}edit-questions`)}
          </h3>
        </TitleRow>
      </CardWrapper>
      {questions
        && questions.map((q, i) => (
          <QuestionCard
            question={q}
            key={q.uuid}
            index={i + 1}
            originalIndex={i}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            duplicateQuestion={duplicateQuestion}
            stages={data?.stages?.filter((a) => a.type !== 1) || []}
            fileTypes={fileTypes}
            fileSizes={fileSizes}
            isWithChatGPTButton
            isLoading={isLoading}
            handleGPTButtonClick={handleGPTButtonClick}
            activeQuestion={activeQuestion}
          />
        ))}
      {/* {questions && questions.length === 0 && <Empty message="No Questions Found" />} */}
      {/* Footer */}
      <Col className="px-0 py-2 ">
        <ButtonBase
          onClick={addQuestion}
          id="addQuestionBtnRef"
          className="btns-icon theme-solid"
        >
          <i className="fas fa-plus" />
        </ButtonBase>
        <label htmlFor="addQuestionBtnRef" className="mx-2">
          {t(`${translationPath}add-new-question`)}
        </label>
      </Col>
      <Col className="d-flex justify-content-center mt-4 mb-6">
        <ButtonBase onClick={goPrev} className="btns theme-transparent">
          {t(`${translationPath}back`)}
        </ButtonBase>

        <ButtonBase
          disabled={isWorking}
          onClick={!currentUUID ? doAddQuestionnaire : doUpdateQuestionnaire}
          className="btns theme-solid"
        >
          {isWorking && <i className="fa fa-spinner fa-spin mr-2-reversed" />}
          {!currentUUID && t(`${translationPath}add-questionnaire`)}
          {currentUUID && t(`${translationPath}update-questionnaire`)}
        </ButtonBase>
      </Col>
      {/* Footer */}
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
          isWithQuestionsNumber
          isWithlanguage
          questionTypes={questionTypes}
          jobTitleLabel={'questionnaire-title'}
        />
      )}

      {popoverAttachedWith && (
        <PopoverComponent
          idRef={`questoinnaireGPTHelp`}
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setPopoverAttachedWith(null);
            setActiveQuestion({});
          }}
          component={
            <div className="d-inline-flex-column gap-1 py-1">
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => genarateSingleQuestion()}
                disabled={!activeQuestion.type || isLoading}
              >
                {t(`${translationPath}generate-question`)}
              </ButtonBase>
            </div>
          }
        />
      )}
    </Wrapper>
  );
};

export default AddQuestionsWrapper;
