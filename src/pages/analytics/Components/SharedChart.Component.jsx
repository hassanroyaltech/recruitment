import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import {
  LoaderComponent,
  PopoverComponent,
  TooltipsComponent,
} from '../../../components';
import {
  MoveIcon,
  PenOutlinedIcon,
  // ResetFilterIcon,
  // SyncIcon,
  TrashIcon,
  PieChartOutlinedIcon,
  DownArrowLongIcon,
} from '../../../assets/icons';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { AnalyticsChartTypesEnum } from '../../../enums';
import { WidgetChartTypeDialog } from '../Dialogs/WidgetChartType.Dialog';
import { MoveToDashboardDialog } from '../Dialogs/MoveToDashboard.Dialog';
import {
  floatHandler,
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../helpers';
import { NewAnalyticsPermissions } from '../../../permissions';
import { useSelector } from 'react-redux';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { DetailedViewDialog } from '../Dialogs/DetailedView.Dialog';
import { DynamicService, GenerateAnalyticsReport } from '../../../services';
import { AnalyticsStaticDashboardEnum } from '../../../enums/Shared/AnalyticsStaticDashboard.Enum';
import { getColorsPerLabel, GetDataFormatFromChartType } from '../AnalyticsHelpers';
import i18next from 'i18next';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
);

