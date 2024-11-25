import React, { useCallback, useEffect, useState } from 'react';
import { GetCandidatesInterviews } from '../../../services/CandidateInterview.Services';
import { isHTML, showError } from '../../../helpers';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import i18next from 'i18next';
import './InterviewDetails.Style.scss';
import { CollapseComponent } from '../../Collapse/Collapse.Component';
import { ButtonBase } from '@mui/material';
import PropTypes from 'prop-types';

const parentTranslationPath = 'EvarecCandidateModel';
const translationPath = 'InterviewDetails.';

export function InterviewDetailsComponent({ candidate_uuid }) {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [interviews, setInterviews] = useState({
    results: [],
    total: 0,
  });
  const [openedInterviews, setOpenedInterviews] = useState({});

  const GetCandidatesInterviewsHandler = useCallback(
    async ({ candidate_uuid }) => {
      const response = await GetCandidatesInterviews({ candidate_uuid, ...filter });
      if (response.status === 200)
        setInterviews({
          results: response.data.results.interviews,
          total: response.data.results.total,
        });
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t, filter],
  );

  useEffect(() => {
    if (candidate_uuid)
      GetCandidatesInterviewsHandler({
        candidate_uuid,
      });
  }, [GetCandidatesInterviewsHandler, candidate_uuid]);
  return (
    <div className="interview-details-wrapper">
      <div className="nav-actions">
        <ButtonBase
          className="btns btns-icon theme-transparent  mx-2"
          onClick={() => {
            setFilter((prev) => ({
              ...prev,
              page: prev.page - 1,
            }));
            setOpenedInterviews({});
          }}
          disabled={filter.page === 1}
        >
          <span className="fas fa-chevron-left" />
        </ButtonBase>
        <ButtonBase
          className="btns btns-icon theme-transparent  mx-2"
          onClick={() => {
            setFilter((prev) => ({
              ...prev,
              page: prev.page + 1,
            }));
            setOpenedInterviews({});
          }}
          disabled={interviews.total < filter.page * filter.limit}
        >
          <span className="fas fa-chevron-right" />
        </ButtonBase>
      </div>
      {interviews.results.map((interview) => (
        <div className="interview-item" key={interview.uuid}>
          <div className="interview-item-main">
            <div className="data-item ">
              <span className="label">
                {t(`${translationPath}interview-title`)}:{' '}
              </span>
              <span>{interview.title}</span>
            </div>
            <div>
              <ButtonBase
                className="btns btns-icon theme-transparent  mx-2"
                onClick={() =>
                  setOpenedInterviews((prev) => ({
                    ...prev,
                    [interview.uuid]: !prev[interview.uuid],
                  }))
                }
              >
                <span className="fas fa-chevron-down" />
              </ButtonBase>
            </div>
          </div>
          <CollapseComponent
            isOpen={openedInterviews[interview.uuid]}
            component={
              <div className="more-details">
                {/* Date */}
                <div className="data-item">
                  <i className="fas fa-calendar mr-2-reversed" />
                  <span className="label">
                    {t(`${translationPath}interview-date`)}:{' '}
                  </span>
                  <span>{interview.interview_Date}</span>
                </div>
                {/* Time */}
                <div className="data-item">
                  <i className="fas fa-calendar mr-2-reversed" />
                  <span className="label">
                    {t(`${translationPath}interview-time`)}:{' '}
                  </span>
                  <span>{`${moment(interview.from_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')} - ${moment(interview.to_time, 'HHmmss')
                    .locale(i18next.language)
                    .format('hh:mm A')}`}</span>
                </div>
                {/* Description */}
                <div className="data-item column">
                  <div>
                    <i className="fas fa-comment-alt mr-2-reversed" />
                    <span className="label">
                      {t(`${translationPath}description`)}:{' '}
                    </span>
                  </div>
                  {(isHTML(interview.description) && (
                    <div
                      dangerouslySetInnerHTML={{ __html: interview.description }}
                    />
                  )) || <div>{interview.description}</div>}
                </div>
                {/* Timezone */}
                <div className="data-item">
                  <i className="fas fa-calendar-times mr-2-reversed" />
                  <span className="label">
                    {t(`${translationPath}interview-timezone`)}:{' '}
                  </span>
                  <span>{interview.timezone}</span>
                </div>
                {/* Link */}
                <div className="data-item">
                  <i className="fas fa-link mr-2-reversed" />
                  <span className="label">
                    {t(`${translationPath}interview-link`)}:{' '}
                  </span>
                  <a href={interview.interview_link} className="text-truncate">
                    {interview.interview_link}
                  </a>
                </div>
                {/* Team members */}
                <div className="data-item column">
                  <div>
                    <i className="fas fa-users mr-2-reversed" />
                    <span className="label">
                      {t(`${translationPath}team-members`)}:{' '}
                    </span>
                  </div>
                  <ul>
                    {interview.recruiters.map((recruiter) => (
                      <li
                        key={recruiter.uuid}
                      >{`${recruiter.first_name} ${recruiter.first_name} - ${recruiter.email}`}</li>
                    ))}
                  </ul>
                </div>
                {/* Guests */}
                <div className="data-item column">
                  <div>
                    <i className="fas fa-users mr-2-reversed" />
                    <span className="label">{t(`${translationPath}guests`)}: </span>
                  </div>
                  <ul>
                    {interview.candidates.map((candidate) => (
                      <li
                        key={candidate.email}
                      >{`${candidate.first_name} ${candidate.first_name} - ${candidate.email}`}</li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
}

InterviewDetailsComponent.propTypes = {
  candidate_uuid: PropTypes.string.isRequired,
};
