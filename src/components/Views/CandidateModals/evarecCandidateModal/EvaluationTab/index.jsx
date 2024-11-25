/* eslint-disable no-nested-ternary */
/**
 * ----------------------------------------------------------------------------------
 * @title EvaluationTab/index.jsx
 * ----------------------------------------------------------------------------------
 * This is the tab where we show and edit an evaluation that is tied to an
 * application or an assessment.
 * ----------------------------------------------------------------------------------
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';
import EvaluationTable from './EvaluationTable';

/**
 * Evaluation Tab component
 */
const translationPath = 'EvaluationTabComponent.';
const EvaluationTab = ({
  evaluations,
  candidateUuid,
  type,
  candidate,
  parentTranslationPath,
  getEvaluations,
  evaluationsLoaded,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [loading, setLoading] = useState(false);
  // const [state, setState] = useState({
  //   loading: false,
  //   // TODO: use api endpoint instead of mock data
  //   evaluation: evaluations,
  //   expanded: 0,
  //   adding: false,
  //   changeOverallScore: false,
  // });

  /**
   * Render the element
   * @returns {JSX.Element}
   */
  /**
   * Init prop and state variables
   */
  // const { evaluation } = state;
  // useEffect(() => {
  //   console.log('evaluations', evaluations);
  //   setState((items) => ({ ...items, evaluation: evaluations }));
  // }, [evaluations]);

  return (
    <div className="evaluation-card d-flex flex-column">
      {evaluations ? (
        <div className="evaluation-scores d-flex flex-column flex-grow-1">
          <div className="evaluation-title text-primary h5 mb-0 p-3">
            {evaluations.title}
          </div>
          <div className="evaluation-items flex-grow-1">
            {evaluations?.evaluations?.map((item, index) => (
              <EvaluationTable
                key={`evaluationsKey${index + 1}`}
                candidate={candidate}
                parentTranslationPath={parentTranslationPath}
                type={type}
                evaluation_data={evaluations}
                evaluation={item}
                candidateUuid={candidateUuid}
                getEvaluations={getEvaluations}
                onIsLoadingChanged={() => setLoading((el) => !el)}
                evaluationsLoaded={evaluationsLoaded || loading}
              />
            ))}
          </div>
          <div className="overall-score bg-primary d-flex flex-row justify-content-between text-uppercase text-white h5 font-weight-bold mb-0 p-3">
            <div>{t(`${translationPath}overall-scroll`)}</div>
            <div>
              <span>{evaluations.score}</span>
              {(evaluationsLoaded || loading) && (
                <span className="px-2">
                  <CircularProgress color="inherit" size={20} />
                </span>
              )}
            </div>
          </div>
          {evaluations.has_comment && (
            <div className="pl-3-reversed pt-3 pb-3 c-primary">
              {evaluations.comment}
            </div>
          )}
        </div>
      ) : (
        <p>{t(`${translationPath}no-evaluation-description`)}</p>
      )}
    </div>
  );
};
export default EvaluationTab;
