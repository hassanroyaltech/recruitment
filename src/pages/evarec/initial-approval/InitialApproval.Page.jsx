import React, { useCallback, useEffect, useRef, useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useTitle, useQuery, useEventListener } from '../../../hooks';
import { TabsComponent, FilterModal } from '../../../components';
import { ApproveApplicantsTabs, CandidateManagementDialog } from '../shared';
import {
  GetAllSetupsPreScreeningCategories,
  GetApprovalById,
} from '../../../services';
import {
  getAllApproveApplicantsHandler,
  getIsAllowedPermissionV2,
  GlobalHistory,
  PagesFilterInitValue,
  showError,
} from '../../../helpers';
import {
  FilterDialogCallLocationsEnum,
  PipelineQuickFilterLocationsEnum,
  SystemActionsEnum,
} from '../../../enums';
import { ApproveApplicantsCard } from './cards';
import { ApproveApplicantsDetailsDialog } from './dialogs';
import './InitialApproval.Style.scss';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import { AddToPipelineDialog } from '../pipelines/dialogs';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import { PreScreeningApprovalPermissions } from '../../../permissions';
import { useSelector } from 'react-redux';
import { VitallyTrack } from '../../../utils/Vitally';
import QuickFiltersComponent from '../../../components/QuickFilters/QuickFilters.Component';

const parentTranslationPath = 'InitialApproval';
const translationPath = '';

