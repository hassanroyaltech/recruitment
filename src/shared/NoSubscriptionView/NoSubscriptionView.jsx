import React from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import noSubscriptionsImg from '../../assets/images/shared/noSubscribtions.svg';
import './NoSubscriptionView.scss';

export const NoSubscriptionView = () => {
  const { t } = useTranslation('Shared');
  const history = useHistory();
  const menuItemHistory = localStorage.getItem('menuItemHistory');

  return (
    <div className="no-current-plan-wrapper">
      <img alt="no-plans" src={noSubscriptionsImg} />
      {t('you-dont-have-any-subscriptions')}
      <Button
        onClick={() =>
          history.push(`/recruiter/billing/billing-plans?id=${menuItemHistory}`)
        }
      >
        {t('buy-plans')}
      </Button>
    </div>
  );
};

export default NoSubscriptionView;
