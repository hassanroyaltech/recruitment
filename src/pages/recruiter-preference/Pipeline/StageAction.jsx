/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import { FormGroup, Col, Label, Input, Row } from 'reactstrap';

import TinyMCE from 'components/Elevatus/TinyMCE';

import urls from 'api/urls';
import { preferencesAPI } from 'api/preferences';
import { selectColors, customSelectStyles } from 'shared/styles';
import Select from 'react-select';
import { generateHeaders } from 'api/headers';
import { UploaderPageEnum } from 'enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from 'components/Uploader/Uploader.Component';
import { useTranslation } from 'react-i18next';
import { FormLoader } from '../components/Loaders';
import { CheckboxesComponent } from '../../../components';
import { showError } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const StageAction = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [actionType, setActionType] = useState('1');
  const [actionDelay, setActionDelay] = useState(t(`${translationPath}no-delay`));
  const [emailTemplate, setEmailTemplate] = useState(
    t(`${translationPath}choose-email-template`),
  );
  const [videoAssessment, setVideoAssessment] = useState(
    t(`${translationPath}choose-video-assessment`),
  );
  const [questionnaire, setQuestionnaire] = useState(
    t(`${translationPath}choose-questionnaire`),
  );
  const [actionReply, setActionReply] = useState(false);
  const [defaultEmail, setDefaultEmail] = useState(props.defaultEmail);
  //  + Change Action
  const changeActionType = (newAction) => {
    setActionType(newAction);
  };

  const { addStageAction } = props;
  useEffect(() => {
    addStageAction({
      type:
        actionType == '1'
          ? 'email'
          : actionType === '2'
            ? 'video_assessment'
            : 'questionnaires',
      ...(actionType == '1' && {
        delay: actionDelay === t(`${translationPath}no-delay`) ? '0' : actionDelay,
      }),
      ...(actionType == '1' && { no_replay: actionReply }),
      uuid:
        actionType == '1'
          ? emailTemplate
          : actionType === '2'
            ? videoAssessment
            : questionnaire,
      subject: defaultEmail.subject,
      body: defaultEmail.body,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionDelay,
    actionReply,
    actionType,
    emailTemplate,
    videoAssessment,
    questionnaire,
    defaultEmail,
  ]);

  useEffect(() => {
    const currentUUID
      = actionType == '1'
        ? emailTemplate
        : actionType === '2'
          ? videoAssessment
          : questionnaire;

    // User didn't select yet; Just leave.
    if (currentUUID.includes('Choose')) return;

    // Axios Fetch APIs
    const getVideoAssessmentMail = async (uuid) => {
      setIsFetching(true);
      return await axios
        .request({
          method: 'view',
          url: urls.evassess.ASSESSMENT_GET,
          params: {
            uuid,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setDefaultEmail({
            subject: res.data.results.email_subject,
            body: res.data.results.email_body,
          });
          props.onEmailAttachmentsChanged(
            res?.data?.results?.attachment.map((item) => item.original),
          );
          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          // showError(t('Shared:failed-to-get-saved-data'), error);
        });
    };

    const getQuestionnaireMail = (uuid) => {
      setIsFetching(true);
      axios
        .request({
          method: 'view',
          url: urls.questionnaire.questionnaire_GET,
          params: {
            uuid,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          const {
            data: { results },
          } = res;
          props.onEmailAttachmentsChanged(
            results.attachment?.map((item) => item.original) || [],
          );
          setDefaultEmail({
            subject: results.email_subject,
            body: results.email_body,
          });
          setIsFetching(false);
        })
        .catch((error) => {
          // showError(t('Shared:failed-to-get-saved-data'), error);
          setIsFetching(false);
        });
    };

    const getTemplateMail = async (uuid) => {
      setIsFetching(true);
      preferencesAPI
        .getTemplateById(uuid)
        .then((response) => {
          props.onEmailAttachmentsChanged(
            response?.data?.results?.attachment.map((item) => item.original),
          );
          // Filter the email template depends on pipeline language.
          const newEmail = response?.data?.results?.translation.filter(
            (temp) => temp?.language?.id === props.language,
          )[0];
          if (newEmail)
            setDefaultEmail({
              subject: newEmail.subject,
              body: newEmail.body,
            });
          // This email template doesn't have mail with the same language as the pipeline, Return the default email.
          else setDefaultEmail(props.defaultEmail);

          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    };

    if (actionType == '1')
      // Email is changing get data from props
      getTemplateMail(currentUUID);
    else if (actionType === '2')
      // Video assessment is changing, Get data from `VIEW`
      getVideoAssessmentMail(currentUUID);
    // Questionnaire is changing, Get data from `VIEW`
    else getQuestionnaireMail(currentUUID);
  }, [actionType, emailTemplate, videoAssessment, questionnaire]);

  const [isFetching, setIsFetching] = useState(false);

  return (
    <>
      <Row>
        <Col xl={12} className="mb-2">
          <h4 className="mb-1">{t(`${translationPath}stage-action`)}</h4>
          <small className="mb-2 text-muted white-space-normal">
            {t(`${translationPath}stage-action-description`)}
          </small>
        </Col>

        <Col xl={6} lg={6} md={6} xs={12}>
          <FormGroup>
            <Select
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  ...selectColors,
                },
              })}
              styles={customSelectStyles}
              placeholder={t(`${translationPath}stage-action`)}
              onChange={(option) => {
                changeActionType(option.value);
              }}
              defaultValue={{ value: '1', label: 'Email' }}
              options={[
                { value: '1', label: t(`${translationPath}email`) },
                { value: '2', label: t(`${translationPath}video-assessment`) },
                { value: '3', label: t(`${translationPath}questionnaires`) },
              ]}
            />
          </FormGroup>
        </Col>
        {actionType == '1' && (
          <Col
            xl={6}
            lg={6}
            md={6}
            xs={12}
            className="d-inline-flex align-items-center justify-content-end"
          >
            <CheckboxesComponent
              idRef="email-reply"
              singleChecked={actionReply}
              label={t(`${translationPath}no-reply-email-address`)}
              onSelectedCheckboxChanged={(e, isChecked) => {
                setActionReply(isChecked);
              }}
            />
          </Col>
        )}
      </Row>

      <Col xl={12} lg={12} md={12} xs={12}>
        <Row className="mt-2">
          {actionType == '1' && (
            <>
              <Col xl={6} lg={6} md={6} xs={12} className="p-0 pr-3-reversed">
                <FormGroup>
                  <Label className="form-control-label w-100 " for="email-template">
                    <span>{t(`${translationPath}email-template`)}</span>{' '}
                    <div>
                      <span className="text-muted">
                        {t(
                          `${translationPath}selecting-an-email-template-is-optional`,
                        )}
                      </span>
                    </div>
                  </Label>
                  <Input
                    className="form-control-alternative"
                    type="select"
                    name="select"
                    value={emailTemplate}
                    onChange={(e) =>
                      setEmailTemplate(
                        [...e.currentTarget.options].filter(
                          (option) => option.selected === true,
                        )[0].value,
                      )
                    }
                    id="email-template"
                  >
                    <option selected disabled hidden>
                      {t(`${translationPath}choose-email-template`)}
                    </option>
                    {Object.keys(props.templates).map((temp, i) => (
                      <option value={props.templates[temp].uuid} key={i}>
                        {props.templates[temp].title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col xl={6} lg={6} md={6} xs={12}>
                <FormGroup>
                  <br />
                  <Label className="form-control-label" for="delay">
                    {t(`${translationPath}delay`)}
                  </Label>
                  <Input
                    className="form-control-alternative"
                    type="select"
                    name="select"
                    value={actionDelay}
                    onChange={(e) => setActionDelay(e.currentTarget.value)}
                    id="delay"
                  >
                    <option key={0}>{t(`${translationPath}no-delay`)}</option>
                    {props.delayList.map((delay, i) => (
                      <option key={`${i + 1}-delay`}>{delay}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </>
          )}

          {actionType === '2' && (
            <Col xl={6} lg={6} md={6} xs={12} className="p-0 pr-3-reversed">
              <FormGroup>
                <Label className="form-control-label" for="videoAssessments">
                  {t(`${translationPath}video-assessment`)}
                </Label>
                <Input
                  className="form-control-alternative"
                  type="select"
                  name="videoAssessments"
                  value={videoAssessment}
                  onChange={(e) => {
                    setVideoAssessment(
                      [...e.currentTarget.options].filter(
                        (option) => option.selected === true,
                      )[0].value,
                    );
                  }}
                  id="videoAssessments"
                >
                  <option selected disabled hidden>
                    {t(`${translationPath}choose-video-assessment`)}
                  </option>
                  {props.videoAssessments
                    && [...props.videoAssessments].map((assessment, i) => (
                      <option value={assessment.uuid} key={i}>
                        {assessment.title}
                      </option>
                    ))}
                </Input>
                {props.errors && props.errors.videoAssessment && (
                  <span className="c-error fz-10px pt-1">
                    {props.errors.videoAssessment}
                  </span>
                )}
              </FormGroup>
            </Col>
          )}

          {actionType === '3' && (
            <Col xl={6} lg={6} md={6} xs={12} className="p-0 pr-3-reversed">
              <FormGroup>
                <Label className="form-control-label" for="questionnaire">
                  {t(`${translationPath}questionnaire`)}
                </Label>
                <Input
                  className="form-control-alternative"
                  type="select"
                  name="select"
                  value={questionnaire}
                  onChange={(e) => {
                    setQuestionnaire(
                      [...e.currentTarget.options].filter(
                        (option) => option.selected === true,
                      )[0].value,
                    );
                  }}
                  id="questionnaire"
                >
                  <option selected disabled hidden>
                    {t(`${translationPath}choose-questionnaire`)}
                  </option>
                  {props.questionnaires
                    && props.questionnaires.map((questionnaire, i) => (
                      <option value={questionnaire.uuid} key={i}>
                        {questionnaire.title}
                      </option>
                    ))}
                </Input>
                {props.errors && props.errors.questionnaire && (
                  <span className="c-error fz-10px pt-1">
                    {props.errors.questionnaire}
                  </span>
                )}
              </FormGroup>
            </Col>
          )}
        </Row>
        {isFetching && <FormLoader />}
        {!isFetching && (
          <>
            <hr className="bg-dark mt-3 mb-1 opacity-1" />

            <Row>
              <Col md="12">
                <TinyMCE
                  id="editor-0"
                  value={defaultEmail.body ? defaultEmail.body : ''}
                  onChange={(value) =>
                    setDefaultEmail((defaultEmail) => ({
                      ...defaultEmail,
                      body: value,
                    }))
                  }
                  variables={props.variables}
                >
                  <Col
                    xl={6}
                    lg={6}
                    md={6}
                    xs={12}
                    className="align-items-center mt-3"
                  >
                    <FormGroup>
                      <label className="form-control-label" htmlFor="email-subject">
                        {t(`${translationPath}email-subject`) + '*'}
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="email-subject"
                        placeholder={t(`${translationPath}email-subject`)}
                        type="text"
                        value={defaultEmail.subject ? defaultEmail.subject : ''}
                        onChange={(e) => {
                          const { value } = e.currentTarget;
                          setDefaultEmail((defaultEmail) => ({
                            ...defaultEmail,
                            subject: value,
                          }));
                        }}
                      />
                    </FormGroup>
                  </Col>
                </TinyMCE>
              </Col>
            </Row>
            <div className="form-item mt-3">
              <UploaderComponent
                uploaderPage={UploaderPageEnum.PipelineAttachment}
                uploadedFiles={props.emailAttachments}
                labelValue="upload-attachments"
                parentTranslationPath="Shared"
                translationPath=""
                uploadedFileChanged={(newFiles) => {
                  props.onEmailAttachmentsChanged(newFiles);
                }}
              />
            </div>
            {/*
          <Row>
            <Col md="6">
              <Annotations
                variables={props.variables}
                addAnnotation={addAnnotation}
              />
            </Col>
          </Row>
          <Row>
            <Col xl={12} lg={12} md={12} xs={12}>
              <label className="form-control-label">Email Body</label>
              <ReactQuill
                ref={(el) => (fullQuillRef = el)}
                value={defaultEmail.body ? defaultEmail.body : ""}
                onChange={(value) =>
                  setDefaultEmail((defaultEmail) => ({
                    ...defaultEmail,
                    body: value,
                  }))
                }
                theme="snow"
                modules={{
                  toolbar: [
                    ["bold", "italic"],
                    ["link", "blockquote", "code", "image"],
                    [
                      {
                        list: "ordered",
                      },
                      {
                        list: "bullet",
                      },
                    ],
                  ],
                }}
              />
            </Col>
          </Row> */}
          </>
        )}
      </Col>
    </>
  );
};

export default StageAction;
