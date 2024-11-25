/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'api/middleware';
// reactstrap components
import urls from 'api/urls';
import RecuiterPreference from 'utils/RecuiterPreference';
import { Button, Card, FormGroup, Input, Row, Col } from 'reactstrap';
import TinyMCE from 'components/Elevatus/TinyMCE';
import { useHistory } from 'react-router-dom';

// import { useToasts } from 'react-toast-notifications';

// Forms Validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ErrorWrapper } from 'shared/FormValidations';
import { DefaultLoader } from 'shared/Loaders';
import { generateHeaders } from 'api/headers';
import { UploaderPageEnum } from 'enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from 'components/Uploader/Uploader.Component';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18next from 'i18next';
import FormikErrorFocusComponent from '../../../components/FormikErrorFocus/FormikErrorFocus.Component';
import { AutocompleteComponent } from '../../../components';
import { getErrorByName, showError } from '../../../helpers';
import { QuestionnaireFromFeatureEnum } from '../../../enums';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../setups/shared';
import {
  GetAllEvaRecPipelines,
  GetAllEvaRecPipelineStages,
} from '../../../services';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const CardWrapper = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 2rem;
  max-width: 900px;
  padding: 1.5rem;
`;
const TitleRow = styled.div`
  align-items: center;
  display: flex;

  & > * {
    font-weight: bold;
  }
