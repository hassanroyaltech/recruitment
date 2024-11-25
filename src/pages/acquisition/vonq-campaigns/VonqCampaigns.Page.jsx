import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import { VonqIntegrationComponent } from '../../../components';

const parentTranslationPath = 'VonqCampaignsPage';
const translationPath = '';
const VonqCampaignsPage = () => {
  const { t } = useTranslation([parentTranslationPath]);
  useTitle(t(`${translationPath}acquisition-vonq-campaigns`));

  return (
    <div className="contract-page-wrapper page-wrapper">
      <VonqIntegrationComponent
        isWithCampaign
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

export default VonqCampaignsPage;
