import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import {
  getLanguageTitle,
  SharedInputControl,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
  SharedAPIAutocompleteControl,
} from '../../../../../shared';
import { SwitchComponent } from '../../../../../../../components';
import { GetAllSetupsUserTypes } from '../../../../../../../services';
import { numericAndAlphabeticalAndSpecialExpression } from '../../../../../../../utils';
import { LanguageUpdateKey } from '../../../../../../../helpers';
export const InformationTab = ({
  state,
  errors,
  setState,
  isLoading,
  languages,
  activeItem,
  isSubmitted,
  onStateChanged,
  translationPath,
  addLanguageHandler,
  parentTranslationPath,
  removeLanguageHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const isCodeDisabled = useRef(Boolean(activeItem));

  /**
   * @param event
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onIsMasterChangedHandler = (event, newValue) => {
    setState({ id: 'is_master', value: newValue });
    // also remove all access dropdowns when switching the master tab off
    if (!newValue)
      setState({
        id: 'user_access',
        value: [
          {
            status: true,
            company_uuid: '',
            category_uuid: [],
            permissions: [],
            role_permissions: [],
          },
        ],
      });
  };

  /**
   * @param event
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to change the status of lookups
   */
  const onIsCcEmailChangedHandler = (event, newValue) => {
    setState({ id: 'is_cc_email', value: newValue });
  };

  return (
    <div>
      <div className="d-inline-flex">
        <SharedInputControl
          title="code"
          errors={errors}
          errorPath="code"
          stateKey="code"
          editValue={state.code}
          isRequired
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          pattern={numericAndAlphabeticalAndSpecialExpression}
          isDisabled={isLoading || (isCodeDisabled && isCodeDisabled.current)}
        />
      </div>
      <div className="d-flex-v-center-h-end">
        <ButtonBase
          className="btns theme-transparent mx-3 mb-2"
          onClick={() => {
            addLanguageHandler('first_name', state.first_name)();
            addLanguageHandler('last_name', state.last_name)();
            addLanguageHandler('second_name', state.second_name)();
            addLanguageHandler('third_name', state.third_name)();
          }}
          disabled={
            isLoading
            || languages.length === 0
            || (state.first_name
              && languages.length === Object.keys(state.first_name).length)
          }
        >
          <span className="fas fa-plus" />
          <span className="px-1">{t('add-language')}</span>
        </ButtonBase>
      </div>
      {state.first_name
        && Object.entries(state.first_name).map((item, index) => (
          <React.Fragment key={`${item[0]}namesKey`}>
            {index > 0 && (
              <div className="d-flex-h-between">
                <SharedAutocompleteControl
                  editValue={item[0]}
                  placeholder="select-language"
                  title="language"
                  stateKey="user_name"
                  onValueChanged={(newValue) => {
                    const localState = { ...state };
                    // eslint-disable-next-line prefer-destructuring
                    ['first_name', 'second_name', 'third_name', 'last_name'].forEach(
                      (nameKey) => {
                        localState[nameKey] = LanguageUpdateKey(
                          { [item[0]]: newValue.value },
                          localState[nameKey],
                        );
                      },
                    );
                    onStateChanged({ id: 'edit', value: localState });
                  }}
                  initValues={getNotSelectedLanguage(
                    languages,
                    state.first_name,
                    index,
                  )}
                  initValuesKey="code"
                  initValuesTitle="title"
                  parentTranslationPath={parentTranslationPath}
                />
                <ButtonBase
                  className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                  onClick={() => {
                    removeLanguageHandler('last_name', state.last_name, item[0])();
                    removeLanguageHandler('third_name', state.third_name, item[0])();
                    removeLanguageHandler(
                      'second_name',
                      state.second_name,
                      item[0],
                    )();
                    removeLanguageHandler('first_name', state.first_name, item[0])();
                  }}
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
              parentId="first_name"
              errors={errors}
              errorPath={`first_name.${[item[0]]}`}
              title={`${t(`${translationPath}first-name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isRequired
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
            />
            <SharedInputControl
              editValue={(state.second_name && state.second_name[item[0]]) || ''}
              parentTranslationPath={parentTranslationPath}
              stateKey={item[0]}
              parentId="second_name"
              errors={errors}
              errorPath={`second_name.${[item[0]]}`}
              title={`${t(`${translationPath}second-name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (newValue && !newValue.value) {
                  const localSecondName = { ...(state.second_name || {}) };
                  delete localSecondName[item[0]];
                  if (Object.keys(localSecondName).length === 0) {
                    onStateChanged({
                      id: 'second_name',
                      value: null,
                    });
                    return;
                  }
                  onStateChanged({
                    id: 'second_name',
                    value: localSecondName,
                  });
                  return;
                }
                onStateChanged(newValue);
              }}
              isHalfWidth
            />
            <SharedInputControl
              editValue={(state.third_name && state.third_name[item[0]]) || ''}
              parentTranslationPath={parentTranslationPath}
              stateKey={item[0]}
              parentId="third_name"
              errors={errors}
              errorPath={`third_name.${[item[0]]}`}
              title={`${t(`${translationPath}third-name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                if (newValue && !newValue.value) {
                  const localThirdName = { ...(state.third_name || {}) };
                  delete localThirdName[item[0]];
                  if (Object.keys(localThirdName).length === 0) {
                    onStateChanged({
                      id: 'third_name',
                      value: null,
                    });
                    return;
                  }
                  onStateChanged({
                    id: 'third_name',
                    value: localThirdName,
                  });
                  return;
                }
                onStateChanged(newValue);
              }}
              isHalfWidth
            />
            <SharedInputControl
              editValue={state.last_name[item[0]]}
              parentTranslationPath={parentTranslationPath}
              stateKey={item[0]}
              parentId="last_name"
              errors={errors}
              errorPath={`last_name.${[item[0]]}`}
              title={`${t(`${translationPath}last-name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isRequired
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
            />
          </React.Fragment>
        ))}
      <div className="d-flex flex-wrap pt-4">
        <SharedAPIAutocompleteControl
          isHalfWidth
          uniqueKey="id"
          errors={errors}
          title="user-type"
          stateKey="user_type"
          errorPath="user_type"
          placeholder="user-type"
          isRequired
          isSubmitted={isSubmitted}
          idRef="typeAutocompleteRef"
          editValue={state.user_type}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          getDataAPI={GetAllSetupsUserTypes}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.user_type && { with_than: [state.user_type] }),
          }}
        />
        <SharedInputControl
          isHalfWidth
          errors={errors}
          title="email"
          isRequired
          isSubmitted={isSubmitted}
          stateKey="email"
          errorPath="email"
          editValue={state.email}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        <div className="d-flex px-3 pb-2">
          <div>
            <SwitchComponent
              label="master"
              isReversedLabel
              idRef="is_masterSwitchRef"
              isChecked={state.is_master}
              translationPath={translationPath}
              onChange={onIsMasterChangedHandler}
              switchControlClasses="align-items-start"
              parentTranslationPath={parentTranslationPath}
            />
            <span className="description-text">
              {t(`${translationPath}is-master-description`)}
            </span>
          </div>
          <SwitchComponent
            isReversedLabel
            label="cc-email"
            idRef="is_cc_emailSwitchRef"
            isChecked={state.is_cc_email}
            translationPath={translationPath}
            onChange={onIsCcEmailChangedHandler}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
    </div>
  );
};

InformationTab.propTypes = {
  state: PropTypes.shape({
    code: PropTypes.string,
    is_master: PropTypes.bool,
    date_of_birth: PropTypes.string,
    email: PropTypes.string,
    first_name: PropTypes.instanceOf(Object),
    gender: PropTypes.string,
    is_active: PropTypes.bool,
    is_cc_email: PropTypes.bool,
    timezone: PropTypes.string,
    last_name: PropTypes.instanceOf(Object),
    profile_image: PropTypes.instanceOf(Object),
    second_name: PropTypes.instanceOf(Object),
    status: PropTypes.bool,
    user_type: PropTypes.number,
    third_name: PropTypes.instanceOf(Object),
  }).isRequired,
  translationPath: PropTypes.string,
  setState: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  addLanguageHandler: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object),
};
InformationTab.defaultProps = {
  translationPath: 'UsersInfoDialog.',
  activeItem: undefined,
};
