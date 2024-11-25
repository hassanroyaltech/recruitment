// React and Reactstrap
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Auth API
// import { authAPI } from 'api/auth';

// Storage service
import { Backdrop, ButtonBase, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent } from '../../components';
// import { userSubscription } from '../../stores/types/userSubscription';
import { useQuery, useTitle } from '../../hooks';
import { companyIdTypes } from '../../stores/types/companyIdTypes';
import { LoginService, ValidateSSOKey } from '../../services';
import { updateSelectedBranch } from '../../stores/actions/selectedBranchActions';
import {
  AfterLoginHandler,
  getErrorByName,
  getLoginRedirectEnum,
  GlobalHistory,
  SetGlobalFullAccess,
  showError,
} from '../../helpers';
import { SelectedBranchTypes } from '../../stores/types/SelectedBranchTypes';
import { tokenTypes } from 'stores/types/tokenTypes';
import moment from 'moment';
import { VerifyUserDevice } from '../../services/SetupsLinkedDevices.Services';
import VerifyCodeApp from './VerifyCodeApp';
import { GenerateCodeByEmail } from '../../services/SetupsEmailBasedAuthentication.Services';
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from 'react-google-recaptcha';
import * as yup from 'yup';
import { SharedInputControl } from '../setups/shared';
import { LogoutHelper } from '../../helpers/Logout.Helper';

