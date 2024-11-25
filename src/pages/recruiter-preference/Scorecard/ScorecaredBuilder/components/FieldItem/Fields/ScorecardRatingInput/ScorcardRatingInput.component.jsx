import * as React from 'react';
import {
  ScorecardRangesEnum,
  ScorecardStylesEnum,
} from '../../../../../../../../enums';
import ScorecardSquareRating from '../../../RatingInputs/ScorecardSquareRating.compnent';
import ScorecardStarRating from '../../../RatingInputs/ScorecardStarRating.compnent';

export default function ScorecardRatingInput({
  isSubmitted,
  errors,
  errorPath,
  id,
  sectionSetting,
  globalSetting,
  isView,
  ishideLabels,
  value,
  onChange,
}) {
  const maxNumber = React.useMemo(() => {
    if (globalSetting?.score?.score_range === ScorecardRangesEnum.zeroTen.key)
      return 10;
    if (globalSetting?.score?.score_range === ScorecardRangesEnum.zeroFive.key)
      return 5;
    if (sectionSetting?.score?.score_range === ScorecardRangesEnum.zeroTen.key)
      return 10;
    if (sectionSetting?.score?.score_range === ScorecardRangesEnum.zeroFive.key)
      return 5;
    return 5;
  }, [globalSetting?.score?.score_range, sectionSetting?.score?.score_range]);
  const labels = React.useMemo(() => {
    if (
      Object?.values(globalSetting?.range_labels || []).filter(
        (item) => item || item === 0,
      ).length > 0
    )
      return globalSetting?.range_labels;
    else return sectionSetting?.range_labels;
  }, [globalSetting?.range_labels, sectionSetting?.range_labels]);
  const ScoreType = React.useMemo(() => {
    if (globalSetting?.score?.score_style) {
      if (globalSetting?.score?.score_style === ScorecardStylesEnum.square.key)
        return ScorecardSquareRating;
      if (globalSetting?.score?.score_style === ScorecardStylesEnum.star.key)
        return ScorecardStarRating;
    }
    if (sectionSetting?.score?.score_style) {
      if (sectionSetting?.score?.score_style === ScorecardStylesEnum.square.key)
        return ScorecardSquareRating;
      if (sectionSetting?.score?.score_style === ScorecardStylesEnum.star.key)
        return ScorecardStarRating;
    }
    return ScorecardSquareRating;
  }, [globalSetting?.score?.score_style, sectionSetting?.score?.score_style]);
  return (
    <div id={id}>
      <ScoreType
        isView={isView}
        ishideLabels={ishideLabels}
        maxNumber={maxNumber}
        labels={labels}
        value={value}
        onChange={onChange}
      />
      {isSubmitted && errors?.[errorPath]?.message && (
        <span className="w-100 error-score d-block ">
          {errors?.[errorPath]?.message || ''}
        </span>
      )}
    </div>
  );
}

ScorecardRatingInput.displayName = 'ScorecardRatingInput';
