import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { Backdrop, CircularProgress } from '@mui/material';
import { useTitle } from '../../../hooks';
import { ChannelDetailsCard, MyChannelsCreditsTabs } from '../shared';
import {
  FastSpringComponent,
  LoaderComponent,
  TabsComponent,
} from '../../../components';
import './MyChannelsCredit.Style.scss';
import {
  AddChannelsToCampaignV2,
  CampaignCheckoutV2,
  CheckCampaignDetails,
  VerifyTransactionV2,
} from '../../../services';
import { showError, showSuccess } from '../../../helpers';
import {
  CampaignAddDialog,
  CampaignDoneDialog,
  CampaignManagementDialog,
} from '../campaigns/dialogs';
import { ChannelsSortByEnum } from '../../../enums';
import { SetupsReducer, SetupsReset } from '../../setups/shared';
import { MutateVonqErrorsHelper } from '../campaigns/helpers/MutateVonqErrors.helper';

const parentTranslationPath = 'MyChannelsCreditPage';
const campaignParentTranslationPath = 'CampaignPage';
const translationPath = '';
const MyChannelsCreditPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [myChannelsTabsData] = useState(() => MyChannelsCreditsTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [isOpenCampaignDoneDialog, setIsOpenCampaignDoneDialog] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
    title: '',
  });
  const [filterBy, setFilterBy] = useState({
    has_credit: true,
    order_by: ChannelsSortByEnum.costFromLowToHigh.key,
    direction: ChannelsSortByEnum.costFromLowToHigh.direction,
  });
  const { t } = useTranslation([parentTranslationPath]);
  useTitle(t(`${translationPath}my-channels-credit`));
  const stateInitRef = useRef({
    selectedChannels: [],
    selectedContracts: [],
    totalCost: 0,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const onFilterByChanged = (newValue) => {
    setFilterBy(newValue);
  };
  const onFilterChanged = (newValue) => {
    setFilter(newValue);
  };
  const onIsLoadingChanged = (newValue) => {
    setIsLoading(newValue);
  };
  const onPopupClosed = (data) => {
    if (!data) setIsOpenManagementDialog(true);
    else {
      const localData = { ...data };
      setIsLoadingVerify(true);
      let attempts = 0;
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
                  setFilter((items) => ({ ...items, page: 0 }));
                  showSuccess(t(`${translationPath}campaign-updated-successfully`));
                } else {
                  setIsLoadingVerify(false);
                  setIsOpenManagementDialog(true);
                  showError(t(`${translationPath}campaign-update-failed`));
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
              else if (error && error.status === 406)
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
  const onStartCampaignHandler = () => {
    setIsOpenManagementDialog(false);
    setIsOpenCampaignDoneDialog(true);
  };
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsOpenAddDialog(true);
  };

  useEffect(
    () => () => {
      document.body.classList.remove('bg-gray-lighter');
    },
    [],
  );

  useEffect(() => {
    document.body.classList.add('bg-gray-lighter');
  }, []);
  // noinspection JSUnresolvedVariable
  return (
    <>
      <form
        noValidate
        onSubmit={saveHandler}
        className="my-channels-credit-wrapper page-wrapper"
      >
        <Backdrop className="spinner-wrapper" open={isLoadingVerify}>
          <CircularProgress color="inherit" size={50} />
        </Backdrop>
        <div className="d-flex-column px-3 mb-3">
          <span className="header-text-x2">
            {t(`${translationPath}my-channels-credit`)}
          </span>
          <span className="c-gray-secondary">
            {t(`${translationPath}my-channels-credit-description`)}
          </span>
        </div>
        <div className="second-section-wrapper">
          {/* <CardFilterBy */}
          {/*  // isDisabled={activeTab === 0} */}
          {/*  onFilterByChanged={(newValue) => { */}
          {/*    setFilterBy((items) => ({ */}
          {/*      ...items, */}
          {/*      [newValue.id]: newValue.value, */}
          {/*    })); */}
          {/*    setFilter((items) => ({ ...items, page: 1 })); */}
          {/*  }} */}
          {/*  parentTranslationPath={parentTranslationPath} */}
          {/* /> */}
          <div className="channels-contents-wrapper">
            <TabsComponent
              data={myChannelsTabsData}
              currentTab={activeTab}
              labelInput="label"
              idRef="ChannelsTabsRef"
              isWithLine
              isPrimary
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              isDisabled={isLoading}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              dynamicComponentProps={{
                state,
                filter,
                filterBy,
                onFilterByChanged,
                onFilterChanged,
                onStateChanged,
                isLoading,
                onIsLoadingChanged,
                parentTranslationPath,
              }}
            />
          </div>
          <div className="channels-details-card-wrapper">
            <ChannelDetailsCard
              selectedChannels={state.campaign_channels}
              selectedContracts={state.campaign_contracts}
              total={state.totalCost}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses={'mt-4'}
            />
            <div className="d-flex-v-center-h-end w-100">
              {state?.campaign_channels?.length > 0 && (
                <ButtonBase
                  className="btns theme-solid bg-green-primary mx-0 "
                  disabled={
                    isLoading
                    || ((!state.campaign_channels
                      || state.campaign_channels.length === 0)
                      && (!state.campaign_contracts
                        || state.campaign_contracts.length === 0))
                  }
                  type="submit"
                >
                  <LoaderComponent
                    isLoading={isLoading}
                    isSkeleton
                    wrapperClasses="position-absolute w-100 h-100"
                    skeletonStyle={{ width: '100%', height: '100%' }}
                  />
                  <span>{t(`${translationPath}new-campaign`)}</span>
                </ButtonBase>
              )}
            </div>
          </div>
          <FastSpringComponent
            onErrorCallback={onErrorCallback}
            onPopupClosed={onPopupClosed}
          />
        </div>
      </form>
      {isOpenAddDialog && (
        <CampaignAddDialog
          isOpen={isOpenAddDialog}
          onSave={async (newCampaign) => {
            const localNewCampaign = { ...newCampaign };
            setIsLoadingVerify(true);
            const bodyObj = {
              channels: state?.campaign_channels?.map((item) => item.uuid) || [],
              // contracts: state?.campaign_contracts?.map((item) => ({
              //   uuid: item.uuid,
              // })),
              campaign_uuid: newCampaign.uuid,
            };
            const response = await AddChannelsToCampaignV2(bodyObj);
            setIsLoadingVerify(false);
            if (response && response.status === 200) {
              localNewCampaign.campaign_channels
                = response.data.results.campaign_channels;
              localNewCampaign.campaign_contracts
                = response.data.results.campaign_contracts;
              setFilter((items) => ({ ...items, page: 0 }));
            } else
              showError(
                `${translationPath}add-selected-channels-failed-description`,
              );
            setActiveItem(localNewCampaign);
            setIsOpenManagementDialog(true);
          }}
          isOpenChanged={() => setIsOpenAddDialog(false)}
          parentTranslationPath={campaignParentTranslationPath}
        />
      )}
      {isOpenManagementDialog && activeItem && (
        <CampaignManagementDialog
          activeItem={activeItem}
          isOpen={isOpenManagementDialog}
          onSave={() => {
            setFilter((items) => ({ ...items, page: 0 }));
          }}
          onStartCampaignHandler={onStartCampaignHandler}
          onSessionStart={(session) => {
            // noinspection JSUnresolvedVariable
            window.fastspring.builder.push(session);
            setIsOpenManagementDialog(false);
          }}
          isOpenChanged={(isReload) => {
            if (isReload) setFilter((items) => ({ ...items, page: 0 }));
            setState({
              id: 'edit',
              value: {
                campaign_channels: [],
                campaign_contracts: [],
                totalCost: 0,
              },
            });
            setIsOpenManagementDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={campaignParentTranslationPath}
        />
      )}
      {isOpenCampaignDoneDialog && (
        <CampaignDoneDialog
          activeItem={activeItem}
          isOpen={isOpenCampaignDoneDialog}
          isOpenChanged={(event) => {
            event.preventDefault();
            setState({
              id: 'edit',
              value: {
                campaign_channels: [],
                campaign_contracts: [],
                totalCost: 0,
              },
            });
            setFilter((items) => ({ ...items, page: 0 }));
            setIsOpenCampaignDoneDialog(false);
            setActiveItem(null);
          }}
          parentTranslationPath={campaignParentTranslationPath}
        />
      )}
    </>
  );
};
export default MyChannelsCreditPage;
