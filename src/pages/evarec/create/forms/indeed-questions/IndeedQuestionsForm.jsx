// React and reactstrap
import React, { useState } from 'react';
import { Card } from 'reactstrap';

import { useTranslation } from 'react-i18next';
import { TabsComponent } from '../../../../../components';
import { IndeedQuestionsTabs } from './IndeedQuestions.Tabs';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

export default function IndeedQuestionsForm({ form, setForm }) {
  const { t } = useTranslation(parentTranslationPath);
  const [indeedQuestionsTabs] = useState(() => IndeedQuestionsTabs);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Card className="step-card ">
      <h6 className="h6">{t(`${translationPath}indeed-questions`)}</h6>
      <div
        className="mt-1 mb-2 font-weight-normal text-gray"
        style={{ opacity: 0.66 }}
      >
        {t(`${translationPath}evaluate-description`)}
      </div>
      <TabsComponent
        wrapperClasses="px-0"
        data={indeedQuestionsTabs}
        currentTab={activeTab}
        labelInput="label"
        idRef="indeedQuestionsTabsabsRef"
        isWithLine
        isPrimary
        onTabChanged={(event, currentTab) => {
          setActiveTab(currentTab);
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        dynamicComponentProps={{
          parentTranslationPath,
          translationPath,
          form,
          setForm,
        }}
      />
    </Card>
  );
}
