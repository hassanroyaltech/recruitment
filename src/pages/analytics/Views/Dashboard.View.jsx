import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// import { StaticDashboard } from '../Components/StaticDashboard.Component';
import { CustomDashboard } from '../Components/CustomDashboard.Component';
import { PopoverComponent, TabsComponent } from '../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import {
  CloseIcon,
  DuplicateIcon,
  FolderIcon,
  PenOutlinedIcon,
  PlusIcon,
  StarOutlineIcon,
  TrashIcon,
} from '../../../assets/icons';
import {
  CreateCustomDashboard,
  DuplicateCustomDashboard,
  UpdateCustomDashboard,
} from '../../../services';
import { getIsAllowedPermissionV2, showError, showSuccess } from '../../../helpers';
import { Divider } from '@mui/material';
import { AnalyticsDashboardIconEnum } from '../../../enums';
import { DashboardManagementDialog } from '../Dialogs/dashboard-management/DashboardManagement.Dialog';
import PropTypes from 'prop-types';
import { NewAnalyticsPermissions } from '../../../permissions';
import { useSelector } from 'react-redux';
import { GenerateComprehensiveReport } from '../../../api/evarec';

const DashboardView = ({
  setCurrentView,
  parentTranslationPath,
  currentView,
  showCreateEditDashboardDialog,
  setShowCreateEditDashboardDialog,
  reloadDashboard,
  PinAndUnpinDashboardHandler,
  setAllDashboardsFilters,
  setPinnedDashboardsFilters,
  DeleteCustomDashboardHandler,
  CloseDashboardTabHandler,
  selectedGlobalDashboard,
  setSelectedGlobalDashboard,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [filters, setFilters] = useState({
    category: 'candidate',
    job_uuid: null,
    pipeline_uuid: null,
    slug: null,
    from_date: null,
    to_date: null,
    date_filter_type: 'default',
  });
  const [dashboardResponse, setDashboardResponse] = useState();
  const defaultDialogData = useRef({
    title: 'Untitled',
    icon: AnalyticsDashboardIconEnum.DEFAULT.value,
  });
  const [dashboardDialogData, setDashboardDialogData] = useState(
    defaultDialogData.current,
  );
  const [showTabMenuPopover, setShowTabMenuPopover] = useState(null);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    dashboard: null,
    comprehensiveReport: null,
  });
  const [isExploreDialogOpen, setIsExploreDialogOpen] = useState(false);

  const createAndEditNewDashboardHandler = useCallback(
    async ({ invitedMembers }) => {
      if (!dashboardDialogData.icon || !dashboardDialogData.title) {
        showError(t('please-fill-all-data'));
        return;
      }
      const openedDashboards
        = (localStorage.getItem('opened-analytics-dashboards')
          && JSON.parse(localStorage.getItem('opened-analytics-dashboards')))
        || [];
      setIsLoading(true);
      const response = await (selectedGlobalDashboard?.uuid
        ? UpdateCustomDashboard
        : CreateCustomDashboard)({
        ...dashboardDialogData,
        icon: dashboardDialogData.icon,
        ...invitedMembers,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        if (!selectedGlobalDashboard?.uuid)
          window?.ChurnZero?.push([
            'trackEvent',
            `Analytics - New Dashboard`,
            `New Dashboard`,
            1,
            {},
          ]);
        showSuccess(t('dashboard-created-successfully'));
        if (selectedGlobalDashboard?.uuid) {
          const editedDashboards = [...openedDashboards].map((item) => {
            if (item.uuid === selectedGlobalDashboard.uuid)
              return {
                ...item,
                title: response.data.results?.title,
                uuid: response.data.results?.uuid,
                can_edit: true,
              };
            else return item;
          });
          localStorage.setItem(
            'opened-analytics-dashboards',
            JSON.stringify(editedDashboards),
          );
          setDashboards(editedDashboards);
        } else {
          localStorage.setItem(
            'opened-analytics-dashboards',
            JSON.stringify([
              ...openedDashboards,
              { ...response.data.results, can_edit: true },
            ]),
          );
          setDashboards((items) => [
            ...items,
            {
              title: response.data.results?.title,
              uuid: response.data.results?.uuid,
              can_edit: true,
            },
          ]);
        }

        setCurrentView((items) => ({
          ...items,
          currentDashboard: {
            ...items.currentDashboard,
            uuid: response.data.results?.uuid,
            title: response.data.results?.title,
            can_edit: true,
          },
        }));
        setShowCreateEditDashboardDialog(false);
        setAllDashboardsFilters((items) => ({ ...items }));
        setPinnedDashboardsFilters((items) => ({ ...items }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);

      setSelectedGlobalDashboard(null);
      setDashboardDialogData(defaultDialogData.current);
      setIsLoading(false);
    },
    [
      dashboardDialogData,
      selectedGlobalDashboard,
      t,
      setCurrentView,
      setShowCreateEditDashboardDialog,
      setSelectedGlobalDashboard,
      setAllDashboardsFilters,
      setPinnedDashboardsFilters,
    ],
  );

  const DuplicateDashboardHandler = useCallback(
    async ({ uuid }) => {
      const response = await DuplicateCustomDashboard({
        uuid,
      });
      const openedDashboards
        = (localStorage.getItem('opened-analytics-dashboards')
          && JSON.parse(localStorage.getItem('opened-analytics-dashboards')))
        || [];
      if (response && response.status === 200) {
        showSuccess(t(`dashboard-duplicated-successfully`));
        localStorage.setItem(
          'opened-analytics-dashboards',
          JSON.stringify([
            ...openedDashboards,
            { ...response.data.result, can_edit: true },
          ]),
        );
        setDashboards((items) => [
          ...items,
          {
            title: response.data.result?.title,
            uuid: response.data.result?.uuid,
            can_edit: true,
          },
        ]);
        setAllDashboardsFilters((items) => ({ ...items }));
        setPinnedDashboardsFilters((items) => ({ ...items }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [setAllDashboardsFilters, setPinnedDashboardsFilters, t],
  );

  const dashboardTabsList = useMemo(
    () => [
      {
        // title: 'metrics',
        title: 'new-dashboard',
      },
      ...dashboards.map((it) => ({
        ...it,
        onContextMenu: (e) => {
          e.preventDefault();
          setShowTabMenuPopover(e.target);
          setSelectedGlobalDashboard(it);
        },
      })),
      // {
      //   title: 'new',
      //   inlineIcon: <PlusIcon />,
      //   onClick: () => {
      //     createAndEditNewDashboardHandler();
      //   },
      //   disabled: !getIsAllowedPermissionV2({
      //     permissionId: NewAnalyticsPermissions.AddDashboard.key,
      //     permissions: permissionsReducer,
      //   }),
      // },
    ],
    [dashboards, setSelectedGlobalDashboard],
  );

  const getCurrentDashboard = useMemo(
    () =>
      dashboardTabsList.findIndex(
        (item) => item.uuid === currentView.currentDashboard.uuid,
      ),
    [currentView, dashboardTabsList],
  );

  const generateComprehensiveReportHandler = useCallback(
    async ({ slug }) => {
      setIsLoading(true);
      const response = await GenerateComprehensiveReport({
        ...filters,
        category: 'comprehensive_report',
        slug,
        feature: 'comprehensive_report',
      });
      setIsLoading(false);
      if (response && response.status === 200)
        showSuccess(
          response?.data?.message
            || t('comprehensive-report-generated-successfully'),
        );
      else showError(t('comprehensive-report-generate-failed'), response);
    },
    [filters, t],
  );

  useEffect(() => {
    const localOpenedDashboards
      = localStorage.getItem('opened-analytics-dashboards')
      && JSON.parse(localStorage.getItem('opened-analytics-dashboards'));
    const hasPermissionForAllDashs = getIsAllowedPermissionV2({
      permissionId: NewAnalyticsPermissions.ViewDashboards.key,
      permissions: permissionsReducer,
    });
    if (localOpenedDashboards && !hasPermissionForAllDashs) {
      const userLocal = JSON.parse(localStorage.getItem('user'))?.results?.user;
      const filtered = localOpenedDashboards.filter((dash) => {
        if (!dash.user_uuid || !userLocal.uuid) return false;
        return dash.user_uuid === userLocal.uuid;
      });
      setDashboards(filtered);
    } else if (localOpenedDashboards && hasPermissionForAllDashs)
      setDashboards(localOpenedDashboards);
  }, [reloadDashboard, permissionsReducer]);

  // Check can_edit changes for locale storage dashboards
  // const checkOpenedDashboards = useCallback(async ({ openedDashboards })=>{
  //   const response= await apiToCheck( { uuids: openedDashboards.map(item=>item.uuid) })
  //   if(response && response.status ===200){
  //     const { results } = response.data
  //     setDashboards(results);
  //     localStorage.setItem(
  //       'opened-analytics-dashboards',
  //       JSON.stringify(results),
  //     );
  //   }
  //   else {
  //     setDashboards([]);
  //     localStorage.setItem(
  //       'opened-analytics-dashboards',
  //       JSON.stringify([]),
  //     );
  //   }
  // },[])
  // useEffect(() => {
  //   const openedDashboards
  //       = (localStorage.getItem('opened-analytics-dashboards')
  //           && JSON.parse(localStorage.getItem('opened-analytics-dashboards')))
  //       || [];
  //   if(!openedDashboards?.length) return
  //   checkOpenedDashboards(openedDashboards)
  // }, [checkOpenedDashboards]);

  return (
    <>
      <div className="m-4 analytics-tabs-wrapper">
        <div className="d-flex">
          <TabsComponent
            data={dashboardTabsList || []}
            currentTab={getCurrentDashboard === -1 ? 0 : getCurrentDashboard}
            labelInput="title"
            idRef="OffersTabsRef"
            isPrimary
            onTabChanged={(event, currentTab) => {
              // same as initial value of current view
              if (currentTab === 0)
                setCurrentView({
                  view: 'dashboard',
                  currentDashboard: {
                    uuid: 1,
                    widget_edit_data: undefined,
                  },
                });
              else
                setCurrentView((items) => ({
                  ...items,
                  currentDashboard: {
                    ...items.currentDashboard,
                    ...dashboards[currentTab - 1],
                  },
                }));
            }}
            isDisabled={isLoading}
            parentTranslationPath={parentTranslationPath}
            scrollButtons="auto"
            componentInput={null}
          />
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns"
              onClick={() => setShowCreateEditDashboardDialog(true)}
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: NewAnalyticsPermissions.AddDashboard.key,
                  permissions: permissionsReducer,
                })
              }
            >
              <PlusIcon />
              <span className="mx-2">{t('dashboard')}</span>
            </ButtonBase>
            {getCurrentDashboard !== -1 && (
              <>
                <ButtonBase
                  className="btns"
                  onClick={(e) =>
                    setPopoverAttachedWith((items) => ({
                      ...items,
                      dashboard: e.currentTarget,
                    }))
                  }
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                      permissions: permissionsReducer,
                    }) || !dashboardResponse?.can_edit
                  }
                >
                  <PlusIcon />
                  <span>{t('widget')}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns"
                  onClick={(e) =>
                    setPopoverAttachedWith((items) => ({
                      ...items,
                      comprehensiveReport: e.currentTarget,
                    }))
                  }
                  disabled={
                    // !getIsAllowedPermissionV2({
                    //   permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                    //   permissions: permissionsReducer,
                    // })
                    // ||
                    !dashboardResponse?.can_edit
                  }
                >
                  <PlusIcon />
                  <span>{t('comprehensive-report')}</span>
                </ButtonBase>
              </>
            )}
          </div>
        </div>
        <Divider />
      </div>
      {getCurrentDashboard === -1 && (
        // <StaticDashboard parentTranslationPath={parentTranslationPath} />
        <div className="d-flex-column-center mx-4" style={{ minHeight: '50vh' }}>
          <div className="pb-1 dark-text-color fw-bold fz-20px">
            {t('add-dashboard-title')}
          </div>
          <div className="light-text-color fz-14px">{t('add-dashboard-desc')}</div>
          <div>
            <div className="my-3 d-flex">
              <ButtonBase
                className="mx-2 px-3 py-1 btns btn-outline-light theme-outline"
                onClick={() => setShowCreateEditDashboardDialog(true)}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissionId: NewAnalyticsPermissions.AddDashboard.key,
                    permissions: permissionsReducer,
                  })
                }
              >
                <PlusIcon />
                <span className="mx-2 py-2">{t('dashboard')}</span>
              </ButtonBase>
            </div>
          </div>
        </div>
      )}
      {getCurrentDashboard !== -1 && currentView.currentDashboard?.uuid && (
        <CustomDashboard
          parentTranslationPath={parentTranslationPath}
          uuid={currentView.currentDashboard.uuid}
          filters={filters}
          setFilters={setFilters}
          setCurrentView={setCurrentView}
          currentView={currentView}
          isExploreDialogOpen={isExploreDialogOpen}
          setIsExploreDialogOpen={setIsExploreDialogOpen}
          dashboardResponse={dashboardResponse}
          setDashboardResponse={setDashboardResponse}
        />
      )}
      {showCreateEditDashboardDialog && (
        <DashboardManagementDialog
          isOpen={showCreateEditDashboardDialog}
          setIsOpen={() => {
            setShowCreateEditDashboardDialog(false);
            setSelectedGlobalDashboard(null);
            setDashboardDialogData(defaultDialogData.current);
          }}
          parentTranslationPath={parentTranslationPath}
          isLoading={isLoading}
          onSave={(val) => {
            createAndEditNewDashboardHandler({
              invitedMembers: val.invitedMembers,
            });
          }}
          data={dashboardDialogData}
          setData={setDashboardDialogData}
          uuid={selectedGlobalDashboard?.uuid}
        />
      )}
      {showTabMenuPopover && (
        <PopoverComponent
          idRef="widget-ref"
          attachedWith={showTabMenuPopover}
          handleClose={() => setShowTabMenuPopover(null)}
          popoverClasses="columns-popover-wrapper"
          component={
            <div className="d-flex-column p-2 w-100">
              {[
                {
                  key: 1,
                  label: 'edit',
                  onClick: () => {
                    setShowCreateEditDashboardDialog(true);
                  },
                  icon: <PenOutlinedIcon />,
                  disabled:
                    !getIsAllowedPermissionV2({
                      permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                      permissions: permissionsReducer,
                    }) || !selectedGlobalDashboard?.can_edit,
                },
                {
                  key: 2,
                  label: 'duplicate',
                  onClick: () =>
                    DuplicateDashboardHandler({
                      uuid: selectedGlobalDashboard.uuid,
                    }),
                  icon: <DuplicateIcon />,
                  disabled: !getIsAllowedPermissionV2({
                    permissionId: NewAnalyticsPermissions.AddDashboard.key,
                    permissions: permissionsReducer,
                  }),
                },
                {
                  key: 3,
                  label: selectedGlobalDashboard?.is_pinned
                    ? 'unpin-from-navbar'
                    : 'pin-to-navbar',
                  onClick: () => {
                    PinAndUnpinDashboardHandler({
                      uuid: selectedGlobalDashboard.uuid,
                      is_pinned: !selectedGlobalDashboard.is_pinned,
                    });
                  },
                  icon: <StarOutlineIcon />,
                  disabled: !getIsAllowedPermissionV2({
                    permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                    permissions: permissionsReducer,
                  }),
                },
                {
                  key: 4,
                  label: 'close',
                  onClick: () =>
                    CloseDashboardTabHandler(selectedGlobalDashboard.uuid),
                  icon: <CloseIcon />,
                },
                {
                  key: 5,
                  label: 'delete',
                  onClick: () =>
                    DeleteCustomDashboardHandler({
                      uuid: selectedGlobalDashboard.uuid,
                    }),
                  icon: <TrashIcon />,
                  disabled:
                    !getIsAllowedPermissionV2({
                      permissionId: NewAnalyticsPermissions.DeleteDashboard.key,
                      permissions: permissionsReducer,
                    }) || !selectedGlobalDashboard?.can_edit,
                },
              ].map((action, idx) => (
                <ButtonBase
                  key={`${idx}-${action.key}-popover-action`}
                  className="btns theme-transparent m-2"
                  onClick={() => {
                    action.onClick();
                    setShowTabMenuPopover(null);
                    if (action.label !== 'edit') setSelectedGlobalDashboard(null);
                  }}
                  style={{
                    justifyContent: 'start',
                  }}
                  disabled={action.disabled}
                >
                  <span>{action.icon}</span>
                  <span className="px-2">{t(action.label)}</span>
                </ButtonBase>
              ))}
              <Divider />
            </div>
          }
        />
      )}
      {popoverAttachedWith.dashboard && (
        <PopoverComponent
          idRef="dashboardActionsPopoverRef"
          attachedWith={popoverAttachedWith.dashboard}
          handleClose={() =>
            setPopoverAttachedWith((items) => ({ ...items, dashboard: null }))
          }
          popoverClasses="blocks-actions-popover-wrapper"
          component={
            <div className="d-inline-flex-column m-2">
              <ButtonBase
                className="btns popover-btn-analytics"
                onClick={() => {
                  setCurrentView((items) => ({
                    ...items,
                    view: 'widget-setup',
                  }));
                  setPopoverAttachedWith((items) => ({ ...items, dashboard: null }));
                }}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                    permissions: permissionsReducer,
                  })
                }
              >
                <PlusIcon />
                <span className="mx-2 py-2">{t('create-new-widget')}</span>
              </ButtonBase>
              <ButtonBase
                className="btns popover-btn-analytics"
                onClick={() => {
                  setIsExploreDialogOpen(true);
                  setPopoverAttachedWith((items) => ({ ...items, dashboard: null }));
                }}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                    permissions: permissionsReducer,
                  })
                }
              >
                <FolderIcon />
                <span className="mx-2 py-2">{t('explore-library')}</span>
              </ButtonBase>
            </div>
          }
        />
      )}
      {popoverAttachedWith.comprehensiveReport && (
        <PopoverComponent
          idRef="comprehensiveReportPopoverRef"
          attachedWith={popoverAttachedWith.comprehensiveReport}
          handleClose={() =>
            setPopoverAttachedWith((items) => ({
              ...items,
              comprehensiveReport: null,
            }))
          }
          popoverClasses="blocks-actions-popover-wrapper"
          component={
            <div className="d-inline-flex-column m-2">
              <ButtonBase
                className="btns popover-btn-analytics"
                onClick={() => {
                  void generateComprehensiveReportHandler({
                    slug: 'job_level_report',
                  });
                  setPopoverAttachedWith((items) => ({
                    ...items,
                    comprehensiveReport: null,
                  }));
                }}
              >
                <span className="mx-2 py-2">{t('for-job-level')}</span>
              </ButtonBase>
              <ButtonBase
                className="btns popover-btn-analytics"
                onClick={() => {
                  void generateComprehensiveReportHandler({
                    slug: 'candidate_level_report',
                  });
                  setPopoverAttachedWith((items) => ({
                    ...items,
                    comprehensiveReport: null,
                  }));
                }}
              >
                <span className="mx-2 py-2">{t('for-candidate-level')}</span>
              </ButtonBase>
            </div>
          }
        />
      )}
    </>
  );
};

