import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DeleteVisaTypes,
  GetAllVisaDashboardVisas,
} from '../../../../../../../services';
import {
  getIsAllowedPermissionV2,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../../../../../helpers';
import TablesComponent from '../../../../../../../components/Tables/Tables.Component';
import { SystemActionsEnum } from '../../../../../../../enums';
import { VisaTypeManagementDialog } from '../../../../dialogs/block-management/dialogs';
import { ConfirmDeleteDialog } from '../../../../../../setups/shared';
import ButtonBase from '@mui/material/ButtonBase';
import { VisasPermissions } from '../../../../../../../permissions';
import { useSelector } from 'react-redux';
import i18next from 'i18next';

export const VisasSection = memo(
  ({
    block_uuid,
    isOpening,
    block,
    onBlocksReload,
    onReloadStatistics,
    // filter,
    blocksFilter,
    isOpenedBefore,
    openCollapseHandler,
    globalSelectedRows,
    isWithoutTableActions,
    onSelectCheckboxChanged,
    onSelectAllCheckboxChanged,
    isWithCheckAll,
    getIsDisabledRow,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const permissions = useSelector(
      (reducerState) => reducerState?.permissionsReducer?.permissions,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const isFirstLoadRef = useRef(true);
    const [isOpenVisaManagementDialog, setIsOpenVisaManagementDialog]
      = useState(false);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [localFilter, setLocalFilter] = useState({
      block_uuid,
      page: 1,
      limit: 10,
    });
    const [visas, setVisas] = useState({
      results: [],
      totalCount: 0,
    });
    const defaultTableColumnsRef = useRef([
      {
        id: 1,
        input: `occupation.${i18next.language}`,
        label: 'occupation',
        isSortable: true,
      },
      {
        id: 2,
        input: `nationality.${i18next.language}`,
        label: 'nationality',
        isSortable: true,
      },
      {
        id: 3,
        input: `gender.${i18next.language}`,
        label: 'gender',
        isSortable: true,
      },
      {
        id: 4,
        input: `religion.${i18next.language}`,
        label: 'religion',
        isSortable: true,
      },
    ]);
    const [tableColumns, setTableColumns] = useState(defaultTableColumnsRef.current);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get all visas of a block
     */
    const getAllVisaDashboardVisas = useCallback(async () => {
      setIsLoading(true);
      const response = await GetAllVisaDashboardVisas({
        ...localFilter,
        block_uuid,
      });
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        openCollapseHandler(localFilter.block_uuid, { source: 2 })();
      }
      setIsLoading(false);
      if (response && response.status === 200)
        if (localFilter.page === 1)
          setVisas({
            results: response.data.results || [],
            totalCount: response.data.paginate?.total,
          });
        else
          setVisas((items) => ({
            results: [...items.results, ...(response.data.results || [])],
            totalCount: response.data.paginate?.total || 0,
          }));
      else {
        setVisas({ results: [], totalCount: 0 });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    }, [localFilter, openCollapseHandler, t]);

    /**
     * @param action
     * @param row
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to open dialog of management or delete
     */
    const onActionClicked = (action, row) => {
      setActiveItem(row);
      if (action.key === SystemActionsEnum.edit.key)
        setIsOpenVisaManagementDialog(true);
      else if (action.key === SystemActionsEnum.delete.key)
        setIsOpenDeleteDialog(true);
    };

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change the visa type management is open status change from child
     */
    const visaManagementIsOpenChanged = useCallback(() => {
      setIsOpenVisaManagementDialog(false);
      if (activeItem) setActiveItem(null);
    }, [activeItem]);

    const onVisaTypesDialogSaveHandler = useCallback(() => {
      setLocalFilter((items) => ({ ...items, page: 1, limit: 10 }));
    }, []);

    /**
     * @param stages
     * @param uuid
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to the current stage details by uuid
     */
    const getVisaStageDetails = useMemo(
      () => (stages, uuid) => stages.find((item) => item.uuid === uuid) || {},
      [],
    );

    useEffect(() => {
      if (isOpenedBefore) getAllVisaDashboardVisas();
    }, [getAllVisaDashboardVisas, localFilter, isOpenedBefore]);

    useEffect(() => {
      setLocalFilter((items) => ({
        ...items,
        ...blocksFilter,
        page: 1,
        limit: 10,
      }));
    }, [blocksFilter]);

    useEffect(() => {
      setTableColumns(() => [
        ...defaultTableColumnsRef.current,
        ...block.blocks_statistics.map((item, index) => ({
          id: defaultTableColumnsRef.current.length + index,
          label: item.title,
          component: (row) => (
            <span>{getVisaStageDetails(row.stages, item.uuid).count || 0}</span>
          ),
        })),
      ]);
    }, [block.blocks_statistics, getVisaStageDetails]);

    // useEffect(() => {
    //   isFirstLoadRef.current = true;
    // }, [filter]);

    return (
      <div className="visas-section-wrapper">
        <TablesComponent
          data={visas.results}
          isLoading={isLoading && !isOpening}
          headerData={tableColumns}
          pageIndex={localFilter.page - 1}
          pageSize={localFilter.limit}
          totalItems={visas.totalCount}
          selectedRows={globalSelectedRows ? globalSelectedRows : selectedRows}
          isWithCheckAll={isWithCheckAll}
          isWithCheck
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
              && ((onSelectAllCheckboxChanged && onSelectAllCheckboxChanged(visas))
                || (() => {
                  setSelectedRows((items) =>
                    globalSelectedRowsHandler(
                      items,
                      visas.results.filter((item) => item.can_delete !== false),
                    ),
                  );
                })))
            || undefined
          }
          onSelectCheckboxChanged={
            (onSelectCheckboxChanged
              && onSelectCheckboxChanged(globalSelectedRows, block))
            || (({ selectedRow }) => {
              if (!selectedRow) return;
              setSelectedRows((items) =>
                globalSelectedRowHandler(items, selectedRow),
              );
            })
          }
          isWithTableActions={!isWithoutTableActions}
          onActionClicked={onActionClicked}
          tableActions={[SystemActionsEnum.delete, SystemActionsEnum.edit]}
          parentTranslationPath={parentTranslationPath}
          tableActionsOptions={{
            getDisabledAction: (item, rowIndex, actionEnum) =>
              (actionEnum.key === SystemActionsEnum.delete.key
                && (item.can_delete === false
                  || !getIsAllowedPermissionV2({
                    permissionId: VisasPermissions.DeleteVisa.key,
                    permissions,
                  })))
              || (actionEnum.key === SystemActionsEnum.edit.key
                && !getIsAllowedPermissionV2({
                  permissionId: VisasPermissions.UpdateVisa.key,
                  permissions,
                })),
            getTooltipTitle: ({ row, actionEnum }) =>
              (actionEnum.key === SystemActionsEnum.delete.key
                && row.can_delete === false
                && t('Shared:can-delete-description')) // test
              || '',
          }}
        />
        <div
          className={`d-flex-v-center-h-${
            (visas.results.length < visas.totalCount && 'between') || 'end'
          } pt-3`}
        >
          {visas.results.length < visas.totalCount && (
            <ButtonBase
              className="btns theme-transparent mx-2 mb-3 c-gray-primary"
              onClick={() => {
                setLocalFilter((items) => ({
                  ...items,
                  page: (visas.results.length > 10 && items.page + 1) || items.page,
                  limit:
                    (visas.results.length + 100 < visas.totalCount
                      && items.page === 1
                      && visas.results.length === 10
                      && visas.results.length + 100)
                    || (visas.results.length === 110 && 110)
                    || 100,
                }));
              }}
            >
              <span className="fas fa-ellipsis-h" />
              <span className="px-2">{`${t('Shared:load')} ${
                visas.results.length + 100 < visas.totalCount
                  ? 100
                  : visas.totalCount - visas.results.length
              } ${t('Shared:more')}`}</span>
            </ButtonBase>
          )}
          {selectedRows && selectedRows.length > 0 && (
            <ButtonBase
              className="btns theme-transparent mb-3 mx-2 c-warning"
              onClick={() => {
                setIsBulkDelete(true);
                setIsOpenDeleteDialog(true);
              }}
            >
              <span className={SystemActionsEnum.delete.icon} />
              <span className="px-2">{t('Shared:bulk-delete')}</span>
            </ButtonBase>
          )}
        </div>
        {isOpenVisaManagementDialog && (
          <VisaTypeManagementDialog
            isOpen={isOpenVisaManagementDialog}
            activeItem={activeItem}
            // blockErrors={errors}
            // onBlockStateChanged={onStateChanged}
            // blockState={state}
            onSave={onVisaTypesDialogSaveHandler}
            isOpenChanged={visaManagementIsOpenChanged}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {isOpenDeleteDialog && (
          <ConfirmDeleteDialog
            activeItem={activeItem}
            successMessage="visa-type-deleted-successfully"
            onSave={() => {
              if (onBlocksReload) onBlocksReload();
              if (onReloadStatistics) onReloadStatistics();
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
            descriptionMessage="visa-type-delete-description"
            deleteApi={DeleteVisaTypes}
            apiProps={{
              uuid:
                (isBulkDelete
                  && selectedRows.length > 0
                  && selectedRows.map((item) => item.uuid))
                || (activeItem && [activeItem.uuid]),
            }}
            errorMessage="visa-type-delete-failed"
            activeItemKey="uuid"
            apiDeleteKey="uuid"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isOpen={isOpenDeleteDialog}
          />
        )}
      </div>
    );
  },
);

VisasSection.displayName = 'VisasSection';

VisasSection.propTypes = {
  isOpening: PropTypes.bool.isRequired,
  block_uuid: PropTypes.string.isRequired,
  // filter: PropTypes.shape({}).isRequired,
  blocksFilter: PropTypes.shape({}).isRequired,
  block: PropTypes.shape({
    uuid: PropTypes.string,
    blocks_statistics: PropTypes.instanceOf(Array),
  }).isRequired,
  isOpenedBefore: PropTypes.bool.isRequired,
  openCollapseHandler: PropTypes.func.isRequired,
  onBlocksReload: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  globalSelectedRows: PropTypes.instanceOf(Array),
  isWithoutTableActions: PropTypes.bool,
  onSelectCheckboxChanged: PropTypes.func,
  onSelectAllCheckboxChanged: PropTypes.func,
  isWithCheckAll: PropTypes.bool,
  getIsDisabledRow: PropTypes.func,
  onReloadStatistics: PropTypes.func,
};
VisasSection.defaultProps = {
  isWithCheckAll: true,
};
