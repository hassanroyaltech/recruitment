import React, { useEffect, useState } from 'react';
import { ButtonBase } from '@mui/material';
import { ScorecardPreviewIcon } from '../../../../../../assets/icons';
import './ScorecardRatingInputs.Style.scss';
const ScorecardSquareRating = ({
  handleChange,
  value,
  labels,
  maxNumber,
  isView,
  ishideLabels,
  onChange,
}) => {
  const [localActiveIndex, setLocalActiveIndex] = useState(value || 0);
  useEffect(() => {
    setLocalActiveIndex(value || 0);
  }, [value]);
  return (
    <>
      <div className="square-rating-wrapper d-flex m-0">
        {Array.from({ length: maxNumber }, (_, index) => (
          <ButtonBase
            key={index}
            onClick={() => {
              onChange && onChange({ value: index + 1 });
            }}
            className={`btns  theme-transparent fz-12px mx-0 py-0 miw-0 square-score-btn ${
              (localActiveIndex === 0 || localActiveIndex)
              && index < localActiveIndex
              && 'active-square-score-btn'
            }`}
            sx={{
              ...(isView && {
                pointerEvents: 'none',
              }),
            }}
            onMouseEnter={() => setLocalActiveIndex(index + 1)}
            onMouseLeave={() => setLocalActiveIndex(value || null)}
          >
            {index + 1}
          </ButtonBase>
        ))}
      </div>
      {!ishideLabels && (
        <div className="d-flex-v-center-h-between">
          <span>{labels?.min || ''}</span>
          {labels?.med && maxNumber > 5 && <span> {labels?.med || ''}</span>}
          <span>{labels?.max || ''}</span>
        </div>
      )}
    </>
  );
};

export default ScorecardSquareRating;
