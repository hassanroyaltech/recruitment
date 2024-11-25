import React, { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SwitchComponent,
  TabsComponent,
} from '../../../../../../../../../../../../../components';
import './ActionsManagement.Style.scss';
import { ActionsTab, ListTab } from './tabs';
import { ButtonBase } from '@mui/material';

export const ActionsManagementSection = memo(
  ({
    activeStage,
    stageItem,
    onStateChanged,
    enableKey,
    arrayKey,
    stageCandidateActionsEnum,
    managementTitleDescription,
    managementTitle,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [activeTab, setActiveTab] = useState(0);
    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return if action selected by type
     */
    const getSavedActions = useMemo(
      () => () => (stageItem && stageItem[arrayKey]) || [],
      [arrayKey, stageItem],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return if action selected by type
     */
    const getIsActionSelectedByType = useMemo(
      () => (type) => getSavedActions().some((item) => item.type === type) || false,
      [getSavedActions],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return selected action index by type
     */
    const getActionIndexByType = useMemo(
      () => (type) =>
        getSavedActions().findIndex((item) => item.type === type) || -1,
      [getSavedActions],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to return selected action item by type
     */
    const getActionItemByType = useMemo(
      () => (type) => getSavedActions().find((item) => item.type === type),
      [getSavedActions],
    );

    const getActionsTabs = useMemo(() => {
      const enumsWithDetailsList = stageCandidateActionsEnum
        .filter(
          (item) =>
            Object.hasOwn(item, 'listDetails')
            && getIsActionSelectedByType(item.key),
        )
        .map((item, index) => ({
          key: index + 2,
          label: item.listDetails.value,
          component: ListTab,
          props: { ...item.listDetails, type: item.key },
        }));

      return [
        {
          key: 1,
          label: 'actions',
          component: ActionsTab,
        },
        ...enumsWithDetailsList,
      ];
    }, [getIsActionSelectedByType, stageCandidateActionsEnum]);

    return (
      <div className="actions-management-section">
        <div className="d-flex">
          <div className="d-inline-flex">
            <SwitchComponent
              idRef={`isEnableRef${enableKey}`}
              isChecked={(stageItem && stageItem[enableKey]) || false}
              onChange={(event, isChecked) => {
                onStateChanged({
                  parentId: 'stages',
                  parentIndex: activeStage,
                  id: enableKey,
                  value: isChecked,
                });
                if (isChecked && activeTab > 0) setActiveTab(0);
                if (
                  stageItem[arrayKey]
                  && stageItem[arrayKey].length > 0
                  && isChecked
                )
                  onStateChanged({
                    parentId: 'stages',
                    parentIndex: activeStage,
                    id: arrayKey,
                    value: [],
                  });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
          <div
            className={`d-flex-column mb-3 mt-2 px-2${
              (stageItem && !stageItem[enableKey] && ' description-text') || ''
            }`}
          >
            <span>
              <span>{t(`${translationPath}${managementTitle}`)}</span>
              <span>:</span>
            </span>
            {stageItem && stageItem[enableKey] && (
              <div className="description-text">
                <span>{t(`${translationPath}${managementTitleDescription}`)}</span>
              </div>
            )}
          </div>
        </div>
        {stageItem && !stageItem[enableKey] && (
          <TabsComponent
            isPrimary
            isWithLine
            labelInput="label"
            idRef="actionsManagementTabsRef"
            tabsContentClasses={`pt-3 ${
              (activeTab === 0 && 'is-actions-tab') || 'is-list-tab'
            }`}
            data={getActionsTabs}
            currentTab={activeTab}
            translationPath={translationPath}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              stageCandidateActionsEnum,
              getIsActionSelectedByType,
              activeStage,
              arrayKey,
              getActionIndexByType,
              getActionItemByType,
              savedItems: getSavedActions(),
              onStateChanged,
              parentTranslationPath,
              translationPath,
            }}
          />
        )}
        {stageItem && stageItem[enableKey] && (
          <ButtonBase
            className="btns theme-solid bg-accent-secondary br-0 mih-50px w-100 mx-0"
            onClick={() =>
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: enableKey,
                value: false,
              })
            }
          >
            <span className="fas fa-plus" />
            <span className="px-2">
              {t(`${translationPath}or-only-selected-actions`)}
            </span>
          </ButtonBase>
        )}
      </div>
    );
  },
);
ActionsManagementSection.displayName = 'ActionsManagementSection';

ActionsManagementSection.propTypes = {
  activeStage: PropTypes.number.isRequired,
  stageItem: PropTypes.instanceOf(Object).isRequired,
  enableKey: PropTypes.string.isRequired,
  arrayKey: PropTypes.string.isRequired,
  stageCandidateActionsEnum: PropTypes.instanceOf(Array).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  managementTitle: PropTypes.string.isRequired,
  managementTitleDescription: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
