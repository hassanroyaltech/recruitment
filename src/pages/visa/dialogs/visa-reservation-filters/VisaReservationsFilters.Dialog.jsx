import React, { useReducer, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../setups/shared';
import {
  DynamicFormTypesEnum,
  SetupsUsersTypesEnums,
  VisaRequestsStatusesEnum,
} from '../../../../enums';
import i18next from 'i18next';
import {
  GetAllSetupsEmployees,
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  GetAllVisaGenders,
  GetAllVisaIssuePlaces,
  GetAllVisaNationalities,
  GetAllVisaOccupations,
  GetAllVisaReligions,
  getSetupsProvidersById,
  GetVisaGenderById,
  GetVisaIssuePlaceById,
  GetVisaNationalityById,
  GetVisaOccupationById,
  GetVisaReligionById,
} from '../../../../services';

export const VisaReservationsFiltersDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  onFilterChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useReducer(SetupsReducer, {}, SetupsReset);
  const [usersTypes] = useState(() =>
    Object.values(SetupsUsersTypesEnums).map((item) => ({
      ...item,
      valueSingle: t(item.valueSingle),
    })),
  );
  const [visaStatusesList] = useState(() =>
    Object.values(VisaRequestsStatusesEnum).map((item) => ({
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
      isWithFullScreen
      titleText="visa-reservations-filters"
      maxWidth="sm"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses=""
      dialogContent={
        <div className="">
          <SharedAutocompleteControl
            isEntireObject
            editValue={state.status?.map((it) => it.key)}
            placeholder="select-status"
            title="status"
            stateKey="status"
            isHalfWidth
            initValuesKey="key"
            initValuesTitle="value"
            onValueChanged={(newValue) => {
              onStateChanged({ id: 'status', value: null });
              onStateChanged(newValue);
            }}
            initValues={visaStatusesList}
            errorPath="status"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAutocompleteControl
            isEntireObject
            editValue={state.reserve_for_type?.key}
            placeholder="select-user-type"
            title="user-type"
            stateKey="reserve_for_type"
            isHalfWidth
            initValuesTitle="valueSingle"
            onValueChanged={(newValue) => {
              onStateChanged({ id: 'reserve_for', value: null });
              onStateChanged(newValue);
            }}
            initValues={usersTypes}
            errorPath="reserve_for_type"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          {state.reserve_for_type?.key === SetupsUsersTypesEnums.Admins.key && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title="reserve-for"
              placeholder="select-reserve-for"
              stateKey="reserve_for"
              errorPath="reserve_for"
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
              editValue={state.reserve_for?.uuid}
              extraProps={{
                ...(state.reserve_for?.uuid && {
                  with_than: [state.reserve_for.uuid],
                }),
              }}
            />
          )}
          {state.reserve_for_type?.key === SetupsUsersTypesEnums.Employees.key && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title="reserve-for"
              placeholder="select-reserve-for"
              stateKey="reserve_for"
              errorPath="reserve_for"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${
                  (option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en))
                  || ''
                }${
                  (option.last_name
                    && ` ${
                      option.last_name[i18next.language] || option.last_name.en
                    }`)
                  || ''
                }` || 'N/A'
              }
              getDataAPI={GetAllSetupsEmployees}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              uniqueKey="user_uuid"
              editValue={state.reserve_for?.user_uuid}
              extraProps={{
                all_employee: 1,
                ...(state.reserve_for?.user_uuid && {
                  with_than: [state.reserve_for.user_uuid],
                }),
              }}
            />
          )}
          {state.reserve_for_type?.key === SetupsUsersTypesEnums.Agency.key && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title="reserve-for"
              placeholder="select-reserve-for"
              stateKey="reserve_for"
              errorPath="reserve_for"
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
              editValue={state.reserve_for?.user_uuid}
              extraProps={{
                job_uuid: state.job_uuid,
                type: SetupsUsersTypesEnums.Agency.userType,
              }}
            />
          )}
          {state.reserve_for_type?.key === SetupsUsersTypesEnums.University.key && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isHalfWidth
              title="reserve-for"
              placeholder="select-reserve-for"
              stateKey="reserve_for"
              errorPath="reserve_for"
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
              editValue={state.reserve_for?.user_uuid}
              extraProps={{
                job_uuid: state.job_uuid,
                type: SetupsUsersTypesEnums.University.userType,
              }}
            />
          )}
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title="occupation"
            stateKey="occupation"
            errorPath="occupation"
            searchKey="search"
            placeholder="select-occupation"
            onValueChanged={onStateChanged}
            editValue={state.occupation?.map((it) => it.uuid)}
            getDataAPI={GetAllVisaOccupations}
            getItemByIdAPI={GetVisaOccupationById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title="gender"
            stateKey="gender"
            errorPath="gender"
            searchKey="search"
            placeholder="select-gender"
            onValueChanged={onStateChanged}
            editValue={state.gender?.map((it) => it.uuid)}
            getDataAPI={GetAllVisaGenders}
            getItemByIdAPI={GetVisaGenderById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title="nationality"
            stateKey="nationality"
            errorPath="nationality"
            searchKey="search"
            placeholder="select-nationality"
            onValueChanged={onStateChanged}
            editValue={state.nationality?.map((it) => it.uuid)}
            getDataAPI={GetAllVisaNationalities}
            getItemByIdAPI={GetVisaNationalityById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title="religion"
            stateKey="religion"
            errorPath="religion"
            searchKey="search"
            placeholder="select-religion"
            onValueChanged={onStateChanged}
            editValue={state.religion?.map((it) => it.uuid)}
            getDataAPI={GetAllVisaReligions}
            getItemByIdAPI={GetVisaReligionById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
          />
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title="arriving-from"
            stateKey="issue_place"
            errorPath="issue_place"
            searchKey="search"
            placeholder="select-arriving-from"
            onValueChanged={onStateChanged}
            editValue={state.issue_place?.map((it) => it.uuid)}
            getDataAPI={GetAllVisaIssuePlaces}
            getItemByIdAPI={GetVisaIssuePlaceById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            type={DynamicFormTypesEnum.array.key}
          />
        </div>
      }
      isOpen={isOpen}
      onSubmit={(e) => {
        e.preventDefault();
        onFilterChanged({
          ...state,
        });
        isOpenChanged();
      }}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

VisaReservationsFiltersDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  filter: PropTypes.shape({}),
};
