/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Card, Col } from 'reactstrap';
import InputToggle from 'components/Inputs/InputToggle';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import {
  AutocompleteComponent,
  CheckboxesComponent,
  Inputs,
} from '../../components';
import { generateUUIDV4 } from '../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvaBrand';

const CardWrapper = styled(Card)`
  margin-top: 1rem;
`;

const Badge = styled.div`
  align-items: center;
  background: var(--bgprimary);
  border-bottom-right-radius: 3px;
  border-top-right-radius: 3px;
  color: #fff;
  display: flex;
  font-size: 24px;
  height: 46px;
  justify-content: center;
  left: 0;
  position: absolute;
  width: 46px;
`;

const ButtonsWrapper = styled.div`
  position: absolute;
  right: 10px;
  & i {
    font-size: 18px;
  }
  & button {
    border: none;
    outline: none;
    &:active,
    &:focus {
      border: none !important;
      box-shadow: none !important;
    }
    &:hover {
      background: rgb(250, 250, 250);
    }
  }
`;

const AnswerWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 1rem;
`;
const Box = styled.div`
  border: 1px solid #5b6785;
  border-radius: ${(props) => (props.isCircle ? '999px' : '3px')};
  height: 25px;
  min-width: 25px;
  width: 25px;
`;

/**
 * QuestionCard component used in the Questionnaire
 * @param index
 * @param removeQuestion
 * @param duplicateQuestion
 * @param setNewQuestion
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionCard = ({
  index,
  removeQuestion,
  duplicateQuestion,
  setNewQuestion,
  isForIndeed,
  questionsTypes,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [question, setQuestion] = useState(props.question);
  const fileTypesRef = useRef([
    { key: '2', value: 'pdf' },
    { key: '3', value: 'doc' },
    { key: '4', value: 'excel' },
    { key: '6', value: 'txt' },
    { key: '7', value: 'images' },
    { key: '8', value: 'pdf ,doc ,excel or txt' },
    { key: '9', value: 'pdf or doc' },
  ]);
  const fileSelectTypesRef = useRef([
    'text',
    'multiple_choice',
    'dropdown',
    'checkbox',
    'file',
  ]);
  const fileSizesRef = useRef([
    { key: '1', value: '1MB' },
    { key: '2', value: '2MB' },
    { key: '3', value: '3MB' },
    { key: '4', value: '4MB' },
    { key: '5', value: '5MB' },
    { key: '6', value: '6MB' },
    { key: '7', value: '7MB' },
    { key: '8', value: '8MB' },
    { key: '9', value: '9MB' },
    { key: '10', value: '10MB' },
  ]);

  /**
   * Remove answer constructor
   * @param answerIndex
   */
  const removeAnswer = (answerIndex) => {
    question.answers.splice(answerIndex, 1);
    props.updateQuestion(question.uuid, {
      ...question,
      answers: [...question.answers],
    });
  };

  /**
   * Add an answer
   */
  const addAnswer = () => {
    props.updateQuestion(question.uuid, {
      ...question,
      answers: [
        ...(question.answers ? question.answers : []),
        {
          title: '',
          stage_uuid: null,
          to_disqualified: false,
          ...(isForIndeed && {
            value: generateUUIDV4(),
          }),
        },
      ],
    });
  };

  /**
   * This effect will update the question state in the parent component if a question
   * is.
   */
  useEffect(() => {
    setQuestion(props.question);
  }, [props.question]);

  /**
   * @return {JSX.Element}
   */
  return (
    <CardWrapper className="px-2 px-md-6 py-4 hover-on-this">
      <Badge>{index + 1}</Badge>
      <ButtonsWrapper className="to-show-this">
        <IconButton onClick={() => removeQuestion(question)}>
          <i className="fas fa-trash c-primary" />
        </IconButton>
      </ButtonsWrapper>

      <div className="w-100 mt-5 mt-md-0 d-flex px-3 pb-2">
        <Inputs
          idRef="questionSubject"
          themeClass="theme-solid"
          value={question.title || ''}
          wrapperClasses="pt-2 pr-2-reversed"
          label={t(`${translationPath}question`)}
          inputPlaceholder={t(`${translationPath}question`)}
          onInputChanged={(e) => {
            const { value } = e.target;
            setQuestion((items) => ({ ...items, title: value }));
            props.updateQuestion(question.uuid, {
              ...question,
              title: value,
            });
          }}
        />
        <AutocompleteComponent
          disableClearable
          idRef="questionType"
          wrapperClasses="pt-1"
          value={question.type}
          themeClass="theme-solid"
          translationPath={translationPath}
          data={questionsTypes || fileSelectTypesRef.current || []}
          inputPlaceholder={t(`${translationPath}select-question-type`)}
          getOptionLabel={(option) => `${t(`${translationPath}${option}`)}` || ''}
          parentTranslationPath={parentTranslationPath}
          onChange={(e, newValue) => {
            props.updateQuestion(question.uuid, {
              ...question,
              type: newValue,
            });
          }}
        />
      </div>

      {question && (
        <div>
          {!isForIndeed && (
            <div className="px-3 pb-2">
              <Inputs
                rows={4}
                multiline
                wrapperClasses="pt-1"
                themeClass="theme-solid"
                idRef="questionDescription"
                value={question.description || ''}
                label={t(`${translationPath}question-description`)}
                inputPlaceholder={t(`${translationPath}question-description`)}
                onInputChanged={(e) => {
                  const { value } = e.target;
                  setQuestion((items) => ({ ...items, description: value }));
                  props.updateQuestion(question.uuid, {
                    ...question,
                    description: value,
                  });
                }}
              />
            </div>
          )}

          {/* Multiple Choice & Checkboxes */}
          {(question.type === 'multiple_choice'
            || question.type === 'checkbox'
            || question.type === 'select'
            || question.type === 'multiselect'
            || question.type === 'dropdown') && (
            <Col md={12} xl={12} className="pl-3-reversed pt-2">
              <h3 className="font-weight-bold mb-3">
                {t(`${translationPath}answers`)}
              </h3>
              {question?.answers
                && (question.answers || []).map((answer, i) => (
                  <div
                    key={`questionAnswersKey${i + 1}`}
                    className="d-flex pl-3-reversed"
                  >
                    <AnswerWrapper>
                      <Box
                        isCircle={question.type === 'multiple_choice'}
                        className="shadow mr-4-reversed"
                      />
                      <Inputs
                        idRef="answerTitle"
                        wrapperClasses="pt-1"
                        themeClass="theme-solid"
                        value={answer.title || ''}
                        label={`${t(`${translationPath}option`)} ${i + 1}`}
                        inputPlaceholder={`${t(`${translationPath}option`)} ${
                          i + 1
                        }`}
                        onInputChanged={(e) => {
                          const { value } = e.target;
                          question.answers[i].title = value;
                          props.updateQuestion(question.uuid, {
                            ...question,
                            answers: [...question.answers],
                          });
                        }}
                      />
                      <IconButton
                        className="ml-1-reversed"
                        onClick={() => removeAnswer(i)}
                      >
                        <i className="fas fa-trash c-primary fa-xs" />
                      </IconButton>
                    </AnswerWrapper>
                    {!isForIndeed && (
                      <div className="pl-4-reversed pt-2">
                        <CheckboxesComponent
                          singleChecked={answer.to_disqualified}
                          label={t(`${translationPath}to-disqualified`)}
                          idRef={`hasSubLabels-${(index + 1) * (i + 1)}`}
                          onSelectedCheckboxChanged={() => {
                            const localAnswers = [...props.question.answers];
                            localAnswers[i].to_disqualified
                              = !localAnswers[i].to_disqualified;
                            props.updateQuestion(question.uuid, {
                              ...question,
                              answers: localAnswers,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              <div className="pl-3-reversed pt-1">
                <AnswerWrapper>
                  <Box
                    className="shadow mr-3-reversed"
                    isCircle={question.type === 'multiple_choice'}
                  />
                  <ButtonBase className="btns" onClick={() => addAnswer()}>
                    <i className="fas fa-plus mr-2-reversed" />
                    {t(`${translationPath}add-option`)}
                  </ButtonBase>
                </AnswerWrapper>
              </div>
            </Col>
          )}
          {!isForIndeed && question.type === 'file' && (
            <div className="d-flex px-3">
              <AutocompleteComponent
                idRef="questionTypes"
                wrapperClasses="pt-1"
                value={
                  (fileTypesRef.current || []).find(
                    (item) => item.key === question.fileAnswer?.file_type,
                  )
                  || (fileTypesRef.current || []).find(
                    (item) => item.key === question.file_data?.file_type,
                  )
                }
                isOptionEqualToValue={(option) =>
                  fileTypesRef.current
                  && (fileTypesRef.current || []).findIndex(
                    (item) => item.key === option,
                  ) !== -1
                }
                themeClass="theme-solid"
                translationPath={translationPath}
                data={fileTypesRef.current || []}
                parentTranslationPath={parentTranslationPath}
                inputPlaceholder={t(`${translationPath}type-of-files`)}
                getOptionLabel={(option) =>
                  `${t(`${translationPath}${option.value}`)}` || ''
                }
                onChange={(e, newValue) => {
                  props.updateQuestion(question.uuid, {
                    ...question,
                    fileAnswer: {
                      ...question?.fileAnswer,
                      file_type: newValue && newValue.key,
                      file_size: question?.fileAnswer?.file_size || '1',
                    },
                  });
                }}
              />
              <AutocompleteComponent
                idRef="questionSize"
                themeClass="theme-solid"
                translationPath={translationPath}
                data={fileSizesRef.current || []}
                wrapperClasses="pt-1 pl-2-reversed"
                inputPlaceholder={t(`${translationPath}maximum-file-size`)}
                getOptionLabel={(option) =>
                  `${t(`${translationPath}${option.value}`)}` || ''
                }
                isOptionEqualToValue={(option) =>
                  fileSizesRef.current
                  && (fileSizesRef.current || []).findIndex(
                    (item) => item.key === option,
                  ) !== -1
                }
                parentTranslationPath={parentTranslationPath}
                value={
                  (fileSizesRef.current || []).find(
                    (item) => item.key === question.fileAnswer?.file_size,
                  )
                  || (fileSizesRef.current || []).find(
                    (item) => item.key === question.file_data?.file_size,
                  )
                }
                onChange={(e, newValue) => {
                  props.updateQuestion(question.uuid, {
                    ...question,
                    fileAnswer: {
                      ...question?.fileAnswer,
                      file_size: newValue && newValue.key,
                      file_type:
                        question?.fileAnswer?.file_type
                        || question?.file_data?.file_type
                        || '2',
                    },
                  });
                }}
              />
            </div>
          )}

          {/* Card Footer */}
          <hr className="mb-3" />
          <Col className="d-flex px-0">
            <div className="d-flex align-items-center pl-3-reversed">
              <h3 className="mb-0 mr-2-reversed font-14 text-gray">
                {t(`${translationPath}required`)}
              </h3>
              <InputToggle
                checked={question.is_required}
                onChange={(newValue) => {
                  props.updateQuestion(question.uuid, {
                    ...question,
                    is_required: newValue,
                  });
                }}
              />
            </div>
            <ButtonBase
              disabled={props?.isDuplicateDisabled}
              className="btns theme-transparent"
              onClick={() => duplicateQuestion(JSON.parse(JSON.stringify(question)))}
            >
              <i className="fas fa-clone font-weight-400 fa-1x mr-2-reversed" />
              <span className="font-17">{t(`${translationPath}duplicate`)}</span>
            </ButtonBase>
          </Col>
        </div>
      )}
    </CardWrapper>
  );
};

export default QuestionCard;