const InitialApprovalPage = () => {
  const query = useQuery();
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}initial-approval`));
  const bodyRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const [isOpenCandidateManagementDialog, setIsOpenCandidateManagementDialog]
    = useState(false);
  // const [searchValue, setSearchValue] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isOpenApplicantDetailsDialog, setIsOpenApplicantDetailsDialog]
    = useState(false);
  const [isOpenAddToPipelineDialog, setIsOpenAddToPipelineDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [approveApplicantsTabsData, setApproveApplicantsTabsData] = useState(() =>
    ApproveApplicantsTabs.map((item, index) => ({
      ...item,
      disabled: index > 0,
    })),
  );
  const [approveApplicants, setApproveApplicants] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    status: null,
    query: null,
    category_code: query.get('category_code') || null,
    assigned_user_uuid: null,
    tags: [],
    filters: null,
  });
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to handle selected applicants
   */
  const selectedApplicantsHandler = (newValue) => {
    setSelectedApplicants(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the actions clicked
   */
  const onActionsClicked = (action, item) => {
    setActiveItem(item);
    if (action.key === SystemActionsEnum.view.key)
      setIsOpenApplicantDetailsDialog(true);
    if (action.key === SystemActionsEnum.addUser.key)
      setIsOpenAddToPipelineDialog(true);
  };

  const approveOpenChangeHandler = useCallback((newStatus) => {
    setIsOpenApplicantDetailsDialog(false);
    GlobalHistory.replace({
      search: '',
    });
    if (newStatus) setFilter((items) => ({ ...items, page: 1 }));
    setTimeout(() => {
      setActiveItem(null);
    }, 800);
  }, []);

  const candidateManagementOpenChangeHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
  }, []);

  const onSaveCandidateHandler = useCallback(() => {
    setIsOpenCandidateManagementDialog(false);
    setFilter((items) => ({ ...items, page: 1 }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle update data after save for add to pipeline
   */
  const onAddToPipelineSaveHandler = useCallback(() => {
    setFilter((items) => ({ ...items, page: 1 }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle close the add to pipeline dialog
   */
  const onCloseAddToPipelineHandler = useCallback(() => {
    setActiveItem(null);
    setIsOpenAddToPipelineDialog(false);
  }, []);

  const UpdateCandidateList = useCallback(
    (response) => {
      if (response && response.status === 200) {
        const { results } = response.data;
        const { paginate } = response.data;

        if (filter.page === 1)
          setApproveApplicants({
            results: results || [],
            totalCount: paginate.total || 0,
          });
        else
          setApproveApplicants((items) => ({
            results: items.results.concat(results || []),
            totalCount: paginate.total || 0,
          }));
      } else {
        setApproveApplicants({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [filter.page, t],
  );

  // this to get the data on filter change & init
  useEffect(() => {
    getAllApproveApplicantsHandler({
      filter,
      setIsLoading,
      isLoadingRef,
      afterCallHandler: UpdateCandidateList,
    });
  }, [UpdateCandidateList, filter, t]);

  const getApprovalById = useCallback(
    async (uuid) => {
      try {
        const res = await GetApprovalById({ uuid });
        if (res?.data?.results) {
          setActiveItem({
            ...res?.data?.results,
            activeTab: 2,
          });
          setIsOpenApplicantDetailsDialog(true);
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [t],
  );
  useEffect(() => {
    const pre_candidate_uuid = query.get('pre_candidate_uuid');
    const candidate_approval_uuid = query.get('candidate_approval_uuid');
    const page = query.get('page');
    if (pre_candidate_uuid && candidate_approval_uuid && page === 'approval')
      getApprovalById(candidate_approval_uuid);
  }, [query, getApprovalById]);

  const onScrollHandler = useCallback(() => {
    if (
      (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
        || bodyRef.current.scrollTop + bodyRef.current.clientHeight
          >= bodyRef.current.firstChild.clientHeight - 5)
      && approveApplicants.results.length < approveApplicants.totalCount
      && !isLoadingRef.current
    ) {
      isLoadingRef.current = true;
      setFilter((items) => ({ ...items, page: items.page + 1 }));
    }
  }, [approveApplicants.results.length, approveApplicants.totalCount]);

  const onApplyQuickFilterHandler = useCallback(
    (filterType, filters, tags, filterModalState) => {
      setFilter((items) => ({
        ...items,
        page: 1,
        filters: filterModalState,
        tags,
      }));
      VitallyTrack('EVA-REC - Search on Candidate');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    if (!isLoading) onScrollHandler();
  }, [isLoading, onScrollHandler]);

  return (
    <div className="approve-applicants-page-wrapper page-wrapper">
      <div className="approve-applicants-header-wrapper">
        <div className="header-section">
          <div className="header-text-wrapper">
            <span className="header-text-x2">
              {t(`${translationPath}initial-approval`)}
            </span>
          </div>
          <div className="description-text">
            <span>{t(`${translationPath}approve-applicants-description`)}</span>
          </div>
        </div>
      </div>
      <div className="filter-wrapper">
        <div className="d-flex flex-wrap px-3 mt-2">
          <div className="separator-h" />
          <QuickFiltersComponent
            moduleKey={PipelineQuickFilterLocationsEnum.InitialApproval.key}
            hideIncomplete
            filterEditValue={filter?.filters}
            filterEditValueTags={filter?.tags}
            callLocation={FilterDialogCallLocationsEnum.InitialApproval.key}
            isWithCheckboxes
            isOpen={showFilterModal}
            onClose={() => {
              setShowFilterModal(false);
            }}
            onApply={onApplyQuickFilterHandler}
            showTags
            showCandidateType
            isShowAssigneeFilter
          />
          <div className="separator-h mb-2" />
        </div>
        <div className="filter-section px-3">
          <div className="w-100 d-flex justify-content-end">
            <ButtonBase
              className="btns btns-transparent"
              onClick={() => {
                setIsOpenCandidateManagementDialog(true);
              }}
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: PreScreeningApprovalPermissions.AddCandidates.key,
                })
              }
            >
              <span className="fas fa-plus" />
              <span className="px-2">{t(`${translationPath}add-candidate`)}</span>
            </ButtonBase>
            <ButtonBase
              onClick={() => {
                GlobalHistory.push(
                  '/recruiter/job/initial-approval/pre-screening-approval',
                );
              }}
              className="btns theme-solid"
            >
              <i className="fas fa-cog" />
              <span className="px-1">
                {t(`${translationPath}pre-screening-settings`)}
              </span>
            </ButtonBase>

            <ButtonBase
              onClick={() => {
                setShowFilterModal(true);
              }}
              className="btns-icon theme-transparent"
            >
              <i className="fas fa-filter" />
            </ButtonBase>
          </div>
          <TabsComponent
            data={approveApplicantsTabsData}
            currentTab={activeTab}
            labelInput="label"
            isWithLine
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
              selectedApplicantsHandler([]);
              setApproveApplicants({
                results: [],
                totalCount: 0,
              });
              setFilter((items) => ({
                ...items,
                page: 1,
                status:
                  approveApplicantsTabsData[currentTab].key !== -1
                    ? approveApplicantsTabsData[currentTab].key
                    : null,
              }));
            }}
            isDisabled={isLoading}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div
          className="filter-section"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div className="px-2 mb-2">
            <ButtonBase
              className="btns btns-transparent mx-0"
              onClick={() => {
                setFilter((items) => ({
                  ...items,
                  page: 1,
                  filters: { ...PagesFilterInitValue },
                  tags: [],
                }));
              }}
            >
              <span>{t(`${translationPath}reset-filters`)}</span>
            </ButtonBase>

            {[
              'job_type',
              'degree_type',
              'career_level',
              'interested_position_title',
              'academic_certificate',
              'country',
              'industry',
              'language',
              'major',
              'nationality',
              'assigned_user_uuid',
              'assigned_employee_uuid',
            ].map((chip) =>
              filter.filters?.[chip]?.map((subItem, i) => (
                <ButtonBase
                  key={`${subItem}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        [chip]: items.filters?.[chip]?.filter(
                          (item) => item.uuid !== subItem.uuid,
                        ),
                      },
                    }));
                  }}
                >
                  <span>
                    {chip === 'assigned_employee_uuid'
                      && `${
                        subItem?.first_name
                        && (subItem?.first_name[i18next.language]
                          || subItem?.first_name.en)
                      }${
                        subItem?.last_name
                        && ` ${
                          subItem?.last_name[i18next.language]
                          || subItem?.last_name.en
                        }`
                      }`}
                    {chip === 'assigned_user_uuid'
                      && `${
                        subItem?.first_name
                        && (subItem?.first_name[i18next.language]
                          || subItem?.first_name.en)
                      }${
                        subItem?.last_name
                        && ` ${
                          subItem?.last_name[i18next.language]
                          || subItem?.last_name.en
                        }`
                      }`}
                    {chip !== 'assigned_employee_uuid'
                      && chip !== 'assigned_user_uuid'
                      && (subItem?.name?.[i18next.language] || subItem?.name?.en)}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )),
            )}
            {filter.filters?.national_id && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 1,
                    filters: {
                      ...filter?.filters,
                      national_id: null,
                    },
                  });
                }}
              >
                <span>{filter.filters?.national_id}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}
            {filter.filters?.candidate_name && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 1,
                    filters: {
                      ...filter?.filters,
                      candidate_name: null,
                    },
                  });
                }}
              >
                <span>{filter.filters?.candidate_name}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}
            {filter.filters?.applicant_number && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 1,
                    filters: {
                      ...filter?.filters,
                      applicant_number: null,
                    },
                  });
                }}
              >
                <span>{filter.filters?.applicant_number}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}
            {filter.filters?.reference_number && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter({
                    ...filter,
                    page: 1,
                    filters: {
                      ...filter?.filters,
                      reference_number: null,
                    },
                  });
                }}
              >
                <span>{filter.filters?.reference_number}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}

            {filter.filters?.gender
            && Object.keys(filter.filters?.gender)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        gender: '',
                      },
                    }));
                  }}
                >
                  <span>
                    {filter.filters?.gender.name?.[i18next.language]
                    || filter.filters?.gender.name?.en}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}
            {filter?.filters?.candidate_type?.value ? (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter((items) => ({
                    ...items,
                    page: 1,
                    filters: {
                      ...items.filters,
                      candidate_type: null,
                    },
                  }));
                }}
              >
                <span>{filter?.filters?.candidate_type?.value || ''}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            ) : null}
            {filter.filters?.source_type
            && Object.keys(filter.filters?.source_type)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        source_type: null,
                        source: null,
                      },
                    }));
                  }}
                >
                  <span>
                    {filter.filters?.source_type.value
                    || filter.filters?.source_type.value}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}

            {filter.filters?.source
            && Object.keys(filter.filters?.source)?.length ? (
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        source: null,
                      },
                    }));
                  }}
                >
                  <span>
                    {`${
                      (filter.filters?.source.first_name
                      && ((typeof filter.filters?.source.first_name === 'string'
                        && filter.filters?.source.first_name)
                        || (typeof filter.filters?.source.first_name !== 'string'
                          && (filter.filters?.source.first_name[i18next.language]
                            || filter.filters?.source.first_name.en))))
                    || ''
                    }${
                      (filter.filters?.source.last_name
                      && ((typeof filter.filters?.source.last_name === 'string'
                        && ` ${filter.filters?.source.last_name}`)
                        || (typeof filter.filters?.source.last_name !== 'string'
                          && ` ${
                            filter.filters?.source.last_name[i18next.language]
                            || filter.filters?.source.last_name.en
                          }`)))
                    || ''
                    }` || 'N/A'}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ) : null}
            {filter.filters?.candidate_property
              && filter.filters?.candidate_property.map(
                (item, index) =>
                  (!Object.hasOwn(item, 'lookup')
                    && item.value.map((element, elementIndex) => (
                      <ButtonBase
                        className="btns theme-transparent"
                        key={`${item.uuid}-${element}`}
                        onClick={() => {
                          setFilter((items) => {
                            if (
                              Array.isArray(
                                items.filters.candidate_property[index].value,
                              )
                            )
                              items.filters.candidate_property[index].value.splice(
                                elementIndex,
                                1,
                              );
                            return {
                              ...items,
                              page: 1,
                              filters: {
                                ...items.filters,
                                candidate_property: items.filters.candidate_property,
                              },
                            };
                          });
                        }}
                      >
                        <span>{element}</span>
                        <span className="fas fa-times px-2" />
                      </ButtonBase>
                    )))
                  || item.lookup.map((element, elementIndex) => (
                    <ButtonBase
                      className="btns theme-transparent"
                      key={`${item.uuid}-${element.uuid}`}
                      onClick={() => {
                        setFilter((items) => {
                          if (
                            Array.isArray(
                              items.filters.candidate_property[index].value,
                            )
                          )
                            items.filters.candidate_property[index].value.splice(
                              elementIndex,
                              1,
                            );
                          if (
                            !Array.isArray(
                              items.filters.candidate_property[index].value,
                            )
                            || items.filters.candidate_property[index].value.length
                              === 0
                          )
                            items.filters.candidate_property.splice(index, 1);
                          else
                            items.filters.candidate_property[index].lookup.splice(
                              elementIndex,
                              1,
                            );
                          return {
                            ...items,
                            page: 1,
                            filters: {
                              ...items.filters,
                              candidate_property: items.filters.candidate_property,
                            },
                          };
                        });
                      }}
                    >
                      <span>{element.title}</span>
                      <span className="fas fa-times px-2" />
                    </ButtonBase>
                  )),
              )}

            {['skills', 'job_position', 'query'].map((chip) =>
              filter.filters?.[chip]?.map((subItem, i) => (
                <ButtonBase
                  key={`${subItem}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      filters: {
                        ...items.filters,
                        [chip]: items.filters?.[chip]?.filter(
                          (item) => item !== subItem,
                        ),
                      },
                    }));
                  }}
                >
                  <span>{subItem}</span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              )),
            )}
            {/* ['right_to_work', 'willing_to_travel', 'willing_to_relocate', 'owns_a_car', 'is_completed_profile', 'un_completed_profile'] */}
            {filter.filters?.checkboxFilters
            && Object.keys(filter.filters?.checkboxFilters)?.length
              ? Object.keys(filter.filters?.checkboxFilters)
                ?.filter((item) => filter?.filters?.checkboxFilters?.[item])
                .map((chip, i) => (
                  <ButtonBase
                    key={`${chip}Key${i + 1}`}
                    className="btns theme-transparent"
                    onClick={() => {
                      setFilter((items) => {
                        const copyPrevFilter = {
                          ...items?.filters?.checkboxFilters,
                        };
                        delete copyPrevFilter?.[chip];
                        return {
                          ...items,
                          page: 1,
                          filters: {
                            ...items.filters,
                            checkboxFilters: copyPrevFilter,
                          },
                        };
                      });
                    }}
                  >
                    <span>
                      {t(`${translationPath}${chip.replaceAll('_', '-')}`)}
                    </span>
                    <span className="fas fa-times px-2" />
                  </ButtonBase>
                ))
              : null}
            {filter?.filters?.has_assignee?.value ? (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter((items) => ({
                    ...items,
                    filters: {
                      ...items?.filters,
                      has_assignee: null,
                    },
                  }));
                }}
              >
                <span>
                  {t(`${translationPath}has-assignee`)}:{' '}
                  {filter?.filters?.has_assignee?.value || ''}
                </span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            ) : null}
            {/* Tags */}
            {filter?.tags
              ?.filter((item) => item?.key)
              .map((item, i) => (
                <ButtonBase
                  key={`${item}Key${i + 1}`}
                  className="btns theme-transparent"
                  onClick={() => {
                    setFilter((items) => ({
                      ...items,
                      page: 1,
                      tags: items.tags?.filter((tag) => tag?.key !== item?.key),
                    }));
                  }}
                >
                  <span>
                    {item?.value
                      ?.map((val) => {
                        if (item.key === CustomCandidatesFilterTagsEnum.user.key)
                          return `${
                            val.first_name
                            && (val.first_name[i18next.language] || val.first_name.en)
                          }${
                            val.last_name
                            && ` ${val.last_name[i18next.language] || val.last_name.en}`
                          }`;
                        else if (
                          item.key === CustomCandidatesFilterTagsEnum.employee.key
                        )
                          return `${
                            val.first_name
                            && (val.first_name[i18next.language] || val.first_name.en)
                          }${
                            val.last_name
                            && ` ${val.last_name[i18next.language] || val.last_name.en}`
                          }${
                            (!val.has_access
                              && ` ${t('Shared:dont-have-permissions')}`)
                            || ''
                          }`;
                        return val?.name?.[i18next.language] || val?.name?.en;
                      })
                      .join(', ')}
                  </span>
                  <span className="fas fa-times px-2" />
                </ButtonBase>
              ))}

            {((filter?.filters?.age_lte !== null
              && filter?.filters?.age_lte !== undefined)
              || (filter?.filters?.age_gte !== null
                && filter?.filters?.age_gte !== undefined)) && (
              <ButtonBase
                className="btns theme-transparent"
                onClick={() => {
                  setFilter((items) => ({
                    ...items,
                    filters: {
                      ...items?.filters,
                      age_lte: null,
                      age_gte: null,
                    },
                  }));
                }}
              >
                <span>
                  {filter?.filters?.age_lte !== undefined
                    && filter?.filters?.age_lte !== null
                    && filter?.filters?.age_lte !== 0 && (
                    <span className="mx-2">{`${t(`${translationPath}from-age`)} : ${
                      filter?.filters?.age_lte
                    }`}</span>
                  )}
                  {filter?.filters?.age_lte && filter?.filters?.age_lte && (
                    <span>-</span>
                  )}
                  {(filter?.filters?.age_gte || filter?.filters?.age_gte === 0) && (
                    <span className="mx-2">{`${t(`${translationPath}to-age`)}: ${
                      filter?.filters?.age_gte
                    }`}</span>
                  )}
                </span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            )}
          </div>
          <div className="px-2 mb-2">
            <div className="d-flex flex-wrap">
              <SharedAPIAutocompleteControl
                title="category"
                idRef="categoriesAutocompleteRef"
                getOptionLabel={(option) =>
                  (option.title
                    && (option.title[i18next.language] || option.title.en))
                  || ''
                }
                editValue={filter?.category_code || null}
                stateKey="category_code"
                placeholder="select-category"
                onValueChanged={(newValue) => {
                  setApproveApplicantsTabsData((items) => {
                    const localItems = [...items];
                    if (newValue.value && !localItems[1].disabled) return items;
                    if (newValue.value)
                      items.map((item, index) => {
                        if (index > 0) localItems[index].disabled = false;
                        return undefined;
                      });
                    else
                      items.map((item, index) => {
                        if (index > 0) localItems[index].disabled = true;
                        return undefined;
                      });
                    return localItems;
                  });
                  if (!newValue.value && activeTab > 0) setActiveTab(0);
                  setFilter((items) => ({
                    ...items,
                    page: 1,
                    category_code: newValue.value,
                  }));
                }}
                getDataAPI={GetAllSetupsPreScreeningCategories}
                uniqueKey="code"
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                extraProps={{ for_settings: false }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        {!isLoading
          && approveApplicants
          && approveApplicants.results.length === 0 && (
          <div className="d-flex-center header-text-x2">
            <span>{t(`${translationPath}no-results-found`)}</span>
          </div>
        )}
        <div className="content-section-wrapper" ref={bodyRef}>
          <ApproveApplicantsCard
            isLoading={isLoading}
            data={approveApplicants}
            onActionsClicked={onActionsClicked}
            selectedApplicants={selectedApplicants}
            parentTranslationPath={parentTranslationPath}
            selectedApplicantsHandler={selectedApplicantsHandler}
          />
        </div>
      </div>
      {isOpenAddToPipelineDialog && activeItem && (
        <AddToPipelineDialog
          isOpen={isOpenAddToPipelineDialog}
          candidate_companies={activeItem.candidate_company}
          use_for="pre_screening_service"
          onSave={onAddToPipelineSaveHandler}
          isOpenChanged={onCloseAddToPipelineHandler}
          pre_candidate_uuid={activeItem.uuid}
          pre_candidate_approval_uuid={activeItem.candidate_approval_uuid}
          category_code={activeItem.category_code}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {activeItem && isOpenApplicantDetailsDialog && (
        <ApproveApplicantsDetailsDialog
          activeItem={activeItem}
          isOpen={isOpenApplicantDetailsDialog}
          parentTranslationPath={parentTranslationPath}
          isOpenChanged={approveOpenChangeHandler}
          setActiveItem={setActiveItem}
        />
      )}

      {isOpenCandidateManagementDialog && (
        <CandidateManagementDialog
          isOpen={isOpenCandidateManagementDialog}
          isOpenChanged={candidateManagementOpenChangeHandler}
          onSave={onSaveCandidateHandler}
          componentPermission={PreScreeningApprovalPermissions}
        />
      )}
      {showFilterModal && (
        <FilterModal
          hideIncomplete
          filterEditValue={filter?.filters}
          filterEditValueTags={filter?.tags}
          callLocation={FilterDialogCallLocationsEnum.InitialApproval.key}
          isWithCheckboxes
          isOpen={showFilterModal}
          onClose={() => {
            setShowFilterModal(false);
          }}
          onApply={(filterType, filters, tags, filterModalState) => {
            setFilter((items) => ({
              ...items,
              page: 1,
              filters: filterModalState,
              tags,
            }));
            setShowFilterModal(false);
            VitallyTrack('EVA-REC - Search on Candidate');
          }}
          showTags
          showCandidateType={true}
          isShowAssigneeFilter={true}
          isShowAge={true}
        />
      )}
    </div>
  );
};

export default InitialApprovalPage;
