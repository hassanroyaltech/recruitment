import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { AuthenticatorCodeVerify } from '../../../../../services/SetupsAuthenticatorApp.Services';
import { SharedInputControl } from '../../controls';
import * as yup from 'yup';
import { updateUser } from '../../../../../stores/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonBase } from '@mui/material';
import { VerifyRecoveryCode } from '../../../../../services/SetupsRecoveryCodes.Services';

export const ChangeAuthenticatorAppDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  setReLoad,
  authenticatedAppDataEmail,
  onSave,
  onSaveDelete,
  dialogType,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  // const [isLoading, setIsLoading] = useState(false);
  const [authenticatedAppCode, setAuthenticatedAppCode] = useState();
  const [showActiveTab, setShowActiveTab] = useState(false);
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state?.userReducer);

  const onStateChanged = (newValue) => {
    setAuthenticatedAppCode(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          code: yup.string().nullable(),
          // .required(t('Shared:this-field-is-required')),
        }),
      },
      authenticatedAppCode,
    ).then((result) => {
      setErrors(result);
    });
  }, [authenticatedAppCode]);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const response = await (showActiveTab
      ? VerifyRecoveryCode({
        recovery_code: authenticatedAppCode?.recovery_code,
        email: authenticatedAppDataEmail,
      })
      : AuthenticatorCodeVerify({
        code: authenticatedAppCode?.code,
        email: authenticatedAppDataEmail,
      }));
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(response.data.message);
      setReLoad((prev) => ({ ...prev }));
      if (dialogType?.change && onSave) onSave();
      if (dialogType?.remove && onSaveDelete) onSaveDelete();
      dispatch(updateUser({ ...userReducer, has_authenticator_app: true }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  // this to call errors updater when filters changed
  useEffect(() => {
    getErrors();
  }, [getErrors, authenticatedAppCode]);

  return (
    <DialogComponent
      titleText={
        showActiveTab
          ? 'change-or-remove-with-recovery-code'
          : 'change-or-remove-with-authenticator-app-code'
      }
      maxWidth="sm"
      dialogContent={
        <div className="change-authenticator-app-dialog-wrapper">
          {!showActiveTab && (
            <div className="body-item-wrapper">
              <p className="m-3">
                {' '}
                {t(`${translationPath}enter-the-6-digit-code-you-see-in-the-app`)}
              </p>
              <SharedInputControl
                wrapperClasses="ml-2"
                isHalfWidth
                title="code"
                stateKey="code"
                errors={errors}
                placeholder="enter-code"
                editValue={authenticatedAppCode?.code}
                errorPath="code"
                isSubmitted={isSubmitted}
                onValueChanged={(newValue) =>
                  onStateChanged({
                    ...authenticatedAppCode,
                    code: newValue && newValue.value,
                  })
                }
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type="text"
              />
              <div className="font-12 text-info d-flex-v-start-h-end ">
                <ButtonBase onClick={() => setShowActiveTab(true)}>
                  {t(`${translationPath}use-your-recovery-code`)}
                </ButtonBase>
              </div>
            </div>
          )}
          {showActiveTab && (
            <div className="body-item-wrapper">
              <p className="m-3">
                {' '}
                {t(`${translationPath}enter-your-recovery-code`)}
              </p>
              <SharedInputControl
                wrapperClasses="ml-2"
                isHalfWidth
                title="recovery_code"
                stateKey="recovery_code"
                placeholder="enter-code"
                editValue={authenticatedAppCode?.recovery_code}
                errorPath="recovery_code"
                onValueChanged={(newValue) =>
                  onStateChanged({
                    ...authenticatedAppCode,
                    recovery_code: newValue && newValue.value,
                  })
                }
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                type="text"
              />
              <div className="font-12 text-info d-flex-v-start-h-end ">
                <ButtonBase onClick={() => setShowActiveTab(false)}>
                  {t(`${translationPath}use-your-authenticator-app-code`)}
                </ButtonBase>
              </div>
            </div>
          )}
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      onSaveClicked={saveHandler}
      onCloseClicked={isOpenChanged}
      isSaving={isLoading}
      saveIsDisabled={!authenticatedAppCode}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ChangeAuthenticatorAppDialog.propTypes = {
  isOpen: PropTypes.bool,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  setReLoad: PropTypes.instanceOf(Object),
  authenticatedAppDataEmail: PropTypes.string,
  onSave: PropTypes.func,
  onSaveDelete: PropTypes.func,
  dialogType: PropTypes.instanceOf(Object),
};
