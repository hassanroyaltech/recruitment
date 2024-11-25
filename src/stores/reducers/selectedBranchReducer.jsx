import { SelectedBranchTypes } from '../types/SelectedBranchTypes';

const INITIAL_STATE = localStorage.getItem('selectedBranch')
  ? JSON.parse(localStorage.getItem('selectedBranch'))
  : '';

export const selectedBranchReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case SelectedBranchTypes.DELETE:
    return '';

  case SelectedBranchTypes.SUCCESS:
    return { ...payload, reducer_status: SelectedBranchTypes.SUCCESS };

  case SelectedBranchTypes.FAILED:
    return { ...payload, reducer_status: SelectedBranchTypes.FAILED };

  case SelectedBranchTypes.RESET:
    return INITIAL_STATE;

  default:
    return state;
  }
};
