import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'reactstrap';
import moment from 'moment';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { showError, showSuccess } from '../../../helpers';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import TablesComponent from '../../../components/Tables/Tables.Component';
import {
  GenerateJobTemplateReport,
  GetAllJobTemplateReports,
  GetJobTemplateProjectionDropdown,
} from '../../../api/evarec';
import { DynamicFormTypesEnum } from '../../../enums';

const translationPath = '';
const parentTranslationPath = 'EvaRecTemplate';
const ExportedJobTemplate = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState(null);
  const [reports, setReports] = useState(() => ({
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
  const userReducer = useSelector((state) => state?.userReducer);

  const GetAllReportsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllJobTemplateReports({
      ...filter,
      feature: 'job_templates',
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setReports({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setReports({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const GenerateReportHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GenerateJobTemplateReport({
      uuids: [userReducer?.results?.user?.uuid],
      projection: reportType,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess('report generated successfully');
      setFilter((items) => ({ ...items }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t, userReducer, reportType]);

  useEffect(() => {
    GetAllReportsHandler();
  }, [GetAllReportsHandler, filter]);

  return (
    <div className="m-4">
      <div className="mx-2 mb-2 fw-bold">{t(`${translationPath}reports`)}</div>
      <div className="mx-2 mb-3">
        {t(`${translationPath}generate-report-description`)}
      </div>
      <div className="d-flex">
        <SharedAPIAutocompleteControl
          isQuarterWidth
          title="breakdown"
          searchKey="search"
          placeholder="select-breakdown"
          stateKey="projection"
          editValue={reportType}
          errorPath="account_uuid"
          onValueChanged={(newValue) => setReportType(newValue.value)}
          getDataAPI={GetJobTemplateProjectionDropdown}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) => option.title}
          uniqueKey="slug"
          extraProps={{
            slug: 'job_templates',
          }}
          type={DynamicFormTypesEnum.array.key}
        />
        <div>
          <Button
            className="float-right mb-3 btn-analytics mr-3-reversed"
            color="primary"
            size="sm"
            disabled={!reportType}
            style={{ padding: '6px 22px' }}
            onClick={GenerateReportHandler}
          >
            <i className="fas fa-plus" /> {t(`${translationPath}generate-report`)}
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <div className="px-2">
          <Button size="sm" onClick={() => setFilter((items) => ({ ...items }))}>
            <i className="fas fa-redo" />
          </Button>
        </div>
        <TablesComponent
          data={reports.results}
          isLoading={isLoading}
          headerData={[
            {
              id: 1,
              isSortable: true,
              label: t(`${translationPath}type`),
              input: 'type',
            },
            {
              id: 2,
              isSortable: true,
              label: t(`${translationPath}status`),
              input: 'status',
              component: (row) => t(`${translationPath}${row.status}`),
            },
            {
              id: 3,
              isSortable: true,
              label: t(`${translationPath}file`),
              input: 'url',
              component: (row) => (
                <a href={row.url} target="_blank" rel="noreferrer">
                  {t(`${translationPath}download`)}
                </a>
              ),
            },
            {
              id: 4,
              isSortable: true,
              label: t(`${translationPath}created_at`),
              input: 'created_at',
              component: (row) => moment(row.created_at).format('YYYY-MM-DD'),
            },
          ]}
          pageIndex={filter.page - 1}
          pageSize={filter.limit}
          totalItems={reports.totalCount}
          isWithCheckAll
          isWithCheck
          isDynamicDate
          uniqueKeyInput="uuid"
          getIsDisabledRow={(row) => row.can_delete === false}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
        />
      </div>
    </div>
  );
};

export default ExportedJobTemplate;

ExportedJobTemplate.propTypes = {
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
