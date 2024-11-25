import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { SearchIcon } from '../../../assets/icons';
import TablesComponent from '../../../components/Tables/Tables.Component';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../setups/shared';
import {
  globalSelectedRowHandler,
  globalSelectedRowsHandler,
  showError,
  showSuccess,
} from '../../../helpers';
import { PopoverComponent, TableColumnsPopoverComponent } from '../../../components';
import {
  DynamicFormTypesEnum,
  OnboardingSortByActionsEnum,
  TablesNameEnum,
} from '../../../enums';
import { MemberIcon } from '../../../assets/icons/Member.Icon';
import {
  ExportFlowsByMembersUUIDS,
  GetAllOnboardingMembers
} from '../../../services';
import { ProfileDrawer } from './component/Drawer/Profile.Drawer';
import PropTypes from 'prop-types';
import { OnboardingFiltersDisplaySection } from '../shared/sections/onboarding-filters-display/OnboardingFiltersDisplay.Section';

const parentTranslationPath = 'OnboardingPage';
const translationPath = 'MembersPage.';

const MembersPage = ({ isFromTabs, space_uuid, folder_uuid }) => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding-members`));
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [members, setMembers] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [popovers, setPopovers] = useState({
    sort: { ref: null },
    group: { ref: null },
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    status: false,
    use_for: 'list',
    group_by: '',
    sort: '',
    search: '',
    space_uuid,
    folder_uuid,
    member: '',
  });
  const [activeItem, setActiveItem] = useState(null);
  const [openedRatingDrawer, setOpenedRatingDrawer] = useState(false);
  const resetData = useCallback(() => {
    setMembers({ results: [], totalCount: 0 });
  }, []);
  const getOnboardingMembers = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllOnboardingMembers({
      ...filter,
      sort_by: filter?.sort?.sort_by,
      order: filter?.sort?.order,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setMembers({
        results: response.data.results,
        totalCount: response.data.paginate.total,
      });
    else {
      setMembers({
        results: [],
        totalCount: 0,
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, t]);

  const onColumnsChanged = useCallback((newValue) => {
    setTableColumns(newValue);
  }, []);

  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search)
      setFilter((filters) => ({
        ...filters,
        page: 1,
        search: textSearch.value,
      }));
  }, [filter.search, textSearch.value]);

  const onIsLoadingColumnsChanged = useCallback((newValue) => {
    setIsLoadingColumns(newValue);
  }, []);

  // const redirectionToFlowHandler = useCallback(async () => {
  //   GlobalHistory.push(
  //     `/forms?code=${DefaultFormsTypesEnum.Flows.key}&source=${NavigationSourcesEnum.OnboardingMembersToFormBuilder.key}`
  //   );
  // }, []);

  const onReloadDataHandler = ({ row, viewItem: { key, primary_key } }) => {
    setMembers((items) => {
      const localItems = { ...items };
      const localItemIndex = localItems.results.findIndex(
        (item) => item[primary_key] === row[primary_key],
      );
      if (localItemIndex === -1) return items;
      localItems.results[localItemIndex][key]
        = !localItems.results[localItemIndex][key];
      return JSON.parse(JSON.stringify(localItems));
    });
    // getAllSetupsUserBranches();
  };

  const filterChange = useCallback(
    (name, value) => {
      setFilter((filters) => ({ ...filters, page: 1, [name]: value }));
      resetData();
    },
    [resetData],
  );
  const handleOpenPopover = useCallback((e, type) => {
    setPopovers((item) => ({
      ...item,
      [type]: { ref: e?.target || null },
    }));
  }, []);
  const handleSortByAndGroupBy = useCallback(
    (type, action) => {
      setPopovers((item) => ({ ...item, [type]: { ref: null } }));
      filterChange(type, action);
    },
    [filterChange],
  );

  const exportFlowsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await ExportFlowsByMembersUUIDS({
      members_uuids: selectedRows.map((item) => item.uuid),
    });
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(t(`${translationPath}pdf-exported-successfully`));
      setSelectedRows([]);
    } else showError(t(`${translationPath}pdf-export-failed`), response);
  }, [selectedRows, t]);

  const onFilterResetClicked = useCallback(() => {
    setFilter((items) => ({
      ...items,
      page: 1,
      sort: '',
      search: '',
    }));
    resetData();
  }, [resetData]);
  const sortByActions = useMemo(
    () => Object.values(OnboardingSortByActionsEnum),
    [],
  );

  useEffect(() => {
    void getOnboardingMembers();
  }, [getOnboardingMembers]);

  return (
    <div
      className={`members-page-wrapper page-wrapper${
        (isFromTabs && ' pt-3 px-2') || ''
      }`}
    >
      {!isFromTabs && (
        <div className="page-header-wrapper">
          <div className="d-flex-v-center-h-between flex-wrap">
            <div className="d-inline-flex mb-2">
              <div className="pl-3-reversed mt-2">
                <ButtonBase
                  className="btns theme-transparent mx-0 miw-0 c-gray-primary  font-12"
                  onClick={() => {}}
                >
                  <span>{t(`Eva Board`)}</span>
                </ButtonBase>
                <span className="fas fa-long-arrow-alt-right mx-2 font-12" />
                <span>{t(`${translationPath}all-invited-members`)}</span>
              </div>
            </div>
          </div>
          <div className="d-flex-v-center-h-between flex-wrap my-2">
            <div className="d-inline-flex flex-wrap mb-2">
              <div className="d-inline-flex-v-center header-text-x2 mt-2">
                <span>
                  <MemberIcon />
                </span>
                <span className="px-2">{t(`${translationPath}members`)}</span>
              </div>
            </div>
            <div className="d-inline-flex mb-2">
              <ButtonBase
                onClick={exportFlowsHandler}
                className="btns theme-transparent"
                disabled={selectedRows.length === 0 || isLoading}
              >
                <span className="fas fa-file-export" />
                <span className="px-1">{t(`${translationPath}export-flows`)}</span>
              </ButtonBase>
              {/*<ButtonBase*/}
              {/*  onClick={redirectionToFlowHandler}*/}
              {/*  className="btns theme-transparent"*/}
              {/*>*/}
              {/*  <span className="fas fa-plus" />*/}
              {/*  <span className="px-1">{t(`${translationPath}new-flow`)}</span>*/}
              {/*</ButtonBase>*/}
              {/*TO DO For Later*/}
              {/*<ButtonBase onClick={null} disabled className="btns theme-transparent">*/}
              {/*  <span className="fas fa-plus" />*/}
              {/*  <span className="px-1">{t(`${translationPath}assign`)}</span>*/}
              {/*</ButtonBase>*/}
            </div>
          </div>
        </div>
      )}
      <div className="d-flex-h-between fa-start flex-wrap">
        <div className="d-inline-flex">
          <span className="font-12 font-weight-500 c-gray-primary mt-2">
            {t(`${translationPath}showing`)} {members?.totalCount}
          </span>
          <SharedAPIAutocompleteControl
            stateKey="member"
            getDataAPI={GetAllOnboardingMembers}
            editValue={filter?.member}
            onValueChanged={(newValue) => {
              setFilter((items) => ({
                ...items,
                page: 1,
                member: newValue.value,
              }));
            }}
            getOptionLabel={(option) => `${option.name}` || 'N/A'}
            placeholder="all-members"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            searchKey="search"
            controlWrapperClasses={'mb-0 mxw-435px'}
            type={DynamicFormTypesEnum.array.key}
          />
        </div>
        <div className="d-inline-flex mb-2">
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

          {/*TO DO For Later*/}
          <ButtonBase
            onClick={(e) => {
              handleOpenPopover(e, 'sort');
            }}
            className="btns theme-transparent  px-2 miw-0 c-gray-primary"
          >
            <span className=" ">{t(`sort-by`)}</span>
            {filter?.sort?.label ? (
              <span className="px-1  c-black-lighter ">
                {t(filter?.sort?.label)}
              </span>
            ) : null}
          </ButtonBase>
        </div>
      </div>
      <div className="d-flex flex-wrap my-1">
        <OnboardingFiltersDisplaySection
          filter={filter}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setFilter={setFilter}
          onFilterResetClicked={onFilterResetClicked}
          onFilterChange={filterChange}
        />
      </div>
      <div className="d-flex-v-start-h-end mb-1 mx-1">
        <TableColumnsPopoverComponent
          columns={tableColumns}
          feature_name={
            isFromTabs ? TablesNameEnum.SpaceMembers.key : TablesNameEnum.Members.key
          }
          onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
          onColumnsChanged={onColumnsChanged}
          onReloadData={onReloadDataHandler}
          isLoading={isLoading}
        />
      </div>
      <div className="d-flex m-3">
        <div className="page-body-wrapper responses-table">
          <TablesComponent
            isWithNumbering
            onColumnsChanged={onColumnsChanged}
            onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
            data={members.results}
            headerData={tableColumns}
            pageIndex={filter.page - 1}
            pageSize={filter.limit}
            selectedRows={selectedRows}
            uniqueKeyInput="uuid"
            getIsDisabledRow={(row) => row.can_delete === false}
            isWithCheckAll
            isWithCheck
            onSelectAllCheckboxChanged={() => {
              setSelectedRows((items) =>
                globalSelectedRowsHandler(
                  items,
                  members.results.filter(
                    (item) => item.can_delete !== false,
                  ),
                ),
              );
            }}
            onSelectCheckboxChanged={({ selectedRow }) => {
              if (!selectedRow) return;
              setSelectedRows((items) =>
                globalSelectedRowHandler(items, selectedRow),
              );
            }}
            isLoading={isLoading || isLoadingColumns}
            totalItems={members.totalCount}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
            onBodyRowClicked={(idx, row) => {
              setActiveItem(row);
              setOpenedRatingDrawer(true);
            }}
          />
        </div>
      </div>
      {/*TO DO For Later*/}
      {/*{!isFromTabs && (*/}
      {/*  <ButtonBase disabled className="btns theme-transparent mt-3 ml-5-reversed">*/}
      {/*    <span className="fas fa-plus" />*/}
      {/*    <span className="px-1">{t(`${translationPath}add-new`)}</span>*/}
      {/*  </ButtonBase>*/}
      {/*)}*/}
      {openedRatingDrawer && (
        <ProfileDrawer
          openedRatingDrawer={openedRatingDrawer}
          setOpenedRatingDrawer={setOpenedRatingDrawer}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />
      )}
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
    </div>
  );
};

MembersPage.propTypes = {
  isFromTabs: PropTypes.bool,
  space_uuid: PropTypes.string,
  folder_uuid: PropTypes.string,
};
export default MembersPage;
