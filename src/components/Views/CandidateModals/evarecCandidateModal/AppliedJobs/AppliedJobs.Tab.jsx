import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, CircularProgress } from '@mui/material';
import { GetAllAppliedJobsByCandidate } from 'services';
import { useEventListener } from 'hooks';

import moment from 'moment/moment';
import i18next from 'i18next';
import { GlobalDateFormat } from '../../../../../helpers';
import './AppliedJobs.Style.scss';

export const AppliedJobsTab = ({ candidate_uuid, parentTranslationPath }) => {
  const bodyRef = useRef(null);
  const { t } = useTranslation(parentTranslationPath);
  const [appliedJobsList, setAppliedJobsList] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const isLoadingRef = useRef(false);
  const isMountRef = useRef(false);
  const getCandidateAppliedJobsHandler = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    const res = await GetAllAppliedJobsByCandidate({
      uuid: candidate_uuid,
      ...filter,
    });
    isLoadingRef.current = true;
    setIsLoading(false);
    if (!isMountRef.current) isMountRef.current = true;
    if (res && res.status === 200)
      if (filter.page === 1) {
        setAppliedJobsList({
          results: res.data.results || [],
          totalCount: res.data.paginate?.total || 0,
        });
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-REC - View applied jobs',
          'View applied jobs',
          1,
          {},
        ]);
      } else
        setAppliedJobsList((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
        }));
    else setAppliedJobsList({ results: [], totalCount: 0 });
  }, [candidate_uuid, filter]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 5
      && appliedJobsList.results.length < appliedJobsList.totalCount
      && !isLoadingRef.current
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [appliedJobsList]);

  useEffect(() => {
    getCandidateAppliedJobsHandler();
  }, [getCandidateAppliedJobsHandler, filter]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  return (
    <div className="d-flex-column-center w-100 h-100">
      {isMountRef.current && appliedJobsList?.results?.length === 0 && (
        <div className="d-flex-center header-text">
          {t('candidate-did-not-apply')}
        </div>
      )}
      {appliedJobsList && appliedJobsList.results.length > 0 && (
        <div className="applied-for-wrapper">
          <div className="applied-for-content-wrapper">
            <div
              className="applied-for-body"
              onScroll={onScrollHandler}
              ref={bodyRef}
            >
              {appliedJobsList
                && appliedJobsList.results.map((item, index) => (
                  <ButtonBase
                    className={`applied-for-item-wrapper `}
                    key={`appliedJobKey${index + 1}`}
                    onClick={() =>
                      window.open(
                        `/recruiter/job/manage/pipeline/${item.job_uuid}`,
                        '_self',
                      )
                    }
                  >
                    <div className="applied-for-section">
                      <div className="header-text">
                        <span>{item.title}</span>
                      </div>
                      {item.applicant_number && (
                        <div className="px-1 t-align-initial">{`${t(
                          'application-reference-number',
                        )}: ${item.applicant_number}`}</div>
                      )}
                      <div>
                        <span>
                          {moment(item?.candidate_applied_date || Date.now())
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}
                        </span>
                      </div>
                    </div>
                    <div className="applied-for-section">
                      <div
                        className={`ai-matching-progress ${
                          (item.score >= 67 && 'high')
                          || (item.score < 67 && item.score >= 34 && 'medium')
                          || (item.score < 34 && 'low')
                        }`}
                      >
                        <CircularProgress
                          variant="determinate"
                          size={75}
                          value={item.score}
                        />
                      </div>
                      <div
                        className={`ai-matching-progress-value ${
                          (item.score >= 67 && 'high')
                          || (item.score < 67 && item.score >= 34 && 'medium')
                          || (item.score < 34 && 'low')
                        }`}
                      >
                        {`${Math.round(item.score)}%`}
                      </div>
                    </div>
                  </ButtonBase>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AppliedJobsTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
};
AppliedJobsTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
