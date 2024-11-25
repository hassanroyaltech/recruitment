import { DialogComponent } from '../../../components';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  AddStaticWidgetToCustomDashboard,
  GetAllFeaturesList,
  GetAllLibraryTemplates,
} from '../../../services';
import { showError, showSuccess } from '../../../helpers';
import SharedChart from '../Components/SharedChart.Component';
import i18next from 'i18next';
import { ChartOptions } from '../AnalyticsHelpers';
import ButtonBase from '@mui/material/ButtonBase';
import { useEventListener } from '../../../hooks';
import './ExploreLibrary.Style.scss';
import { PipelineFeatureDialog } from './PipelineFeature.Dialog';
import { AnalyticsStaticDashboardEnum } from '../../../enums/Shared/AnalyticsStaticDashboard.Enum';
import FlowDialog from './flow/Flow.Dialog';

export const ExploreLibraryDialog = ({
  isOpen,
  setIsOpen,
  dashboard_uuid,
  setDashboardFilters,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isPipelineFeatureOpen, setIsPipelineFeatureOpen] = useState(false);
  const [isFlowDialogOpen, setIsFlowDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    feature: null,
    limit: 10,
    page: 1,
  });
  const [templates, setTemplates] = useState({
    results: [],
    totalCount: 0,
  });
  const [features, setFeatures] = useState([]);
  const templateWrapperRef = useRef(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [activeTemplateUuid, setActiveTemplateUuid] = useState('');
  const GetAllFeaturesListHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllFeaturesList({
      is_static: true,
    });
    setIsLoading(false);
    if (response && response.status === 200) setFeatures(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  const GetAllLibraryTemplatesHandler = useCallback(async () => {
    // setIsLoading(true);
    const response = await GetAllLibraryTemplates(filters);
    // setIsLoading(false);

    if (response && response.status === 200)
      if (filters.page === 1)
        setTemplates({
          results: response.data.results || [],
          totalCount: response.data.paginate?.total || 0,
        });
      else
        setTemplates((items) => ({
          results: items.results.concat(response.data.results || []),
          totalCount: response.data.paginate.total || 0,
        }));
    else {
      setTemplates({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [t, filters]);

  const AddStaticWidgetToCustomDashboardHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await AddStaticWidgetToCustomDashboard({
      dashboard_uuid,
      template_uuid: selectedTemplates,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      window?.ChurnZero?.push([
        'trackEvent',
        `Analytics - Build Dashboard`,
        `Build Dashboard`,
        1,
        {},
      ]);
      setIsOpen(false);
      showSuccess(t('template-added-successfully'));
      setDashboardFilters((items) => ({ ...items }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t, dashboard_uuid, selectedTemplates, setIsOpen, setDashboardFilters]);

  const onScrollHandler = useCallback(() => {
    if (
      templateWrapperRef.current.offsetHeight
        + templateWrapperRef.current.scrollTop
        >= templateWrapperRef.current.scrollHeight - 5
      && templates.results.length < templates.totalCount
      // && !isLoadingRef.current
    )
      setFilters((items) => ({ ...items, page: items.page + 1 }));
  }, [templates]);

  useEventListener('scroll', onScrollHandler, templateWrapperRef.current);

  useEffect(() => {
    GetAllFeaturesListHandler();
  }, [GetAllFeaturesListHandler]);

  useEffect(() => {
    GetAllLibraryTemplatesHandler();
  }, [filters, GetAllLibraryTemplatesHandler]);

  const setSelectedPipeLine = useCallback(
    (val) => {
      setSelectedTemplates((items) => [
        ...items,
        { uuid: activeTemplateUuid, payload: val },
      ]);
    },
    [activeTemplateUuid],
  );

  const isTemplateSelected = useMemo(
    () => (uuid) => selectedTemplates.some((e) => e.uuid === uuid),
    [selectedTemplates],
  );

  const selectTemplateHandler = useCallback((template, selectedItems) => {
    console.log({
      template,
      selectedItems,
    });
    if (['pipeline'].includes(template.feature))
      if (selectedItems.some((e) => e.uuid === template.uuid)) {
        setActiveTemplateUuid('');
        setSelectedTemplates((items) =>
          items.filter((it) => it.uuid !== template.uuid),
        );
      } else {
        setActiveTemplateUuid(template.uuid);
        setIsPipelineFeatureOpen(true);
      }
    else if (['avg_satisfaction_per_form'].includes(template.slug)) {
      setActiveTemplateUuid(template.uuid);
      setIsFlowDialogOpen(true);
    } else
      setSelectedTemplates((items) => {
        if (items.some((e) => e.uuid === template.uuid))
          return items.filter((it) => it.uuid !== template.uuid);
        else return [...items, { uuid: template.uuid }];
      });
  }, []);

  return (
    <>
      <DialogComponent
        titleText="reports-gallery"
        maxWidth="lg"
        contentOverflowY="hidden"
        dialogContent={
          <div className="my-4 explore-library-dialog-wrapper">
            <div>
              <div className="d-flex-column side-bar-buttons">
                {[{ slug: null, title: t('all') }, ...features].map(
                  (feature, idx) => (
                    <ButtonBase
                      key={`feature-${feature.slug}-${idx}`}
                      className={`btns theme-transparent my-1 ${
                        feature.slug === filters.feature ? 'is-active' : ''
                      }`}
                      onClick={() => {
                        setFilters((items) => ({
                          ...items,
                          feature: feature.slug,
                          page: 1,
                        }));
                      }}
                      disabled={feature.is_disabled}
                    >
                      <span
                        className={`width-100-align-text ${
                          i18next.language === 'ar' ? 'rtl' : ''
                        } `}
                      >
                        {feature?.title?.[i18next.language]
                          || feature?.title?.en
                          || feature?.title}
                      </span>
                    </ButtonBase>
                  ),
                )}
              </div>
            </div>
            <div
              className="w-100 explore-library-templates-wrapper"
              ref={templateWrapperRef}
            >
              {templates.results.map((template, idx) => (
                <div
                  className="explore-library-template-item"
                  key={`${template.slug}-${idx}-template`}
                >
                  <SharedChart
                    data={template.dummy_value}
                    text1={template.title[i18next.language] || template.title.en}
                    text2={t('unique')}
                    text3={`, ${t('default')}`}
                    text4={t(template.feature)}
                    wrapperClasses="m-2"
                    parentTranslationPath={parentTranslationPath}
                    chartType={template.chart_type}
                    options={ChartOptions?.[template.chart_type]}
                    isLoading={isLoading}
                    is_static
                    onSelectHandler={() =>
                      selectTemplateHandler(template, selectedTemplates)
                    }
                    isSelected={isTemplateSelected(template.uuid)}
                    widgetIndex={idx}
                    smallSize={template.small_size}
                    tableData={
                      AnalyticsStaticDashboardEnum?.[template.feature]?.[
                        template.slug
                      ]?.tableData
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        }
        isSaving={isLoading}
        isOpen={isOpen}
        isOldTheme
        onSaveClicked={(e) => {
          e.preventDefault();
          AddStaticWidgetToCustomDashboardHandler();
        }}
        onCloseClicked={() => setIsOpen(false)}
        onCancelClicked={() => setIsOpen(false)}
        parentTranslationPath={parentTranslationPath}
        saveIsDisabled={!selectedTemplates.length}
      />

      {isPipelineFeatureOpen && (
        <PipelineFeatureDialog
          isOpen={isPipelineFeatureOpen}
          setIsOpen={setIsPipelineFeatureOpen}
          parentTranslationPath={parentTranslationPath}
          setSelectedPipeLine={setSelectedPipeLine}
          isPipeLine={true}
        />
      )}
      {isFlowDialogOpen && (
        <FlowDialog
          isOpen={isFlowDialogOpen}
          onSave={(state) => {
            setSelectedTemplates((items) => [
              ...items,
              { uuid: activeTemplateUuid, payload: state },
            ]);
            setIsFlowDialogOpen(false);
          }}
          onClose={() => {
            setIsFlowDialogOpen(false);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </>
  );
};

ExploreLibraryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  dashboard_uuid: PropTypes.string.isRequired,
  setDashboardFilters: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
