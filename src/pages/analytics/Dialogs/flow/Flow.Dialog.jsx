import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getErrorByName } from '../../../../helpers';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../setups/shared';
import { GetAllOnboardingFlows } from '../../../../services';
import { DynamicFormTypesEnum } from '../../../../enums';
import { DialogComponent } from '../../../../components';

const FlowDialog = ({
  isOpen,
  onSave,
  onClose,
  parentTranslationPath,
  // translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [errors, setErrors] = useState(() => ({}));
  const stateInitRef = useRef({
    flow_uuid: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
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
        current: object().shape({
          flow_uuid: string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSave(state);
  };

  useEffect(() => {
    void getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      titleText="select-template"
      maxWidth="xs"
      dialogContent={
        <SharedAPIAutocompleteControl
          isFullWidth
          inlineLabel="flow"
          placeholder="select-flow"
          errors={errors}
          stateKey="flow_uuid"
          searchKey="search"
          editValue={state.flow_uuid}
          // isDisabled={isLoading}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetAllOnboardingFlows}
          parentTranslationPath={parentTranslationPath}
          errorPath="flow_uuid"
          getOptionLabel={(option) => option.title || 'N/A'}
          type={DynamicFormTypesEnum.select.key}
          extraProps={{
            // code: DefaultFormsTypesEnum.Forms.key,
            with_than: state.template_uuid,
          }}
        />
      }
      isOpen={isOpen}
      isOldTheme
      onSubmit={saveHandler}
      onCloseClicked={onClose}
      onCancelClicked={onClose}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

FlowDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};

export default FlowDialog;
