import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';
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

// Auth API

// Storage service
import { storageService } from 'utils/functions/storage';
import { useTranslation } from 'react-i18next';
// import { companyIdTypes } from '../../stores/types/companyIdTypes';
import { useTitle } from '../../hooks';
// import { updateToken } from '../../stores/actions/tokenActions';
import { GetUserVerification, ResetPasswordService } from '../../services';
import { showError, showSuccess } from '../../helpers';
import { onlyEnglishSmall } from '../../utils';

const translationPath = 'LoginView.';

/**
 * Class component that confirms registration
 */
export const RegistrationEmailConfirm = (props) => {
  const { t } = useTranslation('Shared');
  const history = useHistory();
  // const dispatch = useDispatch();
  const [state, setState] = useState({
    focusedEmail: true,
    error: false,
    loading: true,
    validToken: false,
    submitted: false,
  });

  useTitle('Validation');

  const getValidateToken = useCallback(async () => {
    setState((items) => ({ ...items, loading: true }));
    const response = await GetUserVerification({ key: props.match.params.token });
    if (response && response.status === 201)
      setState((items) => ({
        ...items,
        key: response.data.results.key,
        loading: false,
        validToken: true,
      }));
    else {
      showError(t(`${translationPath}token-verification-failed`), response);
      setState((items) => ({ ...items, loading: false, validToken: false }));
    }
    // authAPI
    //   .validateToken(props.match.params.token)
    //   .then((response) => {
    //     if (response.data.statusCode === 200) {
    //       // User
    //       localStorage.setItem('user', JSON.stringify(response.data));
    //
    //       // Permissions
    //       localStorage.setItem(
    //         'permissions',
    //         JSON.stringify(response.data.results.user.permissions)
    //       );
    //
    //       // Also store the token
    //       // noinspection JSCheckFunctionSignatures
    //       dispatch(
    //         updateToken({
    //           token: response.data.results?.token,
    //           tokenExpiry: response.data.results?.token_exp,
    //         })
    //       );
    //
    //       // Save the company ID to local storage
    //       dispatch({
    //         type: companyIdTypes.SUCCESS,
    //         payload: response.data.results.company_id,
    //       });
    //
    //       // Set default language to English
    //       localStorage.setItem('platform_language', 'en');
    //       // Set Redirect url
    //       localStorage.setItem('redirect_url', response?.data?.results?.redirect_to);
    //
    //       setState((items) => ({ ...items, loading: false, validToken: true }));
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
  }, [props.match.params.token, t]);

  useEffect(() => {
    getValidateToken();
  }, [getValidateToken]);

  // /**
  //  * Handle input change
  //  * @param event
  //  */
  // const handleInputChange = (event) => {
  //   event.preventDefault();
  //   setState((items) => ({
  //     ...items,
  //     [event.target.name]: event.target.value,
  //     error: false,
  //   }));
  // };

  /**
   * Handler form submission
   * @param event
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const { sub_domain, password, password_confirmation } = state;
    setState((items) => ({
      ...items,
      submitted: true,
    }));
    if (!onlyEnglishSmall.test(sub_domain))
      setState((items) => ({
        ...items,
        error: true,
        submitted: false,
        errorMssg: t('subdomain-description'),
        message: t('subdomain-description'),
      }));
    else {
      const response = await ResetPasswordService({
        key: state.key,
        sub_domain,
        password,
        password_confirmation,
      });
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
          submitted: false,
          errorMssg: response?.data?.message,
          message: response?.data?.message,
          errors: response?.data?.errors,
        }));
      }
    }
  };

  /**
   * Render JSX
   * @returns {JSX.Element}
   */
  return (
    <>
      <div>
        {state.loading && (
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
        )}
      </div>
      <div>
        {!state.validToken ? (
          <div className="main-content main-page login-view-wrapper">
            <Container className="content-wrapper">
              <div className="w-100 px-2">
                <div className="text-center">
                  <span>
                    <h1 className="text-white">
                      {t(`${translationPath}token-not-valid`)}
                    </h1>
                    {/*<p className="text-lead text-white">*/}
                    {/*  <Link*/}
                    {/*    to="/el/registration"*/}
                    {/*    style={{ color: 'violet', fontWeight: 'bold' }}*/}
                    {/*  >*/}
                    {/*    {t(`${translationPath}click-here-to-register-again`)}*/}
                    {/*  </Link>*/}
                    {/*</p>*/}
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
                    <h1 className="text-white">{t(`${translationPath}success`)}</h1>
                    <p className="text-lead text-white">
                      {t(`${translationPath}set-up-your-account`)}
                    </p>
                  </span>
                </div>
              </div>
              <div className="login-card-wrapper">
                <Card className="bg-secondary-old border-0 mb-0">
                  <CardBody className="px-md-4">
                    <div className="text-center text-muted mb-4">
                      <small>
                        {t(`${translationPath}please-fill-in-the-fields-bellow`)}
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
                            <i className="fas fa-server" />
                          </InputGroupText>
                          <Input
                            placeholder={t(`${translationPath}domain`)}
                            type="label"
                            name="sub_domain"
                            autoComplete=""
                            onBlur={() =>
                              setState((items) => ({
                                ...items,
                                focusedEmail: false,
                              }))
                            }
                            pattern="[a-z]{3}"
                            onChange={(event) => {
                              const {
                                target: { value },
                              } = event;
                              setState((items) => ({
                                ...items,
                                sub_domain: value,
                              }));
                            }}
                          />
                          <InputGroupText>
                            .{process.env.REACT_APP_ELEVATUS_DOMAIN}
                          </InputGroupText>
                        </InputGroup>
                        {state.errors && state.errors.sub_domain ? (
                          state.errors.sub_domain.length > 1 ? (
                            state.errors.sub_domain.map((error, index) => (
                              <p
                                key={`sub_domainErrorsKey${index + 1}`}
                                className="mb-0 mt-1 text-xs text-danger"
                              >
                                {error}
                              </p>
                            ))
                          ) : (
                            <p className="mb-0 mt-1 text-xs text-danger">
                              {state.errors.sub_domain}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </FormGroup>

                      <FormGroup
                        className={classnames('mb-3', {
                          focused: state.focusedEmail,
                        })}
                      >
                        <InputGroup>
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
                            onChange={(event) => {
                              const {
                                target: { value },
                              } = event;
                              setState((items) => ({
                                ...items,
                                password: value,
                              }));
                            }}
                          />
                        </InputGroup>
                        {state.errors && state.errors.password ? (
                          state.errors.password.length > 1 ? (
                            state.errors.password.map((error, index) => (
                              <p
                                key={`passwordErrors${index + 1}`}
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

                      <FormGroup
                        className={classnames('mb-3', {
                          focused: state.focusedEmail,
                        })}
                      >
                        <InputGroup>
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
                            onChange={(event) => {
                              const {
                                target: { value },
                              } = event;
                              setState((items) => ({
                                ...items,
                                password_confirmation: value,
                              }));
                            }}
                          />
                        </InputGroup>
                        {state.errors && state.errors.password_confirmation ? (
                          state.errors.password_confirmation.length > 1 ? (
                            state.errors.password_confirmation.map(
                              (error, index) => (
                                <p
                                  key={`errors${index + 1}`}
                                  className="mb-0 mt-1 text-xs text-danger"
                                >
                                  {error}
                                </p>
                              ),
                            )
                          ) : (
                            <p className="mb-0 mt-1 text-xs text-danger">
                              {state.errors.password_confirmation}
                            </p>
                          )
                        ) : (
                          ''
                        )}
                      </FormGroup>

                      <div style={{ color: 'red', fontSize: 'small' }}>
                        {state.error && state.errorMssg}
                      </div>

                      <div className="text-center">
                        <Button
                          className="my-4"
                          type="button"
                          onClick={handleFormSubmit}
                          color="primary"
                          disabled={state.submitted}
                        >
                          {state.submitted && (
                            <i className="fas fa-circle-notch fa-spin mr-2" />
                          )}
                          {`${
                            state.submitted
                              ? t(`${translationPath}saving`)
                              : t(`${translationPath}save`)
                          }`}
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
    </>
  );
};

export default RegistrationEmailConfirm;
