import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Grid } from '@mui/material';
import { UserIcon, SearchIcon } from '../../../../../assets/icons';

import {
  GetAllOnboardingMembers,
  GetAllOnboardingSpaces,
  GetAllWorkflowProgress,
} from '../../../../../services';
import { ActivityCard } from '../../components/ActivityCard.Component';
import Skeleton from '@mui/material/Skeleton';
import { useEventListener } from '../../../../../hooks';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import Avatar from '@mui/material/Avatar';

import { showError, StringToColor } from '../../../../../helpers';
import { OnboardingFiltersDisplaySection } from '../../../shared/sections/onboarding-filters-display/OnboardingFiltersDisplay.Section';
import { FilterModal } from '../../../dialogs';
import { OnboardingSortByActionsEnum } from '../../../../../enums';
import { PopoverComponent } from '../../../../../components';
import { MembersStatusesDialog } from '../../dialogs/MembersStatuses.Dialog';

export const WorkFlowTab = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const isLoadingRef = useRef(false);
  const [popovers, setPopovers] = useState({
    sort: { ref: null },
    group: { ref: null },
  });
  const [workflowsData, setWorkflowsData] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
  const [activeItem, setActiveItem] = useState();
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    sort: '',
    search: '',
    space_uuid: null,
    member_uuid: null,
  });
  const resetData = useCallback(() => {
    setWorkflowsData({ results: [], totalCount: 0 });
  }, []);
  const getAllWorkflowProgressHandler = useCallback(async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    const res = await GetAllWorkflowProgress({
      ...filter,
      sort_by: filter?.sort?.sort_by,
      order: filter?.sort?.order,
      member_uuid: filter?.member?.uuid || '',
      recruiter_uuid: filter?.recruiter_uuid?.uuid || '',
      job_uuid: filter?.job_uuid?.uuid || '',
    });
    setIsLoading(false);
    isLoadingRef.current = false;
    if (res.data)
      if (filter.page === 1)
        // && res.status === 200
        setWorkflowsData({
          results: res.data.results || [],
          totalCount: res.data.paginate?.total || 0,
        });
      else
        setWorkflowsData((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
        }));
    else {
      resetData();
      showError(t('Shared:failed-to-get-saved-data'), res);
    }
  }, [filter, resetData, t]);
  useEffect(() => {
    getAllWorkflowProgressHandler().catch((error) => console.log(error));
  }, [getAllWorkflowProgressHandler]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight
      && workflowsData.results.length < workflowsData.totalCount
      && !isLoadingRef.current
      && !isLoading
    ) {
      isLoadingRef.current = true;
      setFilter((items) => ({ ...items, page: items.page + 1 }));
    }
  }, [isLoading, workflowsData.results.length, workflowsData.totalCount]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search) {
      resetData();
      setFilter((filters) => ({
        ...filters,
        limit: 10,
        page: 1,
        search: textSearch.value,
      }));
    }
  }, [textSearch.value, filter.search, resetData]);
  const filterChange = useCallback(
    (name, value) => {
      setFilter((filters) => ({ ...filters, limit: 10, page: 1, [name]: value }));
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

  const onFilterResetClicked = useCallback(() => {
    setFilter((items) => ({
      ...items,
      limit: 10,
      page: 1,
      sort: '',
      search: '',
      recruiter_uuid: '',
      job_uuid: '',
    }));
    resetData();
  }, [resetData]);
  const sortByActions = useMemo(
    () => Object.values(OnboardingSortByActionsEnum),
    [],
  );
  const onOpenMembersDialog = useCallback((item) => {
    setActiveItem(item);
    setIsMembersDialogOpen(true);
  }, []);
  const onCloseMembersDialog = useCallback(() => {
    setActiveItem(null);
    setIsMembersDialogOpen(false);
  }, []);

  return (
    <div className="activity-tab-wrapper">
      <div className="d-flex flex-wrap mb-1">
        <div className="activity-filters flex-wrap mt-1 mb-3">
          <div className="d-inline-flex   flex-wrap my-1   filter-activity-autoComplete   ">
            <SharedAPIAutocompleteControl
              stateKey="space_uuid"
              getDataAPI={GetAllOnboardingSpaces}
              editValue={filter?.space_uuid}
              onValueChanged={(value) => {
                filterChange('space_uuid', value.value);
              }}
              getOptionLabel={(option) => `${option.title}` || 'N/A'}
              placeholder="All-spaces"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              controlWrapperClasses="mb-0"
              extraProps={{
                ...(filter?.space_uuid && { with_than: [filter?.space_uuid] }),
              }}
            />
            <SharedAPIAutocompleteControl
              isEntireObject
              placeholder="by-member"
              stateKey="member_uuid"
              idRef="memberRef"
              getDataAPI={GetAllOnboardingMembers}
              editValue={filter?.member?.uuid}
              onValueChanged={(value) => {
                filterChange('member', value.value);
              }}
              getOptionLabel={(option) => `${option.name}` || 'N/A'}
              inputStartAdornment={
                !filter?.member ? (
                  <Avatar
                    className="user-avatar-item"
                    sx={{
                      backgroundColor: '#fff',
                      height: `25px !important`,
                      width: `25px !important`,
                      marginInlineStart: '5px',
                    }}
                  >
                    <UserIcon />
                  </Avatar>
                ) : filter?.member?.url ? (
                  <Avatar
                    className="user-avatar-item"
                    src={filter.member.url}
                    sx={{
                      height: `25px !important`,
                      width: `25px !important`,
                      marginInlineStart: '5px',
                    }}
                  />
                ) : (
                  <Avatar
                    className="user-avatar-item"
                    sx={{
                      backgroundColor: StringToColor(filter.member.name),
                      height: `25px !important`,
                      width: `25px !important`,
                      marginInlineStart: '5px',
                    }}
                  >
                    {`${filter?.member?.name || ''}`
                      .split(' ')
                      .map((word) => word[0]) || ''}
                  </Avatar>
                )
              }
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="search"
              controlWrapperClasses="mb-0"
              extraProps={{
                ...(filter?.member?.uuid && {
                  with_than: [filter?.member?.uuid],
                }),
              }}
            />
          </div>
          <div className=" flex-wrap my-1 ">
            {textSearch.open ? (
              <SharedInputControl
                idRef="searchRef"
                placeholder="search"
                themeClass="theme-transparent"
                wrapperClasses="mb-0"
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
                translationPath={translationPath}
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
            <ButtonBase
              onClick={() => setShowFilterModal(true)}
              className="btns theme-transparent  px-2 miw-0 c-gray-primary"
            >
              <span className="px-1">{t(`filter`)}</span>
            </ButtonBase>
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
      </div>
      <div className="d-flex flex-wrap mb-1">
        <OnboardingFiltersDisplaySection
          filter={filter}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setFilter={setFilter}
          onFilterResetClicked={onFilterResetClicked}
          onFilterChange={filterChange}
        />
      </div>
      <div className="d-flex flex-wrap">
        <Grid
          container
          spacing={2}
          className="onboarding-scrollable-page-contents-wrapper p-2"
          ref={bodyRef}
        >
          {workflowsData.results.map((item, index) => (
            <Grid item md={3} sm={6} xs={12} key={item.uuid + `index` + index}>
              <ActivityCard
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                title={item.title}
                members={item.members}
                tags={item.space ? [item.space] : item.tags}
                total={item.total}
                performed={item.completed}
                percent={(item.completed / item.total) * 100}
                uuid={item.uuid}
                space={item.space}
                onCompletedClicked={() => onOpenMembersDialog(item)}
              />
            </Grid>
          ))}
          {isLoading
            && Array.from(new Array(4)).map((item, index) => (
              <Grid item md={3} sm={6} xs={12} key={`${item}${index}`}>
                <Skeleton variant="rectangular" className="activity-card" />
              </Grid>
            ))}
        </Grid>

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
      {showFilterModal && (
        <FilterModal
          filterEditValue={filter}
          isOpen={showFilterModal}
          onClose={() => {
            setShowFilterModal(false);
          }}
          onApply={(val) => {
            setFilter((items) => ({
              ...items,
              ...val,
              page: 1,
            }));
            resetData();
            setShowFilterModal(false);
          }}
        />
      )}
      {isMembersDialogOpen && (
        <MembersStatusesDialog
          isOpen={isMembersDialogOpen}
          onCloseClicked={() => onCloseMembersDialog()}
          onCancelClicked={() => onCloseMembersDialog()}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activeItem={activeItem}
        />
      )}
    </div>
  );
};

WorkFlowTab.propTypes = {
  // visaRequests: PropTypes.instanceOf(Array),
  // onCallLocationChanged: PropTypes.func.isRequired,
  // onIsOpenDialogsChanged: PropTypes.func.isRequired,
  // getFullNameForRequestedFrom: PropTypes.func.isRequired,
  // getVisaStatusByKey: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  members: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
};

WorkFlowTab.defaultProps = {};
