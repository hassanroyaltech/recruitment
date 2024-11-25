import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import { FormGroup, Col, Label, Input, Row } from 'reactstrap';
import TinyMCE from 'components/Elevatus/TinyMCE';
import urls from 'api/urls';
import { selectColors, customSelectStyles } from 'shared/styles';
import Select from 'react-select';
import { generateHeaders } from 'api/headers';
import { preferencesAPI } from 'api/preferences';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FormLoader } from '../components/Loaders';
import { CheckboxesComponent, UploaderComponent } from '../../../components';
import { UploaderPageEnum } from '../../../enums/Pages/UploaderPage.Enum';
import { showError } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const StageAction = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [action, setAction] = useState(props.action);

  useEffect(() => {
    if (!props.action) return;
    setAction(props.action);
  }, [props.action]);

  const [actionType, setActionType] = useState(props.action.type);
  const [actionDelay, setActionDelay] = useState(
    props.action.delay ? props.action.delay : t(`${translationPath}no-delay`),
  );

  const [emailTemplate, setEmailTemplate] = useState(
    props.action.type == 'email'
      ? props.action.uuid
      : t(`${translationPath}choose-email-template`),
  );

  const [videoAssessment, setVideoAssessment] = useState(
    props.action.type == 'video_assessment'
      ? props.action.uuid
      : t(`${translationPath}choose-video-assessment`),
  );

  const [questionnaire, setQuestionnaire] = useState(
    props.action.type == 'questionnaires'
      ? props.action.uuid
      : t(`${translationPath}choose-questionnaire`),
  );

  const [actionReply, setActionReply] = useState(action.no_replay);

  const [isFetching, setIsFetching] = useState(false);

  const [defaultEmail, setDefaultEmail] = useState();

  const [email, setEmail] = useState(
    props.action.subject !== null
      && props.action.body !== null && {
      subject: props.action.subject,
      body: props.action.body,
    },
  );
  //  + Change Action
  const changeActionType = (newAction) => {
    setIsFetching(true);
    props.onEmailAttachmentsChanged([]);
    setActionType(newAction);
    setTimeout(() => {
      setIsFetching(false);
    }, 700);
  };

  // This validation for both Add/Edit Stage
  const StageModalSchema = Yup.object().shape({
    videoAssessment: Yup.string()
      .nullable()
      .test(
        'isRequired',
        t('Shared:required'),
        () =>
          action
          || (action && action.type && action.type !== 'video_assessment')
          || (action
            && action.type
            && action.uuid
            && action.uuid !== t(`${translationPath}choose-video-assessment`)),
      ),
    questionnaire: Yup.string()
      .nullable()
      .test(
        'isRequired',
        t('Shared:required'),
        () =>
          action
          || (action && action.type && action.type !== 'questionnaires')
          || (action
            && action.type
            && action.uuid
            && action.uuid !== t(`${translationPath}choose-questionnaire`)),
      ),
  });

  const { addStageAction } = props;
  useEffect(() => {
    addStageAction({
      type: actionType,
      ...(actionType === 'email' && {
        delay: actionDelay === t(`${translationPath}no-delay`) ? '0' : actionDelay,
      }),
      ...(actionType == 'email' && { no_replay: actionReply }),
      uuid:
        actionType === 'email'
          ? emailTemplate
          : actionType === 'video_assessment'
            ? videoAssessment
            : actionType === 'questionnaires'
              ? questionnaire
              : null,
      subject: email.subject,
      body: email.body,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionDelay,
    actionReply,
    actionType,
    emailTemplate,
    videoAssessment,
    questionnaire,
    email,
  ]);

  useEffect(() => {
    const currentUUID
      = actionType === 'email'
        ? emailTemplate
        : actionType === 'video_assessment'
          ? videoAssessment
          : actionType === 'questionnaires'
            ? questionnaire
            : null;

    // User didn't select yet; Just leave.
    if (!currentUUID || currentUUID.includes('Choose')) return;

    // Axios Fetch APIs
    const getVideoAssessmentMail = async (uuid) => {
      setIsFetching(true);
      const result = await axios
        .request({
          method: 'view',
          url: urls.evassess.ASSESSMENT_GET,
          params: {
            uuid,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          props.onEmailAttachmentsChanged(
            res?.data?.results?.attachment?.map((item) => item.original) || [],
          );
          setDefaultEmail({
            subject: res.data.results.email_subject,
            body: res.data.results.email_body,
          });
          setEmail({
            subject: res.data.results.email_subject,
            body: res.data.results.email_body,
          });
          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
      return result;
    };

    const getQuestionnaireMail = async (uuid) => {
      setIsFetching(true);
      const result = await axios
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
          setEmail({
            subject: results.email_subject,
            body: results.email_body,
          });
          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });

      return result;
    };

    const getTemplateMail = async (uuid) => {
      setIsFetching(true);
      preferencesAPI
        .getTemplateById(uuid)
        .then((response) => {
          props.onEmailAttachmentsChanged(
            response?.data?.results?.attachment?.map((item) => item.original) || [],
          );
          // Filter the email template depends on pipeline language.
          const newEmail = response?.data?.results?.translation.filter(
            (temp) => temp?.language?.id === props.language,
          )[0];
          if (newEmail) {
            setDefaultEmail({
              subject: newEmail.subject,
              body: newEmail.body,
            });
            setEmail({
              subject: newEmail.subject,
              body: newEmail.body,
            });
          }
          // This email template doesn't have mail with the same language as the pipeline, Return the default email.
          else {
            setEmail(props.defaultEmail);
            setDefaultEmail(props.defaultEmail);
          }

          setIsFetching(false);
        })
        .catch((error) => {
          setIsFetching(false);
        });
    };

    if (actionType === 'email')
      // Email Template is changing, Get data from `VIEW`
      getTemplateMail(currentUUID);
    else if (actionType === 'video_assessment')
      // Video assessment is changing, Get data from `VIEW`
      getVideoAssessmentMail(currentUUID);
    else if (actionType === 'questionnaires')
      // Questionnaire is changing, Get data from `VIEW`
      getQuestionnaireMail(currentUUID);
  }, [actionType, emailTemplate, videoAssessment, questionnaire]);
  // useEffect(() => {
  //   if (props.action)
  //     setEmail((items) => ({
  //       ...items,
  //       subject: props.action.subject,
  //       body: props.action.body,
  //     }));
  //
  // }, [props.action]);

  useEffect(() => {
    if (props.action && props.action.subject !== null && props.action.body !== null)
      setDefaultEmail({ subject: props.action.subject, body: props.action.body });
    else setDefaultEmail(props.defaultEmail);
  }, []);

  useEffect(() => {
    if (props.stageData && props.stageData.email_body)
      setEmail((items) => ({
        ...items,
        type: items.type ?? props.stageData.action_type,
        uuid: items.uuid ?? props.stageData.relation_uuid,
        delay: items.delay ?? props.stageData.delay,
        subject:
          items.subject ?? props?.stageData?.type === 1
            ? props?.defaultEmail?.subject
            : props?.stageData?.email_subject,
        body: items.body ?? props.stageData.email_body,
      }));
  }, [props?.defaultEmail?.subject, props.stageData]);

  return (
    <>
      <Formik validationSchema={StageModalSchema}>
        <div>
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
                  placeholder={t(`${translationPath}select-action`)}
                  className="customSelect"
                  onChange={(option) => {
                    changeActionType(option.value);
                  }}
                  defaultValue={[
                    { value: 'email', label: t(`${translationPath}email`) },
                    {
                      value: 'video_assessment',
                      label: t(`${translationPath}video-assessment`),
                    },
                    {
                      value: 'questionnaires',
                      label: t(`${translationPath}questionnaires`),
                    },
                  ].filter((option) => option.value === actionType)}
                  options={[
                    { value: 'email', label: t(`${translationPath}email`) },
                    {
                      value: 'video_assessment',
                      label: t(`${translationPath}video-assessment`),
                    },
                    {
                      value: 'questionnaires',
                      label: t(`${translationPath}questionnaires`),
                    },
                  ]}
                />
              </FormGroup>
            </Col>

            {actionType == 'email' && (
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
            <Row className="my-2 pt-3">
              {actionType == 'email' && (
                <>
                  <Col xl={6} lg={6} md={6} xs={12} className="p-0 pr-3-reversed">
                    <FormGroup>
                      <Label
                        className="form-control-label d-flex flex-column"
                        for="email-template"
                      >
                        {t(`${translationPath}email-template`)}{' '}
                        <small className="text-muted">
                          {t(
                            `${translationPath}selecting-an-email-template-is-optional`,
                          )}
                        </small>
                      </Label>
                      <Input
                        className="form-control-alternative"
                        type="select"
                        name="select"
                        value={emailTemplate}
                        onChange={(e) => {
                          setEmailTemplate(
                            [...e.currentTarget.options].filter(
                              (option) => option.selected === true,
                            )[0].value,
                          );
                        }}
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
                      <Label className="form-control-label pb-3" for="delay">
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
                          <option key={i + 1}>{delay}</option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </>
              )}

              {actionType === 'video_assessment' && (
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

              {actionType == 'questionnaires' && (
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
                      id={`editor-${props.uuid}`}
                      value={email?.body || defaultEmail?.body}
                      onChange={(value) => {
                        setDefaultEmail((items) => ({
                          ...items,
                          body: value,
                        }));
                        setEmail((items) => ({
                          ...items,
                          body: value,
                        }));
                      }}
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
                          <label
                            className="form-control-label"
                            htmlFor="email-subject"
                          >
                            {t(`${translationPath}email-subject`)}
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="email-subject"
                            placeholder={t(`${translationPath}email-subject`)}
                            type="text"
                            value={email.subject}
                            onChange={(e) => {
                              const { value } = e.currentTarget;
                              setEmail((items) => ({
                                ...items,
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
              </>
            )}
          </Col>
        </div>
      </Formik>
    </>
  );
};

export default StageAction;
