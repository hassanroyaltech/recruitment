import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { TimelineComponent, LoaderComponent } from 'components';
import i18next from 'i18next';
import './Logs.Style.scss';
import { useTranslation } from 'react-i18next';
import { useEventListener } from 'hooks';
import { GetATSLogs } from '../../../../../services';
import { CandidateLogsActionsTypes } from '../../../../../enums';

export const LogsComponent = ({
  job_uuid,
  job_candidate_uuid,
  parentTranslationPath,
  translationPath,
  bodyRef,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [logs, setLogs] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const getATSLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await GetATSLogs({
      job_uuid,
      job_candidate_uuid,
      ...filter,
    });
    if (res && res.status === 200)
      if (filter.page === 1)
        setLogs({
          results: res.data.results.data || [],
          totalCount: res.data.results?.total || 0,
        });
      else
        setLogs((items) => ({
          results: items.results.concat(res.data.results?.data || []),
          totalCount: res.data.results.total || 0,
        }));
    else setLogs({ results: [], totalCount: 0 });
    setIsLoading(false);
  }, [job_candidate_uuid, filter, job_uuid]);
  const onScrollHandler = useCallback(
    (event) => {
      if (
        event.target.scrollTop + event.target.clientHeight
          >= event.target.firstChild.clientHeight - 15
        && logs.results.length < logs.totalCount
        && !isLoading
      )
        setFilter((items) => ({ ...items, page: items.page + 1 }));
    },
    [logs.results.length, logs.totalCount, isLoading],
  );
  useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    getATSLogs();
  }, [getATSLogs]);
  return (
    <div className="logs-wrapper childs-wrapper">
      <TimelineComponent
        data={logs.results}
        idref="logsTimelineRef"
        wrapperClasses="logs-timeline-wrapper"
        separatorContentComponent={(item) => (
          <span
            className={`${
              (item.is_from_system && 'fas fa-laptop') || 'fas fa-user'
            }`}
          />
        )}
        contentComponent={(item) => (
          <div className="card-wrapper">
            <div className="card-content-wrapper p-2">
              <div className="logs-card-pre-header-wrapper">
                {item.created_at && (
                  <div className="logs-opposite-content-wrapper">
                    {moment(item.created_at)
                      .locale(i18next.language)
                      .format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                )}
              </div>
              <div className="card-header-wrapper">
                <span>
                  <span>{t(`${translationPath}action-by`)}</span>
                  <span className="px-1">
                    {(item.is_from_system && t(`${translationPath}automated`))
                      || (item.recruiter && item.recruiter.name)
                      || 'N/A'}
                  </span>
                </span>
              </div>
              <div className="card-body-wrapper">
                {item?.action_type === CandidateLogsActionsTypes.MoveToStage.key ? (
                  <span>
                    <span className="fas fa-chevron-right" />
                    <span className="px-2">{item.old_stage}</span>
                    <span className="fas fa-arrow-right" />
                    <span className="px-2">{item.new_stage_uuid}</span>
                  </span>
                ) : (
                  <span>
                    <span>{t(`${translationPath}action`)}:</span>
                    <span className="px-2">
                      {item?.log_data?.action_title || 'N/A'}
                    </span>
                    <br />
                    <span>{t(`${translationPath}stage`)}:</span>
                    <span className="px-2">
                      {item?.log_data?.stage_title || 'N/A'}
                    </span>
                  </span>
                )}

                {item.recruiter && item.recruiter.email && (
                  <span>
                    <span className="fas fa-envelope" />
                    <span className="px-1">
                      <span>{t(`${translationPath}email`)}</span>
                      <span>:</span>
                    </span>
                    <span className="wb-break-all">{item.recruiter.email}</span>
                  </span>
                )}
                {item.message && (
                  <span>
                    <span>{t(`${translationPath}message`)}</span>
                    <span>:</span>
                    <span className="wb-break-all">{item.message}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      />
      <LoaderComponent
        isLoading={isLoading}
        isTimelineSkeleton
        contentItemsVariant={[
          { variant: 'text' },
          { variant: 'text' },
          { variant: 'rectangular' },
        ]}
      />
    </div>
  );
};

LogsComponent.propTypes = {
  job_uuid: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  bodyRef: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
LogsComponent.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: 'LogsTab.',
};