export default DashboardView;

DashboardView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  currentView: PropTypes.shape({
    view: PropTypes.oneOf(['dashboard', 'widget-setup']).isRequired,
    currentDashboard: PropTypes.shape({
      uuid: PropTypes.string,
      can_edit: PropTypes.bool,
      widget_edit_data: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        chart_type: PropTypes.string,
        feature: PropTypes.string,
        payload: PropTypes.shape({
          summarize: PropTypes.array,
          projection: PropTypes.array,
          page: PropTypes.number,
          limit: PropTypes.number,
        }),
      }),
    }),
  }).isRequired,
  showCreateEditDashboardDialog: PropTypes.bool,
  setShowCreateEditDashboardDialog: PropTypes.func,
  reloadDashboard: PropTypes.shape({}),
  PinAndUnpinDashboardHandler: PropTypes.func,
  setAllDashboardsFilters: PropTypes.func,
  setPinnedDashboardsFilters: PropTypes.func,
  DeleteCustomDashboardHandler: PropTypes.func,
  CloseDashboardTabHandler: PropTypes.func,
  selectedGlobalDashboard: PropTypes.shape({
    uuid: PropTypes.string,
    is_pinned: PropTypes.bool,
    can_edit: PropTypes.bool,
  }),
  setSelectedGlobalDashboard: PropTypes.func,
};
