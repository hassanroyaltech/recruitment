import React, { useCallback, useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import { BillingPlansPay } from './BillingPlansPay';
import { BillingPlans } from './BillingPlans';
import './Styles/BillingPlans.Styles.scss';

export const BillingPlansView = () => {
  const [isPlanClicked, setIsPlanClicked] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [switchCategory, setSwitchCategory] = useState(false);

  const categoryChangeHandler = useCallback((item) => {
    setSwitchCategory(item);
  }, []);

  const handlePlanClicked = useCallback((item, value) => {
    setSelectedPlan(item);
    setIsPlanClicked(value);
  }, []);

  return (
    <div className="billing-plans-view-wrapper">
      <ToastProvider placement="top-center">
        {!isPlanClicked ? (
          <BillingPlans
            switchCategory={switchCategory}
            handlePlanClicked={handlePlanClicked}
            setSwitchCategory={categoryChangeHandler}
          />
        ) : (
          selectedPlan && (
            <BillingPlansPay
              selectedPlan={selectedPlan}
              switchCategory={switchCategory}
              handlePlanClicked={handlePlanClicked}
            />
          )
        )}
      </ToastProvider>
    </div>
  );
};

export default BillingPlansView;
