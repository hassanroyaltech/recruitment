/* eslint-disable no-param-reassign */
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import {
  AuthenticateUser,
  CancelNylasAccount,
  DeleteAccount,
  GenerateNylasToken,
  GetNylasUserDetails,
  ReactivateNylasAccount,
  UploadNylasFile,
  UploadSignature,
} from '../../services';
import { showError, showSuccess } from '../../helpers';
import { UploaderTypesEnum, SystemActionsEnum } from '../../enums';
import { updateEmailIntegration } from '../../stores/actions/emailIntegrationActions';
import { useQuery } from '../../hooks';
import { useHistory, useLocation } from 'react-router-dom';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EmailIntegrationSettingsPage.';

const EmailsIntegrationSettings = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const signatureRef = useRef();
  const [signature, setSignature] = useState('');
  const userReducer = useSelector((state) => state?.userReducer);
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const saveNewDetailsHandler = useCallback(async () => {
    if (!userReducer) return;
    // Get user details for email integration if user is authenticated with Nylas
    const nylasUserDetails = await GetNylasUserDetails({
      user_uuid: userReducer.results.user.uuid,
    });

    window?.ChurnZero?.push([
      'setAttribute',
      'contact',
      'Connected to nylas email integration',
      nylasUserDetails?.data?.body
      && nylasUserDetails?.data?.body?.sync_state === 'running'
        ? 'Yes'
        : 'No',
    ]);

    if (
      nylasUserDetails
      && nylasUserDetails.status === 200
      // && nylasUserDetails.data?.body
    )
      dispatch(updateEmailIntegration(nylasUserDetails.data.body));

    if (nylasUserDetails.status === 200) {
      showSuccess(nylasUserDetails.data.message);
      localStorage.setItem(
        'nylasAccountInfo',
        JSON.stringify(nylasUserDetails.data.body),
      );
    } else showError(nylasUserDetails.data.message);
  }, [dispatch, userReducer]);

  const EmailAuthenticationHandler = useCallback(async () => {
    // setIsLoading(true);
    const response = await AuthenticateUser({
      user_uuid: userReducer.results.user.uuid,
      redirect_url: `${process.env.REACT_APP_HEADERS}/recruiter/mailbox/settings`,
      // redirect_url: 'http://localhost:3000/recruiter/mailbox/settings',
      login_hint: '',
      scopes: 'email, calendar, contacts', // change
    });
    if (response && response.status === 200)
      openInNewTab(response.data.body.auth_url);
    else showError('Failed to get authentication url');
    // setIsLoading(false);
  }, [userReducer.results.user]);

  const EmailAuthenticationCancelHandler = useCallback(async () => {
    // setIsLoading(true);
    const response = await CancelNylasAccount({
      user_uuid: userReducer?.results?.user.uuid,
      account_id: emailIntegrationReducer?.account_id,
    });
    if (response && response.status === 200) {
      showSuccess(response.data.message);
      setTimeout(() => {
        saveNewDetailsHandler();
      }, 2000);
    } else showError(response?.data?.message);
    // setIsLoading(false);
  }, [emailIntegrationReducer, saveNewDetailsHandler, userReducer]);

  const EmailAuthenticationReactivateHandler = useCallback(async () => {
    // setIsLoading(true);
    const response = await ReactivateNylasAccount({
      user_uuid: userReducer.results.user.uuid,
      account_id: emailIntegrationReducer.account_id,
    });
    if (response && response.status === 200) {
      showSuccess(response.data.message);
      setTimeout(() => {
        saveNewDetailsHandler();
      }, 2000);
    } else showError(response.data.message);
    // setIsLoading(false);
  }, [emailIntegrationReducer, saveNewDetailsHandler, userReducer]);

  const DeleteAccountHandler = useCallback(async () => {
    const response = await DeleteAccount({
      user_uuid: userReducer.results.user.uuid,
      account_id: emailIntegrationReducer.account_id,
    });
    if (response && response.status === 200) {
      showSuccess(response.data.message);
      setTimeout(() => {
        saveNewDetailsHandler();
      }, 2000);
    } else showError(response.data.message);
  }, [emailIntegrationReducer, saveNewDetailsHandler, userReducer]);

  const UploadSignatureHandler = useCallback(
    async (file) => {
      if (file?.target?.files?.[0]?.name) {
        const uploadedFile = await UploadNylasFile({
          user_uuid: userReducer.results.user.uuid,
          upload_file: file.target.files[0],
          is_candidate: false,
        });
        if (uploadedFile?.status === 200) {
          const uploadedSignature = await UploadSignature({
            user_uuid: userReducer.results.user.uuid,
            file_id: uploadedFile.data.body.file_uuid,
          });
          if (uploadedSignature?.status === 200) {
            setTimeout(() => {
              saveNewDetailsHandler();
            }, 2000);
            // setLocalSignature(uploadedSignature.data.body.id);
            showSuccess(uploadedSignature.data.message);
          } else
            showError(
              t('failed-to-get-saved-data'),
              uploadedSignature?.data?.message,
            );
        } else showError(t('failed-to-get-saved-data'), uploadedFile?.data?.message);
      }
    },
    [emailIntegrationReducer, saveNewDetailsHandler, t, userReducer],
  );

  const userToken
    = (localStorage.getItem('token')
      && JSON.parse(localStorage.getItem('token')).token)
    || '';

  const GetSignatureHandler = useCallback(async () => {
    const fetchedResource = await fetch(
      `${process.env.REACT_APP_API_NYLAS_BASE_URL}/files/download?user_uuid=${userReducer.results.user.uuid}&access_token=${emailIntegrationReducer.access_token}&file_id=${emailIntegrationReducer.nylas_signature}`,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
    const reader = await fetchedResource.body.getReader();
    let chunks = [];
    reader.read().then(function processText({ done, value }) {
      if (done) {
        const blob = new Blob([chunks], { type: 'image/png' });
        setSignature(URL.createObjectURL(blob));
        return;
      }
      const tempArray = new Uint8Array(chunks.length + value.length);
      tempArray.set(chunks);
      tempArray.set(value, chunks.length);
      chunks = tempArray;

      return reader.read().then(processText);
    });
  }, [emailIntegrationReducer, userReducer, userToken]);

  useEffect(() => {
    if (
      emailIntegrationReducer?.nylas_signature
      && emailIntegrationReducer?.sync_state === 'running'
      && emailIntegrationReducer?.billing_state === 'paid'
    )
      GetSignatureHandler();
  }, [GetSignatureHandler, emailIntegrationReducer]);

  const generateNylasTokenHandler = useCallback(
    async (nylasCode) => {
      const response = await GenerateNylasToken({
        code: nylasCode,
        user_uuid: userReducer?.results?.user.uuid,
        redirect_url: `${process.env.REACT_APP_HEADERS}/recruiter/mailbox/settings`,
      });
      if (response?.status === 200) {
        window?.ChurnZero?.push([
          'trackEvent',
          'Integrate Email',
          'Integrate Email',
          1,
          {},
        ]);
        showSuccess(response.data.message);
        dispatch(updateEmailIntegration(response?.data?.body));
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.has('code')) {
          queryParams.delete('code');
          history.replace({
            search: queryParams.toString(),
          });
        }
      } else showError('failed', response?.data.message);
    },
    [userReducer?.results?.user.uuid, dispatch, location.search, history],
  );

  useEffect(() => {
    const nylasCode = query.get('code');
    if (nylasCode) generateNylasTokenHandler(nylasCode.replace('#', ''));
  }, [generateNylasTokenHandler, query]);

  /*
    billing state === cancelled => reactivate
    State logic: 
    billing_state => cancelled / sync_state => invalid-credentials / reactivate / connect
    billing_state => cancelled / sync_state => stopped / reactivate
    billing_state => cancelled / sync_state => running / NA it won't happen but in case it happens enable (reactivate)
    billing_state => cancelled / sync_state => partial / reactivate
    billing_state => paid / sync_state => invalid-credentials / connect
    billing_state => paid / sync_state => stopped / connect
    billing_state => paid / sync_state => running / disconnect
    billing_state => paid / sync_state => partial / disconnect
    billing_state => paid / sync_state => initializing / disconnect
  */

  return (
    <div className="email-integration-settings-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}email-integration-setting`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}email-integration-setting-description`)}
        </span>
      </div>
      <div className="page-body-wrapper d-flex-center">
        <div className="px-2">
          <div>
            <ButtonBase
              onClick={() => {
                // TODO: add a popup here to ask the user if he wants to confirm
                EmailAuthenticationHandler();
              }}
              className="btns theme-solid mb-2"
              disabled={
                emailIntegrationReducer?.is_connected === true
                || emailIntegrationReducer?.billing_state === 'cancelled'
                || (emailIntegrationReducer?.billing_state === 'paid'
                  && emailIntegrationReducer?.sync_state !== 'stopped'
                  && !emailIntegrationReducer?.sync_state.includes('invalid'))
              }
            >
              <span className="px-1">
                {t(`${translationPath}authenticate-account`)}
              </span>
            </ButtonBase>
            <ButtonBase
              onClick={() => {
                // TODO: add a popup here to ask the user if he wants to confirm
                EmailAuthenticationCancelHandler();
              }}
              className="btns theme-solid mb-2"
              disabled={
                !emailIntegrationReducer?.access_token
                || emailIntegrationReducer?.billing_state === 'cancelled'
                || emailIntegrationReducer?.sync_state === 'stopped'
                || emailIntegrationReducer?.sync_state?.includes('invalid')
              }
            >
              <span className="px-1">{t(`${translationPath}cancel-account`)}</span>
            </ButtonBase>
            <ButtonBase
              onClick={() => {
                // TODO: add a popup here to ask the user if he wants to confirm
                EmailAuthenticationReactivateHandler();
              }}
              className="btns theme-solid mb-2"
              disabled={
                !emailIntegrationReducer?.access_token
                || emailIntegrationReducer?.billing_state !== 'cancelled'
              }
            >
              <span className="px-1">
                {t(`${translationPath}reactivate-account`)}
              </span>
            </ButtonBase>
            <ButtonBase
              onClick={() => {
                // TODO: add a popup here to ask the user if he wants to confirm
                DeleteAccountHandler();
              }}
              className="btns theme-solid mb-2"
              disabled={
                !emailIntegrationReducer?.access_token
                || emailIntegrationReducer?.billing_state === 'cancelled'
                || emailIntegrationReducer?.sync_state === 'stopped'
                || emailIntegrationReducer?.sync_state?.includes('invalid')
              }
            >
              <span className="px-1">{t(`${translationPath}delete-account`)} </span>
            </ButtonBase>
          </div>
          {!(
            !emailIntegrationReducer?.access_token
            || emailIntegrationReducer?.billing_state === 'cancelled'
            || emailIntegrationReducer?.sync_state === 'stopped'
            || emailIntegrationReducer?.sync_state?.includes('invalid')
          ) && (
            <div className="upload-signature mt-4">
              <ButtonBase
                className="theme-transparent mx-1 "
                onClick={() => {
                  signatureRef.current.click();
                }}
              >
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept={UploaderTypesEnum.Image.accept}
                  onChange={(file) => {
                    if (file?.target?.files[0].type?.includes('image/'))
                      UploadSignatureHandler(file);
                    else showError(t(`${translationPath}image-validation`));
                  }}
                  max="1"
                  ref={signatureRef}
                />
                <span className={`${SystemActionsEnum.attachment.icon} mr-2`} />
                {t(`${translationPath}upload-signature`)}
              </ButtonBase>
              <div>
                {signature && (
                  <>
                    {/* <img src={signature} width={500} alt="signature" /> */}
                    <a href={signature} target="_blank" rel="noreferrer">
                      {t(`${translationPath}show-signature`)}
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailsIntegrationSettings;
