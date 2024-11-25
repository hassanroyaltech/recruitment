import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName } from '../../../../../../helpers';
import { SetupsReducer, SetupsReset, SharedInputControl } from '../../../../shared';

export const CandidatePropertiesSection = ({
  lookup,
  translationPath,
  parentTranslationPath,
  setStateFunc,
  isSubmitted,
  setIsSubmitted,
  setIsLoading,
  errors,
  setErrors,
  activeItem,
  isOpenChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    key: '',
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
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
          key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('this-field-is-required'),
              (value) => value || activeItem,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [activeItem, state, t, setErrors]);

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    setState({
      id: 'edit',
      value: {
        key: activeItem.key,
        uuid: activeItem.uuid,
      },
    });
    setIsLoading(true);
  }, [activeItem, setIsLoading]);

  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  useEffect(() => {
    setStateFunc(state);
  }, [state, setStateFunc]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <SharedInputControl
      isFullWidth
      title="property-key"
      stateKey="key"
      placeholder="write-property-key"
      onValueChanged={onStateChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      editValue={state.key}
      wrapperClasses="mb-0"
      errorPath="key"
      isSubmitted={isSubmitted}
      errors={errors}
    />
  );
};

CandidatePropertiesSection.propTypes = {
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
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  setStateFunc: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
  setIsSubmitted: PropTypes.func,
  setIsLoading: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    birth_date: PropTypes.string,
    marriage_date: PropTypes.string,
  }),
  setErrors: PropTypes.func,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    key: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};
CandidatePropertiesSection.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  filter: undefined,
  isSubmitted: false,
  errors: {
    birth_date: '',
    marriage_date: '',
  },
  translationPath: 'CandidatePropertiesSection.',
  parentTranslationPath: 'SetupsPage',
};
