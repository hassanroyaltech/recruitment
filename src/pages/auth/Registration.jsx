// React and reactstrap
import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Container, Form, FormGroup } from 'reactstrap';

// Classnames
import classnames from 'classnames';

// Captcha
import ReCAPTCHA from 'react-google-recaptcha/lib/esm/recaptcha-wrapper';

// Legal
import PrivacyPolicy from 'components/Elevatus/PrivacyPolicy';
import TermOfUse from 'components/Elevatus/TermOfUse';

// Auth API
// import { authAPI } from 'api/auth';
import { useTranslation } from 'react-i18next';
import { CheckboxesComponent, Inputs } from '../../components';
import { useQuery, useTitle } from '../../hooks';
import { RegisterService } from '../../services';
import { showError } from '../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import { emailExpression } from '../../utils';

const translationPath = 'LoginView.';

// Main class component
const Registration = () => {
  const { t } = useTranslation('Shared');
  const query = useQuery();
  const [isAutomation, setIsAutomation] = useState(false);
  const [state, setState] = useState({
    focusedEmail: true,
    error: false,
    errorMssg: false,
    policy: false,
    policy_msg: '',
    submitted: false,
  });

  // handler for change in input
  const handleInputChange = (event) => {
    event.preventDefault();
    const { target } = event;
    setState((items) => ({
      ...items,
      [target.name]: target.value,
      error: false,
      successEmailSent: false,
    }));
  };

  // handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (
      !state.email
      || !state.email.match(emailExpression)
      || !state.first_name
      || !state.last_name
      || !state.company_name
    ) {
      setState((items) => ({
        ...items,
        errors: {
          ...(!state.first_name && {
            first_name: [t('this-field-is-required')],
          }),
          ...(!state.last_name && {
            last_name: [t('this-field-is-required')],
          }),
          ...(state.email
            && !state.email.match(emailExpression) && {
            email: [t('invalid-email')],
          }),
          ...(!state.email && {
            email: [t('this-field-is-required')],
          }),
          ...(!state.company_name && {
            company_name: [t('this-field-is-required')],
          }),
        },
      }));
      return;
    }
    if (!state.recaptcha && !isAutomation)
      setState((items) => ({
        ...items,
        recaptcha_msg:
          "The reCAPTCHA wasn't entered correctly. Go back and try it again.",
      }));

    if (!state.policy)
      setState((items) => ({
        ...items,
        policy_msg: 'You should agree o ur privacy policy',
      }));
    else {
      setState((items) => ({ ...items, policy_msg: '', submitted: true }));
      const { first_name, last_name, email, company_name } = state;
      // Get redirect_to item from local storage and pass it to Register API.
      // let param = null;
      // param = localStorage.getItem('redirect_to');
      const response = await RegisterService({
        first_name,
        last_name,
        email: email?.toLowerCase() || '',
        company: company_name,
      });
      if (response && response.status === 202)
        setState((items) => ({
          ...items,
          successEmailSent: true,
          submitted: false,
        }));
      else {
        showError(t('Shared:failed-to-register'), response);
        setState((items) => ({
          ...items,
          submitted: false,
        }));
      }
      // authAPI
      //   .register(first_name, last_name, email, company_name, param)
      //   .then((response) => {
      //     if (response.data.statusCode === 200)
      //
      //     else
      //       setState({
      //         ...state,
      //         submitted: false,
      //         // eslint-disable-next-line react/no-unused-state
      //         message: response.data?.message,
      //         errors: response.data?.errors,
      //       });
      //   })
      //   .catch((error) => {
      //     setState({
      //       ...state,
      //       submitted: false,
      //       // eslint-disable-next-line react/no-unused-state
      //       message: error?.response?.data?.message,
      //       errors: error?.response?.data?.errors,
      //     });
      //   });
    }
  };

  useTitle(t(`${translationPath}registration`));

  useEffect(() => {
    const localIsAutomation = query.get('is_automated');
    if (localIsAutomation === 'true') setIsAutomation(true);
  }, [query]);

  // Render JSX
  return (
    <div className="main-content main-page login-view-wrapper">
      <Container className="content-wrapper">
        {!state.successEmailSent ? (
          <>
            <div className="w-100 px-2">
              <div className="text-center">
                <span>
                  <h1 className="text-white">
                    {t(`${translationPath}create-an-account`)}
                  </h1>
                  <p className="text-lead text-white">
                    {t(`${translationPath}please-fill-in-the-fields-bellow`)}
                  </p>
                </span>
              </div>
            </div>
            <div className="login-card-wrapper">
              <Card className="bg-secondary-old border-0 mb-0">
                <CardBody className="px-lg-5 py-lg-5">
                  <div className="text-center text-muted mb-4">
                    <small>
                      {t(`${translationPath}sign-up-with-your-credentials`)}
                    </small>
                  </div>
                  <Form role="form">
                    <FormGroup
                      className={classnames('mb-3', {
                        focused: state.focusedEmail,
                      })}
                    >
                      <Inputs
                        idRef="registerFirstNameRef"
                        inputPlaceholder={t(`${translationPath}first-name`)}
                        themeClass="theme-solid-v3"
                        name="first_name"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedEmail: false,
                          }))
                        }
                        onInputChanged={handleInputChange}
                        startAdornment={
                          <span className="fa fa-user c-gray-before mx-2p85" />
                        }
                      />
                      {state.errors && state.errors.first_name ? (
                        state.errors.first_name.length > 1 ? (
                          state.errors.first_name.map((error, index) => (
                            <p
                              className="mb-0 mt-1 text-xs text-danger"
                              key={`firstNameKey${index + 1}`}
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="mb-0 mt-1 text-xs text-danger">
                            {state.errors.first_name}
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
                      <Inputs
                        idRef="registerLastNameRef"
                        inputPlaceholder={t(`${translationPath}last-name`)}
                        themeClass="theme-solid-v3"
                        name="last_name"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedEmail: false,
                          }))
                        }
                        onInputChanged={handleInputChange}
                        startAdornment={
                          <span className="fa fa-user c-gray-before mx-2p85" />
                        }
                      />
                      {state.errors && state.errors.last_name ? (
                        state.errors.last_name.length > 1 ? (
                          state.errors.last_name.map((error, index) => (
                            <p
                              key={`lastNameKey${index + 1}`}
                              className="mb-0 mt-1 text-xs text-danger"
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="mb-0 mt-1 text-xs text-danger">
                            {state.errors.last_name}
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
                      <Inputs
                        idRef="registerCompanyEmailRef"
                        inputPlaceholder={t(`${translationPath}company-name`)}
                        themeClass="theme-solid-v3"
                        name="company_name"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedEmail: false,
                          }))
                        }
                        onInputChanged={handleInputChange}
                        startAdornment={
                          <span className="far fa-building c-gray-before mx-2p85" />
                        }
                      />
                      {state.errors && state.errors.company_name ? (
                        state.errors.company_name.length > 1 ? (
                          state.errors.company_name.map((error, key) => (
                            <p key={key} className="mb-0 mt-1 text-xs text-danger">
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="mb-0 mt-1 text-xs text-danger">
                            {state.errors.company_name}
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
                      <Inputs
                        idRef="registerEmailRef"
                        inputPlaceholder={t(`${translationPath}email`)}
                        themeClass="theme-solid-v3"
                        name="email"
                        onInputBlur={() =>
                          setState((items) => ({
                            ...items,
                            focusedEmail: false,
                          }))
                        }
                        onInputChanged={handleInputChange}
                        startAdornment={
                          <span className="ni ni-email-83 c-gray-before mx-2p85" />
                        }
                      />
                      {state.errors && state.errors.email ? (
                        state.errors.email.length > 1 ? (
                          state.errors.email.map((error, key) => (
                            <p key={key} className="mb-0 mt-1 text-xs text-danger">
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

                    <div style={{ color: 'red', fontSize: 'small' }}>
                      {state.error && state.errorMssg}
                    </div>

                    <div className="pb-2 custom-control custom-control-alternative is-register-form">
                      <div className="text-muted font-12 privacy-policy-wrapper">
                        <div className="d-flex">
                          <div className="d-inline-flex pt-1">
                            <CheckboxesComponent
                              idRef="customCheckRegister"
                              singleChecked={state.policy}
                              onSelectedCheckboxChanged={() => {
                                setState((items) => ({
                                  ...items,
                                  policy: !items.policy,
                                }));
                              }}
                            />
                          </div>
                          <div className="d-inline-flex-v-center flex-wrap">
                            {t(`${translationPath}i-agree-with-the`)}{' '}
                            <ButtonBase
                              className="btns theme-transparent mx-1 p-0"
                              onClick={() => {
                                setState((items) => ({ ...items, PPModal: true }));
                              }}
                            >
                              {t(`${translationPath}privacy-policy`)}
                            </ButtonBase>
                            <span> {t(`${translationPath}and`)} </span>
                            <ButtonBase
                              className="btns theme-transparent mx-1 p-0"
                              onClick={() => {
                                setState((items) => ({ ...items, TOUModal: true }));
                              }}
                            >
                              {t(`${translationPath}terms-of-use`)}
                            </ButtonBase>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-danger policy-msg">
                        {state.policy_msg}
                      </span>
                    </div>

                    <div className="justify-content-center d-flex">
                      <ReCAPTCHA
                        sitekey={`${process.env.REACT_APP_GOOGLE_KEY}`}
                        onChange={(value) =>
                          setState((items) => ({ ...items, recaptcha: value }))
                        }
                      />
                      <p className="mb-0 mt-1 text-xs text-danger">
                        {state.recaptcha_msg}
                      </p>
                    </div>
                    <div className="text-center mt-2">
                      {(state.recaptcha || isAutomation) && (
                        <Button
                          type="button"
                          onClick={handleFormSubmit}
                          color="primary"
                          disabled={state.submitted}
                        >
                          {state.submitted && (
                            <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                          )}
                          {`${
                            state.submitted
                              ? t(`${translationPath}registering`)
                              : t(`${translationPath}register`)
                          }`}
                        </Button>
                      )}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </div>
            <PrivacyPolicy
              isOpen={state.PPModal}
              closeModal={() => {
                setState((items) => ({ ...items, PPModal: !items.PPModal }));
              }}
            />
            <TermOfUse
              isOpen={state.TOUModal}
              closeModal={() => {
                setState((items) => ({ ...items, TOUModal: !items.TOUModal }));
              }}
            />
          </>
        ) : (
          <div className="w-100 px-2">
            <div className="text-center">
              <span>
                <h1 className="text-white">
                  {t(`${translationPath}email-successfully-sent`)}!
                </h1>
                <p className="text-lead text-white">
                  {t(
                    `${translationPath}please-check-your-e-mail-for-further-instructions`,
                  )}
                  .
                  <br />{' '}
                  {t(
                    `${translationPath}follow-those-instructions-for-completing-the-registration-process`,
                  )}
                  .
                  <br /> {t(`${translationPath}thank-you`)}!
                </p>
              </span>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Registration;
