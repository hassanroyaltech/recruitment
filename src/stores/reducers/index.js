// Redux
import { combineReducers } from 'redux';

// Reducers
import evabrandReducer from './evabrandReducer';
import navReducer from './navReducer';
import jobReducer from './jobReducer';
import { userSubscriptionsReducer } from './userSubscriptionReducer';
import { companyIdReducer } from './companyIdReducer';
import { tokenReducer } from './tokenReducer';
import { permissionsReducer } from './permissionsReducer';
import { branchesReducer } from './branchesReducer';
import { userReducer } from './userReducer';
import { accountReducer } from './accountReducer';
import { selectedBranchReducer } from './selectedBranchReducer';
import { emailIntegrationReducer } from './emailIntegrationReducer';
import { candidateUserReducer } from './candidateUserReducer';
import { candidateReducer } from './candidateReducer';
import { offersValidationWithDatabaseReducer } from './offersValidationWithDatabaseReducer';

// noinspection JSValidateJSDoc
/**
 * Constructor to combine reducers
 * @type {Reducer<CombinedState<{
 *   jobReducer: (
 *     {currentJob: null, loading: boolean, currentPipeline: null}
 *   ),
 *   navReducer: (
 *     {navbarTitle: *}|{}
 *   )
 * }>>}
 */
const rootReducer = combineReducers({
  userSubscriptionsReducer,
  userReducer,
  accountReducer,
  offersValidationWithDatabaseReducer,
  companyIdReducer,
  evabrandReducer,
  candidateReducer,
  navReducer,
  jobReducer,
  tokenReducer,
  permissionsReducer,
  branchesReducer,
  selectedBranchReducer,
  emailIntegrationReducer,
  candidateUserReducer,
});
//
// const rootReducer = (state, action) => {
//   if (action.type === '') {
//     state = undefined;
//   }
//
//   return appReducer(state, action);
// };

export default rootReducer;
