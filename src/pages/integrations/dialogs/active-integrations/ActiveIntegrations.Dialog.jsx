import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, SwitchComponent } from '../../../../components';
import { useTranslation } from 'react-i18next';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedPhoneControl,
} from '../../../setups/shared';
import {
  GetAllSetupsBranches,
  GetAllSetupsPermissions,
  GetSetupsPermissionsById,
} from '../../../../services';
import i18next from 'i18next';
import { ButtonBase } from '@mui/material';
import {
  getDataFromObject,
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../helpers';
import * as yup from 'yup';
import './ActiveIntegrations.Style.scss';
import {
  AzureSyncScheduleTypeEnum,
  DynamicFormTypesEnum,
  IntegrationsPartnersEnum,
  SystemActionsEnum,
} from '../../../../enums';
import Alert from '@mui/material/Alert';
import { emailExpression, phoneExpression, urlExpression } from '../../../../utils';
import { CheckboxesComponent } from 'components/Checkboxes/Checkboxes.Component';
import { useSelector } from 'react-redux';

const ActiveIntegrationsDialog = ({
  activePartner,
  isOpen,
  isOpenChanged,
  getActivePartnerEnum,
  onIntegrationReload,
  onActionClicked,
  getRedirectURIHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const stateInitRef = useRef({
    hcm_instance_url: null,
    hcm_username: null,
    hcm_password: null,
    track_id: null,
    phone_number: null,
    country_code: null,
    enabled: true, // for account level
    slug: null,
    api_key: null,
    api_secret: null,
    application_name: null,
    developer_name: null,
    developer_email: null,
    encrypted_api_key: null, // for account level
    has_company_level_config: false,
    company_level_config: [],
    is_sso_branch_level: false,
    branch_group_config: [],
    events: [],
    encrypted_secret_value: null,
    is_attribute_enabled: false,
    attribute_key: '',
    attribute_value: '',
    default_attribute_value: '',
    excluded_emails: [],
    sync_schedule: AzureSyncScheduleTypeEnum.weekly.key,
    is_sync_enabled: false,
    upside_client_key: '',
    context_path: '',
    upside_auth_url: '',
    upside_manage_user_url: '',
    re_sync_all_users: false,
    is_disabled_phone: false,
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @Description Memoized Options for Azure SSO schedule sync options
   */
  const azureSyncOptions = useMemo(
    () =>
      Object.values(AzureSyncScheduleTypeEnum).map((item) => ({
        ...item,
        value: t(`${translationPath}${item.value}`),
      })),
    [t, translationPath],
  );
  /**
   * @param { key, isAccountLevel } - The account level and key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the key if its exist for the current active partner
   */
  const getKeyItem = useMemo(
    () =>
      ({ key, isAccountLevel = true }) =>
        (getActivePartnerEnum().keys
          && getActivePartnerEnum().keys.find(
            (item) => item.key === key && item.isAccountLevel === isAccountLevel,
          ))
        || {},
    [getActivePartnerEnum],
  );

  /**
   * @param { key, isAccountLevel, value } - The account level and key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the key is existing in the current active partner
   */
  const getIsExistKey = useMemo(
    () =>
      ({ key, isAccountLevel, value = null }) =>
        getActivePartnerEnum().keys
        && getActivePartnerEnum().keys.some(
          (item) => item.key === key && item.isAccountLevel === isAccountLevel,
        )
        && (!getKeyItem({ key }).isOnlyVisibleOnEdit || value),
    [getActivePartnerEnum, getKeyItem],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          enabled: yup.boolean().nullable(), // for account level
          track_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'track_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'track_id' }).isDisabled,
            ),
          phone_number: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'phone_number',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'phone_number' }).isDisabled,
            )
            .matches(phoneExpression, {
              message: t('Shared:invalid-phone-number'),
              excludeEmptyString: true,
            }),
          events: yup
            .array()
            .of(
              yup.object().shape({
                label: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
              }),
            )
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'events',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'events' }).isDisabled,
            ),
          slug: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'slug',
                  isAccountLevel: true,
                })
                || (!parent.enabled && !parent.encrypted_api_key),
            ),
          api_key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'api_key',
                  isAccountLevel: true,
                  value,
                })
                || parent.encrypted_api_key
                || (!parent.slug && !parent.enabled && !parent.encrypted_api_key)
                || getKeyItem({ key: 'api_key' }).isDisabled,
            ),
          api_secret: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'api_secret',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'api_secret' }).isDisabled,
            ),
          developer_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'developer_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'developer_name' }).isDisabled,
            ),
          developer_email: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'developer_email',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'developer_email' }).isDisabled,
            )
            .matches(emailExpression, {
              message: t('Shared:invalid-email'),
              excludeEmptyString: true,
            }),
          hcm_instance_url: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'hcm_instance_url',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'hcm_instance_url' }).isDisabled,
            )
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            }),
          hcm_username: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'hcm_username',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'hcm_username' }).isDisabled,
            ),
          hcm_password: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'hcm_password',
                  isAccountLevel: true,
                  value,
                })
                || parent.encrypted_password
                || getKeyItem({ key: 'hcm_password' }).isDisabled,
            ),
          application_name: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'application_name',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'application_name' }).isDisabled,
            ),
          encrypted_api_key: yup.string().nullable(), // for account level
          is_sso_branch_level: yup.boolean().nullable(),
          has_company_level_config: yup.boolean().nullable(),
          tenant_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'tenant_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'tenant_id' }).isDisabled,
            ),
          secret_value: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'secret_value',
                  isAccountLevel: true,
                  value,
                })
                || parent.encrypted_secret_value
                || getKeyItem({ key: 'secret_value' }).isDisabled,
            ),
          client_id: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'client_id',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'client_id' }).isDisabled,
            ),
          attribute_key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'attribute_key',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'attribute_key' }).isDisabled
                || !parent.is_attribute_enabled,
            ),
          attribute_value: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value, { parent }) =>
                value
                || !getIsExistKey({
                  key: 'attribute_value',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'attribute_value' }).isDisabled
                || !parent.is_attribute_enabled,
            ),
          domain: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'domain',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'domain' }).isDisabled,
            ),
          company_level_config: yup
            .array()
            .of(
              yup.object().shape({
                company_uuid: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'company_uuid',
                        isAccountLevel: false,
                      }),
                  ),
                slug: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'slug',
                        isAccountLevel: false,
                      }),
                  ),
                encrypted_api_key: yup.string().nullable(),
                api_key: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value, { parent }) =>
                      value
                      || !getIsExistKey({
                        key: 'api_key',
                        isAccountLevel: false,
                        value,
                      })
                      || parent.encrypted_api_key
                      || getKeyItem({ key: 'api_key' }).isDisabled,
                  ),
                hcm_instance_url: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'hcm_instance_url',
                        isAccountLevel: false,
                        value,
                      })
                      || getKeyItem({ key: 'hcm_instance_url' }).isDisabled,
                  )
                  .matches(urlExpression, {
                    message: t('Shared:invalid-url'),
                    excludeEmptyString: true,
                  }),
                hcm_username: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'hcm_username',
                        isAccountLevel: false,
                        value,
                      })
                      || getKeyItem({ key: 'hcm_username' }).isDisabled,
                  ),
                hcm_password: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value, { parent }) =>
                      value
                      || !getIsExistKey({
                        key: 'hcm_password',
                        isAccountLevel: false,
                        value,
                      })
                      || parent.encrypted_password
                      || getKeyItem({ key: 'hcm_password' }).isDisabled,
                  ),
                enabled: yup.boolean().nullable(),
              }),
            )
            .nullable()
            .when(
              'has_company_level_config',
              (value, field) =>
                (value
                  && field.min(
                    1,
                    `${t('Shared:please-add-at-least')} ${1} ${t(
                      `${translationPath}integration`,
                    )}`,
                  ))
                || field,
            ),
          branch_group_config: yup
            .array()
            .of(
              yup.object().shape({
                company_uuid: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'company_uuid',
                        isAccountLevel: false,
                      }),
                  ),
                group_name: yup
                  .string()
                  .nullable()
                  .test(
                    'isRequired',
                    t('Shared:this-field-is-required'),
                    (value) =>
                      value
                      || !getIsExistKey({
                        key: 'group_name',
                        isAccountLevel: false,
                      }),
                  ),
                enabled: yup.boolean().nullable(),
              }),
            )
            .nullable()
            .when(
              'is_sso_branch_level',
              (value, field) =>
                (value
                  && field.min(
                    1,
                    `${t('Shared:please-add-at-least')} ${1} ${t(
                      `${translationPath}branch-group`,
                    )}`,
                  ))
                || field,
            ),
          upside_client_key: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'upside_client_key',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'upside_client_key' }).isDisabled,
            ),
          context_path: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'context_path',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'context_path' }).isDisabled,
            )
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            }),
          upside_auth_url: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'upside_auth_url',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'upside_auth_url' }).isDisabled,
            )
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            }),
          upside_manage_user_url: yup
            .string()
            .nullable()
            .test(
              'isRequired',
              t('Shared:this-field-is-required'),
              (value) =>
                value
                || !getIsExistKey({
                  key: 'upside_manage_user_url',
                  isAccountLevel: true,
                  value,
                })
                || getKeyItem({ key: 'upside_manage_user_url' }).isDisabled,
            )
            .matches(urlExpression, {
              message: t('Shared:invalid-url'),
              excludeEmptyString: true,
            }),
        }),
      },
      state,
    );
    setErrors(result);
  }, [getKeyItem, getIsExistKey, state, t, translationPath]);
  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param id
   * @param parentId
   * @param parentIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the switch
   */
  const onSwitchChangedHandler
    = ({ id, parentId, parentIndex }) =>
      (event, isChecked) => {
        onStateChanged({
          parentId,
          parentIndex,
          id,
          value: isChecked,
        });
        if (id === 'has_company_level_config')
          if (isChecked)
            setState({
              id: 'company_level_config',
              value: [
                {
                  company_uuid: null,
                  slug: null,
                  api_key: null,
                  enabled: true,
                  permissions: [],
                },
              ],
            });
          else
            setState({
              id: 'company_level_config',
              value: [],
            });
        else if (id === 'is_sso_branch_level')
          if (isChecked)
            setState({
              id: 'branch_group_config',
              value: [
                {
                  company_uuid: null,
                  group_name: null,
                  enabled: true,
                },
              ],
            });
          else
            setState({
              id: 'branch_group_config',
              value: [],
            });
      };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to init the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const arrayOfPromises = [
      getActivePartnerEnum().getConnectAPI({
        partner: activePartner.partner,
      }),
    ];
    if (getActivePartnerEnum().getHelperApi)
      arrayOfPromises.push(getActivePartnerEnum().getHelperApi());
    const response = await Promise.all(arrayOfPromises);
    setIsLoading(false);
    if (response && response.some((item) => item.status === 200)) {
      const configResponse
        = (getActivePartnerEnum().getAPIPath
          && getDataFromObject(
            response[0].data,
            getActivePartnerEnum().getAPIPath,
            true,
          ))
        || response[0].data;
      setState({
        id: 'edit',
        value: {
          ...configResponse,
          ...(response[1]?.data && {
            [getActivePartnerEnum().helperDataKey]: response[1].data.result?.map(
              (item) => ({
                ...item,
                enabled: false,
                event_name: item.key,
                ...configResponse?.[getActivePartnerEnum().helperDataKey]?.find(
                  (event) => event.event_name === item.key,
                ),
                inputLabel: item.label,
              }),
            ),
          }),
        },
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [activePartner.partner, getActivePartnerEnum, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is open the dialog that confirm the revoke for integrations
   */
  const revokeBranchHandler = useCallback(
    ({ isAccountLevel, item, index }) =>
      () => {
        setActiveItem({
          isAccountLevel,
          item,
          index,
        });
        setIsOpenDeleteDialog(true);
      },
    [],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove branches to the company level
   */
  const removeBranchHandler = useCallback(
    ({ index, items, id }) =>
      () => {
        if (items.length === 1) {
          if (id === 'branch_group_config')
            setState({
              id: 'destructObject',
              value: {
                is_sso_branch_level: false,
                branch_group_config: [],
              },
            });
          if (id === 'company_level_config')
            setState({
              id: 'destructObject',
              value: {
                has_company_level_config: false,
                company_level_config: [],
              },
            });
        } else {
          const localItems = [...items];
          localItems.splice(index, 1);
          setState({
            id,
            value: localItems,
          });
        }
      },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to regenerate API for the selected key
   */
  const onRegenerateKeyClicked = useCallback(
    ({ key, isAccountLevel }) =>
      async () => {
        setIsLoading(true);
        const response = await getKeyItem({ key, isAccountLevel }).regenerateAPI();
        setIsLoading(false);
        if (response && (response.status === 200 || response.status === 201)) {
          //   setState({
          //     id: key,
          //     parentId,
          //     parentIndex: index,
          //     value: response.data.results,
          //   });
          if (
            getActivePartnerEnum().getConnectAPI
            && (activePartner.is_connected
              || !getActivePartnerEnum().onlyCallGetIfConnected)
          )
            getEditInit().catch();
          showSuccess(
            t(
              `${translationPath}${getKeyItem({ key }).regenerateAPISuccessMessage}`,
            ),
          );
        } else
          showError(
            t(`${translationPath}${getKeyItem({ key }).regenerateAPIFailedMessage}`),
            response,
          );
      },
    [
      activePartner.is_connected,
      getActivePartnerEnum,
      getEditInit,
      getKeyItem,
      t,
      translationPath,
    ],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add branches to the company level
   */
  const addBranchHandler = useCallback(
    ({ index, items, id }) =>
      () => {
        const localItems = [...items];
        if (id === 'branch_group_config')
          localItems.splice(index, 0, {
            company_uuid: null,
            group_name: null,
            enabled: true,
          });
        if (id === 'company_level_config')
          localItems.splice(index, 0, {
            company_uuid: null,
            slug: null,
            api_key: null,
            enabled: true,
          });
        setState({
          id,
          value: localItems,
        });
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
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await (
      ((activePartner.is_connected
        || state.encrypted_api_key
        || state.encrypted_secret_value
        || (state.company_level_config
          && state.company_level_config.some((item) => item.encrypted_api_key)))
        && getActivePartnerEnum().updateConnectAPI)
      || getActivePartnerEnum().createConnectAPI
    )({ ...state });
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}connection-${
            activePartner.is_connected ? 'updated' : 'created'
          }-successfully`,
        ),
      );
      if (
        !activePartner.is_connected
        && state.enabled
        && getActivePartnerEnum().getInnerRedirectURIAPI
        && !getActivePartnerEnum().syncConnectAPI
      )
        await getRedirectURIHandler(getActivePartnerEnum().getInnerRedirectURIAPI);
      else if (
        state.enabled
        && onActionClicked
        && getActivePartnerEnum().syncConnectAPI
      )
        // if we needed in future to sync lookups & redirect, then that logic needs to be after sync (dialog confirmed or rejected)
        onActionClicked({
          key: SystemActionsEnum.sync.key,
          activePartner,
          isFromIntegrationForm: true,
        })();
      else {
        if (onIntegrationReload) onIntegrationReload();
        if (isOpenChanged) isOpenChanged();
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
      showError(
        t(
          `${translationPath}connection-${
            activePartner.is_connected ? 'update' : 'create'
          }-failed`,
        ),
        response,
      );
    }
  };

  const onExcludedEmailsChange = useCallback(
    (newValue) => {
      const localeValue = (newValue.value || []).filter((item) =>
        emailExpression.test(item),
      );
      if (localeValue.length !== newValue.value.length)
        showError(t('Shared:invalid-email'));
      setState({
        value: localeValue,
        id: 'excluded_emails',
      });
    },
    [t],
  );

  // this to get the data on init if there is a view API
  useEffect(() => {
    if (
      getActivePartnerEnum().getConnectAPI
      && (activePartner.is_connected || !getActivePartnerEnum().onlyCallGetIfConnected)
    )
      getEditInit().catch();
  }, [activePartner.is_connected, getActivePartnerEnum, getEditInit]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors().catch();
  }, [getErrors, state]);

  return (
    <>
      <DialogComponent
        maxWidth="sm"
        titleText="integrations"
        contentClasses="px-0"
        dialogContent={
          <div className="integrations-management-content-dialog-wrapper">
            {getActivePartnerEnum().apiKeyDescription && (
              <div className="mt-2 px-2">
                <Alert severity="warning">
                  {t(
                    `${translationPath}${getActivePartnerEnum().apiKeyDescription}`,
                  )}
                </Alert>
              </div>
            )}
            {(getActivePartnerEnum().apiKeyDescription
              || getIsExistKey({
                key: 'enabled',
                isAccountLevel: true,
              })) && <div className="separator-h mb-1 mt-3" />}
            {getIsExistKey({
              key: 'enabled',
              isAccountLevel: true,
            }) && (
              <div className="d-inline-flex-v-center px-2">
                <span className="inline-label-wrapper fw-bold">
                  {t(`${translationPath}${getActivePartnerEnum().enableTitle}`)}
                </span>
                <span className="d-inline-flex">
                  <SwitchComponent
                    isChecked={Boolean(state.enabled)}
                    onChange={onSwitchChangedHandler({ id: 'enabled' })}
                  />
                </span>
              </div>
            )}
            <div className="d-flex px-2 mb-3">
              {/*<span>{t(`${translationPath}fill-field-description`)}</span>*/}
              {/*<span className="px-1">{activePartner.title}</span>*/}
              <span>
                {t(`${translationPath}${getActivePartnerEnum().description}`)}
              </span>
            </div>
            <div className="d-flex flex-wrap">
              {getIsExistKey({
                key: 'track_id',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="tracking-id"
                  placeholder="tracking-id"
                  errors={errors}
                  stateKey="track_id"
                  errorPath="track_id"
                  inputWrapperClasses="px-2"
                  editValue={state.track_id}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'track_id' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'phone_number',
                isAccountLevel: true,
              }) && (
                <SharedPhoneControl
                  isFullWidth
                  errors={errors}
                  stateKey="phone_number"
                  countryCodeKey="country_code"
                  errorPath="phone_number"
                  isDisabled={isLoading || (state.is_disabled_phone && state.phone_number)}
                  isSubmitted={isSubmitted}
                  editValue={state.phone_number}
                  currentCountryCode={state.country_code}
                  title="phone-number"
                  onValueChanged={onStateChanged}
                  placeholder="phone-number"
                  inputWrapperClasses="px-3"
                  parentTranslationPath={parentTranslationPath}
                  excludeCountries={branchesReducer?.branches?.excluded_countries}
                />
              )}

              {getIsExistKey({
                key: 'tenant_id',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="tenant-id"
                  placeholder="tenant-id"
                  errors={errors}
                  stateKey="tenant_id"
                  errorPath="tenant_id"
                  inputWrapperClasses="px-2"
                  editValue={state.tenant_id || state.encrypted_secret_value}
                  isDisabled={
                    isLoading
                    || state.encrypted_secret_value
                    || getKeyItem({ key: 'tenant_id' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'client_id',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="client-id"
                  placeholder="client-id"
                  errors={errors}
                  stateKey="client_id"
                  errorPath="client_id"
                  inputWrapperClasses="px-2"
                  editValue={state.client_id || state.encrypted_secret_value}
                  isDisabled={
                    isLoading
                    || state.encrypted_secret_value
                    || getKeyItem({ key: 'client_id' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'domain',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="domain"
                  placeholder="domain"
                  errors={errors}
                  stateKey="domain"
                  errorPath="domain"
                  inputWrapperClasses="px-2"
                  editValue={state.domain}
                  isDisabled={isLoading || getKeyItem({ key: 'domain' }).isDisabled}
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'secret_value',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="secret-value"
                  placeholder="secret-value"
                  errors={errors}
                  stateKey="secret_value"
                  errorPath="secret_value"
                  inputWrapperClasses="px-2"
                  editValue={state.secret_value || state.encrypted_secret_value}
                  isDisabled={
                    isLoading
                    || state.encrypted_secret_value
                    || getKeyItem({ key: 'secret_value' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 're_sync_all_users',
                isAccountLevel: true,
              }) && (
                <div className="d-flex-v-center px-2">
                  <span className="inline-label-wrapper fw-bold">
                    {t(`${translationPath}enable-re-sync-all-users`)}
                  </span>
                  <span className="d-inline-flex">
                    <SwitchComponent
                      isChecked={Boolean(state.re_sync_all_users)}
                      onChange={(_, isChecked) => {
                        onStateChanged({
                          id: 're_sync_all_users',
                          value: isChecked,
                        });
                      }}
                    />
                  </span>
                </div>
              )}
              {getIsExistKey({
                key: 'is_attribute_enabled',
                isAccountLevel: true,
              }) && (
                <div className="d-inline-flex-v-center px-2">
                  <span className="inline-label-wrapper fw-bold">
                    {t(`${translationPath}manage-multi-domain-users-in-azure`)}
                  </span>
                  <span className="d-inline-flex">
                    <SwitchComponent
                      isChecked={Boolean(state.is_attribute_enabled)}
                      onChange={(_, isChecked) => {
                        onStateChanged({
                          id: 'destructObject',
                          value: {
                            is_attribute_enabled: isChecked,
                            // attribute_key: '',
                            // attribute_value: '',
                            // default_attribute_value: '',
                            // excluded_emails: [],
                          },
                        });
                      }}
                    />
                  </span>
                </div>
              )}
              {state.is_attribute_enabled ? (
                <>
                  {getIsExistKey({
                    key: 'attribute_key',
                    isAccountLevel: true,
                  }) && (
                    <SharedInputControl
                      isFullWidth
                      inlineLabelClasses="azure-sso-attribute-label"
                      inlineLabel="attribute-key"
                      placeholder="attribute-key"
                      errors={errors}
                      stateKey="attribute_key"
                      errorPath="attribute_key"
                      inputWrapperClasses="px-2"
                      editValue={state.attribute_key}
                      isDisabled={
                        isLoading || getKeyItem({ key: 'attribute_key' }).isDisabled
                      }
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                  {getIsExistKey({
                    key: 'attribute_value',
                    isAccountLevel: true,
                  }) && (
                    <SharedInputControl
                      isFullWidth
                      inlineLabelClasses="azure-sso-attribute-label"
                      inlineLabel="attribute-value"
                      placeholder="attribute-value"
                      errors={errors}
                      stateKey="attribute_value"
                      errorPath="attribute_value"
                      inputWrapperClasses="px-2"
                      editValue={state.attribute_value}
                      isDisabled={
                        isLoading
                        || getKeyItem({ key: 'attribute_value' }).isDisabled
                      }
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                  {getIsExistKey({
                    key: 'default_attribute_value',
                    isAccountLevel: true,
                  }) && (
                    <SharedInputControl
                      isFullWidth
                      inlineLabelClasses="azure-sso-attribute-label"
                      inlineLabel="default-attribute-value"
                      placeholder="default-attribute-value"
                      errors={errors}
                      stateKey="default_attribute_value"
                      errorPath="default_attribute_value"
                      inputWrapperClasses="px-2"
                      editValue={state.default_attribute_value}
                      isDisabled={
                        isLoading
                        || getKeyItem({ key: 'default_attribute_value' }).isDisabled
                      }
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                  {getIsExistKey({
                    key: 'excluded_emails',
                    isAccountLevel: true,
                  }) && (
                    <SharedAutocompleteControl
                      isFullWidth
                      inlineLabelClasses="azure-sso-attribute-label"
                      inlineLabel="excluded-emails"
                      sharedClassesWrapper={'px-2'}
                      errors={errors}
                      isFreeSolo
                      placeholder="press-enter-to-add"
                      type={DynamicFormTypesEnum.array.key}
                      stateKey="excluded_emails"
                      errorPath="excluded_emails"
                      editValue={state.excluded_emails || []}
                      isDisabled={
                        isLoading
                        || getKeyItem({ key: 'excluded_emails' }).isDisabled
                      }
                      isSubmitted={isSubmitted}
                      onValueChanged={onExcludedEmailsChange}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  )}
                </>
              ) : (
                ''
              )}
              {getIsExistKey({
                key: 'is_sync_enabled',
                isAccountLevel: true,
              }) && (
                <div className="d-flex-v-center px-2">
                  <span className="inline-label-wrapper fw-bold">
                    {t(`${translationPath}enable-sync-users`)}
                  </span>
                  <span className="d-inline-flex">
                    <SwitchComponent
                      isChecked={Boolean(state.is_sync_enabled)}
                      onChange={(_, isChecked) => {
                        onStateChanged({
                          id: 'destructObject',
                          value: {
                            is_sync_enabled: isChecked,
                            // sync_schedule:""
                          },
                        });
                      }}
                    />
                  </span>
                </div>
              )}

              {getIsExistKey({
                key: 'upside_client_key',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="client-key"
                  placeholder="client-key"
                  errors={errors}
                  stateKey="upside_client_key"
                  errorPath="upside_client_key"
                  inputWrapperClasses="px-2"
                  editValue={state.upside_client_key}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'upside_client_key' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'context_path',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="context-path"
                  placeholder="context-path"
                  errors={errors}
                  stateKey="context_path"
                  errorPath="context_path"
                  inputWrapperClasses="px-2"
                  editValue={state.context_path}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'context_path' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'upside_auth_url',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="auth-url"
                  placeholder="auth-url"
                  errors={errors}
                  stateKey="upside_auth_url"
                  errorPath="upside_auth_url"
                  inputWrapperClasses="px-2"
                  editValue={state.upside_auth_url}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'upside_auth_url' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'upside_manage_user_url',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="manage-user-url"
                  placeholder="manage-user-url"
                  errors={errors}
                  stateKey="upside_manage_user_url"
                  errorPath="upside_manage_user_url"
                  inputWrapperClasses="px-2"
                  editValue={state.upside_manage_user_url}
                  isDisabled={
                    isLoading
                    || getKeyItem({ key: 'upside_manage_user_url' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}

              {state.is_sync_enabled ? (
                <>
                  {getIsExistKey({
                    key: 'sync_schedule',
                    isAccountLevel: true,
                  }) && (
                    <SharedAutocompleteControl
                      isFullWidth
                      sharedClassesWrapper={'px-2'}
                      inlineLabelClasses="azure-sso-attribute-label"
                      inlineLabel="sync-schedule"
                      stateKey="sync_schedule"
                      errors={errors}
                      errorPath="sync_schedule"
                      placeholder="select-sync-schedule-type"
                      onValueChanged={onStateChanged}
                      initValues={azureSyncOptions}
                      initValuesTitle="value"
                      initValuesKey="key"
                      editValue={state.sync_schedule || []}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isSubmitted={isSubmitted}
                      isDisabled={
                        isLoading || getKeyItem({ key: 'sync_schedule' }).isDisabled
                      }
                    />
                  )}
                </>
              ) : (
                ''
              )}
              {getIsExistKey({
                key: 'events',
                isAccountLevel: true,
              }) && (
                <>
                  {state?.events?.map((event, idx) => (
                    <div key={event.event_name} className="d-flex mx-1 ">
                      <CheckboxesComponent
                        isDisabled={isLoading}
                        idRef={`checkbox-${event.event_name}`}
                        singleChecked={event.enabled}
                        onSelectedCheckboxChanged={(eventInternal, isChecked) => {
                          onStateChanged({
                            parentId: 'events',
                            parentIndex: idx,
                            id: 'enabled',
                            value: isChecked,
                          });
                        }}
                        label={
                          <div className="checkbox-inline-label-wrapper">
                            <small className="m-0 text-pending-muted d-block">
                              {event?.inputLabel}
                            </small>
                          </div>
                        }
                      />
                      <SharedInputControl
                        isHalfWidth
                        isDisabled={isLoading}
                        isSubmitted={isSubmitted}
                        parentId={'events'}
                        parentIndex={idx}
                        errors={errors}
                        errorPath={`events[${idx}].label`}
                        stateKey={`label`}
                        placeholder="event-name"
                        onValueChanged={onStateChanged}
                        parentTranslationPath={parentTranslationPath}
                        editValue={event.label}
                      />{' '}
                    </div>
                  ))}
                </>
              )}
              {getIsExistKey({
                key: 'developer_name',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="developer-name"
                  placeholder="developer-name"
                  errors={errors}
                  stateKey="developer_name"
                  errorPath="developer_name"
                  inputWrapperClasses="px-2"
                  editValue={state.developer_name}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'developer_name' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'developer_email',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="developer-email"
                  placeholder="developer-email"
                  errors={errors}
                  stateKey="developer_email"
                  errorPath="developer_email"
                  inputWrapperClasses="px-2"
                  editValue={state.developer_email}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'developer_email' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'application_name',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="application-name"
                  placeholder="application-name"
                  errors={errors}
                  stateKey="application_name"
                  errorPath="application_name"
                  inputWrapperClasses="px-2"
                  editValue={state.application_name}
                  isDisabled={
                    isLoading || getKeyItem({ key: 'application_name' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}

              {getIsExistKey({
                key: 'slug',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="organization-slug"
                  placeholder="organization-slug"
                  errors={errors}
                  stateKey="slug"
                  errorPath="slug"
                  inputWrapperClasses="px-2"
                  editValue={state.slug}
                  isDisabled={
                    isLoading
                    || Boolean(state.encrypted_api_key)
                    || Boolean(state.encrypted_password)
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'hcm_instance_url',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="hcm-instance-url"
                  placeholder="hcm-instance-url"
                  errors={errors}
                  stateKey="hcm_instance_url"
                  errorPath="hcm_instance_url"
                  inputWrapperClasses="px-2"
                  editValue={state.hcm_instance_url}
                  isDisabled={
                    isLoading
                    || Boolean(state.encrypted_password)
                    || getKeyItem({ key: 'hcm_instance_url' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'hcm_username',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="hcm-user-name"
                  placeholder="hcm-user-name"
                  errors={errors}
                  stateKey="hcm_username"
                  errorPath="hcm_username"
                  inputWrapperClasses="px-2"
                  editValue={state.hcm_username}
                  isDisabled={
                    isLoading
                    || Boolean(state.encrypted_password)
                    || getKeyItem({ key: 'hcm_username' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'hcm_password',
                isAccountLevel: true,
              }) && (
                <SharedInputControl
                  isFullWidth
                  inlineLabel="hcm-password"
                  placeholder="hcm-password"
                  errors={errors}
                  stateKey="hcm_password"
                  errorPath="hcm_password"
                  inputWrapperClasses="px-2"
                  editValue={state.hcm_password || state.encrypted_password}
                  isDisabled={
                    isLoading
                    || Boolean(state.encrypted_password)
                    || getKeyItem({ key: 'hcm_password' }).isDisabled
                  }
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {getIsExistKey({
                key: 'api_key',
                isAccountLevel: true,
                value: state.api_key || state.encrypted_api_key,
              }) && (
                <div className="api-key-input-wrapper">
                  <SharedInputControl
                    isFullWidth
                    inlineLabel="api-key"
                    placeholder="api-key"
                    inputWrapperClasses="px-2"
                    errors={errors}
                    stateKey="api_key"
                    errorPath="api_key"
                    editValue={state.api_key || state.encrypted_api_key}
                    isDisabled={
                      isLoading
                      || Boolean(state.encrypted_api_key)
                      || getKeyItem({ key: 'api_key' }).isDisabled
                    }
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                  {getKeyItem({ key: 'api_key' }).regenerateAPI && (
                    <div className="d-inline-flex fa-start pt-1">
                      <ButtonBase
                        className="btns theme-solid mx-2"
                        onClick={onRegenerateKeyClicked({
                          isAccountLevel: true,
                          key: 'api_key',
                        })}
                      >
                        <span>{t(`${translationPath}regenerate`)}</span>
                      </ButtonBase>
                    </div>
                  )}
                </div>
              )}
              {getIsExistKey({
                key: 'api_secret',
                isAccountLevel: true,
                value: state.api_secret,
              }) && (
                <div className="api-key-input-wrapper">
                  <SharedInputControl
                    isFullWidth
                    inlineLabel="api-secret"
                    placeholder="api-secret"
                    inputWrapperClasses="px-2"
                    errors={errors}
                    stateKey="api_secret"
                    errorPath="api_secret"
                    editValue={state.api_secret}
                    isDisabled={
                      isLoading || getKeyItem({ key: 'api_secret' }).isDisabled
                    }
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                  />
                  {getKeyItem({ key: 'api_secret' }).regenerateAPI && (
                    <div className="d-inline-flex fa-start pt-1">
                      <ButtonBase
                        className="btns theme-solid mx-2"
                        onClick={onRegenerateKeyClicked({
                          isAccountLevel: true,
                          key: 'api_secret',
                        })}
                      >
                        <span>{t(`${translationPath}regenerate`)}</span>
                      </ButtonBase>
                    </div>
                  )}
                </div>
              )}
            </div>
            {getIsExistKey({
              key: 'revoke_api_key',
              isAccountLevel: true,
            })
              && (state.encrypted_api_key
                || state.encrypted_password
                || state.encrypted_secret_value) && (
              <div>
                <ButtonBase
                  className="btns theme-solid bg-danger"
                  onClick={revokeBranchHandler({ isAccountLevel: true })}
                >
                  <span>{t(`${translationPath}revoke-integration`)}</span>
                </ButtonBase>
              </div>
            )}

            {getIsExistKey({
              key: 'is_sso_branch_level',
              isAccountLevel: true,
            }) && (
              <>
                <div className="separator-h mb-1 mt-3" />
                <div className="d-flex-v-center px-2">
                  <span className="inline-label-wrapper fw-bold">
                    {t(`${translationPath}enable-sso-on-branch-level`)}
                  </span>
                  <span className="d-inline-flex">
                    <SwitchComponent
                      idRef="hasSSOCompanyLevelConfigRef"
                      isChecked={Boolean(state.is_sso_branch_level)}
                      isReversedLabel
                      onChange={onSwitchChangedHandler({
                        id: 'is_sso_branch_level',
                      })}
                    />
                  </span>
                </div>
                <div className="branches-configuration-items-wrapper">
                  {state?.branch_group_config?.map((item, index, items) => (
                    <div
                      key={`companyLevelConfigKey${index + 1}`}
                      className="branches-configuration-card-wrapper"
                    >
                      <div className="branches-configuration-card-header">
                        <ButtonBase
                          className="btns-icon theme-transparent"
                          onClick={addBranchHandler({
                            index,
                            item,
                            items,
                            id: 'branch_group_config',
                          })}
                        >
                          <span className="fas fa-plus" />
                        </ButtonBase>
                        <ButtonBase
                          className="btns-icon theme-transparent"
                          onClick={removeBranchHandler({
                            index,
                            item,
                            items,
                            id: 'branch_group_config',
                          })}
                        >
                          <span className="fas fa-times" />
                        </ButtonBase>
                      </div>
                      <div className="branches-configuration-card-body">
                        {getIsExistKey({
                          key: 'company_uuid',
                          isAccountLevel: false,
                        }) && (
                          <SharedAPIAutocompleteControl
                            isFullWidth
                            errors={errors}
                            searchKey="search"
                            inlineLabel="branch"
                            errorPath={`branch_group_config[${index}].company_uuid`}
                            parentId="branch_group_config"
                            parentIndex={index}
                            isDisabled={isLoading}
                            isSubmitted={isSubmitted}
                            placeholder="select-branch"
                            stateKey="company_uuid"
                            onValueChanged={(newValue) => {
                              onStateChanged(newValue);
                              onStateChanged({
                                ...newValue,
                                id: 'permissions',
                                value: [],
                              });
                            }}
                            editValue={item.company_uuid}
                            getDataAPI={GetAllSetupsBranches}
                            extraProps={{
                              ...(item.company_uuid && {
                                with_than: [item.company_uuid],
                              }),
                            }}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            getOptionLabel={(option) =>
                              (option.name
                                && (option.name[i18next.language]
                                  || option.name.en
                                  || 'N/A'))
                              || 'N/A'
                            }
                          />
                        )}
                        {getIsExistKey({
                          key: 'group_name',
                          isAccountLevel: false,
                        }) && (
                          <SharedInputControl
                            isFullWidth
                            inlineLabel="azure-group-name"
                            placeholder="azure-group-name"
                            errors={errors}
                            stateKey="group_name"
                            errorPath={`branch_group_config[${index}].group_name`}
                            parentId="branch_group_config"
                            parentIndex={index}
                            editValue={item.group_name}
                            isDisabled={isLoading}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                        )}
                        {getIsExistKey({
                          key: 'enabled',
                          isAccountLevel: false,
                        }) && (
                          <div>
                            <SwitchComponent
                              idRef="hasCompanyLevelConfigRef"
                              inlineLabel="enable-branch"
                              isChecked={Boolean(item.enabled)}
                              isDisabled={isLoading}
                              isReversedLabel
                              // labelPlacement="left"
                              onChange={onSwitchChangedHandler({
                                id: 'enabled',
                                parentId: 'branch_group_config',
                                parentIndex: index,
                              })}
                              parentTranslationPath={parentTranslationPath}
                              translationPath={translationPath}
                            />
                          </div>
                        )}
                      </div>
                      {getIsExistKey({
                        key: 'revoke_api_key',
                        isAccountLevel: false,
                      })
                        && (item.encrypted_api_key || item.encrypted_password) && (
                        <div className="branches-configuration-card-footer">
                          <ButtonBase
                            className="btns theme-solid bg-danger mx-0 mb-2"
                            onClick={revokeBranchHandler({
                              index,
                              item,
                              isAccountLevel: false,
                            })}
                          >
                            <span>
                              {t(`${translationPath}revoke-integration`)}
                            </span>
                          </ButtonBase>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="separator-h mb-1 mt-3" />

            {getIsExistKey({
              key: 'has_company_level_config',
              isAccountLevel: true,
            }) && (
              <div className="d-flex-v-center px-2">
                <span className="inline-label-wrapper fw-bold">
                  {t(`${translationPath}enable-specific-branch-configuration`)}
                </span>
                <span className="d-inline-flex">
                  <SwitchComponent
                    idRef="hasCompanyLevelConfigRef"
                    isChecked={Boolean(state.has_company_level_config)}
                    isReversedLabel
                    onChange={onSwitchChangedHandler({
                      id: 'has_company_level_config',
                    })}
                  />
                </span>
              </div>
            )}
            {getIsExistKey({
              key: 'has_company_level_config',
              isAccountLevel: true,
            }) && (
              <div className="branches-configuration-items-wrapper">
                {state?.company_level_config?.map((item, index, items) => (
                  <div
                    key={`companyLevelConfigKey${index + 1}`}
                    className="branches-configuration-card-wrapper"
                  >
                    <div className="branches-configuration-card-header">
                      <ButtonBase
                        className="btns-icon theme-transparent"
                        onClick={addBranchHandler({
                          index,
                          item,
                          items,
                          id: 'company_level_config',
                        })}
                      >
                        <span className="fas fa-plus" />
                      </ButtonBase>
                      <ButtonBase
                        className="btns-icon theme-transparent"
                        onClick={removeBranchHandler({
                          index,
                          item,
                          items,
                          id: 'company_level_config',
                        })}
                      >
                        <span className="fas fa-times" />
                      </ButtonBase>
                    </div>
                    <div className="branches-configuration-card-body">
                      {getIsExistKey({
                        key: 'company_uuid',
                        isAccountLevel: false,
                      }) && (
                        <SharedAPIAutocompleteControl
                          isFullWidth
                          errors={errors}
                          searchKey="search"
                          inlineLabel="branch"
                          errorPath={`company_level_config[${index}].company_uuid`}
                          parentId="company_level_config"
                          parentIndex={index}
                          isDisabled={isLoading}
                          isSubmitted={isSubmitted}
                          placeholder="select-branch"
                          stateKey="company_uuid"
                          onValueChanged={(newValue) => {
                            onStateChanged(newValue);
                            onStateChanged({
                              ...newValue,
                              id: 'permissions',
                              value: [],
                            });
                          }}
                          editValue={item.company_uuid}
                          getDataAPI={GetAllSetupsBranches}
                          extraProps={{
                            ...(item.company_uuid && {
                              with_than: [item.company_uuid],
                            }),
                          }}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                          getOptionLabel={(option) =>
                            (option.name
                              && (option.name[i18next.language]
                                || option.name.en
                                || 'N/A'))
                            || 'N/A'
                          }
                        />
                      )}
                      {getIsExistKey({
                        key: 'slug',
                        isAccountLevel: false,
                      }) && (
                        <SharedInputControl
                          isFullWidth
                          inlineLabel="organization-slug"
                          placeholder="organization-slug"
                          errors={errors}
                          stateKey="slug"
                          errorPath={`company_level_config[${index}].slug`}
                          parentId="company_level_config"
                          parentIndex={index}
                          editValue={item.slug}
                          isDisabled={
                            isLoading
                            || Boolean(item.encrypted_api_key)
                            || Boolean(item.encrypted_password)
                          }
                          isSubmitted={isSubmitted}
                          onValueChanged={onStateChanged}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                        />
                      )}{' '}
                      {getIsExistKey({
                        key: 'permissions',
                        isAccountLevel: false,
                      }) && (
                        <SharedAPIAutocompleteControl
                          isFullWidth
                          errors={errors}
                          inputWrapperClasses="px-2"
                          searchKey="search"
                          inlineLabel="permissions"
                          isSubmitted={isSubmitted}
                          stateKey="permissions"
                          parentId="company_level_config"
                          parentIndex={index}
                          onValueChanged={onStateChanged}
                          editValue={item.permissions}
                          placeholder="select-permissions"
                          translationPath={translationPath}
                          getDataAPI={GetAllSetupsPermissions}
                          getItemByIdAPI={GetSetupsPermissionsById}
                          type={DynamicFormTypesEnum.array.key}
                          isDisabled={
                            isLoading
                            || !item.company_uuid
                            || getKeyItem({
                              key: 'permissions',
                              isAccountLevel: false,
                            }).isDisabled
                          }
                          parentTranslationPath={parentTranslationPath}
                          errorPath={`company_level_config[${index}].permissions`}
                          getOptionLabel={(option) =>
                            option.title[i18next.language] || option.title.en
                          }
                          extraProps={{
                            company_uuid: item.company_uuid,
                            status:true,
                            ...(item.permissions?.length && {
                              with_than: item.permissions,
                            }),
                          }}
                        />
                      )}
                      {getIsExistKey({
                        key: 'hcm_instance_url',
                        isAccountLevel: false,
                      }) && (
                        <SharedInputControl
                          isFullWidth
                          inlineLabel="hcm-instance-url"
                          placeholder="hcm-instance-url"
                          errors={errors}
                          stateKey="hcm_instance_url"
                          parentId="company_level_config"
                          parentIndex={index}
                          errorPath={`company_level_config[${index}].hcm_instance_url`}
                          inputWrapperClasses="px-2"
                          editValue={item.hcm_instance_url}
                          isDisabled={
                            isLoading
                            || Boolean(item.encrypted_api_key)
                            || Boolean(item.encrypted_password)
                            || getKeyItem({
                              key: 'hcm_instance_url',
                              isAccountLevel: false,
                            }).isDisabled
                          }
                          isSubmitted={isSubmitted}
                          onValueChanged={onStateChanged}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                        />
                      )}
                      {getIsExistKey({
                        key: 'hcm_username',
                        isAccountLevel: false,
                      }) && (
                        <SharedInputControl
                          isFullWidth
                          inlineLabel="hcm-user-name"
                          placeholder="hcm-user-name"
                          errors={errors}
                          stateKey="hcm_username"
                          parentId="company_level_config"
                          parentIndex={index}
                          errorPath={`company_level_config[${index}].hcm_username`}
                          inputWrapperClasses="px-2"
                          editValue={item.hcm_username}
                          isDisabled={
                            isLoading
                            || Boolean(item.encrypted_api_key)
                            || Boolean(item.encrypted_password)
                            || getKeyItem({
                              key: 'hcm_username',
                              isAccountLevel: false,
                            }).isDisabled
                          }
                          isSubmitted={isSubmitted}
                          onValueChanged={onStateChanged}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                        />
                      )}
                      {getIsExistKey({
                        key: 'hcm_password',
                        isAccountLevel: false,
                      }) && (
                        <SharedInputControl
                          isFullWidth
                          inlineLabel="hcm-password"
                          placeholder="hcm-password"
                          errors={errors}
                          stateKey="hcm_password"
                          parentId="company_level_config"
                          parentIndex={index}
                          errorPath={`company_level_config[${index}].hcm_password`}
                          inputWrapperClasses="px-2"
                          editValue={item.hcm_password}
                          isDisabled={
                            isLoading
                            || Boolean(item.encrypted_password)
                            || getKeyItem({
                              key: 'hcm_password',
                              isAccountLevel: false,
                            }).isDisabled
                          }
                          isSubmitted={isSubmitted}
                          onValueChanged={onStateChanged}
                          parentTranslationPath={parentTranslationPath}
                          translationPath={translationPath}
                        />
                      )}
                      {getIsExistKey({
                        key: 'api_key',
                        isAccountLevel: false,
                      }) && (
                        <div className="api-key-input-wrapper">
                          <SharedInputControl
                            isFullWidth
                            inlineLabel="api-key"
                            placeholder="api-key"
                            errors={errors}
                            stateKey="api_key"
                            parentId="company_level_config"
                            parentIndex={index}
                            errorPath={`company_level_config[${index}].api_key`}
                            editValue={item.api_key || item.encrypted_api_key}
                            isDisabled={isLoading || Boolean(item.encrypted_api_key)}
                            isSubmitted={isSubmitted}
                            onValueChanged={onStateChanged}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                          {/*{item.encrypted_api_key && (*/}
                          {/*  <ButtonBase*/}
                          {/*    className="btns theme-solid px-2"*/}
                          {/*    onClick={onVerifyAPIKey({*/}
                          {/*      isAccountLevel: true,*/}
                          {/*    })}*/}
                          {/*  >*/}
                          {/*    <span>{t(`${translationPath}verify-api-key`)}</span>*/}
                          {/*  </ButtonBase>*/}
                          {/*)}*/}
                        </div>
                      )}
                      {getIsExistKey({
                        key: 'enabled',
                        isAccountLevel: false,
                      }) && (
                        <div>
                          <SwitchComponent
                            idRef="hasCompanyLevelConfigRef"
                            inlineLabel="enable-branch"
                            isChecked={Boolean(item.enabled)}
                            isDisabled={isLoading}
                            isReversedLabel
                            // labelPlacement="left"
                            onChange={onSwitchChangedHandler({
                              id: 'enabled',
                              parentId: 'company_level_config',
                              parentIndex: index,
                            })}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                        </div>
                      )}
                    </div>
                    {getIsExistKey({
                      key: 'revoke_api_key',
                      isAccountLevel: false,
                    })
                      && (item.encrypted_api_key || item.encrypted_password) && (
                      <div className="branches-configuration-card-footer">
                        <ButtonBase
                          className="btns theme-solid bg-danger mx-0 mb-2"
                          onClick={revokeBranchHandler({
                            index,
                            item,
                            isAccountLevel: false,
                          })}
                        >
                          <span>{t(`${translationPath}revoke-integration`)}</span>
                        </ButtonBase>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        }
        wrapperClasses="integrations-management-dialog-wrapper"
        isSaving={isLoading}
        isOpen={isOpen}
        isEdit={activePartner.is_connected}
        onSubmit={saveHandler}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          // activeItem={activeItem}
          successMessage="integration-revoked-successfully"
          onSave={() => {
            onIntegrationReload();
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (getActivePartnerEnum().getConnectAPI) getEditInit().catch();
          }}
          descriptionMessage="integration-revoke-description"
          deleteApi={getActivePartnerEnum().revokeConnectAPI}
          apiProps={{
            company_uuid:
              (!activeItem.isAccountLevel && activeItem.item.company_uuid) || null,
            configuration_level: activeItem.isAccountLevel ? 'account' : 'company',
          }}
          errorMessage="integration-revoke-failed"
          // activeItemKey="uuid"
          // apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </>
  );
};

ActiveIntegrationsDialog.propTypes = {
  activePartner: PropTypes.shape({
    partner: PropTypes.oneOf(
      Object.values(IntegrationsPartnersEnum).map((item) => item.key),
    ),
    title: PropTypes.string,
    is_connected: PropTypes.bool,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  getRedirectURIHandler: PropTypes.func.isRequired,
  onActionClicked: PropTypes.func.isRequired,
  getActivePartnerEnum: PropTypes.func.isRequired,
  onIntegrationReload: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default ActiveIntegrationsDialog;
