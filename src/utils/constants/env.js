// This is the environment variable to enable or disable development features
export const DEBUG = process.env.REACT_APP_DEBUG === 'true';
// This is environment variable to enable some features in staging.
export const STAGING = process.env.REACT_APP_ENV === 'staging';
