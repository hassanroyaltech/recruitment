import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../../helpers';
import { GetAllVisaStatistics } from '../../../../../services';
import { VisaDefaultStagesEnum } from '../../../../../enums';
import moment from 'moment';
import i18next from 'i18next';
import { LoaderComponent } from '../../../../../components';

export const StatisticsSection = ({
  sponsor,
  is_expired,
  isReloadStatistics,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState({});

  const getAllVisaStatistics = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaStatistics({
      sponsor,
      is_expired,
    });
    setIsLoading(false);
    if (response && response.status === 200) setStatistics(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [sponsor, is_expired, t]);

  const getStatisticsDescription = useMemo(
    () =>
      ({ key, time, first_name, last_name }) => {
        const currentVisaStage = Object.values(VisaDefaultStagesEnum).find(
          (item) => item.key === key,
        );
        if (currentVisaStage && currentVisaStage.statisticsDescriptions)
          return `${t(
            `${translationPath}${currentVisaStage.statisticsDescriptions.before}`,
          )} ${moment(time).locale(i18next.language).fromNow()} ${t(
            `${translationPath}${currentVisaStage.statisticsDescriptions.between}`,
          )} ${
            (first_name
              && typeof first_name === 'object'
              && (first_name[i18next.language] || first_name.en))
            || first_name
          }${
            (last_name
              && typeof last_name === 'object'
              && ` ${last_name[i18next.language] || last_name.en}`)
            || (last_name && ` ${last_name}`)
          }${(!first_name && !last_name && 'N/A') || ''}`;
        return 'N/A';
      },
    [t, translationPath],
  );

  useEffect(() => {
    getAllVisaStatistics();
  }, [sponsor, is_expired, getAllVisaStatistics, isReloadStatistics]);
  const extractTitle = useMemo(
    () => (item) => {
      if (typeof item.title === 'object')
        return item.title?.[i18next.language] || item.title?.en;
      return item.title;
    },
    [],
  );
  return (
    <div className="statistics-section-wrapper section-wrapper">
      <div className="statistics-cards-wrapper">
        {Object.values(statistics).map((item, index) => (
          <div
            key={`dashboardStatisticsKeys${index + 1}`}
            className="statistics-card-wrapper"
          >
            <div className="statistics-card-row mb-3">
              <span className={`statistics-icon ${item.icon}`} />
            </div>
            <div className="statistics-card-row fw-bold c-black">
              <span>{item.count}</span>
              <span className="px-1">{extractTitle(item) || '-'}</span>
            </div>
            {item.details && (
              <div className="statistics-card-row">
                <span className="statistics-description">
                  {getStatisticsDescription({
                    key: item.value,
                    time: item.details.created_at,
                    first_name: item.details.first_name,
                    last_name: item.details.last_name,
                  })}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <LoaderComponent
        isLoading={isLoading}
        isSkeleton
        wrapperClasses="statistics-card-loader-wrapper"
        skeletonItems={[
          {
            variant: 'rectangular',
            style: { minHeight: 132, width: 219 },
          },
        ]}
        numberOfRepeat={4}
      />
    </div>
  );
};

StatisticsSection.propTypes = {
  sponsor: PropTypes.string,
  is_expired: PropTypes.bool,
  isReloadStatistics: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

StatisticsSection.defaultProps = {
  sponsor: undefined,
  isReloadStatistics: undefined,
};
