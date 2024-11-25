import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DashboardFilter } from './DashboardFilter.Component';
import { GetStaticAnalytics } from '../../../services';
import { showError } from '../../../helpers';
import SharedChart from './SharedChart.Component';
import { ChartOptions, GetDataFormatFromChartType } from '../AnalyticsHelpers';
import { LoaderComponent } from '../../../components';
import { AnalyticsStaticDashboardEnum } from '../../../enums/Shared/AnalyticsStaticDashboard.Enum';
import { useSelector } from 'react-redux';

export const StaticDashboard = ({ parentTranslationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [staticAnalyticsData, setStaticAnalyticsData] = useState(null);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [filters, setFilters] = useState({
    category: null,
    job_uuid: null,
    pipeline_uuid: null,
    slug: null,
    from_date: null,
    to_date: null,
    date_filter_type: 'default',
  });
  const [isLoading, setIsLoading] = useState(false);
  const GetStaticAnalyticsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetStaticAnalytics({
      ...filters,
      ...(filters.category === 'job'
        && !filters?.company_uuid && {
        company_uuid: selectedBranchReducer?.uuid,
      }),
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setStaticAnalyticsData(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [filters, selectedBranchReducer?.uuid, t]);

  useEffect(() => {
    if (
      !(
        filters.category === 'pipeline'
        && (!filters.job_uuid || !filters.pipeline_uuid)
      )
      && filters.category
    )
      GetStaticAnalyticsHandler();
  }, [GetStaticAnalyticsHandler, filters, selectedBranchReducer?.uuid]);
  return (
    <div className="static-dashboard-container">
      <div className="mx-4">
        <DashboardFilter
          parentTranslationPath={parentTranslationPath}
          setFilters={setFilters}
          filters={filters}
          is_static
          isDisabled={isLoading}
        />
      </div>
      {isLoading && (
        <div className="mx-4 my-4 h-100">
          <LoaderComponent
            isLoading={isLoading}
            isSkeleton
            skeletonItems={[
              {
                variant: 'rectangular',
                style: { minHeight: 60, marginTop: 15, marginBottom: 15 },
              },
            ]}
            numberOfRepeat={5}
          />
        </div>
      )}
      <div
        className="mx-4 my-4 diagrams-containers"
        style={{
          ...(isLoading && { display: 'none' }),
        }}
      >
        {staticAnalyticsData
          && Object.keys(staticAnalyticsData).map((item, idx) =>
            AnalyticsStaticDashboardEnum[filters.category]?.[item] ? (
              <SharedChart
                key={`${item}-${idx}-chart`}
                data={GetDataFormatFromChartType({
                  chart_type:
                    AnalyticsStaticDashboardEnum[filters.category][item].chart_type,
                  data: staticAnalyticsData[item],
                  t,
                })}
                text1={t(AnalyticsStaticDashboardEnum[filters.category][item].title)}
                text2={t('unique')}
                text3={`, ${t(filters.date_filter_type)}`}
                text4={t(
                  AnalyticsStaticDashboardEnum[filters.category][item].subtitle,
                )}
                options={
                  ChartOptions?.[
                    AnalyticsStaticDashboardEnum[filters.category][item].chart_type
                  ]
                }
                wrapperClasses="m-2"
                parentTranslationPath={parentTranslationPath}
                chartType={
                  AnalyticsStaticDashboardEnum[filters.category][item].chart_type
                }
                smallSize={
                  AnalyticsStaticDashboardEnum[filters.category][item].small_size
                }
                is_static
                description={
                  AnalyticsStaticDashboardEnum[filters.category][item].description
                }
                formula={
                  AnalyticsStaticDashboardEnum[filters.category][item].formula
                }
                tableData={
                  AnalyticsStaticDashboardEnum?.[filters.category]?.[item]?.tableData
                }
                feature={filters.category}
                slug={item}
                filters={{
                  ...filters,
                  ...(filters.category === 'job'
                    && !filters?.company_uuid && {
                    company_uuid: selectedBranchReducer?.uuid,
                  }),
                }}
              />
            ) : null,
          )}
      </div>
    </div>
  );
};

StaticDashboard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
};
