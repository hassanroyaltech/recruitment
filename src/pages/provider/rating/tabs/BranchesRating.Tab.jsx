import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, LinearProgress } from '@mui/material';
import i18next from 'i18next';
import { PopoverComponent } from 'components';
import {
  GetProviderBranchesRating,
  GetProviderBrancheJobsRating,
} from 'services/Providers.Services';

export const ProviderBranchesRatingTab = ({
  parentTranslationPath,
  translationPath,
  activeItem,
  userType,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [branchesData, setBranchesData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [expandedBranch, setExpandedBranch] = useState();
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);

  const actionsPopoverCloseHandler = useCallback(() => {
    setPopoverAttachedWith(null);
    setExpandedBranch(null);
  }, []);

  const actionsTogglerHandler = useCallback(
    (item) => (event) => {
      event.stopPropagation();
      event.preventDefault();
      setPopoverAttachedWith(event.target);
      setExpandedBranch(item);
    },
    [],
  );

  const GetProviderBranchesRatingHandler = useCallback(async () => {
    const response = await GetProviderBranchesRating({
      provider_uuid: activeItem.uuid,
      provider_type: userType,
    });
    if (response && response.status === 200) setBranchesData(response.data?.results);
  }, [activeItem, userType]);

  const GetProviderBranchJobsRatingHandler = useCallback(async () => {
    const response = await GetProviderBrancheJobsRating({
      provider_uuid: activeItem.uuid,
      provider_type: userType,
      branch_uuid: expandedBranch?.branch_uuid,
    });
    if (response && response.status === 200) setJobsData(response.data?.results);
  }, [activeItem, userType, expandedBranch]);

  useEffect(() => {
    if (activeItem) GetProviderBranchesRatingHandler();
  }, [GetProviderBranchesRatingHandler, activeItem]);

  useEffect(() => {
    if (expandedBranch) GetProviderBranchJobsRatingHandler();
  }, [GetProviderBranchJobsRatingHandler, expandedBranch]);

  return (
    <div className="provider-branches-rating-tab-wrapper tab-content-wrapper p-3">
      <div className="d-flex-v-center-h-between mb-2">
        <div>{t(`${translationPath}success-rating`)}</div>
        <div className="fz-26px">{`${
          branchesData?.avg_rating
            ? parseFloat(
              (branchesData?.avg_rating && branchesData?.avg_rating * 100) || 0,
            ).toFixed(1)
            : 0
        }%`}</div>
      </div>
      {branchesData?.branches?.map((item) => (
        <div key={item.branch_uuid} className="mb-4">
          <div className="d-flex-v-center-h-between">
            <div style={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={parseInt(item.branch_rating.slice(0, -1))}
                sx={{ width: '100%' }}
              />
            </div>
            <div className="mr-2 ml-4 fz-15px">{item.branch_rating}</div>
            <ButtonBase
              onClick={(e) => {
                actionsTogglerHandler(item)(e);
              }}
              className="btns-icon theme-transparent"
            >
              <span className="fas fa-chevron-down px-2" />
            </ButtonBase>
          </div>
          <div className="fw-bold fz-15px mb-1">
            {item.branch_name?.[i18next.language]
              || item.branch_name?.en
              || t(`${translationPath}branch-name`)}
          </div>
          <div className="fz-12px">
            {`${t(`${translationPath}candidates-count`)} ${item?.candidates_count}`}
          </div>
        </div>
      ))}
      <PopoverComponent
        idRef="branchjobsPopoverRef"
        attachedWith={popoverAttachedWith}
        handleClose={actionsPopoverCloseHandler}
        component={
          <div className="p-3" style={{ minWidth: '22vw' }}>
            <div className="d-flex-v-center-h-between mb-3">
              <div>
                <div className="fz-15 fw-bold">
                  {expandedBranch?.branch_name?.[i18next.language]
                    || expandedBranch?.branch_name?.en
                    || 'Branch name'}
                </div>
                <div className="fz-12px">
                  {t(`${translationPath}based-on-jobs-succeess`)}
                </div>
              </div>
              {/* TODO */}
              <div className="fz-22px">{`${expandedBranch?.branch_rating}`}</div>
            </div>
            {jobsData?.map((job) => (
              <div key={job.job_uuid}>
                <div className="d-flex-v-center-h-between">
                  <div style={{ width: '100%' }}>
                    <LinearProgress
                      variant="determinate"
                      value={parseInt(job.job_rating.slice(0, -1))}
                      sx={{ width: '100%' }}
                    />
                  </div>
                  <div className="mr-2 ml-4">{job.job_rating}</div>
                </div>
                <div>{job.job_name || t(`${translationPath}job-name`)}</div>
                <div>
                  {`${t(`${translationPath}candidates-count`)} ${
                    job?.candidates_count
                  }`}
                </div>
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

ProviderBranchesRatingTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    user_uuid: PropTypes.string,
  }).isRequired,
  userType: PropTypes.oneOf(['university', 'agency']).isRequired,
};
