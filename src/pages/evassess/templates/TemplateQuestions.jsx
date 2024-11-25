import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Input,
  option,
  Row,
} from 'reactstrap';
import TagsInput from 'react-tagsinput';
import '../../../assets/scss/elevatus/_question.scss';

export const TemplateQuestions = ({
  collapsesToggle,
  onDelete,
  question,
  index,
  handleChange,
  hadleSelectTimeLimt,
  hadleSelectRetake,
  handleTagsInput,
  keywords,
  timeLimits,
  NumberOfRetake,
}) => (
  <Col>
    <Card>
      <CardHeader>
        <Row>
          <Col>
            <h5 className="mb-0">
              <button
                className="btn btn-link"
                onClick={() => {
                  collapsesToggle(index);
                }}
                aria-expanded={index + 1 === 1 ? 'true' : question.isOpen}
              >
                Question # {index + 1}
              </button>
            </h5>
          </Col>
          <Col>
            {index !== 0 && (
              <div
                className="text-danger "
                onClick={() => onDelete(index)}
                style={{
                  float: 'right',
                  cursor: 'pointer',
                }}
              >
                <i className="ni ni-fat-remove" />
              </div>
            )}
          </Col>
        </Row>
      </CardHeader>
      <Collapse role="tabpanel" isOpen={index + 1 === 1 ? 'true' : question.isOpen}>
        <CardBody>
          <div className="row">
            <div className="col">
              <div
                className="form-group"
                style={{
                  marginBottom: '80px',
                }}
              >
                <label className="form-control-label">Question</label>
                <input
                  className={
                    question.questionError
                      ? 'form-control form-control-sm error'
                      : 'form-control form-control-sm'
                  }
                  type="text"
                  placeholder="Enter Question?"
                  value={question.title}
                  name="title"
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="row mt-5">
                <div className="col">
                  <div className="form-group">
                    <label className="form-control-label">Time Limit</label>
                    <Input
                      type="select"
                      className="form-control-sm"
                      name="time_limit"
                      onChange={(e) => hadleSelectTimeLimt(e, index)}
                      value={question.time_limit ? question.time_limit : ''}
                    >
                      {timeLimits.map((limit, i) => (
                        <option key={i} value={limit}>
                          {limit}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label className="form-control-label">Number of Retake</label>
                    <Input
                      type="select"
                      className="form-control-sm"
                      name="time_limit"
                      onChange={(e) => hadleSelectRetake(e, index)}
                      value={
                        question.number_of_retake ? question.number_of_retake : ''
                      }
                    >
                      {NumberOfRetake.map((limit, i) => (
                        <option key={i} value={limit}>
                          {limit}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="form-control-label">Model answer</label>
                <textarea
                  className="form-control"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="this is a model answer Question"
                  rows="4"
                  name="model_answer"
                  value={question.model_answer}
                  onChange={(e) => handleChange(e, index)}
                />
              </div>
              <div className="form-group">
                <label className="form-control-label">Keyword</label>
                <TagsInput
                  onChange={(e) => handleTagsInput(e, index)}
                  value={
                    question.tagsinput && question.tagsinput.length > 0
                      ? question.tagsinput
                      : []
                  }
                  inputProps={{
                    className: '',
                    placeholder: 'Enter Keyword',
                  }}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Collapse>
    </Card>
  </Col>
);
