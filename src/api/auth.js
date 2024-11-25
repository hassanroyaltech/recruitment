/** auth.js
 * A service containing all APIs that are used in authentication
 *
 * @example
 * import { authAPI } from 'api/auth';
 *
 * @example
 * // To login
 * authAPI.login(email, password);
 *
 * @example
 * // To logout
 * authAPI.logout();
 *
 * @example
 * // To Register
 * authAPI.register(firstName, lastName, email, companyName);
 *
 * @example
 * // To validate token
 * authAPI.validateToken(key);
 *
 * @example
 * // To set subdomain password
 * authAPI.setAccountDomPass(subDomain, password, passwordConfirmation);
 *
 * @example
 * // To set account subsuer
 * authAPI.setAccountSubUser(password, passwordConfirmation, subUser);
 */

// Logger

// Headers
import { generateHeaders } from 'api/headers';

// URLs
import urls from 'api/urls';

// Axios
import axios from 'api/middleware';
import { generateHeadersWithoutAuth } from './headers';

const currentLanguage = localStorage.getItem('platform_language');

/**
 * Create an async login function
 *
 * @param {string} email
 * @param {string} password
 * @param {string} redirect_to
 */
async function login(email, password, redirect_to) {
  return axios.post(
    urls.auth.login,
    {
      email,
      password,
      redirect_to,
    },
    {
      headers: generateHeadersWithoutAuth(),
    },
  );
}

/**
 * For logging the company user out.
 * @returns {Promise<any>}
 */
async function logout() {
  return axios.post(urls.auth.logout, null, {
    headers: generateHeaders(),
  });
}

/**
 * Register a company user
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} email
 * @param {string} companyName
 * @returns {Promise<any>}
 */
async function register(firstName, lastName, email, companyName, redirectTo) {
  return axios.post(
    urls.auth.register,
    {
      first_name: firstName,
      last_name: lastName,
      email,
      company_name: companyName,
      plan_id: '1',
      redirect_to: redirectTo,
    },
    {
      headers: generateHeadersWithoutAuth(),
    },
  );
}

/**
 * Token validation request
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function validateToken(key) {
  return axios.post(
    urls.auth.tokenValidation,
    {
      key,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Set the password for the account subdomain
 * @param {string} subDomain
 * @param {string} password
 * @param {string} passwordConfirmation
 * @returns {Promise<any>}
 */
export async function setAccountDomPass(subDomain, password, passwordConfirmation) {
  return axios.post(
    urls.auth.access,
    {
      sub_domain: subDomain,
      password,
      password_confirmation: passwordConfirmation,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Create an account subuser
 * @param {string} password
 * @param {string} passwordConfirmation
 * @param {uuid} subUser
 * @returns {Promise<any>}
 */
export async function setAccountSubUser(password, passwordConfirmation, subUser) {
  return axios.post(
    urls.auth.access,
    {
      password,
      password_confirmation: passwordConfirmation,
      sub_user: subUser,
    },
    {
      headers: generateHeaders(),
    },
  );
}

/**
 * Reset a password
 * @param values
 * @returns {Promise<void>}
 */
export async function resetPassword(email) {
  return axios.post(
    urls.auth.resetPassword.resetPassword,
    {
      email,
    },
    {
      header: generateHeadersWithoutAuth(),
    },
  );
}
/**
 * Refresh Token Function, before the token expired invoke this API
 * to refresh user token
 * @param token
 * @returns {Promise<void>}
 */
async function refreshToken(token) {
  return axios.get(urls.auth.REFRESH_TOKEN, {
    params: {
      token,
    },
    headers: generateHeaders(),
  });
}

/**
 * Re-setPassword Link Verification
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function verifyLink(key) {
  return axios.post(`${urls.auth.resetPassword.verify_link}/${key}`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': currentLanguage,
      Accept: 'application/json',
    },
  });
}

/**
 * Export the authAPI service
 * @type {{
 *   logout: (function(): Promise<*>),
 *   setAccountSubUser: (function(string, string, uuid): Promise<*>),
 *   login: (function(string, string): Promise<any>),
 *   register: (function(string, string, string, string): Promise<*>),
 *   validateToken: (function(string): Promise<*>),
 *   setAccountDomPass: (function(string, string, string): Promise<*>)
 * }}
 */
export const authAPI = {
  login,
  logout,
  register,
  validateToken,
  setAccountDomPass,
  setAccountSubUser,
  resetPassword,
  refreshToken,
  verifyLink,
};
