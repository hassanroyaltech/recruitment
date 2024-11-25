import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import i18next from 'i18next';

import { useTranslation } from 'react-i18next';

export const OnboardingFiltersDisplaySection = ({
  filter,
  onFilterResetClicked,
  setFilter,
  parentTranslationPath,
  translationPath,
  onFilterChange,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const isShowReset = useMemo(() => {
    if (
      filter?.sort
      || filter?.recruiter_uuid
      || filter?.job_uuid
      || filter?.group
      || filter?.status
    )
      return true;
    return false;
  }, [filter]);

  const getDisplayedLabel = useMemo(
    () => (option) =>
      option.value
      || (option.title
        && (option.title[i18next.language] || option.title.en || option.title))
      || (option.name && (option.name[i18next.language] || option.name.en))
      || `${
        option.first_name
        && (option.first_name[i18next.language] || option.first_name.en)
      }${
        option.last_name
        && ` ${option.last_name[i18next.language] || option.last_name.en}`
      }`,
    [],
  );
  return (
    <div className="filters-display-section">
      {isShowReset && (
        <ButtonBase
          className="btns btns-transparent mx-0"
          onClick={onFilterResetClicked}
        >
          <span>{t(`reset-filters`)}</span>
        </ButtonBase>
      )}
      {['recruiter_uuid', 'job_uuid'].map((chip, i) =>
        filter?.[chip]?.uuid ? (
          <ButtonBase
            key={`${chip}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFilterChange(chip, null);
            }}
          >
            <span>{getDisplayedLabel(filter?.[chip])}</span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ) : null,
      )}
      {['sort', 'group'].map((chip, i) =>
        filter?.[chip]?.label ? (
          <ButtonBase
            key={`${chip}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFilterChange(chip, null);
            }}
          >
            <span>{t(`${filter?.[chip]?.label}`)}</span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ) : null,
      )}
      {['status'].map((chip, i) =>
        filter?.[chip]?.value ? (
          <ButtonBase
            key={`${chip}Key${i + 1}`}
            className="btns theme-transparent"
            onClick={() => {
              onFilterChange(chip, null);
            }}
          >
            <span> {filter?.[chip]?.value}</span>
            <span className="fas fa-times px-2" />
          </ButtonBase>
        ) : null,
      )}
    </div>
  );
};

OnboardingFiltersDisplaySection.propTypes = {
  filter: PropTypes.instanceOf(Object),
  setFilter: PropTypes.func.isRequired,
  onFiltersResetClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
