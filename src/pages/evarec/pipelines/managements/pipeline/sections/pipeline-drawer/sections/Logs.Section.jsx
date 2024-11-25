import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import moment from 'moment';
import { GetEvaRecPipelineLogs } from '../../../../../../../../services';
import { PipelineLogsActionsEnum } from '../../../../../../../../enums';
import { LoadableImageComponant } from '../../../../../../../../components';
import { showError } from '../../../../../../../../helpers';
import { useEventListener } from '../../../../../../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';

export const LogsSection = ({
  jobUUID,
  parentTranslationPath,
  translationPath,
  onOpenedDetailsSectionChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const bodyRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const [logsData, setLogsData] = useState({
    results: [],
    totalCount: 0,
  });

  const LoadMoreHandler = useCallback(() => {
    setIsLoading(true);
    setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, []);

  const GetEvaRecPipelineLogsHandler = useCallback(
    async (job_uuid) => {
      const response = await GetEvaRecPipelineLogs({
        ...filter,
        job_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        const { results } = response.data;

        if (filter.page === 1)
          setLogsData({
            results: results?.log || [],
            totalCount: results.total || 0,
          });
        else
          setLogsData((items) => ({
            results: items.results.concat(results?.log || []),
            totalCount: results.total || 0,
          }));
      } else {
        setLogsData({
          results: [],
          totalCount: 0,
        });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [filter, t],
  );

  useEffect(() => {
    setIsLoading(true);
    if (jobUUID) GetEvaRecPipelineLogsHandler(jobUUID);
  }, [GetEvaRecPipelineLogsHandler, filter, jobUUID]);

  const onScrollHandler = useCallback(() => {
    if (
      (bodyRef.current.scrollHeight <= bodyRef.current.clientHeight
        || bodyRef.current.scrollTop + bodyRef.current.clientHeight
          >= bodyRef.current.firstChild.clientHeight - 5)
      && logsData.results.length < logsData.totalCount
      && !isLoading
      && LoadMoreHandler
    )
      LoadMoreHandler();
  }, [
    bodyRef,
    logsData.results.length,
    logsData.totalCount,
    isLoading,
    LoadMoreHandler,
  ]);

  useEventListener('scroll', onScrollHandler, bodyRef.current);

  useEffect(() => {
    if (!isLoading) onScrollHandler();
  }, [isLoading, onScrollHandler]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => onOpenedDetailsSectionChanged(null)}
          >
            <span className="fas fa-angle-double-right" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {t(`${translationPath}logs`)}
          </label>
        </div>
      </div>
      <div className="details-body-wrapper">
        <div
          style={{
            flex: '0 1 100%',
            overflowY: 'auto',
            flexWrap: 'wrap',
          }}
          ref={bodyRef}
        >
          <div>
            {logsData?.results?.map((log) => (
              <>
                <div className="d-flex m-3" key={log.uuid}>
                  <LoadableImageComponant
                    src={log.user.profile_image.url}
                    classes="user-image-wrapper"
                    alt={`${t(translationPath)}user-image`}
                  />
                  <div className="d-flex-column px-2">
                    <div className="d-flex mb-2">
                      <span>{`${log.user.first_name} ${
                        (log.user.last_name && ` ${log.user.last_name}`) || ''
                      }`}</span>
                      <span className="mx-1 text-gray">
                        {t(
                          `${translationPath}${
                            PipelineLogsActionsEnum[log.action_index].label
                          }`,
                        )}
                      </span>
                      {/* TODO: Missing data from API,
                            we need to get candidate
                            name that the user made the
                            action on or more pipeline-drawer
                            regarding the action */}
                      <span>candidate name.</span>
                    </div>
                    <div className="text-gray">
                      {moment(log?.updated_at).locale(i18next.language).fromNow()}
                    </div>
                  </div>
                </div>
                <Divider />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

LogsSection.propTypes = {
  jobUUID: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  onOpenedDetailsSectionChanged: PropTypes.func,
};

LogsSection.defaultProps = {
  jobUUID: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
};
