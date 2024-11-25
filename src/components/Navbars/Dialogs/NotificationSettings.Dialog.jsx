import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../Dialog/Dialog.Component';
import {
  GetNotificationsSetttings,
  SaveNotificationSettings,
} from '../../../services';
import { showError, showSuccess } from '../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import './NotificationsSettings.Style.scss';
import { TabsComponent } from '../../Tabs/Tabs.Component';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { SwitchComponent } from '../../Switch/Switch.Component';
import { CheckboxesComponent } from '../../Checkboxes/Checkboxes.Component';
import { SetupsReducer, SetupsReset } from '../../../pages/setups/shared';
import { useSelector } from 'react-redux';
import { LoaderComponent } from '../../Loader/Loader.Component';

export const NotificationSettingsDialog = ({
  isOpen,
  setIsOpen,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    active_module: null,
    activeTab: 0,
    modulesList: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const userReducer = useSelector((state) => state?.userReducer);

  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  // const [expanded, setExpanded] = React.useState('panel1');

  const GetNotificationsSettiingsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetNotificationsSetttings({
      uuid: userReducer.results.user.uuid,
    });
    setIsLoading(false);
    if (
      response
      && response.status === 200
      && response.data?.results?.email_notification
    ) {
      onStateChanged({
        id: 'modulesList',
        value: response.data.results.email_notification,
      });
      onStateChanged({
        id: 'active_module',
        value: {
          key: Object.keys(response.data.results.email_notification)?.[0],
          index: 0,
        },
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      onStateChanged({ id: 'modulesList', value: {} });
      setIsOpen(false);
    }
  }, [t, userReducer, setIsOpen]);

  const saveHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const response = await SaveNotificationSettings({
        uuid: userReducer.results.user.uuid,
        email_notification: { ...state.modulesList },
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        showSuccess(t('notifications-settings-saved-successfully'));
        setIsOpen(false);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [userReducer, state.modulesList, t, setIsOpen],
  );

  useEffect(() => {
    GetNotificationsSettiingsHandler();
  }, [GetNotificationsSettiingsHandler]);

  return (
    <DialogComponent
      titleText="personal-notifications"
      dialogContent={
        isLoading ? (
          <div className="w-100">
            <LoaderComponent
              isLoading={isLoading}
              isSkeleton
              skeletonItems={[
                {
                  variant: 'rectangular',
                  style: { minHeight: 30, marginTop: 5, marginBotton: 5 },
                },
              ]}
              numberOfRepeat={10}
            />
          </div>
        ) : (
          <div className="my-4 notifications-settings-dialog-wrapper">
            <div className="py-4 px-2">
              <div className="d-flex-column">
                {Object.keys(state.modulesList).map((item, idx) => (
                  <ButtonBase
                    key={`module-${item.slug}-${idx}`}
                    className={`btns theme-transparent my-1 ${
                      item === state.active_module?.key ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      onStateChanged({
                        id: 'active_module',
                        value: {
                          key: item,
                          index: idx,
                        },
                      });
                    }}
                  >
                    <span
                      className={`width-100-align-text ${
                        i18next.language === 'ar' ? 'rtl' : ''
                      } `}
                    >
                      {t(item.replaceAll('_', '-'))}
                    </span>
                  </ButtonBase>
                ))}
              </div>
            </div>
            <div className="w-100 notifications-settings-data-wrapper py-4 px-2">
              <TabsComponent
                isPrimary
                labelInput="label"
                idRef="notificationsSettings"
                data={[
                  {
                    key: 1,
                    label: 'email',
                  },
                  {
                    key: 2,
                    label: 'desktop',
                    disabled: true,
                  },
                  {
                    key: 3,
                    label: 'mobile-push',
                    disabled: true,
                  },
                ]}
                currentTab={state.activeTab}
                onTabChanged={() => {}}
                parentTranslationPath={parentTranslationPath}
                tabItemClasses="mb-3"
              />
              <div className="notifications-settings-tab-content-wrapper m-2">
                {Object.keys(state.modulesList[state.active_module?.key] || {}).map(
                  (item, idx) => (
                    <div key={`${idx}-submodule-accordion`}>
                      <Accordion
                        // expanded={expanded === item}
                        // onChange={(e, newExpanded) =>
                        //   setExpanded(newExpanded ? item : false)
                        // }
                        elevation={0}
                      >
                        <AccordionSummary>
                          <div className="d-flex-v-center-h-between">
                            <div className="d-flex-v-center">
                              <div>
                                <span className="fas fa-sort-down" />
                              </div>
                              <div>
                                <span className="mx-2">
                                  {t(item.replaceAll('_', '-'))}
                                </span>
                              </div>
                            </div>
                            <ButtonBase onClick={(e) => e.stopPropagation()}>
                              <SwitchComponent
                                isChecked={Object.values(
                                  state.modulesList[state.active_module?.key]?.[
                                    item
                                  ],
                                ).some((item) => !!item)}
                                isReversedLabel
                                isFlexEnd
                                onChange={(e, value) => {
                                  onStateChanged({
                                    id: item,
                                    value: Object.keys(
                                      state.modulesList[state.active_module?.key]?.[
                                        item
                                      ],
                                    ).reduce(
                                      (acc, currentValue) => ({
                                        ...acc,
                                        [currentValue]: value,
                                      }),
                                      {},
                                    ),
                                    parentId: 'modulesList',
                                    subParentId: state.active_module?.key,
                                  });
                                }}
                                parentTranslationPath={parentTranslationPath}
                              />
                            </ButtonBase>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <div className="mx-3 d-flex-column">
                            {Object.keys(
                              state.modulesList[state.active_module?.key]?.[item],
                            ).map((option, optionIdx) => (
                              <CheckboxesComponent
                                key={`notification-settings-submodule-option-${optionIdx}`}
                                idRef="rememberMeLoginRef"
                                label={t(option.replaceAll('_', '-'))}
                                singleChecked={
                                  state.modulesList[state.active_module?.key]?.[
                                    item
                                  ]?.[option] || false
                                }
                                onSelectedCheckboxChanged={(event, checked) => {
                                  onStateChanged({
                                    id: option,
                                    value: checked,
                                    parentId: 'modulesList',
                                    subParentId: state.active_module?.key,
                                    subSubParentId: item,
                                  });
                                }}
                              />
                            ))}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )
      }
      wrapperClasses=""
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      saveText="save-settings"
      onCancelClicked={() => setIsOpen(false)}
      parentTranslationPath={parentTranslationPath}
      maxWidth="lg"
    />
  );
};

NotificationSettingsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
