import { userSubscription } from '../types/userSubscription';

const INITIAL_STATE = localStorage.getItem('UserSubscriptions')
  ? {
    ...JSON.parse(localStorage.getItem('UserSubscriptions')),
  }
  : { subscriptions: null };

export const userSubscriptionsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
  case userSubscription.REQUEST:
    return INITIAL_STATE;

  case userSubscription.SUCCESS:
    return { ...state, ...payload };

  case userSubscription.FAILED:
    return INITIAL_STATE;

  case userSubscription.RESET:
    return { subscriptions: null };

  default:
    return state;
  }
};
