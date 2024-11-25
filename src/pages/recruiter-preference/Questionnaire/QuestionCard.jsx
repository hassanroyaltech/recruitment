/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Card, FormGroup, Input, Row, Col } from 'reactstrap';
import InputToggle from 'components/Inputs/InputToggle';
import { useTranslation } from 'react-i18next';
import { Inputs, RadiosComponent } from '../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../../assets/icons';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

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

const StyledRow = styled(Row)`
  margin-bottom: 1rem;
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

const QuestionCard = ({
  index,
  removeQuestion,
  duplicateQuestion,
  stages,
  fileSizes,
  fileTypes,
  profileBuilder,
  isEdit,
  isLoading,
  isWithChatGPTButton,
  handleGPTButtonClick,
  originalIndex,
  ...props
}) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const [question, setQuestion] = useState(props.question);
  const [isLogicJump, setIsLogicJump] = useState(
    props.question?.answers?.some((item) => item.stage_uuid) || false,
  );

  const removeAnswer = (answerIndex) => {
    question.answers.splice(answerIndex, 1);

    setQuestion((items) => ({
      ...items,
      answers: [...question.answers],
    }));

    props.updateQuestion(question.uuid, {
      ...question,
      answers: [...question.answers],
    });
  };

  const addAnswer = () => {
    setQuestion((items) => ({
      ...items,
      answers: [
        ...(question.answers ? question.answers : []),
        {
          title: '',
          stage_uuid: null,
          to_disqualified: false,
          is_other: false,
        },
      ],
    }));

    props.updateQuestion(question.uuid, {
      ...question,
      answers: [
        ...(question.answers ? question.answers : []),
        {
          title: '',
          stage_uuid: null,
          to_disqualified: false,
          is_other: false,
        },
      ],
    });
  };

  return (
    <CardWrapper className="px-3 px-md-6 py-4 hover-on-this">
      <Badge>{index}</Badge>
      <ButtonsWrapper>
        <div className="d-inline-flex-v-center">
          {isWithChatGPTButton && (
            <ButtonBase
              onClick={(e) => {
                handleGPTButtonClick(e)({
                  index: originalIndex,
                  type: question.type === 1 ? 'text' : question.type,
                });
              }}
              className="btns-icon theme-solid mx-2"
              disabled={
                ![1, 'text', 'checkbox', 'multiple_choice'].includes(
                  question.type,
                ) || isLoading
              }
            >
              {isLoading && props?.activeQuestion?.index === originalIndex ? (
                <span className="fas fa-circle-notch fa-spin m-1" />
              ) : (
                <ChatGPTIcon />
              )}
            </ButtonBase>
          )}
          <Button
            color="link"
            className="btn nav-link text-gray font-weight-normal mt-1 to-show-this"
            onClick={() => removeQuestion(question)}
          >
            <i className="fas fa-trash" />
          </Button>
        </div>
      </ButtonsWrapper>

      {question && (
        <div>
          <StyledRow>
            <div className="w-100 mt-5 mt-md-0">
              <Col xl={6} lg={6} md={6} xs={12}>
                <Inputs
                  idRef="questionTitleRef"
                  themeClass="theme-solid"
                  wrapperClasses="mt-2 mb-2"
                  inputPlaceholder="question"
                  value={question.title || ''}
                  translationPath={translationPath}
                  parentTranslationPath={mainParentTranslationPath}
                  onInputChanged={(event) => {
                    const { value } = event.target;

                    setQuestion((items) => ({
                      ...items,
                      title: value,
                    }));

                    props.updateQuestion(question.uuid, {
                      ...question,
                      title: value,
                    });
                  }}
                />
              </Col>

              <Col xl={6} lg={6} md={6} xs={12}>
                <FormGroup>
                  <Input
                    className="form-control-md form-control-alternative not--included"
                    type="select"
                    value={question.type || ''}
                    onChange={(e) => {
                      const { value } = e.currentTarget;
                      if (value === 'multiple_choice' || value === 'checkbox')
                        addAnswer();

                      setQuestion((items) => ({
                        ...items,
                        type: value,
                      }));

                      props.updateQuestion(question.uuid, {
                        ...question,
                        type: value,
                      });
                    }}
                  >
                    {['text', 'multiple_choice', 'checkbox', 'file'].map(
                      (type, i) => (
                        <option key={`questionTypeKey${i + 1}`} value={type}>
                          {t(`${translationPath}${type}`)}
                        </option>
                      ),
                    )}
                  </Input>
                </FormGroup>
              </Col>
            </div>
          </StyledRow>

          <StyledRow>
            <Col xl={12}>
              <FormGroup>
                <Input
                  className="form-control-md form-control-alternative"
                  placeholder={t(`${translationPath}question-description`)}
                  type="text"
                  value={question.description || ''}
                  onChange={(e) => {
                    const { value } = e.currentTarget;

                    setQuestion((items) => ({
                      ...items,
                      description: value,
                    }));

                    props.updateQuestion(question.uuid, {
                      ...question,
                      description: value,
                    });
                  }}
                />
              </FormGroup>
            </Col>
          </StyledRow>
          {/* Multiple Choice & Checkboxes */}
          {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
            <Col md={12} xl={12} className="px-0">
              <h3 className="font-weight-bold mb-3">
                {t(`${translationPath}answers`)}
              </h3>
              {question.answers
                && (question.answers || []).map((answer, i) => (
                  <Row key={`questionAnswersKey${i + 1}`}>
                    <Col sm={12} md={6}>
                      <AnswerWrapper>
                        <Box
                          isCircle={question.type === 'multiple_choice'}
                          className="shadow mr-4-reversed"
                        />
                        <Input
                          className="form-control-md form-control-alternative"
                          placeholder={`${t(`${translationPath}option`)} ${i + 1}`}
                          type="text"
                          value={answer.title || ''}
                          onChange={(e) => {
                            const { value } = e.currentTarget;
                            question.answers[i].title = value;

                            setQuestion((items) => ({
                              ...items,
                              answers: [...question.answers],
                            }));

                            props.updateQuestion(question.uuid, {
                              ...question,
                              answers: [...question.answers],
                            });
                          }}
                        />
                        <RadiosComponent
                          idRef={`radioIsOtherRef${i + 1}`}
                          singleLabelValue="is-other"
                          value={answer.is_other}
                          onSelectedRadioClicked={() => {
                            const localAnswers = [...props.question.answers];
                            const otherIndex = localAnswers.findIndex(
                              (element) => element.is_other,
                            );
                            if (otherIndex !== -1 && otherIndex !== i)
                              localAnswers[otherIndex].is_other = false;
                            localAnswers[i].is_other = !localAnswers[i].is_other;

                            setQuestion((items) => ({
                              ...items,
                              answers: localAnswers,
                            }));

                            props.updateQuestion(question.uuid, {
                              ...question,
                              answers: localAnswers,
                            });
                          }}
                          parentTranslationPath="Shared"
                          translationPathForData=""
                        />
                        <Button
                          color="link"
                          className="btn nav-link text-gray font-weight-normal ml-2-reversed"
                          onClick={() => removeAnswer(i)}
                        >
                          <i className="fas fa-trash fa-1x" />
                        </Button>
                      </AnswerWrapper>
                    </Col>

                    {isLogicJump && (
                      <Col xs={6}>
                        <Input
                          className="form-control-md form-control-alternative "
                          id={`select-${index}`}
                          type="select"
                          value={answer.stage_uuid ? answer.stage_uuid : ''}
                          onChange={(e) => {
                            const { value } = e.currentTarget;
                            question.answers[i].stage_uuid
                              = value === '0' ? null : value;

                            setQuestion((items) => ({
                              ...items,
                              answers: [...question.answers],
                            }));

                            props.updateQuestion(question.uuid, {
                              ...question,
                              answers: [...question.answers],
                            });
                          }}
                        >
                          <option value="0">
                            {t(`${translationPath}dont-move`)}
                          </option>
                          {stages.map((stage, subIndex) => (
                            <option
                              key={`stagesDontMoveKey${
                                (index + 1) * (subIndex + 1)
                              }`}
                              value={stage.uuid}
                            >
                              {stage.title}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    )}
                  </Row>
                ))}
              <AnswerWrapper>
                {/* <Box
              className='shadow mr-4'
              isCircle={question.type === 'multiple_choice'}
            /> */}
                <i
                  style={{ width: 25, height: 25 }}
                  className="fas fa-plus fa-lg text-main mr-3-reversed d-inline-flex justify-content-center align-items-center"
                />

                <Button
                  color="link"
                  className="btn nav-link text-primary font-weight-normal"
                  onClick={() => addAnswer()}
                >
                  {t(`${translationPath}add-option`)}
                </Button>
              </AnswerWrapper>
            </Col>
          )}

          {question.type === 'file' && (
            <Row>
              <Col md={6}>
                <Input
                  className="form-control-md form-control-alternative mb-2"
                  type="select"
                  placeholder={t(`${translationPath}type-of-files`)}
                  onChange={(o) => {
                    const v = o.currentTarget.value;

                    setQuestion((items) => ({
                      ...items,
                      fileAnswer: {
                        ...question?.fileAnswer,
                        file_type: v,
                      },
                    }));

                    props.updateQuestion(question.uuid, {
                      ...question,
                      fileAnswer: {
                        ...question?.fileAnswer,
                        file_type: v,
                      },
                    });
                  }}
                  value={
                    question.fileAnswer?.file_type
                    || (question.file_data && question.file_data?.file_type)
                    || '2'
                  }
                >
                  {fileTypes
                    && Object.keys(fileTypes).map((o, i) => (
                      <option key={`fileTypeKey${i + 1}`} value={o}>
                        {fileTypes[o]}
                      </option>
                    ))}
                </Input>
              </Col>

              <Col md={6}>
                <Input
                  className="form-control-md form-control-alternative "
                  type="select"
                  placeholder={t(`${translationPath}maximum-file-size`)}
                  onChange={(o) => {
                    const v = o.currentTarget.value;

                    setQuestion((items) => ({
                      ...items,
                      fileAnswer: {
                        ...question?.fileAnswer,
                        file_size: v,
                      },
                    }));

                    props.updateQuestion(question.uuid, {
                      ...question,
                      fileAnswer: {
                        ...question?.fileAnswer,
                        file_size: v,
                      },
                    });
                  }}
                  value={
                    question.fileAnswer?.file_size
                    || (question.file_data && question.file_data.file_size)
                    || ' 1 '
                  }
                >
                  {fileSizes
                    && Object.keys(fileSizes).map((o, i) => (
                      <option key={`fileSizeKey${i + 1}`} value={o}>
                        {fileSizes[o]}
                      </option>
                    ))}
                </Input>
              </Col>
              {/* <Col md={6}>
              <Input
                className='form-control-md form-control-alternative '
                type='select'
                placeholder='Maximum number of files'
              >
                {[1, 2, 3, 4, 5].map((o, i) => (
                  <option key={i} value={o}>
                    {o}
                  </option>
                ))}
              </Input>
            </Col> */}
            </Row>
          )}

          {question.type === 'yes_no' && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <label htmlFor={`yes-select-${index}`} className="font-12">
                    {t(`${translationPath}if-yes-move-to`)}
                  </label>
                  <Input
                    className="form-control-md form-control-alternative"
                    id={`yes-select-${index}`}
                    type="select"
                    value={
                      question.YesNoAnswer?.YesAnswer?.stage_uuid
                      || (question.answers && question.answers[0]?.stage_uuid)
                      || ' '
                    }
                    onChange={(e) => {
                      const { value } = e.currentTarget;

                      setQuestion((items) => ({
                        ...items,
                        YesNoAnswer: {
                          ...question.YesNoAnswer,
                          YesAnswer: {
                            stage_uuid: value,
                          },
                        },
                      }));

                      props.updateQuestion(question.uuid, {
                        ...question,
                        YesNoAnswer: {
                          ...question.YesNoAnswer,
                          YesAnswer: {
                            stage_uuid: value,
                          },
                        },
                      });
                    }}
                  >
                    <option hidden selected>
                      {t(`${translationPath}select-stage`)}
                    </option>
                    {stages.map((stage, i) => (
                      <option key={`stageOptionsKey${i + 1}`} value={stage.uuid}>
                        {stage.title}
                      </option>
                    ))}
                  </Input>
                </Col>

                <Col md={6}>
                  <label htmlFor={`no-select-${index}`} className="font-12">
                    {t(`${translationPath}if-no-move-to`)}
                  </label>
                  <Input
                    className="form-control-md form-control-alternative"
                    id={`no-select-${index}`}
                    type="select"
                    value={
                      question.YesNoAnswer?.NoAnswer?.stage_uuid
                      || (question.answers && question.answers[1]?.stage_uuid)
                      || ''
                    }
                    onChange={(e) => {
                      const { value } = e.currentTarget;

                      setQuestion((items) => ({
                        ...items,
                        YesNoAnswer: {
                          ...question.YesNoAnswer,
                          NoAnswer: {
                            stage_uuid: value,
                          },
                        },
                      }));

                      props.updateQuestion(question.uuid, {
                        ...question,
                        YesNoAnswer: {
                          ...question.YesNoAnswer,
                          NoAnswer: {
                            stage_uuid: value,
                          },
                        },
                      });
                    }}
                  >
                    <option hidden selected>
                      {t(`${translationPath}select-stage`)}
                    </option>
                    {stages.map((stage, i) => (
                      <option key={`StageTitleKey${i + 1}`} value={stage.uuid}>
                        {stage.title}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>
            </>
          )}

          {/* Card Footer */}
          <hr className="mb-3" />
          <Col className="d-flex px-0">
            <div className="d-inline-flex align-items-center">
              <h3 className="mb-0 mr-2-reversed font-14 text-gray">
                {t(`${translationPath}required`)}
              </h3>
              <InputToggle
                checked={question.is_required}
                onChange={(newValue) => {
                  setQuestion((items) => ({
                    ...items,
                    is_required: newValue,
                  }));

                  props.updateQuestion(question.uuid, {
                    ...question,
                    is_required: newValue,
                  });
                }}
              />
            </div>

            <ButtonBase
              className="btns theme-transparent mx-2"
              onClick={() => duplicateQuestion(JSON.parse(JSON.stringify(question)))}
            >
              <i className="fas fa-clone font-weight-400 fa-1x mr-2-reversed" />
              <span className="font-17">{t(`${translationPath}duplicate`)}</span>
            </ButtonBase>

            {(question.type === 'multiple_choice' || question.type === 'checkbox')
              && (!isEdit || (profileBuilder && !profileBuilder.is_default)) && (
              <Button
                color="link"
                className={`btn nav-link ${
                  isLogicJump ? 'text-primary' : 'text-gray'
                } shadow--hover font-weight-normal`}
                onClick={() => setIsLogicJump((items) => !items)}
              >
                <i className="fas fa-code-branch font-weight-700 fa-1x mr-2-reversed" />
                <span className="font-17">
                  {t(`${translationPath}logic-jump`)}
                </span>
              </Button>
            )}
          </Col>
        </div>
      )}
    </CardWrapper>
  );
};
export default QuestionCard;
