import React, { memo } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import { ProgressEnums } from '../../enums';
import './LinearProgress.Style.scss';
import { floatHandler } from '../../helpers';

export const LinearProgressComponent = memo(
  ({
    value,
    progressText,
    inSameLine,
    isTextColored,
    isWithPercentage,
    variant,
    textClasses,
    floatNumbers,
    percentageClasses,
  }) => {
    const getActiveProgressEnumByValue = () => {
      if (value >= 80) return ProgressEnums['100-80'];
      if (value >= 50) return ProgressEnums['80-50'];
      if (value >= 30) return ProgressEnums['50-30'];
      return ProgressEnums['30-0'];
    };
    return (
      <div
        className={`linear-progress-wrapper${inSameLine ? ' is-in-same-line' : ''}`}
      >
        {progressText && (
          <span
            className={`progresses-text ${
              isTextColored ? getActiveProgressEnumByValue(value).color : ''
            } ${(textClasses && ` ${textClasses}`) || ''}`}
          >
            {progressText}
          </span>
        )}
        <div className="progress-bar-wrapper">
          <LinearProgress
            className="linear-progress "
            classes={{
              bar: getActiveProgressEnumByValue(value).bgColor,
            }}
            variant={variant}
            value={value}
          />
          {isWithPercentage && (
            <span
              className={`percentage-wrapper${
                (percentageClasses && ` ${percentageClasses}`) || ''
              }`}
            >
              <span>{floatHandler(value, floatNumbers)}</span>
              <span>%</span>
            </span>
          )}
        </div>
      </div>
    );
  },
);
LinearProgressComponent.displayName = 'LinearProgressComponent';
LinearProgressComponent.propTypes = {
  value: PropTypes.number.isRequired,
  progressText: PropTypes.string,
  inSameLine: PropTypes.bool,
  isTextColored: PropTypes.bool,
  isWithPercentage: PropTypes.bool,
  variant: PropTypes.oneOf(['determinate', 'indeterminate', 'buffer', 'query']),
  textClasses: PropTypes.string,
  floatNumbers: PropTypes.number,
  percentageClasses: PropTypes.string,
};
LinearProgressComponent.defaultProps = {
  progressText: null,
  inSameLine: false,
  isTextColored: false,
  isWithPercentage: false,
  variant: 'determinate',
  textClasses: undefined,
  floatNumbers: 3,
  percentageClasses: undefined,
};
