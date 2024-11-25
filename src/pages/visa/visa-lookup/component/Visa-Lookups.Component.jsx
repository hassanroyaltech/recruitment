import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { SystemActionsEnum } from '../../../../enums';
import {
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
} from '../../../../helpers';
import { ConfirmDeleteDialog, SharedInputControl } from '../../../setups/shared';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { DynamicComponentDialog } from '../../../setups/shared/components/lookups/DynamicComponent.Dialog';
import { LookupsManagementDialog } from '../../../setups/shared/dialogs/lookups-management/LookupsManagementDialog';
import { SwitchComponent } from '../../../../components';

const VisaLookupsComponent = memo(
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
    withDescription,
    uniqueKeyInput,
    customHeaders,
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
    const [isLoading, setIsLoading] = useState(false);
    const [lookups, setLookups] = useState(() => ({
      results: [],
      totalCount: 0,
    }));

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
      });
      if (!isMounted.current) return;
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201))
        setLookups({
          results: response.data.results,
          totalCount: response.data.paginate?.total || response.data.results?.length,
        });
      else {
        setLookups({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    }, [accountReducer, filter, lookup, t]);

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

    const onStatusChangedHandler = async ({ value, uuid }) => {
      setIsLoading(false);
      const response = await lookup.statusAPI({
        uuid,
      });
      if (response && (response.status === 200 || response.status === 201)) {
        if (onFilterChanged) onFilterChanged({ ...filter, page: filter.page });
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    };

    // this to get table data on init
    // & on filter change & on columns change
    useEffect(() => {
      getAllSetupsLookups();
    }, [getAllSetupsLookups, filter]);

    // this is to prevent any memory leak if user changed tab fast
    useEffect(
      () => () => {
        isMounted.current = false;
      },
      [],
    );

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
            <div className="body-actions-wrapper">
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
              <ButtonBase
                disabled={isDisabledAdd}
                onClick={() => {
                  if (onAddClicked) onAddClicked(lookup);
                }}
                className="btns theme-solid mx-3 mb-2"
              >
                <span className="fas fa-plus" />
                <span className="px-1">
                  {t(`${translationPath}add-${lookup.valueSingle}`)}
                </span>
              </ButtonBase>
            </div>
          </div>
          <div className="px-2">
            <TablesComponent
              data={lookups.results}
              isLoading={isLoading}
              headerData={[
                {
                  id: 1,
                  label: t(`${translationPath}code`),
                  input: 'code',
                },
                {
                  id: 2,
                  label: t(`${translationPath}name-english`),
                  input: 'name.en',
                },
                {
                  id: 3,
                  label: t(`${translationPath}name-arabic`),
                  input: 'name.ar',
                },
                {
                  id: 4,
                  label: t(`${translationPath}name-türkçe`),
                  input: 'name.tr',
                },
                {
                  id: 5,
                  label: t(`${translationPath}name-română`),
                  input: 'name.ro',
                },
                {
                  id: 6,
                  label: t(`${translationPath}name-eλληνικά`),
                  input: 'name.el',
                },
                {
                  id: 7,
                  label: t(`${translationPath}name-français`),
                  input: 'name.fr',
                },
                {
                  id: 8,
                  label: t(`${translationPath}name-español`),
                  input: 'name.es',
                },
                {
                  id: 9,
                  label: t(`${translationPath}name-nederlands`),
                  input: 'name.du',
                },
                {
                  id: 10,
                  label: t(`${translationPath}name-deutsch`),
                  input: 'name.de',
                },
                {
                  id: 11,
                  label: t(`${translationPath}status`),
                  input: 'status',
                  component: (option) => (
                    <SwitchComponent
                      label={
                        option.status
                          ? t(`${translationPath}active`)
                          : t(`${translationPath}inactive`)
                      }
                      isChecked={option.status}
                      labelPlacement="start"
                      isFlexStart
                      onChange={(e, value) =>
                        onStatusChangedHandler({ value, uuid: option.uuid })
                      }
                    />
                  ),
                },
                {
                  id: 12,
                  label: t(`${translationPath}created-at`),
                  input: 'created_at',
                },
                {
                  id: 13,
                  label: t(`${translationPath}updated-at`),
                  input: 'updated_at',
                },
              ]}
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
                getTooltipTitle: ({ row, actionEnum }) =>
                  (actionEnum.key === SystemActionsEnum.delete.key
                    && row.can_delete === false
                    && t('Shared:can-delete-description'))
                  || '',
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
              isForVisa={true}
            />
          ))}
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
            }}
            errorMessage={errorMessage}
            activeItemKey="uuid"
            apiDeleteKey="uuid"
            parentTranslationPath={parentTranslationPath}
            isOpen={isOpenDeleteDialog}
            lookup={lookup}
          />
        )}
      </div>
    );
  },
);

VisaLookupsComponent.displayName = 'VisaLookupsComponent';

VisaLookupsComponent.propTypes = {
  filter: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    search: PropTypes.string,
    status: PropTypes.bool,
  }).isRequired,
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
    statusAPI: PropTypes.func,
    datesFormats: PropTypes.array,
    dynamic_code: PropTypes.string,
    path: PropTypes.string,
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
};
VisaLookupsComponent.defaultProps = {
  updateSuccessMessage: undefined,
  createSuccessMessage: undefined,
  updateFailedMessage: undefined,
  createFailedMessage: undefined,
  isDisabledDelete: false,
  isDisabledUpdate: false,
  isDisabledAdd: false,
  successMessage: 'visa-lookups-deleted-successfully',
  descriptionMessage: 'visa-lookups-delete-description',
  errorMessage: 'visa-lookups-delete-failed',
  dynamicComponent: false,
  Section: undefined,
  withDescription: undefined,
  uniqueKeyInput: undefined,
  customHeaders: undefined,
};

export default VisaLookupsComponent;
