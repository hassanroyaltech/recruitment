/* eslint-disable max-len */
// noinspection JSCheckFunctionSignatures

/*!

=========================================================
* Argon Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useCallback, useEffect, useRef, useState } from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// redux library to get state
import { useDispatch, useSelector } from 'react-redux';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Nav,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

// Import API function
// import { authAPI } from 'api/auth';

import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Badge as BadgeUi } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
// import { kebabToTitle } from 'shared/utils';
import { useHistory } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import {
  onMessageListener,
  requestFirebaseNotificationPermission,
} from '../../pages/overview/firebase';
import { commonAPI } from '../../api/common';
import { notificationAPI } from '../../api/notification';
import { LanguageChangeComponent } from './Sections';
import LetterAvatar from '../Elevatus/LetterAvatar';
import {
  GlobalSearchDelay,
  showError,
  showSuccess,
} from '../../helpers';
import {
  MarkAllNotificationsAsReaded,
  ChangePassword,
  LogoutService,
  GenerateSSOKey,
  GetAllSetupsBranches,
} from '../../services';
import { PopoverComponent } from '../Popover/Popover.Component';
import { LoadableImageComponant } from '../LoadableImage/LoadableImage.Componant';
import { Inputs } from '../Inputs/Inputs.Component';
import './AdminNavbar.Style.scss';
import { updateSelectedBranch } from '../../stores/actions/selectedBranchActions';
import { DialogComponent } from '../Dialog/Dialog.Component';
import Logo from '../../assets/img/logo/elevatus-dark-blue.png';
import { updateBranches } from '../../stores/actions/branchesActions';
import {
  updateAccount,
  updateSelectedAccount,
} from '../../stores/actions/accountActions';
import { NotificationSettingsDialog } from './Dialogs/NotificationSettings.Dialog';
import { LogoutHelper } from '../../helpers/Logout.Helper';

const translationPath = 'LoginView.';

export const AdminNavbar = ({ isOpenMobileMenu, onIsOpenMobileMenuChange }) => {
  const { t } = useTranslation('Shared');
  const history = useHistory();
  const dispatch = useDispatch();
  // const navbarTitle = useSelector((state) => state?.navReducer?.navbarTitle);
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);
  const tokenReducer = useSelector((state) => state?.tokenReducer);
  const userReducer = useSelector((state) => state?.userReducer);
  const [branchesPopoverAttachedWith, setBranchesPopoverAttachedWith]
    = useState(null);
  const [accountsPopoverAttachedWith, setAccountsPopoverAttachedWith]
    = useState(null);
  const [localSelectedBranch, setLocalSelectedBranch] = useState(null);
  const [localSelectedAccount, setLocalSelectedAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const notificationInterval = useRef(null);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    use_for: 'list',
  });
  const [branchesSearch, setBranchesSearch] = useState('');
  const [accountsSearch, setAccountsSearch] = useState('');
  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results?.user,
    user_data: JSON.parse(localStorage.getItem('user'))?.results,
    page: 1,
    newNotifications: 0,
    totalNumberOfNotifications: 0,
    allNotifications: [],
    flag: true,
    evaIcons: {
      eva_rec: 'fas fa-briefcase',
      eva_meet: 'fas fa-comments',
      eva_ssess: 'fas fa-video',
      eva_brand: 'fas fa-adjust',
      career_site: 'fas fa-home',
      eva_flow: 'fas fa-random',
    },
    evaColor: {
      eva_rec: 'bg-brand-green',
      eva_meet: 'bg-brand-light-blue',
      eva_ssess: 'bg-brand-purple',
      eva_brand: 'bg-brand-pink',
      career_site: 'bg-brand-primary',
      eva_flow: 'bg-brand-yellow',
    },
    urls: JSON.parse(localStorage.getItem('gateway_urls')),
  });
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const defaultShowPasswordState = useRef({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [isShowPassword, setIsShowPassword] = useState(
    defaultShowPasswordState.current,
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const defaultPasswordState = useRef({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  });
  const [changePasswordState, setChangePasswordState] = useState(
    defaultPasswordState.current,
  );
  const [careerPortalUrl, setCareerPortalUrl] = useState(
    localStorage.getItem('careerPortalUrl') || '',
  );
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);

  const isOpenChanged = useCallback(() => {
    setChangePasswordOpen(false);
    setChangePasswordState(defaultPasswordState.current);
    setIsShowPassword(defaultShowPasswordState.current);
  }, []);

  const changePasswordHandler = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitted(true);

      if (
        changePasswordState.currentPassword
        && changePasswordState.newPassword
        && changePasswordState.confirmPassword
      ) {
        setIsLoading(true);
        const result = await ChangePassword({
          current_password: changePasswordState.currentPassword,
          password: changePasswordState.newPassword,
          password_confirmation: changePasswordState.confirmPassword,
        });

        if (result && result.status === 200) {
          showSuccess(t(`${translationPath}password-changed-successfully`));
          setIsSubmitted(false);
          isOpenChanged();
          setIsLoading(false);
          setChangePasswordState(defaultPasswordState.current);
          setIsShowPassword(defaultShowPasswordState.current);
        } else {
          showError(t('Shared:failed-to-update'), result);
          setIsLoading(false);
        }
      }
    },
    [
      changePasswordState.currentPassword,
      changePasswordState.newPassword,
      changePasswordState.confirmPassword,
      t,
      isOpenChanged,
    ],
  );

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change filter to recall branches
   * on timer for search delay finish
   */
  const searchBranchesHandler = (event) => {
    const {
      target: { value },
    } = event;
    setBranchesSearch(value);
    if (
      branchesReducer
      && branchesReducer.branches
      && branchesReducer.branches.results
      && branchesReducer.branches.results.length !== branchesReducer.branches.totalCount
    ) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setFilter((items) => ({ ...items, page: 1, search: value }));
      }, GlobalSearchDelay);
    }
  };

  const searchAccountsHandler = (event) => {
    const {
      target: { value },
    } = event;
    setAccountsSearch(value);
    if (
      accountReducer
      && accountReducer.accountsList
      && accountReducer.accountsList.length !== accountReducer.accountsList.totalCount // ask salahat to save total count
    ) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setFilter((items) => ({ ...items, page: 1, search: value }));
      }, GlobalSearchDelay);
    }
  };

  /**
   * Fun: to store deviceToken in database
   * @returns {Promise<void>}
   */
  const sendUserDeviceToken = useCallback(() => {
    requestFirebaseNotificationPermission()
      .then((firebaseToken) => {
        /**
         * To check if deviceToken new, send it
         * if not, Don't do anything
         * this one for not send many useless request
         */
        const userDeviceToken = localStorage.getItem('user_device_token');
        if (firebaseToken !== userDeviceToken) {
          localStorage.setItem('user_device_token', firebaseToken);
          commonAPI.sendUserDeviceToken(firebaseToken).catch((err) => {
            showError(t('failed-to-get-saved-data'), err);
          });
        }
      })
      .catch(() => {});
  }, [t]);

  /**
   * get all data from first page and update
   * number of new notification, total number of notification
   * and notifications (it's an array of objects)
   */
  const getNotificationAndUpdateTheState = useCallback(() => {
    if (!tokenReducer || !userReducer || !userReducer.results?.user) return;
    notificationAPI
      .getNotification(1)
      .then((response) => {
        setState((items) => ({
          ...items,
          newNotifications: response.data.results?.unread_notifications,
          totalNumberOfNotifications: response.data?.paginate?.total,
          allNotifications: response.data.results.notifications,
        }));
      })
      .catch(() => {
        // showError(t('failed-to-get-saved-data'), error);
      });
  }, [tokenReducer, userReducer]);

  /**
   * Fun(): to fetch if there is new Notifications
   * And update total number, new notification number, new notification data.
   */
  const fetchNotification = useCallback(() => {
    onMessageListener()
      .then(() => {
        getNotificationAndUpdateTheState();
      })
      .catch(() => {
        // showError(t('failed-to-get-saved-data'), error);
      });
    /**
     * fetch new notification after five minutes.
     */
    notificationInterval.current = setInterval(() => {
      if (
        (!localStorage.getItem('isRefreshTokenInProgress')
          || localStorage.getItem('isRefreshTokenInProgress') !== 'yes')
        && !history.location.pathname.includes('el/')
      )
        getNotificationAndUpdateTheState();
      // checkTokenValidation();
    }, 300000);
  }, [getNotificationAndUpdateTheState, history.location.pathname]);

  /**
   * Fun(): to fetch the rest of Notifications while scrolling
   */
  const fetchMoreNotifications = () => {
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
    notificationAPI
      .getNotification(state.page)
      .then((response) => {
        setState((prevState) => ({
          ...prevState,
          allNotifications: [
            ...prevState.allNotifications,
            ...response.data.results.notifications,
          ],
        }));
      })
      .catch(() => {
        // showError(t('failed-to-get-saved-data'), error);
      });
  };

  /**
   * Fun(): to mark the notification as read it
   * @param e
   */
  const sendReadNotification = async (e) => {
    await notificationAPI
      .readNotification([e.uuid])
      .then(() => {
        getNotificationAndUpdateTheState();
      })
      .catch((error) => {
        showError(t('failed-to-get-saved-data'), error);
      });
    window.open(e.link, '_blank');
  };

  const logout = async () => {
    if (userReducer?.results?.user?.is_provider && !accountReducer?.account_uuid) {
      LogoutHelper();
      showSuccess(t(`${translationPath}logout-successfully`));
      return;
    }
    const response = await LogoutService();
    LogoutHelper();
    if (response && response.status === 200)
      showSuccess(t(`${translationPath}logout-successfully`));
    else showError(t(`${translationPath}logout-failed`), response);
  };
  /**
   * Function to update local storage item (User), So in this
   * function the token and token_exp will be updated after
   * refresh token API.
   * @param token
   */

  // const updateLocalStorage = (token) => {
  //   const userData = JSON.parse(localStorage.getItem('user'));
  //   userData.results.token = token;
  //   userData.results.token_exp = tokenExpired + 86400;
  //   localStorage.setItem('user', JSON.stringify(userData));
  // };

  /**
   * This function will check if the token is expired before 15 minutes of token expiration
   * if yes, invoke refresh token API to update the token
   * instead of logout from the system.
   */
  // const checkTokenValidation = () => {
  //   const user_data = JSON.parse(localStorage.getItem('user'))?.results;
  //   const currentTime = Math.floor(Date.now() / 1000);
  //   if (tokenExpired - 900 <= currentTime)
  //     authAPI.refreshToken(user_data.token).then((res) => {
  //       updateLocalStorage(res?.data?.results);
  //     });
  // };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is handle get open for notifications popup
   * and mark all unreaded notification as readed
   */
  const onNotificationsClicked = useCallback(async () => {
    setState((items) => ({ ...items, flag: false }));
    if (state.newNotifications && state.newNotifications > 0)
      await MarkAllNotificationsAsReaded();
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is handle get the rest of the branches
   */
  const getAllBranches = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsBranches({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200) {
      const { results } = response.data;
      const { paginate } = response.data;

      if (filter.page > 1) {
        const currentBranches
          = (localStorage.getItem('branches')
            && JSON.parse(localStorage.getItem('branches')).results)
          || [];
        dispatch(
          updateBranches({
            results: currentBranches.concat(results),
            totalCount: paginate.total,
            excluded_countries: results.excluded_countries,
          }),
        );
      } else
        dispatch(
          updateBranches({
            results,
            totalCount: paginate.total,
            excluded_countries: results.excluded_countries,
          }),
        );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [filter, dispatch, t]);

  const loadMoreHandler = useCallback(() => {
    setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, []);
  const getIsAllowedLoadMore = useCallback(
    () =>
      !branchesReducer
      || !branchesReducer.branches
      || !branchesReducer.branches.results
      || branchesReducer.branches.results.length
        !== branchesReducer.branches.totalCount,
    [branchesReducer],
  );

  const branchChangedHandler = useCallback(
    (currentBranch) => () => {
      setCareerPortalUrl((currentBranch && currentBranch.full_domain) || '');
      setLocalSelectedBranch(currentBranch);
      // rerenderUpdate();
      setTimeout(() => {
        setBranchesPopoverAttachedWith(null);
      }, 30);
    },
    [],
  );
  const accountChangedHandler = useCallback(
    (currentAccount) => () => {
      setLocalSelectedAccount(currentAccount);
      setTimeout(() => {
        setAccountsPopoverAttachedWith(null);
      }, 30);
    },
    [],
  );

  const selfServiceHandler = useCallback(async () => {
    const response = await GenerateSSOKey();
    if (response && response.status === 201) {
      const { results } = response.data;
      const account_uuid = localStorage.getItem('account_uuid');
      const user
        = localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'));
      window.open(
        `${process.env.REACT_APP_SELFSERVICE_URL}/accounts/login?token_key=${
          results.key
        }&account_uuid=${account_uuid}${
          user?.results?.user?.uuid ? `&user_uuid=${user?.results?.user?.uuid}` : ''
        }`,
        '_blank',
      );
    } else if (!response || response.message)
      showError(
        response?.message
          || t(`${translationPath}signup-requirements-update-failed`),
      );
  }, [t]);

  // this method to call the notifications on init
  useEffect(() => {
    sendUserDeviceToken();
    if (
      !userReducer?.results?.user?.is_provider
      && userReducer
      && userReducer.results?.user
    ) {
      getNotificationAndUpdateTheState();
      fetchNotification();
    }
  }, [
    fetchNotification,
    getNotificationAndUpdateTheState,
    sendUserDeviceToken,
    userReducer,
  ]);

  // to update the selected branch dispatch
  useEffect(() => {
    if (localSelectedBranch)
      dispatch(
        updateSelectedBranch(localSelectedBranch, userReducer?.results?.user),
      );
  }, [dispatch, localSelectedBranch, userReducer]);

  // to update the selected account dispatch
  useEffect(() => {
    if (localSelectedAccount?.account?.uuid) {
      dispatch(updateSelectedAccount(localSelectedAccount.account.uuid));
      dispatch(
        updateAccount({
          account_uuid: localSelectedAccount.account.uuid,
          accountsList: JSON.parse(localStorage.getItem('account'))?.accountsList,
        }),
      );
    }
  }, [dispatch, localSelectedAccount, userReducer]);

  // to update the selected account dispatch
  useEffect(() => {
    if (localSelectedAccount) {
      dispatch(updateSelectedAccount(localSelectedAccount?.account?.uuid));
      const branches = localSelectedAccount.access.map((item) => item.branch);
      dispatch(
        updateBranches({
          results: branches,
          totalCount: branches?.length,
        }),
      );
    }
  }, [dispatch, localSelectedAccount]);

  // this method to load more branches
  useEffect(() => {
    if (filter && (filter.search || filter.page > 1)) getAllBranches();
  }, [getAllBranches, filter]);

  // this is to update the local selected branch if selected branch changed from
  // outside of header like:- the branch become not accessible or deleted
  // useEffect(() => {
  //   if (selectedBranchReducer)
  //     setLocalSelectedBranch((item) => {
  //       if (!item || item.uuid !== selectedBranchReducer.uuid)
  //         return { ...selectedBranchReducer };
  //       return item;
  //     });
  // }, [selectedBranchReducer]);

  // to prevent memory leak if component destroyed before time finish
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (notificationInterval.current) clearInterval(notificationInterval.current);
    },
    [],
  );

  return (
    <div className="admin-header-wrapper">
      <div className="header-content-wrapper">
        <div className="header-section-wrapper">
          <ButtonBase
            className={`btns-icon mobile-menu-btn ${
              (isOpenMobileMenu && 'theme-solid') || 'theme-transparent'
            }`}
            onClick={onIsOpenMobileMenuChange}
          >
            <span className="fas fa-bars" />
          </ButtonBase>
          {accountReducer?.accountsList?.length ? (
            <ButtonBase
              onClick={(event) =>
                setAccountsPopoverAttachedWith(event.currentTarget)
              }
              className="branches-menu-btn" // change later
            >
              {
                <LetterAvatar
                  alt={t(`${translationPath}account-image`)}
                  name="salahat account"
                />
              }
              <span className="branch-title-wrapper">
                {/* change later */}
                {
                  accountReducer?.accountsList?.find(
                    (item) => item.account.uuid === accountReducer.account_uuid,
                  )?.account?.name?.en
                }
              </span>
              <span className="box-icon-small">
                <span
                  className={`fas fa-chevron-${
                    (accountsPopoverAttachedWith && 'up') || 'down'
                  }`}
                />
              </span>
            </ButtonBase>
          ) : null}
          {branchesReducer?.branches?.results?.length ? (
            <ButtonBase
              onClick={(event) =>
                setBranchesPopoverAttachedWith(event.currentTarget)
              }
              className="branches-menu-btn"
            >
              {(selectedBranchReducer && selectedBranchReducer.image_url && (
                <LoadableImageComponant
                  alt={t(`${translationPath}branch-image`)}
                  src={selectedBranchReducer && selectedBranchReducer.image_url}
                />
              )) || (
                <LetterAvatar
                  alt={t(`${translationPath}branch-image`)}
                  name={
                    (selectedBranchReducer
                      && selectedBranchReducer.name
                      && (selectedBranchReducer.name[i18next.language]
                        || selectedBranchReducer.name.en))
                    || t(`${translationPath}branch-image`)
                  }
                />
              )}
              <span className="branch-title-wrapper">
                {(selectedBranchReducer
                  && (selectedBranchReducer.name[i18next.language]
                    || selectedBranchReducer.name.en))
                  || 'N/A'}
              </span>
              <span className="box-icon-small">
                <span
                  className={`fas fa-chevron-${
                    (branchesPopoverAttachedWith && 'up') || 'down'
                  }`}
                />
              </span>
            </ButtonBase>
          ) : null}
          {accountReducer?.accountsList && (
            <PopoverComponent
              idRef="accountsPopoverRef"
              withBackdrop
              handleClose={() => setAccountsPopoverAttachedWith(null)}
              attachedWith={accountsPopoverAttachedWith}
              component={
                // change later class name
                <div className="branches-menu-items-wrapper">
                  <div className="d-flex p-2">
                    <Inputs
                      idRef="accountsSearchRef"
                      label="search"
                      value={accountsSearch}
                      // isLoading={isLoading}
                      onInputChanged={searchAccountsHandler}
                      themeClass="theme-solid"
                      endAdornment={
                        <span className="end-adornment-wrapper">
                          <span className="fas fa-search" />
                        </span>
                      }
                    />
                  </div>
                  {accountReducer
                    && accountReducer.accountsList
                      .filter(
                        (item) =>
                          !accountsSearch
                          || !item.account.name
                          || Object.values(item.account.name).findIndex((el) =>
                            el
                              .toLowerCase()
                              .includes((accountsSearch || '').toLowerCase()),
                          ) !== -1,
                      )
                      .map((item, index) => (
                        <ButtonBase
                          key={`${item.account.uuid}${index + 1}`}
                          className={`btns theme-transparent branches-menu-btn${
                            (accountReducer //change later
                              && accountReducer.account_uuid === item.account.uuid
                              && ' is-active-branch') //change later
                            || ''
                          }`}
                          onClick={accountChangedHandler(item)}
                        >
                          <span>{item.account.name[i18next.language]}</span>
                        </ButtonBase>
                      ))}
                  {getIsAllowedLoadMore() && (
                    <ButtonBase
                      className="btns theme-transparent branches-menu-btn c-primary"
                      disabled={isLoading}
                      onClick={loadMoreHandler}
                    >
                      <span>{t('load-more')}</span>
                    </ButtonBase>
                  )}
                </div>
              }
            />
          )}
          <PopoverComponent
            idRef="branchesPopoverRef"
            withBackdrop
            handleClose={() => setBranchesPopoverAttachedWith(null)}
            attachedWith={branchesPopoverAttachedWith}
            component={
              <div className="branches-menu-items-wrapper">
                <div className="d-flex p-2">
                  <Inputs
                    idRef="branchesSearchRef"
                    label="search"
                    parentTranslationPath="Shared"
                    value={branchesSearch}
                    // isLoading={isLoading}
                    onInputChanged={searchBranchesHandler}
                    themeClass="theme-solid"
                    endAdornment={
                      <span className="end-adornment-wrapper">
                        <span className="fas fa-search" />
                      </span>
                    }
                  />
                </div>
                {branchesReducer
                  && branchesReducer.branches
                  && branchesReducer.branches.results
                  && branchesReducer.branches.results
                    .filter(
                      (item) =>
                        !branchesSearch
                        || !item.name
                        || Object.values(item.name).findIndex((el) =>
                          el
                            .toLowerCase()
                            .includes((branchesSearch || '').toLowerCase()),
                        ) !== -1,
                    )
                    .map((item, index) =>
                      item.can_access ? (
                        <ButtonBase
                          key={`${item.uuid}${index + 1}`}
                          className={`btns theme-transparent branches-menu-btn${
                            (selectedBranchReducer
                              && selectedBranchReducer.uuid === item.uuid
                              && ' is-active-branch')
                            || ''
                          }`}
                          disabled={!item.can_access}
                          onClick={branchChangedHandler(item)}
                        >
                          <span>{item.name[i18next.language] || item.name.en}</span>
                        </ButtonBase>
                      ) : null,
                    )}
                {getIsAllowedLoadMore() && (
                  <ButtonBase
                    className="btns theme-transparent branches-menu-btn c-primary"
                    disabled={isLoading}
                    onClick={loadMoreHandler}
                  >
                    <span>{t('load-more')}</span>
                  </ButtonBase>
                )}
              </div>
            }
          />
        </div>
        <div className="header-section-wrapper logo-section">
          <div className="navbar-logo-image">
            <img
              alt={
                (selectedBranchReducer
                  && selectedBranchReducer.name
                  && (selectedBranchReducer.name[i18next.language]
                    || selectedBranchReducer.name.en))
                || t('Shared:elevatus-logo')
              }
              src={
                (selectedBranchReducer
                  && selectedBranchReducer.brandStyle
                  && selectedBranchReducer.brandStyle.logo)
                || Logo
              }
            />
          </div>
          {/* {navbarTitle && ( */}
          {/*  <Nav className="align-items-center" navbar> */}
          {/*    <NavItem className="font-weight-bold text-primary font-14"> */}
          {/*      {navbarTitle.parentName ? `${t(navbarTitle.parentName)} - ` : ''} */}
          {/*      {navbarTitle.name ? `${t(navbarTitle.name)}` : ''} */}
          {/*      {navbarTitle.child_name ? ` - ${t(navbarTitle.child_name)}` : ''} */}
          {/*    </NavItem> */}
          {/*  </Nav> */}
          {/* )} */}
        </div>
        <div className="header-section-wrapper actions-section">
          <Nav className="align-items-center" navbar>
            <ButtonBase
              className="btns-icon theme-transparent "
              onClick={() => history.push('/recruiter/announcements')}
            >
              <i className="fa fa-bullhorn" aria-hidden="true"></i>
            </ButtonBase>
            <LanguageChangeComponent />
            <UncontrolledDropdown nav>
              <DropdownToggle
                className="nav-link text-gray"
                style={{ cursor: 'pointer' }}
                tag="a"
              >
                <BadgeUi
                  max={99}
                  badgeContent={state.flag ? state.newNotifications : 0}
                  onClick={onNotificationsClicked}
                  color="secondary"
                >
                  <NotificationsIcon />
                </BadgeUi>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-xl py-0 overflow-hidden" end>
                <div className="px-3 py-3 d-flex-v-center-h-between mx-2">
                  <h6 className="text-sm text-muted m-0">
                    {t(`${translationPath}your-have`)}{' '}
                    <strong className="text-info">
                      {state.allNotifications ? state.totalNumberOfNotifications : 0}
                    </strong>{' '}
                    {t(`${translationPath}notifications`)}.
                  </h6>
                  <ButtonBase onClick={() => setNotificationSettingsOpen(true)}>
                    <span className="fas fa-cog" />
                  </ButtonBase>
                </div>
                <div
                  id="scrollableDiv"
                  style={{
                    height: state.allNotifications?.length > 0 ? '30.5rem' : '0px',
                    overflow: 'auto',
                    // cursor: 'pointer',
                  }}
                >
                  <InfiniteScroll
                    dataLength={state.allNotifications.length}
                    next={fetchMoreNotifications}
                    hasMore={
                      state.allNotifications.length
                      !== state.totalNumberOfNotifications
                    }
                    scrollableTarget="scrollableDiv"
                    loader={
                      <div className=" d-flex justify-content-center pt-2">
                        <p>{t(`${translationPath}loading`)}</p>
                      </div>
                    }
                    endMessage={
                      (state.allNotifications.length
                        === state.totalNumberOfNotifications && (
                        <p className="d-flex mb-1 mt-1 justify-content-center">
                          <b>{t(`${translationPath}yay-you-have-seen-it-all`)}</b>
                        </p>
                      ))
                      || undefined
                    }
                  >
                    {state.allNotifications
                      && state.allNotifications?.length > 0 && (
                      <ListGroup flush>
                        {state.allNotifications?.map((n, index) => (
                          <ListGroupItem
                            key={`allNotificationsKey${index + 1}`}
                            className="list-group-item-action"
                            onClick={() => sendReadNotification(n)}
                            // tag="a"
                            style={{
                              backgroundColor: `${
                                n.is_new ? 'rgb(173, 216, 230, 0.3)' : ''
                              }`,
                              cursor: n.link ? 'pointer' : 'auto',
                            }}
                            disabled={!n.link}
                          >
                            <div className="d-flex-v-center">
                              <div className="d-inline-flex">
                                <div
                                  className={`icon icon-shape ${
                                    state.evaColor[n?.image]
                                  } text-white rounded-circle shadow`}
                                >
                                  <i className={`${state.evaIcons[n?.image]}`} />
                                </div>
                              </div>
                              <div className="d-flex-column pl-2-reversed">
                                <div className="d-flex-v-center-h-between">
                                  <div className="d-inline-flex">
                                    <h4 className="mb-0 text-sm">{n?.title}</h4>
                                  </div>
                                  <div className="text-right text-nowrap w-50 pt-1 text-muted ml-1">
                                    <small className="align-item-center justify-content-center">
                                      {moment(n?.created_at)
                                        .locale(i18next.language)
                                        .fromNow()}
                                    </small>
                                  </div>
                                </div>
                                <p className="text-sm mb-0">{n?.description}</p>
                              </div>
                            </div>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    )}
                  </InfiniteScroll>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <Nav className="align-items-center" navbar>
            <UncontrolledDropdown nav>
              <ButtonBase className="branches-menu-btn is-user-toggle">
                <DropdownToggle
                  className="d-flex align-items-center user-menu-toggle"
                  color=""
                  tag="a"
                >
                  <LetterAvatar
                    alt="user-profile"
                    name={`${
                      (userReducer?.results?.user?.first_name?.[i18next.language]
                        && userReducer?.results?.user?.first_name?.[
                          i18next.language
                        ][0])
                      || (typeof userReducer?.results?.user?.first_name === 'string'
                        && userReducer?.results?.user?.first_name[0])
                      || userReducer?.results?.user?.first_name?.en
                      || ''
                    } ${
                      (userReducer?.results?.user?.last_name?.[i18next.language]
                        && userReducer?.results?.user?.last_name?.[
                          i18next.language
                        ][0])
                      || (typeof userReducer?.results?.user?.last_name === 'string'
                        && userReducer?.results?.user?.last_name[0])
                      || userReducer?.results?.user?.last_name?.en
                      || ''
                    }`}
                  />
                  <span className="text-overflow px-2">
                    {`${
                      (userReducer?.results?.user?.first_name?.[i18next.language]
                        && userReducer?.results?.user?.first_name?.[
                          i18next.language
                        ])
                      || (typeof userReducer?.results?.user?.first_name === 'string'
                        && userReducer?.results?.user?.first_name)
                      || userReducer?.results?.user?.first_name?.en
                      || ''
                    } ${
                      (userReducer?.results?.user?.last_name?.[i18next.language]
                        && userReducer?.results?.user?.last_name?.[i18next.language])
                      || (typeof userReducer?.results?.user?.last_name === 'string'
                        && userReducer?.results?.user?.last_name)
                      || userReducer?.results?.user?.last_name?.en
                      || ''
                    }`}
                  </span>
                </DropdownToggle>
              </ButtonBase>
              <DropdownMenu end={i18next.dir() !== 'rtl'}>
                <DropdownItem className="noti-title" header tag="div">
                  <p className="text-overflow m-0">
                    {t(`${translationPath}welcome`)}{' '}
                    {userReducer?.results?.user?.first_name?.[i18next.language]
                      || (typeof userReducer?.results?.user?.first_name === 'string'
                        && userReducer?.results?.user?.first_name)
                      || userReducer?.results?.user?.first_name?.en
                      || ''}
                    !
                  </p>
                </DropdownItem>
                {!userReducer?.results?.user?.is_provider && (
                  <>
                    <a
                      href={careerPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      color="link"
                    >
                      <DropdownItem>
                        <i className="fas fa-globe" />
                        <span>{t(`${translationPath}career-site`)}</span>
                      </DropdownItem>
                    </a>
                    <DropdownItem onClick={selfServiceHandler}>
                      <i className="fas fa-book" />
                      <span>{t(`${translationPath}self-service`)}</span>
                    </DropdownItem>
                  </>
                )}
                <DropdownItem onClick={() => setChangePasswordOpen(true)}>
                  <i className="fas fa-unlock-alt" />
                  <span>{t(`${translationPath}change-password`)}</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => logout()}>
                  <i className="fas fa-sign-out-alt" />
                  <span>{t(`${translationPath}logout`)}</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </div>
      </div>
      <DialogComponent
        dialogContent={
          <div className="d-flex-column-center px-4">
            <Inputs
              label="old-password"
              wrapperClasses="pb-3"
              themeClass="theme-solid"
              isSubmitted={isSubmitted}
              idRef="currentPasswordInputRef"
              parentTranslationPath="Shared"
              inputPlaceholder="old-password"
              translationPath={translationPath}
              value={changePasswordState.currentPassword}
              type={isShowPassword.currentPassword ? 'text' : 'password'}
              error={
                !changePasswordState.currentPassword
                || changePasswordState.currentPassword.length > 255
                || changePasswordState.currentPassword.length < 8
              }
              helperText={
                (!changePasswordState.currentPassword
                  ? t(`${translationPath}old-password-is-required`)
                  : '')
                || (changePasswordState.currentPassword > 255
                  ? `${t(
                    `${translationPath}the-old-password-can-not-be-more-than`,
                  )} ${255}`
                  : '')
                || (changePasswordState.currentPassword < 8
                  ? `${t(
                    `${translationPath}the-old-password-can-not-be-less-than`,
                  )} ${8}`
                  : '')
              }
              onInputChanged={(event) => {
                const { value } = event.target;
                setChangePasswordState((items) => ({
                  ...items,
                  currentPassword: value,
                }));
              }}
              endAdornment={
                <ButtonBase
                  className="btns-icon mx-2 theme-transparent"
                  onClick={() =>
                    setIsShowPassword((items) => ({
                      ...items,
                      currentPassword: !items.currentPassword,
                    }))
                  }
                >
                  <span
                    className={`c-gray-secondary-before far fa-${
                      (isShowPassword.currentPassword && 'eye-slash') || 'eye'
                    } px-2`}
                  />
                </ButtonBase>
              }
            />
            <Inputs
              label="new-password"
              wrapperClasses="pb-3"
              themeClass="theme-solid"
              isSubmitted={isSubmitted}
              idRef="newPasswordInputRef"
              parentTranslationPath="Shared"
              inputPlaceholder="new-password"
              translationPath={translationPath}
              value={changePasswordState.newPassword}
              type={isShowPassword.newPassword ? 'text' : 'password'}
              error={
                !changePasswordState.newPassword
                || changePasswordState.newPassword.length > 255
                || changePasswordState.newPassword.length < 8
              }
              helperText={
                (!changePasswordState.newPassword
                  ? t(`${translationPath}new-password-is-required`)
                  : '')
                || (changePasswordState.newPassword > 255
                  ? `${t(
                    `${translationPath}the-new-password-can-not-be-more-than`,
                  )} ${255}`
                  : '')
                || (changePasswordState.newPassword < 8
                  ? `${t(
                    `${translationPath}the-new-password-can-not-be-less-than`,
                  )} ${8}`
                  : '')
              }
              onInputChanged={(event) => {
                const { value } = event.target;
                setChangePasswordState((items) => ({
                  ...items,
                  newPassword: value,
                }));
              }}
              endAdornment={
                <ButtonBase
                  className="btns-icon mx-2 theme-transparent"
                  onClick={() =>
                    setIsShowPassword((items) => ({
                      ...items,
                      newPassword: !items.newPassword,
                    }))
                  }
                >
                  <span
                    className={`c-gray-secondary-before far fa-${
                      (isShowPassword.newPassword && 'eye-slash') || 'eye'
                    } px-2`}
                  />
                </ButtonBase>
              }
            />
            <Inputs
              wrapperClasses="pb-3"
              label="confirm-password"
              themeClass="theme-solid"
              isSubmitted={isSubmitted}
              parentTranslationPath="Shared"
              idRef="confirmPasswordInputRef"
              translationPath={translationPath}
              inputPlaceholder="confirm-password"
              value={changePasswordState.confirmPassword}
              type={isShowPassword.confirmPassword ? 'text' : 'password'}
              error={
                !changePasswordState.confirmPassword
                || changePasswordState.confirmPassword
                  !== changePasswordState.newPassword
              }
              helperText={
                (!changePasswordState.confirmPassword
                  ? t(`${translationPath}confirm-password-is-required`)
                  : '')
                || (changePasswordState.confirmPassword
                !== changePasswordState.newPassword
                  ? t(
                    `${translationPath}the-confirm-password-does-not-match-new-password`,
                  )
                  : '')
              }
              onInputChanged={(event) => {
                const { value } = event.target;
                setChangePasswordState((items) => ({
                  ...items,
                  confirmPassword: value,
                }));
              }}
              endAdornment={
                <ButtonBase
                  className="btns-icon mx-2 theme-transparent"
                  onClick={() =>
                    setIsShowPassword((items) => ({
                      ...items,
                      confirmPassword: !items.confirmPassword,
                    }))
                  }
                >
                  <span
                    className={`c-gray-secondary-before far fa-${
                      (isShowPassword.confirmPassword && 'eye-slash') || 'eye'
                    } px-2`}
                  />
                </ButtonBase>
              }
            />
          </div>
        }
        maxWidth="sm"
        isSaving={isLoading}
        isOpen={changePasswordOpen}
        parentTranslationPath="Shared"
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        onSubmit={changePasswordHandler}
        titleClasses="pl-3-reversed pb-2"
        translationPath={translationPath}
        dialogTitle={t(`${translationPath}change-password`)}
      />
      {notificationSettingsOpen && (
        <NotificationSettingsDialog
          isOpen={notificationSettingsOpen}
          setIsOpen={setNotificationSettingsOpen}
          parentTranslationPath="Shared"
        />
      )}
    </div>
  );
};

AdminNavbar.propTypes = {
  onIsOpenMobileMenuChange: PropTypes.func.isRequired,
  isOpenMobileMenu: PropTypes.bool.isRequired,
};

export default AdminNavbar;
