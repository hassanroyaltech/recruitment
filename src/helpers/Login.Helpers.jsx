import { storageService } from '../utils/functions/storage';
import { showError } from './Toasters.Helper';
import { updateUser } from '../stores/actions/userActions';
import { AccountTypes } from '../stores/types/accountTypes';
import { updateAccount } from '../stores/actions/accountActions';
import { updatePermissions } from '../stores/actions/permissionsActions';
import { companyIdTypes } from '../stores/types/companyIdTypes';
import {
  GetFormSourceItem,
  GlobalHistory,
  SetGlobalCompanyId,
  SetGlobalFullAccess,
} from './Middleware.Helper';
import { tokenTypes } from '../stores/types/tokenTypes';
import { updateToken } from '../stores/actions/tokenActions';
import { updateBranches } from '../stores/actions/branchesActions';
import { updateSelectedBranch } from '../stores/actions/selectedBranchActions';
import { GetNylasUserDetails } from '../services';
import { updateEmailIntegration } from '../stores/actions/emailIntegrationActions';
import { LoginRedirectToEnum, NavigationSourcesEnum } from '../enums';
import { VitallyVerifyUser } from './VitallyVerifyUser.Helper';
/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to handle the return for the redirect to enum (if there is one)
 */
export const getLoginRedirectEnum = (key) =>
  Object.values(LoginRedirectToEnum).find((item) => item.key === key);

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to handle the login logic for both SSO & Normal login
 */
