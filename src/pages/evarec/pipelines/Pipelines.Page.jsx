import React, { useCallback, useEffect, useRef, useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { ConfirmDeleteDialog, SharedInputControl } from '../../setups/shared';
import { SystemActionsEnum, TablesNameEnum } from '../../../enums';
import { TableColumnsPopoverComponent } from '../../../components';
import TablesComponent from '../../../components/Tables/Tables.Component';
import {
  getIsAllowedPermissionV2,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../helpers';
import { PipelineAddDialog, PipelineTemplatesManagementDialog } from './dialogs';
import { DeleteEvaRecPipeline, GetAllEvaRecPipelines } from '../../../services';
import { useTitle } from '../../../hooks';
import { useSelector } from 'react-redux';
import { PipelinePermissions } from 'permissions/eva-rec/Pipeline.Permissions';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = '';
const PipelinesPage = () => {
  const isMounted = useRef(true);
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}pipelines`));
  const [activeItem, setActiveItem] = useState(null);
  const [activePipelineItem, setActivePipelineItem] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pipelineTemplates, setPipelineTemplates] = useState(() => ({
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
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of add new pipeline
   */
  const onAddClicked = () => {
    setIsOpenAddDialog(true);
  };

  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all pipelineTemplates with filter
   */
  const getAllEvaRecPipelines = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllEvaRecPipelines({
      ...filter,
    });
    if (!isMounted.current) return;
    setIsLoading(false);
    if (response && response.status === 200)
      setPipelineTemplates({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setPipelineTemplates({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

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
   * @Description this method is to change selected columns
   * (must be callback)
   */
  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

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
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setPipelineTemplates((items) => {
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
   * @Description this method is to change the template management is open status change from child
   */
  const templatesManagementIsOpenChanged = useCallback(() => {
    setIsOpenManagementDialog(false);
    if (activeItem) setActiveItem(null);
  }, [activeItem]);

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    getAllEvaRecPipelines();
  }, [getAllEvaRecPipelines, filter]);

  // this is to prevent any memory leak if user changed tab fast
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  return (
    <div className="pipelines-page-wrapper page-wrapper">
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex flex-wrap mb-2">
            <div className="d-inline-flex header-text-x2 pl-3-reversed mt-2">
              <span>{t(`${translationPath}pipelines`)}</span>
            </div>
          </div>
          <ButtonBase
            onClick={onAddClicked}
            className="btns theme-transparent mx-3 mb-2"
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId: PipelinePermissions.AddPipeline.key,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}new-template`)}</span>
          </ButtonBase>
        </div>
        <div className="d-flex px-3 mb-3">
          <span className="description-text">
            {t(`${translationPath}pipelines-description`)}
          </span>
        </div>
        <div className="px-3">
          <SharedInputControl
            idRef="searchRef"
            title="search"
            placeholder="search"
            stateKey="search"
            isFullWidth
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
        <div className="px-2">
          <TablesComponent
            data={pipelineTemplates.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={pipelineTemplates.totalCount}
            isWithHeaderDetails
            headerDetailsTitle="pipeline-templates"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getTableHeaderContent={() => (
              <>
                <div className="body-actions-wrapper">
                  {selectedRows && selectedRows.length > 0 && (
                    <div className="d-inline-flex mb-1 mx-1">
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
                  <div className="d-inline-flex mx-2">
                    <TableColumnsPopoverComponent
                      columns={tableColumns}
                      feature_name={TablesNameEnum.Pipelines.key}
                      onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                      onColumnsChanged={onColumnsChanged}
                      onReloadData={onReloadDataHandler}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </>
            )}
            isWithCheckAll
            isWithCheck
            isDynamicDate
            uniqueKeyInput="uuid"
            selectedRows={selectedRows}
            getIsDisabledRow={(row) => row.can_delete === false}
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  pipelineTemplates.results.filter(
                    (item) => item.can_delete !== false,
                  ),
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
              getTooltipTitle: ({ row, actionEnum }) =>
                (actionEnum.key === SystemActionsEnum.delete.key
                  && row.can_delete === false
                  && t('Shared:can-delete-description'))
                || '',
              getDisabledAction: (item, rowIndex, actionEnum) =>
                (actionEnum.key === SystemActionsEnum.delete.key
                  && (item.can_delete === false
                    || !getIsAllowedPermissionV2({
                      permissionId: PipelinePermissions.DeletePipeline.key,
                      permissions,
                    })))
                || (actionEnum.key === SystemActionsEnum.edit.key
                  && !getIsAllowedPermissionV2({
                    permissionId: PipelinePermissions.UpdatePipeline.key,
                    permissions,
                  })),
            }}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <PipelineTemplatesManagementDialog
          activeItem={activeItem}
          activePipelineItem={activePipelineItem}
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={templatesManagementIsOpenChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenManagementDialog}
        />
      )}
      {isOpenAddDialog && (
        <PipelineAddDialog
          onSave={(results, pipelineState) => {
            setFilter((items) => ({ ...items, page: 1 }));
            setActivePipelineItem({ ...(results || {}), ...pipelineState });
            setIsOpenManagementDialog(true);
          }}
          isOpenChanged={() => {
            setIsOpenAddDialog(false);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenAddDialog}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="pipeline-deleted-successfully"
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
          descriptionMessage="pipeline-delete-description"
          deleteApi={DeleteEvaRecPipeline}
          apiProps={{
            uuid:
              (isBulkDelete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="pipeline-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </div>
  );
};

export default PipelinesPage;
