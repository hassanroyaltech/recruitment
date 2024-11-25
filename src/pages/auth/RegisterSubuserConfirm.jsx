// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from 'reactstrap';

// Storage service
import { storageService } from 'utils/functions/storage';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useQuery, useTitle } from '../../hooks';
import {
  GetUserNewVerification,
  GetUserVerification,
  ProviderSetPasswordService,
  ResetPasswordService,
  VerifyProviderKey,
} from '../../services';
import { showError, showSuccess } from '../../helpers';
import { useDispatch } from 'react-redux';
import { updateToken } from 'stores/actions/tokenActions';
import ButtonBase from '@mui/material/ButtonBase';

const translationPath = 'LoginView.';

/**
 * A class component that registers a subuser
 */
export const RegisterSubUser = (props) => {
  const { t } = useTranslation('Shared');
  const query = useQuery();
  const dispatch = useDispatch();
  const [isLoadingNewNotification, setIsLoadingNewNotification] = useState(false);

  useTitle(t(`${translationPath}confirmation`));
  const history = useHistory();
  const [state, setState] = useState({
    focusedEmail: true,
    error: false,
    loading: true,
    validToken: false,
    sub_user: '',
  });

  const validateToken = useCallback(async () => {
    const is_provider = query.get('is_provider');
    setState((items) => ({ ...items, loading: true }));
    const response = await (is_provider ? VerifyProviderKey : GetUserVerification)({
      key: props.match.params.token,
    });
    if (response && (response.status === 201 || response.status === 200)) {
      dispatch(
        updateToken({
          token: is_provider
            ? response.data.results.token
            : response.data.results.key,
          // tokenExpiry: results.token_expiry,
        }),
      );
      setState((items) => ({
        ...items,
        key: is_provider ? response.data.results.token : response.data.results.key,
        loading: false,
        validToken: true,
        sub_user: true,
      }));
      if (is_provider && response?.data?.results?.redirect_to === 'login')
        history.push('/el/login?is_provider=true'); // TODO: Test with other account to see if it redirects correctly
    } else {
      showError(t(`${translationPath}token-verification-failed`), response);
      setState((items) => ({
        ...items,
        loading: false,
        validToken: false,
        error: response,
        redirect_login:
          is_provider && response?.data?.detail === 'Key is used before!' && true,
      }));
    }
    // GetUserVerification
    //   .then((response) => {
    //     if (response.data.statusCode === 200) {
    //       // localStorage.setItem('user', JSON.stringify(response.data));
    //       localStorage.setItem(
    //         'permissions',
    //         JSON.stringify(response.data.results.user.permissions),
    //       );
    //       dispatch({
    //         type: companyIdTypes.SUCCESS,
    //         payload: response.data.results.company_id,
    //       });
    //       localStorage.setItem('platform_language', 'en');
    //       // Also store the token
    //       // noinspection JSCheckFunctionSignatures
    //       dispatch(
    //         updateToken({
    //           token: response.data.results?.token,
    //           tokenExpiry: response.data.results?.token_exp,
    //         }),
    //       );
    //       setState((items) => ({
    //         ...items,
    //         loading: false,
    //         validToken: true,
    //         sub_user: response.data.results.is_sub_user,
    //       }));
    //     } else
    //       setState((items) => ({
    //         ...items,
    //         loading: false,
    //         validToken: false,
    //       }));
    //   })
    //   .catch(() => {
    //     setState((items) => ({
    //       ...items,
    //       loading: false,
    //       validToken: false,
    //     }));
    //   });
  }, [dispatch, history, props.match.params.token, query, t]);

  useEffect(() => {
    void validateToken();
  }, [validateToken]);

  useEffect(() => {
    storageService.clearLocalStorage();
  }, [dispatch]);

  /**
   * Handler for input change
   * @param event
   */
  const handleInputChange = (event) => {
    event.preventDefault();
    const { target } = event;
    setState((items) => ({
      ...items,
      [target.name]: target.value,
      error: false,
    }));
  };

  /**
   * Handler to submit the form
   * @param event
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { password, password_confirmation } = state;
    if (password !== password_confirmation)
      setState((items) => ({
        ...items,
        loading: false,
        submitted: false,
        password_validation: t(`${translationPath}the-password-doesnt-match`),
      }));
    else if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@()$%^&*=_{}[\]:;"'|\\<>,./~`±§+-]).{8,30}$/.test(
        password,
      )
    ) {
      setState((items) => ({
        ...items,
        loading: true,
        submitted: true,
      }));

      const is_provider = query.get('is_provider');

      const response = await (is_provider
        ? ProviderSetPasswordService
        : ResetPasswordService)(
        is_provider
          ? {
            data: {
              password,
              password_confirmation,
            },
            headers: {
              Authorization: state.key,
              isSkipTokenCheck: true,
            },
          }
          : {
            key: state.key,
            password,
            password_confirmation,
          },
      );
      if (response && response.status === 200) {
        const url = localStorage.getItem('redirect_url');
        // First of all we clear all previous localStorage
        storageService.clearLocalStorage();
        showSuccess(t('account-created-successfully'));
        if (url === 'zoom') localStorage.setItem('redirect_to', 'zoom');

        // const user = JSON.parse(localStorage.getItem('user'));
        // user.results.list_company[0].url = data.results.url;
        // localStorage.setItem('user', JSON.stringify(user));
        history.push('/el/login');
      } else {
        showError(t('account-create-failed'), response);
        setState((items) => ({
          ...items,
          error: true,
          errorMssg: response?.data?.message,
        }));
      }
    } else
      setState((items) => ({
        ...items,
        loading: false,
        submitted: false,
        password_validation: t(`${translationPath}the-password-doesnt-match2`),
      }));
  };

  /**
   * @Description this method is to resend the notification after token expire or
   * doubly enter the page
   */
  const getUserNewVerificationHandler = useCallback(async () => {
    setIsLoadingNewNotification(true);
    const response = await GetUserNewVerification({ key: props.match.params.token });
    setIsLoadingNewNotification(false);
    if (response && response.status === 201) {
      showSuccess(t(`${translationPath}verification-email-resend-successfully`));
      history.push('/el/login');
    } else
      showError(t(`${translationPath}verification-email-resend-failed`), response);
  }, [history, props.match.params.token, t]);

  /**
   * Render JSX
   * @returns {JSX.Element}
   */
  return (
    (state.loading && (
      <div className="main-content main-page login-view-wrapper">
        <Container className="content-wrapper">
          <div className="w-100 px-2">
            <div className="text-center">
              <span>
                <h1 className="text-white">
                  {t(`${translationPath}token-validation-in-progress`)}
                </h1>
                <Spinner style={{ width: '3rem', height: '3rem' }} />{' '}
              </span>
            </div>
          </div>
        </Container>
      </div>
    )) || (
      <div>
        {!state.validToken ? (
          <div className="main-content main-page login-view-wrapper">
            <Container className="content-wrapper">
              <div className="w-100 px-2">
                <div className="text-center">
                  <span>
                    <h1 className="text-white">
                      {state.redirect_login ? (
                        <span>{t(`${translationPath}used-key-title`)}</span>
                      ) : (
                        <span>{t(`${translationPath}token-not-valid`)}</span>
                      )}
                      <span>!</span>
                    </h1>
                    <p className="text-lead text-white">
                      {t(
                        `${translationPath}${
                          state.redirect_login
                            ? 'used-key-desc'
                            : 'please-ask-your-company-to-repeat-the-registration-process'
                        }`,
                      )}
                    </p>
                    {(state.error?.status === 422
                      || state.error?.data?.identifiers?.statusCode === 406) && (
                      <div className="d-flex-center pt-3">
                        <ButtonBase
                          className="btns theme-solid bg-white c-black"
                          onClick={getUserNewVerificationHandler}
                          disabled={isLoadingNewNotification}
                        >
                          {t(`${translationPath}resend-verification-email`)}
                        </ButtonBase>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </Container>
          </div>
        ) : (
          <div className="main-content main-page login-view-wrapper">
            <Container className="content-wrapper">
              <div className="w-100 px-2">
                <div className="text-center">
                  <span>
                    <h1 className="text-white">
                      {t(`${translationPath}email-verified`)}
                    </h1>
                    <p className="text-lead text-white">
                      {t(
                        `${translationPath}finalizing-the-registration-process-now`,
                      )}
                    </p>
                  </span>
                </div>
              </div>
              <div className="login-card-wrapper">
                <Card className="bg-secondary-old border-0 mb-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>
                        {t(`${translationPath}set-up-your-new-password`)}
                      </small>
                    </div>
                    <Form role="form">
                      <FormGroup
                        className={classnames('mb-3', {
                          focused: state.focusedEmail,
                        })}
                      >
                        <InputGroup addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                          <Input
                            placeholder={t(`${translationPath}password`)}
                            type="password"
                            name="password"
                            autoComplete=""
                            onBlur={() =>
                              setState((items) => ({
                                ...items,
                                focusedEmail: false,
                              }))
                            }
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </FormGroup>

                      <FormGroup
                        className={classnames('mb-3', {
                          focused: state.focusedEmail,
                        })}
                      >
                        <InputGroup addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                          <Input
                            placeholder={t(`${translationPath}confirm-password`)}
                            type="password"
                            name="password_confirmation"
                            autoComplete=""
                            onBlur={() =>
                              setState((items) => ({
                                ...items,
                                focusedEmail: false,
                              }))
                            }
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </FormGroup>
                      {state.password_validation && (
                        <p className="m-o text-xs text-danger">
                          {state.password_validation}
                        </p>
                      )}
                      <div style={{ color: 'red', fontSize: 'small' }}>
                        {state.error && state.errorMssg}
                      </div>

                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="info"
                          type="button"
                          onClick={handleFormSubmit}
                        >
                          {t(`${translationPath}save`)}
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Container>
          </div>
        )}
      </div>
    )
  );
};

export default RegisterSubUser;
