/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import {
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import classnames from 'classnames';
import Loader from 'components/Elevatus/Loader';
import VideoCard from 'components/Elevatus/VideoCard';
import img from 'assets/img/theme/image-thumbnail.jpg';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import moment from 'moment';
import {
  addRating,
  getRecruiterRating,
  getVideosList,
} from '../../../shared/APIs/VideoAssessment/VideosTab';
import VideosFilterModal from './VideosFilterModal';
import { GlobalDisplayDateTimeFormat, showError } from '../../../helpers';

const translationPath = 'VideosTabComponent.';
export const VideosTab = (props) => {
  const { ManageTabs, parentTranslationPath } = props;
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem('user'))?.results,
    AddMemberModal: false,
    maxPerPage: 5,
    pageIndex: 0,
    data: [],
    title: '',
    question_uuid: '',
    sort: null,
    alert: null,
    openSureModal: false,
    openDoneModal: false,
    loadingInvite: false,
    show_email: false,
    show_applicants: true,
    candidates: [],
    filter_candidates: [],
    index: 0,
    query: null,
    stage_uuid: null,
    sort_by: null,
    pageNumber: 1,
    limit: 20,
    rate: 0,
    question: null,
  });
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [ratingLoader, setRatingLoader] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedCandidateChange, setSelectedCandidateChange] = useState(false);

  const sortByOptions = [
    {
      name: t(`${translationPath}a-to-z`),
      id: 1,
    },
    {
      name: t(`${translationPath}z-to-a`),
      id: 2,
    },
    {
      name: t(`${translationPath}application-date`),
      id: 3,
    },
    {
      name: t(`${translationPath}assessment-deadline`),
      id: 4,
    },
  ];

  const toggleNavs = (e, localState, index, candidate) => {
    setSelectedCandidateChange(true);
    setSelectedTab(index);
    setState((prevState) => ({
      ...prevState,
      index,
    }));
    setSelectedCandidates(candidate);
    setTimeout(() => {
      setSelectedCandidateChange(false);
    }, 400);
  };
  const [title, setTitle] = useState('');

  useEffect(() => {
    setLoading(true);
    getVideosList(
      props.match.params.id,
      sortBy,
      title,
      state.question?.value,
      state.pageNumber,
      state.limit,
    )
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          candidates: res.data.results.videos,
          filter_candidates: res.data.results.videos,
        }));
        setQuestions(res.data?.results?.questions);

        if (res.data.results.videos.length > 0)
          setSelectedCandidates(res.data.results.videos[0]);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t, props.match.params.id, sortBy, title, state.question]);

  const handleRating = (event, rating = 0) => {
    setRatingLoader(true);
    addRating(rating, selectedCandidates.uuid)
      .then((res) => {
        if (selectedCandidates)
          selectedCandidates.avg_rating = res.data.results?.rate;

        setRatingLoader(false);
      })
      .catch((error) => {
        setRatingLoader(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };
  const getRecruiterRate = (recruiter_uuid) => {
    setRatingLoader(true);
    getRecruiterRating(recruiter_uuid, selectedCandidates.uuid)
      .then((res) => {
        if (selectedCandidates)
          selectedCandidates.avg_rating = res.data.results?.rating?.rate;

        setRatingLoader(false);
      })
      .catch((error) => {
        setRatingLoader(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  return (
    <>
      {questions && (
        <VideosFilterModal
          title={title}
          questions={questions}
          setTitle={setTitle}
          isOpen={showSortModal}
          onClose={() => {
            setShowSortModal(false);
          }}
          onApply={({ question, newTitle }) => {
            setState({ ...state, question });
            setTitle(newTitle);
            setShowSortModal(false);
          }}
        />
      )}
      <ManageTabs id={props?.match?.params?.id} isActive={props.isActive} />

      <div className="mt-4 video-assessment-tab">
        {loading ? (
          <Loader speed={1} color="primary" />
        ) : (
          <div className="d-flex flex-row align-items-start">
            <div className="col-xs-12 col-md-8 mb-4">
              {detailsLoading ? (
                <Loader speed={1} color="primary" />
              ) : (
                <>
                  {state.candidates && state.candidates.length === 0 ? (
                    <div>
                      <p className="text-muted">
                        {t(`${translationPath}no-candidates-applied`)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="video-content-wrapper">
                        <div className="video-content d-flex align-items-center justify-content-center">
                          {selectedCandidates ? (
                            selectedCandidates.media_status !== 'done' ? (
                              <h5 className="h5 text-muted position-absolute">
                                <span>
                                  {t(`${translationPath}the-video-is-processing`)}
                                </span>
                                <i className="fas fa-circle-notch fa-spin px-1" />
                              </h5>
                            ) : (
                              <div className="w-100 h-100">
                                {selectedCandidateChange ? (
                                  <div className="w-100 h-100 d-flex">
                                    <i className="fas fa-circle-notch fa-spin text-white h1 m-auto" />
                                  </div>
                                ) : (
                                  <VideoCard
                                    controls
                                    src={selectedCandidates.media?.media}
                                    poster={
                                      selectedCandidates.thumbnail
                                        ? selectedCandidates.thumbnail?.media
                                        : img
                                    }
                                  />
                                )}
                              </div>
                            )
                          ) : (
                            <h5 className="h5 text-white">
                              {t(
                                `${translationPath}no-videos-available-for-this-candidate`,
                              )}
                            </h5>
                          )}
                        </div>
                      </div>
                      <div className="video-controls-wrapper d-flex flex-row align-items-center justify-content-between">
                        <div className="video-controls-candidate-info d-flex align-items-center">
                          <img
                            className="avatar avatar-sm rounded-circle d-inline-block mr-3-reversed"
                            alt="..."
                            src={selectedCandidates.candidate.profile_image?.url}
                          />
                          <div className="ml-2-reversed d-flex flex-column text-white">
                            <h6 className="h6 mb-1 text-white">
                              {selectedCandidates.candidate.first_name}{' '}
                              {selectedCandidates.candidate.last_name}
                            </h6>
                            <div className="h7 font-14">
                              {selectedCandidates.candidate.email}
                            </div>
                            <div className="h7" style={{ opacity: 0.5 }}>
                              {selectedCandidates.first_record ? (
                                <>
                                  {t(`${translationPath}submitted-in`)}
                                  <span className="px-1">
                                    {new Date(
                                      selectedCandidates.first_record,
                                    ).toLocaleDateString()}
                                  </span>
                                </>
                              ) : (
                                <>{t(`${translationPath}not-submitted`)}</>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="video-controls-rating d-flex flex-column align-items-end">
                          <div className="d-flex flex-row align-items-center">
                            <span
                              className="mr-4-reversed text-light-gray"
                              style={{ color: '#e8eaed' }}
                            >
                              {t(`${translationPath}rate-this-video`)}
                            </span>
                            <Rating
                              name="avg_rating"
                              value={selectedCandidates.avg_rating || 0}
                              onChange={handleRating}
                            />
                            {ratingLoader ? (
                              <span className="ml-2-reversed text-success text-sm">
                                <i className="fas fa-circle-notch fa-spin" />
                              </span>
                            ) : (
                              <span
                                className="ml-2-reversed"
                                style={{ color: '#ffb800' }}
                              >
                                {Number(selectedCandidates?.avg_rating || 0).toFixed(
                                  1,
                                )}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 rated-candidates d-flex flex-row">
                            {selectedCandidates
                            && selectedCandidates?.rating_list ? (
                                <>
                                  <div
                                    key="all"
                                    className="rated-candidate-item bg-primary"
                                  >
                                    {t(`${translationPath}all`)}
                                  </div>
                                  {selectedCandidates?.rating_list
                                    .slice(0, 3)
                                    .map((r, index) => (
                                      <div
                                        key={`selectedCandidatesKey${index + 1}`}
                                        className="rated-candidate-item"
                                        role="button"
                                        tabIndex={0}
                                        onKeyUp={() => {}}
                                        onClick={() =>
                                          getRecruiterRate(r.recruiter_data.uuid)
                                        }
                                      >
                                        <img
                                          className="avatar avatar-sm rounded-circle d-inline-block mr-3-reversed"
                                          alt="..."
                                          src={r?.recruiter_data?.profile_image?.url}
                                        />
                                      </div>
                                    ))}
                                  {selectedCandidates?.rating_list.length > 3 && (
                                    <div
                                      key="more"
                                      className="rated-candidate-item bg-gray"
                                    >
                                    +{selectedCandidates?.rating_list.length - 3}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <h6 className="h6 text-white">
                                  {t(`${translationPath}no-candidates-rated`)}
                                </h6>
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="d-flex-v-start-h-end flex-wrap">
              <div className="d-flex-v-center-h-between px-3">
                <div>
                  {state.candidates && state.candidates.length !== 0 && (
                    <h5 className="h5 pl-1-reversed mb-0">
                      {t(`${translationPath}available-videos`)}
                    </h5>
                  )}
                </div>
                <div>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="btn-sm justfiy-self-end form-control-alternative text-gray btn"
                      tag="span"
                    >
                      <i className="fas fa-sort-amount-up" />
                      <span className="px-1">{t(`${translationPath}sort`)}</span>
                    </DropdownToggle>
                    <DropdownMenu end>
                      {sortByOptions.map((v, index) => (
                        <DropdownItem
                          key={index}
                          color="link"
                          onClick={() => setSortBy(v.id)}
                          className="btn-sm justfiy-self-end text-dark"
                        >
                          {v.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <Button
                    color="link"
                    className="form-control-alternative btn-sm text-gray"
                    onClick={() => setShowSortModal(true)}
                  >
                    <i className="fas fa-sliders-h" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 w-100 overflow-auto video-assessment-candidates">
                {state.candidates.map((candidate, i) => (
                  <NavItem
                    key={i}
                    className={classnames(
                      'video-assessment-candidate-item p-1 d-flex flex-row align-items-center',
                      selectedTab === i && 'selected',
                    )}
                    onClick={(e) => toggleNavs(e, state, i, candidate)}
                  >
                    <div
                      className="video-wrapper d-flex align-items-center justify-content-center"
                      style={{
                        backgroundImage:
                          candidate.thumbnail && `url(${candidate.thumbnail.media})`,
                      }}
                    >
                      <div className="video-button video-small-play-button">
                        <span className="video-icon-placeholder">
                          <i className="fa fa-play text-white" />
                        </span>
                      </div>
                    </div>
                    <div className="d-flex flex-column ml-3-reversed mt-2">
                      <h6 className="h6 mb-1">
                        {candidate.candidate.first_name}{' '}
                        {candidate.candidate.last_name}
                      </h6>
                      <div className="text-gray">{candidate.candidate.email}</div>
                      <div className="text-gray">
                        {candidate.created_at
                          && moment(candidate.created_at)
                            .locale(i18next.language)
                            .format(GlobalDisplayDateTimeFormat)}
                      </div>
                      {/* <div className="text-gray">
                        {candidate.first_record
                          && moment(candidate.first_record)
                            .locale(i18next.language)
                            .format(GlobalDisplayDateTimeFormat)}
                      </div> */}
                      <div className="mt-1">
                        <Rating
                          name="candidate_avg_rating"
                          disabled
                          value={candidate.avg_rating || 0}
                        />
                      </div>
                    </div>
                  </NavItem>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
