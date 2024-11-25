import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Analytics.Style.scss';
import DashboardView from './Views/Dashboard.View';
import { WidgetSetupView } from './Views/WidgetSetup.View';
import { AnalyticsSideMenu } from './Components/AnalyticsSideMenu.Component';
import { DeleteCustomDashboard, PinAndUnpinDashboard } from '../../services';
import { showError, showSuccess } from '../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import useVitally from '../../hooks/useVitally.Hook';

const parentTranslationPath = 'Analytics';

const AnalyticsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [showCreateEditDashboardDialog, setShowCreateEditDashboardDialog]
    = useState(false);
  const defaultCurrentViewRef = useRef({
    view: 'dashboard',
    currentDashboard: {
      // opened dashboard
      uuid: 1, // for default/metrics
      widget_edit_data: undefined,
    },
  });
  const [currentView, setCurrentView] = useState(defaultCurrentViewRef.current);
  const [reloadDashboard, setReloadDashboard] = useState({});
  const [pinnedDashboardsFilters, setPinnedDashboardsFilters] = useState({
    limit: 10,
    page: 1,
  });
  const [allDashboardsFilters, setAllDashboardsFilters] = useState({
    limit: 10,
    page: 1,
  });
  const [selectedGlobalDashboard, setSelectedGlobalDashboard] = useState(null); // dashboard clicked only but not opened
  const [displaySideMenu, setDisplaySideMenu] = useState(false);
  const { VitallyTrack } = useVitally();

  const PinAndUnpinDashboardHandler = useCallback(
    async ({ uuid, is_pinned }) => {
      const response = await PinAndUnpinDashboard({
        uuid,
        is_pinned,
      });
      if (response && response.status === 200) {
        showSuccess(
          t(`dashboard-${is_pinned ? 'pinned' : 'unpinned'}-successfully`),
        );
        setAllDashboardsFilters((items) => ({ ...items }));
        setPinnedDashboardsFilters((items) => ({ ...items }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  const CloseDashboardTabHandler = useCallback((uuid) => {
    const openedDashboards
      = (localStorage.getItem('opened-analytics-dashboards')
        && JSON.parse(localStorage.getItem('opened-analytics-dashboards')))
      || [];
    localStorage.setItem(
      'opened-analytics-dashboards',
      JSON.stringify(openedDashboards.filter((dsh) => dsh.uuid !== uuid)),
    );
    setReloadDashboard((items) => ({ ...items }));
    setCurrentView(defaultCurrentViewRef.current);
  }, []);

  const DeleteCustomDashboardHandler = useCallback(
    async ({ uuid }) => {
      const response = await DeleteCustomDashboard({
        uuid,
      });
      if (response && response.status === 200) {
        showSuccess(t('dashboard-deleted-successfully'));
        setAllDashboardsFilters((items) => ({ ...items }));
        setPinnedDashboardsFilters((items) => ({ ...items }));
        CloseDashboardTabHandler(uuid);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [
      CloseDashboardTabHandler,
      setAllDashboardsFilters,
      setPinnedDashboardsFilters,
      t,
    ],
  );
  useEffect(() => {
    VitallyTrack('Analytics - Open Analytics');
    window?.ChurnZero?.push([
      'trackEvent',
      `Analytics - Open Analytics`,
      `Open Analytics`,
      1,
      {},
    ]);
  }, []);
  return (
    <div className="analytics-container">
      {currentView.view === 'dashboard' && (
        <div className="analytics-dashboard-wrapper">
          <div className="">
            <div className="mt-4 toggle-analytics-side-menu-wrapper w-100">
              <div className="d-flex-center w-100">
                <ButtonBase
                  className="btns theme-transparent my-1"
                  onClick={() => {
                    setDisplaySideMenu((item) => !item);
                  }}
                >
                  <span className="fas fa-chevron-down mx-2" />
                </ButtonBase>
              </div>
            </div>
            <div
              className="analytics-side-menu-wrapper w-100"
              style={{
                ...(displaySideMenu && { display: 'block' }),
              }}
            >
              <AnalyticsSideMenu
                parentTranslationPath={parentTranslationPath}
                setShowCreateEditDashboardDialog={setShowCreateEditDashboardDialog}
                setReloadDashboard={setReloadDashboard}
                setCurrentView={setCurrentView}
                pinnedDashboardsFilters={pinnedDashboardsFilters}
                setPinnedDashboardsFilters={setPinnedDashboardsFilters}
                allDashboardsFilters={allDashboardsFilters}
                setAllDashboardsFilters={setAllDashboardsFilters}
                PinAndUnpinDashboardHandler={PinAndUnpinDashboardHandler}
                DeleteCustomDashboardHandler={DeleteCustomDashboardHandler}
                selectedGlobalDashboard={selectedGlobalDashboard}
                setSelectedGlobalDashboard={setSelectedGlobalDashboard}
              />
            </div>
          </div>
          <div className="dashboard-right-side-container">
            <div className="breadcrumbs px-4 m-4">
              <span className="fz-12px light-text-color">{t('analytics')}</span>
              <span className="fas fa-chevron-right mx-2" />
              <span className="fz-12px dark-text-color">
                {currentView.view === 'widget-setup'
                  ? t('widget-setup')
                  : t('metrics')}
              </span>
            </div>
            <DashboardView
              setCurrentView={setCurrentView}
              parentTranslationPath={parentTranslationPath}
              currentView={currentView}
              showCreateEditDashboardDialog={showCreateEditDashboardDialog}
              setShowCreateEditDashboardDialog={setShowCreateEditDashboardDialog}
              reloadDashboard={reloadDashboard}
              PinAndUnpinDashboardHandler={PinAndUnpinDashboardHandler}
              setPinnedDashboardsFilters={setPinnedDashboardsFilters}
              setAllDashboardsFilters={setAllDashboardsFilters}
              DeleteCustomDashboardHandler={DeleteCustomDashboardHandler}
              CloseDashboardTabHandler={CloseDashboardTabHandler}
              selectedGlobalDashboard={selectedGlobalDashboard}
              setSelectedGlobalDashboard={setSelectedGlobalDashboard}
            />
          </div>
        </div>
      )}
      {currentView.view === 'widget-setup' && (
        <WidgetSetupView
          parentTranslationPath={parentTranslationPath}
          setCurrentView={setCurrentView}
          currentView={currentView}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;
