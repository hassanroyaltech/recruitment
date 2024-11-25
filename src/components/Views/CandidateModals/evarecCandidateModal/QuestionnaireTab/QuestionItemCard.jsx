import React, { useMemo } from 'react';
import { Card, Col, Input, Row } from 'reactstrap';
import TextField from '@mui/material/TextField';
import { RadioBox } from '../../../../Elevatus/RadioBox';
// Import Image Card
import ThumbnailItemCard from '../VideoAssessmentTab/ThumbnailItemCard';
import { CheckboxesComponent } from 'components';
import { useTranslation } from 'react-i18next';

const colors = ['#a5cf82', '#a382cf', '#82cfc5', '#82a5cf'];
const translationPath = 'QuestionItemCardComponent.';
const QuestionItemCard = ({ index, question, answer, parentTranslationPath }) => {
  const { t } = useTranslation(parentTranslationPath || 'EvarecCandidateModel');
  const formItems = useMemo(() => {
    switch (question?.type) {
    case 1:
      // Text questions
      return (
        <div className="question-item">
          <TextField
            fullWidth
            multiline
            disabled
            rows={4}
            className="mt-4"
            id="model_answer"
            name="model_answer"
            variant="outlined"
            size="small"
            defaultValue={answer.answer && answer.answer.text}
          />
        </div>
      );
    case 2:
      // multiple choice / YesNo Questions
      return (
        <div className="question-item">
          <RadioBox answers={question?.answer} />
        </div>
      );
    case 3:
      // Dropdown Questions
      return (
        <div className="question-item">
          <Input className="form-control-alternative" type="select">
            <option selected disabled>
              {question.answer?.map((item) => {
                if (item?.candidate_answer === true) return item?.title;
              })}
            </option>
            {question?.options?.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
            <option value="Others">{t(`${translationPath}others`)}</option>
          </Input>
        </div>
      );
    case 4:
      // Checkbox Questions
      return question.answer?.map((item, index) => (
        <Col key={index} xs={12} md={6} className="question-item">
          <div className="w-100 question-item-option">
            <CheckboxesComponent
              idRef={`${question?.title}-${item.uuid}-${index}`}
              singleChecked={item.candidate_answer}
              label={item.title}
              isDisabled
            />
          </div>
        </Col>
      ));
    case 6:
      // File Questions
      return (
        <Row className="mt-4 w-100">
          {Array.isArray(question.answer?.media) ? (
            question.answer?.media.map((q) => (
              <Col
                xs={6}
                sm={6}
                md={4}
                lg={3}
                className="mb-2"
                style={{ width: 134, height: 92 }}
                key={q.uuid}
              >
                <a download rel="noreferrer" target="_blank" href={q.url}>
                  <ThumbnailItemCard
                    img={q.url}
                    title={q.type}
                    extension={q.extension}
                  />
                </a>
              </Col>
            ))
          ) : (
            <Col
              xs={6}
              sm={6}
              md={4}
              lg={3}
              className="mb-2"
              style={{ width: 134, height: 92 }}
            >
              <a
                download
                rel="noreferrer"
                target="_blank"
                href={question.answer?.media?.url}
              >
                <ThumbnailItemCard
                  img={question.answer?.media?.url}
                  title={question.answer?.media?.type}
                  extension={question.answer?.media?.extension}
                />
              </a>
            </Col>
          )}
        </Row>
      );
    default:
      return null;
    }
  }, [question]);

  return (
    <Card className="question-item-card">
      <div
        className="question-item-number"
        style={{ background: colors[index % colors.length] }}
      >
        {index < 10 ? `0${index}` : index}
      </div>
      <div className="font-weight-bold ml-3-reversed mb-1">{question?.title}</div>
      <div className="text-primary ml-3-reversed mt-2">{question?.description}</div>
      {question.candidate_is_answered === true ? (
        <Row className="mt-3">{formItems}</Row>
      ) : (
        <div className="text-primary ml-3-reversed mt-2">
          {t(`${translationPath}question-is-not-answered-yet`)}
        </div>
      )}
    </Card>
  );
};

export default QuestionItemCard;
