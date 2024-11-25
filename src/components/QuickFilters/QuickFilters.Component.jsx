import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  CheckboxesComponent,
  LoaderComponent,
  PopoverComponent,
  TooltipsComponent,
} from '../index';
import { showError, showSuccess } from '../../helpers';
import {
  FilterDialogCallLocationsEnum,
  PipelineQuickFilterLocationsEnum,
  PipelineQuickFilterTypesEnum,
} from '../../enums';
import { GetQuickFiltersService, UpdateQuickFiltersService } from '../../services';
import './QuickFilters.Style.scss';
import FilterContentSection from '../Filters/Sections/FilterContent/FilterContent.Section';

const QuickFiltersComponent = ({
  moduleKey = PipelineQuickFilterLocationsEnum.JobPipeline.key,
  onApply,
  isWithCheckboxes,
  isWithSliders,
  filterEditValue,
  filterEditValueTags,
  hideIncomplete,
  // showTags,
  callLocation,
  job_uuid,
  hideIncludeExclude,
  showAssessmentTestFilter,
  hideSourceFilter,
  hideReferenceAndApplicant,
  hideAssigneeFilters,
  // showRmsFilters,
  showCandidateType,
  isShowHeightAndWeight,
  isShowVideoAssessmentFilter,
  isShowQuestionnaireFilter,
  isShowDynamicProperty,
  isShowAssigneeFilter,
  parentTranslationPath = 'EvarecRecModals',
  translationPath = '',isShowAge
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    filters: [],
    notSavedFilters: [],
  });
  const [pipelineQuickFilterTypesEnum] = useState(() =>
    Object.values(PipelineQuickFilterTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);

  /**
   * @param event - the event of attached item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the popover
   */
  const popoverToggleHandler = useCallback((event) => {
    setPopoverAttachedWith((event && event.currentTarget) || null);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if all items are selected in
   * the quick filters or not
   */
  const getIsAllSelected = useMemo(
    () => quickFilters.notSavedFilters.every((item) => item.status),
    [quickFilters.notSavedFilters],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the active key enum item
   * to control the key settings
   */
  const getActiveKeyEnumItem = useMemo(
    () =>
      ({ itemKey }) =>
        pipelineQuickFilterTypesEnum.find((item) => item.key === itemKey),
    [pipelineQuickFilterTypesEnum],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if some items are selected in
   * the quick filters or not
   */
  const getIsSomeSelected = useMemo(
    () => quickFilters.notSavedFilters.some((item) => item.status),
    [quickFilters.notSavedFilters],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to select all items if not all items selected
   * and vise versa if non is selected
   */
  const onSelectAllFilterHandler = useCallback(() => {
    if (getIsAllSelected)
      setQuickFilters((items) => ({
        ...items,
        notSavedFilters: items.notSavedFilters.map((item) => ({
          ...item,
          status: false,
        })),
      }));
    else
      setQuickFilters((items) => ({
        ...items,
        notSavedFilters: items.notSavedFilters.map((item) => ({
          ...item,
          status: true,
        })),
      }));
  }, [getIsAllSelected]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the status of the clicked
   * checkbox
   */
  const onSelectFilterHandler = useCallback(
    (index) => () => {
      setQuickFilters((items) => {
        let localItems = [...items.notSavedFilters];
        localItems[index].status = !localItems[index].status;
        if (!localItems[index].status) {
          const currentItemType = getActiveKeyEnumItem({
            itemKey: localItems[index].key,
          });
          if (currentItemType && currentItemType.childKeys)
            localItems = localItems.map((item) => {
              if (currentItemType.childKeys.includes(item.key)) item.status = false;
              return item;
            });
        }

        return {
          ...items,
          notSavedFilters: localItems,
        };
      });
    },
    [getActiveKeyEnumItem],
  );

  const getIsDisabledIfParentNotSelected = useMemo(
    () =>
      ({ itemKey }) => {
        const currentItemType = getActiveKeyEnumItem({
          itemKey,
        });
        if (currentItemType && currentItemType.parentKeys)
          return !quickFilters.notSavedFilters.some(
            (item) => currentItemType.parentKeys.includes(item.key) && item.status,
          );
        return false;
      },
    [getActiveKeyEnumItem, quickFilters.notSavedFilters],
  );

  const updateQuickFilters = async () => {
    setIsLoading(true);
    const response = await UpdateQuickFiltersService({
      filters: quickFilters.notSavedFilters,
      key: moduleKey,
    });
    setIsLoading(true);
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}quick-filters-updated-successfully`));
      setQuickFilters((items) => ({
        ...items,
        filters: [...items.notSavedFilters],
      }));
      setPopoverAttachedWith(null);
    } else showError(t(`${translationPath}quick-filters-update-failed`), response);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description get the quick filters with its status from backend by feature name
   */
  const getInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetQuickFiltersService({
      key: moduleKey,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setQuickFilters({
        ...response.data.results,
        notSavedFilters: response.data.results.filters,
      });
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [moduleKey, t]);

  useEffect(() => {
    void getInit();
  }, [getInit]);

  return (
    <div className="quick-filters-section-wrapper">
      <FilterContentSection
        onApply={onApply}
        isWithCheckboxes={isWithCheckboxes}
        isWithSliders={isWithSliders}
        filterEditValue={filterEditValue}
        filterEditValueTags={filterEditValueTags}
        hideIncomplete={hideIncomplete}
        callLocation={callLocation}
        job_uuid={job_uuid}
        hideIncludeExclude={hideIncludeExclude}
        showAssessmentTestFilter={showAssessmentTestFilter}
        hideSourceFilter={hideSourceFilter}
        hideReferenceAndApplicant={hideReferenceAndApplicant}
        hideAssigneeFilters={hideAssigneeFilters}
        // showRmsFilters={showRmsFilters}
        showCandidateType={showCandidateType}
        isShowHeightAndWeight={isShowHeightAndWeight}
        isShowVideoAssessmentFilter={isShowVideoAssessmentFilter}
        isShowQuestionnaireFilter={isShowQuestionnaireFilter}
        isShowDynamicProperty={isShowDynamicProperty}
        isShowAssigneeFilter={isShowAssigneeFilter}
        quickFilters={quickFilters.filters}
        isQuarterWidth
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isShowAge={isShowAge}
      />
      <TooltipsComponent
        title="quick-filters"
        contentComponent={
          <span>
            <ButtonBase
              disabled={isLoading}
              onClick={popoverToggleHandler}
              className="btns-icon theme-transparent mb-3"
            >
              <span className="fas fa-filter" />
            </ButtonBase>
          </span>
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <PopoverComponent
        idRef={`quickFiltersPopoverRef${moduleKey}`}
        attachedWith={popoverAttachedWith}
        handleClose={() => {
          setQuickFilters((items) => ({
            ...items,
            notSavedFilters: [...items.filters],
          }));
          popoverToggleHandler(null);
        }}
        popoverClasses="quick-filters-popover-wrapper"
        component={
          <div className="quick-filters-wrapper">
            <div className="quick-filters-header">
              <span>
                {quickFilters.notSavedFilters.filter((item) => item.status).length}
              </span>
              <span className="px-1">{t('of')}</span>
              <span>{quickFilters.filters.length}</span>
            </div>
            <div className="quick-filters-body">
              <ButtonBase
                className="btns theme-transparent fj-start w-100 mx-0 br-0"
                onClick={onSelectAllFilterHandler}
              >
                <CheckboxesComponent
                  idRef={`checkbox-all-${moduleKey}`}
                  label="all"
                  isDisabled={isLoading}
                  singleChecked={getIsAllSelected}
                  singleIndeterminate={getIsSomeSelected && !getIsAllSelected}
                  parentTranslationPath={parentTranslationPath}
                />
              </ButtonBase>
              {quickFilters.notSavedFilters.map(
                (item, index) =>
                  (
                    <ButtonBase
                      key={`checkbox${item.key}-${index + 1}`}
                      className="btns theme-transparent fj-start w-100 mx-0 br-0"
                      onClick={onSelectFilterHandler(index)}
                      disabled={
                        item.isDisabled
                        || getActiveKeyEnumItem({
                          itemKey: item.key,
                        })?.isDisabled
                        || isLoading
                        || getIsDisabledIfParentNotSelected({
                          itemKey: item.key,
                        })
                      }
                    >
                      <CheckboxesComponent
                        idRef={`checkbox${moduleKey}${index + 1}`}
                        label={
                          getActiveKeyEnumItem({
                            itemKey: item.key,
                          })?.value
                        }
                        isDisabled={
                          item.isDisabled
                          || getActiveKeyEnumItem({
                            itemKey: item.key,
                          })?.isDisabled
                          || isLoading
                          || getIsDisabledIfParentNotSelected({
                            itemKey: item.key,
                          })
                        }
                        singleChecked={item.status}
                      />
                    </ButtonBase>
                  ) || undefined,
              )}
            </div>
            <div className="quick-filters-footer">
              <ButtonBase
                className="btns theme-transparent w-100 mx-0"
                disabled={isLoading}
                onClick={() => {
                  setQuickFilters((items) => ({
                    ...items,
                    notSavedFilters: [...items.filters],
                  }));
                  popoverToggleHandler(null);
                }}
              >
                <span>{t('Shared:cancel')}</span>
              </ButtonBase>
              <div className="separator-v py-3" />
              <ButtonBase
                className="btns theme-transparent w-100 mx-0"
                onClick={updateQuickFilters}
                disabled={isLoading}
              >
                <LoaderComponent
                  isLoading={isLoading}
                  isSkeleton
                  wrapperClasses="position-absolute w-100 h-100"
                  skeletonStyle={{ width: '100%', height: '100%' }}
                />
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </div>
          </div>
        }
      />
    </div>
  );
};

QuickFiltersComponent.displayName = 'QuickFiltersComponent';

QuickFiltersComponent.propTypes = {
  moduleKey: PropTypes.string,
  callLocation: PropTypes.oneOf(
    Object.values(FilterDialogCallLocationsEnum).map((item) => item.key),
  ).isRequired,
  isWithSliders: PropTypes.bool,
  onApply: PropTypes.func,
  isWithCheckboxes: PropTypes.bool,
  filterEditValue: PropTypes.shape({}),
  filterEditValueTags: PropTypes.instanceOf(Array),
  hideIncomplete: PropTypes.bool,
  // showTags: PropTypes.bool,
  job_uuid: PropTypes.string,
  hideIncludeExclude: PropTypes.bool,
  showAssessmentTestFilter: PropTypes.bool,
  hideSourceFilter: PropTypes.bool,
  hideReferenceAndApplicant: PropTypes.bool,
  hideAssigneeFilters: PropTypes.bool,
  // showRmsFilters: PropTypes.bool,
  showCandidateType: PropTypes.bool,
  isShowHeightAndWeight: PropTypes.bool,
  isShowVideoAssessmentFilter: PropTypes.bool,
  isShowQuestionnaireFilter: PropTypes.bool,
  isShowDynamicProperty: PropTypes.bool,
  isShowAssigneeFilter: PropTypes.bool,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  isShowAge:PropTypes.bool
};

export default memo(QuickFiltersComponent);
