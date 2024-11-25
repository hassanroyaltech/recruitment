import React, { useCallback, useState } from 'react';
import { useTitle } from '../../../hooks';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import {
  GenerateSSOKey,
  GetAllVisaSponsors,
  GetVisaSponsorById,
} from '../../../services';
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import { BlockManagementDialog, ReportsManagementDialog } from './dialogs';
import { StatisticsSection } from './sections';
import './Dashboard.Style.scss';
import { TabsComponent } from '../../../components';
import { DashboardTabs } from './tabs-data';
import { VisasPermissions, ManageVisasPermissions } from '../../../permissions';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import { useSelector } from 'react-redux';
import { NavigationSourcesEnum } from '../../../enums';
import { UploadVisaButton } from './Components/UploadVisaButton';

const parentTranslationPath = 'VisaPage';
const translationPath = 'DashboardPage.';

const DashboardPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t('visa-dashboard'));
  const [isReloadStatistics, setIsReloadStatistics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    block: false,
    allocate: false,
    reserve: false,
    blockDelete: false,
    reports: false,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardTabsData] = useState(() => DashboardTabs);
  const [filter, setFilter] = useState({
    company: null,
    is_expired: undefined,
    occupation: undefined,
    nationality: undefined,
    gender: undefined,
    religion: undefined,
    issue_place: undefined,
    status: undefined,
    search: undefined,
  });
  const [activeItem, setActiveItem] = useState(null);

  /**
   * @param actionKey - string same as the attribute name
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle open or close the dialogs in the page
   */
  const dialogsStatusHandler = useCallback(
    (actionKey, selectedItem = undefined) =>
      () => {
        setActiveItem(selectedItem);
        setIsOpenDialogs((items) => ({ ...items, [actionKey]: !items[actionKey] }));
      },
    [],
  );

  const selfServiceHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GenerateSSOKey();
    setIsLoading(false);
    if (response && response.status === 201) {
      const { results } = response.data;
      const account_uuid = localStorage.getItem('account_uuid');
      const user
        = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
      window.open(
        `${process.env.REACT_APP_SELFSERVICE_URL}/accounts/login?token_key=${
          results.key
        }&account_uuid=${account_uuid}${
          user?.results?.user?.uuid ? `&user_uuid=${user?.results?.user?.uuid}` : ''
        }&source=${NavigationSourcesEnum.FromVisaDashboardToSelfService.key}`,
        '_blank',
      );
    } else if (!response || response.message)
      showError(
        response?.message
          || t(`${translationPath}signup-requirements-update-failed`),
      );
  }, [t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to force reload the statistics on blocks change or delete visas
   */
  const onReloadStatistics = useCallback(() => {
    setIsReloadStatistics((items) => !items);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the dialogs in the page & reload the blocks in the page
   */
  const onDialogsSaveHandler = useCallback(() => {
    setActiveItem(null);
    setFilter((items) => ({ ...items }));
    onReloadStatistics();
  }, [onReloadStatistics]);

  /**
   * @param newValue - this is an object of the new value for the keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update filter from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  return (
    <div className="dashboard-page-wrapper page-wrapper">
      <div className="dashboard-header-wrapper d-flex-v-center-h-between px-2 flex-wrap py-3">
        <span className="d-inline-flex flex-wrap px-2">
          <span className="header-text my-2">
            {t(`${translationPath}visa-repository`)}
          </span>
          <SharedAPIAutocompleteControl
            searchKey="search"
            stateKey="sponsor"
            placeholder="all-sponsors"
            idRef="sponsorsAutocompleteRef"
            getDataAPI={GetAllVisaSponsors}
            getItemByIdAPI={GetVisaSponsorById}
            editValue={filter.sponsor}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            onValueChanged={({ value }) => {
              setFilter((items) => ({ ...items, sponsor: value }));
            }}
            autocompleteThemeClass="theme-transparent"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              status: true,
              ...(filter.sponsor && {
                with_than: filter.sponsor,
              }),
            }}
          />
        </span>
        <span>
          <UploadVisaButton
            onSave={onDialogsSaveHandler}
            permissions={permissions}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
          />
          <ButtonBase
            className="btns theme-transparent mx-2 mb-3"
            onClick={dialogsStatusHandler('reports')}
          >
            <span className="fas fa-paperclip" />
            <span className="px-1">{t(`${translationPath}reports`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent mx-2 mb-3"
            onClick={dialogsStatusHandler('block')}
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: VisasPermissions.AddVisa.key,
                permissions,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-block`)}</span>
          </ButtonBase>
          {/*<ButtonBase*/}
          {/*  className="btns theme-transparent mx-2 mb-3"*/}
          {/*  onClick={dialogsStatusHandler('allocate')}*/}
          {/*>*/}
          {/*  <span className="far fa-check-square" />*/}
          {/*  <span className="px-1">{t(`${translationPath}allocate`)}</span>*/}
          {/*</ButtonBase>*/}
          <ButtonBase
            className="btns theme-solid mx-2  mb-3"
            onClick={selfServiceHandler}
            disabled={
              isLoading
              || !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  RequestVisaReservation:
                    ManageVisasPermissions.RequestVisaReservation,
                  ViewAllReservationRequests:
                    ManageVisasPermissions.ViewAllReservationRequests,
                  ViewAllAllocationRequests:
                    ManageVisasPermissions.ViewAllAllocationRequests,
                },
              })
            }
          >
            <span className="far fa-check-square" />
            <span className="px-1">{t(`${translationPath}reserve`)}</span>
          </ButtonBase>
        </span>
      </div>
      <StatisticsSection
        sponsor={filter.sponsor}
        is_expired={filter.is_expired}
        isReloadStatistics={isReloadStatistics}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <TabsComponent
        isPrimary
        isWithLine
        labelInput="label"
        idRef="dashboardTabsRef"
        currentTab={activeTab}
        data={dashboardTabsData}
        onTabChanged={(event, currentTab) => {
          const localItem = dashboardTabsData[currentTab];
          setFilter((items) => ({
            ...items,
            is_expired: localItem.is_expired,
          }));
          setActiveTab(currentTab);
        }}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        dynamicComponentProps={{
          filter,
          isOpenDialogs,
          activeItem,
          onReloadStatistics,
          dialogsStatusHandler,
          onFilterChanged,
          parentTranslationPath,
          translationPath,
        }}
      />
      {isOpenDialogs.block && (
        <BlockManagementDialog
          isOpen={isOpenDialogs.block}
          blockUUID={(activeItem && activeItem.uuid) || undefined}
          onSave={onDialogsSaveHandler}
          isOpenChanged={dialogsStatusHandler('block')}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenDialogs.reports && (
        <ReportsManagementDialog
          isOpen={isOpenDialogs.reports}
          blockUUID={(activeItem && activeItem.uuid) || undefined}
          onSave={onDialogsSaveHandler}
          isOpenChanged={dialogsStatusHandler('reports')}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default DashboardPage;
