export const EmailIntegrationStatusesEnum = {
  Valid: {
    key: 'valid',
    isValid: true,
  },
  Downloading: {
    key: 'downloading',
    isValid: true,
  },
  Running: {
    key: 'running',
    isValid: true,
  },
  Partial: {
    key: 'partial',
    isValid: true,
  },
  Initializing: {
    key: 'initializing',
    isValid: true,
  },
  Invalid: {
    key: 'invalid',
    isValid: false,
  },
  InvalidCredentials: {
    key: 'invalid-credentials',
    isValid: false,
  },
  Exception: {
    key: 'exception',
    isValid: false,
  },
  SyncError: {
    key: 'sync-error',
    isValid: false,
  },
  Stopped: {
    key: 'stopped',
    isValid: false,
  },
};
