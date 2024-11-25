/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'api/middleware';
import { useToasts } from 'react-toast-notifications';

import RecuiterPreference from 'utils/RecuiterPreference';

import { Button, Col, Input, Row, FormGroup, TabPane, TabContent } from 'reactstrap';

// Forms Validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ErrorWrapper } from 'shared/FormValidations';
import { generateHeaders } from 'api/headers';
import { UploaderPageEnum } from 'enums/Pages/UploaderPage.Enum';
import { UploaderComponent } from 'components';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18next from 'i18next';
import EditTemplate from './EditTemplate';
import { StyledModal } from '../PreferenceStyles';
import Loader from '../components/Loader';
import FormikErrorFocusComponent from '../../../components/FormikErrorFocus/FormikErrorFocus.Component';
import { showError, showSuccess } from '../../../helpers';
import { GPTGenerateEmailTemplate } from '../../../services';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const EditModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const [selectedTab, setSelectedTab] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [Id, setId] = useState(props.template.id);
  const [title, setTitle] = useState(props.template.title);
  const [translations, setTranslations] = useState(props.template.translation);
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (props.template) {
      setEmailAttachments(props.template.attachment.map((item) => item?.original));
      setId(props.template.id);
      setTitle(props.template.title);
      const localLanguages
        = (props.languages
          && props.languages
            .filter(
              (item) =>
                !props.template.translation
                || props.template.translation.findIndex(
                  (element) => element.language.id === item.id,
                ) === -1,
            )
            .map((language) => ({
              language,
              subject: '',
              body: '',
            })))
        || [];
      const translationLanguages
        = (props.template.translation
          && props.template.translation.map((translate) => ({
            ...translate,
          })))
        || [];

      setTranslations(translationLanguages.concat(localLanguages));
    }
  }, [props.template]);

  const [variables, setVariables] = useState();
  const getVariables = useCallback(async () => {
    await axios
      .get(RecuiterPreference.TEMPLATES_COLLECTION, {
        headers: generateHeaders(),
      })
      .then((res) => {
        setVariables(res.data.results.keys);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-variables`), error);
      });
  }, [t]);
  useEffect(() => {
    getVariables();
  }, [getVariables]);

  const handleEditTemplate = async () => {
    setIsWorking(true);
    await axios
      .put(
        RecuiterPreference.emailtemplates_WRITE,
        {
          id: Id,
          title,
          translation: translations
            .filter((t) => t.body !== '' || t.subject !== '')
            .map((t) => ({
              body: t.body,
              subject: t.subject,
              language_id: t.language.id,
            })),
          attachment: emailAttachments.map((attachment) => attachment.uuid),
        },
        {
          headers: generateHeaders(),
        },
      )
      .then(() => {
        addToast(t(`${translationPath}email-template-updated-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        if (props.onSave) props.onSave();
        // props.setNewTemplate(res.data.results);
        props.closeModal();
        setIsWorking(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-updating-email-template`), error);

        setIsWorking(false);
      });
  };

  const sendTranslation = (newTranslation) => {
    setTranslations((items) => [
      ...items.filter(
        (translation) => translation.language.id !== newTranslation.language.id,
      ),
      newTranslation,
    ]);
  };

  useEffect(() => {
    if (props.activeEditLanguage && translations && translations.length > 0) {
      const localLanguageIndex = translations
        ? translations.findIndex(
          (item) => item.language.id === props.activeEditLanguage.id,
        )
        : -1;
      if (localLanguageIndex !== -1) setSelectedTab(localLanguageIndex);
    }
  }, [props.activeEditLanguage, translations]);

  const gptGenerateEmailTemplate = useCallback(
    async ({ language, purpose }, callBack, canRegenerate = true) => {
      try {
        setIsLoading(true);
        const res = await GPTGenerateEmailTemplate({
          purpose,
          language,
        });
        setIsLoading(false);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate)
              return gptGenerateEmailTemplate(
                { language, purpose },
                callBack,
                false,
              );
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          if (results?.length > 0) callBack(results);
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [t],
  );
  return (
    <>
      <StyledModal
        className="modal-dialog-centered email-template-modal-wrapper"
        size="lg"
        isOpen={props.isOpen}
        toggle={() => props.closeModal()}
      >
        <div className="modal-header border-0">
          <h5 className="modal-title" id="exampleModalLabel">
            {t(`${translationPath}edit-email-template`)}
          </h5>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => props.closeModal()}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <Formik
          enableReinitialize
          initialValues={{
            selectedTab,
            templateName: title,
            translations,
          }}
          validationSchema={Yup.object().shape({
            templateName: Yup.string()
              .min(3, t(`${translationPath}template-min-description`))
              .max(100, t(`${translationPath}template-max-description`))
              .required(),
            translations: Yup.array()
              .of(
                Yup.object().shape({
                  subject: Yup.string().nullable(),
                  body: Yup.string()
                    .nullable()
                    .when(
                      'subject',
                      (value, field) => (value && field.required()) || field,
                    ),
                }),
              )
              .test(
                'subjectRequired',
                t('Shared:required'),
                (value) =>
                  !value.some(
                    (item, index) =>
                      (selectedTab === index && !item.subject)
                      || (!item.subject && item.body),
                  ),
              ),
          })}
          onSubmit={() => {
            handleEditTemplate();
          }}
        >
          {({ errors, isSubmitting, isValidating, submitForm }) => (
            <Form>
              {!variables && <Loader />}
              {variables && (
                <div className="modal-body">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="templateName">
                          {t(`${translationPath}template-name`) + '*'}
                        </label>
                        <Field
                          as={Input}
                          className="form-control-alternative mt-0"
                          id="email-title"
                          placeholder={t(`${translationPath}template-title`)}
                          disabled={
                            (props.template && !props.template.can_delete)
                            || isWorking
                            || isLoading
                          }
                          name="templateName"
                          invalid={!!errors.templateName}
                          value={title}
                          onChange={(e) => setTitle(e.currentTarget.value)}
                          type="text"
                        />
                        <ErrorMessage component={ErrorWrapper} name="templateName" />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="template-language"
                        >
                          {t(`${translationPath}language`)}
                        </label>

                        <Input
                          className="form-control-alternative"
                          id="template-language"
                          type="select"
                          value={selectedTab}
                          disabled={isWorking || isLoading}
                          onChange={(e) => {
                            const { value } = e.currentTarget;
                            setSelectedTab(+value);
                          }}
                        >
                          {translations?.map((translation, i) => (
                            <option key={`translationsLangKey${i + 1}`} value={i}>
                              {translation.language.translation[i18next.language]
                                || translation.language.translation.en}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr className="border-top" />
                  <TabContent activeTab={`translationTab${selectedTab}`}>
                    {translations
                      && translations?.map((mail, i) => (
                        <TabPane
                          className="pb-2"
                          tabId={`translationTab${i}`}
                          key={mail.language.id}
                        >
                          {selectedTab === i && (
                            <EditTemplate
                              mail={mail}
                              i={i}
                              sendTranslation={sendTranslation}
                              variables={variables}
                              errors={errors}
                              selectedTab={selectedTab}
                              setTranslations={setTranslations}
                              translations={translations}
                              gptGenerateEmailTemplate={gptGenerateEmailTemplate}
                              purpose={title}
                              isWithChatGPT
                              isLoading={isLoading}
                            />
                          )}
                        </TabPane>
                      ))}
                  </TabContent>
                  {/* add uploader here */}
                </div>
              )}
              <Row>
                <Col md="12" className="d-flex justify-content-center">
                  <div className="ml-3-reversed mr-3-reversed w-100">
                    <UploaderComponent
                      uploaderPage={UploaderPageEnum.EmailTemplates}
                      uploadedFiles={emailAttachments}
                      labelValue="upload-attachments"
                      parentTranslationPath="EmailTemplatesPage"
                      translationPath=""
                      uploadedFileChanged={(newFiles) => {
                        setEmailAttachments(newFiles);
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <div className="modal-footer border-0 justify-content-center">
                <Button
                  className="btn btn-icon"
                  color="secondary"
                  data-dismiss="modal"
                  onClick={() => props.closeModal()}
                  type="button"
                >
                  {t(`${translationPath}close`)}
                </Button>
                <Button
                  className="btn btn-primary btn-icon float-right"
                  color="primary"
                  // type="submit"
                  onClick={() => {
                    const firstErrorIndex = translations.findIndex(
                      (item) =>
                        (item.subject && !item.body) || (!item.subject && item.body),
                    );
                    if (firstErrorIndex !== -1 && firstErrorIndex !== selectedTab)
                      setSelectedTab(firstErrorIndex);
                    submitForm();
                  }}
                  disabled={isWorking || isLoading}
                >
                  {isWorking && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    isWorking
                      ? t(`${translationPath}saving`)
                      : t(`${translationPath}save-changes`)
                  }`}
                </Button>
              </div>
              {document.querySelector(
                '.email-template-modal-wrapper .modal-content',
              ) && (
                <FormikErrorFocusComponent
                  errors={errors}
                  converterNames={[
                    {
                      key: 'translations',
                      value: 'subject',
                    },
                    {
                      key: 'translations',
                      value: 'body',
                      isArray: true,
                    },
                  ]}
                  scrollableElement={document.querySelector(
                    '.email-template-modal-wrapper .modal-content',
                  )}
                  contentsElement={document.querySelector(
                    '.email-template-modal-wrapper .modal-content',
                  )}
                  isByScrollTop
                  isSubmitting={isSubmitting}
                  isValidating={isValidating}
                />
              )}
            </Form>
          )}
        </Formik>
      </StyledModal>
    </>
  );
};

export default EditModal;
