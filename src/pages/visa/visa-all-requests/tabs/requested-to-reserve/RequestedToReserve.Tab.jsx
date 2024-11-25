import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { showError, StringToColor } from '../../../../../helpers';
import {
  SystemActionsEnum,
  VisaRequestsCallLocationsEnum,
  VisaRequestsStatusesEnum,
} from '../../../../../enums';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import { useTranslation } from 'react-i18next';
import { GetAllVisaReservations } from '../../../../../services';
import Avatar from '@mui/material/Avatar';
import { ButtonBase, Typography } from '@mui/material';
import { SharedInputControl } from '../../../../setups/shared';
import i18next from 'i18next';
import { getNameHandler } from '../../../../../utils/functions/helpers';
import { GetAllMassAllocationVisas } from '../../../../../services/VisaMassAllocation.Services';

export const RequestedToReserveTab = ({
  isForceToReload,
  filter,
  setFilter,
  filterInit,
  getIsDisabledAction,
  getVisaStatusByKey,
  getFullName,
  onActiveItemChanged,
  isWithCheckAll,
  isDetailedVisas,
  isWithCheck,
  isWithTableActions,
  getIsDisabledRow,
  globalSelectedRows,
  onSelectAllCheckboxChanged,
  onSelectCheckboxChanged,
  onFilterChanged,
  onIsOpenDialogsChanged,
  onCallLocationChanged,
  rejectOrWithdrawHandler,
  parentTranslationPath,
  translationPath,
  hideFilters,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const localFilterInit = useRef({
    page: 1,
    limit: 10,
  });
  const [localFilter, setLocalFilter] = useState({
    ...(filter || {}),
    ...localFilterInit.current,
  });
  const [requests, setRequests] = useState({
    results: [],
    totalCount: 0,
  });
  const defaultRequestTableColumnsRef = useRef([
    {
      id: 1,
      input: 'created_at',
      label: 'requested',
      isSortable: true,
    },
    // {
    //   id: 2,
    //   input: 'block_number',
    //   label: 'block-id',
    //   isSortable: true,
    // },
    {
      id: 3,
      label: 'reserve-for',
      component: (row) => (
        <div className="d-inline-flex-v-center">
          <Avatar
            style={{
              backgroundColor: StringToColor(getFullName(row.reserve_for)),
            }}
          >
            {getFullName(row.reserve_for)
              && getFullName(row.reserve_for)
                .split(' ')
                .map((word) => word[0])}
          </Avatar>
          <Typography className="px-2">{getFullName(row.reserve_for)}</Typography>
        </div>
      ),
      isHidden: isDetailedVisas,
      isSortable: false,
    },
    {
      id: 4,
      input: 'status',
      label: 'status',
      isHidden: isDetailedVisas,
      component: (row) => (
        <div className="stage-tag-wrapper mx-0">
          <span className="fas fa-circle" />
          <span className="px-1">
            {getVisaStatusByKey(row.status).value || 'N/A'}
          </span>
        </div>
      ),
      isSortable: true,
    },
    {
      id: 5,
      input: 'count',
      label: 'count',
      isSortable: true,
      isHidden: isDetailedVisas,
    },
    {
      id: 6,
      // input: 'count',
      label: 'total-available-reserved',
      component: (row) =>
        (isDetailedVisas && <span>{row.count}</span>) || (
          <span>
            {row.visa_uuid
              ? row.visa_uuid.reduce((total, item) => total + item.count, 0)
              : 0}
          </span>
        ),
      isSortable: false,
    },
    {
      id: 7,
      input: 'pending_count',
      label: 'pending',
      isSortable: false,
    },
    {
      id: 8,
      input: 'more_info',
      label: 'more-information',
      component: (row) =>
        (row.status === VisaRequestsStatusesEnum.RequestInfo.key && (
          <span>{row.more_info}</span>
        )) || <span></span>,
      isHidden: isDetailedVisas,
      isSortable: true,
    },
    {
      id: 9,
      label: 'request-more-info-by',
      component: (row) =>
        (row.status === VisaRequestsStatusesEnum.RequestInfo.key && (
          <div className="d-inline-flex-v-center">
            <Avatar
              style={{
                backgroundColor: StringToColor(getFullName(row.more_info_by)),
              }}
            >
              {getFullName(row.more_info_by)
                && getFullName(row.more_info_by)
                  .split(' ')
                  .map((word) => word[0])}
            </Avatar>
            <Typography className="px-2">{getFullName(row.more_info_by)}</Typography>
          </div>
        ))
        || null,
      isHidden: isDetailedVisas,
      isSortable: false,
    },
    {
      id: 10,
      input: `occupation.${i18next.language}`,
      label: 'occupation',
      isSortable: true,
    },
    {
      id: 11,
      input: `nationality.${i18next.language}`,
      label: 'nationality',
      isSortable: true,
    },
    {
      id: 12,
      input: `gender.${i18next.language}`,
      label: 'gender',
      isSortable: true,
    },
    {
      id: 13,
      input: `religion.${i18next.language}`,
      label: 'religion',
      isSortable: true,
    },
    {
      id: 14,
      input: `issue_place.${i18next.language}`,
      label: 'arriving-from',
      isSortable: true,
    },
  ]);
  const defaultDetailsTableColumnsRef = useRef([
    {
      id: 'block_number',
      input: 'block_number',
      label: 'block-number',
      isSortable: true,
    },
    {
      id: 'occupation',
      input: 'occupation',
      label: 'occupation',
      isSortable: true,
      component: (item) =>
        item.occupation?.[i18next.language] || item.occupation?.en,
    },
    {
      id: 'nationality',
      input: 'nationality',
      label: 'nationality',
      isSortable: true,
      component: (item) =>
        item.nationality?.[i18next.language] || item.nationality?.en,
    },
    {
      id: 'gender',
      input: 'gender',
      label: 'gender',
      isSortable: true,
      component: (item) => item.gender?.[i18next.language] || item.gender?.en,
    },
    {
      id: 'religion',
      input: 'religion',
      label: 'religion',
      isSortable: true,
      component: (item) => item.religion?.[i18next.language] || item.religion?.en,
    },
    {
      id: 'issue_place',
      input: 'issue_place',
      label: 'arriving-from',
      isSortable: true,
      component: (item) =>
        item.issue_place?.[i18next.language] || item.issue_place?.en,
    },
    {
      id: 'allocated',
      input: 'allocated',
      label: 'allocated',
      isSortable: true,
    },
    {
      id: 'available',
      input: 'available',
      label: 'available',
      isSortable: true,
    },
  ]);
  const [tableColumns] = useState(
    isDetailedVisas
      ? defaultDetailsTableColumnsRef.current
      : defaultRequestTableColumnsRef.current,
  );

  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle table actions
   */
  const onActionClicked = (action, row) => {
    if (action.key === SystemActionsEnum.reject.key) {
      if (rejectOrWithdrawHandler) rejectOrWithdrawHandler(row);
      return;
    }
    if (onActiveItemChanged) onActiveItemChanged(row);
    if (!onIsOpenDialogsChanged) return;
    if (action.key === SystemActionsEnum.moreInfo.key) {
      onCallLocationChanged(
        VisaRequestsCallLocationsEnum.AllRequestsReservationMoreInfo.key,
      );
      onIsOpenDialogsChanged('moreInfoManagement', true)();
      return;
    }
    if (action.key === SystemActionsEnum.edit.key)
      onCallLocationChanged(
        VisaRequestsCallLocationsEnum.AllRequestsReservationEdit.key,
      );
    else if (action.key === SystemActionsEnum.view.key)
      onCallLocationChanged(
        VisaRequestsCallLocationsEnum.AllRequestsReservationView.key,
      );
    else if (action.key === SystemActionsEnum.reserve.key)
      onCallLocationChanged(
        VisaRequestsCallLocationsEnum.AllRequestsReservationReserve.key,
      );

    onIsOpenDialogsChanged('visaRequestManagement', true)();
    // else if (action.key === SystemActionsEnum.delete.key)
    //   setIsOpenDeleteDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    setLocalFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    setLocalFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all reservation requests
   */
  const getAllVisaReservations = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    const reserveForValue = hideFilters
      ? localFilter.reserve_for
      : localFilter.reserve_for?.user_uuid || localFilter.reserve_for?.uuid;
    const localfilterFormat = {
      ...localFilter,
      status: localFilter.status?.map((it) => it.key),
      reserve_for_type: hideFilters
        ? localFilter.reserve_for_type?.toString()
        : localFilter.reserve_for_type?.key?.toString(),
      reserve_for:
        reserveForValue && (isDetailedVisas ? [reserveForValue] : reserveForValue),
      occupation: localFilter.occupation?.map((it) => it.uuid),
      gender: localFilter.gender?.map((it) => it.uuid),
      nationality: localFilter.nationality?.map((it) => it.uuid),
      religion: localFilter.religion?.map((it) => it.uuid),
      issue_place: localFilter.issue_place?.map((it) => it.uuid),
    };

    const response = await ((isDetailedVisas
      && GetAllMassAllocationVisas(localfilterFormat))
      || GetAllVisaReservations(localfilterFormat));
    setIsLoading(false);
    isLoadingRef.current = false;
    if (response && response.status === 200)
      setRequests({
        results: response.data.results || [],
        totalCount: response.data.paginate?.total,
      });
    else {
      setRequests({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [isDetailedVisas, localFilter, t, hideFilters]);

  const ChipsArray = useMemo(
    () =>
      Object.keys(localFilter || {}).filter(
        (item) =>
          ![
            'limit',
            'page',
            'order_type',
            'order_by',
            'offer_status',
            'assigned_users',
            'assigned_employees',
          ].includes(item)
          && localFilter[item]
          && ((Array.isArray(localFilter[item]) && localFilter[item].length > 0)
            || !Array.isArray(localFilter[item])),
      ),
    [localFilter],
  );

  const GetChipsValue = useCallback((chip, value) => {
    switch (chip) {
    case 'reserve_for':
      return getNameHandler(value, i18next.language);
    case 'occupation':
    case 'gender':
    case 'religion':
    case 'issue_place':
    case 'nationality':
      return value.map((it) => getNameHandler(it, i18next.language));
    case 'status':
      return value.map((it) => it.value);
    case 'reserve_for_type':
      return value.valueSingle;
    default:
      return value;
    }
  }, []);

  useEffect(() => {
    setLocalFilter((items) => ({
      ...items,
      ...(filter || {}),
      page: 1,
    }));
  }, [filter, isForceToReload]);

  // this is to return all request on tab init or filter change
  useEffect(() => {
    if (isLoadingRef.current) return;
    getAllVisaReservations();
  }, [localFilter, getAllVisaReservations]);

  return (
    <div className="requested-to-reserve-tab-wrapper tab-wrapper">
      <div className="actions-section-wrapper">
        <div className="d-inline-flex px-3 mb-3 mt-2">
          <span>
            <span>{t(`Shared:showing`)}</span>
            <span className="px-1">
              <span>{requests.totalCount}</span>
            </span>
          </span>
        </div>
        {!hideFilters && (
          <div className="d-inline-flex flex-wrap">
            <SharedInputControl
              parentTranslationPath="Shared"
              // editValue={candidatesFilters.search}
              isDisabled={isLoading}
              stateKey="search"
              themeClass="theme-transparent"
              placeholder="search"
              wrapperClasses="small-control px-2"
              onInputBlur={({ value }) => {
                if (filter.query !== value) onFilterChanged({ query: value });
              }}
              executeOnInputBlur
              onKeyDown={(event) => {
                if (event.key === 'Enter' && filter.query !== event.target.value)
                  onFilterChanged({ query: event.target.value });
              }}
              startAdornment={
                <div className="start-adornment-wrapper mx-2 mt-1 c-gray-primary">
                  <span className="fas fa-search" />
                </div>
              }
            />
            <ButtonBase
              className="btns theme-transparent miw-0 mb-3"
              onClick={() => onIsOpenDialogsChanged('reservations_filters', true)()}
            >
              <span>{t(`Shared:filters`)}</span>
            </ButtonBase>
            <ButtonBase
              className="btns theme-transparent miw-0 mb-3"
              onClick={() =>
                onFilterChanged({
                  order_type: filter.order_type === 'DESC' ? 'ASC' : 'DESC',
                })
              }
            >
              <span
                className={`${
                  filter.order_type === 'DESC'
                    ? 'fas fa-sort-amount-down'
                    : 'fas fa-sort-amount-up'
                }`}
              />
              <span className="mx-2">{t(`Shared:sort`)}</span>
            </ButtonBase>
          </div>
        )}
      </div>

      {!hideFilters && !!ChipsArray?.length && (
        <div className="reservations-chips d-flex-v-center">
          <ButtonBase
            className="reservations-chip btns theme-outline"
            onClick={() => {
              setLocalFilter(localFilterInit.current);
              setFilter(filterInit.current);
            }}
          >
            <span>{t(`${translationPath}reset-filters`)}</span>
          </ButtonBase>
          <div>
            {ChipsArray.map((chip, chipIdx) => (
              <ButtonBase
                className="reservations-chip btns theme-transparent"
                key={`${chip}-${chipIdx}`}
                onClick={() => {
                  setLocalFilter((items) => {
                    let itemsClone = { ...items };
                    delete itemsClone[chip];
                    return itemsClone;
                  });
                  setFilter((items) => {
                    let itemsClone = { ...items };
                    delete itemsClone[chip];
                    return itemsClone;
                  });
                }}
              >
                <span>{`${t(
                  `${translationPath}${chip
                    .replaceAll('_uuid', '')
                    .replaceAll('_', '-')}`,
                )}: ${GetChipsValue(chip, localFilter[chip])}`}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            ))}
          </div>
        </div>
      )}

      {/*<PopoverComponent*/}
      {/*  idRef="sortPopoverRef"*/}
      {/*  attachedWith={popoverAttachedWith.sort}*/}
      {/*  handleClose={() => popoverToggleHandler('sort')}*/}
      {/*  popoverClasses="stages-display-popover"*/}
      {/*  component={*/}
      {/*    <div className="d-flex-column stage-display-items-wrapper">*/}
      {/*      {Object.values(SortingCriteriaEnum)*/}
      {/*        .filter(*/}
      {/*          (criteria) =>*/}
      {/*            criteria.hiddenIn*/}
      {/*            && criteria.hiddenIn.indexOf(*/}
      {/*              SortingCriteriaCallLocationsEnum.VisaPipelineHeader.key*/}
      {/*            ) === -1*/}
      {/*        )*/}
      {/*        .map((criteria) => (*/}
      {/*          <ButtonBase*/}
      {/*            key={criteria.id}*/}
      {/*            className="btns theme-transparent mx-0 miw-0 c-gray-primary"*/}
      {/*            onClick={() => {*/}
      {/*              popoverToggleHandler('sort');*/}
      {/*              onFilterChanged({*/}
      {/*                order_by: criteria.order_by,*/}
      {/*                order_type: criteria.order_type,*/}
      {/*              });*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            <span>{t(`Shared:${criteria.title}`)}</span>*/}
      {/*          </ButtonBase>*/}
      {/*        ))}*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*/>*/}
      <TablesComponent
        data={requests.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={localFilter.page - 1}
        pageSize={localFilter.limit}
        totalItems={requests.totalCount}
        selectedRows={
          isWithCheck && globalSelectedRows ? globalSelectedRows : undefined
        }
        isWithCheckAll={isWithCheckAll}
        isWithCheck={isWithCheck}
        isDynamicDate
        uniqueKeyInput="uuid"
        themeClasses="theme-transparent"
        isWithoutBoxWrapper
        getIsDisabledRow={
          (getIsDisabledRow && getIsDisabledRow)
          || ((row) => row.can_delete === false)
        }
        onSelectAllCheckboxChanged={
          (isWithCheckAll
            && onSelectAllCheckboxChanged
            && onSelectAllCheckboxChanged(requests))
          || undefined
        }
        onSelectCheckboxChanged={
          (isWithCheck
            && onSelectCheckboxChanged
            && onSelectCheckboxChanged(globalSelectedRows))
          || undefined
        }
        isWithTableActions={isWithTableActions}
        onActionClicked={onActionClicked}
        tableActions={[
          SystemActionsEnum.view,
          SystemActionsEnum.edit,
          SystemActionsEnum.moreInfo,
          SystemActionsEnum.reject,
          SystemActionsEnum.reserve,
        ]}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        tableActionsOptions={{
          getDisabledAction:
            (getIsDisabledAction && getIsDisabledAction(true)) || undefined,
          getTooltipTitle: ({ row, actionEnum }) =>
            (actionEnum.key === SystemActionsEnum.delete.key
              && row.can_delete === false
              && t('Shared:can-delete-description')) // test
            || '',
        }}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
        sortColumnClicked={
          isDetailedVisas
            ? (columnId, currentOrderDirection) => {
              setLocalFilter((it) => ({
                ...it,
                order_by: columnId,
                order_type: currentOrderDirection?.toUpperCase(),
                page: 1,
              }));
            }
            : null
        }
        tableOptions={
          isDetailedVisas && {
            sortFrom: 2,
          }
        }
      />
    </div>
  );
};

RequestedToReserveTab.propTypes = {
  isForceToReload: PropTypes.bool,
  getIsDisabledAction: PropTypes.func,
  getVisaStatusByKey: PropTypes.func.isRequired,
  getFullName: PropTypes.func.isRequired,
  onIsOpenDialogsChanged: PropTypes.func,
  onCallLocationChanged: PropTypes.func,
  rejectOrWithdrawHandler: PropTypes.func,
  filter: PropTypes.instanceOf(Object),
  setFilter: PropTypes.func.isRequired,
  filterInit: PropTypes.shape({ current: PropTypes.shape({}) }),
  onFilterChanged: PropTypes.func,
  activeItem: PropTypes.instanceOf(Object),
  onActiveItemChanged: PropTypes.func,
  isDetailedVisas: PropTypes.bool,
  isWithCheckAll: PropTypes.bool,
  isWithCheck: PropTypes.bool,
  isWithTableActions: PropTypes.bool,
  getIsDisabledRow: PropTypes.func,
  globalSelectedRows: PropTypes.instanceOf(Array),
  onSelectAllCheckboxChanged: PropTypes.func,
  onSelectCheckboxChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  hideFilters: PropTypes.bool,
};
