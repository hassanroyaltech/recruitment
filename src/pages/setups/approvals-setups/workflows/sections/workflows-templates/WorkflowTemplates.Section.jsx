import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { ConfirmDeleteDialog, SharedInputControl } from '../../../../shared';
import {
  DeleteSetupsWorkflowsTemplate,
  GetAllSetupsWorkflowsTemplates,
} from '../../../../../../services';
import {
  getIsAllowedPermissionV2,
  // showError,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
} from '../../../../../../helpers';
import TablesComponent from '../../../../../../components/Tables/Tables.Component';
import { SystemActionsEnum, TablesNameEnum } from '../../../../../../enums';
import { WorkflowsTemplateManagementSection } from './sections';
import { TableColumnsPopoverComponent } from '../../../../../../components';
import { WorkflowsPermissions } from '../../../../../../permissions';

export const WorkflowTemplatesSection = ({
  selectedWorkflowType,
  approvals,
  isOpenManagementSection,
  onIsOpenManagementSectionChanged,
  onSelectedWorkflowTypeChange,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeItem, setActiveItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [templates, setTemplates] = useState(() => ({
    results: [],
    totalCount: 0,
  }));

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
    use_for: 'list',
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all templates with filter
   */
  const getAllSetupsWorkflowTemplates = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsWorkflowsTemplates({
      ...filter,
      type: selectedWorkflowType.key,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setTemplates({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else
      setTemplates({
        results: [],
        totalCount: 0,
      });
    // showError(t('Shared:failed-to-get-saved-data'), response);
  }, [filter, selectedWorkflowType.key]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (
      action.key === SystemActionsEnum.edit.key
      && onIsOpenManagementSectionChanged
    )
      onIsOpenManagementSectionChanged();
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change selected columns
   * (must be callback)
   */
  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setTemplates((items) => {
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

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is loading columns
   * (must be callback)
   */
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the status of management dialog
   */
  const isOpenManagementChangedHandler = useCallback(() => {
    if (onIsOpenManagementSectionChanged) onIsOpenManagementSectionChanged();
    if (activeItem) setActiveItem(null);
  }, [activeItem, onIsOpenManagementSectionChanged]);

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    getAllSetupsWorkflowTemplates();
  }, [getAllSetupsWorkflowTemplates, filter]);

  return (
    <div className="page-wrapper">
      {!isOpenManagementSection && (
        <>
          <div className="page-header-wrapper px-3 pb-3">
            <span className="header-text-x2 d-flex mb-1">
              <ButtonBase
                className="btns-icon theme-transparent mr-3-reversed"
                onClick={() => {
                  setActiveItem(null);
                  if (onSelectedWorkflowTypeChange) onSelectedWorkflowTypeChange();
                }}
              >
                <i className="fas fa-arrow-left" />
              </ButtonBase>
              <span className="text-gray pr-2-reversed">
                {`${t(`${translationPath}workflows`)}  / `}
              </span>
              {(selectedWorkflowType
                && selectedWorkflowType.title
                && (selectedWorkflowType.title[i18next.language]
                  || selectedWorkflowType.title.en))
                || 'N/A'}
            </span>
            <span className="description-text">
              {selectedWorkflowType.description || ''}
            </span>
          </div>
          <div className="page-body-wrapper">
            <div className="d-flex-v-center-h-between flex-wrap">
              <div className="d-inline-flex mb-2">
                <SharedInputControl
                  idRef="searchRef"
                  title="search"
                  placeholder="search"
                  stateKey="search"
                  themeClass="theme-filled"
                  endAdornment={
                    <span className="end-adornment-wrapper">
                      <span className="fas fa-search" />
                    </span>
                  }
                  onValueChanged={(newValue) => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      search: newValue.value,
                    }));
                  }}
                  parentTranslationPath={parentTranslationPath}
                />
              </div>
              <div>
                {selectedRows && selectedRows.length > 0 && (
                  <div className="d-inline-flex mb-2 mx-1">
                    <ButtonBase
                      className="btns-icon theme-transparent c-warning"
                      onClick={() => {
                        setIsBulkDelete(true);
                        setIsOpenDeleteDialog(true);
                      }}
                    >
                      <span className={SystemActionsEnum.delete.icon} />
                    </ButtonBase>
                  </div>
                )}
                <div className="d-inline-flex mb-2">
                  <TableColumnsPopoverComponent
                    columns={tableColumns}
                    feature_name={TablesNameEnum.WorkflowTemplates.key}
                    onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                    onColumnsChanged={onColumnsChanged}
                    onReloadData={onReloadDataHandler}
                    isLoading={isLoading}
                  />
                </div>
                <ButtonBase
                  onClick={onIsOpenManagementSectionChanged}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: WorkflowsPermissions.AddWorkflows.key,
                      permissions: permissionsReducer,
                    })
                  }
                  className="btns theme-solid mx-3 mb-2"
                >
                  <span className="fas fa-plus" />
                  <span className="px-1">{t(`${translationPath}add-template`)}</span>
                </ButtonBase>
              </div>
            </div>
            <div className="px-2">
              <TablesComponent
                data={templates.results}
                isLoading={isLoading || isLoadingColumns}
                headerData={tableColumns}
                pageIndex={filter.page - 1}
                pageSize={filter.limit}
                totalItems={templates.totalCount}
                selectedRows={selectedRows}
                isWithCheckAll
                isWithCheck
                isDynamicDate
                uniqueKeyInput="uuid"
                isSelectAllDisabled={
                  !getIsAllowedPermissionV2({
                    permissionId: WorkflowsPermissions.DeleteWorkflows.key,
                    permissions: permissionsReducer,
                  })
                }
                getIsDisabledRow={(row) => row.can_delete === false}
                onSelectAllCheckboxChanged={() => {
                  setSelectedRows((items) =>
                    globalSelectedRowsHandler(
                      items,
                      templates.results.filter((item) => item.can_delete !== false),
                    ),
                  );
                }}
                onSelectCheckboxChanged={({ selectedRow }) => {
                  if (!selectedRow) return;
                  setSelectedRows((items) =>
                    globalSelectedRowHandler(items, selectedRow),
                  );
                }}
                isWithTableActions
                onActionClicked={onActionClicked}
                tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
                tableActionsOptions={{
                  // eslint-disable-next-line max-len
                  getTooltipTitle: ({ row, actionEnum }) =>
                    (actionEnum.key === SystemActionsEnum.delete.key
                      && row.can_delete === false
                      && t('Shared:can-delete-description'))
                    || '',
                  // eslint-disable-next-line max-len
                  getDisabledAction: (item, rowIndex, action) => {
                    if (action.key === SystemActionsEnum.edit.key)
                      return !getIsAllowedPermissionV2({
                        permissionId: WorkflowsPermissions.UpdateWorkflows.key,
                        permissions: permissionsReducer,
                      });
                    if (action.key === SystemActionsEnum.delete.key)
                      return (
                        !getIsAllowedPermissionV2({
                          permissionId: WorkflowsPermissions.DeleteWorkflows.key,
                          permissions: permissionsReducer,
                        }) || item.can_delete === false
                      );
                    return true;
                  },
                }}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
              />
            </div>
          </div>
        </>
      )}

      {isOpenManagementSection && (
        <WorkflowsTemplateManagementSection
          activeItem={activeItem}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          selectedWorkflowType={selectedWorkflowType}
          approvals={approvals}
          isOpenChanged={isOpenManagementChangedHandler}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="template-deleted-successfully"
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
            if (isBulkDelete) setSelectedRows([]);
            else {
              const localSelectedRows = [...selectedRows];
              const selectedRowIndex = selectedRows.findIndex(
                (item) => item.uuid === activeItem.uuid,
              );
              if (selectedRowIndex !== -1) {
                localSelectedRows.splice(selectedRowIndex, 1);
                setSelectedRows(localSelectedRows);
              }
            }
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
            if (isBulkDelete) {
              setIsBulkDelete(false);
              setSelectedRows([]);
            }
          }}
          descriptionMessage="template-delete-description"
          deleteApi={DeleteSetupsWorkflowsTemplate}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="template-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

WorkflowTemplatesSection.propTypes = {
  selectedWorkflowType: PropTypes.shape({
    key: PropTypes.number,
    description: PropTypes.string,
    title: PropTypes.instanceOf(Object),
    conditions: PropTypes.instanceOf(Array),
  }).isRequired,
  approvals: PropTypes.instanceOf(Array).isRequired,
  onSelectedWorkflowTypeChange: PropTypes.func.isRequired,
  isOpenManagementSection: PropTypes.bool.isRequired,
  onIsOpenManagementSectionChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
