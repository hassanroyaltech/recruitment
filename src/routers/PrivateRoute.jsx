/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
// Loader Component
import Loader from 'components/Elevatus/Loader';
// Reactstrap Components
import { CardBody, Row, Col } from 'reactstrap';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { GetGlobalRerender, getIsAllowedPermissionV2 } from '../helpers';
import { useQuery } from '../hooks';

export const PrivateRoute = ({
  component: Component,
  hasPermission,
  hasSpecialCase,
  defaultPermissions,
  permissionId,
  permissions,
  ...rest
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);
  const query = useQuery();
  const history = useHistory();
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (localStorage.getItem('user') === null && user) {
      if (user.statusCode === 200)
        // Save to localStorage (because this is better and safer)
        localStorage.setItem('user', JSON.stringify(user));

      // Permissions are better stored in the localStorage
      localStorage.setItem(
        'permissions',
        JSON.stringify(user.results.user.permissions),
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    i18next.on('languageChanged', (lng) => {
      setCurrentLanguage((item) => (item !== lng ? lng : item));
    });
  }, []);

  return (
    <>
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <Route
          {...rest}
          render={(props) =>
            (hasSpecialCase
              && hasSpecialCase({ permissions, query, specialHistory: history }))
            || hasPermission
            || getIsAllowedPermissionV2({
              defaultPermissions,
              permissionId,
              permissions: permissions || permissionsReducer,
              allowEmptyRules: true,
            }) ? (
                <Component
                  {...props}
                  key={`${currentLanguage}${GetGlobalRerender()}`}
                />
              ) : (
                <Redirect
                  to={{
                    pathname:
                    (!(
                      hasPermission
                      || getIsAllowedPermissionV2({
                        defaultPermissions,
                        permissionId,
                        permissions: permissions || permissionsReducer,
                        allowEmptyRules: true,
                      })
                    )
                      && '/recruiter/401')
                    || '/el/login',
                    state: { from: props.location },
                  }}
                />
              )
          }
        />
      )}
    </>
  );
};
PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  hasPermission: PropTypes.bool,
  hasSpecialCase: PropTypes.func,
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
};
PrivateRoute.defaultProps = {
  hasPermission: undefined,
  defaultPermissions: undefined,
  permissions: undefined,
  permissionId: undefined,
};
