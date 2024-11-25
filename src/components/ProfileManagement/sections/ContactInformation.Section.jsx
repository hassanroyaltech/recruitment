import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
  SharedPhoneControl,
  SharedAutocompleteControl,
} from '../../../pages/setups/shared';
import {
  GetAllSetupsCategories,
  GetAllSetupsProviders,
  GetAllSetupsSalutation,
  GetAllSetupsUsers,
  getSetupsUsersById,
} from '../../../services';
import {
  AssigneeTypesEnum,
  DynamicFormTypesEnum,
  ProfileSourcesTypesEnum,
} from '../../../enums';
import { useSelector } from 'react-redux';
import { getIsAllowedPermissionV2 } from '../../../helpers';

export const ContactInformationSection = ({
  state,
  isFullWidth,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  parentTranslationPath,
  // profile_uuid,
  company_uuid,
  job_uuid,
  componentPermission,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [profileSourcesTypes] = useState(
    Object.values(ProfileSourcesTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const userReducer = useSelector((state) => state?.userReducer);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('contact-information')}</div>
      <div className="section-item-description">
        {t('contact-information-description')}
      </div>
      <div className="section-item-body-wrapper">
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          stateKey="email"
          errorPath="email"
          isRequired
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.email}
          title="email"
          onValueChanged={onStateChanged}
          placeholder="email"
          parentTranslationPath={parentTranslationPath}
        />
        <SharedPhoneControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          stateKey="phone_number"
          countryCodeKey="country_code"
          errorPath="phone_number"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.phone_number}
          currentCountryCode={state.country_code}
          title="phone-number"
          onValueChanged={onStateChanged}
          placeholder="phone-number"
          parentTranslationPath={parentTranslationPath}
          excludeCountries={branchesReducer?.branches?.excluded_countries}
        />
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="salutation"
          searchKey="search"
          stateKey="salutation_uuid"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          placeholder="select-salutation"
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsSalutation}
          editValue={state.salutation_uuid}
          parentTranslationPath={parentTranslationPath}
          errorPath="salutation_uuid"
          getOptionLabel={(option) =>
            (option.name
              && (option.name[i18next.language] || option.name.en || 'N/A'))
            || 'N/A'
          }
          extraProps={{
            company_uuid,
            ...(state.salutation_uuid && { with_than: [state.salutation_uuid] }),
          }}
        />
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          isRequired
          errors={errors}
          stateKey="first_name"
          errorPath="first_name"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.first_name}
          title="first-name"
          onValueChanged={onStateChanged}
          placeholder="first-name"
          parentTranslationPath={parentTranslationPath}
        />
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          isRequired
          stateKey="last_name"
          errorPath="last_name"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.last_name}
          title="last-name"
          onValueChanged={onStateChanged}
          placeholder="last-name"
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="category"
          searchKey="search"
          isRequired
          stateKey="category_uuid"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          placeholder="select-category"
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsCategories}
          type={DynamicFormTypesEnum.array.key}
          editValue={state.category_uuid}
          parentTranslationPath={parentTranslationPath}
          errorPath="category_uuid"
          getOptionLabel={(option) =>
            (option.title
              && (option.title[i18next.language] || option.title.en || 'N/A'))
            || 'N/A'
          }
          extraProps={{
            branch_uuid: company_uuid,
            ...(state.language_profile_uuid
              && state.category_uuid
              && state.category_uuid.length && { with_than: state.category_uuid }),
          }}
        />
        {!userReducer?.results?.user?.is_provider && (
          <>
            <div className="d-flex flex-wrap">
              <SharedAutocompleteControl
                isHalfWidth={!isFullWidth}
                isFullWidth={isFullWidth}
                searchKey="search"
                initValuesKey="key"
                isDisabled={
                  isLoading
                  || !getIsAllowedPermissionV2({
                    permissionId: componentPermission.AssignUser.key,
                    permissions,
                  })
                }
                initValues={assigneeTypes}
                stateKey="assigned_user_type"
                onValueChanged={(newValue) => {
                  if (state.assigned_user_uuid)
                    onStateChanged({ id: 'assigned_user_uuid', value: null });
                  onStateChanged(newValue);
                }}
                title="assignee-type"
                editValue={
                  state.assigned_user_type
                  || state?.candidateDetail?.assigned_user_type
                }
                placeholder="select-assignee-type"
                parentTranslationPath={parentTranslationPath}
              />
              {state.assigned_user_type && (
                <>
                  {state.assigned_user_type === AssigneeTypesEnum.Employee.key && (
                    <SharedAPIAutocompleteControl
                      title="assignee"
                      isHalfWidth={!isFullWidth}
                      isFullWidth={isFullWidth}
                      placeholder={t('select-assignee')}
                      stateKey="assigned_user_uuid"
                      onValueChanged={onStateChanged}
                      idRef="assigned_user_uuid"
                      getOptionLabel={(option) =>
                        `${
                          option.first_name
                          && (option.first_name[i18next.language]
                            || option.first_name.en)
                        }${
                          option.last_name
                          && ` ${
                            option.last_name[i18next.language] || option.last_name.en
                          }`
                        }${
                          (!option.has_access
                            && ` ${t('Shared:dont-have-permissions')}`)
                          || ''
                        }`
                      }
                      type={DynamicFormTypesEnum.select.key}
                      getDataAPI={GetAllSetupsUsers}
                      getItemByIdAPI={getSetupsUsersById}
                      parentTranslationPath={parentTranslationPath}
                      searchKey="search"
                      editValue={state.assigned_user_uuid}
                      getByIdCompanyUUID={company_uuid}
                      extraProps={{
                        company_uuid,
                        committeeType: 'all',
                      }}
                      getDisabledOptions={(option) => !option.has_access}
                      isDisabled={
                        !getIsAllowedPermissionV2({
                          permissionId: componentPermission.AssignUser.key,
                          permissions,
                        })
                      }
                    />
                  )}
                  {state.assigned_user_type === AssigneeTypesEnum.User.key && (
                    <SharedAPIAutocompleteControl
                      isHalfWidth={!isFullWidth}
                      isFullWidth={isFullWidth}
                      title="assignee"
                      stateKey="assigned_user_uuid"
                      placeholder="select-assignee"
                      onValueChanged={onStateChanged}
                      editValue={state.assigned_user_uuid}
                      searchKey="search"
                      getDataAPI={GetAllSetupsUsers}
                      // getItemByIdAPI={getSetupsUsersById}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) =>
                        `${
                          option.first_name
                          && (option.first_name[i18next.language]
                            || option.first_name.en)
                        }${
                          option.last_name
                          && ` ${
                            option.last_name[i18next.language] || option.last_name.en
                          }`
                        }`
                      }
                      extraProps={{
                        company_uuid,
                        ...(state.language_profile_uuid
                          && state.assigned_user_uuid && {
                          with_than: [state.assigned_user_uuid],
                        }),
                      }}
                      isDisabled={
                        isLoading
                        || !getIsAllowedPermissionV2({
                          permissionId: componentPermission.AssignUser.key,
                          permissions,
                        })
                      }
                    />
                  )}
                </>
              )}
            </div>
            <SharedAutocompleteControl
              isHalfWidth={!isFullWidth}
              isFullWidth={isFullWidth}
              errors={errors}
              title="source-type"
              isRequired
              stateKey="source_type"
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              placeholder="select-source-type"
              onValueChanged={(newValue) => {
                if (state.source_uuid)
                  onStateChanged({ id: 'source_uuid', value: null });
                onStateChanged(newValue);
              }}
              initValues={profileSourcesTypes}
              editValue={state.source_type}
              parentTranslationPath={parentTranslationPath}
              errorPath="source_type"
            />
            {(state.source_type === ProfileSourcesTypesEnum.RecruiterUser.key
              || state.source_type
                === ProfileSourcesTypesEnum.RecruiterEmployee.key) && (
              <SharedAPIAutocompleteControl
                title={
                  (state.source_type
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                  || ProfileSourcesTypesEnum.RecruiterUser.value
                }
                isHalfWidth={!isFullWidth}
                isFullWidth={isFullWidth}
                placeholder={`select-${
                  (state.source_type
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                  || ProfileSourcesTypesEnum.RecruiterUser.value
                }`}
                stateKey="source_uuid"
                errors={errors}
                errorPath="source_uuid"
                isSubmitted={isSubmitted}
                isRequired
                onValueChanged={onStateChanged}
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
                searchKey="search"
                editValue={state.source_uuid}
                getByIdCompanyUUID={company_uuid}
                extraProps={{
                  company_uuid,
                  committeeType:
                    (state.source_type
                      === ProfileSourcesTypesEnum.RecruiterEmployee.key
                      && 'all')
                    || undefined,
                  ...(state.uuid
                    && state.source_uuid && {
                    with_than: [state.source_uuid],
                  }),
                }}
              />
            )}
            {state.source_type === ProfileSourcesTypesEnum.Agency.key && (
              <SharedAPIAutocompleteControl
                title="agency"
                isHalfWidth={!isFullWidth}
                isFullWidth={isFullWidth}
                placeholder="select-agency"
                stateKey="source_uuid"
                errors={errors}
                errorPath="source_uuid"
                isSubmitted={isSubmitted}
                isRequired
                onValueChanged={onStateChanged}
                getOptionLabel={(option) =>
                  `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
                }
                getDataAPI={GetAllSetupsProviders}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                editValue={state.source_uuid}
                uniqueKey="user_uuid"
                getByIdCompanyUUID={company_uuid}
                extraProps={{
                  job_uuid: job_uuid,
                  company_uuid,
                  type: ProfileSourcesTypesEnum.Agency.userType,
                  ...(state.uuid
                    && state.source_uuid && {
                    with_than: [state.source_uuid],
                  }),
                }}
              />
            )}
            {state.source_type === ProfileSourcesTypesEnum.University.key && (
              <SharedAPIAutocompleteControl
                title="university"
                isHalfWidth={!isFullWidth}
                isFullWidth={isFullWidth}
                placeholder="select-university"
                stateKey="source_uuid"
                errors={errors}
                errorPath="source_uuid"
                uniqueKey="user_uuid"
                isSubmitted={isSubmitted}
                isRequired
                onValueChanged={onStateChanged}
                getOptionLabel={(option) =>
                  `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
                }
                getDataAPI={GetAllSetupsProviders}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                editValue={state.source_uuid}
                getByIdCompanyUUID={company_uuid}
                extraProps={{
                  job_uuid: job_uuid,
                  company_uuid,
                  type: ProfileSourcesTypesEnum.University.userType,
                  ...(state.uuid
                    && state.source_uuid && {
                    with_than: [state.source_uuid],
                  }),
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

ContactInformationSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isFullWidth: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  // profile_uuid: PropTypes.string,
  company_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  componentPermission: PropTypes.instanceOf(Object),
};

ContactInformationSection.defaultProps = {
  // profile_uuid: undefined,
  company_uuid: undefined,
  job_uuid: undefined,
};
