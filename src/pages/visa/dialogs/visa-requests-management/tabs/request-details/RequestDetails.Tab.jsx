import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DefaultFormsTypesEnum,
  DynamicFormTypesEnum,
  SetupsUsersTypesEnums,
  SystemActionsEnum,
} from '../../../../../../enums';
import { useTranslation } from 'react-i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../setups/shared';
import i18next from 'i18next';
import moment from 'moment-hijri';
import {
  GetAllBuilderTemplates,
  GetAllSetupsEmployees,
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  GetAllVisaGenders,
  GetAllVisaIssuePlaces,
  GetAllVisaNationalities,
  GetAllVisaOccupations,
  GetAllVisaReligions,
  GetVisaGenderById,
  GetVisaIssuePlaceById,
  GetVisaNationalityById,
  GetVisaOccupationById,
  GetVisaReligionById,
} from '../../../../../../services';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import {
  getIsAllowedPermissionV2,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  GlobalSecondaryDateFormat,
} from '../../../../../../helpers';
import { useSelector } from 'react-redux';
import { EvaRecManageVisaPermissions } from '../../../../../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import { ManageVisasPermissions } from '../../../../../../permissions';

export const RequestDetailsTab = ({
  state,
  errors,
  onStateChanged,
  getTotalSelectedVisas,
  isSubmitted,
  isLoading,
  // callLocation,
  getIsReservationTypes,
  getIsConfirmType,
  getIsAllocation,
  getIsViewTypes,
  deselectVisasHandler,
  getIsDisabledFieldsOrActions,
  usersTypes,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const [tableColumns] = useState([
    {
      id: 1,
      isSortable: false,
      label: '#',
      isCounter: true,
      isSticky: true,
    },
    {
      id: 2,
      isSortable: true,
      label: 'block-id',
      input: 'block_number',
      isSticky: false,
    },
    {
      id: 3,
      isSortable: true,
      label: 'occupation',
      input: `occupation.${i18next.language}`,
      isSticky: false,
    },
    {
      id: 4,
      isSortable: true,
      label: 'nationality',
      input: `nationality.${i18next.language}`,
      isSticky: false,
    },
    {
      id: 5,
      isSortable: true,
      label: 'gender',
      input: `gender.${i18next.language}`,
      isSticky: false,
    },
    {
      id: 6,
      isSortable: true,
      label: 'religion',
      input: `religion.${i18next.language}`,
      isSticky: false,
    },
    {
      id: 7,
      isSortable: true,
      label: 'expiry-date',
      component: (row) => (
        <span>
          {(row.expiry_date
            && moment(
              row.expiry_date,
              (row.is_hijri && GlobalSavingHijriDateFormat)
                || GlobalSavingDateFormat,
            )
              .locale(i18next.language)
              .format(GlobalSecondaryDateFormat))
            || 'N/A'}
        </span>
      ),
      isSticky: false,
    },
    {
      id: 6,
      isSortable: true,
      label: 'count',
      input: 'count',
      isSticky: false,
    },
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the user type value for current request type
   */
  const getUserType = useMemo(
    () => () =>
      getIsReservationTypes() ? state.reserve_for_type : state.requested_from_type,
    [getIsReservationTypes, state.requested_from_type, state.reserve_for_type],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the request from value for current request type
   */
  const getRequestFrom = useMemo(
    () => () => (getIsReservationTypes() ? state.reserve_for : state.requested_from),
    [getIsReservationTypes, state.requested_from, state.reserve_for],
  );

  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle table actions
   */
  const onActionClicked = (action, row) => {
    if (action.key === SystemActionsEnum.deselect.key) deselectVisasHandler({ row });
  };

  /**
   * @param {option, index}
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the chips click in order
   * to open the template
   */
  // const onExternalChipClicked = ({
  //     option,
  //     index,
  //                                }) => {
  //   window.open(`${process.env.REACT_APP_HEADERS}/form-builder/info?form_uuid=${option.type_uuid}&source=1&editorRole=sender&template_uuid=ebe0557d-b50d-47c6-8d49-e4b673b89014&template_type_uuid=4e6c5ae1-12f4-490b-8b79-a64f5d9417d2&status=1`, '_blank');
  // };

  return (
    <div className="request-details-tab-wrapper tab-wrapper">
      <div className="header-text px-2 mb-3">
        <span>{t(`${translationPath}general`)}</span>
      </div>
      <SharedAutocompleteControl
        editValue={getUserType()}
        placeholder="select-user-type"
        inlineLabel="user-type"
        stateKey={
          getIsReservationTypes() ? 'reserve_for_type' : 'requested_from_type'
        }
        isHalfWidth
        initValuesTitle="valueSingle"
        isDisabled={
          isLoading
          || getIsDisabledFieldsOrActions()
          || (getIsReservationTypes()
            ? !getIsAllowedPermissionV2({
              permissions,
              permissionId: ManageVisasPermissions.ReserveOnBehalf.key,
            })
            : !getIsAllowedPermissionV2({
              permissions,
              defaultPermissions: {
                AllocateOnBehalf: ManageVisasPermissions.AllocateOnBehalf.key,
                AllocateOnBehalfEvarec:
                    EvaRecManageVisaPermissions.AllocateOnBehalf.key,
              },
            }))
        }
        isGlobalLoading={isLoading}
        isRequired
        onValueChanged={(newValue) => {
          if (state.reserve_for) onStateChanged({ id: 'reserve_for', value: null });
          if (state.requested_from)
            onStateChanged({ id: 'requested_from', value: null });

          onStateChanged(newValue);
        }}
        initValues={usersTypes}
        errors={errors}
        errorPath={
          getIsReservationTypes() ? 'reserve_for_type' : 'requested_from_type'
        }
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {getUserType() === SetupsUsersTypesEnums.Admins.key && (
        <SharedAPIAutocompleteControl
          isHalfWidth
          inlineLabel={getIsReservationTypes() ? 'reserve-for' : 'request-from'}
          placeholder={
            getIsReservationTypes() ? 'select-reserve-for' : 'select-request-from'
          }
          stateKey={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          errors={errors}
          isSubmitted={isSubmitted}
          errorPath={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
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
          isDisabled={
            isLoading
            || getIsDisabledFieldsOrActions()
            || (getIsReservationTypes()
              ? !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageVisasPermissions.ReserveOnBehalf.key,
              })
              : !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  AllocateOnBehalf: ManageVisasPermissions.AllocateOnBehalf.key,
                  AllocateOnBehalfEvarec:
                      EvaRecManageVisaPermissions.AllocateOnBehalf.key,
                },
              }))
          }
          isLoading={isLoading}
          editValue={getRequestFrom()}
          extraProps={{
            ...(getRequestFrom() && {
              with_than: [getRequestFrom()],
            }),
          }}
        />
      )}
      {getUserType() === SetupsUsersTypesEnums.Employees.key && (
        <SharedAPIAutocompleteControl
          isHalfWidth
          inlineLabel={getIsReservationTypes() ? 'reserve-for' : 'request-from'}
          placeholder={
            getIsReservationTypes() ? 'select-reserve-for' : 'select-request-from'
          }
          stateKey={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          errors={errors}
          isSubmitted={isSubmitted}
          isEntireObject
          errorPath={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          onValueChanged={(newVal) => {
            const localeState = {
              ...state,
              employee_uuid: newVal?.value?.uuid || null,
              [newVal.id]: newVal?.value?.user_uuid || null,
            };
            onStateChanged({ id: 'edit', value: localeState });
          }}
          getOptionLabel={(option) =>
            `${
              (option.first_name
                && (option.first_name[i18next.language] || option.first_name.en))
              || ''
            }${
              (option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`)
              || ''
            }` || 'N/A'
          }
          getDataAPI={GetAllSetupsEmployees}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={
            isLoading
            || getIsDisabledFieldsOrActions()
            || (getIsReservationTypes()
              ? !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageVisasPermissions.ReserveOnBehalf.key,
              })
              : !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  AllocateOnBehalf: ManageVisasPermissions.AllocateOnBehalf.key,
                  AllocateOnBehalfEvarec:
                      EvaRecManageVisaPermissions.AllocateOnBehalf.key,
                },
              }))
          }
          isLoading={isLoading}
          searchKey="search"
          uniqueKey="uuid"
          editValue={state?.employee_uuid || null}
          extraProps={{
            all_employee: 1,
            ...((state.employee_uuid || getRequestFrom()) && {
              with_than: [state.employee_uuid || getRequestFrom()],
            }),
          }}
        />
      )}

      {getUserType() === SetupsUsersTypesEnums.Agency.key && (
        <SharedAPIAutocompleteControl
          isHalfWidth
          inlineLabel={getIsReservationTypes() ? 'reserve-for' : 'request-from'}
          placeholder={
            getIsReservationTypes() ? 'select-reserve-for' : 'select-request-from'
          }
          stateKey={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          errors={errors}
          isSubmitted={isSubmitted}
          errorPath={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          onValueChanged={onStateChanged}
          getOptionLabel={(option) =>
            `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
          }
          getDataAPI={GetAllSetupsProviders}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isDisabled={
            isLoading
            || getIsDisabledFieldsOrActions()
            || (getIsReservationTypes()
              ? !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageVisasPermissions.ReserveOnBehalf.key,
              })
              : !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  AllocateOnBehalf: ManageVisasPermissions.AllocateOnBehalf.key,
                  AllocateOnBehalfEvarec:
                      EvaRecManageVisaPermissions.AllocateOnBehalf.key,
                },
              }))
          }
          isLoading={isLoading}
          searchKey="search"
          uniqueKey="user_uuid"
          editValue={getRequestFrom()}
          extraProps={{
            job_uuid: state.job_uuid,
            type: SetupsUsersTypesEnums.Agency.userType,
            ...(getRequestFrom() && {
              with_than: [getRequestFrom()],
            }),
          }}
        />
      )}
      {getUserType() === SetupsUsersTypesEnums.University.key && (
        <SharedAPIAutocompleteControl
          isHalfWidth
          inlineLabel={getIsReservationTypes() ? 'reserve-for' : 'request-from'}
          placeholder={
            getIsReservationTypes() ? 'select-reserve-for' : 'select-request-from'
          }
          stateKey={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          errors={errors}
          isSubmitted={isSubmitted}
          errorPath={getIsReservationTypes() ? 'reserve_for' : 'requested_from'}
          uniqueKey="user_uuid"
          onValueChanged={onStateChanged}
          getOptionLabel={(option) =>
            `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
          }
          getDataAPI={GetAllSetupsProviders}
          isDisabled={
            isLoading
            || getIsDisabledFieldsOrActions()
            || (getIsReservationTypes()
              ? !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageVisasPermissions.ReserveOnBehalf.key,
              })
              : !getIsAllowedPermissionV2({
                permissions,
                defaultPermissions: {
                  AllocateOnBehalf: ManageVisasPermissions.AllocateOnBehalf.key,
                  AllocateOnBehalfEvarec:
                      EvaRecManageVisaPermissions.AllocateOnBehalf.key,
                },
              }))
          }
          isLoading={isLoading}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="search"
          editValue={getRequestFrom()}
          extraProps={{
            job_uuid: state.job_uuid,
            type: SetupsUsersTypesEnums.University.userType,
            ...(getRequestFrom() && {
              with_than: [getRequestFrom()],
            }),
          }}
        />
      )}
      {!getIsReservationTypes() && (
        <>
          <SharedInputControl
            isHalfWidth
            inlineLabel="visa-for"
            stateKey="visa_for"
            placeholder="visa-for"
            isDisabled
            editValue={`${state.first_name || ''}${
              (state.last_name && ` ${state.last_name}`) || ''
            }`}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <SharedInputControl
            isHalfWidth
            inlineLabel="first-name"
            stateKey="first_name"
            placeholder="first-name"
            isDisabled
            editValue={state.first_name}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <SharedInputControl
            isHalfWidth
            inlineLabel="last-name"
            stateKey="last_name"
            placeholder="last-name"
            isDisabled
            editValue={state.last_name}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          {state.position_name && (
            <SharedInputControl
              isHalfWidth
              inlineLabel="position"
              stateKey="position_name"
              placeholder="position"
              isDisabled
              editValue={state.position_name}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </>
      )}
      <SharedAPIAutocompleteControl
        isHalfWidth
        inlineLabel="occupation"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="occupation"
        errorPath="occupation"
        searchKey="search"
        placeholder="select-occupation"
        onValueChanged={onStateChanged}
        isRequired
        editValue={state.occupation}
        getDataAPI={GetAllVisaOccupations}
        getItemByIdAPI={GetVisaOccupationById}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        getOptionLabel={(option) =>
          (option.name
            && (option.name[i18next.language] || option.name.en || 'N/A'))
          || 'N/A'
        }
        extraProps={
          state.uuid && state.occupation && { with_than: [state.occupation] }
        }
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        inlineLabel="gender"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="gender"
        errorPath="gender"
        searchKey="search"
        placeholder="select-gender"
        onValueChanged={onStateChanged}
        editValue={state.gender}
        getDataAPI={GetAllVisaGenders}
        getItemByIdAPI={GetVisaGenderById}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        getOptionLabel={(option) =>
          (option.name
            && (option.name[i18next.language] || option.name.en || 'N/A'))
          || 'N/A'
        }
        extraProps={state.uuid && state.gender && { with_than: [state.gender] }}
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        inlineLabel="nationality"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="nationality"
        errorPath="nationality"
        searchKey="search"
        placeholder="select-nationality"
        onValueChanged={onStateChanged}
        editValue={state.nationality}
        getDataAPI={GetAllVisaNationalities}
        getItemByIdAPI={GetVisaNationalityById}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        getOptionLabel={(option) =>
          (option.name
            && (option.name[i18next.language] || option.name.en || 'N/A'))
          || 'N/A'
        }
        extraProps={
          state.uuid && state.nationality && { with_than: [state.nationality] }
        }
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        inlineLabel="religion"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="religion"
        errorPath="religion"
        searchKey="search"
        placeholder="select-religion"
        onValueChanged={onStateChanged}
        editValue={state.religion}
        getDataAPI={GetAllVisaReligions}
        getItemByIdAPI={GetVisaReligionById}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        getOptionLabel={(option) =>
          (option.name
            && (option.name[i18next.language] || option.name.en || 'N/A'))
          || 'N/A'
        }
        extraProps={state.uuid && state.religion && { with_than: [state.religion] }}
      />
      <SharedAPIAutocompleteControl
        isHalfWidth
        inlineLabel="arriving-from"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="issue_place"
        errorPath="issue_place"
        searchKey="search"
        placeholder="select-arriving-from"
        onValueChanged={onStateChanged}
        editValue={state.issue_place}
        getDataAPI={GetAllVisaIssuePlaces}
        getItemByIdAPI={GetVisaIssuePlaceById}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        getOptionLabel={(option) =>
          (option.name
            && (option.name[i18next.language] || option.name.en || 'N/A'))
          || 'N/A'
        }
        extraProps={
          state.uuid && state.issue_place && { with_than: [state.issue_place] }
        }
      />
      {!getIsReservationTypes() && (
        <SharedAPIAutocompleteControl
          isHalfWidth
          inlineLabel="form-templates"
          placeholder="select-form-templates"
          errors={errors}
          stateKey="form_templates"
          searchKey="search"
          editValue={state.form_templates}
          isDisabled={isLoading || getIsDisabledFieldsOrActions()}
          // onExternalChipClicked={onExternalChipClicked}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          getDataAPI={GetAllBuilderTemplates}
          parentTranslationPath={parentTranslationPath}
          type={DynamicFormTypesEnum.array.key}
          errorPath="form_templates"
          getOptionLabel={(option) => option.title || 'N/A'}
          extraProps={{
            code: DefaultFormsTypesEnum.Visa.key,
            with_than: state.form_templates || [],
          }}
        />
      )}
      {getIsReservationTypes() && (
        <SharedInputControl
          isHalfWidth
          inlineLabelIcon="fas fa-hashtag"
          inlineLabel="reserve"
          errors={errors}
          isSubmitted={isSubmitted}
          stateKey="count"
          errorPath="count"
          placeholder="eg-reserved-visas"
          editValue={state.count}
          min={0}
          wrapperClasses="px-2"
          isLoading={isLoading}
          isDisabled={isLoading || getIsDisabledFieldsOrActions()}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      <SharedInputControl
        isFullWidth
        inlineLabel="note"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="note"
        errorPath="note"
        placeholder="note-description"
        editValue={state.note}
        wrapperClasses="px-2"
        multiline
        rows={4}
        isLoading={isLoading}
        isDisabled={isLoading || getIsDisabledFieldsOrActions()}
        onValueChanged={onStateChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {(getIsAllocation()
        || getIsConfirmType()
        || (getIsViewTypes() && state.selectedVisas.length > 0)) && (
        <div className="d-flex flex-wrap px-2">
          <div className="d-flex header-text mb-1">
            <span>{t(`${translationPath}visa`)}</span>
          </div>
          {state.selectedVisas.length === 0 && (
            <div className="d-flex description-text mb-3">
              <span>{t(`${translationPath}no-visas-selected`)}</span>
            </div>
          )}
          {state.selectedVisas.length > 0 && (
            <div className="d-flex description-text mb-2">
              <span>{getTotalSelectedVisas()}</span>
              <span className="px-1">{t(`${translationPath}visa-selected`)}</span>
            </div>
          )}
          {state.selectedVisas.length > 0 && (
            <TablesComponent
              data={state.selectedVisas}
              isLoading={isLoading}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              totalItems={state.selectedVisas.length}
              isDynamicDate
              uniqueKeyInput="uuid"
              wrapperClasses="px-0"
              getIsDisabledRow={(row) => row.can_delete === false}
              isWithTableActions
              isPopoverActions
              onActionClicked={onActionClicked}
              tableActions={[SystemActionsEnum.deselect]}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isWithoutBoxWrapper
              themeClasses="theme-transparent"
              tableActionsOptions={{
                getDisabledAction: () => getIsViewTypes(),
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

RequestDetailsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getIsDisabledFieldsOrActions: PropTypes.func.isRequired,
  getTotalSelectedVisas: PropTypes.func.isRequired,
  deselectVisasHandler: PropTypes.func.isRequired,
  usersTypes: PropTypes.instanceOf(Array).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  getIsReservationTypes: PropTypes.func.isRequired,
  getIsConfirmType: PropTypes.func.isRequired,
  getIsAllocation: PropTypes.func,
  getIsViewTypes: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
