import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Grid, ButtonBase } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { OnboardingAccordion } from '../../../shared';
import i18next from 'i18next';
import { TableColumnsPopoverComponent } from '../../../../../components';
import {
  FormsAssistRoleTypesEnum,
  FormsForTypesEnum,
  FormsRolesEnum,
  FormsSubmissionsLevelsTypesEnum,
  NavigationSourcesEnum,
  OnboardingGroupByActionsEnum,
  SystemActionsEnum,
  TablesNameEnum,
} from '../../../../../enums';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  showError,
} from '../../../../../helpers';
import { GetOnboardingTasksAssignedToAssist } from '../../../../../services/OnboardingTasks.Services';
import { GetOnboardingFlowURL } from '../../../../../services';
import { ManageFlowPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';
import TableAvatarsView from '../../../../../components/TableColumnsPopover/Views/TableAvatars/TableAvatars.View';
import { OnboardingTasksTableComponent } from '../../components/OnboardingTasksTable.Component';
import { RedirectToCandidateButton } from './../../../shared/components';
export const AssignedToAssistTab = ({
  parentTranslationPath,
  onScrollHandler,
  bodyRef,
  onChangeAccordion,
  filter,
  // onFilterChanged,
  expandedAccordions,
  FilterComponent,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const isLoadingRef = useRef(false);
  // const isFromAPICallRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [assignedToAssist, setAssignedToAssist] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [tableColumns, setTableColumns] = useState([]);
  // const [localTablesFilter, setLocalTablesFilter] = useState({});
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const getOnboardingTasksAssignedToAssist = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    const response = await GetOnboardingTasksAssignedToAssist({
      ...filter,
      sort_by: filter?.sort?.sort_by,
      order: filter?.sort?.order,
      group_by: filter?.group?.group_by,
      status: filter?.status?.key ?? '',
    });
    isLoadingRef.current = false;
    if (response && response.status === 200)
      if (filter.page === 1)
        // isFromAPICallRef.current=true;
        setAssignedToAssist({
          results: response.data.results || [],
          totalCount: response.data.paginate?.total || 0,
        });
      else
        setAssignedToAssist((items) => ({
          results: items.results.concat(response.data.results || []),
          totalCount: response.data.paginate.total || 0,
        }));
    else {
      setAssignedToAssist({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
    setIsLoading(false);
  }, [filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to generate the redirect link to form for each flow
   * */
  const generateFormLinkHandler = useCallback(
    async ({ row, member }) => {
      setIsLoading(true);
      const response = await GetOnboardingFlowURL({
        uuid: row.flow_uuid,
        forType: FormsForTypesEnum.SystemUser.key,
        email:
          ((filter.type === FormsSubmissionsLevelsTypesEnum.FormLevel.key
            || filter?.group?.group_by
              === OnboardingGroupByActionsEnum.Fields.group_by)
            && row.email)
          || member.email,
        type_of_submission: filter.type,
        editor_role: FormsRolesEnum.InvitedMembers.key,
        role_type: FormsAssistRoleTypesEnum.Editor.key,
      });
      setIsLoading(false);
      if (response && response.status === 200)
        GlobalHistory.push(
          `${response.data.results.form_link}&source=${NavigationSourcesEnum.OnboardingAssignToAssistToFormBuilder.key}`,
        );
      else showError(t(`InvitationsPage:generate-form-link-failed`), response);
    },
    [filter?.group?.group_by, filter.type, t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle table actions
   */
  const onActionClicked = ({ action, row, member }) => {
    if (action.key === SystemActionsEnum.edit.key)
      generateFormLinkHandler({ row, member });
  };

  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  // const onPageIndexChanged = (newIndex, uuid) => {
  //   setLocalTablesFilter((items) => ({
  //     ...items,
  //     [uuid]: {
  //       ...items?.[uuid],
  //       page: newIndex + 1,
  //     },
  //   }));
  //   // onFilterChanged({ page: newIndex + 1 });
  // };

  // const onPageSizeChanged = (newPageSize, uuid) => {
  //   setLocalTablesFilter((items) => ({
  //     ...items,
  //     [uuid]: {
  //       page: 1,
  //       limit: newPageSize,
  //     },
  //   }));
  //   // onFilterChanged({ page: 1, limit: newPageSize });
  // };

  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setAssignedToAssist((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
  };

  useEffect(() => {
    getOnboardingTasksAssignedToAssist();
  }, [getOnboardingTasksAssignedToAssist]);

  // // special case to load more data of the container is not scrollable after finish loading the first page
  // useEffect(() => {
  //   if (!isLoading && isFromAPICallRef.current) {
  //     isFromAPICallRef.current = false;
  //     onScrollHandler(assignedToAssist)
  //   }
  // }, [assignedToAssist, isLoading, onScrollHandler]);
  const groupByFieldsColumns = useMemo(
    () => [
      {
        id: 1,
        input: 'member',
        label: t('member'),
        isHidden: false,
        component: (row) =>
          row.redirect_link ? (
            <a href={row.redirect_link} target={'_blank'} rel="noreferrer">
              <span>{row.member}</span>
            </a>
          ) : (
            <span>{row.member}</span>
          ),
      },
      {
        id: 2,
        input: 'section',
        label: t('content-section'),
        isHidden: false,
        component: (row) => (
          <span className={'table-tag py-1 px-2'}>{row.section}</span>
        ),
      },
      {
        id: 3,
        input: 'flow',
        label: t('flow'),
        isHidden: false,
        component: (row) =>
          row.flow ? <span className={'table-tag py-1 px-2'}>{row.flow}</span> : '',
      },
      {
        id: 4,
        input: 'space',
        label: t('space'),
        isHidden: false,
        component: (row) =>
          row.space ? (
            <span className={'table-tag py-1 px-2'}>{row.space}</span>
          ) : (
            ''
          ),
      },
      {
        id: 5,
        input: 'assign',
        label: t('assign'),
        component: (row, rowIndex) => (
          <TableAvatarsView
            row={row}
            rowIndex={rowIndex}
            columnKey={'assign'}
            isWithText={false}
          />
        ),
      },
      {
        id: 6,
        input: 'status',
        label: t('status'),
        isHidden: false,
      },
    ],
    [t],
  );
  return (
    <div className="pt-3 px-1">
      {FilterComponent()}
      {filter?.group?.group_by
        !== OnboardingGroupByActionsEnum?.Fields?.group_by && (
        <div className="d-flex-v-start-h-end mb-1 mr-4">
          <TableColumnsPopoverComponent
            columns={tableColumns}
            feature_name={
              (filter.type === FormsSubmissionsLevelsTypesEnum.FieldsLevel.key
                && TablesNameEnum.TasksVariables.key)
              || TablesNameEnum.TasksAssignedToView.key
            }
            onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
            onColumnsChanged={onColumnsChanged}
            onReloadData={onReloadDataHandler}
            isLoading={isLoading}
          />
        </div>
      )}

      {/*scrollable-page-contents-wrapper*/}
      <Grid
        container
        spacing={2}
        className="onboarding-scrollable-page-contents-wrapper p-0"
        onScroll={onScrollHandler && onScrollHandler(assignedToAssist)}
        ref={bodyRef && bodyRef}
      >
        <Grid item md={12} className="pt-3" sx={{ maxWidth: '100%' }}>
          {assignedToAssist?.results.map((item, index) => (
            <OnboardingAccordion
              actionComponent={
                item.redirect_link ? (
                  <RedirectToCandidateButton redirectLink={item.redirect_link} />
                ) : (
                  false
                )
              }
              key={`${item.uuid}-${index}`}
              withAvatar={
                filter?.group?.group_by
                !== OnboardingGroupByActionsEnum?.Fields?.group_by
              }
              member={{
                name:
                  item?.title
                  || item?.member
                  || (item.assignee
                    && (item.assignee[i18next.language] || item.assignee.en))
                  || 'N/A',
                // url: item.url,
              }}
              expanded={expandedAccordions.includes(index)}
              onChange={() => onChangeAccordion(index)}
              withExtraButton={true}
              onExtraButtonClick={() => null}
              bodyComponent={
                <div>
                  <div className="my-3">
                    <OnboardingTasksTableComponent
                      isWithNumbering
                      isWithoutBoxWrapper
                      totalItems={(item?.members || item?.variables)?.length}
                      data={item?.members || item?.variables}
                      headerData={
                        filter?.group?.group_by
                        === OnboardingGroupByActionsEnum?.Fields?.group_by
                          ? groupByFieldsColumns
                          : tableColumns
                      }
                      onColumnsChanged={onColumnsChanged}
                      onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                      isWithTableActions
                      onActionClicked={(action, row) =>
                        onActionClicked({ action, row, member: item })
                      }
                      tableActions={[SystemActionsEnum.edit]}
                      pageIndex={filter.page - 1}
                      isLoading={isLoading || isLoadingColumns}
                      tableActionsOptions={{
                        getTooltipTitle: ({ row, actionEnum }) =>
                          (actionEnum.key === SystemActionsEnum.delete.key
                            && row.can_delete === false
                            && t('Shared:can-delete-description'))
                          || '',
                        getDisabledAction: (row, rowIndex, action) => {
                          if (action.key === SystemActionsEnum.edit.key)
                            return !getIsAllowedPermissionV2({
                              permissionId: ManageFlowPermissions.UpdateFlow.key,
                              permissions: permissionsReducer,
                            });
                          if (action.key === SystemActionsEnum.delete.key)
                            return (
                              row.can_delete === false
                              || !getIsAllowedPermissionV2({
                                permissionId: ManageFlowPermissions.DeleteFlow.key,
                                permissions: permissionsReducer,
                              })
                            );
                          return true;
                        },
                      }}
                    />
                  </div>
                </div>
              }
            />
          ))}
        </Grid>
        {isLoading
          && Array.from(new Array(4)).map((item, index) => (
            <Grid item md={12} key={`${item}${index}`}>
              <Skeleton
                variant="rectangular"
                sx={{ height: '30px', width: '100%' }}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

AssignedToAssistTab.propTypes = {
  onChangeAccordion: PropTypes.func.isRequired,
  onScrollHandler: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  // isLoading: PropTypes.bool.isRequired,
  members: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
  expandedAccordions: PropTypes.instanceOf(Array),
  bodyRef: PropTypes.instanceOf(Object),
  filter: PropTypes.instanceOf(Object),
  onFilterChanged: PropTypes.func,
  FilterComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
};
