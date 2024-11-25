/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  getIsAllowedSubscription,
  showError,
  GlobalAfterSideMenuComponentState,
} from '../../helpers';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';
import './SideMenu.scss';
import { CollapseComponent } from '../Collapse/Collapse.Component';
import { GetNylasUserDetails } from 'services';
import { updateEmailIntegration } from 'stores/actions/emailIntegrationActions';

export const SideMenu = ({ routes, onSideMenuToggle, isOpenMobileMenu }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const [afterSideMenuComponent, setAfterSideMenuComponent] = useState(null);
  const [isHoverOpen, setIsHoverOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);
  const [selectedSubSubItem, setSelectedSubSubItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );

  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if disabled by isDisabled or Permissions or Subscriptions
   */
  const getIsDisabled = useCallback(
    (item) =>
      item.isDisabled
      || (userReducer?.results?.user?.mfa_enabled
        && !userReducer?.results?.user?.has_authenticator_app)
      || !getIsAllowedPermissionV2({
        defaultPermissions: item.defaultPermissions,
        permissions: item.permissions || permissionsReducer,
        permissionId: item.permissionId,
        allowEmptyRules: true,
      })
      || !getIsAllowedSubscription({
        defaultServices: item.defaultServices,
        serviceKey: item.serviceKey,
        slugId: item.slugId,
        subscriptions: item.subscriptions || subscriptions,
        allowEmptyService: true,
      })
      || (item.emailIntegrationCondition
        && (!emailIntegrationReducer
          || emailIntegrationReducer?.sync_state === 'stopped'
          || emailIntegrationReducer?.sync_state?.includes('invalid')
          || emailIntegrationReducer?.billing_state === 'cancelled'))
      || (item.provider
        && userReducer?.results?.user?.is_provider
        && !accountReducer?.accountsList?.length)
      || (item.provider
        && userReducer?.results?.user?.is_provider
        && !item.member
        && userReducer?.results?.user?.member_type === 'member'),

    [
      emailIntegrationReducer,
      permissionsReducer,
      subscriptions,
      userReducer,
      accountReducer,
    ],
  );

  const subMenuChangeHandler = (item) => {
    setAnchorEl(null);
    setPopperOpen(false);
    if (item.collapse && !isHoverOpen && selectedItem?.name !== item.name) {
      setIsHoverOpen((hover) => !hover);
      onSideMenuToggle(true);
    }
    if (item.collapse) setSelectedRoute(item);
    else {
      setSelectedSubItem(null);
      setSelectedItem(item);
      setIsHoverOpen(false);
      setSelectedRoute(null);
      onSideMenuToggle(false);
    }
  };

  const onPopperOpen = (event, defaultServices, serviceKey, slugId) => {
    if (
      !getIsAllowedSubscription({
        defaultServices,
        serviceKey,
        slugId,
        subscriptions,
        allowEmptyService: true,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
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

    if (nylasUserDetails.status === 200)
      localStorage.setItem(
        'nylasAccountInfo',
        JSON.stringify(nylasUserDetails.data.body),
      );
    else showError(nylasUserDetails.data.message);
  }, [dispatch, userReducer]);

  const EnabledNavLink = ({ item }) => (
    <NavLink
      id={item.tooltip_target}
      disabled={getIsDisabled(item)}
      style={{
        cursor: getIsDisabled(item) ? 'not-allowed' : '',
      }}
      to={item.layout + item.path}
      className={`${selectedItem?.name === item.name ? 'is-selected' : ''}`}
      onClick={(e) => {
        if (item.key === '"mailbox"') saveNewDetailsHandler();

        setAnchorEl(null);
        setPopperOpen(false);
        if (item.key === 'assessment' || item.key === 'job')
          localStorage.setItem('menuItemHistory', item.key);
        if (getIsDisabled(item)) e.preventDefault();
        else subMenuChangeHandler(item);
      }}
    >
      <i className={`${item.icon}`} />
    </NavLink>
  );

  const DisabledNavLink = ({ item }) => {
    if (item.isDisabled)
      return (
        <NavLink
          id={item.tooltip_target}
          to="/"
          className={`${selectedItem?.name === item.name ? 'is-selected' : ''}`}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <i className={`${item.icon}`} />
        </NavLink>
      );

    if (
      !getIsAllowedSubscription({
        defaultServices: item.defaultServices,
        serviceKey: item.serviceKey,
        slugId: item.slugId,
        subscriptions: item.subscriptions || subscriptions,
        allowEmptyService: true,
      })
    )
      return (
        <NavLink
          id={item.tooltip_target}
          to="/recruiter/no-subscriptions"
          className={`${selectedItem?.name === item.name ? 'is-selected' : ''}`}
          onClick={() => {
            localStorage.setItem('menuItemHistory', item.key);
            setSelectedSubItem(null);
            setSelectedItem(item);
            setIsHoverOpen(false);
            setSelectedRoute(null);
            setSelectedSubSubItem(null);
            setActiveSubmenu(null);
            onSideMenuToggle(false);
            setAnchorEl(null);
            setPopperOpen(false);
          }}
        >
          <i className={`${item.icon}`} />
        </NavLink>
      );

    return <EnabledNavLink item={item} />;
  };

  const AfterSubMenuComponentHandler = useMemo(
    () => afterSideMenuComponent,
    [afterSideMenuComponent],
  );

  useEffect(() => {
    if (location && location.pathname) {
      const pathName = location.pathname || '';
      const localSelectedRoute
        = routes.find((item) => pathName === `${item.layout}${item.path}`) || null;

      if (localSelectedRoute) {
        setSelectedItem(localSelectedRoute);
        setSelectedRoute(localSelectedRoute);
      }
    }
  }, [location, routes]);

  useEffect(() => {
    const pathName = window?.location?.pathname;
    if (routes && routes[0] && selectedRoute && selectedRoute.collapse) {
      const routeIndex = routes.findIndex((item) => item.key === selectedRoute?.key);
      if (routeIndex !== -1) {
        setSelectedSubItem(
          routes[routeIndex].views.find(
            (item) =>
              pathName?.includes(`${item.layout}${item.path}`)
              || (item.views
                && item.views.findIndex((el) =>
                  pathName?.includes(`${el.layout}${el.path}`),
                ) !== -1),
          ),
        );
        setIsHoverOpen(true);
        onSideMenuToggle(true);
      }
    } else if (routes && routes[0] && selectedRoute && !selectedRoute.collapse)
      onSideMenuToggle(false);
  }, [onSideMenuToggle, routes, selectedRoute]);

  // select sub item on init
  useEffect(() => {
    const pathName = window?.location?.pathname;
    if (
      selectedRoute
      && selectedSubItem
      && selectedSubItem.views
      && selectedSubItem.views.length > 0
    )
      setSelectedSubSubItem((items) => {
        if (items) return items;
        const localViews = [...selectedSubItem.views];
        return localViews.find(
          (item) =>
            pathName?.includes(`${item.layout}${item.path}`)
            || (item.views
              && item.views.findIndex((el) =>
                pathName?.includes(`${el.layout}${el.path}`),
              ) !== -1),
        );
      });
  }, [selectedRoute, selectedSubItem]);

  useEffect(() => {
    if (selectedSubItem && selectedSubItem.views && selectedSubItem.views.length > 0)
      setActiveSubmenu(
        (items) =>
          (selectedSubItem
            && selectedSubItem.key !== items
            && selectedSubItem.key)
          || items,
      );
  }, [selectedSubItem]);

  useEffect(() => {
    GlobalAfterSideMenuComponentState(setAfterSideMenuComponent);
  }, []);

  return (
    <div
      className={`side-menues-wrapper${
        (isOpenMobileMenu && ' is-open-mobile-menu') || ''
      }`}
      onMouseLeave={() => {
        if (popperOpen) {
          setAnchorEl(null);
          setPopperOpen(false);
        }
      }}
    >
      <div className="side-menu-wrapper">
        <div className="side-menu-inner-content">
          {routes
            .filter(
              (item) =>
                !item.isBottom
                && (!item.visibleFor
                  || item.visibleFor.includes(process.env.REACT_APP_ENV))
                && ((!item.visibleUser && !userReducer?.results?.user?.is_provider)
                  || (userReducer?.results?.user?.is_provider
                    && accountReducer?.accountsList?.length
                    && item.visibleUser?.includes('provider'))
                  || (!userReducer?.results?.user?.is_provider
                    && item.visibleUser?.includes('user'))),
            )
            .map((item, index) => (
              <Tooltip
                placement="right"
                title={`${item.isDisabled ? 'Under Maintenance' : t(item.name)}`}
                key={`${index + 1}-menu-item`}
              >
                <div className="side-menu-inner-item">
                  {item.key === 'job'
                  || item.key === 'assessment'
                  || item.isDisabled ? (
                      <DisabledNavLink item={item} />
                    ) : (
                      <EnabledNavLink item={item} />
                    )}
                </div>
              </Tooltip>
            ))}
        </div>
        <div className="side-menu-inner-content">
          {routes
            .filter(
              (item) =>
                item.isBottom
                && (!item.visibleFor
                  || item.visibleFor.includes(process.env.REACT_APP_ENV))
                && ((!item.visibleUser && !userReducer?.results?.user?.is_provider)
                  || (userReducer?.results?.user?.is_provider
                    && accountReducer?.accountsList?.length
                    && item.visibleUser?.includes('provider'))
                  || (!userReducer?.results?.user?.is_provider
                    && item.visibleUser?.includes('user'))),
            )
            .map((item, index) => (
              <Tooltip
                placement="right"
                title={`${
                  item.isDisabled
                    ? 'Insufficient permissions, please refer to your administrator.'
                    : t(item.name)
                }`}
                key={`${index + 1}-menu-item`}
              >
                <div className="side-menu-inner-item">
                  <EnabledNavLink item={item} />
                </div>
              </Tooltip>
            ))}
        </div>
      </div>
      {selectedRoute?.collapse && (
        <div
          className={`side-menu-hover-wrapper ${
            isHoverOpen && selectedRoute?.collapse ? 'is-hover' : ''
          }`}
        >
          <div className="side-menu-hover-inner">
            {selectedRoute?.collapse && (
              <div
                className={`side-menu-hover-button ${
                  !selectedRoute?.collapse ? 'ml-3-reversed' : ''
                } ${selectedRoute?.collapse ? 'is-collapse' : 'is-disabled'} ${
                  isHoverOpen && selectedRoute?.collapse ? 'is-hover' : ''
                }`}
              >
                <ButtonBase
                  disabled={!selectedRoute?.collapse}
                  onClick={() => {
                    setIsHoverOpen((hover) => !hover);
                    onSideMenuToggle();
                  }}
                >
                  <i
                    className={`fas fa-chevron-${isHoverOpen ? 'left' : 'right'}`}
                  />
                </ButtonBase>
              </div>
            )}
            <div
              className={`side-menu-content-wrapper${
                isHoverOpen && selectedRoute?.collapse ? ' is-hover' : ''
              }`}
            >
              <div className="sub-menu-title">{t(selectedRoute?.name)}</div>
              {selectedRoute
                && selectedRoute?.views
                  ?.filter((vw) => {
                    if (
                      vw.hideForProvider
                      && userReducer?.results?.user?.is_provider
                    )
                      return false; // remove later and depend on permissions only
                    return !(
                      vw.provider
                      && !vw.member
                      && userReducer?.results?.user?.is_provider
                      && userReducer?.results?.user?.member_type === 'member'
                    );
                  })
                  .map((item, index) => (
                    <div
                      className="d-flex-column"
                      key={`${index + 1}-sub-menu-item`}
                    >
                      <ButtonBase
                        onMouseOver={(event) => {
                          onPopperOpen(
                            event,
                            item.defaultServices,
                            item.serviceKey,
                            item.slugId,
                          );
                        }}
                        id={item.tooltip_target}
                        // to={item.layout + item.path}
                        disabled={getIsDisabled(item)}
                        className={`sub-menu-item ${
                          selectedSubItem?.name === item.name ? 'is-active' : ''
                        }`}
                        onClick={(e) => {
                          setAnchorEl(null);
                          setPopperOpen(false);
                          if (getIsDisabled(item)) {
                            e.preventDefault();
                            return;
                          }
                          setSelectedSubItem(item);
                          if (item.views && item.views.length > 0) {
                            setSelectedSubSubItem(item.views[0]);
                            setActiveSubmenu(
                              (items) => (item.key !== items && item.key) || null,
                            );
                          }
                          GlobalHistory.push(item.layout + item.path);
                        }}
                      >
                        <span className="d-flex-v-center-h-between">
                          <span className="px-1">
                            <i className={`${item.icon} pr-2`} />
                            <span className="sub-menu-item-text">
                              {t(item.name)}
                            </span>
                          </span>
                          {item.views && item.views.length > 0 && (
                            <span className="box-icon-small">
                              <span
                                className={`fas fa-chevron-${
                                  (activeSubmenu === item.key && 'up') || 'down'
                                }`}
                              />
                            </span>
                          )}
                        </span>
                      </ButtonBase>
                      {item.views && item.views.length > 0 && (
                        <CollapseComponent
                          isOpen={item.key === activeSubmenu}
                          component={
                            <div className="d-flex-column">
                              {item.views.map((subItem, subIndex) => (
                                <ButtonBase
                                  key={`${index + 1}-sub-menu-item-${subIndex + 1}`}
                                  onMouseOver={(event) => {
                                    onPopperOpen(
                                      event,
                                      subItem.defaultServices,
                                      subItem.serviceKey,
                                      subItem.slugId,
                                    );
                                  }}
                                  disabled={getIsDisabled(subItem)}
                                  id={subItem.tooltip_target}
                                  className={`sub-menu-item ${
                                    selectedSubSubItem?.key === subItem.key
                                      ? 'is-active c-primary'
                                      : ''
                                  }`}
                                  onClick={(e) => {
                                    setAnchorEl(null);
                                    setPopperOpen(false);
                                    if (getIsDisabled(subItem)) {
                                      e.preventDefault();
                                      return;
                                    }
                                    setSelectedSubSubItem(subItem);
                                    GlobalHistory.push(
                                      subItem.layout + subItem.path,
                                    );
                                  }}
                                >
                                  <span className="d-flex-v-center-h-between">
                                    <span className="px-1">
                                      <i className={`${subItem.icon} pr-2`} />
                                      <span className="sub-menu-item-text">
                                        {t(subItem.name)}
                                      </span>
                                    </span>
                                  </span>
                                </ButtonBase>
                              )) || undefined}
                            </div>
                          }
                        />
                      )}
                    </div>
                  ))}
              {AfterSubMenuComponentHandler}
            </div>
          </div>
        </div>
      )}
      <NoPermissionComponent
        anchorEl={anchorEl}
        placement="right-start"
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </div>
  );
};

const routeProps = {
  isDisabled: PropTypes.bool,
  tooltip_target: PropTypes.string,
  key: PropTypes.string,
  icon: PropTypes.string,
  visibleFor: PropTypes.instanceOf(Array),
  isBottom: PropTypes.bool,
  isHidden: PropTypes.bool,
  name: PropTypes.string,
  layout: PropTypes.string,
  path: PropTypes.string,
  permissionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultPermissions: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.number,
    }),
  ]),
  permissions: PropTypes.arrayOf(PropTypes.string),
};
routeProps.views = PropTypes.arrayOf(PropTypes.shape(routeProps));

SideMenu.propTypes = {
  onSideMenuToggle: PropTypes.func.isRequired,
  isOpenMobileMenu: PropTypes.bool.isRequired,
  routes: PropTypes.arrayOf(PropTypes.shape(routeProps)).isRequired,
};
