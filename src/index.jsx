/* <-- REACT --> */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
/* <-- ARGON TEMPLATE IMPORTS --> */

// bootstrap rtl for rtl support page
import 'assets/vendor/bootstrap-rtl/bootstrap-rtl.scss';

// plugins styles from node_modules
import 'react-perfect-scrollbar/dist/css/styles.css';

// plugins styles downloaded
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';

// import 'assets/vendor/bootstrap-datepicker/dist/js/bootstrap-datepicker.js';
// core styles
import 'assets/scss/argon-dashboard-pro-react.scss';
import 'bootstrap/scss/bootstrap.scss';
import 'assets/styles/theme/utilities/Fonts.Style.scss';
import 'assets/styles/Master.Style.scss';

/* <-- ELEVATUS app entrypoint --> */
import { Provider } from 'react-redux';

// eslint-disable-next-line import/extensions
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ToastProvider } from 'react-toast-notifications';
import Router from './routers/Router';
import store from './stores/store';
import { registerServiceWorker } from './serviceWorker';
import 'moment/locale/ar';
import reportWebVitals from './reportWebVitals';
import { Backdrop, CircularProgress } from '@mui/material';
import './assets/scripts/TextEditor.Scripts';
import VitallyIntegration from './helpers/Vitally.Helper';
import { BrowserRouter } from 'react-router-dom';

const { version } = require('../package.json');

if (process.env.REACT_APP_ENV !== 'staging')
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `elevatus-recruiter@${version}`,
    environment: process.env.REACT_APP_ENV,
    integrations: [new Integrations.BrowserTracing()],
    ignoreErrors: [
      'TypeError: Failed to fetch',
      'TypeError: NetworkError when attempting to fetch resource.',
      'TypeError: NetworkError',
      'TypeError: Network Error',
      'TypeError: Cancelled',
    ],
    beforeSend(event) {
      // Check if it is an exception, and if so, show the report dialog
      if (event.exception) Sentry.showReportDialog({ eventId: event.event_id });

      return event;
    },

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

// This section will enable the 'debug' library and in tandem the Log class
// throughout the app. It will only activate if debugging is enabled.
// The library requires a localStorage item to be set.
if (process.env.REACT_APP_DEBUG === 'true')
  localStorage.setItem('debug', 'elevatus-app:*');

registerServiceWorker();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Sentry.ErrorBoundary
    fallback="An error has occurred"
    beforeCapture={(scope) => {
      scope.setTag('type', 'general-error');
    }}
  >
    <ToastProvider placement="top-center">
      <I18nextProvider i18n={i18next}>
        <Provider store={store()}>
          <Suspense
            fallback={
              <Backdrop className="spinner-wrapper" open>
                <CircularProgress color="inherit" size={50} />
              </Backdrop>
            }
          >
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </Suspense>
        </Provider>
      </I18nextProvider>
    </ToastProvider>
    <ToastContainer />
    <VitallyIntegration />
  </Sentry.ErrorBoundary>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
