import React, { useState } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedPhoneControl,
} from '../../../../../../../../shared';
import {
  numbersExpression,
  numericAndAlphabeticalAndSpecialExpression,
} from '../../../../../../../../../../utils';
import {
  GetAllSetupsBranches,
  GetAllSetupsCategories,
  GetAllSetupsContractTypes,
  GetAllSetupsEmployees,
  GetAllSetupsGender,
  GetAllSetupsJobTypes,
  GetAllSetupsMaritalStatus,
  GetAllSetupsNationality,
  GetAllSetupsPositions,
  GetAllSetupsProjects,
  GetAllSetupsReligions,
  GetAllSetupsSponsors,
  GetSetupsBranchesById,
  getSetupsCategoriesById,
  getSetupsContractTypesById,
  getSetupsEmployeesById,
  getSetupsGenderById,
  getSetupsJobTitleById,
  getSetupsNationalityById,
  getSetupsPositionsById,
  getSetupsProjectsById,
  getSetupsReligionsById,
  getSetupsSponsorsById,
} from '../../../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  EmployeeStatusesEnum,
} from '../../../../../../../../../../enums';
import { SwitchComponent } from '../../../../../../../../../../components';
import {
  GlobalSavingDateFormat,
  LanguageUpdateKey,
} from '../../../../../../../../../../helpers';
import DatePickerComponent from '../../../../../../../../../../components/Datepicker/DatePicker.Component';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
export const InformationTab = ({
  state,
  errors,
  onStateChanged,
  isSubmitted,
  isLoading,
  languages,
  addLanguageHandler,
  removeLanguageHandler,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [employeeStatusesEnum] = useState(() => Object.values(EmployeeStatusesEnum));
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  // const [managerAndHeadDepartmentExtraProps, setManagerAndHeadDepartmentExtraProps] = useState({
  //   other_than: state.uuid,
  //   company_uuid: state.direct_manager_branch_uuid,
  // });
  // useEffect(() => {
  //   setManagerAndHeadDepartmentExtraProps((items) => ({
  //     ...items,
  //     other_than: state.uuid,
  //   }));
  // }, [state.uuid]);
  // useEffect(() => {
  //   setManagerAndHeadDepartmentExtraProps((items) => ({
  //     ...items,
  //     company_uuid: state.direct_manager_branch_uuid,
  //   }));
  // }, [state.direct_manager_branch_uuid]);

  return (
    <div className="information-tab-wrapper tab-content-wrapper">
      <div className="d-flex-v-center-h-between ml--2-reversed">
        <SharedInputControl
          title="code"
          errors={errors}
          stateKey="code"
          errorPath="code"
          editValue={state.code}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          isRequired
          pattern={numericAndAlphabeticalAndSpecialExpression}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAutocompleteControl
          title="status"
          errors={errors}
          stateKey="status"
          placeholder="select-status"
          editValue={state.status}
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          initValues={employeeStatusesEnum}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          errorPath="status"
          isRequired
          getOptionLabel={(option) => t(`${translationPath}${option.title}`)}
        />
      </div>
      <div className="d-flex flex-wrapper">
        <SharedAPIAutocompleteControl
          isHalfWidth
          title="select-category"
          editValue={state.category_uuid}
          getOptionLabel={(option) =>
            option.title[i18next.language] || option.title.en
          }
          errors={errors}
          stateKey="category_uuid"
          isSubmitted={isSubmitted}
          errorPath="category_uuid"
          searchKey="search"
          isRequired
          placeholder="select-category"
          getDataAPI={GetAllSetupsCategories}
          getItemByIdAPI={getSetupsCategoriesById}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          extraProps={{
            ...(state.category_uuid?.length && { with_than: state.category_uuid }),
          }}
        />
        {/* <SharedAPIAutocompleteControl */}
        {/*  isQuarterWidth */}
        {/*  errors={errors} */}
        {/*  title="permissions" */}
        {/*  stateKey="permissions" */}
        {/*  errorPath="permissions" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  editValue={state.permissions} */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  placeholder="select-permissions" */}
        {/*  translationPath={translationPath} */}
        {/*  idRef="permissionsAutocompleteRef" */}
        {/*  getDataAPI={GetAllSetupsPermissions} */}
        {/*  type={DynamicFormTypesEnum.array.key} */}
        {/*  getItemByIdAPI={GetSetupsPermissionsById} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  getOptionLabel={(option) => option.title[i18next.language] || option.title.en} */}
        {/* /> */}
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
                  isSubmitted={isSubmitted}
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
              editValue={(state.last_name && state.last_name[item[0]]) || ''}
              parentTranslationPath={parentTranslationPath}
              stateKey={item[0]}
              parentId="last_name"
              errors={errors}
              errorPath={`last_name.${[item[0]]}`}
              title={`${t(`${translationPath}last-name`)} (${getLanguageTitle(
                languages,
                item[0],
              )})`}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              isHalfWidth
              isRequired
            />
          </React.Fragment>
        ))}
      <div className="d-flex">
        <div className="d-inline-flex px-2 mb-1">
          <SwitchComponent
            idRef="isHeadOfDepartmentSwitchRef"
            label="head-of-department"
            isChecked={state.is_head_of_department}
            isReversedLabel
            isFlexEnd
            onChange={(event, isChecked) => {
              onStateChanged({ id: 'is_head_of_department', value: isChecked });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      </div>
      <SharedAPIAutocompleteControl
        isQuarterWidth
        errors={errors}
        searchKey="search"
        title="position"
        stateKey="position_uuid"
        errorPath="position_uuid"
        isSubmitted={isSubmitted}
        editValue={state.position_uuid}
        onValueChanged={onStateChanged}
        placeholder="position"
        translationPath={translationPath}
        getDataAPI={GetAllSetupsPositions}
        getItemByIdAPI={getSetupsPositionsById}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option.name[i18next.language] || option.name.en}
        extraProps={{
          ...(state.position_uuid && { with_than: [state.position_uuid] }),
        }}
      />
      <SharedAPIAutocompleteControl
        isQuarterWidth
        title="branch"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="direct_manager_branch_uuid"
        errorPath="direct_manager_branch_uuid"
        searchKey="search"
        placeholder="select-branches"
        onValueChanged={(e) => {
          onStateChanged({ id: 'direct_manager_uuid', value: null });
          onStateChanged(e);
        }}
        editValue={state.direct_manager_branch_uuid}
        translationPath={translationPath}
        getDataAPI={GetAllSetupsBranches}
        type={DynamicFormTypesEnum.select.key}
        getItemByIdAPI={GetSetupsBranchesById}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option.name[i18next.language] || option.name.en}
      />
      {state.direct_manager_branch_uuid && (
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="direct-manager"
          stateKey="direct_manager_uuid"
          errorPath="direct_manager_uuid"
          isSubmitted={isSubmitted}
          editValue={state.direct_manager_uuid}
          onValueChanged={onStateChanged}
          placeholder="direct-manager"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsEmployees}
          getItemByIdAPI={getSetupsEmployeesById}
          extraProps={{
            // ...managerAndHeadDepartmentExtraProps,
            ...(state.uuid && {
              other_than: [state.uuid],
            }),
            ...(state.uuid && {
              company_uuid: state.direct_manager_branch_uuid,
            }),
            ...(state.direct_manager_uuid && {
              with_than: [state.direct_manager_uuid],
            }),
          }}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) => {
            const firstName
              = (option.first_name
                && (option.first_name[i18next.language] || option.first_name.en))
              || '';
            const lastName
              = (option.last_name
                && (option.last_name[i18next.language] || option.last_name.en))
              || '';
            return (
              (firstName && lastName && `${firstName} ${lastName}`)
              || firstName
              || lastName
              || t(`${translationPath}name-not-found`)
            );
          }}
        />
      )}

      <div className="d-flex flex-wrap">
        <SharedInputControl
          isQuarterWidth
          errors={errors}
          title="email"
          isSubmitted={isSubmitted}
          stateKey="email"
          errorPath="email"
          editValue={state.email}
          isRequired
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        {/* <SharedAPIAutocompleteControl */}
        {/*  isQuarterWidth */}
        {/*  errors={errors} */}
        {/*  searchKey="search" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  title="business-group" */}
        {/*  stateKey="organization_group_uuid" */}
        {/*  errorPath="organization_group_uuid" */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  placeholder="organization-group" */}
        {/*  translationPath={translationPath} */}
        {/*  editValue={state.organization_group_uuid} */}
        {/*  getDataAPI={GetAllSetupsOrganizationGroup} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  getItemByIdAPI={getSetupsOrganizationGroupById} */}
        {/*  getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
        {/* /> */}
        <SharedInputControl
          min={0}
          isQuarterWidth
          errors={errors}
          title="national-number"
          isSubmitted={isSubmitted}
          stateKey="national_number"
          errorPath="national_number"
          onValueChanged={onStateChanged}
          editValue={state.national_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedInputControl
          isQuarterWidth
          errors={errors}
          title="passport-number"
          isSubmitted={isSubmitted}
          stateKey="passport_number"
          errorPath="passport_number"
          onValueChanged={onStateChanged}
          editValue={state.passport_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedPhoneControl
          editValue={state.phone}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          stateKey="phone"
          title="phone"
          errorPath="phone"
          errors={errors}
          isRequired
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          isQuarterWidth
          excludeCountries={branchesReducer?.branches?.excluded_countries}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          title="gender"
          errors={errors}
          stateKey="gender_uuid"
          searchKey="search"
          errorPath="gender_uuid"
          editValue={state.gender_uuid}
          isSubmitted={isSubmitted}
          placeholder="select-gender"
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsGender}
          translationPath={translationPath}
          getItemByIdAPI={getSetupsGenderById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.gender_uuid && { with_than: [state.gender_uuid] }),
          }}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          title="marital-status"
          stateKey="marital_status_uuid"
          isSubmitted={isSubmitted}
          errorPath="marital_status_uuid"
          onValueChanged={onStateChanged}
          editValue={state.marital_status_uuid}
          translationPath={translationPath}
          placeholder="select-marital-status"
          idRef="marital_status_uuidAutocompleteRef"
          getDataAPI={GetAllSetupsMaritalStatus}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.marital_status_uuid && {
              with_than: [state.marital_status_uuid],
            }),
          }}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          title="religion"
          searchKey="search"
          stateKey="religion_uuid"
          errorPath="religion_uuid"
          editValue={state.religion_uuid}
          isSubmitted={isSubmitted}
          idRef="religion_uuidAutocompleteRef"
          placeholder="select-religion"
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          getDataAPI={GetAllSetupsReligions}
          getItemByIdAPI={getSetupsReligionsById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="nationality"
          stateKey="nationality_uuid"
          errorPath="nationality_uuid"
          isSubmitted={isSubmitted}
          editValue={state.nationality_uuid}
          onValueChanged={onStateChanged}
          placeholder="select-nationality"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsNationality}
          getItemByIdAPI={getSetupsNationalityById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.nationality_uuid && { with_than: [state.nationality_uuid] }),
          }}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="sponsor"
          stateKey="sponsor_uuid"
          errorPath="sponsor_uuid"
          isSubmitted={isSubmitted}
          editValue={state.sponsor_uuid}
          onValueChanged={onStateChanged}
          placeholder="sponsor"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsSponsors}
          getItemByIdAPI={getSetupsSponsorsById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.sponsor_uuid && { with_than: [state.sponsor_uuid] }),
          }}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="project"
          stateKey="project_uuid"
          errorPath="project_uuid"
          isSubmitted={isSubmitted}
          editValue={state.project_uuid}
          onValueChanged={onStateChanged}
          placeholder="project"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsProjects}
          getItemByIdAPI={getSetupsProjectsById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.project_uuid && { with_than: [state.project_uuid] }),
          }}
        />
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="job-type"
          stateKey="work_type_uuid"
          errorPath="work_type_uuid"
          isSubmitted={isSubmitted}
          editValue={state.work_type_uuid}
          onValueChanged={onStateChanged}
          placeholder="select-job-type"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsJobTypes}
          getItemByIdAPI={getSetupsJobTitleById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.work_type_uuid && { with_than: [state.work_type_uuid] }),
          }}
        />
        {/* <SharedAPIAutocompleteControl */}
        {/*  isQuarterWidth */}
        {/*  errors={errors} */}
        {/*  searchKey="search" */}
        {/*  title="location" */}
        {/*  stateKey="location_uuid" */}
        {/*  errorPath="location_uuid" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  editValue={state.location_uuid} */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  placeholder="location" */}
        {/*  translationPath={translationPath} */}
        {/*  getDataAPI={GetAllSetupsLocations} */}
        {/*  getItemByIdAPI={getSetupsLocationsById} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
        {/* /> */}
        <SharedAPIAutocompleteControl
          isQuarterWidth
          errors={errors}
          searchKey="search"
          title="contract"
          stateKey="contract_type_uuid"
          errorPath="contract_type_uuid"
          isSubmitted={isSubmitted}
          editValue={state.contract_type_uuid}
          onValueChanged={onStateChanged}
          placeholder="contract"
          translationPath={translationPath}
          getDataAPI={GetAllSetupsContractTypes}
          getItemByIdAPI={getSetupsContractTypesById}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          extraProps={{
            ...(state.contract_type_uuid && {
              with_than: [state.contract_type_uuid],
            }),
          }}
        />
        <SharedInputControl
          isQuarterWidth
          title="salary"
          errors={errors}
          stateKey="salary"
          errorPath="salary"
          editValue={state.salary}
          isSubmitted={isSubmitted}
          pattern={numbersExpression}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        {/* <SharedInputControl */}
        {/*  isQuarterWidth */}
        {/*  errors={errors} */}
        {/*  title="extension" */}
        {/*  stateKey="extension" */}
        {/*  errorPath="extension" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  editValue={state.extension} */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  translationPath={translationPath} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/* /> */}
        {/* <SharedAPIAutocompleteControl */}
        {/*  isQuarterWidth */}
        {/*  title="branch" */}
        {/*  errors={errors} */}
        {/*  searchKey="search" */}
        {/*  placeholder="branch" */}
        {/*  stateKey="branch_uuid" */}
        {/*  errorPath="branch_uuid" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  editValue={state.branch_uuid} */}
        {/*  idRef="branchesAutocompleteRef" */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  translationPath={translationPath} */}
        {/*  getDataAPI={GetAllSetupsBranches} */}
        {/*  type={DynamicFormTypesEnum.array.key} */}
        {/*  getItemByIdAPI={GetSetupsBranchesById} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
        {/* /> */}
        {/* <SharedAPIAutocompleteControl */}
        {/*  isQuarterWidth */}
        {/*  uniqueKey="id" */}
        {/*  errors={errors} */}
        {/*  title="user-type" */}
        {/*  stateKey="user_type" */}
        {/*  errorPath="user_type" */}
        {/*  placeholder="user-type" */}
        {/*  isSubmitted={isSubmitted} */}
        {/*  idRef="typeAutocompleteRef" */}
        {/*  editValue={state.user_type} */}
        {/*  onValueChanged={onStateChanged} */}
        {/*  translationPath={translationPath} */}
        {/*  getDataAPI={GetAllSetupsUserTypes} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
        {/* /> */}
        {/* <CheckboxesComponent */}
        {/*  wrapperClasses="px-2 mt-1" */}
        {/*  idRef="withAccessRef" */}
        {/*  singleChecked={state.with_access} */}
        {/*  label={t(`${translationPath}has-access-to-the-system`)} */}
        {/*  onSelectedCheckboxChanged={(event, checked) => { */}
        {/*    onStateChanged({ id: 'with_access', value: checked }); */}
        {/*  }} */}
        {/* /> */}
        {/* <SwitchComponent */}
        {/*  label="is-citizen" */}
        {/*  idRef="StatusSwitchRef" */}
        {/*  isChecked={state.is_citizen} */}
        {/*  translationPath={translationPath} */}
        {/*  onChange={onIsCitizenChangedHandler} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/* /> */}
        <div className="w-33 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="birthDateRef"
            minDate=""
            maxDate={moment().toDate()}
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.birth_date || ''}
            helperText={
              (errors.birth_date && errors.birth_date.message) || undefined
            }
            error={(errors.birth_date && errors.birth_date.error) || false}
            label={t(`${translationPath}date-of-birth`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'birth_date', value: date.value });
              else onStateChanged({ id: 'birth_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
        <div className="w-33 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="hiringDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.hiring_date || ''}
            helperText={
              (errors.hiring_date && errors.hiring_date.message) || undefined
            }
            error={(errors.hiring_date && errors.hiring_date.error) || false}
            label={t(`${translationPath}hiring-date`)}
            onChange={(date) => {
              if (date.value !== 'Invalid date')
                onStateChanged({ id: 'hiring_date', value: date.value });
              else onStateChanged({ id: 'hiring_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
        <div className="w-33 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="joiningDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.joining_date || ''}
            helperText={
              (errors.joining_date && errors.joining_date.message) || undefined
            }
            error={(errors.joining_date && errors.joining_date.error) || false}
            label={t(`${translationPath}joining-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'joining_date', value: date.value });
              else onStateChanged({ id: 'joining_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
      </div>

      {/* <SharedAPIAutocompleteControl */}
      {/*  isHalfWidth */}
      {/*  uniqueKey="id" */}
      {/*  errors={errors} */}
      {/*  title="time-zone" */}
      {/*  stateKey="timezone" */}
      {/*  errorPath="timezone" */}
      {/*  placeholder="time-zone" */}
      {/*  isSubmitted={isSubmitted} */}
      {/*  idRef="typeAutocompleteRef" */}
      {/*  editValue={state.timezone} */}
      {/*  onValueChanged={onStateChanged} */}
      {/*  translationPath={translationPath} */}
      {/*  getDataAPI={GetAllItemsByHelper} */}
      {/*  extraProps={timezoneExtraProps} */}
      {/*  parentTranslationPath={parentTranslationPath} */}
      {/*  getOptionLabel={(option) => option.name[i18next.language] || option.name.en} */}
      {/* /> */}
      {/* <div className="d-flex flex-wrap pt-3"> */}
      {/*  <SharedInputControl */}
      {/*    wrapperClasses="w-25" */}
      {/*    errors={errors} */}
      {/*    title="facebook" */}
      {/*    isSubmitted={isSubmitted} */}
      {/*    onValueChanged={onStateChanged} */}
      {/*    stateKey="facebook_account_link" */}
      {/*    errorPath="facebook_account_link" */}
      {/*    translationPath={translationPath} */}
      {/*    editValue={state.facebook_account_link} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*  /> */}
      {/*  <SharedInputControl */}
      {/*    wrapperClasses="w-25" */}
      {/*    errors={errors} */}
      {/*    title="twitter" */}
      {/*    isSubmitted={isSubmitted} */}
      {/*    onValueChanged={onStateChanged} */}
      {/*    stateKey="twitter_account_link" */}
      {/*    errorPath="twitter_account_link" */}
      {/*    translationPath={translationPath} */}
      {/*    editValue={state.twitter_account_link} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*  /> */}
      {/*  <SharedInputControl */}
      {/*    wrapperClasses="w-25" */}
      {/*    errors={errors} */}
      {/*    title="linkedin" */}
      {/*    isSubmitted={isSubmitted} */}
      {/*    onValueChanged={onStateChanged} */}
      {/*    stateKey="linkedin_account_link" */}
      {/*    errorPath="linkedin_account_link" */}
      {/*    translationPath={translationPath} */}
      {/*    editValue={state.linkedin_account_link} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*  /> */}
      {/*  <SharedInputControl */}
      {/*    wrapperClasses="w-25" */}
      {/*    title="skype" */}
      {/*    errors={errors} */}
      {/*    isSubmitted={isSubmitted} */}
      {/*    stateKey="skype_account_link" */}
      {/*    errorPath="skype_account_link" */}
      {/*    onValueChanged={onStateChanged} */}
      {/*    translationPath={translationPath} */}
      {/*    editValue={state.skype_account_link} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*  /> */}
      {/* </div> */}
    </div>
  );
};

InformationTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  addLanguageHandler: PropTypes.func.isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
