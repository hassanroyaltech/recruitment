/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
/**
 * ----------------------------------------------------------------------------------
 * @title EvaluationTab/index.jsx
 * ----------------------------------------------------------------------------------
 * This is the tab where we show and edit an evaluation that is tied to an
 * application or an assessment.
 * ----------------------------------------------------------------------------------
 */
import React, { Component } from 'react';
import Loader from 'components/Elevatus/Loader';
import Rating from '@mui/material/Rating';
import { withTranslation } from 'react-i18next';
import { CandidateEvaluationTable } from './CandidateEvaluationTable';
import { evarecAPI } from '../../../../../api/evarec';
import { EvaluationTypesEnum } from '../../../../../enums';
import { SliderComponent } from '../../../../Slider/Slider.Component';
import i18next from 'i18next';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * Evaluation Tab component
 */
class CandidateEvaluationTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // TODO: use api endpoint instead of mock data
      evaluation: this.props.evaluations,
      expanded: 0,
      adding: false,
      changeOverallScore: false,
    };
  }

  /**
   * Get evaluations list
   * @param job_candidate_uuid
   * @param job_uuid
   * @returns {Promise<AxiosResponse<any>>}
   */
  getEvaluationsList = (uuid, jobUuid) => {
    evarecAPI.getEvaluation(uuid, jobUuid).then((res) => {
      this.setState({ evaluation: res.data.results });
    });
  };

  /**
   * Expander function
   * @param index
   */
  expandEvaluation = (index) => {
    this.setState({
      expanded: index,
    });

    // Call Candidate Evaluation API
  };

  /**
   * Handler to add a comment
   */
  handleAddComment = () => {};

  /**
   * Render the element
   * @returns {JSX.Element}
   */
  render() {
    const { t } = this.props;
    /**
     * Init prop and state variables
     */
    const { type, candidate } = this.props;
    // const { evaluation } = this.state;
    return (
      <div className="candidate-evaluation-wrapper">
        {this.state.loading || this.props.loadingEvaluation ? (
          <Loader />
        ) : this.props.evaluations ? (
          <>
            <div className="overall-score-wrapper">
              <div className="overall-score-title">
                {t(`${translationPath}OVERALL-SCORE`)}
              </div>
              {!this.state.changeOverallScore && (
                <div className="overall-score-info">
                  {i18next.language === 'ar'
                    ? `${t(`${translationPath}percentage`)} `
                    : ''}
                  <span>{this.props.evaluations.score}</span>
                  <span className="px-1">{t(`${translationPath}out-of`)}</span>
                  <span>
                    {(this.props.evaluations.score_type
                      === EvaluationTypesEnum.OneToFive.key
                      && '5')
                      || '100%'}
                  </span>
                </div>
              )}
              {(this.props.evaluations.score_type
                === EvaluationTypesEnum.OneToFive.key && (
                <Rating
                  value={
                    this.props.evaluations?.score
                    || this.props.evaluations?.score === 0
                      ? this.props.evaluations?.score
                      : 0
                  }
                  readOnly
                />
              )) || (
                <SliderComponent
                  step={10}
                  valueLabelDisplay="auto"
                  isDisabled
                  value={this.props.evaluations?.score}
                  marks={Array.from({ length: 11 }, (number, index) => ({
                    label: index * 10,
                    value: index * 10,
                  }))}
                />
              )}
            </div>
            <div className="evaluation-scores-wrapper">
              <div className="evaluation-items-wrapper">
                <CandidateEvaluationTable
                  type={type}
                  score_type={
                    this.props.evaluations
                      ? this.props.evaluations.score_type
                      : undefined
                  }
                  candidate={candidate}
                  loadingEvaluation={this.props.loadingEvaluation}
                  evaluations={
                    this.props.evaluations && this.props.evaluations.evaluations
                  }
                  candidateUuid={this.props.candidateUuid}
                  reloadData={this.props.reloadData}
                  ratingLoader={this.props.ratingLoader}
                  setRatingLoader={this.props.setRatingLoader}
                  handleChange={(value) => {
                    this.setState({ changeOverallScore: true });
                    this.props.evaluations.score = value;
                    this.setState({ changeOverallScore: false });
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <p>{t(`${translationPath}no-evaluation-for-this-assessment`)}</p>
        )}
      </div>
    );
  }
}
export default withTranslation(parentTranslationPath)(CandidateEvaluationTab);
