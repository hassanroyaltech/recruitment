import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import * as yup from 'yup';
import {
  GetIntegrationsForSap,
  UpdateIntegrationsForSapClient,
} from '../../../../../../services';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../../setups/shared';
import { urlExpression } from '../../../../../../utils';
import ButtonBase from '@mui/material/ButtonBase';

const IntegrationSAPClientsTab = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const stateInitRef = useRef({
    url: null,
    user_name: null,
    password: null,
    company_id: null,
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
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
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          user_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          password: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          company_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          url: yup
            .string()
            .nullable()
            .test('isRequired', t('Shared:this-field-is-required'), (value) => value)
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            }),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetIntegrationsForSap();
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: response.data.results.client,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const response = await UpdateIntegrationsForSapClient(state);
    setIsLoading(false);

    if (response && (response.status === 200 || response.status === 201))
      showSuccess(t(`${translationPath}client-information-updated-successfully`));
    else
      showError(t(`${translationPath}client-information-update-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors().catch();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    getEditInit().catch();
  }, [getEditInit]);
  return (
    <div className="integration-sap-clients-tab-wrapper tab-wrapper">
      <div className="px-3">
        <SharedInputControl
          isFullWidth
          labelValue="user-name"
          editValue={state.user_name}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath="user_name"
          stateKey="user_name"
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedInputControl
          isFullWidth
          labelValue="url"
          editValue={state.url}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath="url"
          stateKey="url"
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedInputControl
          isFullWidth
          labelValue="password"
          editValue={state.password}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath="password"
          stateKey="password"
          type={(isShowPassword && 'text') || 'password'}
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
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedInputControl
          isFullWidth
          labelValue="company-id"
          editValue={state.company_id}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath="company_id"
          stateKey="company_id"
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className="d-flex-center">
        <ButtonBase
          className="btns theme-solid bg-secondary"
          disabled={isLoading}
          onClick={saveHandler}
        >
          <span>{t(`${translationPath}send`)}</span>
        </ButtonBase>
      </div>
    </div>
  );
};

IntegrationSAPClientsTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default IntegrationSAPClientsTab;
