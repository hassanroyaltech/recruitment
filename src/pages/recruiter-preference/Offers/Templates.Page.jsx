import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useQuery, useTitle } from '../../../hooks';
import { CollapseComponent, TabsComponent } from '../../../components';
import '../Preference.scss';
import { TemplatesTabs } from './tabs-data';
import './Templates.Style.scss';

const translationPath = 'Offers.';
const parentTranslationPath = 'RecruiterPreferences';

const TemplatesPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}list-of-templates`));
  const query = useQuery();
  const [templatesTabsData] = useState(() => TemplatesTabs);
  const [isOpenHint, setIsOpenHint] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change is loading from child
   */
  const onIsLoadingChanged = useCallback((newValue) => {
    setIsLoading(newValue);
  }, []);

  // this is to change the default active tab on reload or redirect
  useEffect(() => {
    const localActiveTab = query.get('activeTab');
    if (localActiveTab) setActiveTab(+localActiveTab);
  }, [query]);

  return (
    <div className="templates-page-wrapper page-wrapper pt-4 px-4">
      <div className="mih-80px mb-3">
        <CollapseComponent
          isOpen={isOpenHint}
          component={
            <div className="hint-content-wrapper">
              <ButtonBase
                className="btns-icon theme-transparent"
                onClick={() => setIsOpenHint((item) => !item)}
              >
                <span className={`far fa-${(isOpenHint && 'eye') || 'eye-slash'}`} />
              </ButtonBase>
              <div className="d-inline-flex-v-center-h-between">
                <div
                  className="d-inline-flex"
                  style={{
                    overflowX: 'auto',
                    maxWidth: '65vw',
                  }}
                >
                  <span className="px-2 d-flex" style={{ minWidth: 325 }}>
                    {t(`${translationPath}offer-hint-description`)}
                  </span>
                </div>
                <ButtonBase
                  className="btns theme-outline"
                  onClick={() => setIsOpenHint(false)}
                >
                  <span>{t(`${translationPath}ok-close`)}</span>
                </ButtonBase>
              </div>
            </div>
          }
          style={{
            maxHeight: 80,
          }}
          wrapperClasses={`hint-collapse-wrapper${(isOpenHint && ' is-open') || ''}`}
          orientation="horizontal"
          collapsedSize={60}
        />
      </div>
      <TabsComponent
        data={templatesTabsData}
        currentTab={activeTab}
        labelInput="label"
        idRef="TemplatesTabsRef"
        isWithLine
        isPrimary
        onTabChanged={(event, currentTab) => {
          setActiveTab(currentTab);
        }}
        isDisabled={isLoading}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        dynamicComponentProps={{
          isLoading,
          onIsLoadingChanged,
          parentTranslationPath,
          translationPath,
        }}
      />
    </div>
  );
};
export default TemplatesPage;
