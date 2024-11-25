import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { SharedInputControl } from '../setups/shared';
import { useTranslation } from 'react-i18next';
import { AfterLoginHandler, showError, showSuccess } from '../../helpers';
import { ButtonBase } from '@mui/material';
import { AuthenticatorCodeVerify } from '../../services/SetupsAuthenticatorApp.Services';
import { LoginService } from '../../services';
import { VerifyRecoveryCode } from '../../services/SetupsRecoveryCodes.Services';
import { VerifyCodeByEmail } from '../../services/SetupsEmailBasedAuthentication.Services';
import PropTypes from 'prop-types';

const parentTranslationPath = 'SetupsPage';
const translationPath = 'SecurityPages.';
const VerifyCodeApp = ({
  state,
  setState,
  codeType,
  dispatch,
  query,
  setBackDropLoader,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecoveryTap, setShowRecoveryTap] = useState(false);
  const [verifyCode, setVerifyCode] = useState();
  const LoginHandler = async ({ afterSuccessfullyLogin }) => {
    const param = localStorage.getItem('redirect_to');
    // Set the submitted state to true
    setState((items) => ({
      ...items,
      submitted: true,
    }));
    const res = await LoginService({
      ...state,
      ...param,
      email: state.email?.toLowerCase() || '',
    });
    if (res && res.status === 200)
      await AfterLoginHandler({
        response: res,
        // isRedirect: false,
        translationPath,
        t,
        setState,
        state,
        dispatch,
        query,
        setBackDropLoader,
        afterSuccessfullyLogin: afterSuccessfullyLogin,
        verifyUserDeviceRes: codeType?.verifyUserDeviceRes,
      });
    else {
      setState((items) => ({
        ...items,
        submitted: false,
        errors: res?.data?.errors,
        error: true,
      }));
      if (res && res.status === 401) showError('', res);
    }
  };

  const verifyAuthenticatorHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await AuthenticatorCodeVerify({
      code: verifyCode?.code,
      email: state?.email,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(response.data.message);
      LoginHandler({});
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  const verifyRecoveryHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await VerifyRecoveryCode({
      recovery_code: verifyCode?.recovery_code,
      email: state?.email,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(response.data.message);
      LoginHandler({});
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  const verifyEmailHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await VerifyCodeByEmail({
      verification_code: verifyCode?.verification_code,
      email: state?.email,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(response.data.message);
      LoginHandler({
        afterSuccessfullyLogin: () =>
          window.location.assign('/setups/security/Authenticator-app-setup'),
        verifyUserDeviceRes: codeType?.verifyUserDeviceRes,
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  return (
    <>
      <div className="login-card-wrapper">
        <Card className="border-0 mb-0">
          <CardBody className="px-lg-5 py-lg-5">
            {!showRecoveryTap && codeType.type === 'authenticator-app-code' && (
              <div className="body-item-wrapper">
                <p className="m-3">
                  {' '}
                  {t(`${translationPath}enter-the-6-digit-code-you-see-in-the-app`)}
                </p>
                <SharedInputControl
                  wrapperClasses="ml-2"
                  isFullWidth
                  title="code"
                  stateKey="code"
                  placeholder="enter-code"
                  editValue={verifyCode?.code}
                  onValueChanged={(newValue) =>
                    setVerifyCode({
                      ...verifyCode,
                      code: newValue && newValue.value,
                    })
                  }
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  type="text"
                />
                <div className="font-12 text-info d-flex-v-start-h-end ">
                  <ButtonBase onClick={() => setShowRecoveryTap(true)}>
                    {t(`${translationPath}use-your-recovery-code`)}
                  </ButtonBase>
                </div>
                <div className="mt-3 d-flex-h-center">
                  <ButtonBase
                    className="btns theme-solid"
                    onClick={verifyAuthenticatorHandler}
                    disabled={!verifyCode?.code}
                  >
                    {t(`${translationPath}verify-code`)}
                  </ButtonBase>
                </div>
              </div>
            )}
            {showRecoveryTap && codeType.type === 'authenticator-app-code' && (
              <div className="body-item-wrapper">
                <p className="m-3">
                  {' '}
                  {t(`${translationPath}enter-your-recovery-code`)}
                </p>
                <SharedInputControl
                  wrapperClasses="ml-2"
                  isFullWidth
                  title="recovery_code"
                  stateKey="recovery_code"
                  placeholder="enter-code"
                  editValue={verifyCode?.recovery_code}
                  errorPath="recovery_code"
                  onValueChanged={(newValue) =>
                    setVerifyCode({
                      ...verifyCode,
                      recovery_code: newValue && newValue.value,
                    })
                  }
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  type="text"
                />
                <div className="font-12 text-info d-flex-v-start-h-end ">
                  <ButtonBase onClick={() => setShowRecoveryTap(false)}>
                    {t(`${translationPath}use-your-authenticator-app-code`)}
                  </ButtonBase>
                </div>
                <div className="mt-3 d-flex-h-center">
                  <ButtonBase
                    className="btns theme-solid"
                    onClick={verifyRecoveryHandler}
                    disabled={!verifyCode?.recovery_code}
                  >
                    {t(`${translationPath}verify-code`)}
                  </ButtonBase>
                </div>
              </div>
            )}
            {!showRecoveryTap && codeType?.type === 'email' && (
              <div className="body-item-wrapper">
                <p className="m-3"> {t(`${translationPath}verification-code`)}</p>
                <SharedInputControl
                  wrapperClasses="ml-2"
                  isFullWidth
                  title="code"
                  stateKey="verification_code"
                  placeholder="enter-code"
                  editValue={verifyCode?.verification_code}
                  errorPath="verification-code"
                  onValueChanged={(newValue) =>
                    setVerifyCode({
                      ...verifyCode,
                      verification_code: newValue && newValue.value,
                    })
                  }
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  type="text"
                />
                <div className="mt-3 d-flex-h-center">
                  <ButtonBase
                    className="btns theme-solid"
                    onClick={verifyEmailHandler}
                    disabled={isLoading || !verifyCode?.verification_code}
                  >
                    {t(`${translationPath}verify-code`)}
                  </ButtonBase>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};
export default VerifyCodeApp;

VerifyCodeApp.propTypes = {
  codeType: PropTypes.instanceOf(Object),
  afterLoginHandler: PropTypes.func,
  state: PropTypes.shape({
    email: PropTypes.string,
  }),
  setState: PropTypes.func,
  dispatch: PropTypes.func,
  query: PropTypes.instanceOf(Object),
  setBackDropLoader: PropTypes.func,
};
