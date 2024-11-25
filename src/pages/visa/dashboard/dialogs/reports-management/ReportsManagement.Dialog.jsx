/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';

import { showError, showSuccess } from '../../../../../helpers';

import {
  ExportVisaRepositoryReport,
  GetAllVisaReports,
} from '../../../../../services';

import TablesComponent from '../../../../../components/Tables/Tables.Component';
import ButtonBase from '@mui/material/ButtonBase';
import moment from 'moment-hijri';
import { SystemActionsEnum, TableActionsThemesEnum } from '../../../../../enums';
import i18next from 'i18next';

export const ReportsManagementDialog = ({
  isOpen,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
  });
  const [reportsData, setReportsData] = useState({
    results: [],
    totalCount: 0,
  });
  const downloadReportHandler = useCallback((url) => {
    if (!url) return;
    const link = document.createElement('a');
    link.download = 'true';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);
  const [tableColumns] = useState([
    {
      id: 1,
      isSortable: false,
      label: 'created-by',
      input: 'created_by',
    },
    {
      id: 2,
      isSortable: false,
      label: 'created-at',
      component: (row) => (
        <span>
          {moment(row.created_at)
            .locale(i18next.language)
            .format('YYYY-MM-DD hh:mm/A')}
        </span>
      ),
    },
    {
      id: 2,
      isSortable: false,
      label: 'status',
      component: (row) => <span>{t(`${translationPath}${row.status}`)}</span>,
    },
  ]);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const getAllVisaReports = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaReports(filter);
    setIsLoading(false);
    if (response && response.status === 200)
      setReportsData({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setReportsData({ results: [], totalCount: 0 });
    }
  }, [filter, t]);

  const exportVisaRepositoryReport = useCallback(async () => {
    setIsLoading(true);
    const response = await ExportVisaRepositoryReport();
    if (response?.status === 200) {
      showSuccess(t(`${translationPath}report-exported-successfully`));
      setFilter((items) => ({ ...items, page: 1 }));
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    }
  }, [t, translationPath]);

  useEffect(() => {
    getAllVisaReports();
  }, [getAllVisaReports]);
  const onActionClicked = (action, row) => {
    if (action.key === SystemActionsEnum.download.key)
      downloadReportHandler(row?.url);
  };

  return (
    <>
      <DialogComponent
        titleText={'visa-reports'}
        dialogContent={
          <div>
            <div className="d-flex-v-center-h-end mb-3">
              <ButtonBase
                className="btns theme-transparent mx-2"
                onClick={() => setFilter((items) => ({ ...items, page: 1 }))}
                disabled={isLoading}
              >
                <span className="fas fa-sync-alt" />
                <span className="px-1">{t(`${translationPath}reload-reports`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-solid mx-2"
                onClick={() => exportVisaRepositoryReport()}
                disabled={isLoading}
              >
                <span className="fas fa-download" />
                <span className="px-1">{t(`${translationPath}export-report`)}</span>
              </ButtonBase>
            </div>

            <TablesComponent
              data={reportsData.results}
              isLoading={isLoading}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              totalItems={reportsData.totalCount}
              isDynamicDate
              uniqueKeyInput="uuid"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isWithoutBoxWrapper
              themeClasses="theme-transparent"
              isWithTableActions
              tableActions={[SystemActionsEnum.download]}
              onActionClicked={onActionClicked}
              tableActionsThemes={TableActionsThemesEnum.Buttons.key}
              tableActionsOptions={{
                getTooltipTitle: ({ row, actionEnum }) =>
                  (actionEnum.key === SystemActionsEnum.download.key
                    && row.status !== 'done'
                    && t(`${translationPath}can-download-description`))
                  || '',
                getDisabledAction: (row, rowIndex, actionEnum) =>
                  actionEnum.key === SystemActionsEnum.download.key
                  && row.status !== 'done',
              }}
            />
          </div>
        }
        isOpen={isOpen}
        onCancelClicked={isOpenChanged}
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        saveType="Edit"
      />
    </>
  );
};

ReportsManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

ReportsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'ReportsManagementDialog.',
};
