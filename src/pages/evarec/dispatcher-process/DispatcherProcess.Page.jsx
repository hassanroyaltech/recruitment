import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ButtonBase from '@mui/material/ButtonBase';
import { SharedInputControl } from '../../setups/shared';
import { SystemActionsEnum, TablesNameEnum } from '../../../enums';
import { TableColumnsPopoverComponent } from '../../../components';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { showError } from '../../../helpers';
import { GetAllJobRequisitions } from '../../../services';
import { AssignToUsersDialog } from './dialogs';

const parentTranslationPath = 'DispatcherProcessPage';
const translationPath = '';

const DispatcherProcessPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const history = useHistory();
  const [activeItem, setActiveItem] = useState(null);
  const [isOpenAssignDialog, setIsOpenAssignDialog] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchers, setDispatchers] = useState(() => ({
    results: [],
    totalCount: 0,
  }));

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: false,
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all dispatchers with filter
   */
  const getAllJobRequisitions = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllJobRequisitions({ ...filter });
    setIsLoading(false);
    if (response && response.status === 200)
      setDispatchers({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setDispatchers({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

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
    if (action.key === SystemActionsEnum.assignToRecruiter.key)
      setIsOpenAssignDialog(true);
    else if (action.key === SystemActionsEnum.postJob.key)
      history.push(`/recruiter/job/create?uuid=${row.uuid}`);
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
    setDispatchers((items) => {
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
    getAllJobRequisitions();
  }, [getAllJobRequisitions, filter]);
  return (
    <div className="dispatcher-process-page-wrapper page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}dispatchers`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}dispatchers-description`)}
        </span>
      </div>
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
            <div className="d-inline-flex mb-2">
              <TableColumnsPopoverComponent
                columns={tableColumns}
                feature_name={TablesNameEnum.JobRequisition.key}
                onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
                onColumnsChanged={onColumnsChanged}
                onReloadData={onReloadDataHandler}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
        <div className="px-2">
          <TablesComponent
            data={dispatchers.results}
            isLoading={isLoading || isLoadingColumns}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            totalItems={dispatchers.totalCount}
            isDynamicDate
            uniqueKeyInput="uuid"
            isWithTableActions
            onActionClicked={onActionClicked}
            tableActions={[
              SystemActionsEnum.assignToRecruiter,
              SystemActionsEnum.postJob,
            ]}
            tableActionsOptions={{
              component: (row) => (
                <>
                  <ButtonBase
                    className="btns theme-primary"
                    onClick={() =>
                      onActionClicked(SystemActionsEnum.assignToRecruiter, row)
                    }
                  >
                    <span className={SystemActionsEnum.assignToRecruiter.icon} />
                    <span className="px-1">
                      {t(SystemActionsEnum.assignToRecruiter.value)}
                    </span>
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-primary"
                    onClick={() => onActionClicked(SystemActionsEnum.postJob, row)}
                  >
                    <span className={SystemActionsEnum.postJob.icon} />
                    <span className="px-1">
                      {t(SystemActionsEnum.postJob.value)}
                    </span>
                  </ButtonBase>
                </>
              ),
            }}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        </div>
      </div>
      {isOpenAssignDialog && (
        <AssignToUsersDialog
          activeItem={activeItem}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={() => {
            setIsOpenAssignDialog(false);
            if (activeItem) setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenAssignDialog}
        />
      )}
    </div>
  );
};

export default DispatcherProcessPage;