`;

const AddQuestionnaire = ({
  goNext,
  isActive,
  currentUUID,
  onSave,
  onQuestionsChanged,
  emailAttachments,
  onEmailAttachmentsChanged,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(mainParentTranslationPath);
  // const { addToast } = useToasts(); // Toasts
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const defaultLanguage
    = JSON.parse(localStorage.getItem('user'))?.results?.language.find(
      (item) => item.code === 'en',
    )?.id || '';
  const [fromFeature, setFromFeature] = useState(null);
  const [stateErrors, setStateErrors] = useState({});
  const [fromFeatureEnums] = useState(() =>
    Object.values(QuestionnaireFromFeatureEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Spinner
  const [isWorking, setIsWorking] = useState(false);

  const [title, setTitle] = useState('');
  const [pipeline, setPipeline] = useState();
  const [stages, setStages] = useState();
  const [template, setTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [language_id, setLanguage_id] = useState(defaultLanguage);
  const [edit, setEditFlag] = useState(false);
  const [isTemplateLoading, setIsTemplateLoading] = useState(false);
  const [isReload, setIsReload] = useState(true);

  const getTemplates = useCallback(
    async (searchValue = undefined) => {
      setIsTemplateLoading(true);
      await axios
        .get(RecuiterPreference.emailtemplates_GET, {
          params: {
            query: searchValue,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setTemplates(res.data.results.data);
          setIsTemplateLoading(false);
        })
        .catch((error) => {
          setIsTemplateLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t],
  );

  //   Get a Single Questionnaire
  useEffect(() => {
    // If Editing the Questionnaire, Get the Questionnaire First
    const getQuestionnaire = async () => {
      await axios
        .request({
          method: 'view',
          url: urls.questionnaire.questionnaire_GET,
          params: {
            uuid: currentUUID,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          const current = res.data.results;
          setTitle(current.title);
          setLanguage_id(current.language.id);
          setPipeline(current.pipeline.uuid);
          setFromFeature(current.from_feature);
          setEditFlag(true);
          setSelectedTemplate((items) => ({
            ...items,
            subject: current.email_subject,
            body: current.email_body,
          }));
          // Finally Set Stage and Questions and removed Dialog to appear next step.
          onSave(current.stage && current.stage.uuid);
          onEmailAttachmentsChanged(
            (current.attachment
              && current.attachment.map((item) => item.original))
              || [],
          );
          onQuestionsChanged(
            res.data.results.questions.map((q) => {
              if (q.type === 'file')
                return {
                  ...q,
                  answers: null,
                  fileAnswer: {
                    isAllowed: q.answers?.file_size || q.answers?.file_type,
                    file_size: q.answers?.file_size || '3',
                    file_type: q.answers?.file_type || '2',
                  },
                };
              if (q.type === 'yes_no')
                return {
                  ...q,
                  YesNoAnswer: {
                    YesAnswer: {
                      stage_uuid: q.answers[0]?.stage_uuid,
                    },
                    NoAnswer: {
                      stage_uuid: q.answers[1]?.stage_uuid,
                    },
                  },
                };
              return q;
            }),
          );
          getTemplates();
        });
    };
    if (currentUUID) getQuestionnaire();
    else void getTemplates();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTemplates, currentUUID]);

  // Change Email template every time the language or template changes
  useEffect(() => {
    if (!templates || templates?.length === 0) return;
    let mail = templates?.filter((temp) => temp?.id === template?.id);
    if (!mail.length) mail = [templates[0]];

    if (!mail.length || !language_id) return;
    const localSelectedTemplate
      = mail
      && mail[0]
      && mail[0].translation?.filter((temp) => temp.language.id === language_id)?.[0];
    const englishMailtemplate
      = mail
      && mail[0]
      && mail[0].translation?.filter((temp) => temp.language.code === 'en')?.[0];
    if (!selectedTemplate) {
      setSelectedTemplate(
        localSelectedTemplate
          || englishMailtemplate
          || (mail && mail[0] && mail[0].translation && mail[0].translation?.[0]),
      );
      return;
    }
    if (template)
      setSelectedTemplate(
        localSelectedTemplate
          || englishMailtemplate
          || (mail && mail[0] && mail[0].translation && mail[0].translation?.[0]),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, language_id, templates]);

  // change stages everytime the pipeline uuid changes
  useEffect(() => {
    if (!pipeline) return;
    const getStages = async () => {
      if (fromFeature === QuestionnaireFromFeatureEnum.EvaSSESS.key)
        await axios
          .get(`${urls.preferences.STAGES_DROPDOWN}`, {
            params: {
              pipeline_uuid: pipeline,
            },
            headers: generateHeaders(),
          })
          .then((res) => {
            setStages(res.data.results);
          })
          .catch((err) => {
            showError(t('Shared:failed-to-get-saved-data'), err);
          });
      else if (fromFeature === QuestionnaireFromFeatureEnum.EvaREC.key) {
        const response = await GetAllEvaRecPipelineStages({ uuid: pipeline });
        if (response && response.status === 200)
          setStages(response.data.results.stages);
        else showError(t('Shared:failed-to-get-saved-data'), response);
      }
    };
    pipeline && getStages();
  }, [fromFeature, pipeline, t]);

  // Get Pipelines
  const [pipelines, setPipelines] = useState();
  // Pipelines for Modal
  const getPipelines = useCallback(async () => {
    if (language_id)
      await axios
        .get(urls.preferences.pipelineDropdown, {
          params: {
            language_uuid: language_id,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setPipelines(res.data.results);
        })
        .catch(() => {});
  }, [language_id]);
  useEffect(() => {
    getPipelines();
  }, [getPipelines]);

  // Default Email
  const [defaultEmail, setDefaultEmail] = useState();
  const getDefaultEmail = useCallback(
    async (currentLanguageId) => {
      await axios
        .get(RecuiterPreference.TEMPLATE_BY_SLUG, {
          params: {
            slug: 'questionnaires_invite', // Fix
            language_id: currentLanguageId || defaultLanguage,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setDefaultEmail(res.data.results);
          setSelectedTemplate(res.data.results);
          setIsWorking(false);
          if (currentLanguageId) setIsLoading(false);
        })
        .catch((error) => {
          if (currentLanguageId) setIsLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t, defaultLanguage],
  );
  useEffect(() => {
    if (currentUUID) {
      setDefaultEmail({ subject: '', body: '' });
      return;
    }
    setIsWorking(true);

    getDefaultEmail();
  }, [currentUUID, getDefaultEmail]);

  const [variables, setVariables] = useState();
  const getVariables = useCallback(async () => {
    await axios
      .get(RecuiterPreference.TEMPLATES_COLLECTION, {
        headers: generateHeaders(),
      })
      .then((res) => {
        setVariables(res.data.results.keys);
      })
      .catch(() => {
        // addToast('Error in getting variables', {
        //   appearance: 'error',
        //   autoDismiss: true,
        // });
      });
  }, []);
  useEffect(() => {
    getVariables();
  }, [getVariables]);

  const QuestionnaireModalSchema = Yup.object().shape({
    questionnaireName: Yup.string()
      .min(
        3,
        t(`${translationPath}questionnaire-name-must-be-at-least-3-characters`),
      )
      .max(
        50,
        t(`${translationPath}questionnaire-name-must-be-at-most-50-characters`),
      )
      .required(t('Shared:this-field-is-required')),
    questionnaireLanguage: Yup.string().required(t('Shared:this-field-is-required')),
    pipeline: Yup.string().nullable().required(t('Shared:this-field-is-required')),
    emailSubject: Yup.string().required(t('Shared:this-field-is-required')),
    emailBody: Yup.string().required(t('Shared:this-field-is-required')),
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update errors for form on state changed
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: Yup.object().shape({
          from_feature: Yup.string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          questionnaireName: Yup.string()
            .min(
              3,
              t(
                `${translationPath}questionnaire-name-must-be-at-least-3-characters`,
              ),
            )
            .max(
              50,
              t(
                `${translationPath}questionnaire-name-must-be-at-most-50-characters`,
              ),
            )
            .required(t('Shared:this-field-is-required')),
          questionnaireLanguage: Yup.string().required(
            t('Shared:this-field-is-required'),
          ),
          pipeline: Yup.string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          emailSubject: Yup.string().required(t('Shared:this-field-is-required')),
          emailBody: Yup.string().required(t('Shared:this-field-is-required')),
        }),
      },
      {
        from_feature: fromFeature,
        pipeline,
      },
    ).then((result) => {
      setStateErrors(result);
    });
  }, [fromFeature, pipeline, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors, fromFeature, pipeline]);

  if (!isActive) return null;
  return (
    <div className="p-3">
      <CardWrapper>
        <TitleRow className="px-4">
          <h5 className="h5">
            {!currentUUID
              ? t(`${translationPath}new-questionnaire`)
              : t(`${translationPath}update-questionnaire`)}
          </h5>
        </TitleRow>
        <Formik
          enableReinitialize
          initialValues={{
            questionnaireName: title,
            questionnaireLanguage: language_id,
            pipeline,
            emailTemplate: template,
            emailSubject: selectedTemplate?.subject,
            emailBody: selectedTemplate?.body,
          }}
          validationSchema={QuestionnaireModalSchema}
          onSubmit={() => {
            goNext({
              pipeline_uuid: pipeline,
              title,
              language_id,
              // stage_uuid,
              from_feature: fromFeature,
              email_subject: selectedTemplate?.subject,
              email_body: selectedTemplate?.body,
              stages,
            });
          }}
        >
          {({ errors, isSubmitting, isValidating, submitForm }) => (
            <Form>
              {(!templates
                || !pipelines
                || !defaultEmail
                || !variables
                || isLoading) && <DefaultLoader />}
              {templates && pipelines && defaultEmail && variables && !isLoading && (
                <>
                  <div className="modal-body">
                    <Row>
                      <Col xl={6} lg={6} md={6} xs={12} className="px-2">
                        <FormGroup>
                          <Field
                            as={Input}
                            className="form-control-alternative"
                            id="title"
                            placeholder={t(`${translationPath}title`)}
                            type="text"
                            name="questionnaireName"
                            invalid={errors.questionnaireName}
                            value={title}
                            onChange={(e) => {
                              setTitle(e.currentTarget.value);
                            }}
                          />
                          <ErrorMessage
                            component={ErrorWrapper}
                            name="questionnaireName"
                          />
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={6} xs={12} className="px-2">
                        <FormGroup>
                          <Field
                            disabled={edit}
                            as={Input}
                            className="form-control-alternative"
                            id="pipeline-language"
                            type="select"
                            name="questionnaireLanguage"
                            invalid={errors.questionnaireLanguage}
                            value={language_id}
                            onChange={(e) => {
                              const { value } = e.currentTarget;
                              setLanguage_id(value);
                              setPipeline((item) => (item ? null : item));
                              if (template) return;
                              setIsLoading(true);
                              getDefaultEmail(value);
                            }}
                          >
                            {user
                              && user?.language
                              && user?.language?.map((language, i) => (
                                <option key={`titleKey${i + 1}`} value={language.id}>
                                  {language.translation[i18next.language]}
                                </option>
                              ))}
                          </Field>
                          <ErrorMessage
                            component={ErrorWrapper}
                            name="questionnaireLanguage"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <SharedAutocompleteControl
                        isHalfWidth
                        title="for"
                        errors={stateErrors}
                        stateKey="from_feature"
                        placeholder="select-for-feature"
                        editValue={fromFeature}
                        isDisabled={isLoading || edit}
                        isSubmitted={isSubmitted}
                        onValueChanged={({ value }) => {
                          setPipeline((item) => (item ? null : item));
                          setFromFeature(value);
                        }}
                        initValues={fromFeatureEnums}
                        translationPath={translationPath}
                        parentTranslationPath={mainParentTranslationPath}
                        errorPath="from_feature"
                        // getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
                      />
                      {fromFeature === QuestionnaireFromFeatureEnum.EvaSSESS.key && (
                        <Col xl={6} lg={6} md={6} xs={12} className="px-2">
                          <FormGroup>
                            <Field
                              disabled={edit}
                              as={Input}
                              className="form-control-alternative mb-3"
                              id="pipeline"
                              type="select"
                              name="pipeline"
                              invalid={errors.pipeline}
                              defaultValue={pipeline}
                              onChange={(e) => {
                                setPipeline(e.currentTarget.value);
                              }}
                            >
                              <option selected disabled hidden>
                                {t(`${translationPath}select-pipeline`)}
                              </option>
                              {pipelines.map((item, i) => (
                                <option
                                  key={`pipelineTitleKey${i + 1}`}
                                  value={item.uuid}
                                >
                                  {item.title}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage component={ErrorWrapper} name="pipeline" />
                          </FormGroup>
                        </Col>
                      )}
                      {fromFeature === QuestionnaireFromFeatureEnum.EvaREC.key && (
                        <SharedAPIAutocompleteControl
                          isHalfWidth
                          title="pipeline"
                          stateKey="pipeline"
                          errorPath="pipeline"
                          searchKey="search"
                          placeholder="select-pipeline"
                          editValue={pipeline}
                          isSubmitted={isSubmitted}
                          isDisabled={isLoading || edit}
                          errors={stateErrors}
                          onValueChanged={({ value }) => {
                            setPipeline(value);
                          }}
                          getDataAPI={GetAllEvaRecPipelines}
                          extraProps={{
                            language_uuid: language_id,
                            ...(pipeline && { with_than: [pipeline] }),
                          }}
                          parentTranslationPath={mainParentTranslationPath}
                          translationPath={translationPath}
                        />
                      )}
                      {!pipeline && (
                        <Col md={6} xs={12} className="d-flex align-items-center">
                          <small className="text-muted">
                            {t(
                              `${translationPath}please-select-pipeline-to-configure-move-on-completion`,
                            )}
                          </small>
                        </Col>
                      )}
                    </Row>

                    <hr />
                    <TitleRow className="mb-2">
                      <h3>{t(`${translationPath}email`)}</h3>
                    </TitleRow>
                    <Row>
                      <Col xl={6} lg={6} md={6} xs={12}>
                        <label
                          className="form-control-label mt-3"
                          htmlFor="emailSubject"
                        >
                          {t(`${translationPath}select-email-template`)}
                        </label>
                        <AutocompleteComponent
                          data={templates || []}
                          themeClass="theme-solid"
                          inputPlaceholder={t(`${translationPath}type-to-search`)}
                          value={
                            templates?.find((item) => item.id === template?.id)
                            || null
                          }
                          isLoading={isTemplateLoading}
                          getOptionLabel={(option) => option.title || ''}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onInputKeyUp={(event) => {
                            const { value } = event.target;

                            if (value) clearTimeout(timeoutRef.current);

                            timeoutRef.current = setTimeout(() => {
                              getTemplates(value);
                            }, 500);
                          }}
                          onChange={(event, newValue) => {
                            setIsReload(true);
                            setSelectedTemplate((items) => ({
                              ...items,
                              subject: defaultEmail?.subject || '',
                              body: defaultEmail?.body || '',
                            }));

                            setTemplate(newValue);
                            onEmailAttachmentsChanged(
                              newValue?.attachment?.map((item) => item.original)
                                || [],
                            );
                          }}
                        />
                        <ErrorMessage
                          component={ErrorWrapper}
                          name="emailTemplate"
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col xl={12} lg={12} md={12} xs={12}>
                        <TinyMCE
                          key={`${isReload}-tinymce-component`}
                          setIsReload={setIsReload}
                          id="editor-0"
                          value={selectedTemplate ? selectedTemplate.body : ''}
                          variables={variables}
                          onChange={(value) =>
                            setSelectedTemplate((items) => ({
                              ...items,
                              body: value,
                            }))
                          }
                        >
                          <Col xl={6} lg={6} md={6} xs={12}>
                            <FormGroup>
                              <label
                                className="form-control-label mt-3"
                                htmlFor="emailSubject"
                              >
                                {t(`${translationPath}email-subject`) + '*'}
                              </label>
                              <Field
                                as={Input}
                                className="form-control-alternative"
                                id="emailSubject"
                                placeholder={t(`${translationPath}email-subject`)}
                                type="text"
                                name="emailSubject"
                                invalid={errors.emailSubject}
                                value={
                                  selectedTemplate ? selectedTemplate.subject : ''
                                }
                                onChange={(e) => {
                                  const { value } = e.currentTarget;
                                  setSelectedTemplate((items) => ({
                                    ...items,
                                    subject: value,
                                  }));
                                }}
                              />
                              <ErrorMessage
                                component={ErrorWrapper}
                                name="emailSubject"
                              />
                            </FormGroup>
                          </Col>
                        </TinyMCE>
                      </Col>
                    </Row>
                  </div>
                  <div className="form-item">
                    <UploaderComponent
                      uploaderPage={UploaderPageEnum.EmailTemplates}
                      uploadedFiles={emailAttachments}
                      labelValue="upload-attachments"
                      parentTranslationPath={parentTranslationPath}
                      translationPath="QuestionnaireManagementPage."
                      uploadedFileChanged={(newFiles) => {
                        onEmailAttachmentsChanged(newFiles);
                      }}
                    />
                  </div>
                  <div className="modal-footer d-flex justify-content-center">
                    <Button
                      className="btn btn-icon"
                      color="secondary"
                      data-dismiss="modal"
                      type="button"
                      onClick={() => {
                        history.push(
                          '/recruiter/recruiter-preference/questionnaire/',
                        );
                      }}
                    >
                      {t(`${translationPath}back`)}
                    </Button>
                    <Button
                      className="btn btn-primary btn-icon float-right"
                      color="primary"
                      type="button"
                      onClick={() => {
                        setIsSubmitted(true);
                        submitForm();
                      }}
                      disabled={isWorking}
                    >
                      {t(`${translationPath}continue`)}
                    </Button>
                  </div>
                </>
              )}
              <FormikErrorFocusComponent
                errors={errors}
                isSubmitting={isSubmitting}
                isValidating={isValidating}
              />
            </Form>
          )}
        </Formik>
      </CardWrapper>
    </div>
  );
};

export default AddQuestionnaire;
