import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Rating } from '@mui/material';
import { LoaderComponent } from 'components';
import { RateSetupsProvider } from 'services/Providers.Services';

export const ProviderAccountRatingTab = ({
  parentTranslationPath,
  translationPath,
  activeItem,
  userType,
  selectedProviderData,
  setFilter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localLoading, setLocalLoading] = useState(false);

  const RateProviderHandler = useCallback(
    async (rate, uuid) => {
      setLocalLoading(true);
      const response = await RateSetupsProvider({
        provider_uuid: selectedProviderData.uuid,
        rating_uuid: uuid,
        rating: rate,
      });
      if (response && (response.status === 200 || response.status === 201))
        setFilter((items) => ({ ...items }));

      setLocalLoading(false);
    },
    [selectedProviderData, setFilter],
  );

  return (
    <div className="provider-branches-rating-tab-wrapper tab-content-wrapper p-3">
      <LoaderComponent
        isLoading={localLoading}
        isSkeleton
        wrapperClasses="position-absolute w-100 h-100"
        skeletonStyle={{ width: '100%', height: '100%' }}
      />
      <div className="d-flex-v-center-h-between mb-2">
        <div>{t(`${translationPath}average-rating`)}</div>
        <div className="fz-26px">{`${
          selectedProviderData?.rating?.avg_rating
            ? parseFloat(
              (selectedProviderData?.rating?.avg_rating
                  && selectedProviderData?.rating?.avg_rating * 20)
                  || 0,
            ).toFixed(1)
            : 0
        }%`}</div>
      </div>
      {selectedProviderData?.rating?.rating_criteria?.map((item, idx) => (
        <div key={item.uuid} className="d-flex mb-4">
          <div>
            <div className="fz-20px mr-4">{`${
              (item?.rate && item?.rate * 20) || 0
            }%`}</div>
          </div>
          <div>
            <div className="fz-15px fw-bold">{item.name}</div>
            <Rating
              disabled={localLoading[idx]}
              value={item.rate}
              onChange={(e, newValue) => {
                RateProviderHandler(newValue, item.uuid);
              }}
              sx={{ color: '#4851C8' }}
            />
            {/* TODO */}
            <div className="fz-12px">
              Last rated 3 days ago, {item.ratings_num} ratings
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProviderAccountRatingTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    user_uuid: PropTypes.string,
  }).isRequired,
  userType: PropTypes.oneOf(['university', 'agency']).isRequired,
  selectedProviderData: PropTypes.shape({
    uuid: PropTypes.string,
    user_uuid: PropTypes.string,
    rating: PropTypes.array,
  }).isRequired,
  setFilter: PropTypes.func,
};
