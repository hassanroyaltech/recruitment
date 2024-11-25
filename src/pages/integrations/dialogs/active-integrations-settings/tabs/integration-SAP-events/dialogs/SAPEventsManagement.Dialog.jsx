import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../helpers';
import * as yup from 'yup';
import { urlExpression } from '../../../../../../../utils';
import {
  GetIntegrationSAPEventKey,
  IntegrationSAPEventManagement,
} from '../../../../../../../services';
import { DialogComponent } from '../../../../../../../components';
import './SAPEventsManagement.Style.scss';

const SAPEventsManagementDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateInitRef = useRef({
    event_key: null,
    event_url: null,
    event_name: null,
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
          event_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          event_key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) => value,
            ),
          event_url: yup
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

  // /**
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to get the data on edit
  //  */
  // const getEditInit = useCallback(async () => {
  //   setIsLoading(true);
  //   const response = await GetIntegrationSAPEvent({
  //     uuid: activeItem && activeItem.uuid,
  //   });
  //   setIsLoading(false);
  //   if (response && response.status === 200)
  //     setState({
  //       id: 'edit',
  //       value: response.data.results,
  //     });
  //   else {
  //     showError(t('Shared:failed-to-get-saved-data'), response);
  //     isOpenChanged();
  //   }
  // }, [activeItem, isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const response = await IntegrationSAPEventManagement(state);

    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'event-updated-successfully')
            || 'event-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'event-update-failed') || 'event-create-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors().catch();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) setState({ id: 'edit', value: activeItem });
  }, [activeItem]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-an-event') || 'add-new-event'}
      dialogContent={
        <div className="sap-events-management-content-dialog-wrapper">
          <SharedInputControl
            isFullWidth
            labelValue="event-name"
            editValue={state.event_name}
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            errors={errors}
            errorPath="event_name"
            stateKey="event_name"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <SharedInputControl
            isFullWidth
            labelValue="event-url"
            editValue={state.event_url}
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            errors={errors}
            errorPath="event_url"
            stateKey="event_url"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <SharedAPIAutocompleteControl
            isFullWidth
            editValue={state.event_key}
            labelValue="event-key"
            isDataObject
            placeholder="select-event-key"
            stateKey="event_key"
            errorPath="event_key"
            getDataAPI={GetIntegrationSAPEventKey}
            getOptionLabel={(option) => option.title}
            // extraProps={{
            //   with_than: (state.event_key && [state.event_key]) || null,
            // }}
            errors={errors}
            searchKey="search"
            isSubmitted={isSubmitted}
            isDisabled={isLoading}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      wrapperClasses="sap-events-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={Boolean(activeItem)}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

SAPEventsManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default SAPEventsManagementDialog;
