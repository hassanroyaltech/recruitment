import React, { useEffect, useReducer, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import {
  SharedInputControl,
  SetupsReducer,
  SetupsReset,
  getLanguageTitle,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
} from '../../../shared';
import { SwitchComponent } from '../../../../../components/Switch/Switch.Component';
import { getErrorByName, showError } from '../../../../../helpers';
import {
  numbersExpression,
  numericAndAlphabeticalAndSpecialExpression,
} from '../../../../../utils';

export const CareerLevelSection = ({
  lookup,
  translationPath,
  parentTranslationPath,
  setStateFunc,
  isSubmitted,
  errors,
  setErrors,
  activeItem,
  isOpenChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    code: '',
    account_uuid: null,
    status: true,
    name: { en: '' },
    order: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const isCodeDisabled = useRef(Boolean(activeItem));
  const schema = useRef(null);

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
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new language key
   */
  const addLanguageHandler = (key, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({ id: key, value: localItem });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove language key
   */
  const removeLanguageHandler = useCallback(
    (key, item, code) => () => {
      const localItem = { ...item };
      delete localItem[code];
      setState({ id: key, value: localItem });
    },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await lookup.viewAPI({
      uuid: activeItem && activeItem.uuid,
      //   account_uuid: accountReducer.account_uuid || '',
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'edit', value: response.data.results });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  useEffect(() => {
    if (filter?.employee_uuid)
      onStateChanged({ id: 'employee_uuid', value: filter.employee_uuid });
  }, [filter]);

  useEffect(() => {
    setStateFunc(state);
  }, [state, setStateFunc]);

  useEffect(() => {
    activeItem && getEditInit();
  }, [activeItem, getEditInit]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else {
      showError(t('Shared:failed-to-get-languages'));
      isOpenChanged();
    }
  }, [isOpenChanged, t, userReducer]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      code: yup
        .string()
        .nullable()
        .test(
          'isRequired',
          t('this-field-is-required'),
          (value) => value || activeItem,
        ),
      name: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup.string().nullable().required(t('this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('name')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      order: yup.string().nullable().required(t('this-field-is-required')),
    });
  }, [activeItem, t, translationPath]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <div className="lookups-management-content-dialog-wrapper">
      <div className="d-flex px-2">
        <SwitchComponent
          idRef="StatusSwitchRef"
          label="active"
          isChecked={state.status}
          isReversedLabel
          isFlexEnd
          onChange={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
      <div className="d-inline-flex">
        <SharedInputControl
          parentTranslationPath={parentTranslationPath}
          title="code"
          editValue={state.code}
          isDisabled={isLoading || (isCodeDisabled && isCodeDisabled.current)}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath="code"
          stateKey="code"
          pattern={numericAndAlphabeticalAndSpecialExpression}
          onValueChanged={onStateChanged}
        />
      </div>
      <div className="d-inline-flex">
        <SharedInputControl
          isFullWidth
          type="number"
          title="order"
          errors={errors}
          stateKey="order"
          errorPath="order"
          editValue={`${state.order}`}
          isSubmitted={isSubmitted}
          pattern={numbersExpression}
          onValueChanged={(newValue) =>
            onStateChanged({ ...newValue, value: `${newValue.value}` })
          }
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          min={1}
          max={1000}
        />
      </div>

      <div className="d-flex-v-center-h-end">
        <ButtonBase
          className="btns theme-transparent mx-3 mb-2"
          onClick={addLanguageHandler('name', state.name)}
          disabled={
            isLoading
            || languages.length === 0
            || (state.name && languages.length === Object.keys(state.name).length)
          }
        >
          <span className="fas fa-plus" />
          <span className="px-1">{t('add-language')}</span>
        </ButtonBase>
      </div>
      {state.name
        && Object.entries(state.name).map((item, index) => (
          <React.Fragment key={`namesKey${index + 1}`}>
            {index > 0 && (
              <div className="d-flex-h-between">
                <SharedAutocompleteControl
                  editValue={item[0]}
                  placeholder="select-language"
                  title="language"
                  stateKey="name"
                  onValueChanged={(newValue) => {
                    const localItems = { ...state.name };
                    // eslint-disable-next-line prefer-destructuring
                    localItems[newValue.value] = item[1];
                    delete localItems[item[0]];
                    onStateChanged({
                      id: 'name',
                      value: localItems,
                    });
                  }}
                  initValues={getNotSelectedLanguage(languages, state.name, index)}
                  initValuesKey="code"
                  initValuesTitle="title"
                  parentTranslationPath={parentTranslationPath}
                />
                <ButtonBase
                  className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                  onClick={removeLanguageHandler('name', state.name, item[0])}
                >
                  <span className="fas fa-times" />
                  <span className="px-1">{t('remove-language')}</span>
                </ButtonBase>
              </div>
            )}
            <SharedInputControl
              editValue={item[1]}
              parentTranslationPath={parentTranslationPath}
              stateKey={item[0]}
              parentId="name"
              errors={errors}
              errorPath={`${'name'}.${[item[0]]}`}
              title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
            />
          </React.Fragment>
        ))}
    </div>
  );
};

CareerLevelSection.propTypes = {
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
  errors: PropTypes.shape({
    from_date: PropTypes.string,
    to_date: PropTypes.string,
  }),
  setErrors: PropTypes.func,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

CareerLevelSection.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {
    from_date: '',
    to_date: '',
  },
  setErrors: undefined,
};
