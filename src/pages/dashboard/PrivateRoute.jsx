/* eslint-disable react/jsx-props-no-spreading */
// React
import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../helpers';
import { GetNylasUserDetails } from 'services';
import { updateEmailIntegration } from 'stores/actions/emailIntegrationActions';

// Routes

// Logout
// Storage service

/**
 * Component to render private routes (post-login)
 * @param Component
 * @param hasPermission
 * @param defaultPermissions
 * @param permissionId
 * @param permissions
 * @param rest
 * @param subscriptions
 * @param slugId
 * @param serviceKey
 * @param defaultServices
 * @param permissionCondition
 * @param externalUserType
 * @returns {JSX.Element}
 * @constructor
 */
const PrivateRoute = ({
  component: Component,
  hasPermission,
  defaultPermissions,
  permissionId,
  permissions,
  subscriptions,
  slugId,
  serviceKey,
  defaultServices,
  permissionCondition,
  externalUserType,
  ...rest
}) => {
  const dispatch = useDispatch();
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const subscriptionsReducer = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const emailIntegrationReducer = useSelector(
    (state) => state?.emailIntegrationReducer,
  );
  const userReducer = useSelector((state) => state?.userReducer);

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

  useEffect(() => {
    if (permissionCondition) saveNewDetailsHandler();
  }, [permissionCondition, saveNewDetailsHandler, rest.path]);

  return (
    /**
     * Return JSX
     */
    <Route
      {...rest}
      render={(routerProp) => {
        if (
          !getIsAllowedSubscription({
            defaultServices,
            serviceKey,
            slugId,
            subscriptions: subscriptions || subscriptionsReducer,
            allowEmptyService: true,
          })
        )
          return (
            <Redirect
              to={{
                pathname: '/recruiter/no-subscriptions',
                state: { from: routerProp.location },
              }}
            />
          );
        if (
          (!hasPermission && hasPermission !== undefined)
          || !getIsAllowedPermissionV2({
            defaultPermissions,
            permissionId,
            permissions: permissions || permissionsReducer,
            allowEmptyRules: true,
          })
          || (permissionCondition
            && (!emailIntegrationReducer
              || emailIntegrationReducer?.sync_state === 'stopped'
              || emailIntegrationReducer?.sync_state?.includes('invalid')
              || emailIntegrationReducer?.billing_state === 'cancelled'))
          || (externalUserType
            && !externalUserType?.includes(userReducer?.results?.user?.member_type))
        ) {
          if (
            externalUserType
            && !externalUserType.includes(userReducer?.results?.user?.member_type)
          )
            return (
              <Redirect
                to={{
                  pathname: '/provider/profile',
                  state: { from: routerProp.location },
                }}
              />
            );
          if (permissionCondition)
            return (
              <Redirect
                to={{
                  pathname: '/recruiter/mailbox/settings',
                  state: { from: routerProp.location },
                }}
              />
            );
          // Not Logged in, Redirect to Overview!
          return (
            <Redirect
              to={{
                pathname: '/recruiter/401',
                state: { from: routerProp.location },
              }}
            />
          );
        }
        if (!routerProp || !routerProp.match || routerProp.match.path === '**')
          return <Redirect to="/recruiter/overview" />;
        // authorised so the return component
        return <Component {...routerProp} />;
      }}
    />
  );
};
export default PrivateRoute;
PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  hasPermission: PropTypes.bool,
  location: PropTypes.instanceOf(Object),
  defaultPermissions: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.number,
    }),
  ]),
  permissions: PropTypes.arrayOf(PropTypes.string),
  permissionId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  subscriptions: PropTypes.arrayOf(PropTypes.string),
  slugId: PropTypes.number,
  serviceKey: PropTypes.string,
  defaultServices: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.number,
    }),
  ]),
  permissionCondition: PropTypes.bool,
  externalUserType: PropTypes.arrayOf(PropTypes.string),
};
PrivateRoute.defaultProps = {
  component: undefined,
  location: undefined,
  hasPermission: undefined,
  defaultPermissions: undefined,
  permissions: undefined,
  permissionId: undefined,
  subscriptions: undefined,
  slugId: undefined,
  serviceKey: undefined,
  defaultServices: undefined,
  permissionCondition: undefined,
  externalUserType: undefined,
};
