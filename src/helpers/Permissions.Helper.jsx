/* eslint-disable max-len */
/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description This method is to handle permissions
 */
import { getDataFromObject, GetGlobalFullAccess } from './Middleware.Helper';

export const getIsAllowedPermissionV2 = ({
  defaultPermissions, // This is the default list to compare
  // This is the permissions list that usually come from the reducer
  // or the backend must be an array of UUIDs
  permissions,
  // This is the permission id for single action to be checked if exist or not in the permissions
  permissionId,
  allowEmptyRules, // This is to allow the empty "default" permissions to pass
  defaultPermissionsKey = 'key', // The key for the default permissions if the permissions type is enum (Object)
  isFullAccess,
}) => {
  if (GetGlobalFullAccess() || isFullAccess) return true;
  const localPermissionList
    = (typeof defaultPermissions === 'object'
      && Object.values(defaultPermissions).map((item) =>
        getDataFromObject(item, defaultPermissionsKey, true),
      ))
    || defaultPermissions
    || [];
  return (
    (allowEmptyRules && localPermissionList.length === 0 && !permissionId)
    || (permissions
      && permissions.some(
        (permission) =>
          (permissionId && permission === permissionId)
          || (!permissionId
            && localPermissionList
              .filter((item) => item !== null)
              .findIndex((item) => item === permission) !== -1),
      ))
  );
};

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description This method is to handle permissions (old version)
 */
// export const getIsAllowedPermission = (
//   permissionsList = [],
//   response,
//   permissionsId,
//   allowEmptyRules,
// ) => {
//   return true;
//   const localPermissionList = (typeof permissionsList === 'object' && Object.values(permissionsList))
//     || permissionsList;
//   return (
//     (allowEmptyRules && localPermissionList.length === 0)
//     || (
//       (permissionsId
//         && ((Array.isArray(permissionsId)
//           && localPermissionList.filter((item) => permissionsId.includes(item.permissionsId)))
//           || localPermissionList.filter(
//             (item) => item.permissionsId === permissionsId,
//           )))
//       || localPermissionList
//     ).some(
//       (permission) => response
//         && response.permissions
//         && response.permissions
//           .filter((item) => item !== null)
//           .findIndex((item) => item?.permissionsId === permission?.permissionsId)
//           !== -1,
//     )
//   );
// };
