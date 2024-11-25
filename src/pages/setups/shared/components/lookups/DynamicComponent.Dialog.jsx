import React, { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../components';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';

export const DynamicComponentDialog = ({
  activeItem,
  lookup,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  isOpen,
  updateSuccessMessage,
  createSuccessMessage,
  createFailedMessage,
  updateFailedMessage,
  Section,
  filter,
}) => {
  const [mainDialogState, setMainDialogState] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const isCodeDisabled = useRef(Boolean(activeItem));
  const { t } = useTranslation(parentTranslationPath);

  const schema = useRef(null);
  const setStateFunc = useCallback((state) => {
    setMainDialogState(state);
  }, []);
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, mainDialogState).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [mainDialogState]);

  const saveHandler = async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    let response;
    if (activeItem)
      response = await lookup.updateAPI({
        ...mainDialogState,
      });
    else
      response = await lookup.createAPI({
        ...mainDialogState,
      });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && updateSuccessMessage) || createSuccessMessage
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && updateFailedMessage) || createFailedMessage
          }`,
        ),
        response,
      );
  };

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={
        (activeItem && `edit-${lookup.valueSingle}`) || `add-${lookup.valueSingle}`
      }
      contentClasses="px-0"
      dialogContent={
        <Section
          lookup={lookup}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          setStateFunc={setStateFunc}
          isSubmitted={isSubmitted}
          setIsSubmitted={setIsSubmitted}
          setIsLoading={setIsLoading}
          errors={errors}
          setErrors={setErrors}
          activeItem={activeItem}
          isOpenChanged={isOpenChanged}
          onSave={onSave}
          filter={filter}
          isCodeDisabled={isCodeDisabled}
        />
      }
      wrapperClasses="lookups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(activeItem && true) || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        saveHandler();
      }}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

DynamicComponentDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  updateSuccessMessage: PropTypes.string,
  createSuccessMessage: PropTypes.string,
  createFailedMessage: PropTypes.string,
  updateFailedMessage: PropTypes.string,
  Section: PropTypes.elementType,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

DynamicComponentDialog.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  onSave: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  updateSuccessMessage: '',
  createSuccessMessage: '',
  createFailedMessage: '',
  updateFailedMessage: '',
  Section: undefined,
  parentTranslationPath: '',
};
