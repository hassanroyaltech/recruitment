import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssessmentTestCard } from './components';
import { useTitle } from '../../hooks';
import { AssessmentTests } from './json';
import { AutocompleteComponent } from '../../components';
import './AssessmentTest.Style.scss';

const translationPath = '';
const parentTranslationPath = 'AssessmentTest';

export const AssessmentTestPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [assessments, setAssessments] = useState(
    AssessmentTests.map((el) => [...el.assessments]).flat(),
  );

  useTitle(t(`${translationPath}assessment-test`));

  return (
    <div className="assessment-test-wrapper">
      <div className="page-header-wrapper mb-3 px-2">
        <span className="header-text-x2 d-flex mb-2">
          {t(`${translationPath}assessment-test`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}assessment-test-description`)}
        </span>
      </div>
      <div className="assessment-test-content-wrapper">
        <div className="assessment-test-filter w-100 mb-3 d-flex justify-content-end px-2">
          <div className="w-25">
            <AutocompleteComponent
              disableClearable
              variant="outlined"
              data={AssessmentTests}
              idRef="select-category"
              themeClass="theme-solid"
              inputLabel="select-a-category"
              translationPath={translationPath}
              inputPlaceholder="select-a-category"
              parentTranslationPath={parentTranslationPath}
              value={selectedCategory || AssessmentTests[0]}
              getOptionLabel={(option) => option.title || ''}
              isOptionEqualToValue={(option, value) =>
                value && option.key === value.key
              }
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);

                if (newValue && newValue.key === 0)
                  setAssessments(
                    AssessmentTests.map((el) => [...el.assessments]).flat() || [],
                  );
                else setAssessments((newValue && newValue.assessments) || []);
              }}
            />
          </div>
        </div>
        <AssessmentTestCard
          assessments={assessments}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      </div>
    </div>
  );
};

export default AssessmentTestPage;
