import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { CloneTemplate } from '../../../../../services';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../setups/shared';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';

export const TemplateCloneDialog = ({
  template_uuid,
  title,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const stateInitRef = useRef({
    template_uuid,
    title,
  });
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
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          template_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          title: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const response = await CloneTemplate(state);
    setIsLoading(false);
    if (response && response.status === 200) {
      onSave();
      isOpenChanged();
      showSuccess(t(`${translationPath}template-cloned-successfully`));
    } else showError(t(`${translationPath}template-clone-failed`), response);
  };

  // this to call error's updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      maxWidth="xs"
      titleText="template-name"
      contentClasses="px-0"
      dialogContent={
        <div className="template-clone-content-dialog-wrapper">
          <SharedInputControl
            title="title"
            editValue={state.title}
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            errors={errors}
            errorPath="title"
            stateKey="title"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      wrapperClasses="template-clone-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

TemplateCloneDialog.propTypes = {
  template_uuid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
