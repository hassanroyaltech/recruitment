/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import Skeleton from '@mui/material/Skeleton';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import urls from 'api/urls';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { addEvaluation } from 'shared/APIs/VideoAssessment/Evaluations';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../../helpers';
import { EvaluationTypesEnum } from '../../../../../enums';
import { SliderComponent } from '../../../../Slider/Slider.Component';
import { VitallyTrack } from '../../../../../utils/Vitally';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

/**
 * Evaluation Table that is present in the Candidate Modals.
 * @param evaluations
 * @returns {JSX.Element}
 * @constructor
 */
export const CandidateEvaluationTable = ({
  handleChange,
  evaluations,
  evaluation_data,
  loadingEvaluation,
  reloadData,
  ratingLoader,
  setRatingLoader,
  ...props
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expanded, setExpanded] = useState('');
  const [subExpanded, setSubExpanded] = useState('');
  const user = localStorage.getItem('user');

  const handleTabChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setSubExpanded('');
  };

  const handleSubTabChange = (panel) => (event, isExpanded) => {
    setSubExpanded(isExpanded ? panel : false);
  };

  const handleExpandButtonClicked = (value) => {
    if (subExpanded !== value) setSubExpanded(value);
    else setSubExpanded(false);
  };

  /**
   * handler to change evaluation score
   * @param value
   * @param label_uuid
   * @param row
   */
  const handleChangeEvaluation = (newValue, label_uuid) => {
    setRatingLoader(true);
    let params = null;
    const url = urls.evarec.ats.CANDIDATE_EVALUATION_WRITE;

    params = {
      label_uuid,
      score: newValue,
      candidate_uuid: props.candidateUuid,
    };
    addEvaluation(url, params)
      .then((res) => {
        handleChange(res.data.results.overall_score);
        VitallyTrack('EVA-REC - Evaluate Candidates');
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-REC - Evaluate Candidates',
          'Evaluate Candidates from EVA-REC',
          1,
          {},
        ]);
        reloadData();
      })
      .catch((error) => {
        setRatingLoader(false);
        showError(
          (error
            && error.response
            && error.response.data
            && error.response.data.message)
            || t('Shared:failed-to-update'),
        );
      });
  };

  /**
   * @returns {JSX.Element}
   */
  return (
    <ToastProvider placement="top-center">
      <div className="evaluation-table-wrapper">
        {!loadingEvaluation ? (
          evaluations
          && evaluations.map((item, index) => (
            <Accordion
              className={`${
                expanded === item.title
                  ? index % 2 === 0
                    ? 'is-purple'
                    : 'is-blue'
                  : ''
              }`}
              key={`${index + 1}-evaluation-tab`}
              expanded={expanded === item.title}
              onChange={handleTabChange(item.title)}
            >
              <AccordionSummary
                className={`${
                  expanded === item.title
                    ? index % 2 === 0
                      ? 'is-purple'
                      : 'is-blue'
                    : ''
                }`}
                expandIcon={
                  <ExpandMoreIcon
                    className={`${index % 2 === 0 ? 'is-purple' : 'is-blue'}`}
                  />
                }
              >
                <div
                  className={`evaluation-title w-100 ${
                    index % 2 === 0 ? 'is-purple' : ''
                  }`}
                >
                  {item.title}
                  <div className="overall-score-info">
                    <span>
                      <span>{t(`${translationPath}team-avarage-rating`)}</span>
                      <span>:</span>
                      <span className="px-1">{item.score}</span>
                    </span>
                    <span>{t(`${translationPath}out-of`)}</span>
                    <span className="px-1">
                      {(props.score_type === EvaluationTypesEnum.OneToFive.key
                        && '5')
                        || '100%'}
                    </span>
                  </div>
                  {(props.score_type === EvaluationTypesEnum.OneToFive.key && (
                    <Rating
                      value={item.score || item.score === 0 ? item.score : 0}
                      readOnly
                    />
                  )) || (
                    <SliderComponent
                      step={10}
                      valueLabelDisplay="auto"
                      isDisabled
                      value={item.score}
                      marks={Array.from({ length: 11 }, (number, markerIndex) => ({
                        label: markerIndex * 10,
                        value: markerIndex * 10,
                      }))}
                    />
                  )}
                </div>
              </AccordionSummary>
              <AccordionDetails>
                {item.data.map((el, i) => (
                  <div
                    className="evaluation-data-wrapper"
                    key={`${i + 1}-evaluation-data`}
                  >
                    <Accordion
                      className={`${
                        subExpanded === el.title
                          ? i % 2 === 0
                            ? 'is-purple'
                            : 'is-blue'
                          : ''
                      }`}
                      expanded={el.title === subExpanded}
                      onChange={handleSubTabChange(el.title)}
                    >
                      <AccordionSummary
                        className={`evaluation-data-summary px-2 ${
                          subExpanded === el.title ? 'no-border' : ''
                        } ${
                          subExpanded === el.title
                            ? i % 2 === 0
                              ? 'is-purple'
                              : 'is-blue'
                            : ''
                        }`}
                      >
                        <div
                          className={`evaluation-title ${
                            i % 2 === 0 ? 'is-purple' : ''
                          }`}
                        >
                          {el.title}
                          <div className="overall-score-info">
                            <span>{t(`${translationPath}team-avarage-rating`)}</span>
                            <span>:</span>
                            <span className="px-1">{el.score}</span>
                            <span>{t(`${translationPath}out-of`)}</span>
                            <span className="px-1">
                              {(props.score_type
                                === EvaluationTypesEnum.OneToFive.key
                                && '5')
                                || '100%'}
                            </span>
                          </div>
                          {(props.score_type
                            === EvaluationTypesEnum.OneToFive.key && (
                            <Rating
                              value={el.score || el.score === 0 ? el.score : 0}
                              readOnly
                            />
                          )) || (
                            <SliderComponent
                              step={10}
                              valueLabelDisplay="auto"
                              isDisabled
                              value={el.score}
                              marks={Array.from(
                                { length: 11 },
                                (number, markerIndex) => ({
                                  label: markerIndex * 10,
                                  value: markerIndex * 10,
                                }),
                              )}
                            />
                          )}
                        </div>
                        <AvatarGroup max={4}>
                          {el.recruiters.map((element, subIndex) => (
                            <Avatar
                              key={`${subIndex + 1}-sub-user`}
                              alt={element.first_name}
                            >
                              {element.first_name && element.first_name[0]}
                              {element.last_name && element.last_name[0]}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                        <div className="sub-rating-wrapper">
                          <div className="rating-title">
                            <span>{t(`${translationPath}your-rating`)}</span>
                            <span>:</span>
                            <span className="px-1">
                              {
                                el.recruiters.find(
                                  (p) =>
                                    p.email
                                    === JSON.parse(user)?.results?.user?.email,
                                )?.score
                              }
                              <span className="rating-loader">
                                {ratingLoader && (
                                  <span className="text-success text-sm">
                                    <i className="fas fa-circle-notch fa-spin" />
                                  </span>
                                )}
                              </span>
                            </span>
                          </div>
                          {(props.score_type
                            === EvaluationTypesEnum.OneToFive.key && (
                            <Rating
                              disabled={ratingLoader}
                              value={
                                el.recruiters?.find(
                                  (p) =>
                                    p.email
                                    === JSON.parse(user)?.results?.user?.email,
                                )?.score
                                  ? el.recruiters?.find(
                                    (p) =>
                                      p.email
                                        === JSON.parse(user)?.results?.user?.email,
                                  )?.score
                                  : 0
                              }
                              onChange={(event, newValue) => {
                                if (!newValue && newValue !== 0) return;
                                handleChangeEvaluation(newValue, el.uuid);
                              }}
                            />
                          )) || (
                            <SliderComponent
                              step={10}
                              valueLabelDisplay="auto"
                              isDisabled={ratingLoader}
                              defaultValue={
                                el.recruiters?.find(
                                  (p) =>
                                    p.email
                                    === JSON.parse(user)?.results?.user?.email,
                                )?.score
                                  ? el.recruiters?.find(
                                    (p) =>
                                      p.email
                                        === JSON.parse(user)?.results?.user?.email,
                                  )?.score
                                  : 0
                              }
                              marks={Array.from(
                                { length: 11 },
                                (number, markerIndex) => ({
                                  label: markerIndex * 10,
                                  value: markerIndex * 10,
                                }),
                              )}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              onChangeCommitted={(event, newValue) => {
                                event.preventDefault();
                                event.stopPropagation();
                                if (
                                  newValue
                                  === el.recruiters?.find(
                                    (p) =>
                                      p.email
                                      === JSON.parse(user)?.results?.user?.email,
                                  )?.score
                                )
                                  return;
                                handleChangeEvaluation(newValue, el.uuid);
                              }}
                            />
                          )}
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="candidate-rating-list-wrapper">
                          {(!el.recruiters || el.recruiters.length === 0) && (
                            <span className="c-gray-primary">
                              {t(`${translationPath}no-one-evaluate-description`)}
                            </span>
                          )}
                          {el.recruiters.map((subItem, subI) => (
                            <div
                              key={`${subI + 1}-eva`}
                              className="candidate-rating-list-item-wrapper"
                            >
                              <Avatar
                                key={`${subI + 1}-sub-user`}
                                alt={subItem.first_name}
                              >
                                {subItem.first_name && subItem.first_name[0]}
                                {subItem.last_name && subItem.last_name[0]}
                              </Avatar>
                              <div className="candidate-rating-list-item">
                                {subItem.first_name && subItem.first_name[0]}{' '}
                                {subItem.last_name && subItem.last_name[0]}
                                <Rating
                                  value={
                                    subItem.score || subItem.score === 0
                                      ? subItem.score
                                      : 0
                                  }
                                  readOnly
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <div
                      className={`show-all-button-wrapper ${
                        subExpanded === el.title
                          ? i % 2 === 0
                            ? 'is-purple'
                            : 'is-blue'
                          : ''
                      }`}
                    >
                      <Button onClick={() => handleExpandButtonClicked(el.title)}>
                        {t(`${translationPath}show-all-team-rating`)}{' '}
                        <i
                          className={`font-12 pl-2 fas fa-chevron-${
                            subExpanded ? 'up' : 'down'
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <div>
            <Skeleton
              className="mb-3"
              variant="rectangular"
              width={620}
              height={130}
            />
            <Skeleton
              className="mb-3"
              variant="rectangular"
              width={620}
              height={130}
            />
          </div>
        )}
      </div>
    </ToastProvider>
  );
};

export default CandidateEvaluationTable;
