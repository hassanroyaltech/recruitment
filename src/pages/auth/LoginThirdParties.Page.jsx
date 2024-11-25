import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../setups/shared';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import {
  AfterLoginHandler,
  getErrorByName,
  GlobalHistory,
  showError,
} from '../../helpers';
import * as yup from 'yup';
import {
  GenerateSSOKey,
  ValidateAccountDomain,
  ValidateAccountNumber,
  ValidateThirdPartyToken,
} from '../../services';
import { ThirdPartiesEnum, ThirdPartiesLoginTypesEnum } from '../../enums';
import { Link, useParams } from 'react-router-dom';
import i18next from 'i18next';
import { useQuery } from '../../hooks';
import { useDispatch } from 'react-redux';

const parentTranslationPath = 'Shared';
const translationPath = 'LoginView.';
const LoginThirdPartiesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const query = useQuery();
  const params = useParams();
  const dispatch = useDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);
  const [accountNumber, setAccountNumber] = useState(null);
  const [domain, setDomain] = useState(null);
  const [account, setAccount] = useState(null);
  const isWorkingRef = useRef(false);
  const stateInitRef = useRef({
    account_number: null,
    login_type: ThirdPartiesLoginTypesEnum.Domain.key,
    domain: null,
    uuid: null,
    name: null,
    third_party: [],
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const thirdPartiesLoginTypesEnum = useMemo(
    () =>
      Object.values(ThirdPartiesLoginTypesEnum).map((item) => ({
        ...item,
        title: t(`${translationPath}${item.value}`),
      })),
    [t],
  );
  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          login_type: yup.string().required(),
          account_number: yup.string().when('login_type', {
            is: ThirdPartiesLoginTypesEnum.AccountNumber.key,
            then: yup.string().nullable().required(t('this-field-is-required')),
            otherwise: yup.string().nullable(),
          }),
          domain: yup.string().when('login_type', {
            is: ThirdPartiesLoginTypesEnum.Domain.key,
            then: yup.string().nullable().required(t('this-field-is-required')),
            otherwise: yup.string().nullable(),
          }),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const onThirdPartyClicked = useCallback(
    (item) => () => {
      window.location.href = item.login_url;
    },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is get the third party enum item
   */
  const getThirdPartyEnumItem = useMemo(
    () =>
      ({ key, path, providerParam, routeKey }) =>
        Object.values(ThirdPartiesEnum).find(
          (item) =>
            item.key === key
            || item.path === path
            || item.providerKey === providerParam
            || item.routeKey === routeKey,
        ) || {},
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the check for the account number
   */
  const getValidateAccountNumberAndDomain = useCallback(
    async ({ account_number, domain, account_uuid }) => {
      setIsLoading(true);
      const response = await (account_number
        ? ValidateAccountNumber
        : ValidateAccountDomain)({ account_number, domain, account_uuid });
      setIsLoading(false);
      if (response && response.status === 200) {
        setState({ id: 'edit', value: response.data.results });
        setIsChecked(true);
      } else {
        if (account_number) {
          showError(t(`${translationPath}invalid-account-number`), response);
          setAccountNumber((item) => (item ? null : item));
        }
        if (domain) {
          showError(t(`${translationPath}invalid-domain`), response);
          setDomain((item) => (item ? null : item));
        }
        if (account_uuid) {
          showError(t(`${translationPath}invalid-account`), response);
          setAccount((item) => (item ? null : item));
        }
      }
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    await getValidateAccountNumberAndDomain({
      account_number: state.account_number,
      domain: state.domain,
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle redirect to self-service if the third party come from self-service
   */
  const selfServiceHandler = useCallback(
    async (result) => {
      const firstAvailableCompany
        = (result.data.results.companies
          && result.data.results.companies.length > 0
          && result.data.results.companies.find((item) => item.can_access))
        || null;
      if (!firstAvailableCompany) {
        setIsLoading(false);
        t('Shared:dont-have-permissions');
        return;
      }
      const response = await GenerateSSOKey({
        account_uuid: result.data.results.account_uuid,
        company_uuid: firstAvailableCompany.uuid,
        token: result.data.results.token,
        isSkipTokenCheck: true,
      });
      setIsLoading(false);
      if (response && response.status === 201) {
        const { results } = response.data;

        window.location.href = `${
          process.env.REACT_APP_SELFSERVICE_URL
        }/accounts/login?token_key=${results.key}&account_uuid=${
          result.data.results.account_uuid
        }${
          result.data.results.uuid ? `&user_uuid=${result.data.results.uuid}` : ''
        }`;
      } else if (!response || response.message)
        showError(
          response?.message
            || t(`${translationPath}signup-requirements-update-failed`),
        );
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the verification for code (token)
   * of the third party account then login if valid
   */
  const validateThirdPartyToken = useCallback(
    async ({ code, queryState, provider, providerParam, session_state }) => {
      if (isWorkingRef.current) return;
      isWorkingRef.current = true;
      setIsLoading(true);
      const response = await (providerParam
        ? getThirdPartyEnumItem({ routeKey: providerParam }).validationApi
        : ValidateThirdPartyToken)({
        code,
        queryState,
        provider,
        session_state,
      });
      if (response && response.status === 200)
        if (response.data.results.is_portal === false)
          await selfServiceHandler(response);
        else {
          setIsLoading(false);
          await AfterLoginHandler({
            response,
            // isRedirect: false,
            translationPath,
            t,
            setState,
            state,
            dispatch,
            query,
          });
        }
      else {
        setIsLoading(false);
        showError(t(`${translationPath}third-party-login-failed`), response);
        GlobalHistory.push('/el/login');
      }
    },
    [dispatch, getThirdPartyEnumItem, query, selfServiceHandler, state, t],
  );

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    const code = query.get('code');
    const provider = getThirdPartyEnumItem({ path: window.location.pathname }).key;
    const providerParam = params.providerKey || null;
    const session_state = query.get('session_state');
    const queryState = query.get('state');

    if (code && (provider || providerParam) && queryState) {
      setIsVerifyingToken(true);
      validateThirdPartyToken({
        code,
        queryState,
        provider: +provider,
        providerParam: providerParam,
        session_state,
      });
    } else if (provider || session_state || queryState) {
      showError(t(`${translationPath}third-party-login-failed`));
      GlobalHistory.push('/el/login');
    }
  }, [getThirdPartyEnumItem, params.providerKey, query, t, validateThirdPartyToken]);

  useEffect(() => {
    const account_number = query.get('account_number');
    const account_uuid = query.get('domain_account_uuid');
    const locale_domain = query.get('domain');
    if (account_number) {
      setAccountNumber(+account_number);
      void getValidateAccountNumberAndDomain({ account_number: +account_number });
    }
    if (locale_domain) {
      setDomain(locale_domain);
      void getValidateAccountNumberAndDomain({ domain: locale_domain });
    }
    if (account_uuid) {
      setAccount(account_uuid);
      void getValidateAccountNumberAndDomain({ account_uuid });
    }
  }, [getValidateAccountNumberAndDomain, query]);

  return (
    <div className="main-content main-page login-view-wrapper">
      <form noValidate onSubmit={saveHandler} className="content-wrapper">
        <div className="w-100 px-2">
          <div>
            <span className="d-flex-column-center">
              <h1 className="text-white">{t(`${translationPath}welcome`)}!</h1>
              <p className="text-lead text-white">
                {t(`${translationPath}login-description`)}.
              </p>
            </span>
          </div>
        </div>
        <div className="login-card-wrapper">
          <Card className="card border-0 mb-0">
            <div className="card-body d-flex flex-wrap px-lg-5 py-lg-5">
              <div className="d-flex-center text-muted mb-4">
                <small>{t(`${translationPath}sign-in-with-third-party`)}</small>
              </div>
              {(!isChecked && (
                <div className="d-flex flex-wrap">
                  {!accountNumber && !domain && !account && (
                    <SharedAutocompleteControl
                      isFullWidth
                      searchKey="search"
                      initValuesKey="key"
                      initValuesTitle="title"
                      initValues={thirdPartiesLoginTypesEnum}
                      stateKey="login_type"
                      onValueChanged={({ value }) => {
                        onStateChanged({
                          id: 'destructObject',
                          value: {
                            login_type: value,
                            domain: null,
                            account_number: null,
                          },
                        });
                      }}
                      title="login-type"
                      editValue={state.login_type}
                      placeholder="login-type"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      getOptionLabel={(option) => option.title}
                      disableClearable
                    />
                  )}
                  {!accountNumber
                    && state.login_type
                      === ThirdPartiesLoginTypesEnum.AccountNumber.key && (
                    <SharedInputControl
                      errors={errors}
                      isFullWidth
                      title="account-number"
                      isSubmitted={isSubmitted}
                      stateKey="account_number"
                      type="number"
                      isDisabled={isLoading}
                      min={0}
                      errorPath="account_number"
                      onValueChanged={onStateChanged}
                      editValue={state.account_number}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  )}
                  {!domain
                    && !account
                    && state.login_type === ThirdPartiesLoginTypesEnum.Domain.key && (
                    <SharedInputControl
                      errors={errors}
                      isFullWidth
                      title="domain"
                      isSubmitted={isSubmitted}
                      stateKey="domain"
                      isDisabled={isLoading}
                      errorPath="domain"
                      onValueChanged={onStateChanged}
                      editValue={state.domain}
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                    />
                  )}
                  <div className="d-flex-v-center-h-end mb-2">
                    <Link to="/el/login">
                      <span className="font-12 text-info">
                        {t(`${translationPath}back-to-login`)}
                      </span>
                    </Link>
                  </div>
                  <div className="d-flex-center">
                    <ButtonBase
                      className="btns theme-solid"
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading && (
                        <span className="fas fa-circle-notch fa-spin mr-2-reversed" />
                      )}
                      <span>
                        {t(
                          `${translationPath}${
                            isVerifyingToken
                              ? (isLoading && 'signing-in') || 'sign-in'
                              : (isLoading && 'verifying') || 'verify'
                          }`,
                        )}
                      </span>
                    </ButtonBase>
                  </div>
                </div>
              )) || (
                <div className="d-flex flex-wrap">
                  {state.name && (
                    <div className="d-flex-center flex-wrap mb-3">
                      <div className="header-text mb-2">
                        <span>{t(`${translationPath}welcome`)}</span>
                        <span className="px-1">
                          {state.name[i18next.language] || state.name.en}
                        </span>
                      </div>
                      {state.third_party.length > 0 && (
                        <div className="description-text fz-14px">
                          <span>
                            {t(`${translationPath}third-party-welcome-description`)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {(state.third_party.length > 0 && (
                    <div className="d-flex flex-wrap">
                      {state.third_party.map((item, index) => (
                        <div
                          key={`thirdPartyKey${item.provider_number}${index + 1}`}
                          className="d-flex flex-wrap mb-3"
                        >
                          <ButtonBase
                            className="btns theme-solid w-100"
                            style={{
                              backgroundColor: getThirdPartyEnumItem({
                                key: item.provider_number,
                                providerParam: item.provider_key,
                              }).color,
                            }}
                            onClick={onThirdPartyClicked(item)}
                          >
                            <span
                              className={
                                getThirdPartyEnumItem({
                                  key: item.provider_number,
                                  providerParam: item.provider_key,
                                }).icon
                              }
                            />
                            <span className="px-2">
                              {(getThirdPartyEnumItem({
                                key: item.provider_number,
                                providerParam: item.provider_key,
                              }).value
                                && t(
                                  `${translationPath}${
                                    getThirdPartyEnumItem({
                                      key: item.provider_number,
                                      providerParam: item.provider_key,
                                    }).value
                                  }`,
                                ))
                                || item.name}
                            </span>
                          </ButtonBase>
                        </div>
                      ))}
                    </div>
                  )) || (
                    <div className="d-flex-center flex-wrap pt-3">
                      <div className="mb-3">
                        {t(`${translationPath}no-partners-description`)}
                      </div>
                    </div>
                  )}
                  <div className="d-flex-v-center-h-end">
                    <Link to="/el/login">
                      <span className="font-12 text-info">
                        {t(`${translationPath}back-to-login`)}
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default LoginThirdPartiesPage;
