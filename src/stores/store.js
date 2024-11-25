// Redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

// Reducers
import rootReducer from './reducers';

// Enable Devtools Extension
const composeEnhancers
  = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// Enable logger
const loggerMiddleware = createLogger();

/**
 * Create Redux store using the rootReducer and an empty initial state
 * @param initialState
 * @returns {Store<unknown, unknown>}
 */
export default function store(initialState = {}) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunkMiddleware, loggerMiddleware)),
  );
}
