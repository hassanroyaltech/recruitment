import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import { VonqIntegrationComponent } from '../../../components';

const parentTranslationPath = 'ContractsPage';
const translationPath = '';
const ContractsPage = () => {
  const { t } = useTranslation([parentTranslationPath]);
  useTitle(t(`${translationPath}acquisition-contracts`));

  return (
    <div className="contract-page-wrapper page-wrapper">
      <VonqIntegrationComponent
        isWithContractJourney
        isWithUserJourneyButtons
        parentTranslationPath={parentTranslationPath}
      />
    </div>
  );
};

export default ContractsPage;
