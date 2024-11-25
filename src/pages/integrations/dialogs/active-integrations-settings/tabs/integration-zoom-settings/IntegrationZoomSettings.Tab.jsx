import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import * as yup from 'yup';
import {
  GetIntegrationsForZoom,
  UpdateIntegrationsForZoom,
} from '../../../../../../services';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../../../setups/shared';
import ButtonBase from '@mui/material/ButtonBase';
import { SwitchComponent } from '../../../../../../components';

const IntegrationZoomSettingsTab = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateInitRef = useRef({
    auto_recording: null,
    registrants_email_notification: false,
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
          auto_recording: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          registrants_email_notification: yup.boolean().nullable(),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onSwitchChangedHandler = (key) => (event, newValue) => {
    setState({ id: key, value: newValue });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetIntegrationsForZoom();
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: response.data.results.setting,
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
    const response = await UpdateIntegrationsForZoom(state);
    setIsLoading(false);

    if (response && (response.status === 200 || response.status === 201))
      showSuccess(t(`${translationPath}zoom-settings-updated-successfully`));
    else showError(t(`${translationPath}zoom-settings-update-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors().catch();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    getEditInit().catch();
  }, [getEditInit]);

  console.log({ state });

  return (
    <div className="integration-zoom-settings-tab-wrapper tab-wrapper">
      <div className="px-3">
        <SharedAPIAutocompleteControl
          isFullWidth
          editValue={state.auto_recording}
          labelValue="auto-recordings"
          placeholder="select-auto-recordings"
          stateKey="auto_recording"
          errorPath="auto_recording"
          isDataArrayOfStrings
          getDataAPI={GetIntegrationsForZoom}
          // getOptionSelected={(option) => option.uuid}
          // getOptionLabel={(option) => option.title}
          dataKey="auto_recordings"
          errors={errors}
          searchKey="search"
          isSubmitted={isSubmitted}
          isDisabled={isLoading}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <div className="d-inline-flex mb-2">
          <SwitchComponent
            idRef="Iregistrants_email_notificationSwitchRef"
            label="registrants-email-notification"
            isChecked={state.registrants_email_notification}
            onChange={onSwitchChangedHandler('registrants_email_notification')}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      </div>
      <div className="d-flex-center">
        <ButtonBase
          className="btns theme-solid bg-secondary"
          disabled={isLoading}
          onClick={saveHandler}
        >
          <span>{t(`${translationPath}update`)}</span>
        </ButtonBase>
      </div>
    </div>
  );
};

IntegrationZoomSettingsTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default IntegrationZoomSettingsTab;
