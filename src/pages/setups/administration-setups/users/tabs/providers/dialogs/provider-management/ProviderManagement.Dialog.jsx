import React, { useCallback, useReducer, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../shared';
import { DialogComponent, TabsComponent } from '../../../../../../../../components';
import {
  UpdateSetupsProviders,
  InviteSetupsProviders,
  getSetupsProvidersById,
} from '../../../../../../../../services';
import './ProviderManagement.Style.scss';
import { ProviderManagementTabs } from '../../../../../../shared/tabs-data';
import { emailExpression } from '../../../../../../../../utils';
import { ProfileSourcesTypesEnum } from '../../../../../../../../enums';

export const ProviderManagementDialog = ({
  onSave,
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  userType,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [providerTabsData] = useState(() => ProviderManagementTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveClickedCount, setSaveClickedCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const userReducer = useSelector((state) => state?.userReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);

  const stateInitRef = useRef({
    first_name: '',
    email: '',
    is_active: true,
    type: userType,
    rating: {
      avg_rating: 0,
      rated_at: null,
      rating_criteria: [
        {
          uuid: null,
          name: '',
          rate: 0,
          ratings_num: 0,
        },
      ],
    },
    enable_terms: false,
    terms_conditions_content: '',
    // media_uuid: null, // check later
    access: [
      {
        branch_uuid: '',
        permissions: [],
        jobs: [],
      },
    ],
    automatic_assign: false,
    assignee: [],
  });

  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('invalid-email'),
              excludeEmptyString: true,
            })
            .required(t('this-field-is-required')),
          first_name: yup.string().nullable().required(t('this-field-is-required')),
          access: yup
            .array()
            .nullable()
            .of(
              yup
                .object()
                .nullable()
                .shape({
                  branch_uuid: yup.string().required(t('this-field-is-required')),
                  permissions: yup
                    .array()
                    .nullable()
                    .min(
                      1,
                      `${t('please-select-at-least')} ${1} ${t('permission')}`,
                    ),
                }),
            )
            .required(`${t('please-add-at-least')} ${1} ${t('access')}`),
          rating: yup
            .object()
            .shape({
              rating_criteria: yup
                .array()
                .of(
                  yup.object().shape({
                    name: yup.string().required(t('this-field-is-required')),
                  }),
                )
                .min(
                  1,
                  `${t('please-select-at-least')} ${1} ${t('rating-criteria')}`,
                ),
            })
            .required(`${t('please-add-at-least')} ${1} ${t('access')}`),
          assignee: yup
            .array()
            .nullable()
            .of(
              yup
                .object()
                .nullable()
                .shape({
                  branch_uuid: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
                  category: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
                  assignee_type: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
                  assignee_uuid: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
                  positions: yup
                    .array()
                    .nullable()
                    .min(1, `${t('please-select-at-least')} ${1} ${t('positions')}`),
                }),
            )
            .required(`${t('please-add-at-least')} ${1} ${t('assignee')}`),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsProvidersById({
      provider_uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: {
          ...response.data.results,
          automatic_assign: response.data.results.automatic_assign || false,
          assignee: response.data.results.assignee || [],
          ...(response.data.results.account_logo_url && {
            account_logo: {
              url: response.data.results.account_logo_url,
              uuid: response.data.results.account_logo_uuid,
              type: 'image',
            },
          }),
          ...(response.data.results.provider_logo_url && {
            provider_logo: {
              url: response.data.results.provider_logo_url,
              uuid: response.data.results.provider_logo_uuid,
              type: 'image',
            },
          }),
        },
      });
  }, [activeItem]);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.title) showError(errors.title.message);
      return;
    }

    setIsSubmitted(true);
    setSaveClickedCount((item) => item + 1);

    // const keys = Object.keys(errors);
    // if (keys.length) {
    //   if (keys.every((key) => key.startsWith('user_access') && activeTab === 0))
    //     setActiveTab(1);
    //   else if (!keys.some((key) => key.startsWith('user_access'))) setActiveTab(0);
    //   return;
    // }

    setIsLoading(true);
    let response;
    if (activeItem)
      response = await UpdateSetupsProviders({
        ...state,
        email: state?.email?.toLowerCase(),
        account_uuid: accountReducer?.account_uuid,
        provider_uuid: activeItem.uuid,
        rating_criteria: state.rating?.rating_criteria,
      });
    else
      response = await InviteSetupsProviders({
        ...state,
        email: state?.email?.toLowerCase(),
        account_uuid: accountReducer?.account_uuid,
        rating_criteria: state.rating?.rating_criteria?.map((item) => item?.name),
      });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (!activeItem && userType === ProfileSourcesTypesEnum.Agency.userType)
        window?.ChurnZero?.push([
          'trackEvent',
          `EVA-Agency - Agency added to the system`,
          `Agency added to the system`,
          1,
          {},
        ]);
      // window?.ChurnZero?.push(['trackEvent', `Create a new ${userType}`, `Create a new ${userType} from setups`, 1, {}]);
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'provider-updated-successfully')
            || 'provider-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'provider-update-failed') || 'provider-create-failed'
          }`,
        ),
        response,
      );
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (activeItem && userReducer?.results?.user?.uuid) getEditInit();
  }, [activeItem, getEditInit, userReducer]);

  return (
    <DialogComponent
      maxWidth="lg"
      titleText={(activeItem && `edit-${userType}`) || `add-new-${userType}`}
      dialogContent={
        <div>
          <TabsComponent
            isPrimary
            isWithLine
            customLabel={`invite-${userType}`}
            labelInput="label"
            idRef="providerTabsRef"
            tabsContentClasses="pt-3"
            data={providerTabsData}
            currentTab={activeTab}
            translationPath={translationPath}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              state,
              errors,
              onStateChanged,
              isSubmitted,
              saveClickedCount,
              isLoading,
              parentTranslationPath,
              translationPath,
              userType,
              isEdit: activeItem ? true : false,
            }}
          />
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

ProviderManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  userType: PropTypes.oneOf(['agency', 'university']).isRequired,
};
ProviderManagementDialog.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};
