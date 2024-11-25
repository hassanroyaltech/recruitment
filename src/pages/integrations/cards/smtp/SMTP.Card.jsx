import React, {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, SwitchComponent } from '../../../../components';
import { SMTPIcon } from '../../../../assets/icons/SMTP.Icon';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import * as yup from 'yup';
import {
  GetSMTPDetails,
  SendSMTPTestEmail,
  UpdateSMTPDetails,
  UpdateSMTPStatus,
} from '../../../../services/SMTP.Services';

const SMTPCard = ({
  isLoading,
  isOpenDialog,
  onIsOpenDialogsChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const stateInitRef = useRef({
    host: undefined,
    username: undefined,
    port: undefined,
    encryption: undefined,
  });
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isTestEmail, setIsTestEmail] = useState(false);

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const GetSMTPDetailsHandler = useCallback(async () => {
    setIsLocalLoading(true);
    const response = await GetSMTPDetails();
    setIsLocalLoading(false);
    if (response.status === 200) {
      setIsEdit(!!response.data?.results?.username);
      onStateChanged({
        id: 'edit',
        value: response.data?.results,
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  const UpdateSMTPDetailsHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitted(true);
      if (Object.keys(errors).length) return;
      setIsLocalLoading(true);
      const response = await UpdateSMTPDetails(state);
      setIsLocalLoading(false);
      if (response.status === 200) {
        setIsEdit(!!response.data?.results?.username);
        onStateChanged({ id: 'edit', value: response.data?.results });
        onIsOpenDialogsChanged('smtp', false, true)();
        showSuccess(response?.data?.message);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [onIsOpenDialogsChanged, errors, state, t],
  );

  const UpdateSMTPStatusHandler = useCallback(
    async ({ value }) => {
      setIsLocalLoading(true);
      const response = await UpdateSMTPStatus(value);
      setIsLocalLoading(false);
      if (response.status === 200) onStateChanged({ id: 'status', value });
      else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        onStateChanged({ id: 'status', value: !value });
      }
    },
    [t],
  );

  const SendSMTPTestEmailHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitted(true);
      if (Object.keys(errors).length > 0) return;

      setIsLocalLoading(true);
      const response = await SendSMTPTestEmail({
        to_email: state.to_email,
        to_name: state.to_name,
      });
      setIsLocalLoading(false);
      if (response.status === 200) {
        showSuccess(t(`${translationPath}test-email-success`));
        setIsTestEmail(false);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [errors, state.to_email, state.to_name, t, translationPath],
  );

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape(
          isTestEmail
            ? {
              to_name: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              to_email: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }
            : {
              host: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              username: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              password: yup.lazy(() => {
                if (!isEdit || isUpdatePassword)
                  return yup
                    .string()
                    .nullable()
                    .required(t('Shared:this-field-is-required'));
                else return yup.string().nullable();
              }),
              from_name: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              from_email: yup
                .string()
                .email()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              port: yup
                .number()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              encryption: yup
                .number()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            },
        ),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [t, state, isEdit, isUpdatePassword, isTestEmail]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    GetSMTPDetailsHandler();
  }, [GetSMTPDetailsHandler]);

  return (
    <div className="integrations-card-wrapper card-wrapper">
      <div className="integrations-card-body">
        <div className="integrations-card-row image-wrapper mb-3">
          <SMTPIcon />
        </div>
        <div className="integrations-card-row header-text">
          <span>SMTP</span>
        </div>
        <div className="integrations-card-row">
          {/* TODO: Check description */}
          <span>{t(`${translationPath}smtp-description`)}</span>
        </div>
      </div>
      <div className="integrations-card-footer with-switch">
        <ButtonBase
          className="btns theme-transparent"
          onClick={onIsOpenDialogsChanged('smtp', true, false)}
          disabled={isLocalLoading || isLoading}
        >
          <span>{t(`${translationPath}configure`)}</span>
        </ButtonBase>
        <SwitchComponent
          isChecked={!!state.status}
          isReversedLabel
          isFlexEnd
          onChange={(e, value) => {
            UpdateSMTPStatusHandler({ value });
          }}
          isDisabled={isLocalLoading || isLoading || !state.username}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      {isOpenDialog && (
        <DialogComponent
          titleText="smtp-title"
          dialogContent={
            <div className="d-flex-column-center">
              {isEdit && (
                <div className="w-100">
                  <ButtonBase
                    className="btns theme-solid mt-3 mb-4"
                    onClick={() => {
                      setIsUpdatePassword(false);
                      setIsTestEmail((prev) => !prev);
                    }}
                  >
                    {isTestEmail ? (
                      <>
                        <span className="fas fa-arrow-left mx-2" />
                        <span>{t(`${translationPath}back-to-configurations`)}</span>
                      </>
                    ) : (
                      <>
                        <span>{t(`${translationPath}send-test-email`)}</span>
                        <span className="fas fa-arrow-right mx-2" />
                      </>
                    )}
                  </ButtonBase>
                </div>
              )}
              {isTestEmail && (
                <div className="w-100 d-flex-column-center">
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="to_name"
                    errorPath="to_name"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.to_name}
                    title="name"
                    onValueChanged={onStateChanged}
                    placeholder="name"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    autoComplete="new-password"
                  />
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="to_email"
                    errorPath="to_email"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.to_email}
                    title="email"
                    onValueChanged={onStateChanged}
                    placeholder="email"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    autoComplete="new-password"
                  />
                </div>
              )}
              {!isTestEmail && (
                <>
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="host"
                    errorPath="host"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.host}
                    title="host"
                    onValueChanged={onStateChanged}
                    placeholder="host"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="port"
                    errorPath="port"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.port}
                    title="port"
                    onValueChanged={onStateChanged}
                    placeholder="port"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    type="number"
                  />
                  <SharedAutocompleteControl
                    isFullWidth
                    errors={errors}
                    title="encryption"
                    isRequired
                    stateKey="encryption"
                    isDisabled={isLoading || isLocalLoading}
                    isSubmitted={isSubmitted}
                    placeholder="encryption"
                    onValueChanged={onStateChanged}
                    initValues={[
                      {
                        key: 1,
                        title: t('no-encryption'),
                      },
                      {
                        key: 2,
                        title: t('ssl'),
                      },
                      {
                        key: 3,
                        title: t('tls'),
                      },
                      {
                        key: 4,
                        title: t('starttls'),
                      },
                    ]}
                    editValue={state.encryption}
                    errorPath="encryption"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    initValuesKey="key"
                    initValuesTitle="title"
                  />
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="from_name"
                    errorPath="from_name"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.from_name}
                    title="from-name"
                    onValueChanged={onStateChanged}
                    placeholder="from-name"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    autoComplete="new-password"
                  />
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="from_email"
                    errorPath="from_email"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.from_email}
                    title="from-email"
                    onValueChanged={onStateChanged}
                    placeholder="from-email"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    autoComplete="new-password"
                  />
                  <SharedInputControl
                    isFullWidth
                    isRequired
                    stateKey="username"
                    errorPath="username"
                    isDisabled={isLoading || isLocalLoading}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    editValue={state.username}
                    title="user-name-email"
                    onValueChanged={onStateChanged}
                    placeholder="user-name-email"
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                    autoComplete="new-password"
                  />
                  {/* Show update password toggle only of SMTP details are previously set */}
                  {isEdit && (
                    <SwitchComponent
                      isFlexStart
                      label="update-password"
                      isChecked={!!isUpdatePassword}
                      onChange={(e, value) => {
                        setIsUpdatePassword(value);
                      }}
                      isDisabled={isLocalLoading || isLoading}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      wrapperClasses="mb-3"
                    />
                  )}
                  {/* Show password field if SMTP details are not set yet or if is update password toggle is on */}
                  {(isUpdatePassword || !isEdit) && (
                    <SharedInputControl
                      isFullWidth
                      isRequired
                      stateKey="password"
                      errorPath="password"
                      isDisabled={isLoading || isLocalLoading}
                      errors={errors}
                      isSubmitted={isSubmitted}
                      editValue={state.password}
                      title="password"
                      onValueChanged={onStateChanged}
                      placeholder="password"
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      type="password"
                      autoComplete="new-password"
                    />
                  )}
                </>
              )}
            </div>
          }
          isOpen={isOpenDialog}
          onSubmit={
            isTestEmail ? SendSMTPTestEmailHandler : UpdateSMTPDetailsHandler
          }
          isSaving={isLoading || isLocalLoading}
          saveIsDisabled={isSubmitted && Object.keys(errors).length > 0}
          saveClasses="btns theme-solid bg-primary"
          onCloseClicked={onIsOpenDialogsChanged('smtp', false, true)}
          onCancelClicked={onIsOpenDialogsChanged('smtp', false, true)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

SMTPCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isOpenDialog: PropTypes.bool.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default memo(SMTPCard);
