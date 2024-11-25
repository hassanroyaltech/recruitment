import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import { GetAllOnboardingMembers } from '../../../../../services';
import {
  DynamicFormTypesEnum,
  FormsSubmissionsLevelsTypesEnum,
  OnboardingGroupByActionsEnum,
  OnboardingSortByActionsEnum,
  OnboardingTasksStatusesEnum,
} from '../../../../../enums';
import { SearchIcon } from '../../../../../assets/icons';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { PopoverComponent } from '../../../../../components';
import { OnboardingFiltersDisplaySection } from '../../../shared/sections/onboarding-filters-display/OnboardingFiltersDisplay.Section';

export const TasksFilterSection = ({
  filter,
  onFilterChanged,
  isWithFormLevelFilter,
  onFetchedDataChanged,
  onExpandedAccordionsChanged,
  parentTranslationPath,
  translationPath,
  onFilterResetClicked,
  isShowSort,
  isShowGroup,
  isWithStatus,
}) => {
  const [popovers, setPopovers] = useState({
    sort: { ref: null },
    group: { ref: null },
  });
  const { t } = useTranslation(parentTranslationPath);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const [formsSubmissionsLevelsTypesEnum] = useState(
    Object.values(FormsSubmissionsLevelsTypesEnum).map((item) => ({
      ...item,
      value: t(`${item.value}`),
    })),
  );
  const [onboardingTasksStatusesEnum] = useState(
    Object.values(OnboardingTasksStatusesEnum).map((item) => ({
      ...item,
      value: t(`${item.value}`),
    })),
  );
  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search) {
      if (onFetchedDataChanged) onFetchedDataChanged({ results: [], totalCount: 0 });
      onFilterChanged({
        limit: 10,
        page: 1,
        search: textSearch.value,
      });
      onExpandedAccordionsChanged([0]);
    }
  }, [
    textSearch.value,
    filter.search,
    onFetchedDataChanged,
    onFilterChanged,
    onExpandedAccordionsChanged,
  ]);
  const handleOpenPopover = useCallback((e, type) => {
    setPopovers((item) => ({
      ...item,
      [type]: { ref: e?.target || null },
    }));
  }, []);
  const handleSortByAndGroupBy = useCallback(
    (type, action) => {
      setPopovers((item) => ({ ...item, [type]: { ref: null } }));
      onFilterChanged({
        limit: 10,
        page: 1,
        [type]: action,
      });
      onExpandedAccordionsChanged([0]);
    },
    [onExpandedAccordionsChanged, onFilterChanged],
  );
  const sortByActions = useMemo(
    () => Object.values(OnboardingSortByActionsEnum),
    [],
  );
  const groupByActions = useMemo(
    () => Object.values(OnboardingGroupByActionsEnum),
    [],
  );
  const filterChange = useCallback(
    (key, val) => {
      onFilterChanged({
        limit: 10,
        page: 1,
        [key]: val,
      });
    },
    [onFilterChanged],
  );
  return (
    <>
      <div className="onboarding-header-filters">
        <div className="d-inline-flex-v-center   flex-wrap my-1 autocomplete-part">
          {/*<span className="font-12 font-weight-500 c-gray-primary my-3">*/}
          {/*  {t(`${translationPath}showing`)} 80 {t(`${translationPath}tasks`)}*/}
          {/*</span>*/}
          <SharedAPIAutocompleteControl
            isFullWidth
            stateKey="member"
            getDataAPI={GetAllOnboardingMembers}
            editValue={filter?.member}
            onValueChanged={(newValue) => {
              onFilterChanged({
                page: 1,
                member: newValue.value,
              });
            }}
            getOptionLabel={(option) => `${option.name || option.member}` || 'N/A'}
            placeholder="all-members"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            searchKey="search"
            controlWrapperClasses="mb-0"
            type={DynamicFormTypesEnum.array.key}
          />
          {/*<SharedAPIAutocompleteControl*/}
          {/*  isFullWidth*/}
          {/*  stateKey="task"*/}
          {/*  getDataAPI={GetAllOnboardingTasks}*/}
          {/*  editValue={filter?.task}*/}
          {/*  onValueChanged={(newValue) => {*/}
          {/*    onFilterChanged({*/}
          {/*      page: 1,*/}
          {/*      task: newValue.value,*/}
          {/*    });*/}
          {/*  }}*/}
          {/*  getOptionLabel={(option) =>*/}
          {/*    `${*/}
          {/*      option.first_name*/}
          {/*      && (option.first_name[i18next.language] || option.first_name.en)*/}
          {/*    }${*/}
          {/*      option.last_name*/}
          {/*      && ` ${option.last_name[i18next.language] || option.last_name.en}`*/}
          {/*    }` || 'N/A'*/}
          {/*  }*/}
          {/*  placeholder="all-tasks"*/}
          {/*  isDisabled*/}
          {/*  parentTranslationPath={parentTranslationPath}*/}
          {/*  translationPath={translationPath}*/}
          {/*  searchKey="search"*/}
          {/*  controlWrapperClasses="mb-0 px-2"*/}
          {/*/>*/}
          {isWithFormLevelFilter && (
            <SharedAutocompleteControl
              isFullWidth
              initValues={formsSubmissionsLevelsTypesEnum}
              stateKey="type"
              disableClearable
              onValueChanged={({ value }) => {
                onFilterChanged({
                  page: 1,
                  type: value,
                  group: null,
                });
              }}
              title="submission-type"
              editValue={filter.type}
              placeholder="select-submission-type"
              sharedClassesWrapper="mb-0"
              parentTranslationPath={parentTranslationPath}
            />
          )}
        </div>

        <div className="d-inline-flex-v-end mt-1 mb-2">
          {isWithStatus && (
            <SharedAutocompleteControl
              isEntireObject
              initValues={onboardingTasksStatusesEnum}
              stateKey="status"
              disableClearable
              onValueChanged={({ value }) => {
                onFilterChanged({
                  page: 1,
                  status: value,
                  group: null,
                });
              }}
              title="status"
              editValue={filter?.status?.key}
              placeholder="select-status"
              sharedClassesWrapper="mb-0"
              parentTranslationPath={parentTranslationPath}
            />
          )}
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
          {/*<ButtonBase*/}
          {/*  disabled*/}
          {/*  className="btns theme-transparent px-2 miw-0 c-gray-primary"*/}
          {/*>*/}
          {/*  <span className="px-1">{t(`${translationPath}filter`)}</span>*/}
          {/*</ButtonBase>*/}
          {isShowGroup && (
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
          {isShowSort && (
            <ButtonBase
              onClick={(e) => {
                handleOpenPopover(e, 'sort');
              }}
              className="btns theme-transparent  px-2 miw-0 c-gray-primary"
            >
              <span className=" ">{t(`sort-by`)}</span>
              {filter?.sort?.label ? (
                <span className="px-1  c-black-lighter ">
                  {t(filter.sort.label)}
                </span>
              ) : null}
            </ButtonBase>
          )}
        </div>
      </div>
      <div className="d-flex flex-wrap mt-2 mb-3">
        <OnboardingFiltersDisplaySection
          filter={filter}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onFilterResetClicked={onFilterResetClicked}
          onFilterChange={filterChange}
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
    </>
  );
};

TasksFilterSection.propTypes = {
  filter: PropTypes.instanceOf(Object).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onExpandedAccordionsChanged: PropTypes.func.isRequired,
  onFetchedDataChanged: PropTypes.func,
  isWithFormLevelFilter: PropTypes.bool,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  onFilterResetClicked: PropTypes.func,
  isShowSort: PropTypes.bool,
  isShowGroup: PropTypes.bool,
  isWithStatus: PropTypes.bool,
};

TasksFilterSection.defaultProps = {
  parentTranslationPath: 'OnboardingPage',
  translationPath: 'TasksPage.',
};
