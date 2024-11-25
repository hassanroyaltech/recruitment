import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import './Activity.Page.scss';
import { TabsComponent } from '../../../components';

import { ActivityTabs } from './tabs/Activity.Tabs';
import { ActivityIcon } from '../../../assets/icons';

const parentTranslationPath = 'OnboardingPage';
const translationPath = 'ActivityPage.';
const ActivityPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}onboarding---activity`));
  const [activityTabsData] = useState(() => ActivityTabs);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="activity-page-wrapper page-wrapper">
      <div className="page-body-wrapper">
        <div className="d-flex-v-center-h-between flex-wrap">
          <div className="d-inline-flex flex-wrap mb-2">
            <div className="d-inline-flex   pl-3-reversed mt-2">
              <span>{t(`activity`)}</span>
            </div>
          </div>
        </div>
        <div className="d-flex-v-center-h-between flex-wrap my-2">
          <div className="d-inline-flex flex-wrap mb-2">
            <div className="d-inline-flex-v-center header-text-x2 mt-2">
              <span>
                {' '}
                <ActivityIcon />
              </span>
              <span className="px-2">{t(`activity`)}</span>
              {/*<i className="fas fa-chevron-down ps-2 font-14 activity-arrow-icon"></i>*/}
            </div>
          </div>
        </div>
        <div className="mx-0 my-2 a ">
          <div className="d-flex flex-wrap">
            <TabsComponent
              data={activityTabsData}
              currentTab={activeTab}
              labelInput="label"
              idRef="ActivityTabsRef"
              isPrimary
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              // isDisabled={isLoading}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              scrollButtons="auto"
              componentInput={'component'}
              isWithLine={true}
              dynamicComponentProps={{
                parentTranslationPath,
                translationPath,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ActivityPage;
