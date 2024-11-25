import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../../hooks';
import {
  getErrorByName,
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../helpers';
import {
  GetSecurityMFASettings,
  GetTokenAndSessionSettings,
  UpdateSecurityMFASettings,
  UpdateTokenAndSessionSettings,
} from '../../../../services';
import { SwitchComponent } from '../../../../components';
import RecoveryCode from './RecoveryCode';
import { MFAPermissions } from '../../../../permissions/setups/security/MFA.Permissions';
import { useSelector } from 'react-redux';
import { SharedInputControl } from '../../shared';
import { boolean, number, object } from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
// import RecoveryCode from "./RecoveryCode";
// import { SecurityAuthenticationTypesEnum } from '../../../../enums';

const parentTranslationPath = 'SetupsPage';
const translationPath = 'SecurityPages.';
const SecurityManagementPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}security-management`));
  // const [securityAuthenticationTypes] = useState(() =>
  //   Object.values(SecurityAuthenticationTypesEnum).map((item) => ({
  //     ...item,
  //     value: t(`${translationPath}${item.value}`),
  //   }))
  // );
  const [securitySettings, setSecuritySettings] = useState({
    recruiters_enable: false,
    // recruiters_way_type: SecurityAuthenticationTypesEnum.Any.key,
    candidates_enable: false,
    // candidates_way_type: SecurityAuthenticationTypesEnum.Any.key,
  });
  const [isLoading, setIsLoading] = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const [errors, setErrors] = useState(() => ({}));
  const isTokenAndSessionChangedRef = useRef(false);
  const tokenAndSessionSettingsInitRef = useRef({
    with_token_expiry_control: false,
    with_session_expiry_control: false,
    token_expiry: 72,
    session_expiry: 72,
  });
  const [tokenAndSessionSettings, setTokenAndSessionSettings] = useState(
    tokenAndSessionSettingsInitRef.current,
  );

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the status of the two-way authentication on switch change
   */
  const onTwoWayAuthenticationChanged = (key) => async (event, isChecked) => {
    setIsLoading(true);
    const response = await UpdateSecurityMFASettings({
      ...securitySettings,
      [key]: isChecked,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      setSecuritySettings((items) => ({ ...items, [key]: isChecked }));
      showSuccess(
        t(
          `${translationPath}two-way-authentication-${
            (isChecked && 'enabled') || 'disabled'
          }-successfully`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}two-way-authentication-${
            (isChecked && 'enable') || 'disable'
          }-failed`,
        ),
        response,
      );
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the changes on the token and session settings
   */
  const saveTokenAndSessionHandler = async () => {
    setIsLoading(true);
    const response = await UpdateTokenAndSessionSettings(tokenAndSessionSettings);
    if (response && response.status === 200) {
      isTokenAndSessionChangedRef.current = false;
      setIsLoading(false);
      showSuccess(t(`${translationPath}token-and-session-updated-successfully`));
    } else {
      setIsLoading(false);
      showError(t(`${translationPath}token-and-session-update-failed`), response);
    }
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return current account settings
   */
  const getTokenAndSessionSettings = useCallback(async () => {
    const response = await GetTokenAndSessionSettings();
    setIsLoading(false);
    if (response && response.status === 200)
      setTokenAndSessionSettings(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return current account settings
   */
  const getSecuritySettings = useCallback(async () => {
    setIsLoading(true);
    const response = await GetSecurityMFASettings();
    void getTokenAndSessionSettings();
    if (response && response.status === 200) {
      if (response.data.results) setSecuritySettings(response.data.results);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [getTokenAndSessionSettings, t]);

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the type of security settings
   */
  // const onTwoWayTypeChanged = (key) => async (event, newValue) => {
  //   setIsLoading(true);
  //   const response = await UpdateSecurityMFASettings(securitySettings);
  //   setIsLoading(false);
  //   if (response && response.status === 200) {
  //     setSecuritySettings((items) => ({ ...items, [key]: +newValue }));
  //     showSuccess(t(`${translationPath}authentication-way-changed-successfully`));
  //   } else
  //     showError(t(`${translationPath}authentication-way-change-failed`), response);
  // };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   @Description this method is to get the errors list
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: object().shape({
          with_token_expiry_control: boolean().nullable(),
          token_expiry: number()
            .nullable()
            .when('with_token_expiry_control', (value, schema) =>
              value
                ? schema
                  .required(t('Shared:this-field-is-required'))
                  .max(
                    720,
                    `${t(
                      'Shared:this-field-must-be-less-than-or-equal',
                    )} ${720} ${t('hours')}`,
                  )
                  .min(
                    0.5,
                    `${t(
                      'Shared:this-field-must-be-more-than-or-equal',
                    )} ${0.5} ${t('hours')}`,
                  )
                : schema,
            ),
          with_session_expiry_control: boolean().nullable(),
          session_expiry: number()
            .nullable()
            .when('with_session_expiry_control', (value, schema) =>
              value
                ? schema
                  .required(t('Shared:this-field-is-required'))
                  .max(
                    596,
                    `${t(
                      'Shared:this-field-must-be-less-than-or-equal',
                    )} ${596} ${t('hours')}`,
                  )
                  .min(
                    0.5,
                    `${t(
                      'Shared:this-field-must-be-more-than-or-equal',
                    )} ${0.5} ${t('hours')}`,
                  )
                : schema,
            ),
        }),
      },
      tokenAndSessionSettings,
    ).then((result) => {
      setErrors(result);
    });
  }, [tokenAndSessionSettings, t]);

  useEffect(() => {
    getErrors();
  }, [tokenAndSessionSettings, getErrors]);

  useEffect(() => {
    getSecuritySettings();
  }, [getSecuritySettings]);

  return (
    <div className="security-management-wrapper page-wrapper">
      <span className="header-text-x2 d-flex mb-3 ml-3">
        {t(`${translationPath}2fa`)}
      </span>
      <div className="setups-card-wrapper">
        <div className="setups-content-wrapper">
          <div className="setups-card-body-wrapper">
            <div className="body-item-wrapper">
              <span className="header-text">
                {t(`${translationPath}two-way-authentication`)}
              </span>
              <span className="header-text c-gray-primary px-1">
                {t(`${translationPath}for-recruiters`)}
              </span>
            </div>
            <div className="body-item-wrapper mb-3">
              <span className="description-text">
                {t(
                  `${translationPath}two-way-authentication-recruiters-description`,
                )}
              </span>
            </div>
            {/*<div className="body-item-wrapper c-black-light">*/}
            {/*  <span>{t(`${translationPath}authentication-way`)}</span>*/}
            {/*</div>*/}
            {/*<div className="body-item-wrapper">*/}
            {/*  <RadiosComponent*/}
            {/*    idRef="recruitersAuthTypesRadiosRef"*/}
            {/*    themeClass="theme-column"*/}
            {/*    data={securityAuthenticationTypes}*/}
            {/*    valueInput="key"*/}
            {/*    labelInput="value"*/}
            {/*    value={securitySettings.recruiters_way_type}*/}
            {/*    isDisabled={isLoading || !securitySettings.recruiters_enable}*/}
            {/*    onSelectedRadioChanged={onTwoWayTypeChanged('recruiters_way_type')}*/}
            {/*    parentTranslationPath={parentTranslationPath}*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
          <div className="setups-card-footer-wrapper">
            <div></div>
            <div className="d-inline-flex">
              <SwitchComponent
                idRef="enableRecruitersSwitchRef"
                label={t(`${translationPath}enable`)}
                isChecked={securitySettings.recruiters_enable}
                isReversedLabel
                isDisabled={
                  isLoading
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: MFAPermissions.EnforceMFA.key,
                  })
                }
                isFlexEnd
                switchLabelClasses="fw-bold c-black-light"
                onChange={onTwoWayAuthenticationChanged('recruiters_enable')}
                parentTranslationPath={parentTranslationPath}
              />
            </div>
          </div>
        </div>
      </div>
      {/*<div className="setups-card-wrapper is-half-width">*/}
      {/*  <div className="setups-content-wrapper">*/}
      {/*    <div className="setups-card-body-wrapper">*/}
      {/*      <div className="body-item-wrapper">*/}
      {/*        <span className="header-text">*/}
      {/*          {t(`${translationPath}two-way-authentication`)}*/}
      {/*        </span>*/}
      {/*        <span className="header-text c-gray-primary px-1">*/}
      {/*          {t(`${translationPath}for-candidates`)}*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*      <div className="body-item-wrapper mb-3">*/}
      {/*        <span className="description-text">*/}
      {/*          {t(*/}
      {/*            `${translationPath}two-way-authentication-candidates-description`*/}
      {/*          )}*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*      /!*<div className="body-item-wrapper c-black-light">*!/*/}
      {/*      /!*  <span>{t(`${translationPath}authentication-way`)}</span>*!/*/}
      {/*      /!*</div>*!/*/}
      {/*      /!*<div className="body-item-wrapper">*!/*/}
      {/*      /!*  <RadiosComponent*!/*/}
      {/*      /!*    idRef="candidatesAuthTypesRadiosRef"*!/*/}
      {/*      /!*    themeClass="theme-column"*!/*/}
      {/*      /!*    data={securityAuthenticationTypes}*!/*/}
      {/*      /!*    valueInput="key"*!/*/}
      {/*      /!*    labelInput="value"*!/*/}
      {/*      /!*    value={securitySettings.candidates_way_type}*!/*/}
      {/*      /!*    isDisabled={isLoading || !securitySettings.candidates_enable}*!/*/}
      {/*      /!*    onSelectedRadioChanged={onTwoWayTypeChanged('candidates_way_type')}*!/*/}
      {/*      /!*    parentTranslationPath={parentTranslationPath}*!/*/}
      {/*      /!*  />*!/*/}
      {/*      /!*</div>*!/*/}
      {/*    </div>*/}
      {/*    <div className="setups-card-footer-wrapper">*/}
      {/*      <div></div>*/}
      {/*      <div className="d-inline-flex">*/}
      {/*        <SwitchComponent*/}
      {/*          idRef="enableCandidatesSwitchRef"*/}
      {/*          label={t(`${translationPath}enable`)}*/}
      {/*          isChecked={securitySettings.candidates_enable}*/}
      {/*          isReversedLabel*/}
      {/*          isDisabled={true}*/}
      {/*          isFlexEnd*/}
      {/*          switchLabelClasses="fw-bold c-black-light"*/}
      {/*          onChange={onTwoWayAuthenticationChanged('candidates_enable')}*/}
      {/*          parentTranslationPath={parentTranslationPath}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="setups-card-wrapper">
        <RecoveryCode />
      </div>
      <div className="separator-h mb-3" />
      <div className="setups-card-wrapper is-half-width">
        <div className="setups-content-wrapper">
          <div className="setups-card-body-wrapper">
            <div className="px-2">
              <span className="d-inline-flex">
                <SwitchComponent
                  idRef="withTokenExpiryControlRef"
                  label={t(`${translationPath}enable-token-expiry`)}
                  isChecked={tokenAndSessionSettings.with_token_expiry_control}
                  isReversedLabel
                  switchLabelClasses="fw-bold c-black-light"
                  onChange={(_event, isChecked) => {
                    isTokenAndSessionChangedRef.current = true;
                    setTokenAndSessionSettings((items) => ({
                      ...items,
                      token_expiry:
                        tokenAndSessionSettingsInitRef.current.token_expiry,
                      with_token_expiry_control: isChecked,
                    }));
                  }}
                  parentTranslationPath={parentTranslationPath}
                />
              </span>
              <div className="description-text mb-2">
                {t(`${translationPath}token-expiry-description`)}
              </div>
              {tokenAndSessionSettings.with_token_expiry_control && (
                <div>
                  <SharedInputControl
                    editValue={tokenAndSessionSettings.token_expiry}
                    isHalfWidth
                    inlineLabel="token-expiry-hours"
                    placeholder="token-expiry-hours"
                    stateKey="token_expiry"
                    isSubmitted
                    errors={errors}
                    errorPath="token_expiry"
                    onValueChanged={({ value }) => {
                      isTokenAndSessionChangedRef.current = true;
                      setTokenAndSessionSettings((items) => ({
                        ...items,
                        token_expiry: value,
                      }));
                    }}
                    wrapperClasses="px-0"
                    inlineLabelClasses="fw-bold fz-16px c-black-light"
                    type="number"
                    min={0}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
              )}
            </div>
            <div className="separator-h" />
            <div className="px-2">
              <span className="d-inline-flex">
                <SwitchComponent
                  idRef="withTokenExpiryControlRef"
                  label={t(`${translationPath}enable-session-expiry`)}
                  isChecked={tokenAndSessionSettings.with_session_expiry_control}
                  isReversedLabel
                  switchLabelClasses="fw-bold c-black-light"
                  onChange={(_event, isChecked) => {
                    isTokenAndSessionChangedRef.current = true;
                    setTokenAndSessionSettings((items) => ({
                      ...items,
                      session_expiry:
                        tokenAndSessionSettingsInitRef.current.session_expiry,
                      with_session_expiry_control: isChecked,
                    }));
                  }}
                  parentTranslationPath={parentTranslationPath}
                />
              </span>
              <div className="description-text mb-2">
                {t(`${translationPath}session-expiry-description`)}
              </div>
              {tokenAndSessionSettings.with_session_expiry_control && (
                <div>
                  <SharedInputControl
                    editValue={tokenAndSessionSettings.session_expiry}
                    isHalfWidth
                    inlineLabel="session-expiry-hours"
                    placeholder="session-expiry-hours"
                    stateKey="session_expiry"
                    isSubmitted
                    errors={errors}
                    errorPath="session_expiry"
                    onValueChanged={({ value }) => {
                      isTokenAndSessionChangedRef.current = true;
                      setTokenAndSessionSettings((items) => ({
                        ...items,
                        session_expiry: value,
                      }));
                    }}
                    wrapperClasses="px-0"
                    inlineLabelClasses="fw-bold fz-16px c-black-light"
                    type="number"
                    min={0}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                </div>
              )}
            </div>
            {isTokenAndSessionChangedRef.current && (
              <>
                <div className="separator-h mb-2" />
                <div className="w-100 d-flex-center">
                  <ButtonBase
                    className="btns theme-transparent"
                    onClick={saveTokenAndSessionHandler}
                  >
                    <span className="px-1">
                      {t(`${translationPath}save-changes`)}
                    </span>
                  </ButtonBase>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityManagementPage;
