import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { GetAllDashboards } from '../../../services';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import { useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import {
  DiagramIcon,
  PenOutlinedIcon,
  TrashIcon,
  StarOutlineIcon,
} from '../../../assets/icons';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from '@mui/material';
import { LoaderComponent, PopoverComponent } from '../../../components';
import i18next from 'i18next';
import { NewAnalyticsPermissions } from '../../../permissions';

export const AnalyticsSideMenu = ({
  parentTranslationPath,
  setShowCreateEditDashboardDialog,
  setReloadDashboard,
  setCurrentView,
  pinnedDashboardsFilters,
  setPinnedDashboardsFilters,
  allDashboardsFilters,
  setAllDashboardsFilters,
  PinAndUnpinDashboardHandler,
  DeleteCustomDashboardHandler,
  selectedGlobalDashboard,
  setSelectedGlobalDashboard,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [allDashboards, setAllDashboards] = useState({
    results: [],
    totalCount: 0,
    lastPage: 1,
  });
  const [pinnedDashboards, setPinnedDashboards] = useState({
    results: [],
    totalCount: 0,
    lastPage: 1,
  });
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [isLoading, setIsLoading] = useState(false);

  const GetAllDashboardsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllDashboards({
      ...allDashboardsFilters,
      company_uuid: selectedBranchReducer?.uuid,
      use_for: 'list',
      is_pinned: false,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setAllDashboards({
        results: response.data.results || [],
        totalCount: response.data.paginate.total,
        lastPage: response.data.paginate.lastPage,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [allDashboardsFilters, t, selectedBranchReducer]);

  const GetPinnedDashboardsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllDashboards({
      ...pinnedDashboardsFilters,
      company_uuid: selectedBranchReducer?.uuid,
      use_for: 'list',
      is_pinned: true,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setPinnedDashboards({
        results: response.data.results || [],
        totalCount: response.data.paginate.total,
        lastPage: response.data.paginate.lastPage,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [pinnedDashboardsFilters, t, selectedBranchReducer]);

  const OpenDashboardHandler = useCallback(
    (clickedDashboard) => {
      const localDashboard = clickedDashboard || selectedGlobalDashboard;
      const openedDashboards
        = (localStorage.getItem('opened-analytics-dashboards')
          && JSON.parse(localStorage.getItem('opened-analytics-dashboards')))
        || [];
      // TODO: Diana : when open replace saved item with the new one to update it in case it was opened before making changes on it like pin or other
      if (!openedDashboards.map((it) => it.uuid).includes(localDashboard.uuid))
        localStorage.setItem(
          'opened-analytics-dashboards',
          JSON.stringify([...openedDashboards, localDashboard]),
        );

      setCurrentView((items) => ({
        ...items,
        view: 'dashboard',
        currentDashboard: {
          uuid: localDashboard.uuid,
        },
      }));
      setReloadDashboard((items) => ({ ...items }));
    },
    [selectedGlobalDashboard, setCurrentView, setReloadDashboard],
  );

  useEffect(() => {
    GetPinnedDashboardsHandler();
  }, [GetPinnedDashboardsHandler, pinnedDashboardsFilters]);

  useEffect(() => {
    GetAllDashboardsHandler();
  }, [GetAllDashboardsHandler, allDashboardsFilters]);

  return (
    <div className="my-4 mx-2">
      <div className="py-3 px-4">
        {pinnedDashboards.totalCount > 0 && (
          <Accordion defaultExpanded elevation={0}>
            <AccordionSummary aria-controls="accordion" id="pinned-dashboards">
              <div className="d-flex-v-center">
                <div>
                  <span className="fas fa-caret-down" />
                </div>
                <div className="mx-2">{t('pinned')}</div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <>
                {isLoading && (
                  <LoaderComponent
                    isLoading={isLoading}
                    isSkeleton
                    skeletonItems={[
                      {
                        variant: 'rectangular',
                        style: { minHeight: 10, marginTop: 5, marginBottom: 5 },
                      },
                    ]}
                    numberOfRepeat={5}
                  />
                )}
                <div
                  className="d-flex-column"
                  style={{
                    ...(isLoading && { display: 'none' }),
                  }}
                >
                  {pinnedDashboards.results.map((item, idx) => (
                    <ButtonBase
                      className="btns theme-transparent my-1"
                      key={`dashboard-side-menu-item${item.uuid}-${idx}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setPopoverAttachedWith(e.target);
                        setSelectedGlobalDashboard(item);
                      }}
                      onClick={() => OpenDashboardHandler(item)}
                    >
                      <div>
                        <DiagramIcon />
                      </div>
                      <div
                        className={`mx-2 text-truncate width-100-align-text ${
                          i18next.language === 'ar' ? 'rtl' : ''
                        }`}
                      >
                        {item.title}
                      </div>
                    </ButtonBase>
                  ))}
                </div>
              </>
            </AccordionDetails>
          </Accordion>
        )}
        {pinnedDashboards.totalCount > allDashboardsFilters.limit && (
          <div className="pinned-dashboards d-flex-v-center-h-between mt-2">
            <ButtonBase
              className="btns-icon theme-transparent mx-2"
              disabled={pinnedDashboardsFilters.page === 1}
              onClick={() => {
                setPinnedDashboardsFilters((items) => ({
                  ...items,
                  page: items.page - 1,
                }));
              }}
            >
              <span className="fas fa-chevron-left light-text-color" />
            </ButtonBase>
            <ButtonBase
              className="btns-icon theme-transparent mx-2"
              disabled={pinnedDashboardsFilters.page === pinnedDashboards.lastPage}
              onClick={() => {
                setPinnedDashboardsFilters((items) => ({
                  ...items,
                  page: items.page + 1,
                }));
              }}
            >
              <span className="fas fa-chevron-right light-text-color" />
            </ButtonBase>
          </div>
        )}
        <Accordion defaultExpanded elevation={0}>
          <AccordionSummary aria-controls="accordion" id="all-dashboards">
            <div className="d-flex-v-center">
              <div>
                <span className="fas fa-caret-down" />
              </div>
              <div className="mx-2">{t('all')}</div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <>
              {isLoading && (
                <LoaderComponent
                  isLoading={isLoading}
                  isSkeleton
                  skeletonItems={[
                    {
                      variant: 'rectangular',
                      style: { minHeight: 10, marginTop: 5, marginBottom: 5 },
                    },
                  ]}
                  numberOfRepeat={5}
                />
              )}
              {allDashboards.totalCount > 0 && (
                <div
                  className="d-flex-column"
                  style={{
                    ...(isLoading && { display: 'none' }),
                  }}
                >
                  {allDashboards.results.map((item, idx) => (
                    <ButtonBase
                      className="btns theme-transparent my-1"
                      key={`dashboard-side-menu-item${item.uuid}-${idx}`}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setPopoverAttachedWith(e.target);
                        setSelectedGlobalDashboard(item);
                      }}
                      onClick={() => OpenDashboardHandler(item)}
                    >
                      <div>
                        <DiagramIcon />
                      </div>
                      <div
                        className={`mx-2 text-truncate width-100-align-text ${
                          i18next.language === 'ar' ? 'rtl' : ''
                        }`}
                      >
                        {item.title}
                      </div>
                    </ButtonBase>
                  ))}
                </div>
              )}
            </>
          </AccordionDetails>
        </Accordion>
        {allDashboards.totalCount > allDashboardsFilters.limit && (
          <div className="all-dashboards d-flex-v-center-h-between mt-2">
            <ButtonBase
              className="btns-icon theme-transparent mx-2"
              disabled={allDashboardsFilters.page === 1}
              onClick={() => {
                setAllDashboardsFilters((items) => ({
                  ...items,
                  page: items.page - 1,
                }));
              }}
            >
              <span className="fas fa-chevron-left light-text-color" />
            </ButtonBase>
            <ButtonBase
              className="btns-icon theme-transparent mx-2"
              disabled={allDashboardsFilters.page === allDashboards.lastPage}
              onClick={() => {
                setAllDashboardsFilters((items) => ({
                  ...items,
                  page: items.page + 1,
                }));
              }}
            >
              <span className="fas fa-chevron-right light-text-color" />
            </ButtonBase>
          </div>
        )}
      </div>
      <PopoverComponent
        idRef="widget-ref"
        attachedWith={popoverAttachedWith}
        handleClose={() => {
          setPopoverAttachedWith(null);
          setSelectedGlobalDashboard(null);
        }}
        popoverClasses="columns-popover-wrapper"
        component={
          <div className="d-flex-column p-2 w-100">
            {[
              {
                key: 1,
                label: 'open-dashboard',
                onClick: () => {
                  OpenDashboardHandler();
                },
                // icon: <PenOutlinedIcon />,
              },
              {
                key: 2,
                label: 'edit-dashboard',
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
            ].map((action, idx) => (
              <ButtonBase
                key={`${idx}-${action.key}-popover-action`}
                className="btns theme-transparent theme-transparent m-2"
                onClick={() => {
                  action.onClick();
                  setPopoverAttachedWith(null);
                  if (action.label !== 'edit-dashboard')
                    setSelectedGlobalDashboard(null);
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
            {/* TODO: Diana : Disable when dashboard is already open (show message as tooltip to close before delete) */}
            {[
              {
                key: 4,
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
                  setPopoverAttachedWith(null);
                  setSelectedGlobalDashboard(null);
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
          </div>
        }
      />
    </div>
  );
};

AnalyticsSideMenu.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setShowCreateEditDashboardDialog: PropTypes.func.isRequired,
  setReloadDashboard: PropTypes.func,
  setCurrentView: PropTypes.func,
  pinnedDashboardsFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
  }),
  setPinnedDashboardsFilters: PropTypes.func,
  allDashboardsFilters: PropTypes.shape({
    limit: PropTypes.number,
    page: PropTypes.number,
  }),
  setAllDashboardsFilters: PropTypes.func,
  PinAndUnpinDashboardHandler: PropTypes.func,
  DeleteCustomDashboardHandler: PropTypes.func,
  selectedGlobalDashboard: PropTypes.shape({
    uuid: PropTypes.string,
    is_pinned: PropTypes.bool,
  }),
  setSelectedGlobalDashboard: PropTypes.func,
};
