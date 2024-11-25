import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SharedInputControl } from '../setups/shared';
import { useQuery, useTitle } from '../../hooks';
import './Integrations.Style.scss';
import IntegrationsCard from './cards/integrations/Integrations.Card';
import ActiveIntegrationsDialog from './dialogs/active-integrations/ActiveIntegrations.Dialog';
import {
  GetAllIntegrationsConnections,
  GetAllIntegrationsConnectionsPHP,
} from '../../services';
import {
  GlobalHistory,
  GlobalLocation,
  showError,
  showSuccess,
} from '../../helpers';
import { IntegrationsPartnersEnum, SystemActionsEnum } from '../../enums';
import { DialogComponent } from '../../components';
import SMTPCard from './cards/smtp/SMTP.Card';
import { useSelector } from 'react-redux';
import ElevatusSDKCard from './cards/elevatus-sdk/ElevatusSDK.Card';

const parentTranslationPath = 'IntegrationsPage';
const translationPath = '';
const IntegrationsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t('Shared:integrations'));
  const query = useQuery();
  const isInitRef = useRef(true);
  const userReducer = useSelector((state) => state.userReducer);
  const isInitForRedirectRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activePartner, setActivePartner] = useState(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    activeIntegration: false,
    syncConfirm: false,
    disconnectConfirm: false,
    settings: false,
    smtp: false,
    syncUsersConfirm: false,
    elevatusSDK: false,
  });
  const [connections, setConnections] = useState({
    results: [],
    totalCount: 0,
    isReturned: false,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 99,
    search: '',
    return_images: true,
  });

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the filters from child
   */
  const onFiltersChanged = useCallback((newValue) => {
    setFilters((items) => ({
      ...items,
      ...newValue,
    }));
  }, []);

  /**
   * @param partnerKey - one of IntegrationsPartnersEnum keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the enum object for the current partner key
   */
  const getActivePartnerEnum = useMemo(
    () =>
      (partnerKey = activePartner && activePartner.partner) =>
        (partnerKey
          && Object.values(IntegrationsPartnersEnum).find(
            (item) => item.key === partnerKey,
          ))
        || {},
    [activePartner],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the integration list after update or delete from child
   */
  const onIntegrationReload = useCallback(() => {
    setFilters((items) => ({
      ...items,
      page: 1,
    }));
  }, []);

  /**
   * @param key
   * @param newValue - bool
   * @param isClearActiveItem - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback(
    (key, newValue, isClearActiveItem = false) =>
      () => {
        if (isClearActiveItem) setActivePartner(null);
        // setActionPartner(null);

        setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
      },
    [],
  );

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the redirect for a third party login
   */
  const getRedirectURIHandler = useCallback(
    async (api) => {
      if (!api) return;
      setIsLoading(true);
      const response = await api();
      if (response && response.status === 200)
        window.open(response.data.results.redirect_url, '_self');
      else showError(t(`${translationPath}integration-connect-failed`, response));
    },
    [t],
  );

  /**
   * @param api - api function to be call
   * @param payload - object that includes the payload for the connect api
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the direct connecting for provider
   */
  const onConnectHandler = useCallback(
    async (api, payload = undefined) => {
      if (!api) return;
      setIsLoading(true);
      const response = await api(payload);
      setIsLoading(false);
      if (response && response.status === 200) {
        GlobalHistory.replace(GlobalLocation.pathname);
        onIntegrationReload();
        showSuccess(t(`${translationPath}integration-connected-successfully`));
        if (
          payload
          && getActivePartnerEnum(payload.state).syncConnectAfterRedirectAPI
        ) {
          setActivePartner((items) => ({
            ...(items || {}),
            partner: payload.state,
            is_connected: true,
            isFromIntegrationForm: false,
          }));
          onIsOpenDialogsChanged('syncConfirm', true)();
        }
      } else showError(t(`${translationPath}integration-connect-failed`), response);
    },
    [getActivePartnerEnum, onIntegrationReload, onIsOpenDialogsChanged, t],
  );

  /**
   * @param {key, partner, isFromIntegrationForm} - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the actions of the cards or inside
   * the connecting management actions
   */
  const onActionClicked = useCallback(
    ({ key, activePartner, isFromIntegrationForm = false }) =>
      async () => {
        setActivePartner((items) => ({
          ...(items || {}),
          ...activePartner,
          isFromIntegrationForm,
        }));
        if (key === SystemActionsEnum.sync.key)
          onIsOpenDialogsChanged('syncConfirm', true)();
        if (key === SystemActionsEnum.syncUsers.key)
          onIsOpenDialogsChanged('syncUsersConfirm', true)();
        else if (key === SystemActionsEnum.disconnect.key)
          onIsOpenDialogsChanged('disconnectConfirm', true)();
        else if (key === SystemActionsEnum.settings.key)
          onIsOpenDialogsChanged('settings', true)();
        else if (key === SystemActionsEnum.connect.key)
          if (getActivePartnerEnum(activePartner.partner).getRedirectURIAPI)
            await getRedirectURIHandler(
              getActivePartnerEnum(activePartner.partner).getRedirectURIAPI,
            );
          else
            await onConnectHandler(
              getActivePartnerEnum(activePartner.partner).connectAPI,
            );
      },
    [
      getRedirectURIHandler,
      onConnectHandler,
      getActivePartnerEnum,
      onIsOpenDialogsChanged,
    ],
  );

  /**
   * @param newValue - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to go for the connection page of the selected type
   */
  const onConnectClicked = useCallback(
    (newValue) => () => {
      setActivePartner(newValue);
      onIsOpenDialogsChanged('activeIntegration', true)();
    },
    [onIsOpenDialogsChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const getAllIntegrationsConnections = useCallback(async () => {
    const user_uuid = userReducer?.results?.user?.uuid || '';
    if (!user_uuid) return;
    setIsLoading(true);
    const response = await Promise.all([
      GetAllIntegrationsConnections({ ...filters, user_uuid }),
      GetAllIntegrationsConnectionsPHP({ ...filters }),
    ]);

    setIsLoading(false);
    if (response && response.some((item) => item.status === 200)) {
      const successResponse = response.filter((item) => item.status === 200);
      const errorResponse = response.filter((item) => item.status !== 200);

      const results = successResponse.reduce((total, item) => {
        total.push(...(item.data.results || []));
        return total;
      }, []);
      setConnections({
        results,
        totalCount: successResponse.reduce(
          (total, item) =>
            total
            + ((item.data.paginate && item.data.paginate.total)
              || item.data.results.length
              || 0),
          0,
        ),
        isReturned: true,
      });
      // else
      //   setConnections((items) => ({
      //     results: [...items.results, ...results],
      //     totalCount: paginate.total || [...items.results, ...results].length,
      //   }));
      errorResponse.map((item) =>
        showError(t('Shared:failed-to-get-saved-data'), item),
      );
    } else {
      if (response)
        response.map((item) =>
          showError(t('Shared:failed-to-get-saved-data'), item),
        );
      else showError(t('Shared:failed-to-get-saved-data'));
      setConnections((items) => ({ ...items, isReturned: true }));
    }
  }, [filters, t, userReducer?.results?.user?.uuid]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const syncLookupsHandler = useCallback(
    async (event) => {
      event.preventDefault();
      if (!activePartner) return;
      setIsLoading(true);
      const response = await (
        getActivePartnerEnum(activePartner.partner).syncConnectAPI
        || getActivePartnerEnum(activePartner.partner).syncConnectAfterRedirectAPI
      )();
      //     {
      //   company_uuid: null,
      //   configuration_level: 'account',
      // }
      setIsLoading(false);
      if (response && response.status === 200) {
        if (activePartner.isFromIntegrationForm) {
          onIntegrationReload();
          onIsOpenDialogsChanged('activeIntegration', false, true)();
        }
        onIsOpenDialogsChanged('syncConfirm', false, true)();
        showSuccess(t(`${translationPath}lookups-synced-successfully`));
      } else showError(t(`${translationPath}lookups-sync-failed`), response);
    },
    [
      getActivePartnerEnum,
      onIntegrationReload,
      onIsOpenDialogsChanged,
      activePartner,
      t,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the list of providers & connections
   */
  const syncUsersHandler = useCallback(
    async (event) => {
      event.preventDefault();
      if (!activePartner) return;
      setIsLoading(true);
      const response = await getActivePartnerEnum(
        activePartner.partner,
      ).syncUsersAPI();
      setIsLoading(false);
      if (response && response.status === 200) {
        onIsOpenDialogsChanged('syncUsersConfirm', false, true)();
        showSuccess(t(`${translationPath}users-synced-successfully`));
      } else showError(t(`${translationPath}users-sync-failed`), response);
    },
    [getActivePartnerEnum, onIsOpenDialogsChanged, activePartner, t],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the disconnect handler
   */
  const disconnectHandler = useCallback(
    async (event) => {
      event.preventDefault();
      if (!activePartner) return;
      setIsLoading(true);
      const response = await getActivePartnerEnum(
        activePartner.partner,
      ).disconnectAPI({ user_uuid: userReducer?.results?.user?.uuid });
      setIsLoading(false);
      if (response && response.status === 200) {
        onIntegrationReload();
        onIsOpenDialogsChanged('disconnectConfirm', false, true)();
        showSuccess(t(`${translationPath}disconnected-successfully`));
      } else showError(t(`${translationPath}disconnect-failed`), response);
    },
    [
      activePartner,
      getActivePartnerEnum,
      userReducer?.results?.user?.uuid,
      t,
      onIntegrationReload,
      onIsOpenDialogsChanged,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the get for the active settings management dialog
   */
  const getSettingsManagementDialog = useMemo(
    // eslint-disable-next-line react/display-name
    () => (SettingsManagementDialog) => (
      <SettingsManagementDialog
        isOpen={isOpenDialogs.settings}
        onIntegrationReload={onIntegrationReload}
        // onActionClicked={onActionClicked}
        isOpenChanged={onIsOpenDialogsChanged('settings', false, true)}
        getActivePartnerEnum={getActivePartnerEnum}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        activePartner={activePartner}
      />
    ),
    [
      activePartner,
      getActivePartnerEnum,
      isOpenDialogs.settings,
      // onActionClicked,
      onIntegrationReload,
      onIsOpenDialogsChanged,
    ],
  );

  // this is to handle the init for code
  useEffect(() => {
    getAllIntegrationsConnections().catch();
  }, [getAllIntegrationsConnections, filters]);

  // this is to handle the verifying for connection of type auoth 2
  useEffect(() => {
    if (!isInitRef.current) return;
    const code = query.get('code');
    const provider = query.get('state');
    if (
      code
      && provider
      && ((connections.results.length > 0
        && connections.results.some((connection) => !connection.is_connected))
        || getActivePartnerEnum(provider).createConnectAPI
        || getActivePartnerEnum(provider).updateConnectAPI)
    ) {
      isInitRef.current = false;
      onConnectHandler(getActivePartnerEnum(provider).connectAPI, {
        code,
        state: provider,
        user_uuid: userReducer?.results?.user?.uuid,
      }).catch();
    } else if (connections.results.length > 0 || connections.isReturned)
      isInitRef.current = false;
  }, [
    connections.isReturned,
    connections.results,
    getActivePartnerEnum,
    onConnectHandler,
    query,
    userReducer?.results?.user?.uuid,
  ]);

  // this is to handle when the user redirects from login to the integrations
  useEffect(() => {
    if (!isInitForRedirectRef.current) return;
    const partner = query.get('redirect_to');
    if (partner && connections.results.length > 0) {
      isInitForRedirectRef.current = false;
      GlobalHistory.replace(GlobalLocation.pathname);
      const activePartner = connections.results.find(
        (connection) => connection.partner === partner,
      );
      if (activePartner)
        onActionClicked({
          key: SystemActionsEnum.connect.key,
          activePartner,
        })();
    } else if (!partner) isInitForRedirectRef.current = false;
  }, [connections.results, onActionClicked, query]);

  return (
    <div className="integrations-page-wrapper page-wrapper">
      <div className="integrations-header d-flex-v-center-h-between mb-3">
        <div className="d-inline-flex-column px-2">
          <div className="header-text mb-2">
            <span>{t('Shared:integrations')}</span>
          </div>
          <div className="description-text">
            <span>{t(`${translationPath}integrations-description`)}</span>
          </div>
        </div>
        <SharedInputControl
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isLoading}
          stateKey="search"
          placeholder="search"
          wrapperClasses="px-2"
          onInputBlur={(newValue) => {
            onFiltersChanged({ search: newValue.value });
          }}
          executeOnInputBlur
          onKeyDown={(event) => {
            if (event.key === 'Enter')
              onFiltersChanged({ search: event.target.value });
          }}
          startAdornment={
            <div className="start-adornment-wrapper">
              <span className="fas fa-search" />
            </div>
          }
        />
        ,
      </div>
      <div className="integrations-body">
        {connections.results.map((item) => (
          <IntegrationsCard
            is_connected={item.is_connected}
            getActivePartnerEnum={getActivePartnerEnum}
            key={item.partner}
            isDisabled={isLoading}
            onActionClicked={onActionClicked}
            partner={item.partner}
            translationPath={translationPath}
            onConnectClicked={onConnectClicked}
            parentTranslationPath={parentTranslationPath}
            image_url={item.image_url}
            description={item.description}
            title={item.title}
          />
        ))}
        <SMTPCard
          isLoading={isLoading}
          isOpenDialog={isOpenDialogs.smtp}
          onIsOpenDialogsChanged={onIsOpenDialogsChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        <ElevatusSDKCard
          isLoading={isLoading}
          isOpenDialog={isOpenDialogs.elevatusSDK}
          onIsOpenDialogsChanged={onIsOpenDialogsChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        {activePartner && isOpenDialogs.activeIntegration && (
          <ActiveIntegrationsDialog
            isOpen={isOpenDialogs.activeIntegration}
            onIntegrationReload={onIntegrationReload}
            onActionClicked={onActionClicked}
            getRedirectURIHandler={getRedirectURIHandler}
            isOpenChanged={onIsOpenDialogsChanged('activeIntegration', false, true)}
            getActivePartnerEnum={getActivePartnerEnum}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            activePartner={activePartner}
          />
        )}
        {isOpenDialogs.syncConfirm && (
          <DialogComponent
            isConfirm
            isWithoutConfirmClasses
            dialogContent={
              <div className="d-flex-column-center">
                <span className="fas fa-info-circle fa-4x mb-2" />
                <span>{t(`${translationPath}sync-confirm-description`)}</span>
              </div>
            }
            isOpen={isOpenDialogs.syncConfirm}
            onSubmit={syncLookupsHandler}
            isSaving={isLoading}
            saveClasses="btns theme-solid bg-primary"
            onCloseClicked={onIsOpenDialogsChanged('syncConfirm', false, true)}
            onCancelClicked={onIsOpenDialogsChanged('syncConfirm', false, true)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {isOpenDialogs.syncUsersConfirm && (
          <DialogComponent
            isConfirm
            isWithoutConfirmClasses
            dialogContent={
              <div className="d-flex-column-center">
                <span className="fas fa-info-circle fa-4x mb-2" />
                <span>{t(`${translationPath}sync-users-confirm-description`)}</span>
              </div>
            }
            isOpen={isOpenDialogs.syncUsersConfirm}
            onSubmit={syncUsersHandler}
            isSaving={isLoading}
            saveClasses="btns theme-solid bg-primary"
            onCloseClicked={onIsOpenDialogsChanged('syncUsersConfirm', false, true)}
            onCancelClicked={onIsOpenDialogsChanged('syncUsersConfirm', false, true)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {isOpenDialogs.disconnectConfirm && (
          <DialogComponent
            isConfirm
            isWithoutConfirmClasses
            dialogContent={
              <div className="d-flex-column-center">
                <span className="fas fa-info-circle fa-4x mb-2" />
                <span>
                  {t(
                    `${translationPath}${
                      getActivePartnerEnum(activePartner.partner)
                        .disconnectDescription
                    }`,
                  )}
                </span>
              </div>
            }
            isOpen={isOpenDialogs.disconnectConfirm}
            onSubmit={disconnectHandler}
            isSaving={isLoading}
            saveClasses="btns theme-solid bg-primary"
            onCloseClicked={onIsOpenDialogsChanged('disconnectConfirm', false, true)}
            onCancelClicked={onIsOpenDialogsChanged(
              'disconnectConfirm',
              false,
              true,
            )}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        )}
        {isOpenDialogs.settings
          && getActivePartnerEnum(activePartner.partner).settingsManagementDialog
          && getSettingsManagementDialog(
            getActivePartnerEnum(activePartner.partner).settingsManagementDialog,
          )}
      </div>
    </div>
  );
};

export default IntegrationsPage;
