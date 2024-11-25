// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, Container } from 'reactstrap';

import * as yup from 'yup';

// Auth API
import { useTranslation } from 'react-i18next';
import { useQuery, useTitle } from '../../hooks';
import { ResetPassword } from '../../services';
import { getErrorByName, showError } from '../../helpers';
import { emailExpression } from '../../utils';
import ButtonBase from '@mui/material/ButtonBase';
import { SharedInputControl } from '../setups/shared';
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from 'react-google-recaptcha';

const translationPath = 'LoginView.';

/**
 * This is the main component that resets a password
 * @returns {JSX.Element}
 */
const ForgetPassword = () => {
  const { t } = useTranslation('Shared');
  const [errors, setErrors] = useState(() => ({}));
  useTitle(t(`${translationPath}password-reset`));
  const query = useQuery();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAutomation, setIsAutomation] = useState(false);

  const [state, setState] = useState({
    submitted: false,
    loading: false,
    message: '',
    email: '',
    type: '',
    recaptcha: null,
    sending: false,
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   @Description this method is to get the errors list
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('Shared:invalid-email'),
              excludeEmptyString: true,
            })
            .required(t('Shared:this-field-is-required')),
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

  const handleSubmits = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setState((prevState) => ({
      ...prevState,
      loading: true,
      sending: true,
    }));

    const response = await ResetPassword({ email: state?.email?.toLowerCase() });
    if (response && response.status === 200)
      setState((prevState) => ({
        ...prevState,
        type: 'success',
        message: t(`${translationPath}reset-password-success-description`),
        loading: false,
      }));
    else {
      showError(t(`${translationPath}reset-password-error-description`), response);
      setState((prevState) => ({
        ...prevState,
        type: null,
        message: null,
        loading: false,
        sending: false,
      }));
    }
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    const localIsAutomation = query.get('is_automated');
    if (localIsAutomation === 'true') setIsAutomation(true);
  }, [query]);

  return (
    <div className="main-content main-page login-view-wrapper">
      <Container className="content-wrapper">
        <div className="w-100 px-2">
          <div className="text-center">
            <span>
              <h1 className="text-white">{t(`${translationPath}password-reset`)}</h1>
              <p className="text-lead text-white">
                {t(`${translationPath}password-reset-description`)}.
              </p>
            </span>
          </div>
        </div>
        <div className="login-card-wrapper">
          <Card className="bg-secondary-old border-0 mb-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <small>{t(`${translationPath}password-reset-description2`)}.</small>
              </div>

              {state.type === 'success' ? (
                <div className="alert alert-success">{state.message}</div>
              ) : state.type === 'error' ? (
                <div className="alert alert-danger">{state.message}</div>
              ) : null}
              <form name="form" noValidate onSubmit={handleSubmits}>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <SharedInputControl
                        editValue={state.email || ''}
                        onValueChanged={(e) =>
                          setState((items) => ({ ...items, [e.id]: e.value }))
                        }
                        stateKey="email"
                        errorPath="email"
                        errors={errors}
                        idRef="email"
                        labelValue="email"
                        startAdornment={
                          <div className="start-adornment-wrapper">
                            <span className="fas fa-envelope fz-22px" />
                          </div>
                        }
                        placeholder="email"
                        isSubmitted={isSubmitted}
                        isDisabled={state.loading}
                        isFullWidth
                        translationPath={translationPath}
                        parentTranslationPath="Shared"
                        wrapperClasses="mb-0"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex-center">
                  <span className="mt-3">
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

                <div className="row">
                  <div className="col text-right">
                    <ButtonBase
                      className="btns theme-solid my-4 w-100 mx-0"
                      type="submit"
                      disabled={state.sending}
                    >
                      {state.loading && (
                        <i className="fas fa-circle-notch fa-spin" />
                      )}
                      <span className="px-3">{t(`${translationPath}send`)}</span>
                    </ButtonBase>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default ForgetPassword;
