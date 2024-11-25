import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';

import { showError, showSuccess } from '../../../helpers';
import {
  GetOnboardingEmailSetting,
  UpdateOnboardingEmailSetting,
} from '../../../services';
import { SetupsReducer, SetupsReset } from '../../setups/shared';
import i18next from 'i18next';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { OnboardingEmailRecipientsTypes } from '../../../enums';
import { CheckboxesComponent } from '../../../components';

const parentTranslationPath = 'OnboardingPage';
const translationPath = 'EmailManagementPage.';

const EmailManagementPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding--email-management`));

  const stateInitRef = useRef({
    setting: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateOnboardingEmailSetting = useCallback(
    async ({ prevState, newState, body }) => {
      setState({ id: 'edit', value: { setting: newState } });
      setIsUpdating(true);
      const response = await UpdateOnboardingEmailSetting(body);
      setIsUpdating(false);
      if (response && (response.status === 200 || response.status === 201))
        showSuccess(t(`${translationPath}onboarding-emails-updated-successfully`));
      else {
        showError(t(`${translationPath}onboarding-emails-update-failed`), response);
        setState({ id: 'edit', value: { setting: prevState } });
      }
    },
    [t],
  );
  const tableColumns = useMemo(
    () => [
      {
        id: 1,
        label: t(`${translationPath}email`),
        isHidden: false,
        component: (row) => row?.title?.[i18next.language] || row?.title?.en || '',
      },
      ...Object.values(OnboardingEmailRecipientsTypes).map((item) => ({
        id: item.key,
        label: t(`${translationPath}${item.value}`),
        component: (row, index) => (
          <CheckboxesComponent
            idRef={`${index}${item.key}`}
            isDisabled={isUpdating || !row?.enabled_inputs?.[item.key]}
            singleChecked={row?.setting?.[item.key]}
            onSelectedCheckboxChanged={(event, checked) => {
              let localeState = [...state.setting];
              const localeSetting = {
                ...localeState[index],
                setting: { ...localeState[index].setting, [item.key]: checked },
              };
              localeState[index] = localeSetting;
              updateOnboardingEmailSetting({
                prevState: state.setting,
                newState: localeState,
                body: { uuid: row?.uuid, setting: localeSetting.setting },
              });
            }}
          />
        ),
      })),
    ],
    [isUpdating, state.setting, t, updateOnboardingEmailSetting],
  );

  const getOnboardingEmailSetting = useCallback(async () => {
    setIsLoading(true);
    const response = await GetOnboardingEmailSetting();
    setIsLoading(false);
    if (response.status === 200)
      setState({ id: 'setting', value: response.data.results });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  useEffect(() => {
    getOnboardingEmailSetting();
  }, [getOnboardingEmailSetting]);

  return (
    <div className="activity-page-wrapper page-wrapper" id="onboarding-email-page">
      <div className="d-flex-h-between flex-wrap mb-3">
        <div className="d-inline-flex-v-center">
          <ButtonBase
            className="btns theme-transparent mx-0 miw-0 c-gray-primary  font-12"
            onClick={() => {}}
          >
            <span>{t(`Eva Board`)}</span>
          </ButtonBase>
          <span>
            <span className="fas fa-long-arrow-alt-right mx-2 font-12" />
            <span className="c-black-light mx-2">
              {t(`${translationPath}email-management`)}
            </span>
          </span>
        </div>
      </div>
      <div className="d-flex-v-center-h-between flex-wrap my-2">
        <div className="d-inline-flex header-text-x2 flex-wrap mb-2">
          <div className="d-inline-flex dark-text-color mt-1">
            <span className=" ">
              <span className="fas fa-envelope px-1"></span>
              <span className="px-2 font-weight-700 ">
                {t(`${translationPath}email-management`)}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="mx-0 my-2">
        <TablesComponent
          isWithoutBoxWrapper
          pageSize={state.setting.length}
          headerData={tableColumns}
          pageIndex={0}
          data={state.setting || []}
          totalItems={state.setting.length}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
export default EmailManagementPage;
