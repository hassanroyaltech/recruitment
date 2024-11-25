/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title editAssessment.js
 * ----------------------------------------------------------------------------------
 * This module contains the EditAssessment wrapper to the EvassessStepper component.
 *
 * Allows us to differentiate the usage of the EvassessStepper component from the
 * CreateAssessment wrapper.
 * ----------------------------------------------------------------------------------
 */
import React from 'react';
import SimpleHeader from 'components/Elevatus/TimelineHeader';
import EvassessStepper from 'components/Steppers/evassessStepper';

// Import styling
import 'assets/scss/elevatus/_evassess.scss';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks';

/**
 * Function that returns the CreateAssessment component
 * @returns {JSX.Element}
 * @constructor
 */
const parentTranslationPath = 'EvaSSESS';
const translationPath = 'EditAssessment.';
const EditAssessment = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}edit-assessment`));
  /**
   * Return JSX
   *
   * The UUID for the assessment is obtained from the props
   * passed to this component
   */
  return (
    <>
      <SimpleHeader
        name={t(`${translationPath}edit-assessment`)}
        parentName={t('eva-SSESS')}
      />
      <div className="content-page ">
        <div className="content">
          <div className="d-flex-center pb-3">
            <div
              className="content-page mt--7 p-3 create-assessment-content"
              style={{ background: 'inherit' }}
            >
              <EvassessStepper
                uuid={props.match.params.uuid}
                editFlag
                parentTranslationPath={parentTranslationPath}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditAssessment;
