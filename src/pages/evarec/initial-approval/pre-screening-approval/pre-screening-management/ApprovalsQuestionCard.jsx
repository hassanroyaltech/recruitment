/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import { LanguageUpdateKey, showError } from '../../../../../helpers';
import {
  EvaluationFilesSizesEnum,
  EvaluationFilesTypesEnum,
  EvaluationQuestionsTypesEnum,
} from '../../../../../enums';

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
 * @param errors
 * @param isSubmitted
 * @param getTitleErrorPath
 * @param getDescriptionErrorPath
 * @param getOptionErrorPath
 * @param getOptionsErrorPath
 * @param parentId
 * @param parentIndex
 * @param subParentId
 * @param subParentIndex
 * @param subSubParentId
 * @param fileTypeErrorPath
 * @param fileTypeStateKey
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const QuestionCard = ({
  index,
  removeQuestion,
  duplicateQuestion,
  setNewQuestion,
  errors,
  isSubmitted,
  getTitleErrorPath,
  getDescriptionErrorPath,
  getOptionErrorPath,
  getOptionsErrorPath,
  parentId,
  parentIndex,
  subParentId,
  subParentIndex,
  subSubParentId,
  fileTypeErrorPath,
  fileTypeStateKey,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [question, setQuestion] = useState(props.question);
  const [languages, setLanguages] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const fileTypesRef = useRef(Object.values(EvaluationFilesTypesEnum));
  const fileSelectTypesRef = useRef(Object.values(EvaluationQuestionsTypesEnum));
  const fileSizesRef = useRef(Object.values(EvaluationFilesSizesEnum));

  /**
   * Remove answer constructor
   * @param answerIndex
   */
  const removeAnswer = (answerIndex) => {
    question.options.splice(answerIndex, 1);
    props.updateQuestion(question.uuid, {
      ...question,
      options: [...question.options],
    });
  };

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else showError(t('Shared:failed-to-get-languages'));
  }, [t, userReducer]);

  /**
   * Add an answer
   */
  const addAnswer = () => {
    props.updateQuestion(question.uuid, {
      ...question,
      options: [
        ...(question.options ? question.options : []),
        {
          title: { en: '' },
          stage_uuid: null,
          to_disqualified: false,
        },
      ],
    });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new language key
   */
  const addLanguageHandler = (key, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    props.updateQuestion(question.uuid, {
      ...question,
      [key]: localItem,
    });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove language key
   */
  const removeLanguageHandler = useCallback(
    (key, item, code) => () => {
      const localItem = { ...item };
      delete localItem[code];
      props.updateQuestion(question.uuid, {
        ...question,
        [key]: localItem,
      });
    },
    [props, question],
  );

  /**
   * @param parentKey - the parent key in the array
   * @param localParentIndex - the parent index in the array
   * @param item - the value of the key to update
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to add new sub language key
   */
  const addSubLanguageHandler = (parentKey, localParentIndex, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    const localAnswers = [...question.options];
    localAnswers[localParentIndex].title = localItem;

    props.updateQuestion(question.uuid, {
      ...question,
      [parentKey]: localAnswers,
    });
  };

  /**
   * @param parentKey - the parent key in the array
   * @param localParentIndex - the parent index in the array
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to remove new sub language key
   */
  const removeSubLanguageHandler = useCallback(
    (parentKey, localParentIndex, item, code) => () => {
      const localAnswers = [...question.options][localParentIndex].title;
      delete localAnswers[code];

      props.updateQuestion(question.uuid, {
        ...question,
        [parentKey]: localAnswers,
      });
    },
    [props, question],
  );

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

      <div className="pt-4">
        <div className="d-flex-v-center-h-end pb-2 px-1">
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              addLanguageHandler('title', question.title)();
            }}
            disabled={
              languages.length === 0
              || (question.title
                && languages.length === Object.keys(question.title).length)
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-language`)}</span>
          </ButtonBase>
        </div>
        {question.title
          && Object.entries(question.title).map((item, i) => (
            <React.Fragment key={`namesKey${item[0]}`}>
              {i > 0 && (
                <div className="d-flex-h-between pt-3">
                  <SharedAutocompleteControl
                    disableClearable
                    title="language"
                    stateKey="title"
                    editValue={item[0]}
                    placeholder="select-language"
                    onValueChanged={({ value }) => {
                      if (value) {
                        let localState = { ...question };
                        localState.title = LanguageUpdateKey(
                          { [item[0]]: value },
                          localState.title,
                        );
                        props.updateQuestion(question.uuid, {
                          ...question,
                          title: localState.title,
                        });
                      }
                    }}
                    initValues={getNotSelectedLanguage(
                      languages,
                      question.title,
                      undefined,
                      true,
                      item[0],
                    )}
                    initValuesKey="code"
                    initValuesTitle="title"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <ButtonBase
                    className="btns theme-transparent c-danger mx-3 mb-2"
                    onClick={() => {
                      removeLanguageHandler('title', question.title, item[0])();
                    }}
                  >
                    <span className="fas fa-times" />
                    <span className="px-1">
                      {t(`${translationPath}remove-language`)}
                    </span>
                  </ButtonBase>
                </div>
              )}
              <SharedInputControl
                idRef={`criteria-title-${item[0]}-${i}`}
                parentTranslationPath={parentTranslationPath}
                title={`${t(`${translationPath}title`)} (${getLanguageTitle(
                  languages,
                  item[0],
                )})`}
                editValue={question.title[item[0]] || ''}
                errors={errors}
                stateKey="title"
                isSubmitted={isSubmitted}
                errorPath={getTitleErrorPath && getTitleErrorPath(item)}
                parentIndex={parentIndex}
                parentId={parentId}
                subParentIndex={subParentIndex}
                subParentId={subParentId}
                isRequired
                onValueChanged={({ value }) => {
                  question.title[item[0]] = value;
                  setQuestion((items) => ({ ...items, title: items.title }));
                  props.updateQuestion(question.uuid, {
                    ...question,
                    title: question.title,
                  });
                }}
              />
            </React.Fragment>
          ))}
      </div>

      <div className="d-flex px-3">
        <SharedAutocompleteControl
          title="question-type"
          placeholder="select-question-type"
          stateKey="type"
          isFullWidth
          parentId={parentId}
          parentIndex={parentIndex}
          subParentId={subParentId}
          subParentIndex={subParentIndex}
          editValue={question.type}
          disableClearable
          onValueChanged={({ value }) => {
            props.updateQuestion(question.uuid, {
              ...question,
              type: +value,
            });
          }}
          getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
          initValues={fileSelectTypesRef.current || []}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>

      <div>
        <div className="d-flex-v-center-h-end pb-2 px-1">
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              addLanguageHandler('description', question.description)();
            }}
            disabled={
              languages.length === 0
              || (question.description
                && languages.length === Object.keys(question.description).length)
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-language`)}</span>
          </ButtonBase>
        </div>
        {question.description
          && Object.entries(question.description).map((item, i) => (
            <React.Fragment key={`namesKey${item[0]}`}>
              {i > 0 && (
                <div className="d-flex-h-between pt-3">
                  <SharedAutocompleteControl
                    disableClearable
                    title="language"
                    editValue={item[0]}
                    stateKey="description"
                    placeholder="select-language"
                    onValueChanged={(newValue) => {
                      if (newValue.value) {
                        let localState = { ...question };
                        localState.description = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localState.description,
                        );
                        props.updateQuestion(question.uuid, {
                          ...question,
                          description: localState.description,
                        });
                      }
                    }}
                    initValues={getNotSelectedLanguage(
                      languages,
                      question.description,
                      undefined,
                      true,
                      item[0],
                    )}
                    initValuesKey="code"
                    initValuesTitle="title"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <ButtonBase
                    className="btns theme-transparent c-danger mx-3 mb-2"
                    onClick={() => {
                      removeLanguageHandler(
                        'description',
                        question.description,
                        item[0],
                      )();
                    }}
                  >
                    <span className="fas fa-times" />
                    <span className="px-1">
                      {t(`${translationPath}remove-language`)}
                    </span>
                  </ButtonBase>
                </div>
              )}
              <SharedInputControl
                idRef={`criteria-description-${item[0]}-${i}`}
                parentTranslationPath={parentTranslationPath}
                title={`${t(
                  `${translationPath}criteria-description`,
                )} (${getLanguageTitle(languages, item[0])})`}
                inputPlaceholder={`${t(
                  `${translationPath}question-description`,
                )} (${getLanguageTitle(languages, item[0])})`}
                editValue={question.description[item[0]] || ''}
                errors={errors}
                stateKey="description"
                isSubmitted={isSubmitted}
                errorPath={getDescriptionErrorPath && getDescriptionErrorPath(item)}
                parentIndex={parentIndex}
                parentId={parentId}
                subParentIndex={subParentIndex}
                subParentId={subParentId}
                isRequired
                rows={4}
                multiline
                onValueChanged={({ value }) => {
                  question.description[item[0]] = value;
                  setQuestion((items) => ({
                    ...items,
                    description: items.description,
                  }));
                  props.updateQuestion(question.uuid, {
                    ...question,
                    description: question.description,
                  });
                }}
              />
            </React.Fragment>
          ))}
      </div>

      {/* Multiple Choice & Checkboxes */}
      {(question.type === EvaluationQuestionsTypesEnum.MultipleChoice.key
        || question.type === EvaluationQuestionsTypesEnum.Dropdown.key
        || question.type === EvaluationQuestionsTypesEnum.Checkbox.key) && (
        <Col md={12} xl={12} className="pl-3-reversed pt-2">
          <h3 className="font-weight-bold mb-3">{t(`${translationPath}answers`)}</h3>
          {isSubmitted && errors && errors[getOptionsErrorPath()] && (
            <div className="c-error py-1">
              <span>{errors[getOptionsErrorPath()].message}</span>
            </div>
          )}
          {question.options
            && question.options.map((answer, i) => (
              <div
                key={`questionAnswersKey${i + 1}`}
                className="d-flex pl-3-reversed align-items-center"
              >
                <AnswerWrapper>
                  <Box
                    isCircle={
                      question.type
                      === EvaluationQuestionsTypesEnum.MultipleChoice.key
                    }
                    className="shadow mr-4-reversed mt-4"
                  />
                  <div>
                    <div className="d-flex-v-center-h-end pb-2 px-1">
                      <ButtonBase
                        className="btns theme-transparent"
                        onClick={() => {
                          addSubLanguageHandler('options', i, answer.title)();
                        }}
                        disabled={
                          languages.length === 0
                          || (answer.title
                            && languages.length === Object.keys(answer.title).length)
                        }
                      >
                        <span className="fas fa-plus" />
                        <span className="px-1">
                          {t(`${translationPath}add-language`)}
                        </span>
                      </ButtonBase>
                    </div>
                    {answer.title
                      && Object.entries(answer.title).map((item, subIndex) => (
                        <React.Fragment key={`namesKey${subIndex + 1}${index + 1}`}>
                          {subIndex > 0 && (
                            <div className="d-flex-h-between pt-3">
                              <SharedAutocompleteControl
                                disableClearable
                                title="language"
                                stateKey="title"
                                editValue={item[0]}
                                placeholder="select-language"
                                onValueChanged={({ value }) => {
                                  if (value) {
                                    let localState = { ...answer };
                                    localState.title = LanguageUpdateKey(
                                      { [item[0]]: value },
                                      localState.title,
                                    );
                                    // localState.title[value] = item[1];
                                    // delete localState.title[item[0]];
                                    let questionOptionsClone = [...question.options];
                                    questionOptionsClone[i] = localState;
                                    props.updateQuestion(question.uuid, {
                                      ...question,
                                      options: [...questionOptionsClone],
                                    });
                                  }
                                }}
                                initValues={getNotSelectedLanguage(
                                  languages,
                                  answer.title,
                                  undefined,
                                  true,
                                  item[0],
                                )}
                                initValuesKey="code"
                                initValuesTitle="title"
                                parentTranslationPath={parentTranslationPath}
                              />
                              <ButtonBase
                                className="btns theme-transparent c-danger mx-3 mb-2"
                                onClick={() => {
                                  removeSubLanguageHandler(
                                    'title',
                                    i,
                                    answer.title,
                                    item[0],
                                  )();
                                }}
                              >
                                <span className="fas fa-times" />
                                <span className="px-1">
                                  {t(`${translationPath}remove-language`)}
                                </span>
                              </ButtonBase>
                            </div>
                          )}
                          <SharedInputControl
                            parentTranslationPath={parentTranslationPath}
                            title={`${t(`${translationPath}option`)} ${
                              i + 1
                            } (${getLanguageTitle(languages, item[0])})`}
                            editValue={answer.title[item[0]] || ''}
                            errors={errors}
                            stateKey="title"
                            isSubmitted={isSubmitted}
                            errorPath={
                              getOptionErrorPath && getOptionErrorPath(item, i)
                            }
                            wrapperClasses="mb-0"
                            parentIndex={parentIndex}
                            parentId={parentId}
                            subParentIndex={subParentIndex}
                            subParentId={subParentId}
                            subSubParentId={subSubParentId}
                            subSubParentIndex={i}
                            isRequired
                            onValueChanged={({ value }) => {
                              question.options[i].title[item[0]] = value;
                              props.updateQuestion(question.uuid, {
                                ...question,
                                options: [...question.options],
                              });
                            }}
                          />
                        </React.Fragment>
                      ))}
                  </div>
                  <IconButton
                    className="ml-1-reversed mt-4"
                    onClick={() => removeAnswer(i)}
                  >
                    <i className="fas fa-trash c-primary fa-xs" />
                  </IconButton>
                </AnswerWrapper>
              </div>
            ))}
          <div className="pl-3-reversed pt-1">
            <AnswerWrapper>
              <Box
                className="shadow mr-3-reversed"
                isCircle={
                  question.type === EvaluationQuestionsTypesEnum.MultipleChoice.key
                }
              />
              <ButtonBase className="btns" onClick={() => addAnswer()}>
                <i className="fas fa-plus mr-2-reversed" />
                {t(`${translationPath}add-option`)}
              </ButtonBase>
            </AnswerWrapper>
          </div>
        </Col>
      )}
      {question.type === EvaluationQuestionsTypesEnum.Files.key && (
        <div className="d-flex px-2 mt-3">
          <SharedAutocompleteControl
            isHalfWidth
            title="type-of-files"
            errors={errors}
            stateKey={fileTypeStateKey}
            parentId={parentId}
            parentIndex={parentIndex}
            subParentId={subParentId}
            subParentIndex={subParentIndex}
            placeholder={
              (question.description
                && (question.description[i18next.language]
                  || question.description.en))
              || undefined
            }
            editValue={
              question.file_answer?.file_type || question.file_data?.file_type
            }
            isSubmitted={isSubmitted}
            onValueChanged={({ value }) => {
              props.updateQuestion(question.uuid, {
                ...question,
                file_answer: {
                  ...question?.file_answer,
                  file_type: value,
                },
              });
            }}
            initValues={fileTypesRef.current || []}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            errorPath={fileTypeErrorPath}
            getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
          />
          <SharedAutocompleteControl
            isHalfWidth
            title="maximum-file-size"
            errors={errors}
            stateKey={fileTypeStateKey}
            parentId={parentId}
            parentIndex={parentIndex}
            subParentId={subParentId}
            subParentIndex={subParentIndex}
            placeholder={
              (question.description
                && (question.description[i18next.language]
                  || question.description.en))
              || undefined
            }
            editValue={
              question.file_answer?.file_size || question.file_data?.file_size
            }
            isSubmitted={isSubmitted}
            onValueChanged={({ value }) => {
              props.updateQuestion(question.uuid, {
                ...question,
                file_answer: {
                  ...question?.file_answer,
                  file_size: value,
                },
              });
            }}
            initValues={fileSizesRef.current || []}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            errorPath={fileTypeErrorPath}
            getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
          />
        </div>
      )}

      {/* Card Footer */}
      <hr className="mb-3" />
      <Col className="d-flex px-0">
        <ButtonBase
          className="btns theme-transparent"
          onClick={() => duplicateQuestion(JSON.parse(JSON.stringify(question)))}
        >
          <i className="fas fa-clone font-weight-400 fa-1x mr-2-reversed" />
          <span className="font-17">{t(`${translationPath}duplicate`)}</span>
        </ButtonBase>
      </Col>
    </CardWrapper>
  );
};

QuestionCard.propTypes = {
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  getTitleErrorPath: PropTypes.func,
  getDescriptionErrorPath: PropTypes.func,
  getOptionErrorPath: PropTypes.func,
  getOptionsErrorPath: PropTypes.func,
  parentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentId: PropTypes.string,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  fileTypeErrorPath: PropTypes.string,
  fileTypeStateKey: PropTypes.string,
  fileSizeErrorPath: PropTypes.string,
  fileSizeStateKey: PropTypes.string,
};
QuestionCard.defaultProps = {
  errors: {},
  isSubmitted: false,
  getTitleErrorPath: undefined,
  getDescriptionErrorPath: undefined,
  getOptionErrorPath: undefined,
  getOptionsErrorPath: undefined,
  parentId: undefined,
  parentIndex: undefined,
  subParentId: undefined,
  subParentIndex: undefined,
  subSubParentId: undefined,
  fileTypeErrorPath: undefined,
  fileTypeStateKey: undefined,
  fileSizeErrorPath: undefined,
  fileSizeStateKey: undefined,
};
export default QuestionCard;
