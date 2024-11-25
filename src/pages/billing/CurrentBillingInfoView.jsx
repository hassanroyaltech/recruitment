import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  Switch,
  Backdrop,
  IconButton,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import { administrationAPI } from '../../api/administration';
import './Styles/CurrentPlanInfoView.Styles.scss';
import NoSubscriptionView from '../../shared/NoSubscriptionView/NoSubscriptionView';
import { useTitle } from '../../hooks';
import SimpleHeader from '../../components/Elevatus/TimelineHeader';
import { showError } from '../../helpers';
import NoPermissionComponent from '../../shared/NoPermissionComponent/NoPermissionComponent';

const translationPath = '';
const parentTranslationPath = 'Billing';

export const CurrentBillingInfoView = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [currentPlanCategory, setCurrentPlanCategory] = useState({
    rec: {
      is_canceled: true,
      is_trial: true,
    },
    ssess: {
      is_canceled: true,
      is_trial: true,
    },
  });
  const [currentCategory, setCurrentCategory] = useState(0);
  const [isConfirmDialogOpen, seIsConfirmDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isRec, setIsRec] = useState(false);
  const [isPayDisabled, setIsPayDisabled] = useState(true);
  const [hasExtraAmount, setHasExtraAmount] = useState({
    rec: [],
    ssess: [],
  });
  const { addToast } = useToasts(); // Toasts
  // const history = useHistory();
  const existingScriptRef = useRef(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  useTitle(t(`${translationPath}billing`));

  const getCurrentPlan = useCallback(() => {
    setIsPlanLoading(true);
    administrationAPI
      .GetCurrentPlan()
      .then((response) => {
        const { results } = response.data;
        if (results && results.length > 0) {
          if (
            results?.filter((item) => item?.service?.product === 'eva-rec')[0]
              ?.service?.features
            || results?.filter((item) => item?.service?.product === 'eva-ssess')[0]
              ?.service?.features
          )
            setHasExtraAmount({
              rec:
                results
                  ?.filter((item) => item?.service?.product === 'eva-rec')[0]
                  ?.service?.features.filter(
                    (el) => !el.is_unlimited && el.has_extra_limit,
                  )
                  ?.map((item) => ({ ...item, count: 0 })) || [],
              ssess:
                results
                  ?.filter((item) => item?.service?.product === 'eva-ssess')[0]
                  ?.service?.features.filter(
                    (el) => !el.is_unlimited && el.has_extra_limit,
                  )
                  ?.map((item) => ({ ...item, count: 0 })) || [],
            });
          setCurrentPlanCategory({
            rec: results?.filter((item) => item?.service?.product === 'eva-rec')[0]
              ?.service,
            ssess: results?.filter(
              (item) => item?.service?.product === 'eva-ssess',
            )[0]?.service,
          });

          const recIndex = results?.findIndex(
            (item) => item.service?.product === 'eva-rec',
          );
          const sessIndex = results?.findIndex(
            (item) => item.service?.product === 'eva-ssess',
          );

          if (recIndex !== -1 && sessIndex === -1) setCurrentCategory(0);
          if (sessIndex !== -1 && recIndex === -1) setCurrentCategory(1);
        } else setCurrentPlanCategory(null);

        setIsPlanLoading(false);
        setIsPayDisabled(false);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getCurrentPlan();
  }, [getCurrentPlan]);

  const onDialogSubmit = () => {
    setIsConfirmLoading(true);
    const serviceUuid
      = currentPlanCategory[currentCategory === 0 ? 'rec' : 'ssess'].uuid;

    if (serviceUuid)
      if (selectedAction === 'enable')
        administrationAPI
          .StopSubscription(serviceUuid)
          .then((response) => {
            seIsConfirmDialogOpen(false);
            addToast(response?.data?.message, {
              appearance: 'success',
              autoDismiss: true,
            });
            getCurrentPlan();
            setIsConfirmLoading(false);
          })
          .catch((error) => {
            setIsConfirmLoading(false);
            showError(t('Shared:failed-to-get-saved-data'), error);
          });
      else
        administrationAPI
          .CancelSubscription(serviceUuid)
          .then((response) => {
            seIsConfirmDialogOpen(false);
            addToast(response?.data?.message, {
              appearance: 'success',
              autoDismiss: true,
            });
            getCurrentPlan();
            setIsConfirmLoading(false);
          })
          .catch((error) => {
            setIsConfirmLoading(false);
            showError(t('Shared:failed-to-get-saved-data'), error);
            setIsConfirmLoading(false);
          });
  };

  const closeDialogHandler = () => {
    seIsConfirmDialogOpen(false);
  };

  const switchChangeHandler = (event) => {
    setSelectedAction(
      event.target.checked
        ? t(`${translationPath}enable`)
        : t(`${translationPath}disable`),
    );
    seIsConfirmDialogOpen(true);
  };

  const fastSpringCallBack = () => {};
  const paymentReceived = () => {};
  const onFSPopupClosed = useCallback(
    (data) => {
      if (data) {
        setVerifyLoading(true);

        let attempts = 0;
        const VerifyHandler = () => {
          setTimeout(() => {
            attempts++;
            administrationAPI
              .VerifyTransaction(data?.id)
              .then(() => {
                getCurrentPlan();
                setVerifyLoading(false);
              })
              .catch((error) => {
                if (attempts < 4) VerifyHandler();
                else {
                  if (error?.response?.status === 406)
                    setTimeout(() => {
                      onFSPopupClosed(data);
                    }, 4000);
                  else setVerifyLoading(false);

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
    setIsPayDisabled(true);
    const payload = hasExtraAmount[currentCategory === 0 ? 'rec' : 'ssess']
      .filter((item) => item.count !== 0)
      .map((item) => ({
        relation_uuid: item.system_feature_uuid,
        count: item.count,
      }));
    administrationAPI
      .GetCheckOutProductData('system_feature', payload)
      .then((response) => {
        const buyerInfo = response?.data?.results?.data;
        const productsArray = response?.data?.results?.products.map((item) => ({
          path: item[0],
          quantity: item[1],
        }));
        const session = {
          reset: true,
          products: productsArray,
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
        setIsPayDisabled(false);
      });
  };

  useEffect(
    () => () => {
      if (existingScriptRef.current)
        document.body.removeChild(existingScriptRef.current);
    },
    [],
  );

  const onRecPopperOpen = (event) => {
    if ((currentPlanCategory && !currentPlanCategory.rec) || !currentPlanCategory) {
      setIsRec(true);
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  const onSesPopperOpen = (event) => {
    if (
      (currentPlanCategory && !currentPlanCategory.ssess)
      || !currentPlanCategory
    ) {
      setIsRec(false);
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  return (
    <>
      <div className="current-plan-info-wrapper">
        <SimpleHeader name="plans" parentName="billing" />
        {currentPlanCategory && (
          <>
            <div className="plan-button-wrappers">
              <div
                onMouseEnter={onRecPopperOpen}
                className={`plan-button ${currentCategory === 0 ? 'is-active' : ''}`}
              >
                <Button
                  disabled={
                    (currentPlanCategory && !currentPlanCategory.rec)
                    || !currentPlanCategory
                  }
                  onClick={() => setCurrentCategory(0)}
                >
                  EVA-REC
                </Button>
              </div>
              <div
                onMouseEnter={onSesPopperOpen}
                className={`plan-button ${currentCategory === 1 ? 'is-active' : ''}`}
              >
                <Button
                  disabled={
                    (currentPlanCategory && !currentPlanCategory.ssess)
                    || !currentPlanCategory
                  }
                  onClick={() => setCurrentCategory(1)}
                >
                  EVA-SSESS
                </Button>
              </div>
            </div>
            <div className="current-plan-content">
              <div className="current-plan-card-section">
                {isPlanLoading ? (
                  <div className="current-plan-loader">
                    <Skeleton variant="rectangular" />
                  </div>
                ) : (
                  currentPlanCategory && (
                    <div className="current-plan-card">
                      <div className="billing-plans-card-item">
                        <div className="billing-plans-card-header is-current">
                          <div className="header-title">
                            {
                              currentPlanCategory[
                                currentCategory === 0 ? 'rec' : 'ssess'
                              ]?.title
                            }
                          </div>
                        </div>
                        <div className="billing-plans-card-priceing">
                          <div className="cost-value">
                            {currentPlanCategory[
                              currentCategory === 0 ? 'rec' : 'ssess'
                            ]?.is_offline
                              ? t(`${translationPath}custom`)
                              : currentPlanCategory[
                                currentCategory === 0 ? 'rec' : 'ssess'
                              ]?.cost}
                          </div>
                          {!currentPlanCategory[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ]?.is_offline && (
                            <>
                              <span className="dollar-sign pr-1">$</span>
                              <span className="year-month-cost">
                                {` / ${t(`${translationPath}month`)}`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="cost-down-arrow">▼</div>
                        <div className="plan-card-body">
                          <div className="top-features-wrapper">
                            {currentPlanCategory[
                              currentCategory === 0 ? 'rec' : 'ssess'
                            ]?.top_features
                              && currentPlanCategory[
                                currentCategory === 0 ? 'rec' : 'ssess'
                              ]?.top_features.map((el, i) => (
                                <div
                                  key={`${i + 1}-eva-rec-plan-top`}
                                  className={`top-features-item ${
                                    el.title !== 'Ideal Size' ? 'is-flex' : ''
                                  }`}
                                >
                                  <div className="top-features-title">
                                    {el.title}
                                  </div>
                                  <div className="top-features-value">
                                    {el.value}
                                  </div>
                                  {el.title === 'Ideal Size' && (
                                    <div className="horizental-divider" />
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="plan-card-action is-current">
                          <Button>{t(`${translationPath}current-plan`)}</Button>
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div className="current-plan-card-options">
                  {hasExtraAmount[currentCategory === 0 ? 'rec' : 'ssess'].length
                    !== 0 && (
                    <div
                      className={`pay-now-feature-button ${
                        isPayDisabled
                        || hasExtraAmount[
                          currentCategory === 0 ? 'rec' : 'ssess'
                        ].findIndex((item) => item.count !== 0) === -1
                          ? 'is-disabled'
                          : ''
                      }`}
                    >
                      <Button
                        disabled={
                          isPayDisabled
                          || hasExtraAmount[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ].findIndex((item) => item.count !== 0) === -1
                        }
                        onClick={payNowHandler}
                      >
                        {t(`${translationPath}pay-now`)}
                      </Button>
                    </div>
                  )}
                  <div className="options-title">
                    {t(`${translationPath}plan-settings`)}
                  </div>
                  {!currentPlanCategory[currentCategory === 0 ? 'rec' : 'ssess']
                    ?.is_trial
                    && !currentPlanCategory[currentCategory === 0 ? 'rec' : 'ssess']
                      ?.is_offline && (
                    <div className="options-item-title mb-3">
                      {t(`${translationPath}auto-renew`)}:
                      <div
                        className={`plans-switch ${
                          !currentPlanCategory[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ]?.is_canceled
                            ? 'is-checked'
                            : 'is-not-checked'
                        }`}
                      >
                        <Switch
                          disabled={isPlanLoading}
                          checked={
                            !currentPlanCategory[
                              currentCategory === 0 ? 'rec' : 'ssess'
                            ]?.is_canceled
                          }
                          onChange={switchChangeHandler}
                        />
                      </div>
                    </div>
                  )}
                  {!isPlanLoading && currentPlanCategory && (
                    <div className="options-item-title">
                      {t(`${translationPath}you-have`)}
                      <span className="pr-1 pl-1">
                        {
                          currentPlanCategory[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ]?.remaining_days
                        }
                      </span>
                      {currentPlanCategory[currentCategory === 0 ? 'rec' : 'ssess']
                        ?.remaining_days === 1
                        ? t(`${translationPath}day`)
                        : t(`${translationPath}days`)}{' '}
                      {t(`${translationPath}remaining-in-your`)}
                      <span className="pl-1-reversed">
                        {
                          currentPlanCategory[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ]?.title
                        }
                      </span>
                      <span className="pr-1 pl-1 text-uppercase">
                        {
                          currentPlanCategory[
                            currentCategory === 0 ? 'rec' : 'ssess'
                          ]?.product
                        }
                      </span>
                      {t(`${translationPath}plan`)}
                    </div>
                  )}
                </div>
              </div>
              <div className="current-plan-table-section">
                <div className="billing-plans-body">
                  <div className="body-table">
                    <div className="body-table-rows">
                      <div className="table-row-item is-header">
                        <div className="table-column-item">
                          {t(`${translationPath}features`)}
                        </div>
                        <div className="table-column-item">
                          {t(`${translationPath}original-limit`)}
                        </div>
                        <div className="table-column-item">
                          {t(`${translationPath}remaining`)}
                        </div>
                        {hasExtraAmount[currentCategory === 0 ? 'rec' : 'ssess']
                          .length > 0 && (
                          <div className="table-column-item is-checkbox" />
                        )}
                      </div>
                      {!isPlanLoading && currentPlanCategory ? (
                        currentPlanCategory[
                          currentCategory === 0 ? 'rec' : 'ssess'
                        ]?.features?.map((item, index) => (
                          <div
                            key={`${index + 1}-feature-item`}
                            className={`table-row-item ${
                              !item.status ? 'is-disabled' : ''
                            }`}
                          >
                            <div className="table-column-item">
                              <span className="column-title">{item.title}</span>
                            </div>
                            {item.is_unlimited ? (
                              <>
                                <div className="table-column-item">
                                  {t(`${translationPath}unlimited`)}
                                </div>
                                <div className="table-column-item">
                                  {t(`${translationPath}unlimited`)}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="table-column-item">
                                  {item.original_limit}
                                </div>
                                <div className="table-column-item">{item.limit}</div>
                              </>
                            )}
                            {hasExtraAmount[currentCategory === 0 ? 'rec' : 'ssess']
                              .length > 0 && (
                              <div className="table-column-item is-checkbox">
                                {!item.is_unlimited && (
                                  <>
                                    <IconButton
                                      size="small"
                                      className="plus-button"
                                      onClick={() => {
                                        setHasExtraAmount((items) => {
                                          const index = items[
                                            currentCategory === 0 ? 'rec' : 'ssess'
                                          ].findIndex(
                                            (el) =>
                                              el.system_feature_uuid
                                              === item.system_feature_uuid,
                                          );
                                          if (index !== -1)
                                            items[
                                              currentCategory === 0 ? 'rec' : 'ssess'
                                            ][index].count += 50;

                                          return { ...items };
                                        });
                                      }}
                                    >
                                      <i className="fas fa-plus" />
                                    </IconButton>
                                    <div className="item-value-amount">
                                      {
                                        hasExtraAmount[
                                          currentCategory === 0 ? 'rec' : 'ssess'
                                        ].find(
                                          (el) =>
                                            el.system_feature_uuid
                                            === item.system_feature_uuid,
                                        )?.count
                                      }
                                    </div>
                                    <IconButton
                                      size="small"
                                      className={`minus-button ${
                                        hasExtraAmount[
                                          currentCategory === 0 ? 'rec' : 'ssess'
                                        ].find(
                                          (el) =>
                                            el.system_feature_uuid
                                            === item.system_feature_uuid,
                                        )?.count === 0
                                          ? 'is-disabled'
                                          : ''
                                      }`}
                                      disabled={
                                        hasExtraAmount[
                                          currentCategory === 0 ? 'rec' : 'ssess'
                                        ].find(
                                          (el) =>
                                            el.system_feature_uuid
                                            === item.system_feature_uuid,
                                        )?.count === 0
                                      }
                                      onClick={() => {
                                        setHasExtraAmount((items) => {
                                          const index = items[
                                            currentCategory === 0 ? 'rec' : 'ssess'
                                          ].findIndex(
                                            (el) =>
                                              el.system_feature_uuid
                                              === item.system_feature_uuid,
                                          );
                                          if (index !== -1)
                                            items[
                                              currentCategory === 0 ? 'rec' : 'ssess'
                                            ][index].count -= 50;

                                          return { ...items };
                                        });
                                      }}
                                    >
                                      <i className="fas fa-minus" />
                                    </IconButton>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="billing-table-loader">
                          <Skeleton variant="rectangular" />
                          <Skeleton variant="rectangular" />
                          <Skeleton variant="rectangular" />
                          <Skeleton variant="rectangular" />
                          <Skeleton variant="rectangular" />
                          <Skeleton variant="rectangular" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {!isPlanLoading && !currentPlanCategory && <NoSubscriptionView />}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={closeDialogHandler}
          className="billing-info-dialog-wrapper"
        >
          <DialogTitle>
            <div className="dialog-title">
              {t(`${translationPath}are-you-sure-you-want-to`)}{' '}
              <span className="dialog-action-title pr-1-reversed">
                {selectedAction}
              </span>
              {t(`${translationPath}the-auto-renew-feature`)}?
            </div>
          </DialogTitle>
          <DialogContent>
            <div
              className={`dialog-action-button ${
                isConfirmLoading ? 'is-disabled' : ''
              }`}
            >
              <Button disabled={isConfirmLoading} onClick={onDialogSubmit}>
                {t(`${translationPath}confirm`)}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Backdrop open={verifyLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
        themeColor={isRec ? '' : 'is-assessment'}
      />
    </>
  );
};

export default CurrentBillingInfoView;
