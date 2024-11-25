import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  LoaderComponent,
  PopoverComponent,
  RadiosComponent,
  TooltipsComponent,
} from '../../../components';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  ButtonBase,
  CircularProgress,
} from '@mui/material';
import {
  CreateCustomDashboardWidget,
  DynamicService,
  GetAllAnalyticsFiltersDropdown,
  GetAllAnalyticsOfferContentDropdown,
  GetAllAnalyticsProjectionDropdown,
  GetAllAnalyticsSummarizeDropdown,
  GetAllEvaRecPipelineStages,
  GetAllFeaturesList,
  GetDynamicAnalytics,
  UpdateCustomDashboardWidget,
} from '../../../services';
import { DownArrowLongIcon, PlusIcon } from '../../../assets/icons';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../setups/shared';
import i18next from 'i18next';
import { DynamicFormTypesEnum, AnalyticsChartTypesEnum } from '../../../enums';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import moment from 'moment/moment';
import ToggleButton from '@mui/material/ToggleButton';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { getErrorByName, showError } from '../../../helpers';
import SharedChart from '../Components/SharedChart.Component';
import Datepicker from '../../../components/Elevatus/Datepicker';
import { numbersExpression } from '../../../utils';
import { ChartOptions, getColorsPerLabel } from '../AnalyticsHelpers';
import { CustomDateFilterDialog } from '../Dialogs/CustomDateFilter.Dialog';
import { AnalyticsContentOfferInputEnum } from '../../../enums/Shared/AnalyticsContentOfferInput.Enum';
import { AnalyticsContentOfferOperationEnum } from '../../../enums/Shared/AnalyticsContentOfferOperation.Enum';
import { ExportDialog } from '../Dialogs/Export.Dialog';
import * as yup from 'yup';
import { PipelineFeatureDialog } from '../Dialogs/PipelineFeature.Dialog';
export const WidgetSetupView = ({
  parentTranslationPath,
  setCurrentView,
  currentView,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    feature: null,
    summarize: [],
    filterItems: [],
    projection: [],
    offerContent: {},
    contentFilter: [],
    page: 1,
    limit: 10,
    date_filter_type: 'default',
    from_date: null,
    to_date: null,
  });
  const [selectedDateRange, setSelectedDateRange] = useState('default');
  const widgetDataRef = useRef({
    title: 'Untitled widget',
    description: '',
    chart_type: AnalyticsChartTypesEnum.TABLE.value,
  });
  const [widgetData, setWidgetData] = useState(widgetDataRef.current);
  const executedWidgetDataInit = useRef({
    columns: [],
    rows: [],
    total: 0,
  });
  const [executedWidgetData, setExecutedWidgetData] = useState(
    executedWidgetDataInit.current,
  );
  const [isExecute, setIsExecute] = useState(false);
  const [defaultProjections, setDefaultProjections] = useState([]);
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const [popoverContentOffer, setPopoverContentOffer] = useState(null);
  const [popoverContentOfferOperation, setPopoverContentOfferOperation]
    = useState(null);
  const [selectedContentFilter, setSelectedContentFilter] = useState(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const isMountedRef = useRef(true);
  const [summarizeList, setSummarizeList] = useState([]);
  const [defaultFormContent, setDefaultFormContent] = useState([]);
  const [filtersList, setFiltersList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [isPipelineFeatureOpen, setIsPipelineFeatureOpen] = useState(false);

  const SaveCustomDashboardWidgetHandler = useCallback(async () => {
    if (Object.keys(errors).length > 0 || !widgetData.title) return;
    setIsLoading(true);
    let filtersObj = {};
    filters.filterItems.forEach((it) => {
      filtersObj = {
        ...filtersObj,
        [it.slug]: it.value,
      };
    });

    let formattedContentFilter = {};
    filters.contentFilter.forEach((item) => {
      formattedContentFilter = {
        ...formattedContentFilter,
        [item.slug]: {
          type: item.type,
          operation: item.operation,
          value: item.value,
        },
      };
    });
    const response = await (currentView?.currentDashboard?.widget_edit_data?.uuid
      ? UpdateCustomDashboardWidget
      : CreateCustomDashboardWidget)({
      dashboard_uuid: currentView?.currentDashboard?.uuid,
      ...widgetData,
      chart_type: widgetData.chart_type,
      feature: filters.feature,
      payload: {
        summarize: filters.summarize.length > 0 ? filters.summarize : null,
        ...(filters.sort && { sort: filters.sort }),
        projection: filters.projection.length > 0 ? filters.projection : null,
        ...filtersObj,
        ...(filtersObj.match_job_uuid?.length && {
          match_job_uuid: filtersObj.match_job_uuid[0],
        }),
        from_date: filters.from_date || null,
        to_date: filters.to_date || null,
        page: filters.page,
        limit: filters.feature === 'pipeline' ? 100 : filters.limit,
        content:
          Object.keys(formattedContentFilter).length > 0
            ? formattedContentFilter
            : null,
        ...(filters.pipeline_division && {
          dividend_stage_uuid: filters.pipeline_division.dividend_stage_uuid,
          divisor_stage_uuid: filters.pipeline_division.divisor_stage_uuid,
        }),
        ...(filters.pipeline_origin_uuid && {
          pipeline_origin_uuid: filters.pipeline_origin_uuid,
        }),
        ...(filters.pipeline_company_uuid && {
          pipeline_company_uuid: filters.pipeline_company_uuid,
        }),
      },
      ...(currentView?.currentDashboard?.widget_edit_data?.uuid && {
        uuid: currentView?.currentDashboard?.widget_edit_data?.uuid,
      }),
    });
    if (response && response.status === 200) {
      window?.ChurnZero?.push([
        'trackEvent',
        `Analytics - Build Dashboard`,
        `Build Dashboard`,
        1,
        {},
      ]);
      setCurrentView((items) => ({
        ...items,
        view: 'dashboard',
        currentDashboard: {
          ...items.currentDashboard,
          widget_edit_data: undefined,
        },
      }));
      setWidgetData(widgetDataRef.current);
    } else showError(t('Shared:failed-to-get-saved-data'), response);

    setIsLoading(false);
  }, [filters, currentView, widgetData, setCurrentView, t, errors]);

  const getDynamicServicePropertiesHandler = useCallback(
    ({ apiFilter, apiSearch, apiExtraProps }) => ({
      ...(apiExtraProps || {}),
      params: {
        ...((apiExtraProps && apiExtraProps.params) || {}),
        ...(apiFilter || {}),
        query: apiSearch || null,
      },
    }),
    [],
  );

  const ProjectionListObject = useMemo(() => {
    const objectProjections = {};
    defaultProjections.forEach((item) => {
      objectProjections[item.slug] = item;
    });
    return objectProjections;
  }, [defaultProjections]);

  const SummarizeListObject = useMemo(() => {
    if (!summarizeList.length) return null;
    const objectSummarize = {};
    summarizeList.forEach((item) => {
      objectSummarize[item.slug] = item;
    });
    return objectSummarize;
  }, [summarizeList]);

  const FormatAndSetExecutedData = useCallback(
    (data, filterData) => {
      const localFuncFilters = filterData || filters;
      let columns = (
        localFuncFilters.summarize.length
          ? localFuncFilters.summarize
          : localFuncFilters.projection
      ).map((item, idx) => ({
        id: idx,
        isSortable: false,
        label: `${t(
          ProjectionListObject?.[item]?.title
            || SummarizeListObject[item]?.title
            || item.split('.')[1]
            || item,
        )}`,
        component: (option) => {
          const key = item.split('.')[item.split('.')?.length - 1]
            ? item.split('.')[item.split('.')?.length - 1]
            : item;
          const value = option?.summarize ? option?.summarize?.[key] : option?.[key];
          if (value && typeof value === 'object')
            if (Array.isArray(value)) return value;
            else
              return typeof value?.name === 'string'
                ? value.name
                : value.name?.[i18next.language] || value.name?.en || '';
          else if (
            typeof value === 'boolean'
            || typeof value === 'number'
            || typeof value === 'string'
          )
            return `${value}`;
        },
      }));

      if (localFuncFilters.summarize.length)
        columns.push({
          id: columns.length,
          isSortable: false,
          label: t('count'),
          input: 'count',
        });
      else if (!localFuncFilters.projection.length)
        columns = defaultProjections.map((it, idx) => ({
          id: idx,
          isSortable: false,
          label: it.title,
          input: it.slug.split('.')[it.slug.split('.').length - 1],
        }));
      // if (filters.feature === "applicant_job_stages") {
      //   const tempArray = Object.keys(data?.results?.[0] || {});
      //   const existingColumnsSet = new Set(
      //     defaultProjections
      //       .map((item) => item.slug.split('.')[item.slug.split('.').length - 1])
      //   );
      //   const newColumnsArray = tempArray
      //     .filter(value => !existingColumnsSet.has(value))
      //     .map(item => ({
      //       id: item,
      //       isSortable: false,
      //       label: item,
      //       input: item,
      //     }));
      //   columns = columns.filter((item) => tempArray.includes(item.input));
      //   columns.push(...newColumnsArray);
      // }
      if (
        localFuncFilters.pipeline_division
        && typeof data.results === 'object'
        && Object.keys(data.results).includes('Ratio')
      )
        setExecutedWidgetData({
          rows: [
            {
              ratio: data.results?.Ratio,
            },
          ],
          columns: [
            {
              id: 0,
              isSortable: false,
              label: t('ratio'),
              input: 'ratio',
            },
          ],
          total: 1,
        });
      else if (
        localFuncFilters.feature === 'pipeline'
        && !localFuncFilters.summarize?.length
      )
        setExecutedWidgetData({
          rows: data.results,
          columns: [
            {
              id: 0,
              isSortable: false,
              label: t('stage'),
              input: localFuncFilters.summarize?.length ? 'stage_uuid' : 'title',
            },
            {
              id: 1,
              isSortable: false,
              label: t('count'),
              input: 'count',
            },
          ],
          total: data.paginate?.total,
        });
      else
        setExecutedWidgetData({
          rows: data.results,
          columns,
          total: data.paginate?.total, // Check later
        });
    },
    [SummarizeListObject, ProjectionListObject, defaultProjections, filters, t],
  );

  const FeaturesListObject = useMemo(() => {
    let obj = {};
    featuresList.forEach((it) => {
      obj[it.slug] = it;
    });
    return obj;
  }, [featuresList]);

  const GetAllFeaturesListHandler = useCallback(async () => {
    setIsGeneralLoading(true);
    const response = await GetAllFeaturesList({});
    setIsGeneralLoading(false);
    if (response && response.status === 200) setFeaturesList(response.data.results);
    else {
      setFeaturesList([]);
      showError(t('Shared:failed-to-get-data'), response);
    }
  }, [t]);

  const GetDynamicAnalyticsHandler = useCallback(async () => {
    if (Object.keys(errors).length > 0) return;
    setIsExecute(false);
    setIsLoading(true);
    let filtersObj = {};
    filters.filterItems.forEach((it) => {
      filtersObj = {
        ...filtersObj,
        [it.slug]: it.value,
      };
    });

    let formattedContentFilter = {};
    filters.contentFilter.forEach((item) => {
      formattedContentFilter = {
        ...formattedContentFilter,
        [item.slug]: {
          type: item.type,
          operation: item.operation,
          value: item.value,
        },
      };
    });

    const response = await GetDynamicAnalytics({
      reportType: FeaturesListObject[filters.feature].path,
      filters: {
        summarize: filters.summarize.length > 0 ? filters.summarize : null,
        ...(filters.sort && { sort: filters.sort }),
        projection: filters.projection.length > 0 ? filters.projection : null,
        ...filtersObj,
        ...(filtersObj.match_job_uuid?.length && {
          match_job_uuid: filtersObj.match_job_uuid[0],
        }),
        from_date: filters.from_date || null,
        to_date: filters.to_date || null,
        page: filters.page,
        limit: filters.feature === 'pipeline' ? 1000000 : filters.limit,
        content:
          Object.keys(formattedContentFilter).length > 0
            ? formattedContentFilter
            : null,
        ...(filters.pipeline_division && {
          dividend_stage_uuid: filters.pipeline_division.dividend_stage_uuid,
          divisor_stage_uuid: filters.pipeline_division.divisor_stage_uuid,
        }),
        ...(filters.pipeline_origin_uuid && {
          pipeline_origin_uuid: filters.pipeline_origin_uuid,
        }),
        ...(filters.pipeline_company_uuid && {
          pipeline_company_uuid: filters.pipeline_company_uuid,
        }),
      },
    });

    if (response && response.status === 200) FormatAndSetExecutedData(response.data);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setExecutedWidgetData({
        columns: [],
        rows: [],
        total: 0,
      });
    }

    setIsLoading(false);
  }, [errors, filters, FeaturesListObject, FormatAndSetExecutedData, t]);

  const GetChartTypeHandler = useMemo(
    () =>
      Object.values(AnalyticsChartTypesEnum).find(
        (item) => widgetData.chart_type === item.value,
      ).icon,
    [widgetData],
  );

  const GetSummarizeHandler = useCallback(
    async (slug) => {
      setIsLoading(true);
      const response = await GetAllAnalyticsSummarizeDropdown({
        slug,
      });
      setIsLoading(false);
      if (response && response.status === 200)
        setSummarizeList(response.data.results);
      else {
        setSummarizeList([]);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [t],
  );

  const GetProjectionsHandler = useCallback(
    async (slug) => {
      const response = await GetAllAnalyticsProjectionDropdown({
        slug,
      });
      if (response && response.status === 200)
        setDefaultProjections(response.data.results);
      else {
        setDefaultProjections([]);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [t],
  );

  const GetFiltersHandler = useCallback(
    async (slug) => {
      const response = await GetAllAnalyticsFiltersDropdown({
        slug,
      });
      if (response && response.status === 200) setFiltersList(response.data.results);
      else {
        setFiltersList([]);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [t],
  );

  const GetFormContentHandler = useCallback(
    async (slug) => {
      const response = await GetAllAnalyticsOfferContentDropdown({
        slug,
      });
      if (response && response.status === 200)
        setDefaultFormContent(response.data.results);
      else {
        setDefaultFormContent([]);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [t],
  );

  const FormContentObject = useMemo(() => {
    let obj = {};
    defaultFormContent.forEach((item) => {
      obj[item.slug] = item;
    });
    return obj;
  }, [defaultFormContent]);

  const FiltersObject = useMemo(() => {
    let obj = {};
    filtersList.forEach((item) => {
      obj[item.slug] = item;
    });
    return obj;
  }, [filtersList]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          feature: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          summarize: yup
            .array()
            .of(
              yup.string().nullable().required(t('Shared:this-field-is-required')),
            ),
          filterItems: yup.array().of(
            yup.lazy((parentValue) =>
              yup.object().shape({
                slug: yup
                  .string()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                selectedJobData: yup
                  .object()
                  .nullable()
                  .when('slug', (value, schema) => {
                    if (value === 'stage_uuid')
                      return schema.required(t('this-field-is-required'));
                    return schema;
                  }),
                selectedPipeline: yup
                  .object()
                  .nullable()
                  .when('slug', (value, schema) => {
                    if (value === 'stage_uuid')
                      return schema.required(t('this-field-is-required'));
                    return schema;
                  }),
                value: yup.lazy(() => {
                  if (parentValue?.type === 'checkbox')
                    return yup
                      .boolean()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else if (parentValue?.type === 'number')
                    return yup
                      .number()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else if (parentValue?.type === 'date')
                    return yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required'));
                  else if (parentValue?.type === 'dropdown')
                    return yup
                      .array()
                      .nullable()
                      .min(1, t('this-field-is-required'))
                      .required(t('this-field-is-required'));
                  else if (parentValue?.type === 'static_dropdown')
                    return yup
                      .array()
                      .nullable()
                      .min(1, t('this-field-is-required'))
                      .required(t('this-field-is-required'));
                  else return yup.mixed();
                }),
              }),
            ),
          ),
          contentFilter: yup.array().of(
            yup.object().shape({
              slug: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              value: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
            }),
          ),
          projection: yup
            .array()
            .of(
              yup
                .string()
                .nullable()
                .min(1, t('this-field-is-required'))
                .required(t('Shared:this-field-is-required')),
            ),
        }),
      },
      filters,
    ).then((result) => {
      setErrors(result);
    });
  }, [filters, t]);

  const CloseWidgetSetupsHandler = useCallback(() => {
    setCurrentView((items) => ({
      ...items,
      view: 'dashboard',
      currentDashboard: {
        ...items.currentDashboard,
        widget_edit_data: undefined,
      },
    }));
    setWidgetData(widgetDataRef.current);
  }, [setCurrentView]);

  useEffect(() => {
    if (isExecute) GetDynamicAnalyticsHandler();
  }, [GetDynamicAnalyticsHandler, isExecute]);

  useEffect(() => {
    if (filters.feature) {
      GetProjectionsHandler(filters.feature);
      GetSummarizeHandler(filters.feature);
      GetFiltersHandler(filters.feature);

      if (filters.feature === 'form_builder' || filters.feature === 'form_template')
        GetFormContentHandler(filters.feature);
    }
  }, [
    filters.feature,
    GetProjectionsHandler,
    GetFormContentHandler,
    GetSummarizeHandler,
    GetFiltersHandler,
  ]);

  useEffect(() => {
    if (currentView?.currentDashboard?.widget_edit_data && isMountedRef.current) {
      const { title, description, chart_type, feature, payload }
        = currentView.currentDashboard.widget_edit_data;
      setWidgetData({
        title,
        description,
        chart_type,
      });
      const contentArray = Object.keys(payload.content || {}).map((item) => ({
        ...payload.content[item],
        slug: item,
      }));
      const filterData = {
        feature,
        summarize: payload.summarize || [],
        projection: payload.projection || [],
        page: payload.page,
        limit: payload.limit,
        filterItems: Object.keys(payload)
          .filter(
            (it) =>
              ![
                'summarize',
                'projection',
                'page',
                'limit',
                'from_date',
                'to_date',
                'content',
                'chart_type',
                'divisor_stage_uuid',
                'dividend_stage_uuid',
                'pipeline_origin_uuid',
                'pipeline_company_uuid',
                'sort',
              ].includes(it),
          )
          .map((filter) => ({
            slug: filter,
            value:
              filter === 'match_job_uuid' && payload[filter]
                ? [payload[filter]]
                : payload[filter],
          })),
        date_filter_type: 'default',
        content: payload.content,
        contentFilter: contentArray,
        pipeline_division:
          payload.divisor_stage_uuid && payload.dividend_stage_uuid
            ? {
              divisor_stage_uuid: payload.divisor_stage_uuid,
              dividend_stage_uuid: payload.dividend_stage_uuid,
            }
            : null,
        ...(payload.pipeline_origin_uuid && {
          pipeline_origin_uuid: payload.pipeline_origin_uuid,
        }),
        ...(payload.pipeline_company_uuid && {
          pipeline_company_uuid: payload.pipeline_company_uuid,
        }),
        ...(payload.sort && {
          sort: payload.sort,
        }),
      };
      setFilters(filterData);
      if (SummarizeListObject) {
        isMountedRef.current = false;
        FormatAndSetExecutedData(
          currentView.currentDashboard.widget_edit_data,
          filterData,
        );
      }
    }
  }, [FormatAndSetExecutedData, currentView, FiltersObject, SummarizeListObject]);

  useEffect(() => {
    GetAllFeaturesListHandler();
  }, [GetAllFeaturesListHandler]);

  // this to call errors updater when filters changed
  useEffect(() => {
    getErrors();
  }, [getErrors, filters]);

  return (
    <div className="job-post-details-tab-wrapper tab-content-wrapper d-flex-column-center w-100">
      <Backdrop
        className="spinner-wrapper"
        style={{ zIndex: 9999 }}
        open={isGeneralLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
      <div className="d-flex-v-center-h-between w-100 px-4 pt-4">
        <ButtonBase
          className="btns theme-transparent mx-3"
          onClick={() => CloseWidgetSetupsHandler()}
        >
          <span className="fas fa-arrow-left" />{' '}
          <span className="mx-2">{t('back-to-dashboard')}</span>
        </ButtonBase>
      </div>
      <div className="widget-setup-container w-100 p-4">
        <div
          className="m-2 widget-setup-side-container"
          style={{ border: '1px solid #f0f2f5', width: '25%' }}
        >
          {/* Feature */}
          <Accordion defaultExpanded elevation={0}>
            <AccordionSummary aria-controls="accordion" id="panel1a-header">
              {t('metric')}
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <SharedAutocompleteControl
                  disableClearable
                  title="metric"
                  searchKey="search"
                  placeholder="select-metric"
                  stateKey="feature"
                  editValue={filters.feature || ''}
                  errorPath="feature"
                  onValueChanged={(newValue) => {
                    setFilters((items) => ({
                      ...items,
                      feature: newValue.value || filters.feature,
                      summarize: [],
                      filterItems: [],
                      projection: [],
                      offerContent: {},
                      contentFilter: [],
                      page: 1,
                    }));
                    setExecutedWidgetData(executedWidgetDataInit.current);
                    setWidgetData((it) => ({
                      ...it,
                      chart_type: AnalyticsChartTypesEnum.TABLE.value,
                    }));
                    if (newValue.value === 'pipeline')
                      setIsPipelineFeatureOpen(true);
                  }}
                  parentTranslationPath={parentTranslationPath}
                  getOptionLabel={(option) =>
                    option.title[i18next.language] || option.title.en
                  }
                  uniqueKey="slug"
                  controlWrapperClasses="mx-2 px-0 mb-0"
                  errors={errors}
                  isSubmitted
                  isRequired
                  initValues={featuresList}
                  initValuesKey="slug"
                  initValuesTitle="title"
                  disabledOptions={(option) => option.is_disabled}
                  renderOption={(renderProps, option) => (
                    <TooltipsComponent
                      placement="right"
                      title={option.description}
                      contentComponent={
                        <li {...renderProps} key={option.slug}>
                          {option.title[i18next.language] || option.title.en}
                        </li>
                      }
                    />
                  )}
                  isDisabled={currentView?.currentDashboard?.widget_edit_data?.uuid}
                />
              </div>
            </AccordionDetails>
          </Accordion>
          {/* Group by */}
          <Accordion defaultExpanded elevation={0}>
            <AccordionSummary aria-controls="accordion" id="panel1a-header">
              <div className="d-flex-v-center-h-between">
                <div> {t('action')}</div>
                <ButtonBase
                  sx={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((item) => ({
                      ...item,
                      summarize: [...item.summarize, null],
                      page: 1,
                    }));
                  }}
                  className="btns-icon theme-transparent"
                  disabled={filters.summarize.length === 1}
                >
                  <PlusIcon />
                </ButtonBase>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div
                  className="d-flex-v-center-h-between p-2 mb-2"
                  style={{
                    border: '1px solid rgba(36, 37, 51, 0.06)',
                    borderRadius: '6px',
                  }}
                >
                  <span>{t('count')}</span>
                  <span className="mx-2">{t('total')}</span>
                  <div />
                </div>
                {!!filters.summarize?.length && (
                  <div
                    className="d-flex-v-center-h-between p-2 mb-2"
                    style={{
                      border: '1px solid rgba(36, 37, 51, 0.06)',
                      borderRadius: '6px',
                    }}
                  >
                    <span>{t('order')}</span>
                    <ButtonBase
                      className={`btns ${
                        filters.sort === 'ASC'
                          ? 'btn-primary-light'
                          : 'theme-transparent'
                      }`}
                      onClick={() =>
                        setFilters((items) => ({ ...items, sort: 'ASC' }))
                      }
                    >
                      <span>{t('ascending')}</span>
                    </ButtonBase>
                    <ButtonBase
                      className={`btns ${
                        filters.sort === 'DESC'
                          ? 'btn-primary-light'
                          : 'theme-transparent'
                      }`}
                      onClick={() =>
                        setFilters((items) => ({ ...items, sort: 'DESC' }))
                      }
                    >
                      <span>{t('descending')}</span>
                    </ButtonBase>
                  </div>
                )}
                {filters.summarize?.map((item, idx) => (
                  <div
                    className="d-flex-v-center-h-between p-2 mb-2"
                    style={{
                      border: '1px solid rgba(36, 37, 51, 0.06)',
                      borderRadius: '6px',
                    }}
                    key={`summarize-item-${idx}-${item}`}
                  >
                    <span>{t('group-by')}</span>
                    <div className="mx-2">
                      {/* TODO: Diana : change later to switch between text and drop down on edit mode */}
                      <SharedAutocompleteControl
                        isFullWidth
                        placeholder="select-group-by"
                        stateKey="summarize"
                        editValue={item || ''}
                        onValueChanged={(newValue) =>
                          setFilters((items) => {
                            let oldFilters = [...items.summarize];
                            oldFilters[idx] = newValue.value;
                            return {
                              ...items,
                              summarize: oldFilters,
                              page: 1,
                            };
                          })
                        }
                        parentTranslationPath={parentTranslationPath}
                        uniqueKey="slug"
                        controlWrapperClasses="mb-0"
                        extraProps={{
                          slug: filters.feature,
                        }}
                        isDisabled={!filters.feature}
                        errors={errors}
                        errorPath={`summarize[${idx}]`}
                        isSubmitted
                        initValues={summarizeList}
                        initValuesKey="slug"
                        initValuesTitle="title"
                      />
                    </div>
                    <ButtonBase
                      onClick={() =>
                        setFilters((items) => ({
                          ...items,
                          summarize: items.summarize.filter((it) => it !== item),
                          page: 1,
                        }))
                      }
                      className="btns-icon theme-transparent"
                    >
                      <span className="fas fa-times light-text-color" />
                    </ButtonBase>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
          {/* Filters */}
          <Accordion defaultExpanded elevation={0}>
            <AccordionSummary aria-controls="accordion" id="panel1a-header">
              <div className="d-flex-v-center-h-between">
                <div> {t('filters')}</div>
                <div className="d-flex-v-center-h-end">
                  {filters.feature === 'pipeline' && (
                    <ButtonBase
                      sx={{
                        pointerEvents: 'auto',
                        ...(!filters.filterItems?.length && {
                          borderColor: 'red!important',
                          color: 'red!important',
                          fontWeight: 'normal!important',
                        }),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPipelineFeatureOpen(true);
                      }}
                      className="btns theme-outline"
                    >
                      <span>{t('required-filters')}</span>
                    </ButtonBase>
                  )}
                  <ButtonBase
                    sx={{ pointerEvents: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters((item) => ({
                        ...item,
                        filterItems: [...item.filterItems, {}],
                        page: 1,
                      }));
                    }}
                    className="btns-icon theme-transparent"
                  >
                    <PlusIcon />
                  </ButtonBase>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {filters.filterItems?.map((item, idx) => (
                  <div
                    className="w-100 d-flex p-2 mb-2"
                    style={{
                      border: '1px solid rgba(36, 37, 51, 0.06)',
                      borderRadius: '6px',
                    }}
                    key={`filterItems-item-${idx}}`}
                  >
                    <div className="w-100">
                      <div className="d-flex-v-center-h-between mt-3 mx-3">
                        {/* TODO: Diana : change later to switch between text and drop down on edit mode */}
                        <SharedAutocompleteControl
                          isEntireObject
                          isFullWidth
                          placeholder="select-filter-by"
                          stateKey="filterItems"
                          editValue={item.slug || ''}
                          onValueChanged={(newValue) =>
                            setFilters((items) => {
                              let oldFilters = [...items.filterItems];
                              oldFilters[idx] = newValue.value || {};
                              oldFilters[idx].value = null;
                              return {
                                ...items,
                                filterItems: oldFilters,
                                page: 1,
                              };
                            })
                          }
                          // getDataAPI={GetAllAnalyticsFiltersDropdown}
                          parentTranslationPath={parentTranslationPath}
                          getOptionLabel={(option) => option.title}
                          uniqueKey="slug"
                          controlWrapperClasses="mb-0"
                          extraProps={{
                            slug: filters.feature,
                          }}
                          errors={errors}
                          errorPath={`filterItems[${idx}].slug`}
                          isSubmitted
                          initValues={filtersList}
                          initValuesKey="slug"
                          initValuesTitle="title"
                          disabledOptions={(option) =>
                            !!filters.filterItems?.find(
                              (it) => it?.slug === option?.slug,
                            )
                          }
                          isDisabled={
                            !!(
                              !filters.feature
                              || FiltersObject[item.slug]?.is_required
                            )
                          }
                        />
                      </div>
                      <div className="d-flex-v-center-h-between m-3">
                        {item.type && <div>{t('is')}</div>}
                        {FiltersObject[item.slug]?.type === 'dropdown' && (
                          <>
                            {(filters.feature === 'applicant_job_stages'
                              || filters.feature === 'applicant')
                            && FiltersObject[item.slug]?.slug === 'stage_uuid' ? (
                                <div className={'d-flex-column-center w-100'}>
                                  <SharedAPIAutocompleteControl
                                    isEntireObject={true}
                                    isFullWidth
                                    searchKey="search"
                                    placeholder="select-job"
                                    stateKey="selectedJobData"
                                    editValue={item?.selectedJobData?.uuid || null}
                                    onValueChanged={(newValue) => {
                                      setFilters((items) => {
                                        let oldFilters = [...items.filterItems];
                                        oldFilters[idx] = {
                                          ...oldFilters[idx],
                                          selectedJobData: newValue.value,
                                          value: [],
                                          selectedPipeline: null,
                                        };
                                        return {
                                          ...items,
                                          filterItems: oldFilters,
                                          page: 1,
                                        };
                                      });
                                    }}
                                    getDataAPI={DynamicService}
                                    getAPIProperties={
                                      getDynamicServicePropertiesHandler
                                    }
                                    extraProps={{
                                      path: FiltersObject[item.slug]?.options
                                        ?.end_point,
                                      method:
                                      FiltersObject[item.slug]?.options?.method,
                                      params: {
                                        is_python:
                                        FiltersObject[item.slug]?.options?.is_python,
                                        with_than: item?.selectedJobData?.uuid
                                          ? [item.selectedJobData.uuid]
                                          : [],
                                      },
                                      ...(filters.pipeline_company_uuid && {
                                        headers: {
                                          'Accept-Company':
                                          filters.pipeline_company_uuid,
                                        },
                                      }),
                                    }}
                                    parentTranslationPath={parentTranslationPath}
                                    getOptionLabel={(option) =>
                                      option.value
                                    || (option.title
                                      && (typeof option.title === 'object'
                                        ? option.title[i18next.language]
                                          || option.title.en
                                        : option.title))
                                    || option.block_number
                                    || (option.name
                                      && (typeof option.name === 'object'
                                        ? option.name[i18next.language]
                                          || option.name.en
                                        : option.name))
                                    // this case is for vacant_uuid
                                    || (option.position_name
                                      && (typeof option.position_name === 'object'
                                        ? option.position_name[i18next.language]
                                          || option.position_name.en
                                        : option.position_name))
                                    || `${
                                      option.first_name
                                      && (option.first_name[i18next.language]
                                        || option.first_name.en)
                                    }${
                                      option.last_name
                                      && ` ${
                                        option.last_name[i18next.language]
                                        || option.last_name.en
                                      }`
                                    }`
                                    }
                                    type={DynamicFormTypesEnum.select.key}
                                    errors={errors}
                                    errorPath={`filterItems[${idx}].selectedJobData`}
                                    isSubmitted
                                    uniqueKey={
                                      FiltersObject[item.slug]?.options?.primary_key
                                    }
                                    dataKey={
                                      FiltersObject[item.slug]?.options?.data_key
                                    }
                                    isDisabled={
                                      !!(
                                        !filters.feature
                                      || FiltersObject[item.slug]?.is_required
                                      )
                                    }
                                  />
                                  <SharedAutocompleteControl
                                    isEntireObject
                                    isFullWidth
                                    placeholder="select-pipeline"
                                    stateKey="currentPipeline"
                                    editValue={item?.selectedPipeline?.uuid || null}
                                    onValueChanged={(newValue) =>
                                      setFilters((items) => {
                                        let oldFilters = [...items.filterItems];
                                        oldFilters[idx] = {
                                          ...oldFilters[idx],
                                          selectedPipeline: newValue.value,
                                          value: null,
                                        };
                                        return {
                                          ...items,
                                          filterItems: oldFilters,
                                          page: 1,
                                        };
                                      })
                                    }
                                    // getDataAPI={GetAllAnalyticsFiltersDropdown}
                                    parentTranslationPath={parentTranslationPath}
                                    getOptionLabel={(option) => option.title}
                                    uniqueKey="uuid"
                                    controlWrapperClasses="mb-0"
                                    errors={errors}
                                    errorPath={`filterItems[${idx}].selectedPipeline`}
                                    isSubmitted
                                    initValues={item?.selectedJobData?.pipelines || []}
                                    initValuesKey="uuid"
                                    initValuesTitle="title"
                                    disabledOptions={(option) =>
                                      !!filters.filterItems?.find(
                                        (it) => it?.slug === option?.slug,
                                      )
                                    }
                                    isDisabled={
                                      !(item?.selectedJobData?.pipelines?.length > 0)
                                    }
                                  />
                                  <SharedAutocompleteControl
                                    isFullWidth
                                    placeholder="stage"
                                    type={DynamicFormTypesEnum.array.key}
                                    stateKey="currentStage"
                                    editValue={item?.value || []}
                                    onValueChanged={(newValue) =>
                                      setFilters((items) => {
                                        let oldFilters = [...items.filterItems];
                                        oldFilters[idx] = {
                                          ...oldFilters[idx],
                                          value: newValue.value,
                                        };
                                        return {
                                          ...items,
                                          filterItems: oldFilters,
                                          page: 1,
                                        };
                                      })
                                    }
                                    // getDataAPI={GetAllAnalyticsFiltersDropdown}
                                    parentTranslationPath={parentTranslationPath}
                                    getOptionLabel={(option) => option.title}
                                    uniqueKey="uuid"
                                    errors={errors}
                                    errorPath={`filterItems[${idx}].value`}
                                    isSubmitted
                                    initValues={item?.selectedPipeline?.stages || []}
                                    initValuesKey="uuid"
                                    initValuesTitle="title"
                                    disabledOptions={(option) =>
                                      !!filters.filterItems?.find(
                                        (it) => it?.slug === option?.slug,
                                      )
                                    }
                                    isDisabled={
                                      !(item?.selectedPipeline?.stages.length > 0)
                                    }
                                  />
                                </div>
                              ) : (
                                <SharedAPIAutocompleteControl
                                  max={item.slug === 'match_job_uuid' && 1}
                                  isFullWidth
                                  searchKey="search"
                                  placeholder="select-filter-value"
                                  stateKey="filterItems"
                                  editValue={item?.value || []}
                                  onValueChanged={(newValue) => {
                                    if (
                                      !(
                                        filters.feature === 'pipeline'
                                      && newValue.value.length === 0
                                      && (item.slug === 'job_uuid'
                                        || item.slug === 'ats_job_pipelines_uuid')
                                      )
                                    )
                                      setFilters((items) => {
                                        let oldFilters = [...items.filterItems];
                                        oldFilters[idx].value = newValue.value;
                                        return {
                                          ...items,
                                          filterItems: oldFilters,
                                          page: 1,
                                        };
                                      });
                                  }}
                                  getDataAPI={DynamicService}
                                  getAPIProperties={getDynamicServicePropertiesHandler}
                                  extraProps={{
                                    path: FiltersObject[item.slug]?.options?.end_point,
                                    method: FiltersObject[item.slug]?.options?.method,
                                    params: {
                                      is_python:
                                      FiltersObject[item.slug]?.options?.is_python,
                                      with_than: item?.value ? item.value : [],
                                      ...(item.slug === 'ats_job_pipelines_uuid' && {
                                        uuid:
                                        filters.filterItems?.find(
                                          (it) => it.slug === 'job_uuid',
                                        )?.value?.[0] || null,
                                      }),
                                      ...(item.slug === 'stage_uuid' && {
                                        uuid: filters.pipeline_origin_uuid || null,
                                      }),
                                    },
                                    ...(filters.pipeline_company_uuid && {
                                      headers: {
                                        'Accept-Company':
                                        filters.pipeline_company_uuid,
                                      },
                                    }),
                                  }}
                                  parentTranslationPath={parentTranslationPath}
                                  getOptionLabel={(option) =>
                                    option.value
                                  || (option.title
                                    && (typeof option.title === 'object'
                                      ? option.title[i18next.language]
                                        || option.title.en
                                      : option.title))
                                  || option.block_number
                                  || (option.name
                                    && (typeof option.name === 'object'
                                      ? option.name[i18next.language]
                                        || option.name.en
                                      : option.name))
                                  // this case is for vacant_uuid
                                  || (option.position_name
                                    && (typeof option.position_name === 'object'
                                      ? option.position_name[i18next.language]
                                        || option.position_name.en
                                      : option.position_name))
                                  || `${
                                    option.first_name
                                    && (option.first_name[i18next.language]
                                      || option.first_name.en)
                                  }${
                                    option.last_name
                                    && ` ${
                                      option.last_name[i18next.language]
                                      || option.last_name.en
                                    }`
                                  }`
                                  }
                                  controlWrapperClasses="mb-0 ml-2"
                                  type={DynamicFormTypesEnum.array.key}
                                  errors={errors}
                                  errorPath={`filterItems[${idx}].value`}
                                  isSubmitted
                                  uniqueKey={
                                    FiltersObject[item.slug]?.options?.primary_key
                                  }
                                  dataKey={FiltersObject[item.slug]?.options?.data_key}
                                  isDisabled={
                                    !!(
                                      !filters.feature
                                    || FiltersObject[item.slug]?.is_required
                                    )
                                  }
                                />
                              )}
                          </>
                        )}
                        {FiltersObject[item.slug]?.type === 'static_dropdown' && (
                          <SharedAutocompleteControl
                            isFullWidth
                            stateKey="filterItems"
                            placeholder="select-filter-value"
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.filterItems];
                                oldFilters[idx].value = newValue.value;
                                return {
                                  ...items,
                                  filterItems: oldFilters,
                                  page: 1,
                                };
                              })
                            }
                            initValues={FiltersObject[item.slug]?.options.values}
                            editValue={item?.value || []}
                            parentTranslationPath={parentTranslationPath}
                            type={DynamicFormTypesEnum.array.key}
                            uniqueKey={FiltersObject[item.slug]?.options.primary_key}
                            getOptionLabel={(option) =>
                              option.value
                              || (option.title
                                && (option.title[i18next.language]
                                  || option.title.en))
                              || (option.name
                                && (option.name[i18next.language] || option.name.en))
                              || `${
                                option.first_name
                                && (option.first_name[i18next.language]
                                  || option.first_name.en)
                              }${
                                option.last_name
                                && ` ${
                                  option.last_name[i18next.language]
                                  || option.last_name.en
                                }`
                              }`
                            }
                            errors={errors}
                            errorPath={`filterItems[${idx}].value`}
                            isSubmitted
                            isDisabled={
                              !!(
                                !filters.feature
                                || FiltersObject[item.slug]?.is_required
                              )
                            }
                          />
                        )}
                        {FiltersObject[item.slug]?.type === 'checkbox' && (
                          <RadiosComponent
                            idRef={`fitler-value-${idx}`}
                            name="filterValue"
                            labelInput="value"
                            valueInput="key"
                            value={item.value}
                            data={[
                              {
                                key: true,
                                value: 'yes',
                              },
                              {
                                key: false,
                                value: 'no',
                              },
                            ]}
                            parentTranslationPath={parentTranslationPath}
                            onSelectedRadioChanged={(e, value) => {
                              setFilters((items) => {
                                let oldFilters = [...items.filterItems];
                                oldFilters[idx].value = value === 'true';
                                return {
                                  ...items,
                                  filterItems: oldFilters,
                                  page: 1,
                                };
                              });
                            }}
                            helperText={
                              errors?.[`filterItems[${idx}].value`]?.message
                            }
                            error={errors?.[`filterItems[${idx}].value`]?.error}
                            isSubmitted
                            isDisabled={
                              !!(
                                !filters.feature
                                || FiltersObject[item.slug]?.is_required
                              )
                            }
                          />
                        )}
                        {FiltersObject[item.slug]?.type === 'date' && (
                          <div className="w-100 px-2">
                            <Datepicker
                              isSubmitted
                              stateKey="value"
                              // errorPath={`rms_filters[${idx}].value`}
                              placeholder="filter-value"
                              // isSubmitted={isSubmitted}
                              value={item.value || ''}
                              onChange={(date) => {
                                setFilters((items) => {
                                  let oldFilters = [...items.filterItems];
                                  oldFilters[idx].value
                                    = date !== 'Invalid date' ? date : null;
                                  return {
                                    ...items,
                                    filterItems: oldFilters,
                                    page: 1,
                                  };
                                });
                              }}
                              parentTranslationPath={parentTranslationPath}
                              wrapperClasses="p-0"
                              inputPlaceholder="YYYY-MM-DD"
                              helperText={
                                (errors?.[`filterItems[${idx}].value`]
                                  && errors?.[`filterItems[${idx}].value`]?.message)
                                || undefined
                              }
                              error={
                                (errors?.[`filterItems[${idx}].value`]
                                  && errors?.[`filterItems[${idx}].value`]?.error)
                                || false
                              }
                              isDisabled={
                                !!(
                                  !filters.feature
                                  || FiltersObject[item.slug]?.is_required
                                )
                              }
                            />
                          </div>
                        )}
                        {/* Array of strings */}
                        {FiltersObject[item.slug]?.type === 'string' && (
                          <SharedAutocompleteControl
                            placeholder="press-enter-to-add"
                            title="filter-value"
                            // title="condition"
                            isFreeSolo
                            stateKey="value"
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.filterItems];
                                oldFilters[idx].value = newValue.value;
                                return {
                                  ...items,
                                  filterItems: oldFilters,
                                  page: 1,
                                };
                              })
                            }
                            type={DynamicFormTypesEnum.array.key}
                            parentTranslationPath={parentTranslationPath}
                            isFullWidth
                            editValue={item.value || []}
                            sharedClassesWrapper="mb-0 ml-2"
                            errors={errors}
                            errorPath={`filterItems[${idx}].value`}
                            isSubmitted
                            isDisabled={
                              !!(
                                !filters.feature
                                || FiltersObject[item.slug]?.is_required
                              )
                            }
                          />
                        )}
                        {FiltersObject[item.slug]?.type === 'number' && (
                          <SharedInputControl
                            isFullWidth
                            title="filter-value"
                            stateKey="value"
                            searchKey="search"
                            placeholder="filter-value"
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.filterItems];
                                oldFilters[idx].value = newValue.value;
                                return {
                                  ...items,
                                  filterItems: oldFilters,
                                  page: 1,
                                };
                              })
                            }
                            parentTranslationPath={parentTranslationPath}
                            editValue={item.value || ''}
                            isSubmitted
                            errors={errors}
                            // pattern={numbersExpression}
                            type="number"
                            wrapperClasses="mb-0 ml-2"
                            errorPath={`filterItems[${idx}].value`}
                            isDisabled={
                              !!(
                                !filters.feature
                                || FiltersObject[item.slug]?.is_required
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <ButtonBase
                      onClick={() =>
                        setFilters((items) => ({
                          ...items,
                          filterItems: items.filterItems.filter((it) => it !== item),
                          page: 1,
                        }))
                      }
                      className="btns-icon theme-transparent mt-3"
                      disabled={FiltersObject[item.slug]?.is_required}
                    >
                      <span className="fas fa-times light-text-color" />
                    </ButtonBase>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
          {/* FormBuilder */}
          {(filters.feature === 'form_builder'
            || filters.feature === 'form_template') && (
            <Accordion defaultExpanded elevation={0}>
              <AccordionSummary aria-controls="accordion" id="panel1a-header">
                <div className="d-flex-v-center-h-between">
                  <div> {t('form-builder')}</div>
                  <ButtonBase
                    sx={{ pointerEvents: 'auto' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters((items) => ({
                        ...items,
                        contentFilter: [
                          ...items.contentFilter,
                          { type: '', operation: 'equal', value: null, slug: '' },
                        ],
                      }));
                    }}
                    className="btns-icon theme-transparent"
                  >
                    <PlusIcon />
                  </ButtonBase>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  {filters.contentFilter?.map((item, idx) => (
                    <div
                      className="w-100 d-flex p-2 mb-2"
                      style={{
                        border: '1px solid rgba(36, 37, 51, 0.06)',
                        borderRadius: '6px',
                      }}
                      key={`contentFilter-item-${idx}}`}
                    >
                      <div className="w-100">
                        <div className="d-flex-v-center-h-between mt-3">
                          <SharedAutocompleteControl
                            isEntireObject
                            isFullWidth
                            placeholder="select-offer-content"
                            stateKey="offerContent"
                            editValue={item.slug || ''}
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.contentFilter];
                                oldFilters[idx].slug = newValue.value?.slug || '';
                                oldFilters[idx].operation
                                  = AnalyticsContentOfferOperationEnum.is.value;
                                oldFilters[idx].options = newValue.value?.options;
                                if (
                                  newValue.value?.options
                                  && Object.keys(newValue.value?.options).length
                                )
                                  oldFilters[idx].type
                                    = AnalyticsContentOfferInputEnum.Dropdown.value;
                                else
                                  oldFilters[idx].type
                                    = AnalyticsContentOfferInputEnum.Text.value;
                                oldFilters[idx].value = null;
                                return {
                                  ...items,
                                  contentFilter: oldFilters,
                                };
                              })
                            }
                            parentTranslationPath={parentTranslationPath}
                            // getOptionLabel={(option) => option.title}
                            uniqueKey="slug"
                            controlWrapperClasses="mb-0"
                            errors={errors}
                            errorPath={`contentFilter[${idx}].slug`}
                            isSubmitted
                            initValues={defaultFormContent}
                            initValuesKey="slug"
                            initValuesTitle="title"
                          />
                        </div>
                        <div className="d-flex-v-center-h-between mt-3">
                          <ButtonBase
                            className="btns btn-outline-light theme-outline w-50"
                            onClick={(e) => {
                              setPopoverContentOffer(e.target);
                              setSelectedContentFilter({ item, idx });
                            }}
                          >
                            <span className="mx-2 py-2">
                              {t(filters.contentFilter[idx].type) || t('type')}
                            </span>
                          </ButtonBase>
                          {filters.contentFilter[idx].type && (
                            <ButtonBase
                              className="btns btn-outline-light theme-outline w-50"
                              onClick={(e) => {
                                if (
                                  filters.contentFilter[idx].type
                                  === AnalyticsContentOfferInputEnum.Number.value
                                ) {
                                  setPopoverContentOfferOperation(e.target);
                                  setSelectedContentFilter({ item, idx });
                                }
                              }}
                            >
                              {(filters.contentFilter[idx].type
                                === AnalyticsContentOfferInputEnum.Text.value
                                || filters.contentFilter[idx].type
                                  === AnalyticsContentOfferInputEnum.Dropdown.value) && (
                                <span className="mx-2 py-2">{t('equal')}</span>
                              )}
                              {filters.contentFilter[idx].type
                                === AnalyticsContentOfferInputEnum.Number.value && (
                                <span className="mx-2 py-2">
                                  {t(filters.contentFilter[idx].operation)}
                                </span>
                              )}
                            </ButtonBase>
                          )}
                        </div>
                        {filters.contentFilter[idx].type
                          === AnalyticsContentOfferInputEnum.Text.value && (
                          <SharedInputControl
                            isFullWidth
                            title="offer-content-value"
                            stateKey="value"
                            searchKey="search"
                            placeholder="offer-content-value"
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.contentFilter];
                                oldFilters[idx].value = newValue.value || '';
                                return {
                                  ...items,
                                  contentFilter: oldFilters,
                                };
                              })
                            }
                            parentTranslationPath={parentTranslationPath}
                            editValue={item.value || ''}
                            wrapperClasses="mt-3"
                            errors={errors}
                            errorPath={`contentFilter[${idx}].value`}
                            isSubmitted
                          />
                        )}
                        {filters.contentFilter[idx].type
                          === AnalyticsContentOfferInputEnum.Number.value && (
                          <SharedInputControl
                            isFullWidth
                            title="offer-content-value"
                            stateKey="value"
                            searchKey="search"
                            placeholder="offer-content-value"
                            onValueChanged={(newValue) =>
                              setFilters((items) => {
                                let oldFilters = [...items.contentFilter];
                                oldFilters[idx].value = newValue.value || '';
                                return {
                                  ...items,
                                  contentFilter: oldFilters,
                                };
                              })
                            }
                            parentTranslationPath={parentTranslationPath}
                            editValue={item.value || ''}
                            pattern={numbersExpression}
                            type="number"
                            wrapperClasses="mt-3"
                            errors={errors}
                            errorPath={`contentFilter[${idx}].value`}
                            isSubmitted
                          />
                        )}
                        {filters.contentFilter[idx].type
                          === AnalyticsContentOfferInputEnum.Dropdown.value
                          && FormContentObject[item.slug]?.options && (
                          <SharedAPIAutocompleteControl
                            disableClearable
                            isFullWidth
                            searchKey="search"
                            placeholder="offer-content-value"
                            stateKey="value"
                            editValue={item?.value || []}
                            onValueChanged={(newValue) => {
                              if (newValue.value)
                                setFilters((items) => {
                                  let oldFilters = [...items.contentFilter];
                                  oldFilters[idx].value = newValue.value || '';
                                  return {
                                    ...items,
                                    contentFilter: oldFilters,
                                  };
                                });
                            }}
                            getDataAPI={DynamicService}
                            getAPIProperties={getDynamicServicePropertiesHandler}
                            extraProps={{
                              path: FormContentObject[item.slug].options.end_point,
                              method: FormContentObject[item.slug].options?.method,
                              params: {
                                with_than: item?.value ? [item.value] : null,
                              },
                            }}
                            parentTranslationPath={parentTranslationPath}
                            getOptionLabel={(option) =>
                              option.value
                                || (option.title
                                  && (typeof option.title === 'object'
                                    ? option.title[i18next.language]
                                      || option.title.en
                                    : option.title))
                                || (option.name
                                  && (option.name[i18next.language]
                                    || option.name.en))
                                || `${
                                  option.first_name
                                  && (option.first_name[i18next.language]
                                    || option.first_name.en)
                                }${
                                  option.last_name
                                  && ` ${
                                    option.last_name[i18next.language]
                                    || option.last_name.en
                                  }`
                                }`
                            }
                            controlWrapperClasses="my-2"
                            isDisabled={!filters.feature}
                            type={DynamicFormTypesEnum.select.key}
                            errors={errors}
                            errorPath={`contentFilter[${idx}].value`}
                            isSubmitted
                            uniqueKey={
                              FormContentObject[item.slug].options.primary_key
                            }
                          />
                        )}
                      </div>
                      <ButtonBase
                        onClick={() =>
                          setFilters((items) => ({
                            ...items,
                            contentFilter: items.contentFilter.filter(
                              (it, index) => index !== idx,
                            ),
                          }))
                        }
                        className="btns-icon theme-transparent mt-3"
                      >
                        <span className="fas fa-times light-text-color" />
                      </ButtonBase>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
          {filters.feature === 'pipeline' && (
            <Accordion defaultExpanded elevation={0}>
              <AccordionSummary aria-controls="accordion" id="panel1a-header">
                <div className="d-flex-v-center-h-between">
                  <div> {t('pipeline-division')}</div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <div className="c-gray-primary px-1 pb-3">
                    {t('pipeline-division-desc')}
                  </div>
                  <div
                    className="w-100 d-flex-column-center p-2"
                    style={{
                      border: '1px solid rgba(36, 37, 51, 0.06)',
                      borderRadius: '6px',
                    }}
                  >
                    <SharedAPIAutocompleteControl
                      title={t('dividend-stage')}
                      isFullWidth
                      searchKey="search"
                      placeholder="dividend-stage"
                      stateKey="dividend_stage_uuid"
                      onValueChanged={(newValue) => {
                        setFilters((items) => ({
                          ...items,
                          pipeline_division: {
                            ...items.pipeline_division,
                            dividend_stage_uuid: newValue.value,
                          },
                        }));
                      }}
                      editValue={filters.pipeline_division?.dividend_stage_uuid}
                      getDataAPI={GetAllEvaRecPipelineStages}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) => option.title}
                      controlWrapperClasses="mb-0 m-2"
                      extraProps={{
                        uuid: filters.pipeline_origin_uuid,
                        ...(filters.pipeline_division?.dividend_stage_uuid && {
                          with_than: [filters.pipeline_division.dividend_stage_uuid],
                        }),
                        ...(filters.pipeline_company_uuid && {
                          company_uuid: filters.pipeline_company_uuid,
                        }),
                      }}
                      isDisabled={!filters.feature}
                      errors={{
                        ...(!filters.pipeline_division?.dividend_stage_uuid
                          && filters.pipeline_division?.divisor_stage_uuid && {
                          title: {
                            error: true,
                            message: t('this-field-is-required'),
                          },
                        }),
                      }}
                      errorPath="dividend_stage_uuid"
                      isSubmitted
                      dataKey="stages"
                    />
                    <div className="separator-h my-1" />
                    <SharedAPIAutocompleteControl
                      title={t('divisor-stage')}
                      isFullWidth
                      searchKey="search"
                      placeholder="divisor-stage"
                      stateKey="divisor_stage_uuid"
                      onValueChanged={(newValue) => {
                        setFilters((items) => ({
                          ...items,
                          pipeline_division: {
                            ...items.pipeline_division,
                            divisor_stage_uuid: newValue.value,
                          },
                        }));
                      }}
                      editValue={filters.pipeline_division?.divisor_stage_uuid}
                      getDataAPI={GetAllEvaRecPipelineStages}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) => option.title}
                      controlWrapperClasses="mb-0 m-2"
                      extraProps={{
                        uuid: filters.pipeline_origin_uuid,
                        ...(filters.pipeline_division?.divisor_stage_uuid && {
                          with_than: [filters.pipeline_division.divisor_stage_uuid],
                        }),
                        ...(filters.pipeline_company_uuid && {
                          company_uuid: filters.pipeline_company_uuid,
                        }),
                      }}
                      isDisabled={!filters.feature}
                      errors={{
                        ...(filters.pipeline_division?.dividend_stage_uuid
                          && !filters.pipeline_division?.divisor_stage_uuid && {
                          title: {
                            error: true,
                            message: t('this-field-is-required'),
                          },
                        }),
                      }}
                      errorPath="dividend_stage_uuid"
                      isSubmitted
                      dataKey="stages"
                    />
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )}
          <PopoverComponent
            idRef="offer-content-ref"
            attachedWith={popoverContentOffer}
            handleClose={() => {
              setPopoverContentOffer(null);
              setSelectedContentFilter(null);
            }}
            component={
              <div className="d-flex-column p-2 w-100">
                {Object.values(AnalyticsContentOfferInputEnum)
                  .filter(
                    (it) =>
                      (it.value === AnalyticsContentOfferInputEnum.Dropdown.value
                        && Object.keys(
                          filters.contentFilter[selectedContentFilter?.idx]
                            ?.options || {},
                        ).length > 0)
                      || (it.value !== AnalyticsContentOfferInputEnum.Dropdown.value
                        && Object.keys(
                          filters.contentFilter[selectedContentFilter?.idx]
                            ?.options || {},
                        ).length === 0),
                  )
                  .map((offerContentType, idx) => (
                    <ButtonBase
                      key={`${idx}-${offerContentType.key}-popover-chartType`}
                      className="btns theme-transparent m-2"
                      onClick={() => {
                        setFilters((items) => {
                          let oldFilters = [...items.contentFilter];
                          oldFilters[selectedContentFilter.idx].type
                            = offerContentType.value;
                          oldFilters[selectedContentFilter.idx].value = null;
                          return {
                            ...items,
                            contentFilter: oldFilters,
                          };
                        });
                        setPopoverContentOffer(null);
                      }}
                      style={{ justifyContent: 'start' }}
                    >
                      <span className="px-2 mx-2">{t(offerContentType.value)}</span>
                    </ButtonBase>
                  ))}
              </div>
            }
          />
          <PopoverComponent
            idRef="offer-content-operation-ref"
            attachedWith={popoverContentOfferOperation}
            handleClose={() => {
              setPopoverContentOfferOperation(null);
              setSelectedContentFilter(null);
            }}
            component={
              <div className="d-flex-column p-2 w-100">
                {Object.values(AnalyticsContentOfferOperationEnum).map(
                  (offerContentOperation, idx) => (
                    <ButtonBase
                      key={`${idx}-${offerContentOperation.key}-popover-offerContentOperation`}
                      className="btns theme-transparent m-2"
                      onClick={() => {
                        setFilters((items) => {
                          let oldFilters = [...items.contentFilter];
                          oldFilters[selectedContentFilter.idx].operation
                            = offerContentOperation.value;
                          return {
                            ...items,
                            contentFilter: oldFilters,
                          };
                        });
                        setPopoverContentOfferOperation(null);
                      }}
                      style={{ justifyContent: 'start' }}
                    >
                      <span className="px-2 mx-2">
                        {t(offerContentOperation.label)}
                      </span>
                    </ButtonBase>
                  ),
                )}
              </div>
            }
          />
          {/* Breakdown (projection) */}
          <Accordion
            defaultExpanded
            elevation={0}
            disabled={!!FeaturesListObject?.[filters.feature]?.breakdown_disable}
          >
            <AccordionSummary aria-controls="accordion" id="panel1a-header">
              <div className="d-flex-v-center-h-between">
                <div> {t('breakdown')}</div>
                <ButtonBase
                  sx={{ pointerEvents: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((item) => ({
                      ...item,
                      projection: [...item.projection, ''],
                      page: 1,
                    }));
                  }}
                  className="btns-icon theme-transparent"
                  disabled={
                    !!FeaturesListObject?.[filters.feature]?.breakdown_disable
                  }
                >
                  <PlusIcon />
                </ButtonBase>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                {filters.projection?.map((item, idx) => (
                  <div
                    className="d-flex-v-center-h-between p-2 mb-2"
                    style={{
                      border: '1px solid rgba(36, 37, 51, 0.06)',
                      borderRadius: '6px',
                    }}
                    key={`projection-item-${idx}-${item}`}
                  >
                    {/* TODO: Diana : change later to switch between text and drop down on edit mode */}
                    <SharedAPIAutocompleteControl
                      isFullWidth
                      searchKey="search"
                      placeholder="select-breakdown-by"
                      stateKey="projection"
                      editValue={item || ''}
                      onValueChanged={(newValue) =>
                        setFilters((items) => {
                          let oldFilters = [...items.projection];
                          oldFilters[idx] = newValue.value;
                          return {
                            ...items,
                            projection: oldFilters,
                            page: 1,
                          };
                        })
                      }
                      getDataAPI={GetAllAnalyticsProjectionDropdown}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) => option.title}
                      uniqueKey="slug"
                      controlWrapperClasses="mb-0 m-2"
                      extraProps={{
                        slug: filters.feature,
                      }}
                      isDisabled={!filters.feature}
                      errors={errors}
                      errorPath={`projection[${idx}]`}
                      isSubmitted
                      getDisabledOptions={(option) =>
                        !!filters.projection?.find((it) => it === option?.slug)
                      }
                    />
                    <ButtonBase
                      onClick={() =>
                        setFilters((items) => ({
                          ...items,
                          projection: items.projection.filter((it) => it !== item),
                          page: 1,
                        }))
                      }
                      className="btns-icon theme-transparent"
                    >
                      <span className="fas fa-times light-text-color" />
                    </ButtonBase>
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* widget result*/}
        <div
          className="m-2 p-4 widget-setup-main-side-container"
          style={{ border: '1px solid #f0f2f5', width: '75%' }}
        >
          <div className="widget-setup-result-actions my-4">
            <SharedInputControl
              isHalfWidth
              idRef="customDashboardNameRef"
              placeholder={t('enter-set-name')}
              stateKey="title"
              onValueChanged={(newValue) => {
                setWidgetData((items) => ({
                  ...items,
                  title: newValue.value,
                }));
              }}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="mb-0 px-0"
              editValue={
                widgetData.title === 'Untitled widget'
                  ? `${t('untitled-widget')}`
                  : widgetData.title
              }
              errors={{
                ...(!widgetData.title && {
                  title: {
                    error: true,
                    message: t('this-field-is-required'),
                  },
                }),
              }}
              errorPath="title"
              isSubmitted
            />
            <div className="d-flex-v-center-h-end">
              <TooltipsComponent
                title={filters.feature === 'pipeline' && t('cannot-export-pipeline')}
                contentComponent={
                  <ButtonBase
                    className="btns btn-outline-light theme-outline"
                    onClick={() => setShowExportDialog(true)}
                    disabled={
                      Object.keys(errors).length > 0
                      || filters.feature === 'pipeline'
                    }
                  >
                    <DownArrowLongIcon />
                    <span className="mx-2 py-2">{t('export')}</span>
                  </ButtonBase>
                }
              />
              <ButtonBase
                className="btns btn-outline-light theme-outline"
                onClick={() => CloseWidgetSetupsHandler()}
              >
                <span className="mx-2 py-2">{t('close')}</span>
              </ButtonBase>
              {/* TODO : Diana : ADD tooltip to let the user know that he cannot add tables to dashboards without group by value */}
              <ButtonBase
                className="btns btn-primary-light theme-primary"
                onClick={() => SaveCustomDashboardWidgetHandler()}
                disabled={
                  (widgetData.chart_type === AnalyticsChartTypesEnum.TABLE.value
                    && !filters.summarize?.length)
                  || Object.keys(errors).length > 0
                  || !widgetData.title
                  || (filters.feature === 'pipeline' && filters.filterItems?.length < 2)
                }
              >
                {currentView?.currentDashboard?.widget_edit_data?.uuid ? (
                  <span className="mx-2 py-2">{t('save')}</span>
                ) : (
                  <span className="mx-2 py-2">{t('save-and-add')}</span>
                )}
              </ButtonBase>
            </div>
            <ExportDialog
              isOpen={showExportDialog}
              setIsOpen={setShowExportDialog}
              isLoading={isLoading}
              setFilters={setFilters}
              filters={filters}
              parentTranslationPath={parentTranslationPath}
              defaultProjections={defaultProjections}
              FeaturesListObject={FeaturesListObject}
            />
          </div>
          <div className=" d-flex-v-center-h-between">
            <div className="d-flex-v-center">
              <ToggleButtonGroup
                exclusive
                value={selectedDateRange}
                onChange={(e, value) => {
                  setSelectedDateRange(value);
                }}
                aria-label="filters-date-range"
                size="small"
              >
                {[
                  { key: 1, value: 'default', filterValue: null },
                  {
                    key: 2,
                    value: 'today',
                    filterValue: {
                      from_date: moment(new Date()).format('YYYY-MM-DD'),
                      to_date: moment(new Date()).format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 3,
                    value: 'yesterday',
                    filterValue: {
                      from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                      to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 4,
                    value: '7D',
                    filterValue: {
                      from_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                      to_date: moment(new Date()).format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 5,
                    value: '30D',
                    filterValue: {
                      from_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                      to_date: moment(new Date()).format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 6,
                    value: '60D',
                    filterValue: {
                      from_date: moment().subtract(60, 'days').format('YYYY-MM-DD'),
                      to_date: moment(new Date()).format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 7,
                    value: '3M',
                    filterValue: {
                      from_date: moment().subtract(3, 'months').format('YYYY-MM-DD'),
                      to_date: moment(new Date()).format('YYYY-MM-DD'),
                    },
                  },
                  {
                    key: 8,
                    value: 'custom',
                    filterValue: null,
                  },
                ].map((item, idx) => (
                  <ToggleButton
                    key={`filter-toggle-button-${item.key}-${idx}`}
                    value={item.value}
                    aria-label={item.value}
                    onClick={() => {
                      if (item.value === 'custom') setShowCustomDateDialog(true);
                      else
                        setFilters((items) => ({
                          ...items,
                          from_date: item.filterValue?.from_date,
                          to_date: item.filterValue?.to_date,
                          date_filter_type: item.value,
                          page: 1,
                        }));
                    }}
                  >
                    <span className="px-2">{t(item.value)}</span>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <CustomDateFilterDialog
                isOpen={showCustomDateDialog}
                setIsOpen={setShowCustomDateDialog}
                parentTranslationPath={parentTranslationPath}
                setFilters={setFilters}
                isLoading={isLoading}
                setSelectedDateRange={setSelectedDateRange}
                filters={filters}
              />
            </div>
            <div className="d-flex-v-center-h-end">
              <ButtonBase
                className="btns btn-outline-light theme-outline"
                onClick={(e) => setPopoverAttachedWith(e.target)}
              >
                <span className={GetChartTypeHandler} />
                <span className="mx-2 py-2">{t(widgetData.chart_type)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns btn-outline-light theme-outline"
                onClick={() => GetDynamicAnalyticsHandler()}
                disabled={
                  Object.keys(errors).length > 0
                  || (filters.feature === 'pipeline' && filters.filterItems?.length < 2)
                }
              >
                <span className="mx-2 py-2">{t('apply')}</span>
              </ButtonBase>
            </div>
          </div>
          {isLoading && (
            <div className="my-4">
              <LoaderComponent
                isLoading={isLoading}
                isSkeleton
                skeletonItems={[
                  {
                    variant: 'rectangular',
                    style: { minHeight: 60, marginTop: 15, marginBottom: 15 },
                  },
                ]}
                numberOfRepeat={3}
              />
            </div>
          )}
          {!isLoading && (
            <div className="my-4">
              {/* TODO: Diana : Create another variation from table with collapsable rows to show data for each row */}
              {widgetData.chart_type === AnalyticsChartTypesEnum.TABLE.value && (
                <TablesComponent
                  data={executedWidgetData.rows || []}
                  isLoading={isLoading}
                  headerData={executedWidgetData.columns}
                  pageIndex={
                    filters.feature === 'pipeline' || !!filters.summarize?.length
                      ? null
                      : filters.page - 1
                  }
                  pageSize={
                    filters.feature === 'pipeline' || !!filters.summarize?.length
                      ? null
                      : filters.limit
                  }
                  totalItems={
                    (filters.summarize?.length
                      ? executedWidgetData.rows?.length
                      : executedWidgetData.total) || 0
                  }
                  // isDynamicDate
                  // uniqueKeyInput="uuid"
                  onPageIndexChanged={
                    filters.feature === 'pipeline' || !!filters.summarize?.length
                      ? null
                      : (newPage) => {
                        setFilters((items) => ({ ...items, page: newPage + 1 }));
                        setIsExecute(true);
                      }
                  }
                />
              )}
              {widgetData.chart_type !== AnalyticsChartTypesEnum.TABLE.value && (
                <SharedChart
                  data={{
                    labels: executedWidgetData.rows.map((it) =>
                      Object.values(it.summarize || {})
                        .map(
                          (x) =>
                            x?.name?.[i18next.language]
                            || x?.name?.en
                            || x?.name
                            || (typeof x !== 'object' && x)
                            || '',
                        )
                        .join(', '),
                    ),
                    datasets: [
                      {
                        label: '',
                        data: executedWidgetData.rows.map((it) => it.count),
                        backgroundColor: getColorsPerLabel(executedWidgetData.rows),
                      },
                    ],
                  }}
                  text1={t('job-applications')}
                  text2={t('unique')}
                  text3={`, ${t(filters.date_filter_type)}`}
                  text4={t('job-applications')}
                  options={ChartOptions[widgetData.chart_type]}
                  wrapperClasses="m-2"
                  chartType={widgetData.chart_type}
                  parentTranslationPath={parentTranslationPath}
                  isWidgetSetups
                />
              )}
            </div>
          )}
        </div>
      </div>
      <PopoverComponent
        idRef="chart-type-ref"
        attachedWith={popoverAttachedWith}
        handleClose={() => setPopoverAttachedWith(null)}
        component={
          <div className="d-flex-column p-2 w-100">
            {Object.values(AnalyticsChartTypesEnum)
              // .filter((it) => it.value === AnalyticsChartTypesEnum.TABLE.value)
              .filter(
                (it) =>
                  it.value !== AnalyticsChartTypesEnum.MULTIPLE_CARDS.value
                  && it.value !== AnalyticsChartTypesEnum.CARD.value,
              )
              .map((chartType, idx) => (
                <ButtonBase
                  key={`${idx}-${chartType.key}-popover-chartType`}
                  className="btns theme-transparent m-2"
                  onClick={() => {
                    setWidgetData((items) => ({
                      ...items,
                      chart_type: chartType.value,
                    }));
                    setPopoverAttachedWith(null);
                  }}
                  style={{
                    justifyContent: 'start',
                  }}
                  disabled={
                    chartType.value !== AnalyticsChartTypesEnum.TABLE.value
                    && !filters.summarize.length
                  }
                >
                  <span className={chartType.icon} />
                  <span className="px-2 mx-2">{t(chartType.value)}</span>
                </ButtonBase>
              ))}
          </div>
        }
      />
      {isPipelineFeatureOpen && (
        <PipelineFeatureDialog
          isOpen={isPipelineFeatureOpen}
          setIsOpen={setIsPipelineFeatureOpen}
          filters={filters}
          setFilters={setFilters}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

WidgetSetupView.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  currentView: PropTypes.shape({
    view: PropTypes.oneOf(['dashboard', 'widget-setup']).isRequired,
    currentDashboard: PropTypes.shape({
      uuid: PropTypes.string,
      widget_edit_data: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        chart_type: PropTypes.string,
        feature: PropTypes.string,
        payload: PropTypes.shape({
          summarize: PropTypes.array,
          projection: PropTypes.array,
          page: PropTypes.number,
          limit: PropTypes.number,
          content: PropTypes.shape({}),
          dividend_stage_uuid: PropTypes.string,
          divisor_stage_uuid: PropTypes.string,
          pipeline_origin_uuid: PropTypes.string,
          pipeline_company_uuid: PropTypes.string,
          sort: PropTypes.oneOf(['ASC', 'DESC']),
        }),
      }),
    }),
  }).isRequired,
};
