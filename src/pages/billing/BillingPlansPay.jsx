import React, { useCallback, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Button,
  Select,
  Backdrop,
  MenuItem,
  FormControl,
  CircularProgress,
} from '@mui/material';
import moment from 'moment';
import Skeleton from '@mui/material/Skeleton';
import { useToasts } from 'react-toast-notifications';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { administrationAPI } from '../../api/administration';
import { userSubscription } from '../../stores/types/userSubscription';
import { GlobalRerender, showError } from '../../helpers';

const translationPath = '';
const parentTranslationPath = 'Billing';

export const BillingPlansPay = ({ selectedPlan, handlePlanClicked }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [summarySelect, setSummarySelect] = useState(null);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [checkActionLoading, setCheckActionLoading] = useState(false);
  const [checkOutType, setCheckOutType] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlanItem, setSelectedPlanItem] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { addToast } = useToasts(); // Toasts
  const dispatch = useDispatch();
  const [planDate, setPlanDate] = useState(
    moment(new Date()).add(30, 'd').format('MMM DD, YYYY'),
  );
  const [begginingDate, setBegginingDate] = useState(t(`${translationPath}today`));
  const existingScriptRef = useRef(null);

  const checkServicesAction = useCallback(() => {
    setServiceLoading(true);
    setCheckActionLoading(true);
    administrationAPI
      .CheckServicesAction(selectedPlan?.uuid)
      .then((response) => {
        const { results } = response.data;
        setCurrentPlan(results?.cart_old[0]);
        setSelectedPlanItem(results?.cart[0]);
        setCheckOutType(results?.type);
        setTotalPrice(results?.total);

        if (results.is_downgrade) {
          setSummarySelect(1);
          setBegginingDate(
            `${t(`${translationPath}after`)} ${
              results?.cart_old[0]?.remaining_days
            } ${
              results?.cart_old[0]?.remaining_days === 1
                ? t(`${translationPath}day`)
                : t(`${translationPath}days`)
            }`,
          );

          const oldDate = moment(new Date())
            .add(results?.cart_old[0]?.remaining_days, 'd')
            .format('MMM DD, YYYY');

          if (results?.cart[0]?.service_type === 1)
            setPlanDate(moment(oldDate).add(30, 'd').format('MMM DD, YYYY'));
          else setPlanDate(moment(oldDate).add(365, 'd').format('MMM DD, YYYY'));
        } else {
          setSummarySelect(0);
          if (results?.cart[0]?.service_type === 1)
            setPlanDate(moment(new Date()).add(30, 'd').format('MMM DD, YYYY'));
          else setPlanDate(moment(new Date()).add(365, 'd').format('MMM DD, YYYY'));
        }

        setServiceLoading(false);
        setCheckActionLoading(false);
      })
      .catch(() => {});
  }, [t, selectedPlan.uuid]);

  const fastSpringCallBack = () => {};
  const paymentReceived = () => {};
  const onFSPopupClosed = useCallback(
    (data) => {
      if (data) {
        let attempts = 0;
        const VerifyHandler = () => {
          setTimeout(() => {
            attempts++;

            setVerifyLoading(true);
            administrationAPI
              .VerifyTransaction(data?.id)
              .then((response) => {
                const transactionResult = response?.data?.results;
                administrationAPI.GetCurrentPlan().then((response) => {
                  const { results } = response.data;
                  if (results && results.length > 0) {
                    const permissionsList = results
                      .map((item) =>
                        item?.service?.features
                          ?.filter((el) => el.status)
                          ?.map((el) => ({
                            permissionsId: el.slug,
                            title: el.title,
                          })),
                      )
                      .flat();

                    localStorage.setItem(
                      'UserSubscriptions',
                      JSON.stringify({
                        subscription: transactionResult,
                        permissions: permissionsList,
                      }),
                    );
                    dispatch({
                      type: userSubscription.SUCCESS,
                      payload: {
                        subscriptions: transactionResult,
                      },
                    });
                  }
                });
                handlePlanClicked(null, false);
                setVerifyLoading(false);
                GlobalRerender();
              })
              .catch((error) => {
                if (attempts < 4) VerifyHandler();
                else if (error?.response?.status === 406)
                  setTimeout(() => {
                    onFSPopupClosed(data);
                  }, 4000);
                else {
                  setVerifyLoading(false);
                  showError(
                    t(
                      `${translationPath}there-was-an-error-in-your-transaction-we-will-contact-you-soon`,
                    ),
                    error,
                  );
                }
              });
          }, 15000);
        };
        VerifyHandler();
      }
    },
    [t],
  );

  useEffect(() => {
    const scriptId = 'fsc-api';
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const storeFrontToUse = process.env.REACT_APP_FASTSPRING_STOREFRONT;
      existingScriptRef.current = document.createElement('script');
      existingScriptRef.current.type = 'text/javascript';
      existingScriptRef.current.id = scriptId;
      existingScriptRef.current.src
        = 'https://d1f8f9xcsvx3ha.cloudfront.net/sbl/0.8.5/fastspring-builder.min.js';
      existingScriptRef.current.dataset.storefront = storeFrontToUse;
      existingScriptRef.current.setAttribute('crossorigin', 'anonymous');
      existingScriptRef.current.setAttribute(
        'integrity',
        'sha384-9+2vmux6jSf5VsnjRIyK3wqgxTvxCLqZ1Qu6YFBNqNLKDef+Dz0uI725LVRT+n/a',
      );
      window.fastSpringCallBack = fastSpringCallBack;
      window.paymentReceived = paymentReceived;
      window.onFSPopupClosed = onFSPopupClosed;
      existingScriptRef.current.setAttribute(
        'data-data-callback',
        'fastSpringCallBack',
      );
      existingScriptRef.current.setAttribute(
        'data-popup-webhook-received',
        'paymentReceived',
      );
      existingScriptRef.current.setAttribute('data-popup-closed', 'onFSPopupClosed');
      document.body.appendChild(existingScriptRef.current);
    }
  }, [onFSPopupClosed]);

  const payNowHandler = () => {
    setServiceLoading(true);
    administrationAPI
      .GetCheckOutData(selectedPlan?.uuid, checkOutType)
      .then((response) => {
        setServiceLoading(false);
        if (checkOutType !== 'downgrade') {
          const buyerInfo = response?.data.results?.data;
          const session = {
            reset: true,
            products: [
              {
                path: response?.data.results?.product_path,
                quantity: 1,
              },
            ],
            coupon: 'FREE',
            paymentContact: {
              email: buyerInfo.email,
              firstName: buyerInfo.firstName,
              lastName: buyerInfo.lastName,
              company: buyerInfo.company,
              addressLine1: buyerInfo.addressLine1,
              city: buyerInfo.city,
              country: buyerInfo.country,
            },
            checkout: true,
          };
          window.fastspring.builder.push(session);
        } else {
          addToast(response?.data?.message, {
            appearance: 'success',
            autoDismiss: true,
          });
          handlePlanClicked(null, false);
        }
      });
  };

  useEffect(() => {
    if (selectedPlan && selectedPlan?.uuid) checkServicesAction();
  }, [checkServicesAction, selectedPlan]);

  useEffect(
    () => () => {
      if (existingScriptRef?.current)
        document.body.removeChild(existingScriptRef?.current);
    },
    [],
  );

  return (
    <div className="billing-plans-pay-wrapper">
      <div className="pay-bill-body-wrapper">
        <div className="back-button-wrapper">
          <Button onClick={() => handlePlanClicked(null, false)}>
            <i className="fa fa-chevron-left px-2" />
            {t(`${translationPath}back-to-plans`)}
          </Button>
        </div>
        <div className="section-title">
          {t(`${translationPath}change-subscription`)}
        </div>
        <div className="section-content-wrapper">
          {checkActionLoading && <Skeleton variant="rectangular" />}
          {currentPlan && (
            <div className="current-plan-card">
              <div className="current-plan-header">
                <div className="header-main-title">
                  {t(`${translationPath}current-plan`)}
                </div>
                <div className="header-title">{currentPlan?.title}</div>
              </div>
              <div className="plan-card-body">
                <div className="top-features-wrapper">
                  {currentPlan?.top_features.map((el, i) => (
                    <div
                      key={`${i + 1}-eva-rec-plan-top`}
                      className={`top-features-item ${
                        el.title !== 'Ideal Size' ? 'is-flex' : ''
                      }`}
                    >
                      <div className="top-features-title">{el.title}</div>
                      <div className="top-features-value">{el.value}</div>
                      {el.title === 'Ideal Size' && (
                        <div className="horizental-divider" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="horizental-divider" />
                {currentPlan?.cost === null ? (
                  <div className="plan-cost-wrapper">
                    <div className="h4 pt-2">{t(`${translationPath}offline`)}</div>
                  </div>
                ) : (
                  <div className="plan-cost-wrapper">
                    <div className="cost-value">{currentPlan?.cost}</div>
                    <span className="dollar-sign pr-1-reversed">$</span>
                    <span className="year-month-cost">
                      {` / ${t(`${translationPath}month`)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          {checkActionLoading ? (
            <Skeleton variant="rectangular" />
          ) : (
            <div className="new-plan-card">
              <div className="current-plan-header">
                <div className="header-main-title">
                  {t(`${translationPath}new-plan`)}
                </div>
                <div className="header-title">{selectedPlanItem?.title}</div>
              </div>
              <div className="plan-card-body">
                <div className="top-features-wrapper">
                  {selectedPlanItem?.top_features.map((el, i) => (
                    <div
                      key={`${i + 1}-eva-rec-plan-top`}
                      className={`top-features-item ${
                        el.title !== 'Ideal Size' ? 'is-flex' : ''
                      }`}
                    >
                      <div className="top-features-title">{el.title}</div>
                      <div className="top-features-value">{el.value}</div>
                      {el.title === 'Ideal Size' && (
                        <div className="horizental-divider" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="horizental-divider" />
                <div className="plan-cost-wrapper">
                  <div className="cost-value">{selectedPlanItem?.cost}</div>
                  <span className="dollar-sign pr-1-reversed">$</span>
                  <span className="year-month-cost">
                    {` / ${t(`${translationPath}month`)}`}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="order-summary-card-wrapper">
            <div className="order-summary-card">
              <div className="order-summary-header">
                <div className="order-summary-header">
                  <div className="order-summary-title">
                    {t(`${translationPath}order-summary`)}
                  </div>
                  <div className="order-summary-sub-title">Plan:</div>
                  <div className="order-summary-info">
                    {checkActionLoading ? (
                      <Skeleton variant="rectangular" width="100%" height="1rem" />
                    ) : (
                      `${selectedPlanItem?.title} / ${
                        selectedPlanItem?.service_type === 1
                          ? t(`${translationPath}monthly`)
                          : t(`${translationPath}yearly`)
                      } ${t(`${translationPath}subscription`)}`
                    )}
                  </div>
                  <div className="order-summary-cost">
                    {checkActionLoading ? (
                      <Skeleton
                        className="mt-2"
                        variant="rectangular"
                        width="40%"
                        height="1rem"
                      />
                    ) : (
                      <>
                        <span className="dollar-sign">$</span>
                        <div className="cost-value">{selectedPlanItem?.cost}</div>
                        <span className="year-month-cost">
                          {` / ${t(`${translationPath}month`)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="horizental-divider" />
              </div>
              <div className="order-summary-body">
                <div className="order-summary-body-title">
                  {t(`${translationPath}make-stage`)}:
                </div>
                <div className="order-summary-select-wrapper">
                  {checkActionLoading ? (
                    <Skeleton variant="rectangular" width="100%" height="3.5rem" />
                  ) : (
                    <FormControl variant="outlined">
                      <Select
                        disabled
                        value={summarySelect}
                        onChange={(event) => {
                          setSummarySelect(event.target.value);
                        }}
                      >
                        <MenuItem value={0}>
                          {t(`${translationPath}immediately`)}
                        </MenuItem>
                        <MenuItem value={1}>
                          {t(`${translationPath}change-on-next-bill`)}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </div>
                <div className="order-summary-body-info">
                  {checkActionLoading ? (
                    <>
                      <Skeleton
                        width="100%"
                        height="1rem"
                        variant="rectangular"
                        className="mt-2"
                      />
                      <Skeleton
                        width="80%"
                        height="1rem"
                        variant="rectangular"
                        className="mt-1"
                      />
                    </>
                  ) : (
                    <>
                      <span>
                        {t(`${translationPath}your`)}
                        <span className="font-weight-bold">
                          {` ${selectedPlanItem?.title} `}
                        </span>
                        {t(`${translationPath}plan-subscription-begins`)}
                        <span className="font-weight-bold">{` ${begginingDate} `}</span>
                        {t(`${translationPath}and-will-renew-on`)}{' '}
                      </span>
                      <span className="order-date">{planDate}</span>
                    </>
                  )}
                </div>
                {checkActionLoading ? (
                  <Skeleton
                    className="mt-6"
                    variant="rectangular"
                    width="20%"
                    height="2.5rem"
                  />
                ) : (
                  totalPrice && (
                    <>
                      <div className="horizental-divider" />
                      <div className="order-summary-cost">
                        {t(`${translationPath}total`)}:
                        <div className="order-cost-wrapper">${totalPrice || 0}</div>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
            <div
              className={`pay-now-button-wrapper ${
                !checkOutType || serviceLoading ? 'is-disabled' : ''
              }`}
            >
              <Button
                onClick={payNowHandler}
                disabled={serviceLoading || !checkOutType}
              >
                {t(`${translationPath}pay-now`)}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Backdrop open={verifyLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default BillingPlansPay;
