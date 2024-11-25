import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEventListener, useQuery, useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
// import userimg from '../activity/components/user.jpg';
import { ResponsesIcon, SearchIcon } from '../../../assets/icons';
import { ResponsesTabs } from './tabs/Responses.Tabs';
import { PopoverComponent, TabsComponent } from '../../../components';
import './Responses.Page.scss';
import { SharedInputControl } from '../../setups/shared';
import i18next from 'i18next';

import { showError } from '../../../helpers';
import {
  OnboardingGroupByActionsEnum,
  OnboardingSortByActionsEnum,
} from '../../../enums';
import { OnboardingFiltersDisplaySection } from '../shared/sections/onboarding-filters-display/OnboardingFiltersDisplay.Section';

const parentTranslationPath = 'OnboardingPage';
const translationPath = 'ResponsesPage.';

const ResponsesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding---responses`));
  const bodyRef = useRef(null);
  const isLoadingRef = useRef(false);
  const query = useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [responsesTabsData] = useState(() => ResponsesTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const [expandedAccordions, setExpandedAccordions] = useState([0]);
  const [fetchedData, setFetchedData] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    group: '',
    sort: '',
    search: '',
    user_uuid: '',
    task: '',
  });
  const [popovers, setPopovers] = useState({
    sort: { ref: null },
    group: { ref: null },
  });

  const [tableColumns, setTableColumns] = useState([
    {
      id: 1,
      input: 'question',
      label: t('question'),
      isHidden: false,
      cellClasses: 'w-30',
      component: (row) => (
        <span className={'responses-question'}>{row.question}</span>
      ),
    },
    {
      id: 2,
      input: 'reply',
      label: t('reply'),
      isHidden: false,
      cellClasses: 'w-30',
      component: (row) => <span className={'responses-reply'}>{row.reply}</span>,
    },
    {
      id: 3,
      input: 'content_section',
      label: t('content-section'),
      isHidden: false,
      component: (row) => (
        <span className={'table-tag py-1 px-2'}>{row.content_section}</span>
      ),
    },
    {
      id: 4,
      input: 'flow',
      label: t('flow'),
      isHidden: false,
      component: (row) => <span className={'table-tag py-1 px-2'}>{row.flow}</span>,
    },
    {
      id: 5,
      input: 'space',
      label: t('space'),
      isHidden: false,
      component: (row) => <span className={'table-tag py-1 px-2'}>{row.space}</span>,
    },
  ]);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const resetData = useCallback(() => {
    setFetchedData({ results: [], totalCount: 0 });
  }, []);
  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);
  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    // setBranches((items) => {
    //   const localItems = { ...items };
    //   const localItemIndex = localItems.results.findIndex(
    //     (item) => item[primary_key] === row[primary_key]
    //   );
    //   if (localItemIndex === -1) return items;
    //   localItems.results[localItemIndex][key]
    //     = !localItems.results[localItemIndex][key];
    //   return JSON.parse(JSON.stringify(localItems));
    // });
    getOnboardingResponses().catch((error) => console.log(error));
  };
  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  // const getOnboardingTableColumns= useCallback(async () => {
  //
  //   const res = await GetOnboardingTableColumns( );
  //   if(res)
  //     setTableColumns( )
  //
  //
  //
  // }, []);
  // useEffect(() => {
  //   getOnboardingTableColumns().catch((error) => console.log(error));
  // }, [getOnboardingTableColumns]);

  const getOnboardingResponses = useCallback(async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    const res = await responsesTabsData[activeTab].getDataFuction({
      ...filter,
      sort_by: filter?.sort?.sort_by,
      order: filter?.sort?.order,
      group_by: filter?.group?.group_by,
    });
    setIsLoading(false);
    isLoadingRef.current = false;
    if (res)
      if (filter.page === 1)
        // && res.status === 200
        setFetchedData({
          results: res.data.results || [],
          totalCount: res.data.paginate?.total || 0,
        });
      else
        setFetchedData((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
        }));
    else {
      setFetchedData({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), res);
    }
  }, [activeTab, filter, responsesTabsData, t]);

  useEffect(() => {
    getOnboardingResponses().catch((error) => console.log(error));
  }, [getOnboardingResponses]);
  const handleOpenPopover = useCallback((e, type) => {
    setPopovers((item) => ({
      ...item,
      [type]: { ref: e?.target || null },
    }));
  }, []);
  const filterChange = useCallback((name, value) => {
    setFilter((filters) => ({ ...filters, limit: 10, page: 1, [name]: value }));
    setFetchedData({ results: [], totalCount: 0 });
    setExpandedAccordions([0]);
  }, []);
  const handleSortByAndGroupBy = useCallback(
    (type, action) => {
      setPopovers((item) => ({ ...item, [type]: { ref: null } }));
      filterChange(type, action);
    },
    [filterChange],
  );
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
  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search) {
      setFetchedData({ results: [], totalCount: 0 });
      setFilter((filters) => ({
        ...filters,
        limit: 10,
        page: 1,
        search: textSearch.value,
      }));
      setExpandedAccordions([0]);
    }
  }, [textSearch, filter]);
  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 1
      && fetchedData.results.length < fetchedData.totalCount
      && !isLoadingRef.current
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [fetchedData?.results?.length, isLoading, fetchedData.totalCount]);
  const extractName = useCallback(
    (option) =>
      `${
        option.first_name
        && (option.first_name[i18next.language] || option.first_name.en)
      }${
        option.last_name
        && ` ${option.last_name[i18next.language] || option.last_name.en}`
      }` || 'N/A',
    [],
  );
  const resetFilters = useCallback(() => {
    setFetchedData({
      results: [],
      totalCount: 0,
    });
    setTextSearch({ open: false, value: '' });
    setExpandedAccordions([0]);
    setFilter({
      limit: 10,
      page: 1,
      group: '',
      sort: '',
      search: '',
      user_uuid: '',
      task: '',
    });
    setPopovers({
      sort: { ref: null },
      group: { ref: null },
    });
  }, []);
  useEventListener('scroll', onScrollHandler, bodyRef.current);

  // this is to change the default active tab on reload or redirect
  useEffect(() => {
    const localActiveTab = query.get('activeTab');
    if (localActiveTab) setActiveTab(+localActiveTab);
  }, [query]);
  const sortByActions = useMemo(
    () => Object.values(OnboardingSortByActionsEnum),
    [],
  );
  const groupByActions = useMemo(
    () => Object.values(OnboardingGroupByActionsEnum),
    [],
  );
  const onFilterResetClicked = useCallback(() => {
    setFilter((items) => ({
      ...items,
      page: 1,
      sort: '',
      group: '',
      search: '',
    }));
    setExpandedAccordions([0]);
    resetData();
  }, [resetData]);
  const filtersComponent = () => (
    <>
      <div className={`d-flex-v-center-h-between my-1 `}>
        {activeTab === 0 ? (
          <span className="font-12 font-weight-500 c-gray-primary">
            {`${t(`${translationPath}showing-replies`)} ${fetchedData?.totalCount} ${
              (i18next.language !== 'ar' && t('replies')) || ''
            }`}
          </span>
        ) : (
          <div className="d-inline-flex-v-center   flex-wrap my-1 autocomplete-part">
            <span className="font-12 font-weight-500 c-gray-primary">
              {`${t(`${translationPath}showing-tasks`)} ${fetchedData?.totalCount} ${
                (i18next.language !== 'ar' && t('tasks')) || ''
              }`}
            </span>
            {/*<SharedAPIAutocompleteControl*/}
            {/*  stateKey="user_uuid"*/}
            {/*  getDataAPI={GetAllOnboardingMembers}*/}
            {/*  editValue={filter?.member}*/}
            {/*  onValueChanged={(value) => {*/}
            {/*    filterChange('member', value.value);*/}
            {/*  }}*/}
            {/*  getOptionLabel={(val) => val.name}*/}
            {/*  placeholder={'all-members'}*/}
            {/*  parentTranslationPath={parentTranslationPath}*/}
            {/*  translationPath={translationPath}*/}
            {/*  searchKey="search"*/}
            {/*  controlWrapperClasses={'mb-0 '}*/}
            {/*  type={DynamicFormTypesEnum.select.key}*/}
            {/*  extraProps={{*/}
            {/*    ...(filter?.member && { with_than: [filter.member] }),*/}
            {/*    use_for:'dropdown',*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<SharedAPIAutocompleteControl*/}
            {/*  stateKey="task"*/}
            {/*  getDataAPI={GetAllOnboardingTasks}*/}
            {/*  editValue={filter?.task}*/}
            {/*  onValueChanged={(value) => {*/}
            {/*    filterChange('task', value.value);*/}
            {/*  }}*/}
            {/*  getOptionLabel={(val) => extractName(val)}*/}
            {/*  placeholder={'all-tasks'}*/}
            {/*  parentTranslationPath={parentTranslationPath}*/}
            {/*  translationPath={translationPath}*/}
            {/*  searchKey="search"*/}
            {/*  controlWrapperClasses={'mb-0 '}*/}
            {/*  type={DynamicFormTypesEnum.select.key}*/}
            {/*  extraProps={{*/}
            {/*    ...(filter?.task && { with_than: [filter.task] }),*/}
            {/*  }}*/}
            {/*/>*/}
          </div>
        )}

        <div className="my-1 d-inline-flex-v-center">
          {textSearch.open ? (
            <SharedInputControl
              idRef="searchRef"
              placeholder="search"
              themeClass="theme-transparent"
              wrapperClasses={'mb-0'}
              onKeyDown={(e) => {
                e.key === 'Enter' && handleCloseSearchText();
              }}
              stateKey="search"
              endAdornment={
                <span
                  className="end-adornment-wrapper"
                  onClick={() => {
                    handleCloseSearchText();
                  }}
                  onKeyDown={() => {
                    handleCloseSearchText();
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <SearchIcon />
                </span>
              }
              onValueChanged={(newValue) => {
                setTextSearch((items) => ({
                  ...items,
                  value: newValue?.value || '',
                }));
              }}
              parentTranslationPath={parentTranslationPath}
              // translationPath={translationPath}
              editValue={textSearch.value}
            />
          ) : (
            <ButtonBase
              className="btns-icon theme-transparent"
              onClick={() => setTextSearch((item) => ({ ...item, open: true }))}
            >
              <SearchIcon />
            </ButtonBase>
          )}
          {activeTab === 1 && (
            <ButtonBase
              onClick={(e) => {
                handleOpenPopover(e, 'group');
              }}
              className="btns theme-transparent  px-2 miw-0 c-gray-primary"
            >
              <span className=" ">{t(`group-by`)}</span>
              {filter?.group?.label ? (
                <span className="px-1  c-black-lighter ">
                  {t(filter.group.label)}
                </span>
              ) : null}
            </ButtonBase>
          )}

          <ButtonBase
            onClick={(e) => {
              handleOpenPopover(e, 'sort');
            }}
            className="btns theme-transparent  px-2 miw-0 c-gray-primary"
          >
            <span className=" ">{t(`sort-by`)}</span>
            {filter?.sort?.label ? (
              <span className="px-1  c-black-lighter ">{t(filter.sort.label)}</span>
            ) : null}
          </ButtonBase>
          {/*<div className="d-inline-flex-v-center">*/}
          {/*  <TableColumnsPopoverComponent*/}
          {/*    columns={tableColumns}*/}
          {/*    feature_name={TablesNameEnum.Company.key}*/}
          {/*    onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}*/}
          {/*    onColumnsChanged={onColumnsChanged}*/}
          {/*    onReloadData={onReloadDataHandler}*/}
          {/*    isLoading={isLoading}*/}
          {/*  />*/}

          {/*</div>*/}
        </div>
      </div>
      <div className="d-flex flex-wrap mt-2 mb-3">
        <OnboardingFiltersDisplaySection
          filter={filter}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setFilter={setFilter}
          onFilterResetClicked={onFilterResetClicked}
          onFilterChange={filterChange}
        />
      </div>
    </>
  );

  return (
    <div className="activity-page-wrapper page-wrapper" id="responses-page">
      <div className="d-flex-h-between flex-wrap mb-3">
        <div className="d-inline-flex-v-center">
          <ButtonBase
            className="btns theme-transparent mx-0 miw-0 c-gray-primary  font-12"
            onClick={() => {}}
          >
            <span>{t(`Eva Board`)}</span>
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
          <div className="d-inline-flex dark-text-color mt-1">
            <span className=" ">
              <span className="px-1">
                <ResponsesIcon />
              </span>
              <span className="px-2 font-weight-700 ">
                {t(`${translationPath}responses`)}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="mx-0 my-2">
        <TabsComponent
          data={responsesTabsData}
          currentTab={activeTab}
          labelInput="label"
          idRef="ActivityTabsRef"
          isPrimary
          onTabChanged={(event, currentTab) => {
            resetFilters();
            setActiveTab(currentTab);
          }}
          isDisabled={isLoading}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          scrollButtons="auto"
          componentInput={'component'}
          isWithLine={true}
          dynamicComponentProps={{
            parentTranslationPath,
            translationPath,
            filter,
            onChangeAccordion,
            filtersComponent,
            bodyRef,
            onScrollHandler,
            extractName,
            isLoading,
            tableData: fetchedData,
            // tableColumns,
            expandedAccordions,
          }}
        />
      </div>
      <PopoverComponent
        idRef="widget-ref"
        attachedWith={popovers?.sort?.ref}
        handleClose={() => {
          handleOpenPopover(null, 'sort');
        }}
        popoverClasses="columns-popover-wrapper"
        component={
          <div className="d-flex-column p-2 w-100">
            {sortByActions.map((action, idx) => (
              <ButtonBase
                key={`${idx}-${action.key}-popover-action`}
                className="btns theme-transparent justify-content-start m-1"
                onClick={() => {
                  handleSortByAndGroupBy('sort', action);
                }}
              >
                <span className="px-2">{t(action.label)}</span>
              </ButtonBase>
            ))}
          </div>
        }
      />
      <PopoverComponent
        idRef="widget-ref"
        attachedWith={popovers?.group?.ref}
        handleClose={() => {
          handleOpenPopover(null, 'group');
        }}
        popoverClasses="columns-popover-wrapper"
        component={
          <div className="d-flex-column p-2 w-100">
            {groupByActions.map((action, idx) => (
              <ButtonBase
                key={`${idx}-${action.key}-popover-action`}
                className="btns theme-transparent justify-content-start m-1"
                onClick={() => {
                  handleSortByAndGroupBy('group', action);
                }}
              >
                <span className="px-2">{t(action.label)}</span>
              </ButtonBase>
            ))}
          </div>
        }
      />
    </div>
  );
};
export default ResponsesPage;
