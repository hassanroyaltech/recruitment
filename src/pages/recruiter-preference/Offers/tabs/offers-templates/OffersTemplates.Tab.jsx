import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Inputs, TableColumnsPopoverComponent } from '../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../../../helpers';
import { ManageFormBuilderTemplatesPermissions } from '../../../../../permissions';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConfirmDeleteDialog,
  SharedAPIAutocompleteControl,
} from '../../../../setups/shared';
import {
  DeleteFormsTemplate,
  GetAllFormTemplates,
  GetBuilderFormTypes,
} from '../../../../../services';
import {
  SystemActionsEnum,
  TablesNameEnum,
  TemplateRolesEnum,
} from '../../../../../enums';
import { removeCandidateUser } from '../../../../../stores/actions/candidateActions';
import { useQuery } from '../../../../../hooks';
import { FormsSettingsManagementDialog, TemplateCloneDialog } from '../../dialogs';

export const OffersTemplatesTab = ({
  onIsLoadingChanged,
  isLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const query = useQuery();
  const isFirstLoadRef = useRef(true);
  const [
    isOpenFormsSettingsManagementDialog,
    setIsOpenFormsSettingsManagementDialog,
  ] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpenTemplateCloneDialog, setIsOpenTemplateCloneDialog] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    use_for: 'list',
    status: false,
    form_type_uuid: query.get('template_type_uuid') || null,
  });
  const [offers, setOffers] = useState({
    results: [],
    totalCount: 0,
  });
  const [tableColumns, setTableColumns] = useState(() => []);

  const GetAllOffersHandler = useCallback(async () => {
    onIsLoadingChanged(true);
    const response = await GetAllFormTemplates({ ...filter });
    onIsLoadingChanged(false);
    if (response && response.status === 200)
      setOffers({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setOffers({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response); // test
    }
  }, [onIsLoadingChanged, filter, t]);

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
   * @Description this method is to change filter from child
   */
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
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
   * @Description this method is to open dialog of management or delete
   */
  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.delete.key) setIsOpenDeleteDialog(true);
    if (action.key === SystemActionsEnum.edit.key)
      GlobalHistory.push(
        `/form-builder/edit?template_uuid=${row.uuid}&template_type_uuid=${filter.form_type_uuid}&editorRole=${TemplateRolesEnum.Creator.key}`,
      );
    if (action.key === SystemActionsEnum.clone.key)
      setIsOpenTemplateCloneDialog(true);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to reload the data by reset the active page
   */
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setOffers((items) => {
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

  const addNewTemplateHandler = () => {
    dispatch(removeCandidateUser());
    GlobalHistory.push(
      `/form-builder/edit?template_type_uuid=${filter.form_type_uuid}&editorRole=${TemplateRolesEnum.Creator.key}`,
    );
  };

  const initialTypeHandler = useCallback((loadedData) => {
    if (isFirstLoadRef.current && loadedData && loadedData.length > 0) {
      setFilter((items) => {
        if (
          items
          && items.form_type_uuid
          && loadedData.find((item) => item.uuid === items.form_type_uuid)?.uuid
        )
          return items;
        return {
          ...items,
          page: 1,
          form_type_uuid: loadedData[0].uuid,
        };
      });
      isFirstLoadRef.current = false;
    }
  }, []);

  const onOpenFormsSettingsManagementDialogChanged = useCallback(() => {
    setIsOpenFormsSettingsManagementDialog((item) => !item);
  }, []);

  useEffect(() => {
    if (filter.form_type_uuid) GetAllOffersHandler();
  }, [GetAllOffersHandler, filter]);
  return (
    <div className="templates-tab-wrapper tab-wrapper">
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap">
          <SharedAPIAutocompleteControl
            stateKey="form_type_uuid"
            placeholder="select-form-type"
            title="form-type"
            editValue={filter.form_type_uuid}
            onValueChanged={({ value }) => {
              setFilter((items) => ({ ...items, page: 1, form_type_uuid: value }));
            }}
            // searchKey="search"
            getDataAPI={GetBuilderFormTypes}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getReturnedData={initialTypeHandler}
            disableClearable
            getOptionLabel={(option) => `${option.name}` || 'N/A'}
            extraProps={{
              version: 'v1',
            }}
          />
        </div>
        <div className="d-inline-flex px-2">
          <ButtonBase
            className="btns theme-transparent mx-2 mb-3"
            onClick={addNewTemplateHandler}
            disabled={
              !filter.form_type_uuid
              || !getIsAllowedPermissionV2({
                permissionId:
                  ManageFormBuilderTemplatesPermissions.CreateFormBuilderTemplate
                    .key,
                permissions: permissionsReducer,
              })
            }
          >
            <i className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-new-template`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns-icon theme-transparent mx-2 mb-3"
            onClick={onOpenFormsSettingsManagementDialogChanged}
          >
            <i className="fas fa-cog" />
          </ButtonBase>
        </div>
      </div>
      <div className="d-flex-v-center-h-between flex-wrap px-2">
        <div className="text-muted px-3 mb-2">
          <span>{t(`${translationPath}add-new-template-description`)}</span>
        </div>
        <div className="d-inline-flex mb-2">
          <div className="d-inline-flex px-2 mb-2">
            <Inputs
              idRef="searchRef"
              value={searchValue}
              themeClass="theme-solid"
              label="search"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onInputChanged={(event) => {
                const {
                  target: { value },
                } = event;
                setSearchValue(value);
              }}
              onKeyUp={(event) => {
                if (event.key === 'Enter')
                  onFilterChanged((elements) => ({
                    ...elements,
                    page: 1,
                    search: searchValue,
                  }));
              }}
              endAdornment={
                <div className="end-adornment-wrapper">
                  <ButtonBase
                    className="btns-icon theme-transparent"
                    disabled={isLoading}
                    onClick={() => {
                      onFilterChanged({
                        ...filter,
                        page: 1,
                        search: searchValue,
                      });
                    }}
                  >
                    <span className="fas fa-search" />
                  </ButtonBase>
                </div>
              }
            />
          </div>
          <div className="body-actions-wrapper pt-1">
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
                feature_name={TablesNameEnum.FormTemplate.key} // change later
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-2">
        <TablesComponent
          data={offers.results}
          isLoading={isLoading || isLoadingColumns}
          headerData={tableColumns}
          pageIndex={filter.page - 1}
          pageSize={filter.limit}
          totalItems={offers.totalCount}
          selectedRows={selectedRows}
          isWithCheckAll
          isWithCheck
          isDynamicDate
          uniqueKeyInput="uuid"
          getIsDisabledRow={(row) => row.can_delete === false}
          onSelectAllCheckboxChanged={() => {
            setSelectedRows((items) =>
              globalSelectedRowsHandler(
                items,
                offers.results.filter((item) => item.can_delete !== false),
              ),
            );
          }}
          onSelectCheckboxChanged={({ selectedRow }) => {
            if (!selectedRow) return;
            setSelectedRows((items) => globalSelectedRowHandler(items, selectedRow));
          }}
          isWithTableActions
          onActionClicked={onActionClicked}
          tableActions={[
            SystemActionsEnum.clone,
            SystemActionsEnum.delete,
            SystemActionsEnum.edit,
          ]}
          tableActionsOptions={{
            getDisabledAction: (item, rowIndex, actionEnum) =>
              (actionEnum.key === SystemActionsEnum.delete.key
                && (item.can_delete === false
                  || !getIsAllowedPermissionV2({
                    permissionId:
                      ManageFormBuilderTemplatesPermissions.DeleteFormBuilderTemplate
                        .key,
                    permissions: permissionsReducer,
                  })))
              || (actionEnum.key === SystemActionsEnum.edit.key
                && !getIsAllowedPermissionV2({
                  permissionId:
                    ManageFormBuilderTemplatesPermissions.UpdateFormBuilderTemplate
                      .key,
                  permissions: permissionsReducer,
                })),
            // eslint-disable-next-line max-len
            getTooltipTitle: ({ row, actionEnum }) =>
              (actionEnum.key === SystemActionsEnum.delete.key
                && row.can_delete === false
                && t('Shared:can-delete-description')) // test
              || '',
          }}
          onPageIndexChanged={(newValue) => {
            onFilterChanged({ ...filter, page: newValue + 1 });
          }}
          onPageSizeChanged={(newValue) => {
            onFilterChanged({ ...filter, page: 1, limit: newValue });
          }}
        />
      </div>
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="offer-deleted-successfully"
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
          descriptionMessage="offer-delete-description"
          deleteApi={DeleteFormsTemplate}
          apiProps={{
            uuid:
              (isBulkDelete // api doesn't have bulk delete
                && selectedRows.length > 0
                && selectedRows.map((item) => item.uuid))
              || (activeItem && [activeItem.uuid]),
          }}
          errorMessage="offer-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
      {isOpenFormsSettingsManagementDialog && (
        <FormsSettingsManagementDialog
          isOpen={isOpenFormsSettingsManagementDialog}
          isOpenChanged={onOpenFormsSettingsManagementDialogChanged}
          parentTranslationPath={parentTranslationPath}
          // translationPath={translationPath}
        />
      )}
      {isOpenTemplateCloneDialog && (
        <TemplateCloneDialog
          template_uuid={activeItem?.uuid}
          title={activeItem?.title}
          isOpen={isOpenTemplateCloneDialog}
          onSave={() => {
            onFilterChanged({ ...filter, page: 1 });
          }}
          isOpenChanged={() => {
            setIsOpenTemplateCloneDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

OffersTemplatesTab.propTypes = {
  onIsLoadingChanged: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isForceToReload: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