const SharedChart = memo(
  ({
    data,
    text1,
    text2,
    text3,
    text4,
    text5,
    options,
    wrapperClasses,
    parentTranslationPath,
    chartType,
    widget_edit_data,
    widgetIndex,
    editWidgetHandler,
    // refreshWidgetHandler,
    updateWidgetDataHandler,
    moveWidgetToDashboardHandler,
    deleteWidgetHandler,
    tableData,
    isLoading,
    is_static,
    isWidgetSetups,
    onSelectHandler,
    isSelected,
    smallSize,
    description,
    formula,
    feature,
    slug,
    filters,
    isEditActionsDisabled,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const chartRef = useRef(null);
    const [localData, setLocalData] = useState();
    const [localTableData, setLocalTableData] = useState({
      headerData: [],
      pageIndex: 0,
      pageSize: 10,
      totalItems: 0,
      autoPaginate: true,
      // for not tables
      labels: [],
      datasets: [],
    });
    const [isHovered, setIsHovered] = useState(false);
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const [isChartTypeDialogOpen, setIsChartTypeDialogOpen] = useState(false);
    const [isMoveToDashbordDialogOpen, setIsMoveToDashbordDialogOpen]
      = useState(false);
    const permissionsReducer = useSelector(
      (state) => state?.permissionsReducer?.permissions,
    );
    const selectedBranchReducer = useSelector(
      (state) => state?.selectedBranchReducer,
    );
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isChartLoading, setIsChartLoading] = useState(false);
    const [isTooltipActive, setIsTooltipActive] = useState(false);
    const [localPagination, setLocalPagination] = useState({
      pageSize: 4,
      pageIndex: 0,
    });
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const GetLabelForSummarize = useCallback(
      ({ data, item }) =>
        // We can have only one summarize chosen this is why we selected the first index
        data?.[0]?.title?.[item.split('.')?.pop()] || t(item),
      [t],
    );

    const generateAnalyticsReport = useCallback(async () => {
      setIsLoadingReport(true);
      const response = await GenerateAnalyticsReport({
        ...filters,
        slug:
          AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.customDetailsSlug || slug,
        feature,
        ...(AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.extraReportFilters
          && AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.extraReportFilters(
            widget_edit_data,
          )),
      });
      setIsLoadingReport(false);
      setPopoverAttachedWith(null);
      if (response && response.status === 200)
        showSuccess(response?.data?.message || t('Shared:success'));
      else showError(t('Shared:failed-to-get-saved-data'), response);
    }, [feature, filters, slug, t, widget_edit_data]);

    const getInit = useCallback(
      async (payload) => {
        if (!widget_edit_data) return;
        if (widget_edit_data.is_static)
          setLocalTableData(
            AnalyticsStaticDashboardEnum?.[widget_edit_data.feature]?.[
              widget_edit_data.slug
            ]?.tableData,
          );

        setIsChartLoading(true);
        const response = await DynamicService({
          path: widget_edit_data.end_point,
          params: {
            ...(widget_edit_data.is_static && filters),
            ...(widget_edit_data.is_static
              && !filters?.company_uuid
              && AnalyticsStaticDashboardEnum?.[widget_edit_data.feature]?.[
                widget_edit_data.slug
              ]?.is_with_current_company_query && {
              company_uuid: selectedBranchReducer.uuid,
            }),
            ...((widget_edit_data.method === 'get' && payload)
              || widget_edit_data.params),
            from_date:
              filters?.from_date
              || payload?.from_date
              || widget_edit_data?.params?.from_date,
            to_date:
              filters?.to_date
              || payload?.to_date
              || widget_edit_data?.params?.to_date,
          },
          method: widget_edit_data.method,
          body:
            (widget_edit_data.method !== 'get' && {
              ...payload,
              from_date: filters?.from_date || payload?.from_date,
              to_date: filters?.to_date || payload?.to_date,
              date_filter_type:
                filters?.date_filter_type || payload?.date_filter_type,
            })
            || undefined,
        });
        setIsChartLoading(false);
        if (
          response
          && (response.status === 200
            || response.status === 201
            || response.status === 202)
        ) {
          const localData = widget_edit_data.is_static
            ? GetDataFormatFromChartType({
              chart_type: widget_edit_data.chart_type,
              data: response.data.results[widget_edit_data.slug],
              t,
            })
            : widget_edit_data.chart_type === AnalyticsChartTypesEnum.TABLE.value
              ? response.data.results
              : {
                labels: response.data.results.map((it) =>
                  Object.values(it.summarize)
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
                    data: response.data.results.map((it) => it.count),
                    backgroundColor: getColorsPerLabel(response.data.results),
                  },
                ],
              };
          setLocalData(localData);
          if (!widget_edit_data.is_static) {
            const localPaginate = response.data.paginate || payload;
            setLocalTableData({
              autoPaginate: Object.keys(response.data.paginate || {}).length === 0,
              pageIndex: (localPaginate?.page && localPaginate?.page - 1) ?? 0,
              pageSize: localPaginate?.limit || 10,
              totalItems: localPaginate?.total || response.data.length,
              headerData: [...(payload.summarize || []), 'count'].map((it, idx) => ({
                id: idx,
                isSortable: false,
                label: GetLabelForSummarize({
                  data: response.data.results,
                  item: it,
                }),
                component: (option) => {
                  if (it === 'count') return option.count;
                  if (it.split('.')[1])
                    return (
                      option?.summarize?.[it.split('.')[1]].name?.[
                        i18next.language
                      ]
                      || option?.summarize?.[it.split('.')[1]].name?.en
                      || option?.summarize?.[it.split('.')[1]].name
                      || option?.summarize?.[it.split('.')[1]]
                      || ''
                    );
                  else if (typeof option.summarize?.[it] === 'string')
                    return option.summarize[it];
                  else if (
                    option.summarize?.[it]
                    && typeof option.summarize?.[it] === 'object'
                  )
                    return typeof option.summarize?.[it].name === 'string'
                      ? option.summarize?.[it].name
                      : option.summarize[it]?.name?.[i18next.language]
                          || option.summarize[it]?.name?.en
                          || '';
                  else if (
                    typeof option.summarize?.[it] === 'boolean'
                    || typeof option.summarize?.[it] === 'number'
                  )
                    return `${option.summarize[it]}`;
                },
              })),
            });
          }
        } else showError(t('Shared:failed-to-get-saved-data'), response);
      },
      [selectedBranchReducer, GetLabelForSummarize, filters, t, widget_edit_data],
    );

    useEffect(() => {
      if (widget_edit_data && !data) void getInit(widget_edit_data.payload);
      else {
        if (data) setLocalData(data);
        if (tableData) setLocalTableData(tableData);
      }
    }, [getInit, widget_edit_data, data, tableData]);

    return (
      <div
        className={`bar-chart ${wrapperClasses ? wrapperClasses : ''}`}
        style={{
          border: `1px solid ${
            isHovered || isSelected ? '#4851C8' : 'rgba(36, 37, 51, 0.06)'
          }`,
          borderRadius: 8,
          position: 'relative',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setPopoverAttachedWith(null);
        }}
        onClick={() => {
          if (onSelectHandler) onSelectHandler();
        }}
        role="button"
        onKeyDown={() => {
          if (onSelectHandler) onSelectHandler();
        }}
        tabIndex={widgetIndex}
      >
        {isChartLoading && (
          <LoaderComponent
            isLoading={isChartLoading}
            isSkeleton
            skeletonItems={[
              {
                variant: 'rectangular',
                style: { minHeight: 350 },
              },
            ]}
          />
        )}
        {!isChartLoading && (
          <>
            {!isWidgetSetups && (
              <ButtonBase
                style={{
                  display: isHovered ? 'block' : 'none',
                }}
                className="w-100 btns-icon theme-transparent actions-btns"
                onClick={(e) => setPopoverAttachedWith(e.target)}
                disabled={
                  is_static
                  && [
                    AnalyticsChartTypesEnum.CARD.value,
                    AnalyticsChartTypesEnum.MULTIPLE_CARDS.value,
                    AnalyticsChartTypesEnum.TABLE.value,
                  ].includes(chartType)
                  && !AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.generateReport
                  && !AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.detailedView
                }
              >
                <span className="fas fa-ellipsis-h" />
              </ButtonBase>
            )}
            <div
              className="p-3"
              style={{
                borderBottom: '1px solid rgba(36, 37, 51, 0.06)',
              }}
            >
              <div className="dark-text-color fw-bold fz-16px m-end-25px">
                <span>{text1}</span>
                {is_static && (description || formula) && (
                  <TooltipsComponent
                    parentTranslationPath={parentTranslationPath}
                    isOpen={isTooltipActive}
                    onOpen={() => setIsTooltipActive(true)}
                    onClose={() => setIsTooltipActive(false)}
                    titleComponent={
                      <div className="p-1">
                        {description && (
                          <div>
                            <span className="fw-bold">{t('description')}</span>
                            <br />
                            <span className="py-1">{t(description)}</span>
                          </div>
                        )}
                        {description && formula && t(formula) !== '-' && <br />}
                        {formula && t(formula) !== '-' && (
                          <div>
                            <span className="fw-bold">{t('formula')}</span>
                            <br />
                            <span className="py-1">{t(formula)}</span>
                          </div>
                        )}
                      </div>
                    }
                    contentComponent={
                      <span className="mx-2 fas fa-eye light-text-color" />
                    }
                  />
                )}
              </div>
              {text3 !== `, ${t('default')}` && (
                <div className="fz-12px">
                  <span className="light-text-color">{text2}</span>
                  <span className="dark-text-color">{text3}</span>
                </div>
              )}
            </div>
            <div className="d-flex-column-center p-4">
              {[
                AnalyticsChartTypesEnum.BAR.value,
                AnalyticsChartTypesEnum.CARD.value,
              ].includes(chartType)
                && (localData || localData === 0) && (
                <div className="d-flex-center mb-3">
                  <div
                    className="primary-box-color"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: 2,
                    }}
                  />
                  <div className="light-text-color fz-12px mx-2">{text4}</div>
                </div>
              )}
              {chartType === AnalyticsChartTypesEnum.BAR.value
                && (localData || localData === 0) && (
                <Bar options={options} data={localData} ref={chartRef} />
              )}
              {chartType === AnalyticsChartTypesEnum.DOUGHNUT.value
                && (localData || localData === 0) && (
                <Doughnut options={options} data={localData} ref={chartRef} />
              )}
              {chartType === AnalyticsChartTypesEnum.CARD.value
                && (localData || localData === 0) && (
                <>
                  <div
                    className={`dark-text-color ${
                      smallSize ? 'fz-30px' : 'fz-81px'
                    } fw-bolder`}
                  >
                    {!isNaN(localData) ? floatHandler(localData, 3) : localData}
                  </div>
                  <div className="light-text-color fz-12px">{text5}</div>
                </>
              )}
              {chartType === AnalyticsChartTypesEnum.MULTIPLE_CARDS.value
                && localData
                && Array.isArray(localData)
                && localData.length > 0 && (
                <div className="w-100">
                  {localData.map((item, idx) => (
                    <div
                      key={`${idx}-card-chart`}
                      className="d-flex-v-center-h-between w-100 my-2 py-2 px-3"
                      style={{
                        border: '1px solid rgba(36, 37, 51, 0.06)',
                        borderRadius: 8,
                      }}
                    >
                      <div className="dark-text-color fz-20px fw-bolder">
                        {item.title}
                      </div>
                      <div
                        className={`light-text-color ${
                          smallSize ? 'fz-12px' : 'fz-16px'
                        }`}
                      >
                        {item.values}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {chartType === AnalyticsChartTypesEnum.LINE.value
                && (localData || localData === 0) && (
                <Line options={options} data={localData} ref={chartRef} />
              )}
              {chartType === AnalyticsChartTypesEnum.TABLE.value
                && (localData || localData === 0) && (
                <TablesComponent
                  parentTranslationPath={parentTranslationPath}
                  wrapperClasses="p-0"
                  data={
                    (widget_edit_data?.payload?.dividend_stage_uuid
                        || widget_edit_data?.payload?.divisor_stage_uuid)
                      && typeof localData === 'object'
                      && Object.keys(localData).includes('Ratio')
                      ? [
                        {
                          ratio: localData?.Ratio,
                        },
                      ]
                      : localData || []
                  }
                  isLoading={isLoading}
                  onBodyRowClicked={
                    (editWidgetHandler
                        && (() => {
                          editWidgetHandler(widget_edit_data);
                        }))
                      || undefined
                  }
                  headerData={
                    (widget_edit_data?.payload?.dividend_stage_uuid
                        || widget_edit_data?.payload?.divisor_stage_uuid)
                      && typeof localData === 'object'
                      && Object.keys(localData).includes('Ratio')
                      ? [
                        {
                          id: 0,
                          isSortable: false,
                          label: t('ratio'),
                          input: 'ratio',
                        },
                      ]
                      : localTableData?.headerData
                  }
                  pageIndex={
                    // Use local pagination if data is not returned paginated & Remove pagination in case of pipeline
                    localTableData?.autoPaginate
                      ? localPagination.pageIndex
                      : (widget_edit_data?.feature === 'pipeline' && null)
                          || localTableData?.pageIndex
                  }
                  pageSize={
                    // Use local pagination if data is not returned paginated & Remove pagination in case of pipeline
                    localTableData?.autoPaginate
                      ? localPagination.pageSize
                      : (widget_edit_data?.feature === 'pipeline' && null)
                          || localTableData?.pageSize
                  }
                  totalItems={
                    (widget_edit_data?.payload?.dividend_stage_uuid
                        || widget_edit_data?.payload?.divisor_stage_uuid)
                      && typeof localData === 'object'
                      && Object.keys(localData).includes('Ratio')
                      ? 1
                      : localTableData?.totalItems || localData.length
                  }
                  onPageIndexChanged={
                    // Remove pagination in case of pipeline
                    widget_edit_data?.feature === 'pipeline'
                      ? null
                      : (newPage) => {
                        // Use local pagination and update page locally if data is not returned paginated
                        if (localTableData.autoPaginate)
                          setLocalPagination((prev) => ({
                            ...prev,
                            pageIndex: newPage,
                          }));
                        // Fetch data if data is returned paginated
                        else if (!data)
                          void getInit({
                            ...filters,
                            ...widget_edit_data.payload,
                            page: newPage + 1,
                          });
                        else
                          updateWidgetDataHandler({
                            widget_edit_data: {
                              ...widget_edit_data,
                              payload: {
                                ...filters,
                                chart_type: AnalyticsChartTypesEnum.TABLE.value,
                                ...widget_edit_data.payload,
                                page: newPage + 1,
                              },
                            },
                            // widgetIndex,
                            updatedData: {
                              chart_type: AnalyticsChartTypesEnum.TABLE.value,
                            },
                            setIsChartLoading,
                          });
                      }
                  }
                />
              )}
            </div>
            <PopoverComponent
              idRef="widget-ref"
              attachedWith={popoverAttachedWith}
              handleClose={() => {
                setPopoverAttachedWith(null);
                setIsHovered(false);
              }}
              popoverClasses="columns-popover-wrapper"
              component={
                <div className="d-flex-column p-2 w-100">
                  {!is_static && (
                    <>
                      {[
                        editWidgetHandler && {
                          key: 1,
                          label: 'edit',
                          onClick: () => editWidgetHandler(widget_edit_data),
                          icon: <PenOutlinedIcon />,
                          isDisabled:
                            !editWidgetHandler
                            || !getIsAllowedPermissionV2({
                              permissionId:
                                NewAnalyticsPermissions.UpdateADashboard.key,
                              permissions: permissionsReducer,
                            })
                            || isEditActionsDisabled,
                        },
                        // {
                        //   key: 2,
                        //   label: 'share',
                        //   onClick: () => {},
                        //   icon: <TopRightArrowLongIcon />,
                        // },
                        // {
                        //   key: 3,
                        //   label: 'refresh',
                        //   onClick: () =>
                        //     refreshWidgetHandler({
                        //       widget_edit_data,
                        //       widgetIndex,
                        //       setIsChartLoading,
                        //     }),
                        //   icon: <SyncIcon />,
                        //   isDisabled: !refreshWidgetHandler,
                        // },
                        {
                          key: 4,
                          label: 'move-to-dashboard',
                          onClick: () => setIsMoveToDashbordDialogOpen(true),
                          icon: <MoveIcon />,
                          isDisabled:
                            !moveWidgetToDashboardHandler
                            || !getIsAllowedPermissionV2({
                              permissionId:
                                NewAnalyticsPermissions.UpdateADashboard.key,
                              permissions: permissionsReducer,
                            })
                            || isEditActionsDisabled,
                        },
                      ]
                        .filter(Boolean)
                        .map((action, idx) => (
                          <ButtonBase
                            key={`${idx}-${action.key}-popover-action`}
                            className="btns theme-transparent m-2"
                            onClick={() => {
                              action.onClick();
                              setPopoverAttachedWith(null);
                            }}
                            style={{
                              justifyContent: 'start',
                            }}
                            disabled={action.isDisabled}
                          >
                            <span>{action.icon}</span>
                            <span className="px-2">{t(action.label)}</span>
                          </ButtonBase>
                        ))}
                      <Divider />
                      {/*{[*/}
                      {/*  {*/}
                      {/*    key: 5,*/}
                      {/*    label: 'reset-to-default',*/}
                      {/*    onClick: () => {},*/}
                      {/*    icon: <ResetFilterIcon />,*/}
                      {/*  },*/}
                      {/*].map((action, idx) => (*/}
                      {/*  <ButtonBase*/}
                      {/*    key={`${idx}-${action.key}-popover-action`}*/}
                      {/*    className="btns theme-transparent m-2"*/}
                      {/*    onClick={() => {*/}
                      {/*      action.onClick();*/}
                      {/*      setPopoverAttachedWith(null);*/}
                      {/*    }}*/}
                      {/*    style={{*/}
                      {/*      justifyContent: 'start',*/}
                      {/*    }}*/}
                      {/*  >*/}
                      {/*    <span>{action.icon}</span>*/}
                      {/*    <span className="px-2">{t(action.label)}</span>*/}
                      {/*  </ButtonBase>*/}
                      {/*))}*/}
                      {/*<Divider />*/}
                    </>
                  )}
                  {[
                    ...(is_static
                      ? []
                      : [
                        {
                          key: 6,
                          label: 'chart-type',
                          onClick: () => setIsChartTypeDialogOpen(true),
                          icon: <PieChartOutlinedIcon />,
                          isDisabled:
                              !updateWidgetDataHandler
                              || !getIsAllowedPermissionV2({
                                permissionId:
                                  NewAnalyticsPermissions.UpdateADashboard.key,
                                permissions: permissionsReducer,
                              })
                              || isEditActionsDisabled,
                        },
                      ]),
                    ...([
                      AnalyticsChartTypesEnum.CARD.value,
                      AnalyticsChartTypesEnum.MULTIPLE_CARDS.value,
                      AnalyticsChartTypesEnum.TABLE.value,
                    ].includes(chartType)
                      ? []
                      : [
                        {
                          key: 7,
                          label: 'download',
                          onClick: () => {
                            const link = document.createElement('a');
                            link.download = `${text1}-${chartType}-chart.jpeg`;
                            link.href = chartRef.current.toBase64Image(
                              'image/jpeg',
                              1,
                            );
                            link.click();
                          },
                          icon: <DownArrowLongIcon />,
                        },
                      ]),
                  ].map((action, idx) => (
                    <ButtonBase
                      key={`${idx}-${action.key}-popover-action`}
                      className="btns theme-transparent m-2"
                      onClick={() => {
                        action.onClick();
                        setPopoverAttachedWith(null);
                      }}
                      style={{
                        justifyContent: 'start',
                      }}
                      disabled={action.isDisabled}
                    >
                      <span>{action.icon}</span>
                      <span className="px-2">{t(action.label)}</span>
                    </ButtonBase>
                  ))}
                  {!is_static && (
                    <>
                      <Divider />
                      {[
                        {
                          key: 8,
                          label: 'delete',
                          onClick: () =>
                            deleteWidgetHandler(
                              widget_edit_data.uuid,
                              widget_edit_data.is_static,
                            ),
                          icon: <TrashIcon />,
                          isDisabled:
                            !deleteWidgetHandler
                            || !getIsAllowedPermissionV2({
                              permissionId:
                                NewAnalyticsPermissions.UpdateADashboard.key,
                              permissions: permissionsReducer,
                            })
                            || isEditActionsDisabled,
                        },
                      ].map((action, idx) => (
                        <ButtonBase
                          key={`${idx}-${action.key}-popover-action`}
                          className="btns theme-transparent m-2"
                          onClick={() => {
                            action.onClick();
                            setPopoverAttachedWith(null);
                          }}
                          style={{
                            justifyContent: 'start',
                          }}
                          disabled={action.isDisabled}
                        >
                          <span>{action.icon}</span>
                          <span className="px-2">{t(action.label)}</span>
                        </ButtonBase>
                      ))}
                    </>
                  )}

                  {(AnalyticsStaticDashboardEnum?.[feature]?.[slug]
                    ?.generateReport && (
                    <ButtonBase
                      className="btns theme-transparent m-2"
                      onClick={() => generateAnalyticsReport()}
                      style={{
                        justifyContent: 'start',
                      }}
                      disabled={isLoadingReport}
                    >
                      {isLoadingReport ? (
                        <>
                          <span className="fas fa-circle-notch fa-spin" />
                          <span className="px-2">{t(`generating`)} </span>
                        </>
                      ) : (
                        <>
                          <span className="fas fa-paperclip" />
                          <span className="px-2">{t('generate-report')}</span>
                        </>
                      )}
                    </ButtonBase>
                  ))
                    || null}
                  {(AnalyticsStaticDashboardEnum?.[feature]?.[slug]
                    ?.detailedView && (
                    <ButtonBase
                      className="btns theme-transparent m-2"
                      onClick={() => {
                        setIsDetailsOpen(true);
                        setPopoverAttachedWith(null);
                      }}
                      style={{
                        justifyContent: 'start',
                      }}
                    >
                      <span className="far fa-eye" />
                      <span className="px-2">{t('view-details')}</span>
                    </ButtonBase>
                  ))
                    || null}
                </div>
              }
            />
          </>
        )}
        {isChartTypeDialogOpen && (
          <WidgetChartTypeDialog
            isOpen={isChartTypeDialogOpen}
            setIsOpen={setIsChartTypeDialogOpen}
            isLoading={isLoading}
            widget_edit_data={widget_edit_data}
            widgetIndex={widgetIndex}
            updateWidgetDataHandler={updateWidgetDataHandler}
            isChartLoading={isChartLoading}
            setIsChartLoading={setIsChartLoading}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {isMoveToDashbordDialogOpen && (
          <MoveToDashboardDialog
            isOpen={isMoveToDashbordDialogOpen}
            setIsOpen={setIsMoveToDashbordDialogOpen}
            isLoading={isLoading}
            widget_edit_data={widget_edit_data}
            moveWidgetToDashboardHandler={moveWidgetToDashboardHandler}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {isDetailsOpen && (
          <DetailedViewDialog
            parentTranslationPath={parentTranslationPath}
            tableColumns={
              AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.detailsTableColumns
              || []
            }
            titleText={
              AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.dialogTitleKey
            }
            isOpen={isDetailsOpen}
            isOpenChanged={() => {
              setIsDetailsOpen(false);
            }}
            filters={{
              ...filters,
              ...(AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.withCharType && {
                chart_type: '',
              }),
              slug:
                AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.customDetailsSlug
                || slug,
              feature,
              ...(AnalyticsStaticDashboardEnum?.[feature]?.[slug]
                ?.extraReportFilters
                && AnalyticsStaticDashboardEnum?.[feature]?.[slug]?.extraReportFilters(
                  widget_edit_data,
                )),
            }}
          />
        )}
      </div>
    );
  },
);

SharedChart.displayName = 'SharedChart';

export default SharedChart;

SharedChart.propTypes = {
  text1: PropTypes.string,
  text2: PropTypes.string,
  text3: PropTypes.string,
  text4: PropTypes.string,
  text5: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.number]),
  options: PropTypes.shape({}),
  wrapperClasses: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  chartType: PropTypes.oneOf(
    Object.values(AnalyticsChartTypesEnum).map((item) => item.value),
  ),
  widget_edit_data: PropTypes.shape({
    uuid: PropTypes.string,
    is_static: PropTypes.bool,
    params: PropTypes.instanceOf(Object),
    payload: PropTypes.shape({
      dividend_stage_uuid: PropTypes.string,
      divisor_stage_uuid: PropTypes.string,
      job_uuid: PropTypes.string,
      pipeline_uuid: PropTypes.string,
    }),
    feature: PropTypes.string,
    slug: PropTypes.string,
    chart_type: PropTypes.oneOf(
      Object.values(AnalyticsChartTypesEnum).map((item) => item.value),
    ),
    end_point: PropTypes.string,
    method: PropTypes.string,
  }),
  widgetIndex: PropTypes.number,
  editWidgetHandler: PropTypes.func,
  // refreshWidgetHandler: PropTypes.func,
  updateWidgetDataHandler: PropTypes.func,
  moveWidgetToDashboardHandler: PropTypes.func,
  deleteWidgetHandler: PropTypes.func,
  tableData: PropTypes.shape({
    headerData: PropTypes.array,
    pageIndex: PropTypes.number,
    pageSize: PropTypes.number,
    totalItems: PropTypes.number,
    autoPaginate: PropTypes.bool,
  }),
  isLoading: PropTypes.bool,
  is_static: PropTypes.bool,
  isWidgetSetups: PropTypes.bool,
  onSelectHandler: PropTypes.func,
  isSelected: PropTypes.bool,
  smallSize: PropTypes.bool,
  description: PropTypes.string,
  formula: PropTypes.string,
  feature: PropTypes.string,
  slug: PropTypes.string,
  isEditActionsDisabled: PropTypes.bool,
  filters: PropTypes.instanceOf(Object),
};
