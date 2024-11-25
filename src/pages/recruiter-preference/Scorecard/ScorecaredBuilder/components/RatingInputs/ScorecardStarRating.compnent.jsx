import React from 'react';
import { Box } from '@mui/material';
import './ScorecardRatingInputs.Style.scss';
import Rating from '@mui/material/Rating';
import PropTypes from 'prop-types';

const ScorecardStarRating = ({
  value,
  labels,
  maxNumber,
  isView,
  ishideLabels,
  onChange,
}) => (
  <>
    <Box className="scor-star-rating-wrapper  d-flex m-0">
      <Rating
        readOnly={isView}
        max={maxNumber}
        value={value}
        name="simple-controlled"
        onChange={(event, newValue) => {
          onChange && onChange({ value: newValue });
        }}
      />
    </Box>
    {!ishideLabels && (
      <div className="d-flex-v-center-h-between px-1">
        <span>{labels?.min || ''}</span>
        {labels?.med && maxNumber > 5 && <span> {labels?.med || ''}</span>}
        <span>{labels?.max || ''}</span>
      </div>
    )}
  </>
);

export default ScorecardStarRating;

ScorecardStarRating.propTypes = {
  value: PropTypes.number,
  labels: PropTypes.instanceOf(Object),
  maxNumber: PropTypes.number,
  isView: PropTypes.bool,
  ishideLabels: PropTypes.bool,
  onChange: PropTypes.func,
};
