/**
 * A function to handle Responsibility.
 * Returns a boolean
 * @param {role}
 * @returns {boolean|*}
 * @constructor
 */
export const Responsibility = (role) => {
  /**
   * Obtain responsibility from storage
   * @type {any}
   */
  const responsibility = JSON.parse(localStorage.getItem('responsibility'));
  if (!responsibility) return true; // If responsibility cache not found; Unlock.

  return responsibility === role;
};
