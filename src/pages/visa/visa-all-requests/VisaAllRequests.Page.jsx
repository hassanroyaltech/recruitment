import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import {
  VisaRequestMoreInfoManagementDialog,
  VisaRequestsManagementDialog,
  VisaAllocationsFiltersDialog,
  VisaReservationsFiltersDialog,
  VisaMassAllocationFiltersDialog,
} from '../dialogs';
import {
  AssigneeTypesEnum,
  NavigationSourcesEnum,
  OffersStatusesEnum,
  SystemActionsEnum,
  VisaRequestsCallLocationsEnum,
  VisaRequestsStatusesEnum,
} from '../../../enums';
import { ButtonBase } from '@mui/material';
import { TabsComponent } from '../../../components';
import { AllRequestsTabs } from '../tabs-data';
import { getIsAllowedPermissionV2, showError, showSuccess } from '../../../helpers';
import { useSelector } from 'react-redux';
import {
  DeleteOrRejectVisaReservation,
  RejectVisaAllocation,
} from '../../../services';
import i18next from 'i18next';
import { ManageVisasPermissions } from '../../../permissions';

const parentTranslationPath = 'VisaPage';
const translationPath = 'VisaStatusTab.';

const VisaAllRequestsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}visa-all-requests`));
  const [activeTab, setActiveTab] = useState(0);
  const [visaStatusesList] = useState(() =>
    Object.values(VisaRequestsStatusesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [allRequestsTabsData] = useState(() => AllRequestsTabs);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector(
    (reducerState) => reducerState?.userReducer?.results?.user,
  );
  const [isForceToReload, setIsForceToReload] = useState(false);
  const filterInit = useRef({
    reserve_for: null,
    requested_from: null,
    query: null,
    order_type: 'DESC',
    order_by: '1',
    offer_status: [
      {
        ...OffersStatusesEnum.Completed,
        status: t(`${translationPath}${OffersStatusesEnum.Completed.status}`),
      },
    ],
    ...(userReducer?.user_type === AssigneeTypesEnum.User.key && {
      assigned_users: [userReducer],
    }),
    ...(userReducer?.user_type === AssigneeTypesEnum.Employee.key && {
      assigned_employees: [userReducer],
    }),
  });
  const [filter, setFilter] = useState(filterInit.current);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    moreInfoManagement: false,
    visaRequestManagement: false,
    allocation_filters: false,
    reservations_filters: false,
    mass_allocation_filters: false,
  });
  const [activeItem, setActiveItem] = useState(null);
  const [callLocation, setCallLocation] = useState(null);

  /**
   * @param key
   * @param newValue - bool
   * @param isClearActiveItem - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback(
    (key, newValue, isClearActiveItem = false) =>
      () => {
        if (isClearActiveItem) setActiveItem(null);
        setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
      },
    [],
  );

  /**
   * @param nameObject - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the full name of the send object
   */
  const getFullName = useMemo(
    () => (nameObject) =>
      `${
        (nameObject.first_name
          && typeof nameObject.first_name === 'object'
          && (nameObject.first_name[i18next.language] || nameObject.first_name.en))
        || nameObject.first_name
        || ''
      }${
        (nameObject.last_name
          && typeof nameObject.last_name === 'object'
          && ` ${nameObject.last_name[i18next.language] || nameObject.last_name.en}`)
        || (nameObject.last_name && ` ${nameObject.last_name}`)
        || ''
      }`,
    [],
  );

  /**
   * @param newValue - VisaRequestsCallLocationsEnum key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of call location from child
   */
  const onCallLocationChanged = useCallback((newValue) => {
    setCallLocation(newValue);
  }, []);

  /**
   * @param newValue - VisaRequestsCallLocationsEnum key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of filters from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get visa status details by key
   */
  const getVisaStatusByKey = useMemo(
    () => (key) => visaStatusesList.find((item) => item.key === key) || {},
    [visaStatusesList],
  );

  /**
   * @param item - object
   * @param rowIndex - number
   * @param actionEnum - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return if the table action is disabled or not
   */
  const getIsDisabledAction = useMemo(
    () =>
      (isReservation = false) =>
        (item, rowIndex, actionEnum) => {
          if (actionEnum.key === SystemActionsEnum.view.key)
            return !getIsAllowedPermissionV2({
              permissions,
              permissionId:
              (isReservation && ManageVisasPermissions.ViewVisaReservation.key)
              || ManageVisasPermissions.ViewVisaAllocation.key,
            });
          if (actionEnum.key === SystemActionsEnum.edit.key)
            return !(
              getIsAllowedPermissionV2({
                permissions,
                permissionId:
                (isReservation
                  && ManageVisasPermissions.RequestVisaReservation.key)
                || ManageVisasPermissions.RequestVisaAllocation.key,
              })
            && [
              VisaRequestsStatusesEnum.Pending.key,
              VisaRequestsStatusesEnum.RequestInfo.key,
            ].includes(item.status)
            );
          if (actionEnum.key === SystemActionsEnum.moreInfo.key)
            return !(
              userReducer
            && (item.reserve_for || item.requested_from).uuid !== userReducer.uuid
            && getIsAllowedPermissionV2({
              permissions,
              permissionId: ManageVisasPermissions.RequestMoreInformation.key,
            })
            && [VisaRequestsStatusesEnum.Pending.key].includes(item.status)
            );
          if (actionEnum.key === SystemActionsEnum.reject.key)
            return !(
              [
                VisaRequestsStatusesEnum.Pending.key,
                VisaRequestsStatusesEnum.RequestInfo.key,
              ].includes(item.status)
            && getIsAllowedPermissionV2({
              permissions,
              permissionId:
                (isReservation
                  && ManageVisasPermissions.CancelVisaReservation.key)
                || ManageVisasPermissions.CancelVisaAllocation.key,
            })
            );
          if (actionEnum.key === SystemActionsEnum.allocate.key)
            return !(
              [VisaRequestsStatusesEnum.Pending.key].includes(item.status)
            && getIsAllowedPermissionV2({
              permissions,
              permissionId: ManageVisasPermissions.ConfirmVisaAllocation.key,
            })
            );
          if (actionEnum.key === SystemActionsEnum.reserve.key)
            return !(
              [VisaRequestsStatusesEnum.Pending.key].includes(item.status)
            && getIsAllowedPermissionV2({
              permissions,
              permissionId: ManageVisasPermissions.ConfirmVisaReservation.key,
            })
            );
          return true;
        },
    [permissions, userReducer],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the request cancel
   */
  const rejectOrWithdrawHandler = async (
    localActiveItem,
    isFromReservation = true,
  ) => {
    // setIsLoading(true);
    const response = await ((isFromReservation
      && DeleteOrRejectVisaReservation({
        uuid: localActiveItem.uuid,
      }))
      || RejectVisaAllocation({
        request_uuid: localActiveItem.uuid,
      }));
    if (response && response.status === 200) {
      window?.ChurnZero?.push([
        'trackEvent',
        isFromReservation
          ? 'EVA-VISA - Reservation Action'
          : 'EVA-VISA - Allocation Action',
        isFromReservation
          ? 'EVA-VISA - Reservation Action'
          : 'EVA-VISA - Allocation Action',
        1,
        {},
      ]);
      // setIsLoading(false);
      showSuccess(
        t(
          `${translationPath}request-${
            (userReducer
              && (localActiveItem.reserve_for || localActiveItem.requested_from)
                .uuid === userReducer.uuid
              && 'withdraw')
            || 'rejected'
          }-successfully`,
        ),
      );
      setIsForceToReload((item) => !item);
    } else
      showError(
        t(
          `${translationPath}request-${
            (userReducer
              && (localActiveItem.reserve_for || localActiveItem.requested_from)
                .uuid === userReducer.uuid
              && 'withdraw')
            || 'reject'
          }-failed`,
        ),
        response,
      );
  };

  /**
   * @param newValue - Object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of active item on action click
   */
  const onActiveItemChanged = useCallback((newValue) => {
    setActiveItem(newValue);
  }, []);

  return (
    <div className="visa-all-requests-page-wrapper page-wrapper pt-3">
      <div className="page-header-wrapper d-flex-v-center-h-between flex-wrap px-3 pb-3">
        <span className="header-text-x2 mb-1">
          <span>
            <div className="d-inline-flex-center p-2 bg-gray-light br-1rem">
              <span className="fas fa-exchange-alt" />
            </div>
            <span className="px-2">{t(`${translationPath}all-requests`)}</span>
          </span>
        </span>
        {activeTab === 0 && (
          <ButtonBase
            className="btns theme-solid mx-2"
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId: ManageVisasPermissions.RequestVisaReservation.key,
              })
            }
            onClick={() => {
              setCallLocation(
                VisaRequestsCallLocationsEnum.AllRequestsReservationNewRequest.key,
              );
              onIsOpenDialogsChanged('visaRequestManagement', true)();
            }}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}new-request`)}</span>
          </ButtonBase>
        )}
      </div>
      <TabsComponent
        isPrimary
        isWithLine
        labelInput="label"
        idRef="allRequestsTabsRef"
        data={allRequestsTabsData}
        currentTab={activeTab}
        translationPath={translationPath}
        onTabChanged={(event, currentTab) => {
          setActiveTab(currentTab);
          setFilter(filterInit.current);
        }}
        parentTranslationPath={parentTranslationPath}
        dynamicComponentProps={{
          isForceToReload,
          getIsDisabledAction,
          filter,
          setFilter,
          filterInit,
          onFilterChanged,
          onCallLocationChanged,
          isWithTableActions: true,
          activeItem,
          rejectOrWithdrawHandler,
          getVisaStatusByKey,
          onActiveItemChanged,
          getFullName,
          onIsOpenDialogsChanged,
          parentTranslationPath,
          translationPath,
        }}
      />
      {isOpenDialogs.visaRequestManagement && (
        <VisaRequestsManagementDialog
          request_uuid={(activeItem && activeItem.uuid) || undefined}
          candidate_uuid={(activeItem && activeItem.candidate_uuid) || undefined}
          job_uuid={(activeItem && activeItem.job_uuid) || undefined}
          status={(activeItem && activeItem.status) || undefined}
          isOpen={isOpenDialogs.visaRequestManagement}
          formSource={NavigationSourcesEnum.VisaRequestToFormBuilder.key}
          first_name={
            (activeItem
              && activeItem.candidate
              && activeItem.candidate.first_name)
            || undefined
          }
          last_name={
            (activeItem && activeItem.candidate && activeItem.candidate.last_name)
            || undefined
          }
          // position_name={candidateDetail.position}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            setIsForceToReload((item) => !item);
          }}
          isOpenChanged={onIsOpenDialogsChanged(
            'visaRequestManagement',
            false,
            true,
          )}
          callLocation={callLocation}
        />
      )}

      {isOpenDialogs.moreInfoManagement && (
        <VisaRequestMoreInfoManagementDialog
          request_uuid={(activeItem && activeItem.uuid) || undefined}
          isOpen={isOpenDialogs.moreInfoManagement}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            setIsForceToReload((item) => !item);
          }}
          isOpenChanged={onIsOpenDialogsChanged('moreInfoManagement', false, true)}
          callLocation={callLocation}
        />
      )}
      {isOpenDialogs.allocation_filters && (
        <VisaAllocationsFiltersDialog
          isOpen={isOpenDialogs.allocation_filters}
          isOpenChanged={onIsOpenDialogsChanged('allocation_filters', false, true)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onFilterChanged={onFilterChanged}
          filter={filter}
        />
      )}
      {isOpenDialogs.reservations_filters && (
        <VisaReservationsFiltersDialog
          isOpen={isOpenDialogs.reservations_filters}
          isOpenChanged={onIsOpenDialogsChanged('reservations_filters', false, true)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onFilterChanged={onFilterChanged}
          filter={filter}
        />
      )}
      {isOpenDialogs.mass_allocation_filters && (
        <VisaMassAllocationFiltersDialog
          isOpen={isOpenDialogs.mass_allocation_filters}
          isOpenChanged={onIsOpenDialogsChanged(
            'mass_allocation_filters',
            false,
            true,
          )}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onFilterChanged={onFilterChanged}
          filter={filter}
        />
      )}
    </div>
  );
};

export default VisaAllRequestsPage;
