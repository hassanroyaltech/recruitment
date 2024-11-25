import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DecisionCard } from '../../../../../../../pages/evarec/pipelines/managements/pipeline/sections/pipeline-header/sections/scorecard/cards';
import ScorecardStarRating from '../../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardStarRating.compnent';
import './TotalScoreCard.Style.scss';
import { Progress } from 'reactstrap';
import { AvatarList } from '../../../../../../../pages/onboarding/activity/components/AvatarsList';
import i18next from 'i18next';
import PropTypes from 'prop-types';
export const TotalScoreCard = ({
  parentTranslationPath,
  translationPath,
  state,
  wrapperClasses,
  isWeightScoring,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const scoreProgress = useMemo(
    () => (state?.progress?.completed / state?.progress?.total) * 100,
    [state?.progress?.completed],
  );
  const getItemName = useCallback(
    (item) =>
      `${item.first_name && item.first_name}${
        item.last_name && ` ${item.last_name}`
      }`,
    [],
  );
  const scoreCardMembers = useMemo(
    () =>
      (state?.committee_members || []).map((item) => ({
        ...item,
        name: getItemName(item),
        // url: item?.profile_image?.url || '',
      })),
    [state?.committee_members, getItemName],
  );

  return (
    <div className={`total-score-card bg-white ${wrapperClasses || ''}`}>
      <span className="d-block c-neutral-scale-1">
        {t(`${translationPath}total-score`)}
      </span>
      <div className="d-inline-flex-v-center gap-3">
        {!isWeightScoring && (
          <ScorecardStarRating
            value={state?.total_score}
            maxNumber={5}
            isView={true}
            ishideLabels={true}
          />
        )}
        <span className="c-neutral-scale-1  font-weight-700 fz-22px">
          {state?.total_score || state?.total_score === 0 ? state?.total_score : ''}
        </span>
      </div>
      <span className=" d-block fz-13px mb-2 c-neutral-scale-1">
        {t(`${translationPath}decisions`)}
      </span>
      <DecisionCard decisions={state?.decisions || {}} />
      <span className="d-block c-neutral-scale-1 mt-2 mb-2">
        {t(`${translationPath}progress`)}
      </span>
      <Progress className="flex-grow-1 p-0 my-1" multi>
        <Progress bar className="progress-rate" value={scoreProgress || 0} />
      </Progress>
      <div className="d-inline-flex-v-center gap-1">
        <AvatarList members={scoreCardMembers || []} max={3} dimension={27} />
        <span className="fz-12px c-neutral-scale-2">
          {`${state?.progress?.completed} ${t(`${translationPath}from`)} ${
            state?.progress?.total
          } ${t(`${translationPath}assigned-member-completed`)}`}
        </span>
      </div>
    </div>
  );
};
TotalScoreCard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  state: PropTypes.instanceOf(Object),
  wrapperClasses: PropTypes.string,
  isWeightScoring: PropTypes.bool,
};