const translationPath = 'LoginView.';
// Main class component
const Login = ({ email, password }) => {
  const { t } = useTranslation('Shared');
  useTitle(t(`${translationPath}login`));
  const query = useQuery();
  const isInitRef = useRef(true);
  const [isAutomation, setIsAutomation] = useState(false);
  const [backDropLoader, setBackDropLoader] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const tokenReducer = useSelector((state) => state.tokenReducer);
  const dispatch = useDispatch();
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const userReducer = useSelector((state) => state.userReducer);
  const [errors, setErrors] = useState(() => ({}));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useState({
    email,
    password,
    isRememberMe: localStorage.getItem('isRememberMe') || false,
    recaptcha: null,
    focusedEmail: true,
    error: false,
  });
  const stateRef = useRef(null);
  const [codeType, setCodeType] = useState({
    visibility: false,
    type: '',
  });
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);

  // Handler for form submission
  const handleFormSubmit = async (event) => {
    // Prevent page refresh
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    // Get redirect_to item from local storage and pass it to Login API.
    const param = localStorage.getItem('redirect_to');
    // Set the submitted state to true
    setState((items) => ({
      ...items,
      submitted: true,
    }));

    const verifyUserDeviceRes = await VerifyUserDevice({
      email: state.email?.trim() || '',
    });
    if (verifyUserDeviceRes && verifyUserDeviceRes.status === 200)
      if (
        (verifyUserDeviceRes.data.results.mfa_enabled
          && verifyUserDeviceRes.data.results.verified
          && verifyUserDeviceRes.data.results.has_authenticator_app)
        || !verifyUserDeviceRes.data.results.mfa_enabled
      ) {
        // Execute login API function
        // const auth = new authAPI();
        // const data = auth.login(email, password);
        // const api = AuthAPI();
        const res = await LoginService({
          ...state,
          ...param,
          email: state.email?.toLowerCase() || '',
        });
        if (res && res.status === 200) {
          window?.ChurnZero?.push([
            'trackEvent',
            'Login Users/Employees',
            'Users/Employees login',
            1,
            {},
          ]);
          await AfterLoginHandler({
            response: res,
            // isRedirect: false,
            branch_uuid: query.get('branch_uuid'),
            translationPath,
            t,
            setState,
            state,
            dispatch,
            query,
            setBackDropLoader,
            afterSuccessfullyLogin: null,
            verifyUserDeviceRes: verifyUserDeviceRes,
          });
        } else {
          setState((items) => ({
            ...items,
            submitted: false,
            // message: error?.data?.message,
            errors: res?.data?.errors,
            error: true,
          }));

          if (res && res.status === 401) showError('', res);
        }
      } else if (
        verifyUserDeviceRes.data.results.mfa_enabled
        && verifyUserDeviceRes.data.results.verified
      ) {
        // Execute login API function
        // const auth = new authAPI();
        // const data = auth.login(email, password);
        // const api = AuthAPI();
        const res = await LoginService({
          ...state,
          ...param,
          email: state.email?.toLowerCase() || '',
        });
        if (res && res.status === 200)
          await AfterLoginHandler({
            response: res,
            // isRedirect: false,
            branch_uuid: query.get('branch_uuid'),
            translationPath,
            t,
            setState,
            state,
            dispatch,
            query,
            setBackDropLoader,
            afterSuccessfullyLogin: () =>
              window.location.assign('/setups/security/Authenticator-app-setup'),
            verifyUserDeviceRes: verifyUserDeviceRes,
          });
        else {
          setState((items) => ({
            ...items,
            submitted: false,
            // message: error?.data?.message,
            errors: res?.data?.errors,
            error: true,
          }));

          if (res && res.status === 401) showError('', res);
        }
      } else if (
        verifyUserDeviceRes.data.results.mfa_enabled
        && !verifyUserDeviceRes.data.results.has_authenticator_app
      ) {
        setCodeType({
          visibility: true,
          type: 'email',
          verifyUserDeviceRes: verifyUserDeviceRes,
        });
        await GenerateCodeByEmail({
          email: state.email?.toLowerCase() || '',
        });
      } else
        setCodeType({
          visibility: true,
          type: 'authenticator-app-code',
        });
    else {
      setState((items) => ({
        ...items,
        submitted: false,
        errors: verifyUserDeviceRes?.data?.errors,
        error: true,
      }));
      showError(
        verifyUserDeviceRes?.data?.message || '',
        !verifyUserDeviceRes?.data?.message && verifyUserDeviceRes,
      );
    }
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   @Description this method is to get the error's list
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          email: yup
            .string()
            .nullable()
            // .matches(emailExpression, {
            //   message: t('Shared:invalid-email'),
            //   excludeEmptyString: true,
            // })
            .required(t('Shared:this-field-is-required')),
          password: yup.string().nullable().required(t('this-field-is-required')),
          // .min(8, t(`${translationPath}must-be-more-than-8-characters-long`))
          // .matches(
          //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
          //     t(`${translationPath}password-pattern-description`)
          // ),
          recaptcha: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value || isAutomation,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [isAutomation, state, t]);

  const loginAndRedirectHandler = useCallback(
    async (ssoKey, branch_uuid) => {
      setBackDropLoader(true);
      const response = await ValidateSSOKey(ssoKey);
      if (response && (response.status === 200 || response.status === 201))
        await AfterLoginHandler({
          response,
          // isRedirect: true,
          branch_uuid,
          translationPath,
          t,
          setState,
          state: stateRef.current,
          dispatch,
          query,
          setBackDropLoader,
          afterSuccessfullyLogin: null,
          verifyUserDeviceRes: null,
        });
      else setBackDropLoader(false);
    },
    [dispatch, query, t],
  );

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // to handle provider users, redirect
  useEffect(() => {
    if (
      tokenReducer?.token
      && tokenReducer.reducer_status === tokenTypes.SUCCESS
      && userReducer?.results?.user?.is_provider
      && (selectedBranchReducer
        || (!accountReducer.account_uuid && !selectedBranchReducer))
    )
      if (userReducer?.results?.user?.member_type === 'member')
        GlobalHistory.push('/provider/profile');
      else GlobalHistory.push('/provider/overview');
  }, [selectedBranchReducer, userReducer, accountReducer, tokenReducer]);

  // to handle when user has no branch (without access to any branch)
  useEffect(() => {
    if (
      selectedBranchReducer
      && selectedBranchReducer.reducer_status === SelectedBranchTypes.FAILED
    )
      setState((items) => ({
        ...items,
        submitted: false,
      }));
  }, [selectedBranchReducer]);
  // to handle clear token when user not remembers me & without login key in the url
  useEffect(() => {
    if (!isInitRef.current) return;
    isInitRef.current = false;
    if (
      !localStorage.getItem('isRememberMe')
      && !query.get('token_key')
      && !query.get('key')
    ) 
      LogoutHelper(true);
    else if (
      !query.get('token_key')
      && GlobalHistory
      && !query.get('key')
      && tokenReducer?.token
      && tokenReducer.reducer_status === tokenTypes.SUCCESS
    )
      GlobalHistory.push('/recruiter/overview');
  }, [dispatch, query, tokenReducer?.reducer_status, tokenReducer?.token]);

  // to handle the redirect to the overview page when this user is already login
  useEffect(() => {
    const key = query.get('token_key');
    const branch_uuid = query.get('branch_uuid');
    const user_uuid = userReducer?.results?.user?.uuid || null;
    if (key) {
      const isExpired
        = !localStorage.getItem('token')
        || moment().isAfter(
          moment
            .unix(JSON.parse(localStorage.getItem('token'))?.tokenExpiry)
            .format(),
        );
      if (isExpired || !user_uuid || !localStorage.getItem('permissionsReducer'))
        loginAndRedirectHandler(key, branch_uuid);
      else {
        SetGlobalFullAccess(
          JSON.parse(localStorage.getItem('permissionsReducer'))?.full_access,
        );
        // const tokenLocal = JSON.parse(localStorage.getItem('token'));
        // if (tokenLocal)
        //   localStorage.setItem('token',JSON.stringify({
        //     reducer_status: tokenTypes.SUCCESS,
        //     token: tokenLocal.token,
        //     tokenExpiry: tokenLocal.token_expiry,
        //   }));
        if (branch_uuid) {
          // if the branch is sent in the url then update current branch value
          const branchesList = JSON.parse(localStorage.getItem('branches'));
          const selectedBr = branchesList.results.find(
            (b) => b.uuid === branch_uuid,
          );
          dispatch({
            type: companyIdTypes.SUCCESS,
            payload: branch_uuid || null,
          });
          dispatch(updateSelectedBranch(selectedBr || null));
        }
        let queriesString = '';
        Array.from(query.entries()).forEach(([key, value]) => {
          if (key !== 'token_key' && key !== 'redirect_path')
            queriesString = `${queriesString}${
              (queriesString && '&') || ''
            }${key}=${value}`;
        });
        const localRedirectPage = query.get('redirect_path');
        const redirect_to = (!localRedirectPage && query.get('redirect_to')) || null;

        if (localRedirectPage)
          GlobalHistory.push(
            `${localRedirectPage}${(queriesString && '?' + queriesString) || ''}`,
          );
        else if (redirect_to) {
          const loginRedirectEnum = getLoginRedirectEnum(redirect_to);
          if (loginRedirectEnum) GlobalHistory.push(loginRedirectEnum.path());
        } else
          GlobalHistory.push(
            `/recruiter/overview${(queriesString && '?' + queriesString) || ''}`,
          );
      }
    }
  }, [dispatch, loginAndRedirectHandler, query, userReducer?.results?.user?.uuid]);

  // this to call error's updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // to get the automation
  useEffect(() => {
    const localIsAutomation = query.get('is_automated');
    if (localIsAutomation === 'true') setIsAutomation(true);
  }, [query]);
  /**
   * Render JSX
   * @returns {JSX.Element}
   */
  return (
    <>
      <div className="main-content main-page login-view-wrapper">
        <Backdrop
          className="spinner-wrapper"
          style={{ zIndex: 9999 }}
          open={backDropLoader}
        >
          <CircularProgress color="inherit" size={50} />
        </Backdrop>
        <Container className="content-wrapper">
          <div className="w-100 px-2">
            <div className="text-center">
              <span>
                <h1 className="text-white">{t(`${translationPath}welcome`)}!</h1>
                <p className="text-lead text-white">
                  {t(`${translationPath}login-description`)}.
                </p>
              </span>
            </div>
          </div>
          {!codeType.visibility && (
            <div className="login-card-wrapper">
              <Card className="border-0 mb-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>
                      {t(`${translationPath}sign-in-with-your-credentials`)}
                    </small>
                  </div>
                  <Form role="form" onSubmit={handleFormSubmit}>
                    <FormGroup
                      className={classnames('mb-3', {
                        focused: state.focusedEmail,
                      })}
                    >
                      <SharedInputControl
                        editValue={state.email}
                        placeholder="email"
                        stateKey="email"
                        errorPath="email"
                        errors={errors}
                        isSubmitted={isSubmitted}
                        isDisabled={state.submitted}
                        wrapperClasses="px-0 mb-0"
                        translationPath={translationPath}
                        parentTranslationPath="Shared"
                        isFullWidth
                        themeClass="theme-solid-v3"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedEmail: false,
                          }))
                        }
                        onValueChanged={({ value }) => {
                          setState((items) => ({
                            ...items,
                            email: value,
                            error: false,
                          }));
                        }}
                        startAdornment={
                          <span className="ni ni-email-83 c-gray-before mx-2p85" />
                        }
                      />
                      {/*</InputGroup>*/}
                      {state.errors && state.errors.email ? (
                        state.errors.email.length > 1 ? (
                          state.errors.email.map((error, key) => (
                            <p
                              key={`emailErrorsKey${key + 1}`}
                              className="mb-0 mt-1 text-xs text-danger"
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="mb-0 mt-1 text-xs text-danger">
                            {state.errors.email}
                          </p>
                        )
                      ) : (
                        ''
                      )}
                    </FormGroup>
                    <FormGroup
                      className={classnames({
                        focused: state.focusedPassword,
                      })}
                    >
                      <SharedInputControl
                        type={(isShowPassword && 'text') || 'password'}
                        editValue={state.password}
                        placeholder="password"
                        errors={errors}
                        errorPath="password"
                        stateKey="password"
                        isSubmitted={isSubmitted}
                        isDisabled={state.submitted}
                        themeClass="theme-solid-v3"
                        wrapperClasses="px-0"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedPassword: false,
                          }))
                        }
                        onValueChanged={({ value }) => {
                          setState((items) => ({
                            ...items,
                            password: value,
                            error: false,
                          }));
                        }}
                        parentTranslationPath="Shared"
                        translationPath={translationPath}
                        startAdornment={
                          <span className="ni ni-lock-circle-open c-gray-before mx-2p85" />
                        }
                        endAdornment={
                          <ButtonBase
                            className="btns-icon mx-2 theme-transparent"
                            onClick={() => setIsShowPassword((items) => !items)}
                          >
                            <span
                              className={`c-gray-secondary-before far fa-${
                                (isShowPassword && 'eye-slash') || 'eye'
                              } px-2`}
                            />
                          </ButtonBase>
                        }
                      />
                      {state.errors && state.errors.password ? (
                        state.errors.password.length > 1 ? (
                          state.errors.password.map((error, key) => (
                            <p
                              key={`passwordErrorsKey${key + 1}`}
                              className="mb-0 mt-1 text-xs text-danger"
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="mb-0 mt-1 text-xs text-danger">
                            {state.errors.password}
                          </p>
                        )
                      ) : (
                        ''
                      )}
                    </FormGroup>
                    <p className="mb-0 mt-1 text-xs text-danger">{state.message}</p>
                    <Row>
                      <Col xl={6}>
                        <div className="ml-1-reversed">
                          <CheckboxesComponent
                            idRef="rememberMeLoginRef"
                            label={t(`${translationPath}remember-me`)}
                            singleChecked={state.isRememberMe}
                            onSelectedCheckboxChanged={(event, checked) => {
                              setState((items) => ({
                                ...items,
                                isRememberMe: checked,
                              }));
                            }}
                          />
                        </div>
                      </Col>
                      <Col xl={6} className="d-inline-flex-v-center-h-end">
                        <Link to="/el/forget-password">
                          <span className="font-12 text-info">
                            {t(`${translationPath}forget-password`)}
                          </span>
                        </Link>
                      </Col>
                    </Row>
                    <div className="d-flex-center my-3">
                      <span>
                        <ReCAPTCHA
                          sitekey={`${process.env.REACT_APP_GOOGLE_KEY}`}
                          onChange={(value) =>
                            setState((items) => ({ ...items, recaptcha: value }))
                          }
                        />
                        {errors.recaptcha && isSubmitted && (
                          <span className="c-error fz-10 mb-3">
                            {errors.recaptcha.message}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-center mt-2">
                      <Button
                        type="submit"
                        color="primary"
                        disabled={state.submitted}
                      >
                        {state.submitted && (
                          <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                        )}
                        {`${
                          state.submitted
                            ? ` ${t(`${translationPath}signing-in`)}`
                            : ` ${t(`${translationPath}sign-in`)}`
                        }`}
                      </Button>
                    </div>
                    <div className="d-flex-center py-2">
                      {t(`${translationPath}or`)}
                    </div>
                    <div className="d-flex-center">
                      <Link to="/el/login-third-parties">
                        <span className="font-12 text-info">
                          {t(`${translationPath}sign-in-with-third-party`)}
                        </span>
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
          )}
          {codeType.visibility && (
            <VerifyCodeApp
              state={state}
              setState={setState}
              codeType={codeType}
              query={query}
              dispatch={dispatch}
              setBackDropLoader={setBackDropLoader}
            />
          )}
        </Container>
      </div>
    </>
  );
};

Login.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
};
Login.defaultProps = {
  email: '',
  password: '',
};
export default Login;
