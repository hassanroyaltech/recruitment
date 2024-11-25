import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../shared';
import { DialogComponent, SwitchComponent } from '../../../../../../components';
import {
  CreateSetupsProjects,
  getSetupsProjectsById,
  UpdateSetupsProjects,
} from '../../../../../../services';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../utils';

export const ProjectsManagementDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const schema = useRef(null);
  const stateInitRef = useRef({
    code: '',
    status: true,
    name: {},
  });
  const [errors, setErrors] = useState(() => ({}));
  const isCodeDisabled = useRef(Boolean(activeItem));

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
   * @param event
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onStatusChangedHandler = (event, newValue) => {
    setState({ id: 'status', value: newValue });
  };

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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsProjectsById({
      uuid: activeItem && activeItem.uuid,
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
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsProjects(state);
    else response = await CreateSetupsProjects(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'project-updated-successfully')
            || 'project-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'project-update-failed') || 'project-create-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
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

  useEffect(() => {
    if (!activeItem) {
      const localEnLanguage = languages.find((item) => item.code === 'en');
      if (localEnLanguage)
        setState({
          id: 'name',
          value: {
            [localEnLanguage.code]: null,
          },
        });
    }
  }, [activeItem, languages]);

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
    });
  }, [activeItem, t, translationPath]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText={(activeItem && 'edit-project') || 'add-project'}
      contentClasses="px-0"
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="d-flex px-3">
            <SwitchComponent
              idRef="StatusSwitchRef"
              label="active"
              isChecked={state.status}
              isReversedLabel
              isFlexEnd
              onChange={onStatusChangedHandler}
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
              <React.Fragment key={`namesKey${item[0]}`}>
                {index > 0 && (
                  <div className="d-flex-h-between">
                    <SharedAutocompleteControl
                      editValue={item[0]}
                      placeholder="select-language"
                      title="language"
                      stateKey="name"
                      onValueChanged={(newValue) => {
                        let localItems = { ...state.name };
                        // eslint-disable-next-line prefer-destructuring
                        localItems = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localItems,
                        );
                        onStateChanged({ id: 'name', value: localItems });
                      }}
                      initValues={getNotSelectedLanguage(
                        languages,
                        state.name,
                        index,
                      )}
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
                  errorPath={`name.${[item[0]]}`}
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
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(activeItem && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ProjectsManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
ProjectsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'ProjectsManagementDialog.',
};
