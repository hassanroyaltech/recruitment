// React and reactstrap
import React, { useState, useCallback, useEffect } from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import PropTypes from 'prop-types';
// Modals
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';

// Stylesheet
import 'assets/scss/elevatus/_evabrand.scss';
import { useToasts } from 'react-toast-notifications';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
  showSuccess,
} from '../../../../helpers';
import {
  AppearanceManagementDialog,
  SEOManagementDialog,
  SignupRequirementsManagementDialog,
  SocialMediaManagementDialog,
} from '../../dialogs';
import {
  ChangeSubDomain,
  EvaBrandPublish,
  GetInfoCompanyInfo,
} from '../../../../services';
import { NoPermissionComponent } from '../../../../shared/NoPermissionComponent/NoPermissionComponent';
import { DialogComponent, Inputs, SwitchComponent } from '../../../../components';
import { EvaBrandPermissions } from '../../../../permissions';
import { CurrentFeatures } from '../../../../enums';

const translationPath = '';

/**
 * HeaderBarSection constructor
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const HeaderBarSection = ({
  // onSave,
  addSectionsClicked,
  menuToggleHandler,
  onLanguageChange,
  isLoading,
  isLoadingPartial,
  isPublished,
  isDefault,
  isShowCategory,
  onIsPublishedChangedHandler,
  onIsDefaultChangedHandler,
  language,
  languages,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [isChangeSubDomainLoading, setIsChangeSubDomainLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpenSocialMediaManagementDialog, setIsOpenSocialMediaManagementDialog]
    = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  // Modals Logics
  const [isOpenAppearanceManagementDialog, setIsOpenAppearanceManagementDialog]
    = useState(false);
  const [isOpenSEOManagementDialog, setIsOpenSEOManagementDialog] = useState(false);
  const [isOpenSubDomainDialog, setIsOpenSubDomainDialog] = useState(false);
  const [isInfoLoading, setIsInfoLoading] = useState(true);
  const defaultCompanyState = {
    companyName: null,
    subDomain: null,
  };
  const [companySettingsState, setCompanySettingsState]
    = useState(defaultCompanyState);
  const [
    isOpenSignupRequirementsManagementDialog,
    setIsOpenSignupRequirementsManagementDialog,
  ] = useState(false);

  // Handler to close modals
  const closeModal = () => {
    setIsOpenAppearanceManagementDialog(false);
    setIsOpenSignupRequirementsManagementDialog(false);
  };

  // Publish Logic
  const [isWorking, setIsWorking] = useState(false);
  const doPublish = async () => {
    setIsWorking(true);
    const result = await EvaBrandPublish();
    setIsWorking(false);
    if (result && result.status === 200) {
      showSuccess(t(`${translationPath}published`));
      window?.ChurnZero?.push([
        'trackEvent',
        'Eva Brand - Publish career portal',
        'Publish career portal',
        1,
        {},
      ]);
    }
    // if (onSave) onSave();
    else showError(t(`${translationPath}error-in-publishing-your-changes`), result);
  };

  const subDomainMenuCLoseHandler = () => {
    setIsSubmitted(false);
    setIsOpenSubDomainDialog(false);
    setIsChangeSubDomainLoading(false);
    setTimeout(() => {
      setCompanySettingsState(defaultCompanyState);
    }, 700);
  };

  // const subDomainMenuOpenHandler = () => {
  //   setIsOpenSubDomainDialog(true);
  // };

  const changeSubDomainHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitted(true);

      if (companySettingsState.subDomain && companySettingsState.subDomain) {
        setIsChangeSubDomainLoading(true);
        const result = await ChangeSubDomain({
          sub_domain: companySettingsState.subDomain,
          name: companySettingsState.companyName,
        });

        if (result && result.status === 202) {
          localStorage.setItem(
            'careerPortalUrl',
            `https://${companySettingsState?.subDomain}.${process.env.REACT_APP_ELEVATUS_DOMAIN}`,
          );

          addToast(t(`${translationPath}company-settings-changed-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setIsOpenSubDomainDialog(false);
          setIsChangeSubDomainLoading(false);
          setTimeout(() => {
            setCompanySettingsState(defaultCompanyState);
          }, 700);
        } else {
          if (result && result.data && result.data.errors)
            addToast(
              Object.values(result.data.errors).map((item, index) => (
                <div key={`${index + 1}-error`}>{`- ${item}`}</div>
              )),
              { appearance: 'error', autoDismiss: true },
            );
          else if (result && result.data && result.data.message)
            addToast(result.data.message, {
              appearance: 'error',
              autoDismiss: true,
            });

          setIsChangeSubDomainLoading(false);
        }
      }
    },
    [
      t,
      addToast,
      defaultCompanyState,
      companySettingsState.subDomain,
      companySettingsState.companyName,
    ],
  );

  const getAllCompanyInfo = useCallback(async () => {
    const result = await GetInfoCompanyInfo();

    if (result && result.status === 202) {
      const { results } = result.data;

      setCompanySettingsState({
        companyName: results.name || null,
        subDomain: results.subdomain || null,
      });
    } else if (result.data.message)
      addToast(result.data.message, { appearance: 'error', autoDismiss: true });

    setIsInfoLoading(false);
  }, [addToast]);

  useEffect(() => {
    if (isOpenSubDomainDialog) getAllCompanyInfo();
  }, [getAllCompanyInfo, isOpenSubDomainDialog]);

  /**
   * Return JSX
   */
  return (
    <div className="eva-brand-header-wrapper">
      <div className="d-inline-flex-center flex-wrap">
        <ButtonBase
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              permissionId: EvaBrandPermissions.SignUpRequirementsInEvaBrand.key,
            })
            || !getIsAllowedSubscription({
              slugId: CurrentFeatures.signup_requirements.permissionsId,
              subscriptions,
            })
            || isLoading
          }
          className="btns theme-shadow mb-2"
          onClick={() => setIsOpenSignupRequirementsManagementDialog(true)}
        >
          {t(`${translationPath}sign-up-requirements`)}
        </ButtonBase>
        <ButtonBase
          className="btns theme-shadow mb-2"
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
              },
            }) || isLoading
          }
          onClick={() => setIsOpenSEOManagementDialog(true)}
        >
          <span className="fab fa-searchengin" />
          <span className="mx-1">{t(`${translationPath}seo`)}</span>
        </ButtonBase>
        <ButtonBase
          className="btns theme-shadow mb-2"
          onClick={() => setIsOpenSocialMediaManagementDialog(true)}
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
              },
            }) || isLoading
          }
        >
          <span className="fas fa-link" />
          <span className="px-1">{t(`${translationPath}social-media-links`)}</span>
        </ButtonBase>
        <ButtonBase
          className="btns theme-shadow mb-2"
          onClick={() => setIsOpenAppearanceManagementDialog(true)}
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
              },
            }) || isLoading
          }
        >
          <i className="fas fa-paint-brush mr-1-reversed" />
          {t(`${translationPath}color`)}
        </ButtonBase>
        <FormControl
          variant="outlined"
          size="small"
          className="d-inline-flex-v-center evabrand-select-language mx-1 mb-2"
        >
          <Select
            className="text-white bg-primary rounded"
            size="small"
            value={language || ''}
            onChange={(event) => {
              const {
                target: { value },
              } = event;
              if (onLanguageChange) onLanguageChange(value);
            }}
          >
            {languages
              && languages.map((lang, i) => (
                <MenuItem key={`${i + 1}-lang-item`} value={lang}>
                  {t(`${translationPath}${lang.title}`)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <div className="d-inline-flex-v-center mb-2">
          <SwitchComponent
            idRef="defaultSwitchRef"
            label="default"
            isChecked={isDefault}
            isReversedLabel
            isFlexEnd
            isDisabled={
              !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                  AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
                },
              })
              || isLoading
              || isLoadingPartial
              || isDefault
            }
            onChange={onIsDefaultChangedHandler}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-inline-flex-v-center mb-2">
          <SwitchComponent
            idRef="publishSwitchRef"
            label="published"
            isChecked={isPublished}
            isReversedLabel
            isFlexEnd
            isDisabled={
              !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                  AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
                },
              })
              || isLoading
              || isLoadingPartial
              || isDefault
            }
            onChange={onIsPublishedChangedHandler}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <ButtonBase
          className="btns theme-shadow mb-2"
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
              },
            }) || isLoading
          }
          onClick={addSectionsClicked}
        >
          <i className="fas fa-plus mr-1-reversed" />
          {t(`${translationPath}add-section`)}
        </ButtonBase>
        <ButtonBase
          className="btns theme-shadow mb-2"
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                UpdateEvaBrand: EvaBrandPermissions.UpdateEvaBrand,
                AddEvaBrand: EvaBrandPermissions.AddEvaBrand,
                DeleteEvaBrand: EvaBrandPermissions.DeleteEvaBrand,
              },
            }) || isLoading
          }
          onClick={menuToggleHandler}
        >
          {t(`${translationPath}sections-management`)}
        </ButtonBase>
        {/* <ButtonBase
          disabled={isLoading}
          onClick={subDomainMenuOpenHandler}
          className="btns theme-shadow mb-2"

        >
          <i className="fas fa-cog pr-2-reversed" />
          {t(`${translationPath}company-settings`)}
        </ButtonBase> */}
      </div>

      <div className="d-inline-flex-v-center mb-2">
        <ButtonBase
          className="btns theme-solid bg-green-primary"
          onClick={doPublish}
          disabled={
            !getIsAllowedPermissionV2({
              permissions,
              permissionId: EvaBrandPermissions.PublishEvaBrand.key,
            })
            || isLoading
            || isLoadingPartial
            || isWorking
          }
        >
          {isWorking && <i className="fas fa-circle-notch fa-spin mr-2-reversed" />}
          {!isWorking
            ? t(`${translationPath}publish`)
            : t(`${translationPath}publishing`)}
        </ButtonBase>
      </div>
      {isOpenSocialMediaManagementDialog && (
        <SocialMediaManagementDialog
          language_uuid={(language && language.id) || null}
          language={language}
          isOpen={isOpenSocialMediaManagementDialog}
          isOpenChanged={() => {
            setIsOpenSocialMediaManagementDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {/* Modals */}
      {isOpenAppearanceManagementDialog && (
        <AppearanceManagementDialog
          language_uuid={(language && language.id) || null}
          language={language}
          isOpen={isOpenAppearanceManagementDialog}
          closeModal={closeModal}
        />
      )}
      {isOpenSEOManagementDialog && (
        <SEOManagementDialog
          language_uuid={(language && language.id) || null}
          language={language}
          isOpen={isOpenSEOManagementDialog}
          isOpenChanged={() => setIsOpenSEOManagementDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenSignupRequirementsManagementDialog && (
        <SignupRequirementsManagementDialog
          language_uuid={(language && language.id) || null}
          language={language}
          isShowCategory={isShowCategory}
          isOpen={isOpenSignupRequirementsManagementDialog}
          isOpenChanged={() => setIsOpenSignupRequirementsManagementDialog(false)}
        />
      )}
      <DialogComponent
        dialogContent={
          <div className="d-flex-column-center px-4">
            <Inputs
              label="company-name"
              wrapperClasses="pb-3"
              themeClass="theme-solid"
              isSubmitted={isSubmitted}
              idRef="companyNameInputRef"
              inputPlaceholder="company-name"
              translationPath={translationPath}
              error={!companySettingsState.companyName}
              parentTranslationPath={parentTranslationPath}
              value={companySettingsState.companyName || ''}
              helperText={
                !companySettingsState.companyName
                  ? t(`${translationPath}company-name-is-required`)
                  : ''
              }
              onInputChanged={(event) => {
                const { value } = event.target;
                setCompanySettingsState((items) => ({
                  ...items,
                  companyName: value,
                }));
              }}
            />
            <Inputs
              label="sub-domain"
              wrapperClasses="pb-3"
              themeClass="theme-solid"
              isSubmitted={isSubmitted}
              idRef="subDomainInputRef"
              inputPlaceholder="sub-domain"
              translationPath={translationPath}
              error={!companySettingsState.subDomain}
              value={companySettingsState.subDomain || ''}
              parentTranslationPath={parentTranslationPath}
              endAdornment={
                <span
                  className={`pr-3-reversed pt-1 
                ${
    !companySettingsState.subDomain
                  && companySettingsState.subDomain !== null
      ? 'text-danger'
      : ''
    }`}
                >
                  {`.${process.env.REACT_APP_ELEVATUS_DOMAIN}`}
                </span>
              }
              helperText={
                !companySettingsState.subDomain
                  ? t(`${translationPath}subdomain-is-required`)
                  : ''
              }
              onInputChanged={(event) => {
                const { value } = event.target;
                setCompanySettingsState((items) => ({ ...items, subDomain: value }));
              }}
            />
          </div>
        }
        maxWidth="sm"
        saveIsDisabled={isInfoLoading}
        isOpen={isOpenSubDomainDialog}
        titleClasses="pl-3-reversed pb-2"
        onSubmit={changeSubDomainHandler}
        translationPath={translationPath}
        isSaving={isChangeSubDomainLoading}
        onCloseClicked={subDomainMenuCLoseHandler}
        onCancelClicked={subDomainMenuCLoseHandler}
        parentTranslationPath={parentTranslationPath}
        dialogTitle={t(`${translationPath}company-settings`)}
      />
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </div>
  );
};
export default HeaderBarSection;

HeaderBarSection.propTypes = {
  onLanguageChange: PropTypes.func.isRequired,
  addSectionsClicked: PropTypes.func.isRequired,
  menuToggleHandler: PropTypes.func.isRequired,
  // onSave: PropTypes.func,
  isPublished: PropTypes.bool,
  isDefault: PropTypes.bool,
  isShowCategory: PropTypes.bool,
  onIsPublishedChangedHandler: PropTypes.func,
  onIsDefaultChangedHandler: PropTypes.func,
  language: PropTypes.instanceOf(Object),
  languages: PropTypes.instanceOf(Array).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoadingPartial: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

HeaderBarSection.defaultProps = {
  language: null,
  isDefault: false,
  isPublished: false,
  isShowCategory: false,
  onIsPublishedChangedHandler: undefined,
  onIsDefaultChangedHandler: undefined,
  // onSave: undefined,
};
