import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
// import { SharedInputControl } from '../../shared';
import { GetAllSetupsHierarchyLevels } from '../../../../services';
import { showError } from '../../../../helpers';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { TableColumnsPopoverComponent } from '../../../../components';
import { LookupsImportEnum, TablesNameEnum } from '../../../../enums';
import { LookupImportDialog } from '../../shared/dialogs/lookups-import/LookupsImport.Dialog';
import ButtonBase from '@mui/material/ButtonBase';

const translationPath = 'HierarchyLevelsPage.';
const parentTranslationPath = 'SetupsPage';

const HierarchyLevelsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  // const [activeItem, setActiveItem] = useState(null);
  // const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  // const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  // const [isBulkDelete, setIsBulkDelete] = useState(false);
  const accountReducer = useSelector((state) => state?.accountReducer);
  const [isOpenLookupImportDialog, setIsOpenLookupImportDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hierarchyLevel, setHierarchyLevel] = useState(() => ({
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
   * @Description this method is to get all hierarchyLevel with filter
   */
  const getAllSetupsHierarchyLevel = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsHierarchyLevels({
      ...filter,
      account_uuid: accountReducer.account_uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setHierarchyLevel({
        results: response.data.results,
        // totalCount: response.data.paginate.total,
        totalCount: response.data.results.length,
      });
    else if (filter.page === 1)
      setHierarchyLevel({
        results: [],
        totalCount: 0,
      });
    else {
      setHierarchyLevel({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [accountReducer.account_uuid, filter, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  // /**
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to open dialog of management or delete
  //  */
  // const onActionClicked = (action, row) => {
  //   setActiveItem(row);
  //   if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
  //   else if (action.key === SystemActionsEnum.delete.key)
  //     setIsOpenDeleteDialog(true);
  // };

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
    setHierarchyLevel((items) => {
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

  // this to get table data on init
  // & on filter change & on columns change
  useEffect(() => {
    if (accountReducer && accountReducer.account_uuid) getAllSetupsHierarchyLevel();
  }, [accountReducer, getAllSetupsHierarchyLevel, filter]);

  return (
    <div className="hierarchy-level-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}hierarchy-levels`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}hierarchy-levels-setup-description`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex mb-2">
            {/* <SharedInputControl
              idRef="searchRef"
              title="search"
              placeholder="search"
              stateKey="search"
              themeClass="theme-filled"
              endAdornment={(
                <span className="end-adornment-wrapper">
                  <span className="fas fa-search" />
                </span>
              )}
              onValueChanged={(newValue) => {
                setFilter((items) => ({
                  ...items,
                  page: 1,
                  search: newValue.value,
                }));
              }}
              parentTranslationPath={parentTranslationPath}
            /> */}
          </div>
          <div className="px-2">
            {/* {selectedRows && selectedRows.length > 0 && ( */}
            {/*  <div className="d-inline-flex mb-2 mx-1"> */}
            {/*    <ButtonBase */}
            {/*      className="btns-icon theme-transparent c-warning" */}
            {/*      onClick={() => { */}
            {/*        setIsBulkDelete(true); */}
            {/*        setIsOpenDeleteDialog(true); */}
            {/*      }} */}
            {/*    > */}
            {/*      <span className={SystemActionsEnum.delete.icon} /> */}
            {/*    </ButtonBase> */}
            {/*  </div> */}
            {/* )} */}
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                columns={tableColumns}
                feature_name={TablesNameEnum.HierarchiesLevels.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
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
              className="btns theme-solid mx-2 mb-2"
            >
              <span className="fas fa-file-import" />
              <span className="px-2">
                {t(`${translationPath}import-${LookupsImportEnum.hierarchy_level.value}`)}
              </span>
            </ButtonBase>
            {/* <ButtonBase */}
            {/*  onClick={() => { */}
            {/*    setIsOpenManagementDialog(true); */}
            {/*  }} */}
            {/*  className="btns theme-solid mx-3 mb-2" */}
            {/* > */}
            {/*  <span className="fas fa-plus" /> */}
            {/*  <span className="px-1"> */}
            {/*    {t(`${translationPath}add-hierarchy-level`)} */}
            {/*  </span> */}
            {/* </ButtonBase> */}
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={hierarchyLevel.results}
            isLoading={isLoading || isLoadingColumns}
            isDynamicDate
            uniqueKeyInput="uuid"
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={hierarchyLevel.totalCount}
            // onActionClicked={onActionClicked}
            // tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      </div>
      {/* {isOpenManagementDialog && ( */}
      {/*  <HierarchyLevelManagementDialog */}
      {/*    activeItem={activeItem} */}
      {/*    onSave={() => { */}
      {/*      setFilter((items) => ({ ...items, page: items.page })); */}
      {/*    }} */}
      {/*    isOpenChanged={() => { */}
      {/*      setIsOpenManagementDialog(false); */}
      {/*      if (activeItem) setActiveItem(null); */}
      {/*    }} */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*    translationPath={translationPath} */}
      {/*    isOpen={isOpenManagementDialog} */}
      {/*  /> */}
      {/* )} */}
      {/* {isOpenDeleteDialog && ( */}
      {/*  <ConfirmDeleteDialog */}
      {/*    activeItem={activeItem} */}
      {/*    successMessage="hierarchy-level-deleted-successfully" */}
      {/*    onSave={() => { */}
      {/*      setFilter((items) => ({ ...items, page: 1 })); */}
      {/*      if (isBulkDelete) setSelectedRows([]); */}
      {/*      else { */}
      {/*        const localSelectedRows = [...selectedRows]; */}
      {/*        const selectedRowIndex = selectedRows.findIndex( */}
      {/*          (item) => item.uuid === activeItem.uuid, */}
      {/*        ); */}
      {/*        if (selectedRowIndex !== -1) { */}
      {/*          localSelectedRows.splice(selectedRowIndex, 1); */}
      {/*          setSelectedRows(localSelectedRows); */}
      {/*        } */}
      {/*      } */}
      {/*    }} */}
      {/*    isOpenChanged={() => { */}
      {/*      setIsOpenDeleteDialog(false); */}
      {/*      setActiveItem(null); */}
      {/*      if (isBulkDelete) { */}
      {/*        setIsBulkDelete(false); */}
      {/*        setSelectedRows([]); */}
      {/*      } */}
      {/*    }} */}
      {/*    descriptionMessage="hierarchy-level-delete-description" */}
      {/*    deleteApi={DeleteSetupsHierarchyLevel} */}
      {/*    apiProps={{ */}
      {/*      uuid: */}
      {/*        (isBulkDelete */}
      {/*          && selectedRows.length > 0 */}
      {/*          && selectedRows.map((item) => item.uuid)) */}
      {/*        || (activeItem && [activeItem.uuid]), */}
      {/*    }} */}
      {/*    errorMessage="hierarchy-level-delete-failed" */}
      {/*    activeItemKey="uuid" */}
      {/*    apiDeleteKey="uuid" */}
      {/*    parentTranslationPath={parentTranslationPath} */}
      {/*    isOpen={isOpenDeleteDialog} */}
      {/*  /> */}
      {/* )} */}
      {isOpenLookupImportDialog && (
        <LookupImportDialog
          enumItem={LookupsImportEnum.hierarchy_level}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={() => {
            setIsOpenLookupImportDialog(false);
          }}
          isOpen={isOpenLookupImportDialog}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

export default HierarchyLevelsPage;
