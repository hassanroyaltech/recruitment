import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DashboardFilter } from './DashboardFilter.Component';
import ButtonBase from '@mui/material/ButtonBase';
import { FolderIcon, PlusIcon } from '../../../assets/icons';
import {
  DeleteCustomDashboardWidget,
  MoveWidgetToCustomDashboard,
  RenderCustomDashboard,
  UpdateCustomDashboardWidget,
} from '../../../services';
import { getIsAllowedPermissionV2, showError, showSuccess } from '../../../helpers';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SharedChart from './SharedChart.Component';
import i18next from 'i18next';
import { ChartOptions } from '../AnalyticsHelpers';
import { ExploreLibraryDialog } from '../Dialogs/ExploreLibrary.Dialog';
import { NewAnalyticsPermissions } from '../../../permissions';
import { useSelector } from 'react-redux';
import { LoaderComponent } from '../../../components';
import { AnalyticsStaticDashboardEnum } from '../../../enums/Shared/AnalyticsStaticDashboard.Enum';

export const CustomDashboard = ({
  parentTranslationPath,
  uuid,
  filters,
  setFilters,
  setCurrentView,
  currentView,
  isExploreDialogOpen,
  setIsExploreDialogOpen,
  dashboardResponse,
  setDashboardResponse,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  // const [draggingWidgets, setDraggingWidgets] = useState(null);
  // const confirmMoveTimesRef = useRef(null);
  // const [layout, setLayout] = useState({
  //   columns: 3, // number
  //   variation: 'none', // none - even - odd
  //   variationColumns: null, // number or null
  // })
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  // const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const RenderCustomDashboardHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await RenderCustomDashboard({
      ...filters,
      uuid,
      ...(filters.company_uuid?.length && { company_uuid: [filters.company_uuid] }),
    });
    if (response && response.status === 200) {
      const { results } = response.data;

      // TODO: Aladdin : Remove after implementing order and resize functionality
      setDashboardData([
        ...results.static.map((item) => ({
          ...item,
          is_static: true,
        })),
        ...results.dynamic.map((item) => ({
          ...item,
          is_static: false,
        })),
      ]);
      setDashboardResponse(results);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setDashboardData([]);
      setDashboardResponse();
    }
    setIsLoading(false);
  }, [filters, setDashboardResponse, t, uuid]);

  const onDragEndHandler = async () => {
    // if (draggingWidgets) setDraggingWidgets(null);
    // if (!dropEvent.destination) return;
  };

  const onDragStartHandler = () => {
    // if (dropEvent.type !== 'widget') return;
  };

  const editWidgetHandler = (widget_edit_data) => {
    setCurrentView((items) => ({
      ...items,
      view: 'widget-setup',
      currentDashboard: {
        ...items.currentDashboard,
        widget_edit_data: {
          ...widget_edit_data,
          results: widget_edit_data.data,
        },
      },
    }));
  };
  // const refreshWidgetHandler = async ({
  //   widget_edit_data,
  //   widgetIndex,
  //   setIsChartLoading,
  // }) => {
  //   if (setIsChartLoading) setIsChartLoading(true);
  //   const response = await GetDynamicAnalytics({
  //     end_point: widget_edit_data.end_point,
  //     filters: {
  //        ...filters,
  //       ...widget_edit_data.payload,
  //       chart_type: widget_edit_data.chart_type,
  //     },
  //   });
  //   if (setIsChartLoading) setIsChartLoading(false);
  //   if (response && response.status === 200)
  //     setDashboardData((items) => {
  //       let dashboardsClone = [...items];
  //       // debugger;
  //       console.log({
  //         items,
  //         widgetIndex,
  //         widget_edit_data
  //       })
  //       dashboardsClone[widgetIndex].data = response.data.results;
  //       dashboardsClone[widgetIndex].chart_type = widget_edit_data.chart_type;
  //       if (response.data.paginate)
  //          dashboardsClone[widgetIndex].paginate = response.data.paginate;
  //       return dashboardsClone;
  //     });
  //   else showError(t('Shared:failed-to-get-saved-data'), response);
  // };

  const updateWidgetDataHandler = async ({
    widget_edit_data,
    // widgetIndex,
    updatedData,
    closeDialogHandler,
    setIsChartLoading,
  }) => {
    if (setIsChartLoading) setIsChartLoading(true);
    const response = await UpdateCustomDashboardWidget({
      ...widget_edit_data,
      chart_type: updatedData.chart_type,
      dashboard_uuid: uuid,
    });
    if (setIsChartLoading) setIsChartLoading(false);
    if (response && response.status === 200) {
      // if (updatedData.chart_type === AnalyticsChartTypesEnum.TABLE.value)
      await RenderCustomDashboardHandler();
      // else
      //   setDashboardData((items) => {
      //     let dashboardsClone = [...items];
      //     dashboardsClone[widgetIndex] = {
      //       ...dashboardsClone[widgetIndex],
      //       chart_type: updatedData.chart_type,
      //     };
      //     return dashboardsClone;
      //   });

      if (closeDialogHandler) closeDialogHandler();
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  const deleteWidgetHandler = useCallback(
    async (widget_uuid, is_static) => {
      setIsLoading(true);
      const response = await DeleteCustomDashboardWidget({
        dashboard_uuid: uuid,
        uuid: widget_uuid,
        is_dynamic: !is_static,
      });
      if (response && response.status === 200) {
        setFilters((items) => ({ ...items }));
        showSuccess(t('widget-deleted-successfully'));
      } else {
        setIsLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [uuid, setFilters, t],
  );

  const moveWidgetToDashboardHandler = useCallback(
    async ({ widget_uuid, dashboard_uuid, closeDialogHandler, is_dynamic }) => {
      setIsLoading(true);
      const response = await MoveWidgetToCustomDashboard({
        report_uuid: widget_uuid,
        dashboard_uuid,
        is_dynamic,
      });
      if (response && response.status === 200) {
        setFilters((items) => ({ ...items }));
        showSuccess(t('widget-moved-successfully'));
        if (closeDialogHandler) closeDialogHandler();
      } else {
        setIsLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [setFilters, t],
  );

  useEffect(() => {
    if (currentView.view === 'dashboard') void RenderCustomDashboardHandler();
  }, [filters, uuid, RenderCustomDashboardHandler, currentView]);

  const extractWidgetTitle = useCallback(
    (widget) => {
      let originalTitle = widget.title[i18next.language] || widget.title.en || '';
      if (
        AnalyticsStaticDashboardEnum?.[widget.feature]?.[widget.slug]
          ?.show_job_details
        && widget?.payload?.job_name
      )
        originalTitle = `${originalTitle} ${
          i18next.language === 'ar'
            ? `${t('in-job')} ${widget?.payload?.job_name}`
            : `${t('in')} ${widget?.payload?.job_name} ${t('title-job')}`
        }`;
      if (widget?.payload?.form_name)
        originalTitle = `${originalTitle} ${
          i18next.language === 'ar'
            ? `${t('in-form')} ${widget?.payload?.form_name}`
            : `${t('in')} ${widget?.payload?.form_name} ${t('title-form')}`
        }`;
      if (widget?.payload?.flow_name)
        originalTitle = `${originalTitle} ${t('in')} ${widget?.payload?.flow_name}`;
      return originalTitle;
    },
    [t],
  );

  return (
    <div className="custom-dashboard-container">
      <div className="mx-4">
        <DashboardFilter
          parentTranslationPath={parentTranslationPath}
          setFilters={setFilters}
          filters={filters}
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
      {!isLoading && (
        <>
          {dashboardResponse?.created_by && (
            <div className="d-flex mx-4 my-2 fz-12px">
              {`${t('created-by')}:`}{' '}
              <span className="dark-text-color px-2">
                {' '}
                {dashboardResponse?.created_by}{' '}
              </span>
            </div>
          )}
          {dashboardData?.length <= 0 && (
            <div className="d-flex-column-center mx-4" style={{ minHeight: '50vh' }}>
              <div className="pb-1 dark-text-color fw-bold fz-20px">
                {t('add-chart-main-desc')}
              </div>
              <div className="light-text-color fz-14px">
                {t('add-chart-sub-desc')}
              </div>
              <div>
                <div className="my-3 d-flex">
                  <ButtonBase
                    className="mx-2 px-3 py-1 btns btn-outline-light theme-outline"
                    onClick={() => setIsExploreDialogOpen(true)}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                        permissions: permissionsReducer,
                      }) || !dashboardResponse?.can_edit
                    }
                  >
                    <FolderIcon />
                    <span className="mx-2 py-2">{t('explore-library')}</span>
                  </ButtonBase>
                  <ButtonBase
                    className="mx-2 px-3 py-1 btns btn-outline-light theme-outline"
                    onClick={() =>
                      setCurrentView({
                        view: 'widget-setup',
                        currentDashboard: { uuid },
                      })
                    }
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: NewAnalyticsPermissions.UpdateADashboard.key,
                        permissions: permissionsReducer,
                      }) || !dashboardResponse?.can_edit
                    }
                  >
                    <PlusIcon />
                    <span className="mx-2 py-2">{t('create-new-widget')}</span>
                  </ButtonBase>
                </div>
              </div>
            </div>
          )}
          {dashboardData?.length > 0 && (
            <DragDropContext
              onDragEnd={onDragEndHandler}
              onDragStart={onDragStartHandler}
            >
              <Droppable
                direction="vertical"
                type="widget"
                droppableId="stageManagementDroppableId"
              >
                {(droppableProvided) => (
                  <div
                    className="custom-diagrams-containers mx-4 my-4 diagrams-containers"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    {dashboardData?.map((widget, index) => (
                      <Draggable
                        key={`widgetItemKey${index + 1}`}
                        draggableId={widget.uuid}
                        index={index}
                        isDragDisabled
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`${
                              (snapshot.isDragging && ' is-dragging') || ''
                            }`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            {widget.is_static && (
                              <SharedChart
                                deleteWidgetHandler={deleteWidgetHandler}
                                // editWidgetHandler={editWidgetHandler}
                                // refreshWidgetHandler={refreshWidgetHandler}
                                // updateWidgetDataHandler={updateWidgetDataHandler}
                                moveWidgetToDashboardHandler={
                                  moveWidgetToDashboardHandler
                                }
                                widget_edit_data={widget}
                                widgetIndex={index}
                                // data={GetDataFormatFromChartType({
                                //   chart_type: widget.chart_type,
                                //   data: widget.data[widget.slug],
                                //   t,
                                // })}
                                text1={extractWidgetTitle(widget)}
                                text2={t('unique')}
                                text3={`, ${t(filters.date_filter_type)}`}
                                text4={t(widget.feature)}
                                wrapperClasses="m-2"
                                parentTranslationPath={parentTranslationPath}
                                chartType={widget.chart_type}
                                options={ChartOptions[widget.chart_type]}
                                isLoading={isLoading}
                                smallSize={
                                  AnalyticsStaticDashboardEnum?.[widget.feature]?.[
                                    widget.slug
                                  ]?.small_size
                                }
                                // tableData={
                                //   AnalyticsStaticDashboardEnum?.[widget.feature]?.[
                                //     widget.slug
                                //   ]?.tableData
                                // }
                                feature={widget.feature}
                                slug={widget.slug}
                                filters={filters}
                                isEditActionsDisabled={!dashboardResponse?.can_edit}
                              />
                            )}
                            {!widget.is_static && (
                              <SharedChart
                                deleteWidgetHandler={deleteWidgetHandler}
                                editWidgetHandler={editWidgetHandler}
                                // isEditActionsDisabled={!dashboardResponse?.can_edit}
                                // refreshWidgetHandler={refreshWidgetHandler}
                                updateWidgetDataHandler={updateWidgetDataHandler}
                                moveWidgetToDashboardHandler={
                                  moveWidgetToDashboardHandler
                                }
                                widget_edit_data={widget}
                                widgetIndex={index}
                                // data={
                                //   widget.chart_type
                                //   === AnalyticsChartTypesEnum.TABLE.value
                                //     ? widget.data
                                //     : {
                                //       labels: widget.data.map((it) =>
                                //         Object.values(it.summarize)
                                //           .map(
                                //             (x) =>
                                //               x?.name?.[i18next.language]
                                //                 || x?.name?.en
                                //                 || x?.name
                                //                 || (typeof x !== 'object' && x)
                                //                 || '',
                                //           )
                                //           .join(', '),
                                //       ),
                                //       datasets: [
                                //         {
                                //           label: '',
                                //           data: widget.data.map((it) => it.count),
                                //           backgroundColor: getColorsPerLabel(
                                //             widget.data,
                                //           ),
                                //         },
                                //       ],
                                //     }
                                // }
                                filters={filters}
                                text1={widget.title}
                                text2={t('unique')}
                                text3={`, ${t(filters.date_filter_type)}`}
                                text4={t(widget.feature)}
                                text5={t('subtitle-2')}
                                wrapperClasses="m-2"
                                parentTranslationPath={parentTranslationPath}
                                chartType={widget.chart_type}
                                options={ChartOptions[widget.chart_type]}
                                isLoading={isLoading}
                                // tableData={}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </>
      )}
      {isExploreDialogOpen && (
        <ExploreLibraryDialog
          isOpen={isExploreDialogOpen}
          setIsOpen={setIsExploreDialogOpen}
          dashboard_uuid={uuid}
          setDashboardFilters={setFilters}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

CustomDashboard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  currentView: PropTypes.shape({
    view: PropTypes.oneOf(['dashboard', 'widget-setup']).isRequired,
    currentDashboard: PropTypes.shape({
      uuid: PropTypes.string,
      can_edit: PropTypes.bool,
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
        }),
      }),
    }),
  }).isRequired,
  isExploreDialogOpen: PropTypes.bool,
  dashboardResponse: PropTypes.instanceOf(Object),
  setDashboardResponse: PropTypes.func,
  setIsExploreDialogOpen: PropTypes.func,
};
