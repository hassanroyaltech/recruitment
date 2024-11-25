import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedTextEditorControl,
  SharedUploaderControl,
} from '../../../setups/shared';
import { UploaderPageEnum } from '../../../../enums';
import { DialogComponent } from '../../../../components';
import {
  GetAllPipelineAnnotations,
  GetAllPipelineEmailTemplates,
  GetEmailSystemTemplateBySlug,
  GetMultipleMedias,
  GetPipelineEmailTemplateById,
} from '../../../../services';
import { getErrorByName, showError } from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { SystemLanguagesConfig } from '../../../../configs';

const EmailTemplateDialog = ({
  editValue,
  isOpen,
  isOpenChanged,
  onSave,
  isDisabled,
  parentTranslationPath,
  translationPath,
  slug,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [errors, setErrors] = useState(() => ({}));
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const [emailAnnotations, setEmailAnnotations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [systemTemplates, setSystemTemplates] = useState([]);
  const stateInitRef = useRef({
    emailLanguageId: null,
    subjectEmail: null,
    bodyEmail: editValue?.bodyEmail || null,
    attachmentsEmail: [],
    attachmentsFullFiles: [],
    emailTemplateUUID: null,
    emailAnnotation: null,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
  }, []);

  /**
   * @attachmentsUUIDs - Array of uuids
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for attachments details on change template or initialization
   */
  const getAttachmentsDetails = useCallback(
    async (attachmentsUUIDs = []) => {
      if (attachmentsUUIDs.length === 0) return;
      const mediaResponse = await GetMultipleMedias({
        uuids: attachmentsUUIDs,
      });
      if (
        mediaResponse
        && mediaResponse.status === 200
        && mediaResponse.data.results.data.length > 0
      )
        setState({
          id: 'attachmentsFullFiles',
          value: mediaResponse.data.results.data.map((item) => item.original),
        });
      else showError(t('Shared:failed-to-get-uploaded-file'), mediaResponse);
    },
    [t],
  );

  /**
   * @param {{ localTemplates, currentLanguageUUID }}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the select for the default language template
   * before template change
   */
  const getDefaultSystemTemplate = useCallback(
    ({ localTemplates, currentLanguageUUID }) => {
      const localSystemTemplate = localTemplates.find(
        (item) => item.language_uuid === currentLanguageUUID,
      );
      if (localSystemTemplate) {
        getAttachmentsDetails(localTemplates.attachment);
        setState({
          id: 'destructObject',
          value: {
            bodyEmail: localSystemTemplate.body,
            subjectEmail: localSystemTemplate.subject,
            attachmentsEmail: localSystemTemplate.attachment || [],
          },
        });
      }
    },
    [getAttachmentsDetails],
  );

  const onUploadChanged = useCallback(
    (newValue) => {
      onStateChanged({
        ...newValue,
        value: newValue.value.map((item) => item.uuid),
      });
      onStateChanged({
        ...newValue,
        id: 'attachmentsFullFiles',
        value: newValue.value,
      });
    },
    [onStateChanged],
  );

  /**
   * @param parentIndex
   * @param subParentIndex
   * @param element
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add the selected annotation to the email body
   */
  const onEmailAnnotationChanged = useCallback(
    (bodyEmail) =>
      ({ value }) => {
        if (bodyEmail) bodyEmail = `${bodyEmail} ${value}`;
        else bodyEmail = value;
        onStateChanged({
          id: 'bodyEmail',
          value: bodyEmail,
        });
      },
    [onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all pipeline annotations
   */
  const getAllTemplateAnnotations = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllPipelineAnnotations();
    setIsLoading(false);
    if (response && response.status === 200)
      setEmailAnnotations([
        ...(response.data.results.form_builder || []),
        ...response.data.results.company,
        ...response.data.results.candidate,
        ...response.data.results.video_assessment,
      ]);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, t]);

  const onFromTemplateChanged = useCallback(
    async (newValue) => {
      onStateChanged({
        ...newValue,
        id: 'attachmentsEmail',
        value:
          (newValue.value
            && (newValue.value.attachment || []).map((item) => item.original.uuid))
          || [],
      });
      onStateChanged({
        ...newValue,
        id: 'attachmentsFullFiles',
        value:
          (newValue.value
            && (newValue.value.attachment || []).map((item) => item.original))
          || [],
      });

      const currentLanguageTranslation
        = (newValue.value
          && (newValue.value.translation?.find(
            (item) => item.language.id === state.emailLanguageId,
          )
            || newValue.value.translation?.[0]))
        || null;
      if (currentLanguageTranslation) {
        onStateChanged({
          ...newValue,
          id: 'subjectEmail',
          value: currentLanguageTranslation.subject,
        });
        onStateChanged({
          ...newValue,
          id: 'bodyEmail',
          value: currentLanguageTranslation.body,
        });
      }
      onStateChanged({
        ...newValue,
        value: (newValue.value && newValue.value.id) || null,
      });
    },
    [onStateChanged, state.emailLanguageId],
  );

  const onLanguageChange = useCallback(
    (localState, localSystemTemplates) => (newValue) => {
      if (localState.emailTemplateUUID)
        onStateChanged({
          ...newValue,
          id: 'emailTemplateUUID',
          value: null,
        });
      getDefaultSystemTemplate({
        localTemplates: localSystemTemplates,
        currentLanguageUUID: newValue.value,
      });

      onStateChanged(newValue);
    },
    [getDefaultSystemTemplate, onStateChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          emailLanguageId: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          subjectEmail: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          bodyEmail: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          emailAnnotation: yup.string().nullable(),
          attachmentsEmail: yup.array().nullable(),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  const getEmailSystemTemplateBySlug = useCallback(
    async (currentLanguageUUID) => {
      setIsLoading(true);
      const response = await GetEmailSystemTemplateBySlug({
        slug: slug || 'invite_candidate_form_builder',
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        setSystemTemplates(response.data.results.translation);
        if (currentLanguageUUID)
          getDefaultSystemTemplate({
            localTemplates: response.data.results.translation,
            currentLanguageUUID,
          });
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [getDefaultSystemTemplate, slug, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSave(state);
    isOpenChanged();
  };

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language) {
      setLanguages(userReducer.results.language);
      if (!editValue) {
        const englishLanguage = userReducer.results.language.find(
          (item) => item.code === SystemLanguagesConfig.en.key,
        );
        if (englishLanguage) {
          setState({ id: 'emailLanguageId', value: englishLanguage.id });
          getEmailSystemTemplateBySlug(englishLanguage.id);
        } else getEmailSystemTemplateBySlug();
      } else {
        getEmailSystemTemplateBySlug();
        getAttachmentsDetails(editValue.attachmentsEmail);
      }
    } else {
      showError(t('Shared:failed-to-get-languages'));
      isOpenChanged();
    }
  }, [
    editValue,
    getEmailSystemTemplateBySlug,
    getAttachmentsDetails,
    isOpenChanged,
    t,
    userReducer,
  ]);

  useEffect(() => {
    getAllTemplateAnnotations();
  }, [getAllTemplateAnnotations]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (editValue)
      setState({
        id: 'destructObject',
        value: editValue,
      });
  }, [editValue]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="email-template"
      contentClasses="px-0"
      dialogContent={
        <div className="email-template-content-wrapper">
          <div className="editor-body-wrapper">
            <SharedAutocompleteControl
              editValue={state.emailLanguageId}
              placeholder="select-language"
              title="language"
              stateKey="emailLanguageId"
              errors={errors}
              errorPath="emailLanguageId"
              isSubmitted={isSubmitted}
              onValueChanged={onLanguageChange(state, systemTemplates)}
              initValues={languages}
              isHalfWidth
              isDisabled={isDisabled}
              initValuesKey="id"
              initValuesTitle="title"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <SharedAPIAutocompleteControl
              isHalfWidth
              title="template"
              placeholder="select-template"
              errors={errors}
              stateKey="emailTemplateUUID"
              editValue={state.emailTemplateUUID}
              isDisabled={isLoading || isDisabled}
              isSubmitted={isSubmitted}
              onValueChanged={onFromTemplateChanged}
              translationPath={translationPath}
              getDataAPI={GetAllPipelineEmailTemplates}
              getItemByIdAPI={GetPipelineEmailTemplateById}
              uniqueKey="id"
              dataKey="data"
              isEntireObject
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => option.title}
              extraProps={{
                ...(state.emailTemplateUUID && {
                  with_than: [state.emailTemplateUUID],
                }),
              }}
            />
            <SharedInputControl
              isHalfWidth
              title="email-subject"
              errors={errors}
              stateKey="subjectEmail"
              searchKey="search"
              errorPath="subjectEmail"
              editValue={state.subjectEmail}
              isDisabled={isLoading || isDisabled}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedAutocompleteControl
              isHalfWidth
              title="email-annotation"
              placeholder="select-email-annotation"
              errors={errors}
              stateKey="emailAnnotation"
              editValue={state.emailAnnotation}
              isDisabled={isLoading || isDisabled}
              isStringArray
              isSubmitted={isSubmitted}
              onValueChanged={onEmailAnnotationChanged(state.bodyEmail)}
              translationPath={translationPath}
              initValues={emailAnnotations}
              parentTranslationPath={parentTranslationPath}
              errorPath="emailAnnotation"
              getOptionLabel={(option) => option}
            />
            <div className="px-2">
              <SharedTextEditorControl
                isFullWidth
                labelValue="email-body"
                placeholder="enter-email-body"
                errors={errors}
                stateKey="bodyEmail"
                editValue={state.bodyEmail}
                isDisabled={isLoading || isDisabled}
                isSubmitted={isSubmitted}
                onValueChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                errorPath="bodyEmail"
              />
            </div>
            <SharedUploaderControl
              isFullWidth
              errors={errors}
              uploaderPage={UploaderPageEnum.ATSAttachment}
              stateKey="attachmentsEmail"
              errorPath="attachmentsEmail"
              fileTypeText="files"
              isDisabled={isLoading || isDisabled}
              editValue={state.attachmentsFullFiles}
              isSubmitted={isSubmitted}
              onValueChanged={onUploadChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        </div>
      }
      wrapperClasses="email-template-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      saveIsDisabled={isDisabled || isLoading}
      onSaveClicked={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

EmailTemplateDialog.propTypes = {
  editValue: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  isDisabled: PropTypes.bool,
  onSave: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  slug: PropTypes.string,
};

export default EmailTemplateDialog;
