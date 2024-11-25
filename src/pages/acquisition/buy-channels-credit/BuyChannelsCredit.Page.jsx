// noinspection JSUnresolvedVariable

import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { Backdrop, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useTitle } from '../../../hooks';
import { ChannelDetailsCard, BuyChannelsCreditsTabs } from '../shared';
import {
  FastSpringComponent,
  LoaderComponent,
  TabsComponent,
} from '../../../components';
import { CardFilterBy } from '../shared/filters';
import './BuyChannelsCredit.Style.scss';
import { ByChannelsCreditsV2, VerifyTransactionV2 } from '../../../services';
import { showError } from '../../../helpers';
import { BuyCreditsDoneDialog } from './dialogs';
import { ChannelsSortByEnum } from '../../../enums';

const parentTranslationPath = 'BuyChannelsCreditPage';
const translationPath = '';
const BuyChannelsCreditPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [isLoadingTransaction, setIisLoadingTransaction] = useState(false);
  const [isOpenBuyCreditDoneDialog, setIsOpenBuyCreditDoneDialog] = useState(false);
  const [buyChannelsTabsData] = useState(() => BuyChannelsCreditsTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 0,
    title: '',
  });
  const [filterBy, setFilterBy] = useState({
    order_by: ChannelsSortByEnum.costFromLowToHigh.key,
    direction: ChannelsSortByEnum.costFromLowToHigh.direction,
    industry_id: '',
    category: { parent: null, sub_category_id: '' },
    include_location_id: '',
    exact_location_id: '',
    business_model: '',
    currency: '',
  });
  const { t } = useTranslation([parentTranslationPath]);
  useTitle(t(`${translationPath}buy-channels-credit`));
  const reset = (values) => ({
    ...values,
  });
  const reducer = useCallback((state, action) => {
    if (action.subParentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.subParentId]: {
            ...state[action.parentId][action.subParentId],
            [action.id]: action.value,
          },
        },
      };
    if (action.parentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.id]: action.value,
        },
      };
    if (action.id === 'reset') return reset(action.value);
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(
    reducer,
    {
      campaign_channels: [],
      campaign_contracts: [],
      totalCost: 0,
    },
    reset,
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
    if (!data) {
      setIsLoading(false);
      setIisLoadingTransaction(false);
    } else {
      const localData = { ...data };
      setIsLoadingVerify(true);
      let attempts = 0;
      const VerifyHandler = () => {
        setTimeout(() => {
          attempts++;
          VerifyTransactionV2(data?.id)
            .then(() => {
              // const response = await CampaignCheckout({
              //   campaign_uuid: activeItem.uuid,
              // });
              setIsOpenBuyCreditDoneDialog(true);
              setIsLoadingVerify(false);
              setIsLoading(false);
              setIisLoadingTransaction(false);
            })
            .catch((error) => {
              if (attempts < 4) VerifyHandler();
              else if (error && error.response && error.response.status === 406)
                setTimeout(() => {
                  onPopupClosed(localData);
                }, 3000);
              else {
                setIsLoadingVerify(false);
                setIsLoading(false);
                setIisLoadingTransaction(false);
                showError(t(`${translationPath}transaction-pay-failed`));
              }
            });
        }, 4000);
      };
      VerifyHandler();
    }
  };
  const onErrorCallback = (code, message) => {
    showError(t(`${translationPath}${message}`));
    setIsLoading(true);
    setIisLoadingTransaction(false);
  };
  // noinspection JSUnresolvedVariable
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIisLoadingTransaction(true);
    const response = await ByChannelsCreditsV2({
      channels: state.campaign_channels.map((item) => ({
        quantity: item.credits,
        product_id: item.uuid,
      })),
    });
    if (response && response.status === 200) {
      const session = {
        reset: true,
        // products: response.data.results.products.map((item) => ({
        //   path: item[0],
        //   quantity: item[1],
        // })),
        products: [{ path: response.data.results.fast_spring_id, quantity: 1 }],
        coupon: 'FREE',
        paymentContact: response.data.results.data,
        checkout: false,
      };
      window.fastspring.builder.push(session);
    } else {
      showError(t(`${translationPath}campaign-update-failed`));
      setIsLoading(false);
      setIisLoadingTransaction(false);
    }
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

  return (
    <>
      <form
        noValidate
        onSubmit={saveHandler}
        className="buy-channels-credit-wrapper page-wrapper"
      >
        <Backdrop className="spinner-wrapper" open={isLoadingVerify}>
          <CircularProgress color="inherit" size={50} />
        </Backdrop>
        <div className="d-flex-column px-3 mb-3">
          <span className="header-text-x2">
            {t(`${translationPath}buy-channels-credit`)}
          </span>
          <span className="c-gray-secondary">
            {t(`${translationPath}buy-channels-credit-description`)}
          </span>
          <div className="d-flex pt-2">
            <Alert severity="info">
              {t(`${translationPath}buy-channels-credit-warning-description`)}
            </Alert>
          </div>
        </div>
        <div className="second-section-wrapper">
          <CardFilterBy
            // isDisabled={activeTab === 0}
            onFilterByChanged={(newValue) => {
              setFilter((items) => ({ ...items, page: 0 }));
              setFilterBy((items) => ({
                ...items,
                [newValue.id]: newValue.value,
              }));
            }}
            parentTranslationPath={parentTranslationPath}
            filterBy={filterBy}
            wrapperClasses={'mt-4'}
          />
          <div className="channels-contents-wrapper">
            <TabsComponent
              data={buyChannelsTabsData}
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
                    || isLoadingTransaction
                    || ((!state.campaign_channels
                      || state.campaign_channels?.length === 0)
                      && (!state.campaign_contracts
                        || state.campaign_contracts?.length === 0))
                  }
                  type="submit"
                >
                  <LoaderComponent
                    isLoading={isLoading}
                    isSkeleton
                    wrapperClasses="position-absolute w-100 h-100"
                    skeletonStyle={{ width: '100%', height: '100%' }}
                  />
                  <span>{t(`${translationPath}buy-now`)}</span>
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
      {isOpenBuyCreditDoneDialog && (
        <BuyCreditsDoneDialog
          selectedChannels={state.campaign_channels}
          selectedContracts={state.campaign_contracts}
          isOpen={isOpenBuyCreditDoneDialog}
          isOpenChanged={(event) => {
            event.preventDefault();
            setFilter((items) => ({ ...items, page: 0 }));
            setIsOpenBuyCreditDoneDialog(false);
            setState({ id: 'reset', value: {} });
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </>
  );
};
export default BuyChannelsCreditPage;
