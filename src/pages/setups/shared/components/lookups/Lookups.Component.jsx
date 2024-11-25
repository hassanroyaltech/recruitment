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
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import {
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
  TableColumnsPainter,
} from '../../../../../helpers';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import {
  TableColumnsPopoverComponent,
  TooltipsComponent,
} from '../../../../../components';
import { LookupsImportEnum, SystemActionsEnum } from '../../../../../enums';
import { SharedInputControl } from '../../controls';
import { ConfirmDeleteDialog, ConfirmEncryptionDialog } from '../../dialogs';
import { LookupsManagementDialog } from '../../dialogs/lookups-management/LookupsManagementDialog';
import { DynamicComponentDialog } from './DynamicComponent.Dialog';
import { DynamicService, GetLookupEncryptionStatus } from 'services';
import { LookupImportDialog } from '../../dialogs/lookups-import/LookupsImport.Dialog';

const LookupsComponent = memo(
  ({
    filter,
    onFilterChanged,
    parentTranslationPath,
    translationPath,
    lookup,
    isDisabledDelete,
    isDisabledUpdate,
    isDisabledAdd,
    successMessage,
    errorMessage,
    descriptionMessage,
    updateSuccessMessage,
    updateFailedMessage,
    createSuccessMessage,
    createFailedMessage,
    dynamicComponent,
    Section,
    uniqueKeyInput,
    customHeaders,
    withDescription,
    isDynamicService,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const isMounted = useRef(true);
    const accountReducer = useSelector(
      (reducerState) => reducerState?.accountReducer,
    );
    const [activeItem, setActiveItem] = useState(null);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
    const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
    const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [tableColumns, setTableColumns] = useState([]);
    const [isLoadingColumns, setIsLoadingColumns] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lookups, setLookups] = useState(() => ({
      results: [],
      totalCount: 0,
    }));
    const [isOpenConfirmEncryptionDialog, setIsOpenEncryptionDialog]
      = useState(false);
    const [encryptionState, setEncryptionState] = useState({});
    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to open dialog of management or delete
     */
    const onAddClicked = () => {
      setIsOpenManagementDialog(true);
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
     * @Description this method is to get all lookups with filter
     */
    const getAllSetupsLookups = useCallback(async () => {
      if (isDynamicService) {
        if (!accountReducer || !accountReducer.account_uuid) return;
        setIsLoading(true);
        const response = await DynamicService({
          params: {
            ...filter,
            account_uuid: accountReducer.account_uuid,
            dynamic_code: lookup.dynamic_code,
            [lookup.queryText]: filter.search,
            ...(lookup.extraParams && (lookup.extraParams || {})),
            ...(lookup.getAllExtraParams && (lookup.getAllExtraParams || {})),
          },
          path: lookup.path,
          method: 'get',
        });
        if (!isMounted.current) return;
        setIsLoading(false);
        if (response && (response.status === 200 || response.status === 201))
          setLookups({
            results: response.data.results,
            totalCount:
              response.data.paginate?.total || response.data.results?.length,
          });
        else {
          setLookups({
            results: [],
            totalCount: 0,
          });
          showError(t('Shared:failed-to-get-saved-data'), response);
        }
      } else {
        if (
          !lookup
          || !lookup.listAPI
          || !accountReducer
          || !accountReducer.account_uuid
        )
          return;
        setIsLoading(true);
        const response = await lookup.listAPI({
          ...filter,
          account_uuid: accountReducer.account_uuid,
          ...(lookup.extraParams && (lookup.extraParams || {})),
          ...(lookup.getAllExtraParams && (lookup.getAllExtraParams || {})),
        });
        if (!isMounted.current) return;
        setIsLoading(false);
        if (response && (response.status === 200 || response.status === 201))
          setLookups({
            results: response.data.results,
            totalCount:
              response.data.paginate?.total || response.data.results?.length,
          });
        else {
          setLookups({
            results: [],
            totalCount: 0,
          });
          showError(t('Shared:failed-to-get-saved-data'), response);
        }
      }
    }, [isDynamicService, accountReducer, filter, lookup, t]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change active page and send it to parent
     */
    const onPageIndexChanged = (newIndex) => {
      if (onFilterChanged) onFilterChanged({ ...filter, page: newIndex + 1 });
    };

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change page size and send it to parent
     */
    const onPageSizeChanged = (newPageSize) => {
      if (onFilterChanged)
        onFilterChanged({ ...filter, page: 1, limit: newPageSize });
    };

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change selected columns
     * (must be callback)
     */
    const onColumnsChanged = useCallback(
      (newValue) => {
        if (!lookup.datesFormats) {
          setTableColumns(newValue);
          return;
        }
        const localColumns = [...newValue];

        lookup.datesFormats.map((item) => {
          const itemIndex = localColumns.findIndex(
            (element) => element.input === item.key,
          );
          if (itemIndex !== -1) localColumns[itemIndex].dateFormat = item.value;
          return undefined;
        });
        setTableColumns(localColumns);
      },
      [lookup.datesFormats],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to reload the data by reset the active page
     */
    const onReloadDataHandler = useCallback(
      ({ row, viewItem: { key, primary_key } }) => {
        setLookups((items) => {
          const localItems = { ...items };
          const localItemIndex = localItems.results.findIndex(
            (item) => item[primary_key] === row[primary_key],
          );
          if (localItemIndex === -1) return items;
          localItems.results[localItemIndex][key]
            = !localItems.results[localItemIndex][key];
          return JSON.parse(JSON.stringify(localItems));
        });
      },
      [],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to change is loading columns
     * (must be callback)
     */
    const onIsLoadingColumnsChanged = useCallback((newValue) => {
      setIsLoadingColumns(newValue);
    }, []);

    // this to get table data on init
    // & on filter change & on columns change
    useEffect(() => {
      void getAllSetupsLookups();
    }, [getAllSetupsLookups, filter, isReload]);

    useEffect(() => {
      if (isMounted.current && !lookup.feature_name && lookup.controlledTableColumns)
        TableColumnsPainter(
          {
            data: { results: lookup.controlledTableColumns },
            status: 200,
          },
          onColumnsChanged,
          isLoading,
          onReloadDataHandler,
        );
    }, [
      isLoading,
      lookup.feature_name,
      lookup.controlledTableColumns,
      onColumnsChanged,
      onReloadDataHandler,
    ]);

    // this is to prevent any memory leak if user changed tab fast
    useEffect(
      () => () => {
        isMounted.current = false;
      },
      [],
    );

    const lookupEncryptionKeys = useMemo(() => {
      if (lookup?.isWithoutEncryption) return '';
      if (isDynamicService)
        return { lookup: lookup?.feature_name, dynamic_code: lookup?.dynamic_code };
      if (lookup?.extraParams?.lookup)
        return { lookup: lookup?.extraParams?.lookup };
      if (lookup?.feature_name) return { lookup: lookup?.feature_name };
      return '';
    }, [
      isDynamicService,
      lookup?.dynamic_code,
      lookup?.isWithoutEncryption,
      lookup?.extraParams?.lookup,
      lookup?.feature_name,
    ]);

    const getLookupEncryptionStatus = useCallback(async () => {
      if (!lookupEncryptionKeys) return;
      setEncryptionState({});
      const response = await GetLookupEncryptionStatus(lookupEncryptionKeys);
      if (!isMounted.current) return;
      if (response && (response.status === 200 || response.status === 201))
        setEncryptionState(response.data.results);
      else {
        setEncryptionState({});
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    }, [lookupEncryptionKeys, t]);
    useEffect(() => {
      void getLookupEncryptionStatus();
    }, [getLookupEncryptionStatus]);

    return (
      <div className="lookups-page tab-wrapper">
        <div className="page-body-wrapper">
          <div className="d-flex-v-center-h-between flex-wrap">
            <div className="d-inline-flex mb-2">
              <SharedInputControl
                idRef="searchRef"
                title="search"
                placeholder="search"
                themeClass="theme-filled"
                stateKey="search"
                endAdornment={
                  <span className="end-adornment-wrapper">
                    <span className="fas fa-search" />
                  </span>
                }
                onValueChanged={(newValue) => {
                  if (onFilterChanged)
                    onFilterChanged({
                      ...filter,
                      page: 1,
                      search: newValue.value,
                    });
                }}
                parentTranslationPath={parentTranslationPath}
                editValue={filter.search}
              />
            </div>
            <div className="body-actions-wrapper d-inline-flex-v-center mx-2 gap-2">
              {selectedRows && selectedRows.length > 0 && (
                <div className="d-inline-flex">
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
              {lookup.feature_name && (
                <div className="d-inline-flex mt-2">
                  <TableColumnsPopoverComponent
                    columns={tableColumns}
                    feature_name={lookup.feature_name}
                    onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                    onColumnsChanged={onColumnsChanged}
                    onReloadData={onReloadDataHandler}
                    isLoading={isLoading}
                  />
                </div>
              )}
              {lookup.importEnumItem && (
                <ButtonBase
                  // disabled={
                  //   !getIsAllowedPermissionV2({
                  //     permissionId: PositionTitlePermissions.AddPositionTitle.key,
                  //     permissions: permissionsReducer,
                  //   })
                  // }
                  onClick={() => {
                    setIsOpenLookupImportDialog(true);
                  }}
                  className="btns theme-solid mx-2"
                >
                  <span className="fas fa-file-import" />
                  <span className="px-2">
                    {t(`${translationPath}import-${lookup.importEnumItem.value}`)}
                  </span>
                </ButtonBase>
              )}
              <ButtonBase
                disabled={isDisabledAdd}
                onClick={() => {
                  if (onAddClicked) onAddClicked(lookup);
                }}
                className="btns theme-solid mx-2"
              >
                <span className="fas fa-plus" />
                <span className="px-1">
                  {t(`${translationPath}add-${lookup.valueSingle}`)}
                </span>
              </ButtonBase>
              {encryptionState?.lookup && (
                <TooltipsComponent
                  title={
                    encryptionState?.status
                      ? 'this-lookup-has-been-encrypted'
                      : 'this-lookup-is-not-encrypted'
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={''}
                  contentComponent={
                    <ButtonBase
                      className="btns-icon theme-transparent c-primary mt-1"
                      disabled={isLoading}
                      onClick={() => setIsOpenEncryptionDialog(true)}
                    >
                      <span
                        className={`fas fa-lock${
                          encryptionState?.status ? '' : '-open'
                        }`}
                      />
                    </ButtonBase>
                  }
                />
              )}
            </div>
          </div>
          <div className="px-2">
            <TablesComponent
              data={lookups.results}
              isLoading={isLoading || isLoadingColumns}
              headerData={customHeaders || tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              totalItems={lookups.totalCount}
              isWithCheckAll
              isWithCheck
              isDynamicDate
              uniqueKeyInput={uniqueKeyInput || 'uuid'}
              selectedRows={selectedRows}
              isSelectAllDisabled={isDisabledDelete}
              getIsDisabledRow={(row) => row.can_delete === false}
              onSelectAllCheckboxChanged={() => {
                setSelectedRows((items) =>
                  globalSelectedRowsHandler(
                    items,
                    lookups.results.filter((item) => item.can_delete !== false),
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
                getDisabledAction: (row, rowIndex, action) => {
                  if (action.key === SystemActionsEnum.edit.key)
                    return isDisabledUpdate;
                  if (action.key === SystemActionsEnum.delete.key)
                    return row.can_delete === false || isDisabledDelete;
                  return true;
                },
              }}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={customHeaders && translationPath}
            />
          </div>
        </div>
        {isOpenManagementDialog
          && lookup
          && (dynamicComponent ? (
            <DynamicComponentDialog
              activeItem={activeItem}
              tableColumns={tableColumns}
              lookup={lookup}
              onSave={() => {
                onFilterChanged({ ...filter, page: filter.page });
              }}
              isOpenChanged={() => {
                setIsOpenManagementDialog(false);
                if (activeItem) setActiveItem(null);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isOpen={isOpenManagementDialog}
              updateSuccessMessage={updateSuccessMessage}
              createSuccessMessage={createSuccessMessage}
              createFailedMessage={createFailedMessage}
              updateFailedMessage={updateFailedMessage}
              Section={Section}
              filter={filter}
            />
          ) : (
            <LookupsManagementDialog
              activeItem={activeItem}
              lookup={lookup}
              onSave={() => {
                onFilterChanged({ ...filter, page: filter.page });
              }}
              isOpenChanged={() => {
                setIsOpenManagementDialog(false);
                if (activeItem) setActiveItem(null);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isOpen={isOpenManagementDialog}
              updateSuccessMessage={updateSuccessMessage}
              createSuccessMessage={createSuccessMessage}
              createFailedMessage={createFailedMessage}
              updateFailedMessage={updateFailedMessage}
              withDescription={withDescription}
              isDynamicService={isDynamicService}
            />
          ))}
        {isOpenLookupImportDialog && (
          <LookupImportDialog
            enumItem={lookup.importEnumItem}
            onSave={() => {
              setIsReload((item) => !item);
            }}
            isOpenChanged={() => {
              setIsOpenLookupImportDialog(false);
            }}
            isOpen={isOpenLookupImportDialog}
            translationPath={translationPath}
          />
        )}
        {isOpenDeleteDialog && (
          <ConfirmDeleteDialog
            activeItem={activeItem}
            successMessage={successMessage}
            onSave={() => {
              onFilterChanged({ ...filter, page: 1 });
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
            descriptionMessage={descriptionMessage}
            deleteApi={(lookup && lookup.deleteAPI) || null}
            apiProps={{
              uuid:
                (isBulkDelete
                  && selectedRows.length > 0
                  && selectedRows.map((item) => item.uuid))
                || (activeItem && [activeItem.uuid]),
              ...(lookup.extraParams && (lookup.extraParams || {})),
              ...(lookup.deleteExtraParams && (lookup.deleteExtraParams || {})),
            }}
            errorMessage={errorMessage}
            activeItemKey="uuid"
            apiDeleteKey="uuid"
            parentTranslationPath={parentTranslationPath}
            isOpen={isOpenDeleteDialog}
            lookup={lookup}
            isDynamicService={isDynamicService}
          />
        )}
        {isOpenConfirmEncryptionDialog && (
          <ConfirmEncryptionDialog
            isOpen={isOpenConfirmEncryptionDialog}
            isOpenChanged={() => {
              setIsOpenEncryptionDialog(false);
            }}
            onSave={(val) => {
              setEncryptionState((items) => ({
                ...items,
                ...val,
              }));
            }}
            apiProps={lookupEncryptionKeys}
            lookup={lookup}
            lookupTextName={
              isDynamicService
                ? lookup?.titleText
                : t(`${translationPath}${lookup.label}`)
            }
            currentStatus={encryptionState.status}
          />
        )}
      </div>
    );
  },
);

LookupsComponent.displayName = 'LookupsComponent';

LookupsComponent.propTypes = {
  filter: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    search: PropTypes.string,
    status: PropTypes.bool,
  }).isRequired,
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    titleText: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
    datesFormats: PropTypes.array,
    dynamic_code: PropTypes.string,
    path: PropTypes.string,
    queryText: PropTypes.string,
    isWithoutEncryption: PropTypes.bool,
    importEnumItem: PropTypes.oneOf(Object.values(LookupsImportEnum)),
    controlledTableColumns: PropTypes.instanceOf(Object),
    extraParams: PropTypes.instanceOf(Object), // for shared between all
    getAllExtraParams: PropTypes.instanceOf(Object), // for get all only
    createExtraParams: PropTypes.instanceOf(Object), // for create only
    updateExtraParams: PropTypes.instanceOf(Object), // for update only
    getExtraParams: PropTypes.instanceOf(Object), // for view only
    deleteExtraParams: PropTypes.instanceOf(Object), // for delete only
  }).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  descriptionMessage: PropTypes.string,
  updateSuccessMessage: PropTypes.string,
  createSuccessMessage: PropTypes.string,
  updateFailedMessage: PropTypes.string,
  createFailedMessage: PropTypes.string,
  isDisabledDelete: PropTypes.bool,
  isDisabledUpdate: PropTypes.bool,
  isDisabledAdd: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  dynamicComponent: PropTypes.bool,
  Section: PropTypes.elementType,
  uniqueKeyInput: PropTypes.string,
  customHeaders: PropTypes.shape({ labe: PropTypes.string }),
  withDescription: PropTypes.bool,
  isDynamicService: PropTypes.bool,
};
LookupsComponent.defaultProps = {
  updateSuccessMessage: undefined,
  createSuccessMessage: undefined,
  updateFailedMessage: undefined,
  createFailedMessage: undefined,
  isDisabledDelete: false,
  isDisabledUpdate: false,
  isDisabledAdd: false,
  successMessage: 'personal-classification-deleted-successfully',
  descriptionMessage: 'personal-classification-delete-description',
  errorMessage: 'personal-classification-delete-failed',
  dynamicComponent: false,
  Section: undefined,
  uniqueKeyInput: undefined,
  customHeaders: undefined,
  withDescription: undefined,
  isDynamicService: undefined,
};

export default LookupsComponent;
