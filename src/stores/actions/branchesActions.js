import { BranchesTypes } from '../types/branchesTypes';
/**
 * update branch handler
 * @param payload
 * @returns {function(*): void}
 */
export function updateBranches(payload) {
  if (!payload) return null;
  localStorage.setItem('branches', JSON.stringify(payload));
  return (dispatch) => {
    dispatch({
      type: BranchesTypes.SUCCESS,
      payload,
    });
  };
}