export const AfterLoginHandler = async ({
  response,
  // isRedirect,
  branch_uuid,
  translationPath,
  t,
  setState,
  state,
  dispatch,
  query,
  setBackDropLoader,
  afterSuccessfullyLogin,
  verifyUserDeviceRes,
}) => {
  const {
    data: { results },
  } = response;
  storageService.clearLocalStorage();
  // Save the company ID to local storage
  const firstAccessibleCompany
    = (results.companies
      && results.companies.find((company) => {
        if (branch_uuid) return company.can_access && company.uuid === branch_uuid;
        else return company.can_access;
      }))
    || null;
  const firstAccessibleAccount
    = (results.list && results.list.find((account) => account?.access?.length))
    || null;
  if (firstAccessibleAccount)
    localStorage.setItem('account_uuid', firstAccessibleAccount?.account?.uuid);
  else if (results.account_uuid)
    localStorage.setItem('account_uuid', results.account_uuid);

  if (!results.is_provider && !firstAccessibleCompany) {
    showError(t(`${translationPath}cant-access-description`));
    setState((items) => ({
      ...items,
      submitted: false,
    }));
    return;
  }

  // Set the default language to English
  localStorage.setItem('platform_language', 'en');

  const localUser = {
    results: {
      user: {
        ...results,
        uuid: results.uuid,
        first_name: results.first_name,
        second_name: results.second_name,
        third_name: results.third_name,
        last_name: results.last_name,
        is_provider: results.is_provider,
        member_type: results.member_type,
        type: results.type,
        source_uuid: results.source_uuid,
        ...(verifyUserDeviceRes && {
          has_authenticator_app:
            verifyUserDeviceRes?.data?.results?.has_authenticator_app,
        }),
        ...(verifyUserDeviceRes && {
          mfa_enabled: verifyUserDeviceRes?.data?.results?.mfa_enabled,
        }),
      },
      language: results.language,
      account_uuid: results.account_uuid,
    },
  };
  localStorage.setItem('user', JSON.stringify(localUser));
  VitallyVerifyUser(results);
  dispatch(updateUser(localUser));
  if (results.account_uuid || results.is_provider) {
    window?.ChurnZero?.push(['setAppKey', process.env.REACT_APP_CHURNZERO_KEY]);
    if (results.account_uuid) {
      localStorage.setItem('account_uuid', results.account_uuid);
      window?.ChurnZero?.push(['setContact', results.account_uuid, results.uuid]);
    }
    if (results.is_provider)
      window?.ChurnZero?.push([
        'setContact',
        firstAccessibleAccount?.account?.uuid,
        results.uuid,
      ]);
    // ChurnZero Setup
    localStorage.setItem('storedTime', String(Date.now()));
    window?.ChurnZero?.push(['trackEvent', 'Login', 'Successful login', 1, {}]);
    window?.ChurnZero?.push([
      'setAttribute',
      'contact',
      {
        'First Name': results.first_name?.en,
        'Last Name': results.last_name?.en,
        Email: results.email,
        'Is Employee': results.is_employee,
      },
    ]);
  }

  if (results.companies && results.companies.length > 0) {
    const careerSiteUrl = results.companies[0].full_domain || '';
    localStorage.setItem('careerPortalUrl', careerSiteUrl);
  }

  if (state.isRememberMe) localStorage.setItem('isRememberMe', state.isRememberMe);

  const firstAccessibleBranch
    = (firstAccessibleAccount?.access
      && firstAccessibleAccount.access.find((item) => item?.branch?.can_access))
    || null;

  if (results.is_provider) {
    dispatch({
      type: AccountTypes.SUCCESS,
      payload:
        (firstAccessibleAccount && firstAccessibleAccount?.account?.uuid) || null,
    });
    dispatch(
      updateAccount({
        account_uuid: firstAccessibleAccount?.account?.uuid,
        accountsList: results.list,
      }),
    );
    if (firstAccessibleAccount && firstAccessibleBranch?.branch) {
      dispatch(
        updatePermissions({
          permissions: firstAccessibleBranch?.branch?.permission || [],
          full_access: firstAccessibleBranch?.branch?.full_access,
        }),
      );
      dispatch({
        type: companyIdTypes.SUCCESS,
        payload:
          (firstAccessibleBranch && firstAccessibleBranch?.branch?.uuid) || null,
      });
      SetGlobalCompanyId(firstAccessibleBranch?.branch?.uuid);
      SetGlobalFullAccess(firstAccessibleBranch?.branch?.full_access);
    }
  } else {
    dispatch({
      type: companyIdTypes.SUCCESS,
      payload: (firstAccessibleCompany && firstAccessibleCompany.uuid) || null,
    });
    dispatch(updateAccount({ account_uuid: results.account_uuid }));
    if (firstAccessibleCompany) {
      dispatch(
        updatePermissions({
          permissions: firstAccessibleCompany.permission || [],
          full_access: firstAccessibleCompany.full_access,
        }),
      );
      SetGlobalFullAccess(firstAccessibleCompany.full_access);
    }
  }

  localStorage.setItem(
    'token',
    JSON.stringify({
      reducer_status: tokenTypes.SUCCESS,
      token: results.token,
      tokenExpiry: results.token_expiry,
    }),
  );
  dispatch(
    updateToken({
      token: results.token,
      tokenExpiry: results.token_expiry,
    }),
  );
  dispatch(
    updateBranches({
      results: results.is_provider
        ? firstAccessibleAccount?.access?.map((item) => item.branch)
        : results.companies,
      totalCount: results.is_provider
        ? firstAccessibleAccount?.access?.length
        : results.companies?.length,
    }),
  );
  // when run this dispatch, the details API will be called inside it
  if (firstAccessibleCompany || firstAccessibleBranch)
    dispatch(
      updateSelectedBranch(
        (results.is_provider
          ? firstAccessibleBranch?.branch
          : firstAccessibleCompany) || null,
        localUser,
      ),
    );

  // start for redirect to the correct page after login
  const redirect_to = query.get('redirect_to');

  if (query.get('redirect_path')) {
    setBackDropLoader(true);
    const redirectPath = query.get('redirect_path');
    query.delete('token_key');
    query.delete('redirect_path');
    GlobalHistory.push(
      `${redirectPath}${(query.toString() && '?' + query.toString()) || ''}`,
    );
  } else if (
    query.get('source')
    && Object.values(NavigationSourcesEnum).some(
      (item) => item.key === +query.get('source'),
    )
  ) {
    const formSourceItem = GetFormSourceItem(+query.get('source'));
    if (formSourceItem && formSourceItem.source_url)
      GlobalHistory.push(
        formSourceItem.source_url({
          query,
        }),
      );
  } else if (query.get('verification_form_key')) {
    setBackDropLoader(true);
    GlobalHistory.push(`/forms?${query.toString()}`);
  } else if (redirect_to) {
    const loginRedirectEnum = getLoginRedirectEnum(redirect_to);
    if (loginRedirectEnum) {
      GlobalHistory.push(loginRedirectEnum.path());
      return;
    }
  } else GlobalHistory.push('/recruiter/overview');
  // end for redirect to the correct page after login
  // Get user details for email integration if a user is authenticated with Nylas
  const nylasUserDetails = await GetNylasUserDetails({
    user_uuid: results.uuid,
  });

  window?.ChurnZero?.push([
    'setAttribute',
    'contact',
    'Connected to nylas email integration',
    nylasUserDetails?.data?.body
    && nylasUserDetails?.data?.body?.sync_state === 'running'
      ? 'Yes'
      : 'No',
  ]);

  if (nylasUserDetails && nylasUserDetails.status === 200)
    dispatch(updateEmailIntegration(nylasUserDetails.data.body));

  if (afterSuccessfullyLogin) afterSuccessfullyLogin();
};
