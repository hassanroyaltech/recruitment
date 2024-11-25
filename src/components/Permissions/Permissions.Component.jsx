import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getDataFromObject, getIsAllowedPermissionV2 } from '../../helpers';

export const PermissionsComponent = memo(
  ({
    reducerInput,
    defaultPermissions,
    permissions,
    permissionId,
    allowEmptyRules,
    children,
  }) => {
    const [allowed, setAllowed] = useState(false);

    const permissionsReducer = useSelector((state) =>
      getDataFromObject(state, reducerInput),
    );

    useEffect(() => {
      setAllowed(
        getIsAllowedPermissionV2({
          defaultPermissions,
          permissions: permissions || permissionsReducer,
          permissionId,
          allowEmptyRules,
        }),
      );
    }, [
      allowEmptyRules,
      permissionId,
      defaultPermissions,
      permissionsReducer,
      permissions,
    ]);
    return (allowed && children) || null;
  },
);

PermissionsComponent.displayName = 'PermissionsComponent';

PermissionsComponent.propTypes = {
  reducerInput: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(Element),
    PropTypes.instanceOf(Object),
  ]),
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
  allowEmptyRules: PropTypes.bool,
};
PermissionsComponent.defaultProps = {
  defaultPermissions: [],
  permissions: undefined,
  permissionId: undefined,
  children: undefined,
  allowEmptyRules: false,
  reducerInput: 'permissionsReducer.permissions',
};
