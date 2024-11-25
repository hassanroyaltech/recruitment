import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import Rating from '@mui/material/Rating';
import { SharedInputControl } from '../../../../../../../setups/shared';
import { showError, showSuccess } from '../../../../../../../../helpers';
import { UpdateApprovalEvaluation } from '../../../../../../../../services';
import {
  CollapseComponent,
  LoaderComponent,
} from '../../../../../../../../components';
import { QuestionSection } from './sections';

export const EvaluationsSection = ({
  evaluation,
  evaluationIndex,
  pre_candidate_uuid,
  category_code,
  changedStates,
  onSave,
  isOpenCollapse,
  ratingLabels,
  onOpenCollapseChanged,
  onStateChanged,
  errors,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ratingHover, setRatingHover] = useState(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to sent to parent the collapse is changed order
   */
  const onOpenCollapseClicked = useCallback(() => {
    onOpenCollapseChanged(evaluationIndex);
  }, [evaluationIndex, onOpenCollapseChanged]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the evaluation is changed or not
   */
  const getIsChangedEvaluation = useMemo(
    () => () => changedStates.indexOf(evaluationIndex) !== -1,
    [changedStates, evaluationIndex],
  );
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the evaluation is changed or not
   */
  const getRatingLabel = useMemo(
    () => (rating) =>
      ratingLabels.find(
        (item) =>
          item.key
          === (ratingHover !== null && ratingHover !== -1
            ? ratingHover || 0.5
            : rating || 0.5),
      )?.value,
    [ratingHover, ratingLabels],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (
      Object.keys(errors).length > 0
      && Object.keys(errors).some((item) =>
        item.includes(`evaluations[${evaluationIndex}]`),
      )
    )
      return;
    setIsLoading(true);
    const response = await UpdateApprovalEvaluation(
      { pre_candidate_uuid, category_code },
      evaluation,
    );
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      if (onSave) onSave(evaluationIndex);
      showSuccess(t(`${translationPath}evaluation-saved-successfully`));
    } else showError(t(`${translationPath}evaluation-save-failed`), response);
  };
  return (
    <div className="evaluation-item-wrapper section-wrapper evaluation-collapse-wrapper">
      <div className="d-flex collapse-header-wrapper">
        <ButtonBase
          className={`btns fj-between py-3 theme-transparent collapse-btn w-100 mx-0${
            (isOpenCollapse && ' is-open') || ''
          }`}
          onClick={onOpenCollapseClicked}
        >
          <div className="evaluation-rating-wrapper">
            <div className="rating-label-wrapper px-2">
              <span className="header-text mb-2">
                <span>{t(`${translationPath}evaluation-#`)}</span>
                <span className="px-1">{evaluationIndex + 1}</span>
              </span>
              <span className="rating-label">
                <span>
                  <span>{t(`${translationPath}your-rating`)}</span>
                  <span>:</span>
                </span>
                {(evaluation.rate || evaluation.rate === 0) && (
                  <span className="px-1">
                    <span>{evaluation.rate}</span>
                    <span className="px-1">({getRatingLabel(evaluation.rate)})</span>
                  </span>
                )}
              </span>
            </div>
            <Rating
              value={evaluation.rate || 0}
              name={`evaluationRatingDisabled${evaluationIndex}`}
              disabled
              precision={1}
            />
          </div>
          <span
            className={`px-2 fas fa-chevron-${(isOpenCollapse && 'up') || 'down'}`}
          />
        </ButtonBase>
      </div>

      <CollapseComponent
        isOpen={isOpenCollapse}
        wrapperClasses="w-100"
        component={
          <div className="collapse-content-wrapper">
            <div className="questions-items-wrapper">
              {evaluation.questions
                && evaluation.questions.map((item, index) => (
                  <QuestionSection
                    key={item.uuid}
                    onStateChanged={onStateChanged}
                    isSubmitted={isSubmitted}
                    isLoading={isLoading}
                    isDisabled={!evaluation.can_edit}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    errors={errors}
                    question={item}
                    parentId="evaluations"
                    parentIndex={evaluationIndex}
                    subParentId="questions"
                    subParentIndex={index}
                    id="answer"
                    errorPath={`evaluations[${evaluationIndex}].questions[${index}].answer`}
                    isOtherErrorPath={`evaluations[${evaluationIndex}].questions[${index}].other_answer`}
                  />
                ))}
            </div>
            <div className="mb-2">
              <div className="separator-h" />
            </div>
            <div className="evaluation-rating-wrapper">
              <div className="rating-label-wrapper">
                <span className="header-text">
                  {t(`${translationPath}overall-rating-of-candidate`)}
                </span>
                <span className="rating-label">
                  <span>
                    <span>{t(`${translationPath}your-rating`)}</span>
                    <span>:</span>
                  </span>
                  {(evaluation.rate
                    || evaluation.rate === 0
                    || (ratingHover !== -1 && ratingHover !== null)) && (
                    <span className="px-1">
                      <span>{ratingHover >= 0 ? ratingHover : evaluation.rate}</span>
                      <span className="px-1">
                        ({getRatingLabel(evaluation.rate)})
                      </span>
                    </span>
                  )}
                </span>
              </div>
              <Rating
                value={evaluation.rate || 0}
                name={`evaluationRate${evaluationIndex}`}
                precision={1}
                disabled={isLoading || !evaluation.can_edit}
                onChange={(event, newValue) => {
                  onStateChanged({
                    parentId: 'evaluations',
                    parentIndex: evaluationIndex,
                    id: 'rate',
                    value: newValue,
                  });
                }}
                onChangeActive={(event, newHover) => {
                  setRatingHover(newHover);
                }}
              />
              {errors[`evaluations[${evaluationIndex}].rate`]
                && (isSubmitted || ratingHover !== null) && (
                <div className="error-wrapper">
                  <span>
                    {errors[`evaluations[${evaluationIndex}].rate`].message}
                  </span>
                </div>
              )}
            </div>

            <SharedInputControl
              labelValue="notes"
              isFullWidth
              editValue={evaluation.note}
              isDisabled={isLoading || !evaluation.can_edit}
              isSubmitted={isSubmitted}
              errors={errors}
              errorPath={`evaluations[${evaluationIndex}].note`}
              stateKey="note"
              parentIndex={evaluationIndex}
              parentId="evaluations"
              onValueChanged={onStateChanged}
              multiline
              rows={4}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <div className="d-flex-v-center-h-end mb-3">
              <ButtonBase
                className="btns theme-solid"
                onClick={saveHandler}
                disabled={!getIsChangedEvaluation() || isLoading}
              >
                <LoaderComponent
                  isLoading={isLoading}
                  isSkeleton
                  wrapperClasses="position-absolute w-100 h-100"
                  skeletonStyle={{ width: '100%', height: '100%' }}
                />
                <span>{t('Shared:save')}</span>
              </ButtonBase>
            </div>
          </div>
        }
      />
    </div>
  );
};

EvaluationsSection.propTypes = {
  evaluation: PropTypes.instanceOf(Object).isRequired,
  evaluationIndex: PropTypes.number.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  changedStates: PropTypes.arrayOf(PropTypes.number).isRequired,
  ratingLabels: PropTypes.instanceOf(Array).isRequired,
  isOpenCollapse: PropTypes.bool.isRequired,
  onOpenCollapseChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  pre_candidate_uuid: PropTypes.string.isRequired,
  category_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
EvaluationsSection.defaultProps = {
  translationPath: '',
};
