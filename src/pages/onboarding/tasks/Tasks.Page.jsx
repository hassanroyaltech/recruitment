import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { ResponsesIcon } from '../../../assets/icons';
import { TabsComponent } from '../../../components';
import '../responses/Responses.Page.scss';
import { TasksTabs } from './tabs/Tasks.Tab';
import { TasksFilterSection } from './sections';
import { FormsSubmissionsLevelsTypesEnum } from '../../../enums';

const parentTranslationPath = 'OnboardingPage';
const translationPath = 'TasksPage.';

const TasksPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding-tasks`));
  const bodyRef = useRef(null);
  const query = useQuery();
  const [tasksTabsData] = useState(() => TasksTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedAccordions, setExpandedAccordions] = useState([0]);
  const filterInitRef = useRef({
    limit: 10,
    page: 1,
    type: FormsSubmissionsLevelsTypesEnum.FormLevel.key,
    status: '',
    use_for: 'list',
    group: '',
    sort: '',
    search: '',
    member: '',
    task: '',
  });
  const [filter, setFilter] = useState({ ...filterInitRef.current });

  const onChangeAccordion = useCallback(
    (index) => {
      if (expandedAccordions.includes(index)) {
        setExpandedAccordions((items) => items.filter((item) => item !== index));
        return;
      }
      setExpandedAccordions((items) => [...items, index]);
    },
    [expandedAccordions],
  );

  /**
   * @param newValue - this is an object of the new value for the keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update filter from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  /**
   * @param newValue - this is array of indexes
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update expanded accordions from child
   */
  const onExpandedAccordionsChanged = useCallback((newValue) => {
    setExpandedAccordions(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to load more data on scroll the container of the list to the end or not scrollable yet
   * (do not copy this method from this page it is handle a special cases)
   */
  const onScrollHandler = useCallback(
    (localData) => () => {
      if (
        bodyRef.current.offsetHeight + bodyRef.current.scrollTop
          >= bodyRef.current.scrollHeight - 5
        && localData.results.length < localData.totalCount
      )
        setFilter((items) => ({ ...items, page: items.page + 1 }));
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setExpandedAccordions([0]);
    setFilter({ ...filterInitRef.current });
  }, []);
  // useEventListener('scroll', onScrollHandler, bodyRef.current);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the tasks filters in the header of each tab
   */
  const FilterComponent = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => (
      <TasksFilterSection
        filter={filter}
        isWithFormLevelFilter={activeTab === 1 || activeTab === 2}
        onFilterChanged={onFilterChanged}
        onExpandedAccordionsChanged={onExpandedAccordionsChanged}
        onFilterResetClicked={resetFilters}
        isShowGroup={
          activeTab === 0
          || filter.type === FormsSubmissionsLevelsTypesEnum.FieldsLevel.key
        }
        isWithStatus={activeTab === 0}
        isShowSort={true}
        // onFetchedDataChanged={onFetchedDataChanged}
      />
    ),
    [activeTab, filter, onExpandedAccordionsChanged, onFilterChanged, resetFilters],
  );

  // this is to change the default active tab on reload or redirect
  useEffect(() => {
    const localActiveTab = query.get('activeTab');
    if (localActiveTab) setActiveTab(+localActiveTab);
  }, [query]);

  return (
    <div className="tasks-page-wrapper page-wrapper">
      <div className="d-flex-h-between flex-wrap mb-3">
        <div className="d-inline-flex-v-center">
          <ButtonBase
            className="btns theme-transparent mx-0 miw-0 c-gray-primary  font-12"
            onClick={() => {}}
          >
            <span>{t(`${translationPath}eva-board`)}</span>
          </ButtonBase>
          <span>
            <span className="fas fa-long-arrow-alt-right mx-2 font-12" />
            <span className="c-black-light mx-2">
              {t(`${translationPath}all-invited-members`)}
            </span>
          </span>
        </div>
      </div>
      <div className="d-flex-v-center-h-between flex-wrap my-2">
        <div className="d-inline-flex header-text-x2 flex-wrap mb-2">
          <div className="d-inline-flex dark-text-color  mt-1">
            <span className="px-1">
              <ResponsesIcon />
            </span>
            <span className="px-2 font-weight-700 ">
              {t(`${translationPath}tasks`)}
            </span>
          </div>
        </div>
        <div className="d-inline-flex">
          {/*TO DO : assign button */}
          {/*<ButtonBase disabled className="btns theme-transparent">*/}
          {/*  <span className="fas fa-plus" />*/}
          {/*  <span className="px-1">{t(`${translationPath}assign`)}</span>*/}
          {/*</ButtonBase>*/}
        </div>
      </div>
      <div className="mx-0 my-2">
        <TabsComponent
          data={tasksTabsData}
          currentTab={activeTab}
          labelInput="label"
          idRef="ActivityTabsRef"
          isPrimary
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
            resetFilters();
          }}
          // isDisabled={isLoading}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          scrollButtons="auto"
          componentInput={'component'}
          isWithLine={true}
          dynamicComponentProps={{
            parentTranslationPath,
            filter,
            onFilterChanged,
            onChangeAccordion,
            bodyRef,
            onScrollHandler,
            // isLoading,
            expandedAccordions,
            FilterComponent,
          }}
        />
      </div>
      {/*<PopoverComponent*/}
      {/*  idRef="widget-ref"*/}
      {/*  attachedWith={popOvers.sort_by.ref}*/}
      {/*  handleClose={() => {*/}
      {/*    handleOpenPopover(null, 'sort_by');*/}
      {/*  }}*/}
      {/*  popoverClasses="columns-popover-wrapper"*/}
      {/*  component={*/}
      {/*    <div className="d-flex-column p-2 w-100">*/}
      {/*      {[*/}
      {/*        {*/}
      {/*          key: 1,*/}
      {/*          label: 'progress',*/}
      {/*        },*/}
      {/*      ].map((action, idx) => (*/}
      {/*        <ButtonBase*/}
      {/*          key={`${idx}-${action.key}-popover-action`}*/}
      {/*          className="btns theme-transparent justify-content-start m-1"*/}
      {/*          onClick={() => {*/}
      {/*            handleSortByAndGroupBy('sort_by', action.key, action.label);*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <span className="px-2">{t(action.label)}</span>*/}
      {/*        </ButtonBase>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*/>*/}
      {/*<PopoverComponent*/}
      {/*  idRef="widget-ref"*/}
      {/*  attachedWith={popOvers.group_by.ref}*/}
      {/*  handleClose={() => {*/}
      {/*    handleOpenPopover(null, 'group_by');*/}
      {/*  }}*/}
      {/*  popoverClasses="columns-popover-wrapper"*/}
      {/*  component={*/}
      {/*    <div className="d-flex-column p-2 w-100">*/}
      {/*      {[*/}
      {/*        {*/}
      {/*          key: 1,*/}
      {/*          label: 'members',*/}
      {/*        },*/}
      {/*      ].map((action, idx) => (*/}
      {/*        <ButtonBase*/}
      {/*          key={`${idx}-${action.key}-popover-action`}*/}
      {/*          className="btns theme-transparent justify-content-start m-1"*/}
      {/*          onClick={() => {*/}
      {/*            handleSortByAndGroupBy('group_by', action.key, action.label);*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <span className="px-2">{t(action.label)}</span>*/}
      {/*        </ButtonBase>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*/>*/}
    </div>
  );
};
export default TasksPage;
