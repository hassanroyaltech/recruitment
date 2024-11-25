import React, { useState } from 'react';
import { ButtonBase } from '@mui/material';
import { ScorecardPreviewIcon } from '../../../../../../assets/icons';
import './ScorecardRatingInputs.Style.scss';
import i18next from 'i18next';
const ScorecardDesicion = ({
  handleChange,
  value,
  decisionLabels,
  id,
  isView,
  isViewOnlySelectedVal,
  labelKey,
  wrapperClasses,
  onChange,
  isSubmitted,
  errors,
  errorPath,
}) => {
  const [localActiveIndex, setLocalActiveIndex] = useState(value);

  return (
    <>
      <div
        id={id}
        className={`scorecard-decision-wrapper d-flex flex-wrap m-0 ${wrapperClasses}`}
      >
        {!isViewOnlySelectedVal && (
          <>
            <ButtonBase
              className={`btns  theme-transparent fz-14px mx-0 py-0  decision-Button
        ${localActiveIndex === 1 && ' active-decision-btn '}
        `}
              sx={{
                ...(isView && {
                  pointerEvents: 'none',
                }),
              }}
              onMouseEnter={() => setLocalActiveIndex(1)}
              onMouseLeave={() => setLocalActiveIndex(value || null)}
              onClick={() => {
                onChange && onChange({ value: 1 });
              }}
            >
              {decisionLabels?.accept?.[i18next.language]
                || decisionLabels?.accept?.en}
            </ButtonBase>
            <ButtonBase
              className={`btns  theme-transparent fz-14px py-0 miw-0 decision-Button 
             ${localActiveIndex === 2 && ' active-decision-btn '}
             `}
              sx={{
                ...(isView && {
                  pointerEvents: 'none',
                }),
              }}
              onMouseEnter={() => setLocalActiveIndex(2)}
              onMouseLeave={() => setLocalActiveIndex(value || null)}
              onClick={() => {
                onChange && onChange({ value: 2 });
              }}
            >
              {decisionLabels?.reject?.[i18next.language]
                || decisionLabels?.reject?.en}
            </ButtonBase>
          </>
        )}
        {labelKey && isViewOnlySelectedVal && value && (
          <ButtonBase
            className={`btns  theme-transparent fz-14px py-0 miw-0 decision-Button active-decision-btn }
        `}
          >
            {decisionLabels?.[labelKey]?.[i18next.language]
              || decisionLabels?.[labelKey]?.en}
          </ButtonBase>
        )}

        {isSubmitted && errors?.[errorPath]?.message && (
          <span className="w-100 error-score d-block ">
            {errors?.[errorPath]?.message || ''}
          </span>
        )}
      </div>
    </>
  );
};
export default ScorecardDesicion;
