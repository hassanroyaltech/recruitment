import React, {
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { dir } from 'i18next';
import {
  Backdrop,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'react-i18next';
import { PrivateRoute } from './PrivateRoute';
import I18n from '../helpers/TranslateMethod.Helper';
import {
  MiddlewareHelper,
  SetGlobalCompanyId,
  SetGlobalRerender,
  GlobalLocation,
  showError,
  SetGlobalAccountUuid,
  SetGlobalFullAccess,
  SetGlobalIsLoading,
  GlobalHistory,
  generateUUIDV4,
  CurrentTabInProgressAPIs,
} from '../helpers';
import {
  ScheduleTokenRefresh,
  watchTokenHandler,
} from '../stores/actions/tokenActions';
import { tokenTypes } from '../stores/types/tokenTypes';
import { RMSPermissions } from '../permissions';
import { GetAllSetupsUserBranches } from '../services';
import { updateBranches } from '../stores/actions/branchesActions';
import { updateSelectedBranch } from '../stores/actions/selectedBranchActions';
import { updatePermissions } from '../stores/actions/permissionsActions';
import { removeCandidateUser } from 'stores/actions/candidateActions';
import { updateAccountsList } from 'stores/actions/accountActions';
// import 'moment/locale/ar';
import { UserTypes } from 'stores/types/userTypes';
import {
  FormsForTypesEnum,
  NavigationSourcesEnum,
  SystemVariablesEnum,
  ThirdPartiesEnum,
} from '../enums';
import { useEventListener } from '../hooks';
import { useInactivityLogout } from '../hooks/InactivityLogout.Hook';
import { GetIsExternalRoutesHandler } from '../helpers/Routing.Helper';
// import { useEventListener } from '../hooks';
const SessionExpiredComponent = lazy(() =>
  import('../shared/components/SessionExpiredComponent'),
);
const FormBuilder = lazy(() => import('../pages/form-builder'));
const SharedResumes = lazy(() => import('../pages/evarec/rms/SharedResumes'));
const BackgroundLayout = lazy(() => import('../pages/auth/BackgroundLayout'));
const AuthAgency = lazy(() => import('../pages/auth-agency'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const FormBuilderLayout = lazy(() =>
  import('../layouts/form-builder/FormBuilder.Layout'),
);
const ScorecardBuilderPage = lazy(() =>
  import(
    '../pages/recruiter-preference/Scorecard/ScorecaredBuilder/Scorecard.Builder'
  ),
);

const jiraServiceLink
  = 'https://elevatus.atlassian.net/servicedesk/customer/portals';
const Router = () => {
  const [render, setRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  SetGlobalIsLoading(setIsLoading);
  const dispatch = useDispatch();
  const [isExternalRoute, setIsExternalRoute] = useState(
    GetIsExternalRoutesHandler(),
  );
  const { updateTheHookHandler } = useInactivityLogout(undefined);
  const theme = createTheme({
    direction: dir(),
  });
  moment.locale('en');
  const timerRef = useRef(null);
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const isTokenInitRef = useRef(true);
  const tokenReducer = useSelector((state) => state?.tokenReducer);
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const userReducer = useSelector((state) => state?.userReducer);
  const localSessionExpiryRef = useRef();
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const candidateUserReducer = useSelector((state) => state?.candidateUserReducer);
  // const permissionsReducer = useSelector((state) => state?.permissionsReducer?.permissions);
  const companyId = useSelector((state) => state?.companyIdReducer);
  const accountUuid
    = useSelector((state) => state?.accountReducer)?.account_uuid || '';
  const [source, setSource] = useState(null);
  SetGlobalRerender(setRender, render);
  I18n();

  const { t } = useTranslation('Shared');

  const onSessionDialogClose = () => setOpenDialog(false);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all branches for a current account
   */
  const getAllSetupsUserBranches = useCallback(
    async (isFromUseEffect = false) => {
      if (!isFromUseEffect) return;
      setIsLoading(true);
      const response = await GetAllSetupsUserBranches();
      setIsLoading(false);
      if (response && response.status === 200) {
        const {
          data: { results },
        } = response;
        if (response.data.results.is_provider) {
          setSource(response.data.results.source_uuid);
          dispatch(updateAccountsList(results?.list));
          const branches = response?.data?.results?.list
            ?.find((item) => item.account.uuid === accountUuid)
            ?.access?.map((item) => item.branch);
          const selectedBranch = branches?.find(
            (item) =>
              item.uuid
              === (localStorage.getItem('company_id')
                || (localStorage.getItem('selectedBranch')
                  && JSON.parse(localStorage.getItem('selectedBranch'))?.uuid)),
          );
          const firstAccessibleBranch = branches?.find(
            (item) => item?.uuid.can_access,
          );
          if (selectedBranch || firstAccessibleBranch)
            dispatch(
              updateSelectedBranch(
                selectedBranch || firstAccessibleBranch,
                userReducer?.results?.user,
              ),
            );
          if (selectedBranch?.uuid || firstAccessibleBranch?.uuid)
            SetGlobalCompanyId(selectedBranch?.uuid || firstAccessibleBranch?.uuid);
          dispatch(
            updateBranches({
              results: branches,
              totalCount: branches?.length,
              excluded_countries: results.excluded_countries,
            }),
          );
          SetGlobalCompanyId(firstAccessibleBranch?.uuid);
          SetGlobalFullAccess(firstAccessibleBranch?.full_access);
        } else{
          if (selectedBranchReducer) {
            const selectedBranch = results.companies.find(
              (item) => item.uuid === selectedBranchReducer.uuid
            );
            if (selectedBranch) dispatch(updateSelectedBranch(selectedBranch || null));
          }
          dispatch(
            updateBranches({
              results: results.companies,
              totalCount: results.companies.length,
              excluded_countries: results.excluded_countries,
            }),
          );}
      } else if (!GlobalLocation.pathname.includes('/el/'))
        showError(t('failed-to-get-saved-data'), response);
    },
    [dispatch, t, userReducer, accountUuid],
  );

  useEffect(() => {
    if (
      tokenReducer
      // && !tokenReducer.token
      && tokenReducer.reducer_status === tokenTypes.EXPIRE
    ) {
      setOpenDialog(true);
      dispatch({
        type: tokenTypes.DELETE,
      });
    }
  }, [dispatch, tokenReducer]);

  useEffect(() => {
    SetGlobalCompanyId(companyId);
  }, [companyId]);

  useEffect(() => {
    SetGlobalAccountUuid(accountUuid);
  }, [accountUuid]);

  useEffect(() => {
    if (source)
      dispatch({
        type: UserTypes.UPDATE_SOURCE_UUID,
        payload: source,
      });
  }, [dispatch, source]);

  // const checkCurrentSubscriptions = useCallback(() => {
  //   setIsLoading(true);
  //   administrationAPI
  //     .GetCurrentPlan()
  //     .then((response) => {
  //       setIsLoading(false);
  //       const results
  //         = (response && response?.data && response?.data?.results) || [];
  //       if (results && results.length > 0) {
  //         const subscriptionList = results?.map((el) => ({
  //           ...el.service,
  //           is_active: true,
  //           service: el.service.product,
  //         }));
  //
  //         localStorage.setItem(
  //           'UserSubscriptions',
  //           JSON.stringify({
  //             subscriptions: subscriptionList,
  //           }),
  //         );
  //
  //         dispatch({
  //           type: userSubscription.SUCCESS,
  //           payload: {
  //             subscriptions: subscriptionList,
  //           },
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       setIsLoading(false);
  //       showError('', error);
  //     });
  //   // if (tokenReducer
  //   //   && tokenReducer.token
  //   //   && tokenReducer.reducer_status !== tokenTypes.EXPIRE
  //   //   && tokenReducer.reducer_status !== tokenTypes.FAILED
  //   // )
  //   //   timerRef.current = setTimeout(() => {
  //   //     checkCurrentSubscriptions();
  //   //   }, 300000);
  //   // else if (timerRef.current) clearTimeout(timerRef.current);
  // }, [dispatch]);

  // useEffect(() => {
  //   if (
  //     tokenReducer
  //     && tokenReducer.token
  //     && tokenReducer.reducer_status === tokenTypes.SUCCESS
  //     && (!GlobalLocation.pathname.includes('/el/')
  //       || (GlobalLocation.pathname.includes('/el/login')
  //         && localStorage.getItem('isRememberMe')))
  //     && !GlobalLocation.pathname.includes('/recipient-login')
  //     && localStorage.getItem('company_id')
  //     && !Object.values(ThirdPartiesEnum).some((item) =>
  //       GlobalLocation.pathname.includes(item.path),
  //     )
  //   )
  //     checkCurrentSubscriptions();
  // }, [checkCurrentSubscriptions, tokenReducer]);

  // to watch the token expire
  useEffect(() => {
    if (
      tokenReducer
      && tokenReducer.token
      && (!GlobalLocation.pathname.includes('/el/')
        || (GlobalLocation.pathname.includes('/el/login')
          && localStorage.getItem('isRememberMe')))
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !GlobalLocation.pathname.includes('/onboarding/invitations')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
    )
      dispatch(watchTokenHandler(tokenReducer, true));
  }, [dispatch, tokenReducer]);

  // to reset the token watcher on refresh the page
  useEffect(() => {
    if (
      tokenReducer
      && tokenReducer.token
      && !GlobalLocation.pathname.includes('/el/')
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !GlobalLocation.pathname.includes('/onboarding/invitations')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
      && isTokenInitRef.current
    ) {
      isTokenInitRef.current = false;
      ScheduleTokenRefresh(tokenReducer, dispatch);
    }
  }, [dispatch, tokenReducer]);

  // this to prevent redirect to any page if the token or the user not exist in order to be watched
  useEffect(() => {
    console.log({
      tokenReducer,
      userReducer,
    });
    if (
      (!tokenReducer || !userReducer)
      && !GlobalLocation.pathname.includes('/el/')
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !GlobalLocation.pathname.includes('/onboarding/invitations')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
    ) {
      const url = new URL(window.location.href);
      const searchParams = new URLSearchParams(url.search);
      const queries = searchParams.toString();
      const source = searchParams.get('source');
      const isNumberSource = source && !isNaN(+source);
      const isQueryHasRedirectPathOrSource
        = queries.includes('redirect_path')
        || (queries.includes('source=') && isNumberSource)
        || queries.includes('redirect_page=');
      GlobalHistory.push(
        `/el/login${
          queries
            ? `?${queries}${
              (!isQueryHasRedirectPathOrSource
                && `&redirect_path=${window.location.pathname}`)
              || ''
            }`
            : ''
        }`,
      );
    }
  }, [tokenReducer, userReducer]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  // this is to add monitor for the local storage changes
  useEffect(() => {
    window.addEventListener('storage', (storageItem) => {
      if (
        storageItem
        && storageItem.key === 'user'
        && storageItem.oldValue
        && !storageItem.newValue
        && GlobalLocation
        && GlobalLocation.pathname
        && !GlobalLocation.pathname.includes('/el/')
        && !GlobalLocation.pathname.includes('/recipient-login')
        && !Object.values(ThirdPartiesEnum).some((item) =>
          GlobalLocation.pathname.includes(item.path),
        )
      )
        window.location.reload();
    });
  }, []);

  // this is to get companies on refresh
  useEffect(() => {
    if (
      tokenReducer
      && tokenReducer.token
      && tokenReducer.reducer_status === tokenTypes.SUCCESS
      && !GlobalLocation.pathname.includes('/el/')
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
    )
      void getAllSetupsUserBranches(true);
  }, [getAllSetupsUserBranches, tokenReducer]);

  // this is to update the permissions & check the active branch on change the branches reducer
  useEffect(() => {
    if (
      branchesReducer
      && branchesReducer.branches
      && branchesReducer.branches.results
      && (!GlobalLocation.pathname.includes('/el/')
        || (GlobalLocation.pathname.includes('/el/login')
          && localStorage.getItem('isRememberMe')))
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
    ) {
      const {
        branches: { results },
      } = branchesReducer;
      const localSelectedBranch = results.find(
        (branch) =>
          selectedBranchReducer && branch.uuid === selectedBranchReducer.uuid,
      );
      if (!localSelectedBranch || !localSelectedBranch.can_access) {
        const firstAccessibleBranch = (results?.[0]?.access || results).find(
          (branch) =>
            branch?.branch ? branch.branch?.can_access : branch.can_access,
        );
        dispatch(
          updateSelectedBranch(firstAccessibleBranch, userReducer?.results?.user),
        );
        dispatch(
          updatePermissions({
            permissions: firstAccessibleBranch.permission || [],
            full_access: firstAccessibleBranch.full_access,
          }),
        );
        SetGlobalFullAccess(firstAccessibleBranch.full_access);
        return;
      }
      dispatch(
        updatePermissions({
          permissions: localSelectedBranch.permission || [],
          full_access: localSelectedBranch.full_access,
        }),
      );
      SetGlobalFullAccess(localSelectedBranch.full_access);
    }
  }, [branchesReducer, dispatch, selectedBranchReducer, userReducer?.results?.user]);

  useEffect(() => {
    if (
      !GlobalLocation?.pathname.includes('forms')
      && !GlobalLocation?.pathname.includes('/form-builder/flow')
      && !GlobalLocation?.pathname.includes('/onboarding/invitations')
    )
      dispatch(removeCandidateUser());
  }, [dispatch]);

  useEffect(() => {
    if (
      userReducer
      && tokenReducer
      && tokenReducer.token
      && tokenReducer.reducer_status === tokenTypes.SUCCESS
      && (!GlobalLocation.pathname.includes('/el/')
        || (GlobalLocation.pathname.includes('/el/login')
          && localStorage.getItem('isRememberMe')))
      && !GlobalLocation.pathname.includes('/recipient-login')
      && !Object.values(ThirdPartiesEnum).some((item) =>
        GlobalLocation.pathname.includes(item.path),
      )
    ) {
      localStorage.setItem('storedTime', String(Date.now()));
      window?.ChurnZero?.push(['setAppKey', process.env.REACT_APP_CHURNZERO_KEY]);
      window?.ChurnZero?.push([
        'setContact',
        userReducer.results?.user?.is_provider
          ? accountUuid
          : userReducer.results?.account_uuid,
        userReducer.results?.user?.uuid,
      ]);
    }
  }, [tokenReducer, userReducer, accountUuid]);

  useEffect(() => {
    if (
      selectedBranchReducer
      && selectedBranchReducer.brandStyle
      && (selectedBranchReducer.brandStyle.mainColor
        || selectedBranchReducer.brandStyle.logo)
    ) {
      const root = document.querySelector(':root');
      if (selectedBranchReducer.brandStyle.mainColor)
        Object.values(SystemVariablesEnum)
          .filter((item) => item.isReflected)
          .map((item) =>
            root.style.setProperty(
              item.key,
              selectedBranchReducer.brandStyle.mainColor,
            ),
          );

      localStorage.setItem(
        'lastSelectedBranchTheme',
        JSON.stringify({
          ...(selectedBranchReducer.brandStyle || {}),
        }),
      );
    }
  }, [selectedBranchReducer]);

  // to change the leader tab for token refresh on refresh or duplicate the tab
  useEffect(() => {
    const focusedTabId = generateUUIDV4();
    sessionStorage.setItem('tabID', focusedTabId);
    localStorage.setItem('tokenLeaderTab', focusedTabId);
  }, []);

  // to update the session expiry monitoring hook
  useEffect(() => {
    if (userReducer?.results?.user?.with_session_expiry_control) {
      if (localSessionExpiryRef.current === userReducer.results.user.session_expiry)
        return;
      localSessionExpiryRef.current = userReducer.results.user.session_expiry;
      updateTheHookHandler({
        newTimeoutDuration: userReducer.results.user.session_expiry * 60 * 60 * 1000,
        newTurnOffInactivityLogoutValue: false,
      });
    } else
      updateTheHookHandler({
        newTimeoutDuration: undefined,
        newTurnOffInactivityLogoutValue: true,
      });
  }, [
    updateTheHookHandler,
    userReducer?.results?.user?.session_expiry,
    userReducer?.results?.user?.with_session_expiry_control,
  ]);

  // this is to remove the leader from the current active tab its leader
  useEventListener('beforeunload', () => {
    // another logic for token refresh handler
    const tokenLeaderTab = localStorage.getItem('tokenLeaderTab');
    if (tokenLeaderTab && tokenLeaderTab === sessionStorage.getItem('tabID'))
      localStorage.removeItem('tokenLeaderTab');
    // a counter for the progress APIs
    const requestsCounter = localStorage.getItem('APIRequestsCounter')
      ? +localStorage.getItem('APIRequestsCounter')
      : 0;
    localStorage.setItem(
      'APIRequestsCounter',
      requestsCounter - CurrentTabInProgressAPIs + '',
    );
  });
  // this logic is to make sure that the current active tab is the only one
  // responsible for token update
  // useEventListener('focus', () => {
  //   console.log('focused');
  //   const focusedTabId = generateUUIDV4();
  //   sessionStorage.setItem('tabID', focusedTabId);
  //   localStorage.setItem('tokenLeaderTab', focusedTabId);
  // });
  useEffect(() => {
    setIsExternalRoute((item) =>
      GetIsExternalRoutesHandler() !== item ? !item : item,
    );
  }, [location]);
  return (
    <ThemeProvider theme={theme}>
      <MiddlewareHelper />
      <SessionExpiredComponent
        openDialog={openDialog}
        onSessionDialogClose={onSessionDialogClose}
      />
      {isLoading && (
        <Backdrop
          className="spinner-wrapper"
          style={{ zIndex: 9999 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" size={50} />
        </Backdrop>
      )}
      <Fab
        color="primary"
        sx={{
          border: '3px solid white !important',
          height: '50px!important',
          boxShadow: 'none!important',
          width: '50px!important',
          position: 'absolute',
          bottom: 16,
          right: dir() === 'ltr' ? 16 : 'unset',
          left: dir() === 'ltr' ? 'unset' : 16,
        }}
        className="btn-primary"
        onClick={() => window.open(jiraServiceLink)}
      >
        <span
          className="fas fa-question"
          style={{
            fontSize: '21px',
            transform: `rotateY(${dir() === 'ltr' ? '0' : '180'}deg)`,
          }}
        ></span>
      </Fab>
      <Suspense
        fallback={
          <Backdrop className="spinner-wrapper" open>
            <CircularProgress color="inherit" size={50} />
          </Backdrop>
        }
      >
        <Switch>
          <Route
            strict
            path="/el"
            render={(props) => <BackgroundLayout {...props} />}
          />
          <Route
            strict
            path="/oauth"
            render={(props) => <BackgroundLayout {...props} />}
          />
          <Route
            strict
            path="/recipient-login"
            render={(props) => <AuthAgency {...props} />}
          />
          <Route strict path="/v2/recipient-login" component={FormBuilderLayout} />
          <PrivateRoute
            strict
            path="/onboarding/invitations"
            component={FormBuilderLayout}
            hasSpecialCase={({ query, specialHistory }) => {
              const queryFor = query.get('for');
              const queryEmail = query.get('email');
              if (!queryFor) return false;
              if (+queryFor === FormsForTypesEnum.Candidate.key) {
                if (
                  !candidateReducer
                  || !candidateReducer.expire_at
                  || !candidateReducer.expire_at.date
                  || moment(candidateReducer.expire_at.date).isSameOrBefore()
                  || candidateReducer.candidate.email !== queryEmail
                ) {
                  setTimeout(() => {
                    specialHistory.push(
                      `/v2/recipient-login?${query.toString()}`,
                    );
                  });
                  return false;
                }
                return true;
              } else if (+queryFor === FormsForTypesEnum.SystemUser.key) {
                if (
                  !userReducer
                  || userReducer.results.user.email !== queryEmail
                ) {
                  showError(t('please-login-first'));
                  let redirectLink = query.toString().includes('source')
                    ? `/el/login?${query.toString()}`
                    : `/el/login?${query.toString()}&source=${
                      NavigationSourcesEnum.OnboardingInvitationsToLogin.key
                    }`;
                  setTimeout(() => {
                    specialHistory.push(redirectLink);
                  });
                }
                return true;
              }

              return false;
            }}
          />
          {((tokenReducer
              && tokenReducer.token
              && tokenReducer.reducer_status === tokenTypes.SUCCESS)
            || candidateUserReducer?.token
            || candidateReducer?.token) && (
            <>
              <PrivateRoute
                strict
                path="/form-builder"
                hasSpecialCase={() => sessionStorage.getItem('candidate_user_data')}
                component={FormBuilder}
              />
              <PrivateRoute
                strict
                path="/forms"
                component={FormBuilderLayout}
                hasSpecialCase={({ query }) => {
                  if (!userReducer && candidateReducer) {
                    const queryFor = query.get('for');
                    if (queryFor && +queryFor === FormsForTypesEnum.Candidate.key)
                      return true;
                  }
                  return false;
                }}
              />
              {tokenReducer
                && tokenReducer.token
                && tokenReducer.reducer_status === tokenTypes.SUCCESS && (
                <>
                  <PrivateRoute
                    strict
                    path="/scorecard-builder"
                    hasSpecialCase={() =>
                      sessionStorage.getItem('candidate_user_data')
                    }
                    component={ScorecardBuilderPage}
                  />
                  <PrivateRoute
                    exact
                    path="/assessment/shared-profiles/:token"
                    component={SharedResumes}
                    // PermissionId={RMSPermissions.UpdateEvaRecApplication.key}
                  />
                  <PrivateRoute
                    exact
                    path="/rms/shared-profiles/:token"
                    component={SharedResumes}
                    PermissionId={RMSPermissions.SuperResumeMatching.key}
                  />
                  <PrivateRoute
                    path="/ats/shared-profiles/:token"
                    component={SharedResumes}
                    // PermissionId={RmsPermissions.SuperResumeMatching.key}
                  />
                  {/* it's important for this to be the last option */}
                  {/* this condition is because inside the dashboard there 
                is an onboarding routing also */}
                  {/**
                     * @note make sure to add any external routing here also specially the
                     * one that include some of this routing paths like recruiter/form-builder
                     */}
                  {!isExternalRoute && (
                    <PrivateRoute strict path="/" component={Dashboard} />
                  )}
                </>
              )}
            </>
          )}
          {/*no need since there is use effect to check the token*/}
          {/*<Route*/}
          {/*  path="**"*/}
          {/*  render={() =>*/}
          {/*    tokenReducer*/}
          {/*    && tokenReducer.token*/}
          {/*    && tokenReducer.reducer_status === tokenTypes.SUCCESS ? (*/}
          {/*        <Redirect to="/recruiter/overview" />*/}
          {/*      ) : (*/}
          {/*        <Redirect to="/el/login" />*/}
          {/*      )*/}
          {/*  }*/}
          {/*/>*/}
        </Switch>
      </Suspense>
    </ThemeProvider>
  );
};
export default Router;
