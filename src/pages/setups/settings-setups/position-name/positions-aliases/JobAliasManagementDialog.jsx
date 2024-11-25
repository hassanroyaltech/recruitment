import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
} from '../../../../../helpers';
import {
  SetupsReset,
  SetupsReducer,
  getLanguageTitle,
  SharedInputControl,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
} from '../../../shared';
import { DialogComponent } from '../../../../../components';

export const JobAliasManagementDialog = ({
  isOpen,
  onSave,
  activeItem,
  isLoading,
  isOpenChanged,
  handleCloseDialog,
  translationPath,
  parentTranslationPath,
  languages,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = useRef(null);
  const stateInitRef = useRef({
    alias: activeItem.alias || {},
    status: true,
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

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

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.alias) showError(errors.alias.message);
      return;
    }
    if (onSave) onSave({ alias: state?.alias });
    if (isOpenChanged) isOpenChanged();
  };

  const onStatusChangedHandler = (event, newValue) => {
    setState({ id: 'status', value: newValue });
  };

  const addLanguageHandler = (key, item) => () => {
    console.log({ key, item });
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({ id: key, value: localItem });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
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

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init

  // this to get languages

  useEffect(() => {
    if (!activeItem) {
      const localEnLanguage = languages.find((item) => item.code === 'en');
      if (localEnLanguage)
        setState({
          id: 'alias',
          value: {
            [localEnLanguage.code]: null,
          },
        });
    }
  }, [activeItem, languages]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      alias: yup.lazy((obj) =>
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
            `${t('please-add-at-least')} ${1} ${t('alias')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
    });
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={'position-alias-management'}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={addLanguageHandler('alias', state.alias)}
              disabled={
                isLoading
                || languages.length === 0
                || (state.alias && languages.length === Object.keys(state.alias).length)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state.alias
            && Object.entries(state.alias).map((item, index) => (
              <React.Fragment key={`namesKey${index + 1}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      stateKey="alias"
                      title="language"
                      editValue={item[0]}
                      placeholder="select-language"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state.alias };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
                        onStateChanged({ id: 'alias', value: localItems });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state.alias,
                        index,
                      )}
                      initValuesKey="code"
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={removeLanguageHandler('alias', state.alias, item[0])}
                    >
                      <span className="fas fa-times" />
                      <span className="px-1">{t('remove-language')}</span>
                    </ButtonBase>
                  </div>
                )}
                <SharedInputControl
                  errors={errors}
                  parentId="alias"
                  stateKey={item[0]}
                  editValue={item[1]}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  errorPath={`alias.${[item[0]]}`}
                  parentTranslationPath={parentTranslationPath}
                  title={`${t(`${translationPath}alias`)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                />
              </React.Fragment>
            ))}
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={handleCloseDialog}
      onCancelClicked={handleCloseDialog}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

JobAliasManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};

JobAliasManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'OrganizationGroupManagementDialog.',
};
