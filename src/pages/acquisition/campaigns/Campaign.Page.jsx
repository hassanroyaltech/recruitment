import React, { useEffect, useState, useRef, useCallback } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { Backdrop, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import i18next from 'i18next';
import { TabsComponent, Inputs, FastSpringComponent } from '../../../components';
import { useEventListener, useTitle } from '../../../hooks';
import { CampaignTabs } from '../shared';
import {
  getIsAllowedPermissionV2,
  GlobalSearchDelay,
  showError,
  showSuccess,
} from '../../../helpers';
import { SortByAutoCompleteControl } from './controls';
import './Campaign.Style.scss';
import {
  CampaignCheckoutV2,
  CheckCampaignDetails,
  GetAllCampaignActiveJobs,
  GetAllCampaignsV2,
  GetAllSetupsUsers,
  VerifyTransactionV2,
} from '../../../services';
import { CampaignCardComponent } from './sections';
import {
  CampaignAddDialog,
  CampaignManagementDialog,
  CampaignDeleteDialog,
  CampaignDoneDialog,
  CampaignReportDialog,
} from './dialogs';
import {
  CampaignSortByEnum,
  CampaignTypes,
  SystemActionsEnum,
} from '../../../enums';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import { CampaignsPermissions } from 'permissions';
import { useSelector } from 'react-redux';
import { MutateVonqErrorsHelper } from './helpers/MutateVonqErrors.helper';

const parentTranslationPath = 'CampaignPage';
const translationPath = '';

const getOrderByValue = (filterBy) => {
  if (filterBy.direction === 'desc')
    return filterBy.order_by === CampaignSortByEnum.costFromHighToLow.key
      ? CampaignSortByEnum.costFromLowToHigh.key
      : CampaignSortByEnum.nameFromAToZ.key;
  if (filterBy.direction === 'asc')
    return filterBy.order_by === CampaignSortByEnum.costFromLowToHigh.key
      ? CampaignSortByEnum.costFromHighToLow.key
      : CampaignSortByEnum.nameFromZToA.key;
  return CampaignSortByEnum.costFromHighToLow.key;
};

const CampaignPage = () => {
  const { t } = useTranslation([parentTranslationPath]);
  useTitle(t(`${translationPath}acquisition-campaigns`));
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const { search } = useLocation();
  const [jobUuid, setJobUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isOpenCampaignDoneDialog, setIsOpenCampaignDoneDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenCampaignReportDialog, setIsOpenCampaignReportDialog]
    = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [campaigns, setCampaigns] = useState(() => ({
    results: [],
    totalCount: 0,
  }));
  const [campaignTabsData, setCampaignTabsData] = useState(CampaignTabs);
  const [activeTab, setActiveTab] = useState(0);
  const bodyRef = useRef(null);
  const [filter, setFilter] = useState({
    limit: 15,
    page: 1,
    title: '',
    status: null,
  });
  const [filterBy, setFilterBy] = useState({
    created_by: '',
    order_by: CampaignSortByEnum.costFromLowToHigh.key,
    direction: CampaignSortByEnum.costFromLowToHigh.direction,
  });
  const searchTimerRef = useRef(null);
  const isLoadingRef = useRef(false);
  const onActionsClicked = (action, item) => {
    setActiveItem(item);
    if (action.key === SystemActionsEnum.edit.key) setIsOpenManagementDialog(true);
    if (action.key === SystemActionsEnum.delete.key) setIsOpenDeleteDialog(true);
  };

  const onPopupClosed = (data) => {
    if (!data) setIsOpenManagementDialog(true);
    else {
      let attempts = 0;
      const localData = { ...data };
      setIsLoadingVerify(true);
      const VerifyHandler = () => {
        setTimeout(() => {
          attempts++;
          VerifyTransactionV2(data?.id, activeItem.uuid)
            .then(async () => {
              const checkResponse = await CheckCampaignDetails({
                campaign_uuid: activeItem.uuid,
              });
              if (checkResponse.status === 200) {
                const response = await CampaignCheckoutV2({
                  campaign_uuid: activeItem.uuid,
                });
                if (response && response.status === 200) {
                  setIsLoadingVerify(false);
                  setIsOpenCampaignDoneDialog(true);
                  setFilter((items) => ({ ...items, page: 1 }));
                  showSuccess(t(`${translationPath}campaign-updated-successfully`));
                } else {
                  setIsLoadingVerify(false);
                  setIsOpenManagementDialog(true);
                  showError(
                    t(`${translationPath}campaign-update-failed`),
                    checkResponse,
                  );
                }
              } else {
                setIsLoadingVerify(false);
                setIsOpenManagementDialog(true);
                showError(
                  t(`${translationPath}campaign-update-failed`),
                  MutateVonqErrorsHelper(checkResponse),
                );
              }
            })
            .catch((error) => {
              if (attempts < 4) VerifyHandler();
              else if (error && error.response && error.response.status === 406)
                setTimeout(() => {
                  onPopupClosed(localData);
                }, 2000);
              else {
                setIsLoadingVerify(false);
                setIsOpenManagementDialog(true);
                showError(t(`${translationPath}campaign-transaction-pay-failed`));
              }
            });
        }, 3000);
      };
      VerifyHandler();
    }
  };

  const onErrorCallback = (code, message) => {
    showError(t(`${translationPath}${message}`));
    setIsOpenManagementDialog(true);
  };

  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setFilter((items) => ({ ...items, page: 1, title: value }));
    }, GlobalSearchDelay);
  };

  const onStartCampaignHandler = () => {
    setIsOpenManagementDialog(false);
    setIsOpenCampaignDoneDialog(true);
  };

  /**
   * @param currentCardItem
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open report dialog on campaign card
   * clicked
   */
  const onCampaignCardClicked = (currentCardItem) => {
    setActiveItem(currentCardItem);
    if (
      currentCardItem.status === CampaignTypes.draft.key
      && currentCardItem.can_delete
    )
      setIsOpenManagementDialog(true);
    else setIsOpenCampaignReportDialog(true);
  };
  const getAllCampaigns = useCallback(async () => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    const response = await GetAllCampaignsV2({
      ...filter,
      ...filterBy,
      // company_uuid: selectedBranchReducer.uuid,
    });
    isLoadingRef.current = false;
    if (response && response.status === 200) {
      if (filter.page === 1)
        setCampaigns({
          results: response.data.results.data || [],
          totalCount: response.data.results.total || 0,
        });
      else
        setCampaigns((items) => ({
          results: items.results.concat(response.data.results.data || []),
          totalCount: response.data.results.total || 0,
        }));
      setCampaignTabsData((items) =>
        items.map((item) => {
          const localItem = { ...item };
          if (localItem.key === -1)
            localItem.totalCount
              = response.data.results.counts.reduce(
                (total, element) => total + +Object.values(element),
                0,
              ) || 0;
          else
            localItem.totalCount
              = (response.data.results.counts
                && response.data.results.counts.findIndex(
                  (element) => element[localItem.key],
                ) !== -1
                && response.data.results.counts.find(
                  (element) => element[localItem.key],
                )[localItem.key])
              || 0;
          return localItem;
        }),
      );
    } else {
      setCampaigns({
        results: [],
        totalCount: 0,
      });
      setCampaignTabsData((items) =>
        items.map((item) => ({ ...item, totalCount: 0 })),
      );
    }
    setIsLoading(false);
  }, [filter, filterBy]);

  const getAllActiveJobs = useCallback(
    async (localJobUuid) => {
      setIsLoading(true);
      const response = await GetAllCampaignActiveJobs({
        limit: 10,
        page: 1,
        job_uuid: localJobUuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        const currentJob = response.data.results.jobs.find(
          (item) => item.uuid === localJobUuid,
        );
        if (currentJob) setIsOpenAddDialog(true);
        else showError(t('job-not-found-description'));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  useEffect(() => {
    setIsLoading(true);
    getAllCampaigns();
  }, [getAllCampaigns, filter, filterBy]);

  useEffect(() => {
    const localJobUuid = new URLSearchParams(search).get('job_uuid');
    if (localJobUuid) {
      setJobUuid(localJobUuid);
      getAllActiveJobs(localJobUuid);
    }
  }, [getAllActiveJobs, search]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      document.body.classList.remove('bg-gray-lighter');
    },
    [],
  );

  useEffect(() => {
    document.body.classList.add('bg-gray-lighter');
  }, []);

  const onScrollHandler = useCallback(() => {
    if (
      (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
        || bodyRef.current.scrollTop + bodyRef.current.clientHeight
          >= bodyRef.current.firstChild.clientHeight - 5)
      && campaigns.results.length < campaigns.totalCount
      && !isLoading
      && !isLoadingRef.current
    )
      setFilter((items) => ({ ...items, page: filter.page + 1 }));
  }, [campaigns, bodyRef, isLoading, filter]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);
  return (
    <div className="campaign-page-wrapper page-wrapper">
      <Backdrop className="spinner-wrapper" open={isLoadingVerify}>
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
      <div className="campaign-header-wrapper">
        <div className="header-section">
          <div className="header-text-wrapper">
            <span className="header-text-x2">
              {t(`${translationPath}campaigns`)}
            </span>
            {/* <span className="score-section">
              <span>$342,00</span>
              <span className="px-1">&#x25cf;</span>
              <span className="fw-medium">
                {t(`${translationPath}languages`)}
                <span className="px-1">(5)</span>
              </span>
              <span className="px-1">&#x25cf;</span>
              <span className="fw-medium">
                {t(`${translationPath}matching-score`)}
                <span className="px-1 c-green-primary">(90%)</span>
              </span>
              <TooltipsComponent
                contentComponent={<span className="far fa-question-circle mx-1" />}
                title="matching-score-description"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                placement="bottom"
              />
            </span> */}
          </div>
          <div>
            <span>{t(`${translationPath}campaign-header-description`)}</span>
          </div>
        </div>
        <div>
          <ButtonBase
            className="btns theme-solid bg-green-primary mx-0"
            onClick={() => setIsOpenAddDialog(true)}
            disabled={
              !getIsAllowedPermissionV2({
                permissions,
                permissionId: CampaignsPermissions.AddCampaigns.key,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}new-campaign`)}</span>
          </ButtonBase>
        </div>
      </div>
      <div className="filter-and-content-wrapper">
        <div className="filter-sections-wrapper">
          <div className="filter-section px-3">
            <TabsComponent
              data={campaignTabsData}
              currentTab={activeTab}
              labelInput="label"
              totalCountInput="totalCount"
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
                setCampaigns({
                  results: [],
                  totalCount: 0,
                });
                setFilter((items) => ({
                  ...items,
                  page: 1,
                  status:
                    campaignTabsData[currentTab].key !== -1
                      ? campaignTabsData[currentTab].key
                      : null,
                }));
              }}
              isDisabled={isLoading}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div className="filter-section">
            <div className="filter-item twice">
              <Inputs
                idRef="searchFilterRef"
                endAdornment={<span className="fas fa-search mx-3" />}
                onKeyUp={searchHandler}
                label="search"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div className="filter-item">
              <SharedAPIAutocompleteControl
                isFullWidth
                controlWrapperClasses="mb-0"
                stateKey="user_uuid"
                placeholder="show-all"
                onValueChanged={({ value }) => {
                  setFilterBy((items) => ({ ...items, created_by: value }));
                  setFilter((items) => ({ ...items, page: 1 }));
                }}
                translationPath={translationPath}
                searchKey="search"
                startAdornment="created-by"
                getDataAPI={GetAllSetupsUsers}
                parentTranslationPath={parentTranslationPath}
                getOptionLabel={(option) =>
                  `${
                    option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en)
                  }${
                    option.last_name
                    && ` ${option.last_name[i18next.language] || option.last_name.en}`
                  }`
                }
              />
            </div>
            <div className="filter-item">
              <SortByAutoCompleteControl
                idRef="sortByFilter"
                startAdornment="sort-by-dots"
                onSelectedValueChanged={(newValue) => {
                  setFilterBy((items) => ({ ...items, order_by: newValue }));
                  if (filter.page !== 0) setFilter({ ...filter, page: 1 });
                }}
                inputPlaceholder="sort-by"
                filterBy={filterBy}
                endAdornment={
                  <ButtonBase
                    className="btns theme-transparent h-100 w-100 miw-40px mx-0 br-0"
                    onClick={() => {
                      if (filter.page !== 1) setFilter({ ...filter, page: 1 });
                      setFilterBy((items) => ({
                        ...items,
                        order_by: getOrderByValue(filterBy),
                        direction:
                          (filterBy.direction === 'desc' && 'asc') || 'desc',
                      }));
                    }}
                  >
                    <span
                      className={`fas fa-sort-amount-${
                        (filterBy.direction === 'desc' && 'down') || 'up'
                      }`}
                    />
                  </ButtonBase>
                }
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
          </div>
        </div>
        {!isLoading && campaigns && campaigns.results.length === 0 && (
          <div className="d-flex-center header-text-x2">
            <span>{t(`${translationPath}no-results-found`)}</span>
          </div>
        )}
        <div className="content-section-wrapper" ref={bodyRef}>
          <CampaignCardComponent
            data={campaigns}
            isLoading={isLoading}
            bodyRef={bodyRef}
            onLoadMore={() => {
              setIsLoading(true);
              setFilter((items) => ({ ...items, page: filter.page + 1 }));
            }}
            onCampaignCardClicked={onCampaignCardClicked}
            parentTranslationPath={parentTranslationPath}
            onActionsClicked={onActionsClicked}
          />
        </div>
      </div>
      {isOpenAddDialog && (
        <CampaignAddDialog
          isOpen={isOpenAddDialog}
          job_uuid={jobUuid}
          onSave={(newCampaign) => {
            setActiveItem(newCampaign);
            setFilter((items) => ({ ...items, page: 1 }));
            setIsOpenManagementDialog(true);
          }}
          isOpenChanged={() => setIsOpenAddDialog(false)}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenManagementDialog && activeItem && (
        <CampaignManagementDialog
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
          }}
          onStartCampaignHandler={onStartCampaignHandler}
          onSessionStart={(session, state) => {
            setActiveItem((items) => ({
              ...items,
              campaign_channels: state.selectedChannels || null,
              campaign_contracts: state.selectedContracts || null,
              cost: state.totalCost,
            }));
            setFilter((items) => ({ ...items, page: 1 }));
            // noinspection JSUnresolvedVariable
            window.fastspring.builder.push(session);
            setIsOpenManagementDialog(false);
          }}
          isOpenChanged={(isReload) => {
            if (isReload) setFilter((items) => ({ ...items, page: 1 }));
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenDeleteDialog && (
        <CampaignDeleteDialog
          activeItem={activeItem}
          isOpen={isOpenDeleteDialog}
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenCampaignDoneDialog && (
        <CampaignDoneDialog
          activeItem={activeItem}
          isOpen={isOpenCampaignDoneDialog}
          isOpenChanged={(event) => {
            event.preventDefault();
            setFilter((items) => ({ ...items, page: 1 }));
            setIsOpenCampaignDoneDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenCampaignReportDialog && (
        <CampaignReportDialog
          activeItem={activeItem}
          isOpen={isOpenCampaignReportDialog}
          isOpenChanged={() => {
            setIsOpenCampaignReportDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      <FastSpringComponent
        onErrorCallback={onErrorCallback}
        onPopupClosed={onPopupClosed}
      />
    </div>
  );
};
export default CampaignPage;
