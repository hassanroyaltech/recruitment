/**
 * ----------------------------------------------------------------------------------
 * @title createAssessment.js
 * ----------------------------------------------------------------------------------
 * This module contains the CreateAssessment wrapper to the EvassessStepper
 * component.
 *
 * Allows us to differentiate the usage of the EvassessStepper component from the
 * EditAssessment wrapper.
 * ----------------------------------------------------------------------------------
 */
import React, { useEffect, useState, useCallback } from 'react';
import EvassessStepper from 'components/Steppers/evassessStepper';
import Loader from 'components/Elevatus/Loader';

// Import History
import { useHistory } from 'react-router-dom';

// Import styling
import 'assets/scss/elevatus/_evassess.scss';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';
import { evassessAPI } from '../../../api/evassess';
import { showError } from '../../../helpers';
import SimpleHeader from '../../../components/Headers/SimpleHeader';

/**
 * Function that returns the CreateAssessment component
 * @returns {JSX.Element}
 * @constructor
 */
const parentTranslationPath = 'EvaSSESS';
const translationPath = 'CreateAssessment.';
const CreateAssessment = () => {
  const history = useHistory();
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}create-assessment`));
  // Set state for category and dialog
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Obtain video assessment categories
   * These can be:
   *  - Hiring
   *  - Sales Training
   *  - Medical Check
   *  - and others
   */
  const getVideoCategories = useCallback(() => {
    evassessAPI
      .getVideoAssessmentCategories()
      .then((response) => {
        setLoading(false);
        if (!response) return;
        const { results } = response.data;
        if (results && results.length > 0) setCategory(results[0]);
        else {
          showError(t(`${translationPath}there-is-no-categories`));
          history.push('/recruiter/assessment/manage/list');
        }
        // setDialog(
        //   <ChooseAssessmentType
        //     modalTitle="create-a-new-assessment"
        //     Categories={response.data.results}
        //     isOpen
        //     setLoading={setLoading}
        //     parentTranslationPath={parentTranslationPath}
        //     translationPath={translationPath}
        //     proceed={() => {
        //       setLoading(false); // If user close the modal without select category.
        //       setDialog(null);
        //     }}
        //     onClose={() => {
        //       // If user close the modal without select category redirect to assessments list
        //       setLoading(false);
        //       if (category === null) history.push('/recruiter/assessment/manage/list');
        //       setDialog(null);
        //     }}
        //     onSave={(c) => {
        //       setCategory(c);
        //     }}
        //   />,
        // );
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        history.push('/recruiter/assessment/manage/list');
      });
  }, [history, t]);

  useEffect(() => {
    getVideoCategories();
  }, [getVideoCategories]);

  /**
   * Return JSX
   */
  return (
    <>
      <SimpleHeader
        name={t(`${translationPath}create-assessment`)}
        parentName={t('eva-SSESS')}
      />
      {loading ? (
        <div className="d-flex-column">
          {/* {dialog} */}
          <Loader speed={1} color="primary" />
        </div>
      ) : (
        <div className="content-page ">
          <div className="content">
            <div className="d-flex-center pb-3">
              <div
                className="content-page mt--7 p-3 create-assessment-content"
                style={{ background: 'inherit' }}
              >
                <EvassessStepper
                  selectedCategory={category}
                  parentTranslationPath={parentTranslationPath}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAssessment;
