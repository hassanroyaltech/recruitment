import React, { memo } from 'react';
import { Route } from 'react-router-dom'; // Redirect
import PropTypes from 'prop-types';

export const PrivateRouteComponent = memo(
  ({ component: Component, login, addRoute, exact, ...rest }) => (
    <Route
      {...rest}
      render={(props) => <Component {...props} exact={exact} addRoute={addRoute} />}
    />
  ),
);

PrivateRouteComponent.displayName = 'PrivateRouteComponent';

PrivateRouteComponent.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  login: PropTypes.string,
  exact: PropTypes.bool,
  addRoute: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
PrivateRouteComponent.defaultProps = {
  component: undefined,
  login: '/el/login',
  addRoute: undefined,
  exact: undefined,
};
