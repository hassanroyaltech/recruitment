import React, { useCallback, useState, useEffect, useReducer } from 'react';
import {
  Button,
  Switch,
  Dialog,
  TextField,
  ButtonGroup,
  DialogTitle,
  DialogContent,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { useToasts } from 'react-toast-notifications';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Particles from 'react-tsparticles';
import { administrationAPI } from '../../api/administration';
import SimpleHeader from '../../components/Elevatus/TimelineHeader';
import { useTitle } from '../../hooks';
import { showError } from '../../helpers';
import { ParticlesConfig } from '../../configs';

const translationPath = '';
const parentTranslationPath = 'Billing';

export const BillingPlans = ({
  switchCategory,
  setSwitchCategory,
  handlePlanClicked,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  useTitle(t(`${translationPath}billing`));

  const defaultState = {
    service_uuid: null,
    type: 'offline',
    first_name: null,
    last_name: null,
    email: null,
    description: null,
  };
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(reducer, defaultState);
  const [activeCategory, setActiveCategory] = useState('eva-rec');
  const [categories, setCategories] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const [offlineDialogOpen, setOfflineDialogOpen] = useState(false);
  const [isOfflineDisabled, setIsOfflineDisabled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const searchedId = new URLSearchParams(useLocation()?.search).get('id');
  const { addToast } = useToasts(); // Toasts

  const getAllServices = useCallback(() => {
    setIsCategoryLoading(true);
    administrationAPI.GetAllServices().then((response) => {
      const results = response?.data?.results?.service;
      setCategories(results);

      if (searchedId === 'assessment') {
        setActiveCategory('eva-ssess');
        setCurrentCategory(results['eva-ssess']);
        if (
          results['eva-ssess']?.plans?.yearly?.findIndex(
            (item) => item.is_current,
          ) !== -1
        )
          setSwitchCategory(true);
      } else {
        setActiveCategory('eva-rec');
        setCurrentCategory(results['eva-rec']);
        if (
          results['eva-rec']?.plans?.yearly?.findIndex((item) => item.is_current)
          !== -1
        )
          setSwitchCategory(true);
      }

      setIsCategoryLoading(false);
    });
  }, []);

  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  useEffect(() => {
    if (user && user.results) {
      const userInfo = user.results.user;
      setState({
        id: 'edit',
        value: {
          ...state,
          first_name:
            (userInfo.first_name
              && (userInfo.first_name[i18next.language] || userInfo.first_name.en))
            || '',
          last_name:
            (userInfo.last_name
              && (userInfo.last_name[i18next.language]
                || userInfo.last_name?.en
                || ''))
            || '',
          email: userInfo.email,
        },
      });
    }
  }, [offlineDialogOpen]);

  const handleOfflinePlanCanceled = useCallback(
    (item) => {
      administrationAPI
        .CancelOfflinePlan(item.uuid)
        .then((response) => {
          addToast(response?.data?.message, {
            appearance: 'success',
            autoDismiss: true,
          });
          getAllServices();
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t],
  );

  const handleDowngradePlanCanceled = useCallback(
    (item) => {
      administrationAPI
        .CancelDowngradePlan(item.uuid)
        .then((response) => {
          addToast(response?.data?.message, {
            appearance: 'success',
            autoDismiss: true,
          });
          getAllServices();
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t],
  );

  useEffect(() => {
    if (currentCategory)
      setCurrentFeatures(
        Object.keys(currentCategory?.content?.features).map((item) => ({
          title: item,
          Enterprise: currentCategory?.content?.features[`${item}`].Enterprise,
          Startup: currentCategory?.content?.features[`${item}`].Startup,
          Core: currentCategory?.content?.features[`${item}`].Core,
          Professional: currentCategory?.content?.features[`${item}`].Professional,
        })),
      );
  }, [currentCategory]);

  const onDialogClose = () => {
    setOfflineDialogOpen(false);
    setState({ id: 'edit', value: defaultState });
  };

  const onDialogSubmit = () => {
    setIsOfflineDisabled(true);
    administrationAPI
      .CheckOutOffline({ ...state })
      .then((response) => {
        addToast(response?.data?.message, {
          appearance: 'success',
          autoDismiss: true,
        });
        getAllServices();
        setOfflineDialogOpen(false);
        setIsOfflineDisabled(false);
        setState({ id: 'edit', value: defaultState });
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setIsOfflineDisabled(false);
      });
  };

  return (
    <div className="billing-plans-wrapper">
      <SimpleHeader name="plans" parentName="billing" />
      <div className="billing-plans-header">
        <Particles options={ParticlesConfig} />
        <div className="plans-title">{t(`${translationPath}plans`)}</div>
        <div className="plans-description">
          {t(`${translationPath}plans-description`)}
        </div>
        <div className="plans-actions">
          <ButtonGroup size="large">
            <div
              className={`eva-rec-category ${
                activeCategory === 'eva-rec' ? 'is-active' : ''
              }`}
            >
              <Button
                disabled={!categories}
                onClick={() => {
                  setActiveCategory('eva-rec');
                  if (categories) setCurrentCategory(categories['eva-rec']);
                  if (
                    categories['eva-rec']?.plans?.yearly?.findIndex(
                      (item) => item.is_current,
                    ) !== -1
                  )
                    setSwitchCategory(true);
                  else setSwitchCategory(false);
                }}
              >
                EVA-REC
              </Button>
            </div>
            <div
              className={`eva-ssess-category ${
                activeCategory === 'eva-ssess' ? 'is-active' : ''
              }`}
            >
              <Button
                disabled={!categories}
                onClick={() => {
                  setActiveCategory('eva-ssess');
                  if (categories) setCurrentCategory(categories['eva-ssess']);
                  if (
                    categories['eva-ssess']?.plans?.yearly?.findIndex(
                      (item) => item.is_current,
                    ) !== -1
                  )
                    setSwitchCategory(true);
                  else setSwitchCategory(false);
                }}
              >
                EVA-SSESS
              </Button>
            </div>
          </ButtonGroup>
        </div>
        <div className="plans-switch">
          <span className="switch-name">{t(`${translationPath}monthly`)}</span>
          <Switch
            checked={switchCategory}
            onChange={(event) => setSwitchCategory(event.target.checked)}
          />
          <span className="switch-name">{t(`${translationPath}yearly`)}</span>
        </div>
      </div>
      <div className={`billing-plans-cards ${!switchCategory ? 'is-monthly' : ''}`}>
        {!isCategoryLoading && currentCategory ? (
          currentCategory?.plans?.[!switchCategory ? 'monthly' : 'yearly']
            ?.sort((a, b) =>
              a?.order > b?.order ? 1 : b?.order > a?.order ? -1 : 0,
            )
            ?.map((item, index) => (
              <>
                {index === 2 && switchCategory && (
                  <div className="second-middle-card" />
                )}
                <div
                  key={`${index + 1}-eva-rec-plan-monthly`}
                  className={`billing-plans-card-item ${
                    (index === 1 || index === 2) && switchCategory
                      ? 'middle-card'
                      : ''
                  }`}
                >
                  <div
                    className={`billing-plans-card-header ${
                      !item.cost ? 'is-offline' : ''
                    } ${item.is_current ? 'is-current' : ''}`}
                  >
                    <div className="header-title">{item.title}</div>
                  </div>
                  <div className="billing-plans-card-priceing">
                    {!item.cost ? (
                      <div className="contact-us-cost">
                        {t(`${translationPath}contact-us`)}
                      </div>
                    ) : (
                      <>
                        <div className="cost-value">{item.cost}</div>
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
                      {item.is_top.map((el, i) => (
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
                  </div>
                  <div
                    className={`plan-card-action ${
                      item.is_current ? 'is-current' : ''
                    } ${!item.cost && !item.is_current ? 'is-offline' : ''} ${
                      item.contact_us_requested || item.is_requested
                        ? 'is-cancel'
                        : ''
                    }`}
                  >
                    {item.is_current && (
                      <Button disabled onClick={() => handlePlanClicked(item, true)}>
                        {t(`${translationPath}current-plan`)}
                      </Button>
                    )}
                    {(item.is_requested || item.contact_us_requested) && (
                      <Button
                        onClick={() => {
                          if (item.contact_us_requested)
                            handleOfflinePlanCanceled(item);
                          else handleDowngradePlanCanceled(item);
                        }}
                      >
                        Cancel
                      </Button>
                    )}

                    {!item.contact_us_requested
                      && !item.is_current
                      && !item.cost && (
                      <Button
                        onClick={() => {
                          setState({ id: 'service_uuid', value: item.uuid });
                          setOfflineDialogOpen(true);
                        }}
                      >
                        {t(`${translationPath}contact-us`)}
                      </Button>
                    )}

                    {!item.is_current && !item.is_requested && item.cost && (
                      <Button onClick={() => handlePlanClicked(item, true)}>
                        {t(`${translationPath}buy-plan`)}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ))
        ) : (
          <div
            className={`billing-cards-loader ${switchCategory ? 'is-yearly' : ''}`}
          >
            {switchCategory ? (
              <>
                <Skeleton variant="rectangular" />
                <div className="middle-card">
                  <Skeleton variant="rectangular" />
                </div>
                <div className="middle-card">
                  <Skeleton variant="rectangular" />
                </div>
                <Skeleton variant="rectangular" />
              </>
            ) : (
              <Skeleton variant="rectangular" />
            )}
          </div>
        )}
      </div>
      <div className={`billing-plans-body ${switchCategory ? 'is-yearly' : ''}`}>
        <div className="body-title">{t(`${translationPath}features`)}</div>
        <div className="body-description">
          {t(`${translationPath}features-description`)}
        </div>
        <div className="body-table">
          <div className="body-table-rows">
            <div className="table-row-item">
              {currentCategory && currentCategory.content && (
                <div className="table-column-item is-header">
                  {t(`${translationPath}features`)}
                </div>
              )}
              {currentCategory
                && currentCategory.content
                && currentCategory?.content?.plans.map((item, index) => (
                  <div
                    key={`currentCategoryPlansKey${index + 1}`}
                    className="table-column-item is-header"
                  >
                    {t(`${translationPath}${item}`)}
                  </div>
                ))}
            </div>
            {!isCategoryLoading && currentCategory && currentFeatures ? (
              currentFeatures.map((item, index) => (
                <div key={`${index + 1}-feature-item`} className="table-row-item">
                  <div className="table-column-item">
                    <span className="column-title">
                      {item.title}
                      {item.description && (
                        <Tooltip title={item.description}>
                          <i className="fas fa-info-circle text-gray px-2" />
                        </Tooltip>
                      )}
                    </span>
                  </div>
                  <div className="table-column-item">
                    {item.Enterprise !== null ? (
                      typeof item.Enterprise === 'boolean' ? (
                        item.Enterprise === true ? (
                          <i className="fa fa-check" />
                        ) : (
                          <i className="fa fa-times" />
                        )
                      ) : (
                        item.Enterprise
                      )
                    ) : (
                      <i className="fa fa-times" />
                    )}
                  </div>
                  <div className="table-column-item">
                    {item.Startup !== null ? (
                      typeof item.Startup === 'boolean' ? (
                        item.Startup === true ? (
                          <i className="fa fa-check" />
                        ) : (
                          <i className="fa fa-times" />
                        )
                      ) : (
                        item.Startup
                      )
                    ) : (
                      <i className="fa fa-times" />
                    )}
                  </div>
                  <div className="table-column-item">
                    {item.Core !== null ? (
                      typeof item.Core === 'boolean' ? (
                        item.Core === true ? (
                          <i className="fa fa-check" />
                        ) : (
                          <i className="fa fa-times" />
                        )
                      ) : (
                        item.Core
                      )
                    ) : (
                      <i className="fa fa-times" />
                    )}
                  </div>
                  <div className="table-column-item">
                    {item.Professional !== null ? (
                      typeof item.Professional === 'boolean' ? (
                        item.Professional === true ? (
                          <i className="fa fa-check" />
                        ) : (
                          <i className="fa fa-times" />
                        )
                      ) : (
                        item.Professional
                      )
                    ) : (
                      <i className="fa fa-times" />
                    )}
                  </div>
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
      <Dialog
        open={offlineDialogOpen}
        onClose={onDialogClose}
        className="contact-us-dialog-wrapper"
      >
        <DialogTitle>{t(`${translationPath}contact-us`)}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            className="mb-3"
            label={t(`${translationPath}first-name`)}
            variant="outlined"
            value={state.first_name}
            onChange={(e) => setState({ id: 'first_name', value: e.target.value })}
          />
          <TextField
            fullWidth
            className="mb-3"
            label={t(`${translationPath}last-name`)}
            variant="outlined"
            value={state.last_name}
            onChange={(e) => setState({ id: 'last_name', value: e.target.value })}
          />
          <TextField
            fullWidth
            label={t(`${translationPath}email`)}
            className="mb-3"
            variant="outlined"
            value={state.email}
            onChange={(e) => setState({ id: 'email', value: e.target.value })}
          />
          <TextField
            rows={4}
            multiline
            fullWidth
            variant="outlined"
            label={t(`${translationPath}description`)}
            value={state.description}
            onChange={(e) => setState({ id: 'description', value: e.target.value })}
          />
          <div
            className={`contact-us-dialog-button ${
              isOfflineDisabled
              || !state.first_name
              || !state.last_name
              || !state.email
              || !state.description
                ? 'is-disabled'
                : ''
            }`}
          >
            <Button
              disabled={
                isOfflineDisabled
                || !state.first_name
                || !state.last_name
                || !state.email
                || !state.description
              }
              onClick={onDialogSubmit}
            >
              {t(`${translationPath}done`)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

BillingPlans.propTypes = {
  handlePlanClicked: PropTypes.func.isRequired,
  currentPlanItem: PropTypes.instanceOf(Object),
};

BillingPlans.defaultProp = {
  currentPlanItem: null,
};
