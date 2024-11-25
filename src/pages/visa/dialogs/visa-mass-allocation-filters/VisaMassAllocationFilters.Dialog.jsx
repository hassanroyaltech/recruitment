import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import {
  DynamicFormTypesEnum,
  OffersStatusesEnum,
  ProfileSourcesTypesEnum,
} from '../../../../enums';
import i18next from 'i18next';
import {
  GetAllActiveJobs,
  GetAllSetupsBranches,
  GetAllSetupsCategories,
  GetAllSetupsEmployees,
  GetAllSetupsGender,
  GetAllSetupsJobsTitles,
  GetAllSetupsNationality,
  GetAllSetupsPositions,
  GetAllSetupsPositionsTitle,
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  getSetupsProvidersById,
} from '../../../../services';
import { numbersExpression } from '../../../../utils';

const translationPath = 'VisaMassAllocationTab.';
export const VisaMassAllocationFiltersDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  onFilterChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useReducer(SetupsReducer, {}, SetupsReset);
  const [offerStatuses] = useState(() =>
    Object.values(OffersStatusesEnum).map((item) => ({
      ...item,
      status: t(`${translationPath}${item.status}`),
    })),
  );
  const [profileSourcesTypes] = useState(
    Object.values(ProfileSourcesTypesEnum)
      .filter(
        (it) =>
          it.key !== ProfileSourcesTypesEnum.Portal.key
          && it.key !== ProfileSourcesTypesEnum.Migrated.key,
      )
      .map((item) => ({
        ...item,
        value: t(`${translationPath}${item.value}`),
      })),
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  useEffect(() => {
    onStateChanged({
      id: 'edit',
      value: filter && {
        ...filter,
      },
    });
  }, [filter]);

  return (
    <DialogComponent
      titleText="visa-mass-allocation-filters"
      maxWidth="md"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses=""
      dialogContent={
        <div className="w-100">
          <SharedAutocompleteControl
            isQuarterWidth
            placeholder="press-enter-to-add"
            title="first-name"
            isFreeSolo
            stateKey="first_name"
            onValueChanged={onStateChanged}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            editValue={state.first_name || []}
          />
          <SharedAutocompleteControl
            isQuarterWidth
            placeholder="press-enter-to-add"
            title="last-name"
            isFreeSolo
            stateKey="last_name"
            onValueChanged={onStateChanged}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            editValue={state.last_name || []}
          />
          <SharedAutocompleteControl
            isQuarterWidth
            placeholder="press-enter-to-add"
            title="email"
            isFreeSolo
            stateKey="email"
            onValueChanged={onStateChanged}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            editValue={state.email || []}
          />
          <SharedAutocompleteControl
            isQuarterWidth
            searchKey="search"
            initValuesKey="key"
            initValuesTitle="status"
            initValues={offerStatuses}
            stateKey="offer_status"
            onValueChanged={onStateChanged}
            title="offer-status"
            editValue={state.offer_status?.map((it) => it.key)}
            placeholder="offer-status"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) => option.status}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title="gender"
            stateKey="gender"
            searchKey="search"
            placeholder="select-gender"
            onValueChanged={onStateChanged}
            editValue={state.gender?.map((it) => it.uuid)}
            getDataAPI={GetAllSetupsGender}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            extraProps={
              state.gender?.length && {
                with_than: state.gender.map((it) => it.uuid),
              }
            }
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title="nationality"
            stateKey="nationality"
            searchKey="search"
            placeholder="select-nationality"
            onValueChanged={onStateChanged}
            editValue={state.nationality?.map((it) => it.uuid)}
            getDataAPI={GetAllSetupsNationality}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            extraProps={
              state.nationality?.length && {
                with_than: state.nationality.map((it) => it.uuid),
              }
            }
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedInputControl
            isQuarterWidth
            placeholder="applicant-number"
            stateKey="applicant_number"
            editValue={state.applicant_number}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            pattern={numbersExpression}
            type="number"
          />
          <SharedInputControl
            isQuarterWidth
            placeholder="reference-number"
            stateKey="reference_number"
            editValue={state.reference_number}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            pattern={numbersExpression}
            type="number"
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title="job-name"
            searchKey="search"
            placeholder="select-job-name"
            stateKey="job_uuid"
            editValue={state.job_uuid?.map((it) => it.uuid)}
            onValueChanged={onStateChanged}
            getDataAPI={GetAllActiveJobs}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            dataKey="jobs"
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title="category"
            searchKey="search"
            stateKey="category_uuid"
            placeholder="select-category"
            onValueChanged={onStateChanged}
            getDataAPI={GetAllSetupsCategories}
            editValue={state.category_uuid?.map((it) => it.uuid)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            errorPath="category_uuid"
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language] || option.title.en || 'N/A'))
              || 'N/A'
            }
            extraProps={{
              ...(state.category_uuid?.length && {
                with_than: state.category_uuid.map((it) => it.uuid),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAutocompleteControl
            isQuarterWidth
            title="source-type"
            stateKey="source_type"
            placeholder="select-source-type"
            onValueChanged={(newValue) => {
              onStateChanged(newValue);
              onStateChanged({ id: 'source_uuid', value: null });
            }}
            initValues={profileSourcesTypes}
            editValue={state.source_type?.key}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            initValuesTitle="value"
            initValuesKey="key"
            isEntireObject
          />
          {(state.source_type?.key === ProfileSourcesTypesEnum.RecruiterUser.key
            || state.source_type?.key
              === ProfileSourcesTypesEnum.RecruiterEmployee.key) && (
            <SharedAPIAutocompleteControl
              isQuarterWidth
              title={
                (state.source_type?.key
                  === ProfileSourcesTypesEnum.RecruiterEmployee.key
                  && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                || ProfileSourcesTypesEnum.RecruiterUser.value
              }
              placeholder={`select-${
                (state.source_type?.key
                  === ProfileSourcesTypesEnum.RecruiterEmployee.key
                  && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                || ProfileSourcesTypesEnum.RecruiterUser.value
              }`}
              stateKey="source_uuid"
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
              translationPath={translationPath}
              searchKey="search"
              editValue={
                (state.source_uuid?.length
                  && state.source_uuid.map((it) => it.uuid))
                || undefined
              }
              extraProps={{
                committeeType:
                  (state.source_type?.key
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && 'all')
                  || undefined,
                ...(state.source_uuid?.length && {
                  with_than: state.source_uuid.map((it) => it.uuid),
                }),
              }}
              type={DynamicFormTypesEnum.array.key}
              isEntireObject
            />
          )}
          {state.source_type?.key === ProfileSourcesTypesEnum.Agency.key && (
            <SharedAPIAutocompleteControl
              isQuarterWidth
              title="agency"
              placeholder="select-agency"
              stateKey="source_uuid"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              getItemByIdAPI={getSetupsProvidersById}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              uniqueKey="user_uuid"
              editValue={state.source_uuid?.map((it) => it.user_uuid)}
              extraProps={{
                type: ProfileSourcesTypesEnum.Agency.userType,
              }}
              type={DynamicFormTypesEnum.array.key}
              isEntireObject
            />
          )}
          {state.source_type?.key === ProfileSourcesTypesEnum.University.key && (
            <SharedAPIAutocompleteControl
              isQuarterWidth
              title="university"
              placeholder="select-university"
              stateKey="source_uuid"
              uniqueKey="user_uuid"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              getItemByIdAPI={getSetupsProvidersById}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              editValue={state.source_uuid?.map((it) => it.user_uuid)}
              extraProps={{
                type: ProfileSourcesTypesEnum.University.userType,
              }}
              type={DynamicFormTypesEnum.array.key}
              isEntireObject
            />
          )}
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title="job-requisition-branch"
            stateKey="company_uuid"
            searchKey="search"
            placeholder="select-job-requisition-branch"
            onValueChanged={onStateChanged}
            editValue={state.company_uuid?.map((it) => it.uuid)}
            translationPath={translationPath}
            getDataAPI={GetAllSetupsBranches}
            extraProps={{
              ...(state.company_uuid?.length && {
                with_than: state.company_uuid.map((it) => it.uuid),
              }),
            }}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            editValue={state.position_title_uuid?.map((it) => it.uuid)}
            title="position-title"
            placeholder="select-position-title"
            stateKey="position_title_uuid"
            getDataAPI={GetAllSetupsPositionsTitle}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            searchKey="search"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            extraProps={{
              ...(state.position_title_uuid?.length && {
                with_than: state.position_title_uuid.map((it) => it.uuid),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            editValue={state.position_uuid?.map((it) => it.uuid)}
            title="position"
            placeholder="select-position"
            stateKey="position_uuid"
            getDataAPI={GetAllSetupsPositions}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            searchKey="search"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            extraProps={{
              ...(state.position_uuid?.length && {
                with_than: state.position_uuid.map((it) => it.uuid),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            editValue={state.job_title_uuid?.map((it) => it.uuid)}
            title="requisition-job-title"
            placeholder="select-requisition-job-title"
            stateKey="job_title_uuid"
            getDataAPI={GetAllSetupsJobsTitles}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
            searchKey="search"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            extraProps={{
              ...(state.job_title_uuid?.length && {
                with_than: state.job_title_uuid.map((it) => it.uuid),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAutocompleteControl
            isQuarterWidth
            searchKey="search"
            initValuesKey="value"
            initValuesTitle="label"
            initValues={[
              { label: t(`${translationPath}yes`), value: 'yes' },
              { label: t(`${translationPath}no`), value: 'no' },
            ]}
            stateKey="has_allocation"
            onValueChanged={onStateChanged}
            title="has-allocation"
            editValue={state.has_allocation?.value}
            placeholder="has-allocation"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title={ProfileSourcesTypesEnum.RecruiterEmployee.value}
            placeholder={`select-${ProfileSourcesTypesEnum.RecruiterEmployee.value}`}
            stateKey="assigned_employees"
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
            getDataAPI={GetAllSetupsEmployees}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            searchKey="search"
            editValue={state.assigned_employees?.map(
              (it) => it.employee_uuid || it.uuid,
            )}
            extraProps={{
              all_employee: 0,
              ...(state.assigned_employees?.length && {
                with_than: state.assigned_employees.map(
                  (it) => it.employee_uuid || it.uuid,
                ),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
          <SharedAPIAutocompleteControl
            isQuarterWidth
            title={ProfileSourcesTypesEnum.RecruiterUser.value}
            placeholder={`select-${ProfileSourcesTypesEnum.RecruiterUser.value}`}
            stateKey="assigned_users"
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
            translationPath={translationPath}
            searchKey="search"
            editValue={state.assigned_users?.map((it) => it.uuid)}
            extraProps={{
              ...(state.assigned_users?.length && {
                with_than: state.assigned_users.map((it) => it.uuid),
              }),
            }}
            type={DynamicFormTypesEnum.array.key}
            isEntireObject
          />
        </div>
      }
      isOpen={isOpen}
      onSubmit={(e) => {
        e.preventDefault();
        onFilterChanged({ ...state });
        isOpenChanged();
      }}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

VisaMassAllocationFiltersDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  filter: PropTypes.shape({
    requested_from_type: PropTypes.string,
  }),
};
