import React, { useEffect, useState, useCallback, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../shared';

import { DynamicFormTypesEnum } from '../../../../enums';
import { useTitle } from '../../../../hooks';
import {
  GetAllSetupsPositionNameSettings,
  UpdateSetupsPositionNameSettings,
} from '../../../../services/SetupsPositionNameSettings.Services';
import { Button } from 'reactstrap';
import { CheckboxesComponent } from '../../../../components';
import PositionsAliases from './positions-aliases/PositionsAliases.Component';

const translationPath = 'SettingsPositionName.';
const parentTranslationPath = 'SetupsPage';
const PositionName = () => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  useTitle(t(`${translationPath}candidates-settings`));
  const [isLoading, setIsLoading] = useState(false);

  const stateInitRef = useRef({ show_aliases: false });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @params {id, updateMessage}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the candidate settings
   */
  const updateHandler
    = ({ position_name }) =>
      async (event, newValue) => {
        setIsLoading(true);
        const response = await UpdateSetupsPositionNameSettings({
          position_name,
        });
        if (!isMountedRef.current) return;
        setIsLoading(false);
        if (response && response.status === 202)
          showSuccess(t(`${translationPath}posititon-name-changed-successfully`));
        else showError(t(`${translationPath}posititon-name-change-failed`), response);
      };

  const getPositionNameSetting = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsPositionNameSettings();
    if (!isMountedRef.current) return;
    setIsLoading(false);
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      setState({ id: 'edit', value: results });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  useEffect(() => {
    getPositionNameSetting();
  }, [getPositionNameSetting]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );
  return (
    <div className="settings-candidates-page-wrapper px-4 pt-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}position-name-settings`)}
        </span>
        {/*<span className="description-text">*/}
        {/*  {t(`${translationPath}position-name-settings-description`)}*/}
        {/*</span>*/}
      </div>
      <div className="separator-h mb-3" />
      <div className="page-body-wrapper px-2">
        <div className="setups-card-wrapper">
          <div className="setups-content-wrapper">
            <div className="setups-card-body-wrapper">
              <div className="body-item-wrapper">
                <span className="header-text">
                  {t(`${translationPath}position-name`)}
                </span>
              </div>
              <div className="body-item-wrapper mb-3">
                <span className="description-text">
                  {t(`${translationPath}position-name-description`)}
                </span>
              </div>
              <div className="body-item-wrapper c-black-light mb-2">
                <span>{t(`${translationPath}position-name-annotations`)}</span>
              </div>
              <div className="body-item-wrapper">
                {state.annotation && (
                  <>
                    <SharedAutocompleteControl
                      isFullWidth
                      title="position-name-annotations"
                      placeholder="select-position-name-annotations"
                      isStringArray
                      onValueChanged={(newVal) => {
                        setState({
                          id: 'position_name',
                          value: `${state.position_name}${newVal?.value || ''}`,
                        });
                      }}
                      translationPath={translationPath}
                      initValues={state.annotation}
                      editValue={''}
                      parentTranslationPath={parentTranslationPath}
                      type={DynamicFormTypesEnum.select.key}
                      getOptionLabel={(option) => option}
                    />
                    <SharedInputControl
                      editValue={state?.position_name || ''}
                      onValueChanged={(newVal) => {
                        setState({
                          id: 'position_name',
                          value: newVal?.value || '',
                        });
                      }}
                      stateKey="position_name"
                      isDisabled={isLoading}
                      idRef="positionNameREf"
                      title="position-name-annotations"
                      placeholder="position-name-annotations"
                      isFullWidth
                      translationPath={translationPath}
                      parentTranslationPath={parentTranslationPath}
                      wrapperClasses="my-2"
                    />
                    <div className="d-flex-center mt-2">
                      <Button
                        className=" "
                        type="button"
                        onClick={updateHandler({
                          position_name: state.position_name,
                        })}
                        color="primary"
                        disabled={!state.position_name || isLoading}
                      >
                        {isLoading && (
                          <i className="fas fa-circle-notch fa-spin mr-2" />
                        )}
                        {`${isLoading ? t(`Shared:saving`) : t(`Shared:save`)}`}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {state.annotation && (
            <div className="setups-content-wrapper my-3">
              <div className="setups-card-body-wrapper">
                <div className="body-item-wrapper">
                  <CheckboxesComponent
                    idRef="RightToWorkRef"
                    onSelectedCheckboxChanged={(e, value) =>
                      setState({
                        id: 'show_aliases',
                        value,
                      })
                    }
                    label={
                      <span className="header-text">
                        {t(`${translationPath}position-aliases-title`)}
                      </span>
                    }
                    singleChecked={state?.show_aliases || false}
                  />
                </div>
                {state?.show_aliases && (
                  <PositionsAliases positionName={state.position_name} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionName;
