// Import React Components
import React, { useState, useRef, useReducer, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Card, CardContent, CardHeader } from '@mui/material';
import { useSelector } from 'react-redux';
import Loader from 'components/Elevatus/Loader';
import {
  DynamicFormTypesEnum,
  SystemActionsEnum,
  UploaderTypesEnum,
} from '../../../../../enums';
import { CheckboxesComponent } from '../../../..';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../pages/setups/shared/controls';
import {
  SetupsReducer,
  SetupsReset,
} from '../../../../../pages/setups/shared/helpers';
import { TextEditorComponent } from '../../../../TextEditor/TextEditor.Component';
import { CreateDraft, SendEmail, UploadNylasFile } from '../../../../../services';
import { showError, showSuccess } from '../../../../../helpers';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EmailComposer.';

const EmailComposer = ({
  backHandler,
  scope,
  candidate_uuid,
  job_uuid,
  ReplyToEmailHandler,
  candidate_email,
  replyValue,
}) => {
  const fileInputRef = useRef();
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(false);
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [signature, setSignature] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState({
    star: false,
  });
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const stateInitRef = useRef({
    subject: '',
    body: '',
    to: [],
    to_obj: [],
    cc: [],
    bcc: [],
    reply_to: [],
    file_ids: [],
    signature_id: null,
    files: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const toggleTooltip = (icon) => {
    setActiveTooltip((activeItem) => ({ ...activeItem, [icon]: false }));
  };

  const SendEmailHandler = useCallback(async () => {
    setLoading(true);
    const body = {
      user_uuid: userReducer.results.user.uuid,
      candidate_uuid,
      scope,
      ...state,
      to: state.to?.map((participant) => ({
        name: participant.name || '',
        email: participant.email?.trim() || participant?.trim(),
      })),
      cc: state.cc?.map((participant) => ({
        name: participant.name || '',
        email: participant.email?.trim() || participant?.trim(),
      })),
      bcc: state.bcc?.map((participant) => ({
        name: participant.name || '',
        email: participant.email?.trim() || participant?.trim(),
      })),
      signature_id: signature ? emailIntegrationReducer.nylas_signature : null,
      job_uuid,
      with_signature: !!signature,
    };
    if (ReplyToEmailHandler) {
      ReplyToEmailHandler(body);
      setLoading(false);
      return;
    }
    const response = await SendEmail(body);
    if (response.status === 200) {
      window?.ChurnZero?.push([
        'trackEvent',
        'Email Integration - Send Emails',
        'Send Emails',
        1,
        {},
      ]);
      showSuccess(t(`${translationPath}email-sent-successfully`));
      backHandler();
    } else showError(response.data.message);
    setLoading(false);
  }, [
    ReplyToEmailHandler,
    backHandler,
    candidate_uuid,
    emailIntegrationReducer,
    job_uuid,
    scope,
    signature,
    state,
    t,
    userReducer,
  ]);

  const UploadFileHandler = useCallback(
    async (file) => {
      const uploaded = [];
      const uploadedFiles = [];
      if (file?.target?.files) {
        for (let i = 0; i < file?.target?.files.length; i++) {
          const uploadedFile = await UploadNylasFile({
            user_uuid: userReducer.results.user.uuid,
            access_token: emailIntegrationReducer.access_token,
            upload_file: file.target.files[i],
            is_candidate: scope === 'candidate_modal' ? true : false,
          });
          if (uploadedFile?.status === 200) {
            uploadedFiles.push(uploadedFile.data.body);
            uploaded.push(uploadedFile.data.body.id);
          } else
            showError(t('failed-to-get-saved-data'), uploadedFile?.data?.message);
        }
        onStateChanged({
          id: 'files',
          value: [...state.files, ...uploadedFiles],
        });
        onStateChanged({
          id: 'file_ids',
          value: [...state.file_ids, ...uploaded],
        });
        setLoading(false);
      }
    },
    [emailIntegrationReducer, state, t, userReducer],
  );

  const CreateDraftHandler = useCallback(async (body) => {
    // CreateDraft
    setLoading(true);
    const res = await CreateDraft(body);
    if (res.status === 200) showSuccess(res.data.message);
    else showError('failed');
    setLoading(false);
  }, []);

  useEffect(() => {
    if (candidate_email && !replyValue)
      onStateChanged({ id: 'to', value: [candidate_email] });
    if (replyValue) {
      onStateChanged({ id: 'to', value: replyValue.to });
      onStateChanged({ id: 'cc', value: replyValue.cc });
      onStateChanged({ id: 'body', value: replyValue.body });
    }
  }, [candidate_email, replyValue]);

  return (
    <>
      {loading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      <div
        className="email-composer-container"
        style={{ display: loading ? 'none' : '' }}
      >
        {!ReplyToEmailHandler && (
          <ButtonBase
            className="btns-icon theme-transparent mr-1-reversed c-primary"
            onClick={() => {
              if (
                state?.subject
                || state?.body
                || state?.to?.length
                || state?.cc?.length
                || state?.bcc?.length
                || state?.reply_to?.length
                || state?.file_ids?.length
              )
                CreateDraftHandler({
                  user_uuid: userReducer.results.user.uuid,
                  candidate_uuid,
                  scope,
                  ...state,
                  to: state.to.map((email) => ({ name: '', email })),
                  cc: state.cc.map((email) => ({ name: '', email })),
                  bcc: state.bcc.map((email) => ({ name: '', email })),
                  signature_id: signature
                    ? emailIntegrationReducer.nylas_signature
                    : null,
                  job_uuid,
                  with_signature: !!signature,
                }).then(() => {
                  backHandler();
                });
              else backHandler();
            }}
          >
            <div>
              <span className={SystemActionsEnum.back.icon} />
            </div>
          </ButtonBase>
        )}
        <Card>
          <CardHeader />
          <CardContent>
            <div className="d-flex-v-center-h-between my-2">
              <SharedAutocompleteControl
                editValue={
                  state?.to?.map(
                    (participant) => participant.email || participant,
                  ) || []
                }
                title="to"
                isFreeSolo
                stateKey="to"
                errorPath="to"
                onValueChanged={(newValue) =>
                  onStateChanged({ id: 'to', value: newValue.value })
                }
                isSubmitted={isSubmitted}
                errors={errors}
                type={DynamicFormTypesEnum.array.key}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isFullWidth
                isWithoutExternalChips
                inputEndAdornment={
                  <span className="d-inline-flex">
                    <ButtonBase onClick={() => setShowCC(!showCC)} className="mr-2">
                      {t(`${translationPath}cc`)}
                    </ButtonBase>
                    <ButtonBase onClick={() => setShowBCC(!showBCC)}>
                      {t(`${translationPath}bcc`)}
                    </ButtonBase>
                  </span>
                }
              />
            </div>
            {((showCC || state?.cc?.length) && (
              <div className="cc my-2">
                <SharedAutocompleteControl
                  editValue={
                    state?.cc?.map(
                      (participant) => participant.email || participant,
                    ) || []
                  }
                  title="cc"
                  isFreeSolo
                  stateKey="cc"
                  errorPath="cc"
                  onValueChanged={(newValue) =>
                    onStateChanged({ id: 'cc', value: newValue.value })
                  }
                  isSubmitted={isSubmitted}
                  errors={errors}
                  type={DynamicFormTypesEnum.array.key}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                  isWithoutExternalChips
                />
              </div>
            ))
              || null}
            {showBCC && (
              <div className="bcc my-2">
                <SharedAutocompleteControl
                  editValue={state.bcc || []}
                  title="bcc"
                  isFreeSolo
                  stateKey="bcc"
                  errorPath="bcc"
                  onValueChanged={(newValue) =>
                    onStateChanged({ id: 'bcc', value: newValue.value })
                  }
                  isSubmitted={isSubmitted}
                  errors={errors}
                  type={DynamicFormTypesEnum.array.key}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                  isWithoutExternalChips
                />
              </div>
            )}
            <div className="subject my-2">
              <SharedInputControl
                isFullWidth
                editValue={state.location || ''}
                onValueChanged={(newValue) =>
                  onStateChanged({ id: 'subject', value: newValue.value })
                }
                title={t(`${translationPath}subject`)}
                stateKey="subject"
                idRef="subject"
                themeClass="theme-solid"
                errors={errors}
                errorPath="subject"
                isSubmitted={isSubmitted}
              />
            </div>
            <div className="email-text-editor">
              <TextEditorComponent
                editorValue={state.body}
                isSubmitted={isSubmitted}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                height={155}
                menubar={false}
                onEditorDelayedChange={(content) =>
                  onStateChanged({ id: 'body', value: content })
                }
              />
            </div>
            {state.files && (
              <div className="my-4">
                {state.files.map((file) => (
                  <div key={file.id} className="mb-2">
                    <ButtonBase
                      className="btns theme-transparent"
                      onClick={() => {
                        const files = [...state.files].filter(
                          (item) => item.id !== file.id,
                        );
                        onStateChanged({ id: 'files', value: files });
                      }}
                    >
                      <span>{file?.original_file_name}</span>
                      <span className="fas fa-times mx-2" />
                    </ButtonBase>
                  </div>
                ))}
              </div>
            )}
            <div className="email-composer-footer mt-4">
              <div className="d-flex-v-center my-2">
                <ButtonBase
                  onClick={() => {
                    // TODO: add a popup here to ask the user if he wants to send message without subject and/or text in the body
                    SendEmailHandler();
                  }}
                  className="btns theme-solid mr-3"
                >
                  <span className="px-1">{t(`${translationPath}send`)}</span>
                </ButtonBase>
                <CheckboxesComponent
                  idRef="signature"
                  label={t(`${translationPath}signature`)}
                  singleChecked={signature}
                  onSelectedCheckboxChanged={() => {
                    setSignature((item) => !item);
                  }}
                  // TODO: Add tooltip that has a link to settings page to upload a signature
                  isDisabled={!emailIntegrationReducer.nylas_signature}
                />
              </div>
              <div className="d-inline-flex-center">
                <ButtonBase
                  className="btns-icon theme-transparent mx-1 "
                  onClick={(event) => {
                    fileInputRef.current.click();
                  }}
                >
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    label={t(`${translationPath}upload-signature`)}
                    accept={`${UploaderTypesEnum.Image.accept}, ${UploaderTypesEnum.Video.accept}, ${UploaderTypesEnum.Docs.accept}`}
                    onChange={(event) => {
                      event.persist();
                      UploadFileHandler(event);
                    }}
                    multiple="multiple"
                    max="5"
                    ref={fileInputRef}
                  />
                  <span className={SystemActionsEnum.attachment.icon} />
                </ButtonBase>
                <div className="delete">
                  <ButtonBase
                    className="btns-icon theme-transparent c-warning"
                    onClick={() => {
                      // TODO: show dialog (are you sure you want to discard this message)
                      backHandler();
                    }}
                  >
                    <span className={SystemActionsEnum.delete.icon} />
                  </ButtonBase>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmailComposer;
