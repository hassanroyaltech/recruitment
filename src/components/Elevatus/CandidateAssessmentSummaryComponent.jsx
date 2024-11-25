import React from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import './CandidateAssessment.Style.scss';
import ButtonBase from '@mui/material/ButtonBase';
import { ChatGPTIcon } from '../../assets/icons';

const translationPath = 'EvassessCandidateModalComponent.';

export const CandidateAssessmentSummaryComponent = ({
  assessmentSummary,
  isLoadingSummary,
  isMounted,
  prep_assessment_candidate_uuid,
  generateSemanticaAssessmentSummary,
  similarity,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="candidate-assessment-tab-wrapper">
      <div className="d-flex-v-center mb-1">
        <h4 className={'my-0'}>{t(`${translationPath}total-model-answers`)}:</h4>
        <div
          style={{ marginTop: 3 }}
          className={`candidate-badge mx-1
          ${similarity >= 67 ? 'success' : similarity < 33 ? 'error' : 'warning'}`}
        >
          {Math.round(similarity) || 0}%
        </div>
        .
      </div>
      <div className={'d-inline-flex-center flex-wrap'}>
        <h4 className={'my-0'}>
          {t(`${translationPath}all-model-answers-summary`)}:
        </h4>
        {isMounted && !assessmentSummary?.summary && (
          <div className={''}>
            <ButtonBase
              className="btns theme-outline  "
              disabled={isLoadingSummary}
              onClick={() =>
                generateSemanticaAssessmentSummary({
                  prep_assessment_candidate_uuid,
                })
              }
            >
              {isLoadingSummary ? (
                <span className="fas fa-circle-notch fa-spin m-1" />
              ) : (
                <ChatGPTIcon color="var(--bc-primary)" />
              )}
              <span className="mx-1">
                {t(`${translationPath}generate-response`)}
              </span>
            </ButtonBase>
          </div>
        )}
      </div>

      <p className="font-14 text-black">{assessmentSummary?.summary || ''}</p>
    </div>
  );
};

CandidateAssessmentSummaryComponent.propTypes = {
  assessmentSummary: PropTypes.instanceOf(Object),
  isLoadingSummary: PropTypes.bool.isRequired,
  isMounted: PropTypes.bool.isRequired,
  generateSemanticaAssessmentSummary: PropTypes.func.isRequired,
  prep_assessment_candidate_uuid: PropTypes.string.isRequired,
  similarity: PropTypes.number,
  parentTranslationPath: PropTypes.string,
};
