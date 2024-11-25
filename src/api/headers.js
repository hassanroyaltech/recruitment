/**
 * ----------------------------------------------------------------------------------
 * @title headers.js
 * ----------------------------------------------------------------------------------
 * This module contains a single function that generates headers. The explanation is
 * available inside the JSDoc of the function below.
 * ---------------------------------------------------------------------------------
 */

import { GetGlobalAccountUuid, GetGlobalCompanyId } from '../helpers';
/**
 * This function generates headers to be used in the API requests
 * The main idea is that this is where we control the platform language
 * By default it will be set as 'en' as stored in the localStorage
 * However, upon clicking the button to switch the language, all we need to do is
 * to pass the 'ar' language code, and all content from the API will be returned
 * in Arabic.
 * @returns {{
 *   Authorization: string,
 *   Accept: string,
 *   "Accept-Company": string,
 *   "Accept-Language": string,
 *   "Content-Type": string
 * }}
 */
// const headers = process.env.REACT_APP_HEADERS;
export const generateHeaders = (payload = undefined) => {
  // Obtain relevant data from storage
  const companyId = GetGlobalCompanyId();
  const userToken
    = (localStorage.getItem('token')
      && JSON.parse(localStorage.getItem('token')).token)
    || '';

  const currentLanguage = localStorage.getItem('platform_language') || 'en';

  const accountUuid = localStorage.getItem('account_uuid') || '';
  const account_uuid = GetGlobalAccountUuid();

  // Collect headers' dictionary
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Company':
      payload?.company_uuid || companyId || localStorage.getItem('company_id'),
    'Accept-Language': currentLanguage,
    Authorization: `Bearer ${userToken}`,
    'Accept-Account': account_uuid || accountUuid,
    // 'Access-Control-Allow-Origin': headers
  };
};
export const generateHeadersWithoutAuth = () => {
  // Obtain relevant data from storage
  const platformLanguage = localStorage.getItem('platform_language') || 'en';

  // Collect headers dictionary
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': platformLanguage,
    // 'Access-Control-Allow-Origin': headers
  };

  return headers;
};
