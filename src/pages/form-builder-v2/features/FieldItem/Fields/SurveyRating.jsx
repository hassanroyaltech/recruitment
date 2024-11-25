import { createTheme } from '@mui/material/styles';
import * as React from 'react';
import { Box, styled, TextField, ThemeProvider } from '@mui/material';
import ScorecardRatingInput from '../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/FieldItem/Fields/ScorecardRatingInput/ScorcardRatingInput.component';
import { useMemo } from 'react';

// eslint-disable-next-line react/display-name
export default function SurveyRating({
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
  direction,
}) {
  const theme = useMemo(
    () => createTheme({ direction: direction || 'ltr' }),
    [direction],
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={'d-flex flex-wrap rating-wrapper'}>
        <ScorecardRatingInput
          id={id}
          sectionSetting={sectionSetting}
          globalSetting={globalSetting}
          isView={isView}
          ishideLabels={ishideLabels}
          value={value}
          onChange={onChange}
          wrapperClasses
        />
        {isSubmitted && errors?.[errorPath]?.message && (
          <span className="w-100 px-2 c-error d-block font-weight-500 ">
            {errors?.[errorPath]?.message || ''}
          </span>
        )}
      </div>
    </ThemeProvider>
  );
}

SurveyRating.displayName = 'SurveyRating';
