import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { useHistory } from 'react-router-dom';
import { GetAllSetupsWorkflowsTemplatesTypes } from '../../../../services';
import { WorkflowTemplatesSection } from './sections';
import { LoaderComponent } from '../../../../components';
import { getIsAllowedPermissionV2, showError } from '../../../../helpers';
import './Workflows.Style.scss';
// import { showError } from '../../../../helpers';

const translationPath = 'WorkflowsPage.';
const parentTranslationPath = 'SetupsPage';
const WorkflowsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  const history = useHistory();
  // eslint-disable-next-line max-len
  const [templatesTypes, setTemplatesTypes] = useState({
    approvals: [],
    conditions: [],
    transactions: [],
  });
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenManagementSection, setIsOpenManagementSection] = useState(false);
  const [selectedWorkflowType, setSelectedWorkflowType] = useState(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the workflow options & enums
   */
  const getWorkflowsTemplatesTypes = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsWorkflowsTemplatesTypes();
    setIsLoading(false);
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      const unitedTypes = { ...results };
      unitedTypes.transactions = results.transactions.reduce((total, element) => {
        const localElement = { ...element };
        // const localConditions = [];
        // eslint-disable-next-line max-len
        localElement.conditions = localElement.conditions.map((item) =>
          results.conditions.find((el) => el.key === item),
        );
        total.push(localElement);
        return total;
      }, []);
      setTemplatesTypes(unitedTypes);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  const onWorkflowTemplateTypeClicked = useCallback(
    (item) => () => {
      setSelectedWorkflowType(item);
    },
    [],
  );

  const onSelectedWorkflowTypeChange = useCallback(() => {
    if (isOpenManagementSection) setIsOpenManagementSection(false);
    else setSelectedWorkflowType(null);
  }, [isOpenManagementSection]);

  // this to get table data on init
  useEffect(() => {
    getWorkflowsTemplatesTypes();
  }, [getWorkflowsTemplatesTypes]);

  useEffect(() => {
    history.listen(() => {
      if (isMountedRef.current) {
        if (isOpenManagementSection) setIsOpenManagementSection();
        if (selectedWorkflowType) setSelectedWorkflowType(null);
      }
    });
  }, [history, isOpenManagementSection, selectedWorkflowType]);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  return (
    <div
      className={`
      ${selectedWorkflowType ? '' : 'workflows-page-wrapper px-4 pt-4'}`}
    >
      {(!selectedWorkflowType && (
        <>
          <div className="page-header-wrapper px-3 pb-3">
            <span className="header-text-x2 d-flex mb-1">
              {t(`${translationPath}workflows`)}
            </span>
            <span className="description-text">
              {t(`${translationPath}workflows-description`)}
            </span>
          </div>
          <div className="page-body-wrapper">
            <LoaderComponent
              isLoading={isLoading}
              isSkeleton
              skeletonItems={[
                {
                  variant: 'rectangular',
                  style: { minHeight: 180 },
                },
              ]}
              numberOfRepeat={8}
            />
            {templatesTypes.transactions.map((item) => (
              <div className="template-action-btn-wrapper" key={item.key}>
                <ButtonBase
                  onClick={onWorkflowTemplateTypeClicked(item)}
                  className="btns theme-outline template-type-btn"
                  disabled={
                    isLoading
                    || !getIsAllowedPermissionV2({
                      permissionId: item.permission_id,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <span className={`icons ${item.icon}`} />
                  <span className="main-text-wrapper">
                    {(item.title
                      && (item.title[i18next.language] || item.title.en))
                      || ''}
                  </span>
                  <span className="total-count-templates">
                    <span>{item.total}</span>
                    <span className="px-1">{t(`${translationPath}templates`)}</span>
                  </span>
                </ButtonBase>
              </div>
            ))}
          </div>
        </>
      )) || (
        <WorkflowTemplatesSection
          selectedWorkflowType={selectedWorkflowType}
          approvals={templatesTypes.approvals}
          isOpenManagementSection={isOpenManagementSection}
          onSelectedWorkflowTypeChange={onSelectedWorkflowTypeChange}
          onIsOpenManagementSectionChanged={() => {
            setIsOpenManagementSection((item) => !item);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

export default WorkflowsPage;
