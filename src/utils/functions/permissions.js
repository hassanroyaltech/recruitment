/**
 * A function to handle permissions.
 * Returns a boolean on whether a certain ability is given to the role.
 *
 * @example
 * // Permissions
 * import { Can } from 'utils/functions/permissions';
 * disabled={!Can("create", "sub-user")}
 *
 * @param ability
 * @param role
 * @returns {boolean|*}
 * @constructor
 */
export const Can = (ability, role) => {
  /**
   * Obtain permissions from storage
   * @type {any}
   */
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  if (!permissions) return true; // If Permissions cache not found; Unlock.

  /**
   * Filter permissions by role
   */
  const permission = permissions.filter((p) => p.role_name === role)[0];

  /**
   * If there are no permissions, allow
   */
  if (
    permission === null
    || permission === undefined
    || permission.permissions[ability] === undefined
    || permission.permissions[ability] === null
  )
    return true;

  return permission.permissions[ability];
};
