import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllSetupsEmployees,
  GetAllSetupsUsers,
  GetSecurityMFARecoveryCodes,
  SecurityGenerateMFARecoveryCodes,
} from '../../../../services';
import i18next from 'i18next';
import { AssigneeTypesEnum } from '../../../../enums';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../shared';
import { ButtonBase } from '@mui/material';
import {
  copyTextToClipboard,
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../helpers';
import { NavItem } from 'reactstrap';
import { useSelector } from 'react-redux';
import { MFAPermissions } from '../../../../permissions/setups/security/MFA.Permissions';

const parentTranslationPath = 'SetupsPage';
const translationPath = 'SecurityPages.';
const RecoveryCode = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    userType: '',
    user: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState();
  const [usersTypes] = useState(() =>
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: item.value,
    })),
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const BackupCodes = async () => {
    setIsLoading(true);
    const response = await GetSecurityMFARecoveryCodes({
      user_email: state?.user?.email,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201))
      setBackupCodes(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  const GenerateNewRecoveryCode = async () => {
    setIsLoading(true);
    const response = await SecurityGenerateMFARecoveryCodes({
      user_email: state?.user?.email,
    });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setBackupCodes(response.data.results);
      showSuccess(
        t(`${translationPath}generate-new-recovery-code-created-successfully`),
      );
      BackupCodes();
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  return (
    <div className="security-recovery-wrapper">
      <div className="header-text">
        <span>{t(`${translationPath}recovery-codes`)}</span>
      </div>
      <div className="body-item-wrapper my-2">
        <span className="description-text">
          {t(`${translationPath}recovery-description`)}
        </span>
      </div>
      <div className="mt-3">
        <SharedAutocompleteControl
          editValue={state.userType}
          placeholder="select-user-type"
          inlineLabel="user-type"
          stateKey="usersTypes"
          isHalfWidth
          initValuesTitle="value"
          onValueChanged={(newValue) => {
            setState((items) => ({ ...items, userType: newValue.value }));
            setBackupCodes(null);
          }}
          initValues={usersTypes}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={isLoading}
        />
        {state.userType && (
          <div className="d-inline-flex-v-center flex-wrap w-100 pl-5-reversed">
            {state.userType === AssigneeTypesEnum.User.key && (
              <SharedAPIAutocompleteControl
                isEntireObject
                isHalfWidth
                inlineLabel="user"
                placeholder="select-user"
                stateKey="user"
                onValueChanged={(newValue) => {
                  setState((items) => ({ ...items, user: newValue.value }));
                  setBackupCodes(null);
                }}
                getOptionLabel={(option) =>
                  `${
                    option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en)
                  }${
                    option.last_name
                    && ` ${option.last_name[i18next.language] || option.last_name.en}`
                  }` || 'N/A'
                }
                getDataAPI={GetAllSetupsUsers}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                searchKey="search"
                isDisabled={isLoading}
                wrapperClasses="mx--4"
              />
            )}
            {state.userType === AssigneeTypesEnum.Employee.key && (
              <SharedAPIAutocompleteControl
                isEntireObject
                isHalfWidth
                inlineLabel="employee"
                placeholder="select-employee"
                stateKey="user"
                onValueChanged={(newValue) => {
                  setState((items) => ({ ...items, user: newValue.value }));
                  setBackupCodes(null);
                }}
                getOptionLabel={(option) =>
                  `${
                    option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en)
                  }${
                    option.last_name
                    && ` ${option.last_name[i18next.language] || option.last_name.en}`
                  }` || 'N/A'
                }
                getDataAPI={GetAllSetupsEmployees}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                extraProps={{
                  all_employee: 1,
                }}
                searchKey="search"
                isDisabled={isLoading}
              />
            )}
            {(state.userType === AssigneeTypesEnum.User.key
              || state.userType === AssigneeTypesEnum.Employee.key) && (
              <ButtonBase
                onClick={() => BackupCodes()}
                className="btns theme-solid px-3 btn-recovery mt--2"
                disabled={
                  isLoading
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: MFAPermissions.ViewCodes.key,
                  })
                  || !state.userType
                  || !state.user
                }
              >
                <span>{t(`${translationPath}backup-recovery-code`)}</span>
              </ButtonBase>
            )}
          </div>
        )}
        {/*{state.userType === SetupsUsersTypesEnums.Agency.key && (*/}
        {/*  <SharedAPIAutocompleteControl*/}
        {/*    wrapperClasses="ml-3"*/}
        {/*    isEntireObject*/}
        {/*    isFullWidth*/}
        {/*    inlineLabel="agency"*/}
        {/*    placeholder="select-agency"*/}
        {/*    stateKey="user"*/}
        {/*    onValueChanged={(newValue) => {*/}
        {/*      setState((items) => ({ ...items, user: newValue.value }));*/}
        {/*    }}*/}
        {/*    getOptionLabel={(option) => `${option.name}` || 'N/A'}*/}
        {/*    getDataAPI={GetAllSetupsProviders}*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*    translationPath={translationPath}*/}
        {/*    searchKey="search"*/}
        {/*    extraProps={{*/}
        {/*      type: SetupsUsersTypesEnums.Agency.userType,*/}
        {/*      use_for: 'list',*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
        {/*{state.userType === SetupsUsersTypesEnums.University.key && (*/}
        {/*  <SharedAPIAutocompleteControl*/}
        {/*    wrapperClasses="ml-3"*/}
        {/*    isEntireObject*/}
        {/*    isFullWidth*/}
        {/*    inlineLabel="university"*/}
        {/*    placeholder="select-university"*/}
        {/*    stateKey="user"*/}
        {/*    // errors={errors}*/}
        {/*    // isSubmitted={isSubmitted}*/}
        {/*    // errorPath={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}*/}
        {/*    onValueChanged={(newValue) => {*/}
        {/*      setState((items) => ({ ...items, user: newValue.value }));*/}
        {/*    }}*/}
        {/*    getOptionLabel={(option) => `${option.name}` || 'N/A'}*/}
        {/*    getDataAPI={GetAllSetupsProviders}*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*    translationPath={translationPath}*/}
        {/*    searchKey="search"*/}
        {/*    // isDisabled={*/}
        {/*    //   isLoading*/}
        {/*    //           || getIsDisabledFieldsOrActions()*/}
        {/*    //           || (getIsReservationTypes()*/}
        {/*    //             ? !getIsAllowedPermissionV2({*/}
        {/*    //               permissions,*/}
        {/*    //               permissionId: VisasPermissions.ReserveOnBehalf.key,*/}
        {/*    //             })*/}
        {/*    //             : !getIsAllowedPermissionV2({*/}
        {/*    //               permissions,*/}
        {/*    //               permissionId: VisasPermissions.AllocateOnBehalf.key,*/}
        {/*    //             }))*/}
        {/*    // }*/}
        {/*    // isLoading={isLoading}*/}
        {/*    // editValue={getRequestFrom()}*/}
        {/*    extraProps={{*/}
        {/*      type: SetupsUsersTypesEnums.University.userType,*/}
        {/*      use_for: 'list',*/}
        {/*    }}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
      <div className="d-flex">
        {backupCodes && backupCodes?.codes?.length > 0 && (
          <NavItem
            color="link"
            className="btn nav-link nav-link-shadow font-weight-bold w-25 mt-3"
            onClick={() => copyTextToClipboard(backupCodes?.codes?.join('\n'))}
          >
            <span>{t(`${translationPath}copy`)}</span>
            <i className="fas fa-copy" />
          </NavItem>
        )}
        {backupCodes && backupCodes?.codes?.length > 0 ? (
          <ButtonBase
            onClick={() => GenerateNewRecoveryCode()}
            className="btns theme-solid py-2 px-3 mt-3"
            disabled={
              isLoading
              || !getIsAllowedPermissionV2({
                permissions,
                permissionId: MFAPermissions.GenerateCodes.key,
              })
            }
          >
            <span>
              <i className="fas fa-plus" />{' '}
              {t(`${translationPath}generate-new-recovery-code`)}
            </span>
          </ButtonBase>
        ) : (
          backupCodes?.codes?.length < 1 && (
            <div className="alert alert-danger">
              {t(`${translationPath}recovery-code-null`)}
            </div>
          )
        )}
      </div>
      {backupCodes?.codes && backupCodes?.codes?.length > 0 && (
        <div className="px-3 pt-1">
          {backupCodes.codes.map((codes, index) => (
            <div key={index + 1} className="d-flex justify-content-start p-1 ">
              <p className="recovery-text-width">{codes}</p>
              <ButtonBase onClick={() => copyTextToClipboard(codes)}>
                <i className="fas fa-copy" />
              </ButtonBase>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecoveryCode;
