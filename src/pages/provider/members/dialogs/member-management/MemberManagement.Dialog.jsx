import React, { useCallback, useReducer, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent, TabsComponent } from '../../../../../components';
import {
  UpdateProviderMember,
  InviteProviderMember,
  getProviderMemberById,
} from '../../../../../services';
import { SetupsReducer, SetupsReset } from 'pages/setups/shared';
import { emailExpression } from 'utils';
import { ProviderMemberManagamentTabs } from 'pages/setups/shared/tabs-data';

export const ProviderMemberManagementDialog = ({
  onSave,
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [providerTabsData] = useState(() => ProviderMemberManagamentTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saveClickedCount, setSaveClickedCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const userReducer = useSelector((state) => state?.userReducer);
  const accountReducer = useSelector((reducerState) => reducerState?.accountReducer);

  const stateInitRef = useRef({
    first_name: '',
    second_name: '',
    third_name: '',
    last_name: '',
    email: '',
    is_active: true,
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
                  branch_uuid: yup
                    .string()
                    .nullable()
                    .required(t('this-field-is-required')),
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
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getProviderMemberById({
      member_uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: {
          ...response.data.results,
          ...(response.data.results.member_logo_url && {
            member_logo: {
              url: response.data.results.member_logo_url,
              uuid: response.data.results.member_logo_uuid,
              type: 'image',
            },
          }),
        },
      });
  }, [activeItem]);

  const saveHandler = async (event) => {
    event.preventDefault();
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
      response = await UpdateProviderMember({
        ...state,
        email: state?.email?.toLowerCase(),
        type: userReducer?.results?.user?.type, // check later
        member_uuid: activeItem.uuid,
        account_uuid: accountReducer?.account_uuid,
      });
    else
      response = await InviteProviderMember({
        ...state,
        email: state?.email?.toLowerCase(),
        type: userReducer?.results?.user?.type, // check later
        account_uuid: accountReducer?.account_uuid, // change later to selected account
      });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'member-updated-successfully')
            || 'member-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'member-update-failed') || 'member-create-failed'
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
      titleText={(activeItem && `edit-member`) || `add-new-member`}
      dialogContent={
        <div>
          <TabsComponent
            isPrimary
            isWithLine
            customLabel={`invite-member`}
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

ProviderMemberManagementDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
ProviderMemberManagementDialog.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};
