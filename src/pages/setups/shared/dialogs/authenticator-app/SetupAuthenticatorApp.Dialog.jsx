import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';
import { QRCodeComponent } from '../../../../../components/QRCode/QRCode.Component';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import {
  CreateAuthenticatorApp,
  VerifyAuthenticatorApp,
} from '../../../../../services/SetupsAuthenticatorApp.Services';
import { SharedInputControl } from '../../controls';
import * as yup from 'yup';
import { updateUser } from '../../../../../stores/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';

export const SetupAuthenticatorAppDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  setReLoad,
  onSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  // const [isLoading, setIsLoading] = useState(false);
  const [authenticatedAppCode, setAuthenticatedAppCode] = useState();
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state?.userReducer);

  const onStateChanged = (newValue) => {
    setAuthenticatedAppCode(newValue);
  };
  const CreateAuthenticatedApp = useCallback(async () => {
    setIsLoading(true);
    const response = await CreateAuthenticatorApp();
    setIsLoading(false);
    if (response && response.status === 200) {
      if (response.data.results) setAuthenticatedAppCode(response.data.results);
    } else showError(t('Shared:failed-to-get-saved-data'));
  }, [t]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          code: yup
            .string()
            .nullable()
            .length(6)
            .required(t('Shared:this-field-is-required')),
        }),
      },
      authenticatedAppCode,
    ).then((result) => {
      setErrors(result);
    });
  }, [authenticatedAppCode, t]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const response = await VerifyAuthenticatorApp({
      code: authenticatedAppCode?.code,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (isOpenChanged) isOpenChanged();
      showSuccess(t(`${translationPath}authenticator-app-created-successfully`));
      if (onSave) onSave();
      setReLoad((prev) => ({ ...prev }));
      dispatch(
        updateUser({
          ...userReducer,
          results: {
            ...userReducer.results,
            user: { ...userReducer.results.user, has_authenticator_app: true },
          },
        }),
      );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  useEffect(() => {
    CreateAuthenticatedApp();
  }, [CreateAuthenticatedApp]);

  // this to call errors updater when filters changed
  useEffect(() => {
    getErrors();
  }, [getErrors, authenticatedAppCode]);

  return (
    <DialogComponent
      titleText="setup-authenticator-app"
      maxWidth="md"
      dialogContent={
        <div className="setup-authenticator-app-dialog-wrapper">
          <div className="body-item-wrapper">
            <div className="description-text">
              <ul>
                <li>{t(`${translationPath}authenticator-dialog-description`)}</li>
                <li>
                  {t(`${translationPath}authenticator-dialog-description-text`)}
                </li>
              </ul>
            </div>
            <br />
            <div className="content-item-wrapper">
              <div className="d-flex-h-center m-3">
                <QRCodeComponent value={authenticatedAppCode?.totp_path} />
              </div>
              <div className="d-flex-h-center py-4">
                <p>
                  {' '}
                  {t(`${translationPath}secret-key`)} {' : '}
                </p>
                <p>{authenticatedAppCode?.secret}</p>
              </div>
            </div>
          </div>
          <div className="footer-item-wrapper">
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
          </div>
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      onSaveClicked={saveHandler}
      onCloseClicked={isOpenChanged}
      isSaving={isLoading}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

SetupAuthenticatorAppDialog.propTypes = {
  isOpen: PropTypes.bool,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  setReLoad: PropTypes.instanceOf(Object),
  onSave: PropTypes.func,
};
