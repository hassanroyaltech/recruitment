// React
import React, { useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Card, CardBody, Spinner, Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useTitle } from '../../hooks';
import { ChangePassword } from '../../services';
import { GlobalHistory, showError, showSuccess } from '../../helpers';

const translationPath = 'LoginView.';

/**
 * Main component to confirm password
 * @param params
 * @returns {JSX.Element}
 */
const ConfirmPassword = ({ match: { params } }) => {
  const { t } = useTranslation('Shared');
  /**
   * ValidationSchema for the form
   */
  const ValidationSchema = useRef(
    Yup.object().shape({
      password: Yup.string()
        .required(t('this-field-is-required'))
        .min(8, t(`${translationPath}must-be-more-than-8-characters-long`))
        .matches(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/,
          t(`${translationPath}password-pattern-description`),
        ),
      password_confirmation: Yup.string()
        .required(t('this-field-is-required'))
        .oneOf(
          [Yup.ref('password'), null],
          t(`${translationPath}passwords-must-match`),
        ),
    }),
  );

  const [state, setState] = useState({
    loading: false,
    message: '',
    type: '',
    verified: true,
    working: false,
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      password_confirmation: '',
    },
    onSubmit: () => {
      confirmNewPassword();
    },
    validationSchema: ValidationSchema.current,
  });
  const { errors, touched, values, handleChange, handleSubmit, dirty } = formik;
  const confirmNewPassword = async () => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const response = await ChangePassword({
      key: params.token,
      ...values,
    });
    if (response && response.status === 200) {
      showSuccess(response.data.message);
      GlobalHistory.push('/el/login');
    } else {
      showError('', response);
      setState((prevState) => ({
        ...prevState,
        type: 'error',
        message: response && response.data.message,
        errors: response && response.data.reason,
        loading: false,
        verified: !(
          response
          && response.data.reason
          && response.data.reason.length > 0
          && response.data.reason[0].field === 'key'
        ),
      }));
      // Remove password values
      values.password = '';
      values.password_confirmation = '';
    }
  };

  useTitle(t(`${translationPath}confirm-password`));

  return (
    <>
      {state.working ? (
        <div className="main-content main-page login-view-wrapper">
          <Container className="content-wrapper">
            <div className="w-100">
              <div className="text-center">
                <span>
                  <h1 className="text-white mt-2">
                    {t(`${translationPath}link-verification-in-progress`)}
                  </h1>
                  <Spinner style={{ width: '3rem', height: '3rem' }} />{' '}
                </span>
              </div>
            </div>
          </Container>
        </div>
      ) : (
        <>
          {state.verified ? (
            <div className="main-content main-page login-view-wrapper">
              <Container className="content-wrapper">
                <div className="w-100 px-2">
                  <div className="text-center">
                    <span>
                      <h1 className="text-white">
                        {t(`${translationPath}welcome`)}!
                      </h1>
                      <p className="text-lead text-white">
                        {t(`${translationPath}change-your-password`)}!
                      </p>
                    </span>
                  </div>
                </div>
                <div className="login-card-wrapper">
                  <Card className="bg-secondary-old border-0 mb-0">
                    <CardBody className="px-lg-5 py-lg-5">
                      <div className="text-center text-muted mb-4">
                        <small>{t(`${translationPath}change-password`)}</small>
                      </div>

                      {state.type === 'success' && (
                        <div className="alert alert-success">{state.message}</div>
                      )}
                      {state.type === 'error' && (
                        <div className="alert alert-danger">{state.message}</div>
                      )}
                      <form onSubmit={handleSubmit} name="form">
                        <div className="row">
                          <div className="col">
                            <div className="form-group">
                              <div className="input-group input-group-merge input-group-alternative mb-3">
                                <div className="input-group-prepend">
                                  <span className="input-group-text h-100">
                                    <i className="fas fa-unlock-alt" />
                                  </span>
                                </div>
                                <input
                                  className="form-control px-3"
                                  placeholder={t(`${translationPath}password`)}
                                  type="password"
                                  name="password"
                                  value={values.password}
                                  onChange={handleChange}
                                />
                              </div>
                              {errors.password
                                && (touched.password || dirty.password) && (
                                <span className="font-12 text-danger">
                                  {errors.password}
                                </span>
                              )}
                            </div>
                            <div className="form-group">
                              <div className="input-group input-group-merge input-group-alternative mb-3">
                                <div className="input-group-prepend">
                                  <span className="input-group-text h-100">
                                    <i className="fas fa-unlock-alt" />
                                  </span>
                                </div>
                                <input
                                  className="form-control px-3"
                                  placeholder={t(
                                    `${translationPath}password-confirmation`,
                                  )}
                                  type="password"
                                  name="password_confirmation"
                                  value={values.password_confirmation}
                                  onChange={handleChange}
                                />
                              </div>
                              {errors.password_confirmation
                                && (touched.password_confirmation
                                  || dirty.password_confirmation) && (
                                <span className="font-12 text-danger">
                                  {errors.password_confirmation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col text-right">
                            <ButtonBase
                              className="btns theme-solid"
                              disabled={state.loading}
                              type="submit"
                            >
                              <span>{t(`${translationPath}save`)}</span>
                            </ButtonBase>
                          </div>
                        </div>
                      </form>
                    </CardBody>
                  </Card>
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
                        {t(`${translationPath}the-link-has-been-expired`)}
                      </h1>
                      <p className="text-lead text-white">
                        {t(
                          `${translationPath}contact-your-administrator-for-more-details`,
                        )}
                        .
                      </p>
                    </span>
                  </div>
                </div>
              </Container>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ConfirmPassword;
