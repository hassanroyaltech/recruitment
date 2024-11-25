import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
} from '../../../../../../helpers';
import {
  SetupsReset,
  SetupsReducer,
  getLanguageTitle,
  SharedInputControl,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
} from '../../../../../setups/shared';
import { DialogComponent } from '../../../../../../components';
import { SystemLanguagesConfig } from '../../../../../../configs';

export const ScorecardTranslationDialog = ({
  isOpen,
  onSave,
  activeItem,
  isLoading,
  isOpenChanged,
  handleCloseDialog,
  parentTranslationPath,
  titleText,
  requiredKey,
  additionalKey,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [languages] = useState(
    Object.values(SystemLanguagesConfig).map((item) => ({
      code: item.key,
      title: t(`Shared:LanguageChangeComponent.${item.value}`),
    })),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = useRef(null);
  const stateInitRef = useRef({
    [requiredKey]: activeItem?.[requiredKey] || {},
    ...(additionalKey && {
      [additionalKey]: activeItem?.[additionalKey],
    }),
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
      if (errors?.[requiredKey]) showError(errors[requiredKey].message);
      return;
    }
    if (onSave)
      onSave({
        [requiredKey]: state?.[requiredKey],
        ...(additionalKey && {
          [additionalKey]: state?.[additionalKey],
        }),
      });
    if (isOpenChanged) isOpenChanged();
  };

  const addLanguageHandler = (key, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({ id: key, value: localItem });
  };

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

  // this to get languages
  useEffect(() => {
    if (!activeItem) {
      const localEnLanguage = languages.find((item) => item.code === 'en');
      if (localEnLanguage)
        setState({
          id: requiredKey,
          value: {
            [localEnLanguage.code]: null,
          },
        });
    }
  }, [activeItem, languages, requiredKey]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      [requiredKey]: yup.lazy((obj) =>
        yup
          .object()
          .shape(
            Object.keys(obj).reduce(
              (newMap, key) => ({
                ...newMap,
                [key]: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t(requiredKey)}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
    });
  }, [activeItem, requiredKey, t]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns theme-transparent mx-3 mb-2"
              onClick={addLanguageHandler(requiredKey, state?.[requiredKey])}
              disabled={
                isLoading
                || languages.length === 0
                || (state?.[requiredKey]
                  && languages.length === Object.keys(state?.[requiredKey]).length)
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t('add-language')}</span>
            </ButtonBase>
          </div>
          {state?.[requiredKey]
            && Object.entries(state?.[requiredKey] || {}).map((item, index) => (
              <React.Fragment key={`namesKey${index + 1}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      stateKey={requiredKey}
                      title="language"
                      editValue={item[0]}
                      placeholder="select-language"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state?.[requiredKey] };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
                        onStateChanged({ id: requiredKey, value: localItems });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state?.[requiredKey],
                        index,
                      )}
                      initValuesKey="code"
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                    />
                    <ButtonBase
                      className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                      onClick={removeLanguageHandler(
                        requiredKey,
                        state?.[requiredKey],
                        item[0],
                      )}
                    >
                      <span className="fas fa-times" />
                      <span className="px-1">{t('remove-language')}</span>
                    </ButtonBase>
                  </div>
                )}
                <SharedInputControl
                  errors={errors}
                  parentId={requiredKey}
                  stateKey={item[0]}
                  editValue={item[1]}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  errorPath={`${requiredKey}.${[item[0]]}`}
                  parentTranslationPath={parentTranslationPath}
                  title={`${t(requiredKey)} (${getLanguageTitle(
                    languages,
                    item[0],
                  )})`}
                />
                {additionalKey && (
                  <SharedInputControl
                    parentId={additionalKey}
                    stateKey={item[0]}
                    editValue={state?.[additionalKey]?.[item[0]]}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    title={`${t(additionalKey)} (${getLanguageTitle(
                      languages,
                      item[0],
                    )})`}
                  />
                )}
              </React.Fragment>
            ))}
        </div>
      }
      isOpen={isOpen || false}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={handleCloseDialog}
      onCancelClicked={handleCloseDialog}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

ScorecardTranslationDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};

ScorecardTranslationDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
};
