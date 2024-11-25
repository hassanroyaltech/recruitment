import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { FlowsIcon, SearchIcon } from '../../../assets/icons';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { ConfirmDeleteDialog, SharedInputControl } from '../../setups/shared';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../helpers';
import { PopoverComponent, TableColumnsPopoverComponent } from '../../../components';
import { DeleteFormsTemplate, GetAllOnboardingFlows } from '../../../services';
import {
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  OnboardingSortByActionsEnum,
  SystemActionsEnum,
  TablesNameEnum,
} from '../../../enums';
import { OnboardingFiltersDisplaySection } from '../shared/sections/onboarding-filters-display/OnboardingFiltersDisplay.Section';
import { ManageFlowPermissions } from '../../../permissions';
import { useSelector } from 'react-redux';
const parentTranslationPath = 'OnboardingPage';
const translationPath = 'FlowsPage.';

const FlowsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding-flows`));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [popovers, setPopovers] = useState({
    sort: { ref: null },
    group: { ref: null },
  });
  const [flows, setFlows] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    status: false,
    use_for: 'list',
    sort: '',
    search: '',
  });
  const resetData = useCallback(() => {
    setFlows({ results: [], totalCount: 0 });
  }, []);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const getFlowsData = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllOnboardingFlows({
      ...filter,
      sort_by: filter?.sort?.sort_by,
      order: filter?.sort?.order,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setFlows({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setFlows({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search)
      setFilter((filters) => ({
        ...filters,
        page: 1,
        search: textSearch.value,
      }));
  }, [filter.search, textSearch.value]);
  const filterChange = useCallback(
    (name, value) => {
      setFilter((filters) => ({ ...filters, page: 1, [name]: value }));
      resetData();
    },
    [resetData],
  );
  const handleOpenPopover = useCallback((e, type) => {
    setPopovers((item) => ({
      ...item,
      [type]: { ref: e?.target || null },
    }));
  }, []);
  const handleSortByAndGroupBy = useCallback(
    (type, action) => {
      setPopovers((item) => ({ ...item, [type]: { ref: null } }));
      filterChange(type, action);
    },
    [filterChange],
  );

  const onFilterResetClicked = useCallback(() => {
    setFilter((items) => ({
      ...items,
      page: 1,
      sort: '',
      search: '',
    }));
    resetData();
  }, [resetData]);
  const sortByActions = useMemo(
    () => Object.values(OnboardingSortByActionsEnum),
    [],
  );
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setFlows((items) => {
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

  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key)
      GlobalHistory.push(
        `/forms?code=${DefaultFormsTypesEnum.Flows.key}&source=${
          NavigationSourcesEnum.OnboardingMenuToFormBuilder.key
        }${(row && `&template_uuid=${row.uuid}`) || ''}${
          (row.space_uuid && `&space_uuid=${row.space_uuid}`) || ''
        }${(row.folder_uuid && `&folder_uuid=${row.folder_uuid}`) || ''}`,
      );
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDeleteDialog(true);
  };

  const redirectionToFlowHandler = useCallback(async () => {
    GlobalHistory.push(
      `/forms?code=${DefaultFormsTypesEnum.Flows.key}&source=${NavigationSourcesEnum.OnboardingMenuToFormBuilder.key}`,
    );
  }, []);

  useEffect(() => {
    getFlowsData();
  }, [getFlowsData]);

  return (
    <div className="flows-page-wrapper page-wrapper">
      <div className="page-header-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex mb-2">
            <div className="pl-3-reversed mt-2">
              <ButtonBase
                className="btns theme-transparent mx-0 miw-0 c-gray-primary  font-12"
                onClick={() => {}}
              >
                <span>{t(`Eva Board`)}</span>
              </ButtonBase>
              <span className="fas fa-long-arrow-alt-right mx-2 font-12" />
              <span>{t(`${translationPath}all-flows`)}</span>
            </div>
          </div>
        </div>
        <div className="d-flex-v-center-h-between flex-wrap my-2">
          <div className="d-inline-flex flex-wrap mb-2">
            <div className="d-inline-flex-v-center header-text-x2 mt-2">
              <span>
                <FlowsIcon />
              </span>
              <span className="px-2">{t(`${translationPath}onboarding-flows`)}</span>
            </div>
          </div>
          <div className="d-inline-flex mb-2">
            <ButtonBase
              onClick={redirectionToFlowHandler}
              className="btns theme-transparent"
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: ManageFlowPermissions.CreateFlow.key,
                  permissions: permissionsReducer,
                })
              }
            >
              <span className="fas fa-plus" />
              <span className="px-1">{t(`${translationPath}new-flow`)}</span>
            </ButtonBase>
          </div>
        </div>
        <div className="d-flex-v-center-h-end my-3">
          {textSearch.open ? (
            <SharedInputControl
              idRef="searchRef"
              placeholder="search"
              themeClass="theme-transparent"
              wrapperClasses={'mb-0'}
              onKeyDown={(e) => {
                e.key === 'Enter' && handleCloseSearchText();
              }}
              stateKey="search"
              endAdornment={
                <span
                  className="end-adornment-wrapper"
                  onClick={() => {
                    handleCloseSearchText();
                  }}
                  onKeyDown={() => {
                    handleCloseSearchText();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <SearchIcon />
                </span>
              }
              onValueChanged={(newValue) => {
                setTextSearch((items) => ({
                  ...items,
                  value: newValue?.value || '',
                }));
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              editValue={textSearch.value}
            />
          ) : (
            <ButtonBase
              className="btns-icon theme-transparent"
              onClick={() => setTextSearch((item) => ({ ...item, open: true }))}
            >
              <SearchIcon />
            </ButtonBase>
          )}
          {/*TO DO For Later*/}
          {/*<ButtonBase*/}
          {/*  disabled*/}
          {/*  className="btns theme-transparent px-2 miw-0 c-gray-primary"*/}
          {/*>*/}
          {/*  <span className="px-1">{t(`filter`)}</span>*/}
          {/*</ButtonBase>*/}

          {/*TO DO For Later*/}
          <ButtonBase
            onClick={(e) => {
              handleOpenPopover(e, 'sort');
            }}
            className="btns theme-transparent  px-2 miw-0 c-gray-primary"
          >
            <span className=" ">{t(`sort-by`)}</span>
            {filter?.sort?.label ? (
              <span className="px-1  c-black-lighter ">
                {t(filter?.sort?.label)}
              </span>
            ) : null}
          </ButtonBase>
        </div>
        <div className="d-flex flex-wrap mb-1">
          <OnboardingFiltersDisplaySection
            filter={filter}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            setFilter={setFilter}
            onFilterResetClicked={onFilterResetClicked}
            onFilterChange={filterChange}
          />
        </div>
        <div>
          <span className="font-12 font-weight-500 c-gray-primary mb-3 ml-5">
            {t(`${translationPath}showing`)} {flows?.totalCount}
          </span>
        </div>
        <div className="d-flex-v-start-h-end mb-1 mr-2">
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
          <TableColumnsPopoverComponent
            columns={tableColumns}
            feature_name={TablesNameEnum.Flow.key}
            onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
            onColumnsChanged={onColumnsChanged}
            onReloadData={onReloadDataHandler}
            isLoading={isLoading}
          />
        </div>

        <div className="d-flex m-3">
          <div className="page-body-wrapper responses-table">
            <TablesComponent
              isWithCheckAll
              isWithCheck
              onColumnsChanged={onColumnsChanged}
              onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
              data={flows.results}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              isLoading={isLoading || isLoadingColumns}
              totalItems={flows.totalCount}
              isWithTableActions
              onActionClicked={onActionClicked}
              tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              uniqueKeyInput="uuid"
              onSelectAllCheckboxChanged={() => {
                setSelectedRows((items) =>
                  globalSelectedRowsHandler(items, flows.results),
                );
              }}
              onSelectCheckboxChanged={({ selectedRow }) => {
                if (!selectedRow) return;
                setSelectedRows((items) =>
                  globalSelectedRowHandler(items, selectedRow),
                );
              }}
              selectedRows={selectedRows}
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
          {isOpenDeleteDialog && (
            <ConfirmDeleteDialog
              successMessage="flow-deleted-successfully"
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
              activeItem={activeItem}
              isOpenChanged={() => {
                setIsOpenDeleteDialog(false);
                setActiveItem(null);
                if (isBulkDelete) {
                  setIsBulkDelete(false);
                  setSelectedRows([]);
                }
              }}
              descriptionMessage="flow-delete-description"
              deleteApi={DeleteFormsTemplate}
              errorMessage="flow-delete-failed"
              apiProps={{
                uuid:
                  (isBulkDelete
                    && selectedRows.length > 0
                    && selectedRows.map((item) => item.uuid))
                  || (activeItem && [activeItem.uuid]),
              }}
              apiDeleteKey="uuid"
              activeItemKey="uuid"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isOpen={isOpenDeleteDialog}
            />
          )}
        </div>
      </div>
      <PopoverComponent
        idRef="widget-ref"
        attachedWith={popovers?.sort?.ref}
        handleClose={() => {
          handleOpenPopover(null, 'sort');
        }}
        popoverClasses="columns-popover-wrapper"
        component={
          <div className="d-flex-column p-2 w-100">
            {sortByActions.map((action, idx) => (
              <ButtonBase
                key={`${idx}-${action.key}-popover-action`}
                className="btns theme-transparent justify-content-start m-1"
                onClick={() => {
                  handleSortByAndGroupBy('sort', action);
                }}
              >
                <span className="px-2">{t(action.label)}</span>
              </ButtonBase>
            ))}
          </div>
        }
      />
    </div>
  );
};
export default FlowsPage;
