import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import * as yup from 'yup';
import Loader from '../../../../Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { SetupsReducer, SetupsReset } from '../../../../../pages/setups/shared';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from '@mui/material';
import {
  GetCandidateDocumentsData,
  SaveCandidateDocumentsData,
  SendCandidateDocumentsEmail,
  SubmitCandidateDocumentsData,
} from '../../../../../services';
import { showError, showSuccess, getErrorByName } from '../../../../../helpers';

import { DocumentsFields } from './Components/DocumentsFields';
import EmailTemplateDialog from '../../../../../pages/form-builder-v2/dialogs/email-template/EmailTemplate.Dialog';

import { useSelector } from 'react-redux';
import { CandidateDocumentsEmailTypesEnum } from '../../../../../enums';

export const DocumentsTab = ({
  // job_uuid,
  // candidateDetail,
  parentTranslationPath,
  job_candidate_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const userReducer = useSelector((state) => state?.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [filter, setFilter] = useState({});
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    emailTemplate: false,
  });
  const [emailState, setEmailState] = useState({
    bodyEmail: '',
    subjectEmail: '',
    emailLanguageId: '',
    attachmentsEmail: [],
    emailTemplateUUID: '',
    action: '', //sent , reminder
  });
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const stateInitRef = useRef({
    sections: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          sections: yup.array().of(
            yup.object().shape({
              // name: yup.string().required(t('this-field-is-required')),
              fields: yup.array().of(
                yup.object().shape({
                  type: yup.string().required(t('this-field-is-required')),
                  code: yup.string().required(t('this-field-is-required')),
                  is_required: yup.boolean().required(t('this-field-is-required')),
                  value: yup.lazy((fieldVal, { parent }) => {
                    if (parent.is_required)
                      return yup
                        .string()
                        .nullable()
                        .required(
                          `${parent.label[i18next.language] || parent.label.en} ${t(
                            'Shared:is-required',
                          )}`,
                        );
                    else return yup.string().nullable();
                  }),
                }),
              ),
            }),
          ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const getHiringFields = useCallback(async () => {
    setIsLoading(true);
    const response = await GetCandidateDocumentsData({
      job_candidate_uuid,
      // candidate_uuid: candidateDetail?.identity?.uuid,
      // job_uuid,
    });
    setIsLoading(false);
    if (response?.status === 200)
      setState({
        id: 'edit',
        value: response.data.results,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [job_candidate_uuid, t]);

  const saveHandler = async (isSubmit) => {
    setIsSubmitted(true);
    setIsLoading(true);
    const localeState = {
      ...state,
      job_candidate_uuid,
    };
    let response = await SaveCandidateDocumentsData(localeState);
    if (isSubmit && (response?.status === 200 || response?.status === 201))
      response = await SubmitCandidateDocumentsData(localeState);
    setIsLoading(false);
    if (response?.status === 200 || response?.status === 201) {
      showSuccess(
        t(
          isSubmit
            ? 'documents-data-sent-successfully'
            : 'documents-data-saved-successfully',
        ),
      );
      setFilter((items) => ({ ...items }));
      setExpandedAccordions([]);
    } else {
      const localeErrors = {};
      const errors = {};
      const responseErrors = response.data;
      const localeSections = Object.values(responseErrors?.reason?.sections || {});
      if (localeSections.length > 0) {
        localeSections.forEach((section) => {
          const sectionIndex = state.sections.findIndex(
            (item) => item.type === section.type,
          );
          if (sectionIndex !== -1)
            section.fields.forEach((field) => {
              const fieldIndex = state.sections[sectionIndex].fields.findIndex(
                (item) => item.code === field.code,
              );
              if (fieldIndex !== -1) {
                localeErrors[
                  `sections[${sectionIndex}].fields[${fieldIndex}].value`
                ] = {
                  error: true,
                  message:
                    field?.message || section.message || responseErrors?.message,
                  messages: [],
                  type: undefined,
                };
                errors[`sections[${sectionIndex}].fields[${fieldIndex}].value`]
                  = `${section.type}/ ${field.code}/ ${field?.message}`.replaceAll(
                    '_',
                    ' ',
                  );
              }
            });
        });
        setErrors(localeErrors);
        expandErrors(localeErrors);
      }
      if (Object.keys(localeErrors).length > 0)
        showError(t('Shared:failed-to-get-saved-data'), {
          message: responseErrors?.message,
          errors,
        });
      else showError(t('Shared:failed-to-get-saved-data'), response);
    }
  };

  const expandErrors = useCallback(
    (vendorErrors) => {
      setIsSubmitted(true);
      const keys = Object.keys(vendorErrors || errors);
      if (keys?.length) {
        const expanded = [];
        const regex = /sections\[(\d+)\].fields\[\d+\].value/;
        keys.forEach((key) => {
          const match = key.match(regex);
          if (match) expanded.push(parseInt(match[1]));
        });
        setExpandedAccordions(expanded);
      }
    },
    [errors],
  );

  const getDynamicServicePropertiesHandler = useCallback(
    // eslint-disable-next-line max-len
    ({ apiFilter, apiSearch, apiExtraProps }) => ({
      ...(apiExtraProps || {}),
      params: {
        ...((apiExtraProps && apiExtraProps.params) || {}),
        ...(apiFilter || {}),
        query: apiSearch || null,
      },
    }),
    [],
  );

  useEffect(() => {
    if (job_candidate_uuid) getHiringFields();
  }, [getHiringFields, filter, job_candidate_uuid]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
  const onUploadChanged = useCallback((newValue) => {
    const localItems = [...newValue.value];
    setState({
      ...newValue,
      id: 'value',
      value: localItems?.[0]?.uuid || '',
    });
    setState({
      ...newValue,
      id: 'media_details',
      value: localItems || [],
    });
  }, []);
  const isFieldsDisabled = useMemo(
    () => isLoading || !state?.can_edit || isFileUploading,
    [isFileUploading, isLoading, state?.can_edit],
  );

  const onChangeEmailState = useCallback((value) => {
    setEmailState((items) => ({ ...items, ...value }));
  }, []);
  const sendDocumentsEmail = useCallback(
    async (emailData) => {
      if (!emailData) return;
      setIsSending(true);
      const langCode
        = (userReducer.results.language || []).find(
          (item) => item?.id === emailData.emailLanguageId,
        )?.code || 'en';
      const localeState = {
        action: emailState.action,
        job_candidate_uuid,
        email_subject: emailData.subjectEmail,
        email_language: langCode,
        email_body: emailData.bodyEmail,
        email_attachment: emailData.attachmentsEmail,
      };
      const response = await SendCandidateDocumentsEmail(localeState);
      setIsSending(false);
      if (response && (response.status === 200 || response.status === 201)) {
        if (emailState.action === CandidateDocumentsEmailTypesEnum.reminder.key)
          showSuccess(t(`reminder-sent-successfully`));
        else showSuccess(t(`email-sent-successfully`));
        setFilter((items) => ({ ...items }));
      } else if (emailState.action === CandidateDocumentsEmailTypesEnum.reminder.key)
        showError(t(`failed-to-send-reminder`), response);
      else showError(t(`failed-to-send-email`), response);
    },
    [emailState.action, job_candidate_uuid, t, userReducer?.results?.language],
  );
  const getEffectedOnIdx = useCallback(({ options, section, key }) => {
    if (!options?.[key]) return null;
    const idx = section.fields.findIndex((item) => item.code === options?.[key]);
    if (idx !== -1) return idx;
    return null;
  }, []);
  return (
    <div className="m-2 p-2">
      <div className="d-flex-v-center-h-end">
        {state?.row_log?.length === 0 && (
          <ButtonBase
            disabled={isSending || isLoading}
            onClick={() => {
              onIsOpenDialogsChanged('emailTemplate', true);
              onChangeEmailState({
                action: CandidateDocumentsEmailTypesEnum.sendEmail.key,
                slug: CandidateDocumentsEmailTypesEnum.sendEmail.slug,
              });
            }}
            className="btns theme-solid mx-1 mb-2"
          >
            {isSending && <i className="fas fa-circle-notch fa-spin" />}{' '}
            <span className="px-1">
              {t(CandidateDocumentsEmailTypesEnum.sendEmail.value)}
            </span>
          </ButtonBase>
        )}
        {state?.row_log?.length > 0 && (
          <>
            {state?.candidate_submitted ? (
              <ButtonBase
                disabled={isSending || isLoading}
                onClick={() => {
                  onIsOpenDialogsChanged('emailTemplate', true);
                  onChangeEmailState({
                    action: CandidateDocumentsEmailTypesEnum.sendEmail.key,
                    slug: CandidateDocumentsEmailTypesEnum.sendEmail.slug,
                  });
                }}
                className="btns theme-solid mx-1 mb-2"
              >
                {isSending && <i className="fas fa-circle-notch fa-spin" />}{' '}
                <span className="px-1">{t('resend-email')}</span>
              </ButtonBase>
            ) : (
              <ButtonBase
                disabled={isSending || isLoading}
                onClick={() => {
                  onIsOpenDialogsChanged('emailTemplate', true);
                  onChangeEmailState({
                    action: CandidateDocumentsEmailTypesEnum.reminder.key,
                    slug: CandidateDocumentsEmailTypesEnum.reminder.slug,
                  });
                }}
                className="btns theme-solid mx-1 mb-2"
              >
                {isSending && <i className="fas fa-circle-notch fa-spin" />}{' '}
                <span className="px-1">
                  {t(CandidateDocumentsEmailTypesEnum.reminder.value)}
                </span>
              </ButtonBase>
            )}
          </>
        )}
      </div>
      {isLoading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      {state?.sections?.length > 0 && (
        <div style={{ display: isLoading && 'none' }}>
          {state?.vendor_status?.show && (
            <div className="d-inline-flex header-text mb-3">
              <span className="px-1">{state?.vendor_status?.message || ''} </span>
            </div>
          )}

          {state?.sections?.map((section, sectionIdx) => (
            <Accordion
              key={`field-section-${sectionIdx}`}
              expanded={expandedAccordions.includes(sectionIdx)}
              onChange={(e, ex) => {
                setExpandedAccordions((items) => {
                  if (ex) return [...items, sectionIdx];
                  else return items.filter((it) => it !== sectionIdx);
                });
              }}
            >
              <AccordionSummary
                expandIcon={<span className="fas fa-chevron-down" />}
              >
                <div className="fw-bold d-inline-flex-column">
                  {section?.title?.[i18next.language]
                    || section?.title?.en
                    || section?.name}{' '}
                  {section?.is_required && ' *'}
                  {section?.is_visible_to_candidate && (
                    <span className="fz-12px fw-light">
                      {t('filled-out-by-the-candidate')}
                    </span>
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className="section-item-body-wrapper px-2">
                  {section?.fields.map((field, fieldIdx) => (
                    <DocumentsFields
                      key={`section-${sectionIdx}-field-${fieldIdx}`}
                      onUploadChanged={onUploadChanged}
                      errors={errors}
                      sectionIdx={sectionIdx}
                      isDisabled={isFieldsDisabled}
                      getDynamicServicePropertiesHandler={
                        getDynamicServicePropertiesHandler
                      }
                      fieldIdx={fieldIdx}
                      type={field.type}
                      value={field.value}
                      parentTranslationPath={parentTranslationPath}
                      media_details={field.media_details}
                      label={field.label}
                      is_required={field.is_required}
                      isSubmitted={isSubmitted}
                      onStateChanged={onStateChanged}
                      options={field.options}
                      setIsFileUploading={setIsFileUploading}
                      effectedOnIdx={getEffectedOnIdx({
                        options: field.options,
                        section,
                        key: 'effected_on',
                      })}
                      hasParent={!!field?.options?.['with']}
                      parentValue={
                        field?.options?.['with']
                          ? section.fields[
                            getEffectedOnIdx({
                              options: field.options,
                              section,
                              key: 'with',
                            })
                          ]?.value
                          : ''
                      }
                    />
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
          <div className="d-flex-v-center-h-end my-4">
            <ButtonBase
              disabled={isLoading || !state?.can_edit}
              onClick={() => {
                saveHandler();
              }}
              className="btns theme-solid mx-1 mb-2"
            >
              <span className="px-1">{t('save')}</span>
            </ButtonBase>
            <ButtonBase
              disabled={isLoading || !state?.can_edit}
              onClick={() => {
                const keys = Object.values(errors);
                if (keys?.length) {
                  showError(t('Shared:failed-to-get-saved-data'), {
                    reason: keys.map((field) => ({ error: field.message })),
                  });
                  expandErrors();
                } else saveHandler(true);
              }}
              className="btns theme-solid mx-1 mb-2"
            >
              <span className="px-1">{t('submit-and-send')}</span>
            </ButtonBase>
          </div>
        </div>
      )}
      {isOpenDialogs.emailTemplate && (
        <EmailTemplateDialog
          editValue={
            (emailState.bodyEmail || emailState.subjectEmail) && {
              bodyEmail: emailState.bodyEmail,
              subjectEmail: emailState.subjectEmail,
              attachmentsEmail: emailState.attachmentsEmail,
              emailLanguageId: emailState.emailLanguageId,
              emailTemplateUUID: emailState.emailTemplateUUID,
            }
          }
          isOpen={isOpenDialogs.emailTemplate}
          isOpenChanged={() => {
            onIsOpenDialogsChanged('emailTemplate', false);
          }}
          onSave={(newValues) => {
            onChangeEmailState(newValues);
            sendDocumentsEmail(newValues);
          }}
          parentTranslationPath="FormBuilderPage"
          slug={emailState.slug}
          translationPath=""
        />
      )}
    </div>
  );
};

DocumentsTab.propTypes = {
  job_uuid: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  candidateDetail: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
