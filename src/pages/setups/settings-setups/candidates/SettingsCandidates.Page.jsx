import React, { useEffect, useState, useCallback, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../helpers';
import './SettingsCandidates.Style.scss';
import { SetupsReducer, SetupsReset } from '../../shared';
import { RadiosComponent } from '../../../../components';
import {
  GetAllSetupsCandidatesSettings,
  UpdateSetupsCandidatesSettings,
} from '../../../../services';
import { SettingsCandidatesRegistrationTypesEnum } from '../../../../enums';
import { useTitle } from '../../../../hooks';

const translationPath = 'SettingsCandidatesPage.';
const parentTranslationPath = 'SetupsPage';
const SettingsCandidatesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  useTitle(t(`${translationPath}candidates-settings`));
  const [isLoading, setIsLoading] = useState(false);
  const [settingsCandidatesRegistrationTypes] = useState(() =>
    Object.values(SettingsCandidatesRegistrationTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const stateInitRef = useRef({
    register_candidate: SettingsCandidatesRegistrationTypesEnum.VerificationLink.key,
  });

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
  const candidatesSettingsChangeHandler
    = ({ id, updateMessage = 'candidates-settings', type = 'radios' }) =>
      async (event, newValue) => {
        const localNewValue = type === 'radios' ? +newValue : newValue;
        setIsLoading(true);
        const response = await UpdateSetupsCandidatesSettings({
          ...state,
          [id]: localNewValue,
        });
        if (!isMountedRef.current) return;
        setIsLoading(false);
        if (response && response.status === 202) {
          setState({ id, value: localNewValue });
          showSuccess(t(`${translationPath}${updateMessage}-changed-successfully`));
        } else
          showError(t(`${translationPath}${updateMessage}-change-failed`), response);
      };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the candidates settings
   */
  const getAllSetupsCandidatesSettings = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsCandidatesSettings();
    if (!isMountedRef.current) return;
    setIsLoading(false);
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      setState({ id: 'edit', value: results });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  // this to get current candidates settings on init
  useEffect(() => {
    getAllSetupsCandidatesSettings();
  }, [getAllSetupsCandidatesSettings]);

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
          {t(`${translationPath}candidates-settings`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}candidates-settings-description`)}
        </span>
      </div>
      <div className="separator-h mb-3" />
      <div className="page-body-wrapper px-2">
        <div className="setups-card-wrapper">
          <div className="setups-content-wrapper">
            <div className="setups-card-body-wrapper">
              <div className="body-item-wrapper">
                <span className="header-text">
                  {t(`${translationPath}candidates-registration`)}
                </span>
              </div>
              <div className="body-item-wrapper mb-3">
                <span className="description-text">
                  {t(`${translationPath}candidates-registration-description`)}
                </span>
              </div>
              <div className="body-item-wrapper c-black-light">
                <span>{t(`${translationPath}registration-types`)}</span>
              </div>
              <div className="body-item-wrapper">
                <RadiosComponent
                  idRef="candidateRegistrationTypesRadiosRef"
                  themeClass="theme-column"
                  data={settingsCandidatesRegistrationTypes}
                  valueInput="key"
                  labelInput="value"
                  value={state.register_candidate}
                  isDisabled={isLoading}
                  onSelectedRadioChanged={candidatesSettingsChangeHandler({
                    id: 'register_candidate',
                    updateMessage: 'registration-type',
                  })}
                  parentTranslationPath={parentTranslationPath}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCandidatesPage;
