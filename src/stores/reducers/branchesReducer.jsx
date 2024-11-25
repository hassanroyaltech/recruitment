import { BranchesTypes } from '../types/branchesTypes';

const INITIAL_STATE = localStorage.getItem('branches')
  ? JSON.parse(localStorage.getItem('branches'))
  : '';

export const branchesReducer = (
  state = { branches: { ...INITIAL_STATE } },
  action,
) => {
  const { type, payload } = action;

  switch (type) {
  case BranchesTypes.SUCCESS:
    return { branches: { ...payload }, reducer_status: BranchesTypes.SUCCESS };

  case BranchesTypes.FAILED:
    return { branches: { ...payload }, reducer_status: BranchesTypes.FAILED };

  case BranchesTypes.RESET:
    return { branches: { ...INITIAL_STATE } };
  case BranchesTypes.DELETE:
    return null;

  default:
    return state;
  }
};
