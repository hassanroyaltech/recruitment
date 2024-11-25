import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

import ScorecardStarRating from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardStarRating.compnent';
import { BlockAccordionScore } from '../cards/block-accordion/BlockAccordion.Card';

import { AvatarList } from '../../../../../../pages/onboarding/activity/components/AvatarsList';
import ScorecardRatingInput from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/FieldItem/Fields/ScorecardRatingInput/ScorcardRatingInput.component';
import ScorecardDesicion from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardDesicion.compnent';
import { Backdrop, CircularProgress } from '@mui/material';
export const itemByType = {
  rating: (item) => (
    <>
      <span className="fz-14px">{item.avg}</span>
      <ScorecardStarRating
        value={1}
        maxNumber={1}
        isView={true}
        ishideLabels={true}
      />
    </>
  ),
  decision: (item, details) => (
    <>
      <div className="d-flex c-neutral-scale-1 font-weight-400  fz-12px gap-2">
        <div className="d-inline-flex-center  short-decision-view">
          <span className="fa fa-check" />
          <span className="fz-12px">{details?.accept?.value || 0} </span>
        </div>
        <div className="d-inline-flex-center  short-decision-view">
          <span className="fa fa-times" />
          <span className=""> {details?.reject?.value || 0} </span>
        </div>
      </div>
    </>
  ),
  dropdown: (item) => <></>,
};

export const RatingByBlocksTab = ({
  parentTranslationPath,
  candidateDetails,
  candidateDetail,
  loadingArray,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const onChangeAccordion = useCallback((id) => {
    setExpandedAccordions((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);
  // candidateDetail?.basic_information?.first_name

  const getBlockDescription = useCallback(
    ({ type, member }) => {
      if ((member?.rating_given || member?.rating_given === 0) && type === 'rating')
        return ` ${t('rated')} ${candidateDetail?.basic_information?.first_name}`;
      if (member.value && type === 'dropdown') return ` ${t('selected')}`;
      if (type === 'decision') {
        if (member?.decision?.value === 0) return ` ${t('not-decided-yet')}`;
        if (member?.decision?.value === 1)
          return ` ${t('accepted')} ${
            candidateDetail?.basic_information?.first_name
          }`;
        if (member?.decision?.value === 2)
          return ` ${t('rejected')} ${
            candidateDetail?.basic_information?.first_name
          }`;
      }
    },
    [candidateDetail?.basic_information?.first_name, t],
  );
  return (
    <div className="w-100 min-h-50px score-candidate-tab-wrapper p-relative py-2 ">
      {candidateDetails?.rating_by_blocks?.length
        ? candidateDetails.rating_by_blocks.map((item, index) => (
          <div key={item.id}>
            <BlockAccordionScore
              expanded={expandedAccordions.includes(item.id)}
              onChange={() => {
                onChangeAccordion(item.id);
              }}
              title={
                <div className="d-flex section-title">
                  <div className="d-inline-flex-v-center-h-between w-100 px-2 py-1 mx-2 fz-12px font-weight-500">
                    <span className="c-black">
                      {item?.title?.[i18next.language] || item?.title?.en || ''}
                    </span>
                    <span
                      className="c-neutral-scale-1 fz-16px font-weight-700
                    d-inline-flex-v-center gap-1
                    "
                    >
                      {(item.avg || item.avg === 0) && (
                        <>
                          <span>{item.avg}</span>
                          <ScorecardStarRating
                            value={1}
                            maxNumber={1}
                            isView={true}
                            ishideLabels={true}
                          />
                        </>
                      )}
                    </span>
                  </div>
                </div>
              }
              body={
                item?.blocks?.length > 0
                  && item.blocks.map((block, idx) => (
                    <React.Fragment key={block.id}>
                      <BlockAccordionScore
                        expanded={expandedAccordions.includes(block.id)}
                        onChange={() => {
                          onChangeAccordion(block.id);
                        }}
                        title={
                          <div className="d-flex section-title">
                            <div className="d-inline-flex-v-center-h-between w-100 px-2 py-1 mx-2 fz-16px font-weight-700">
                              <span className="c-black">
                                {block?.title?.[i18next.language]
                                  || block?.title?.en
                                  || ''}
                                {block?.profile_value && (
                                  <span className="tags-wrapper mx-2 py-2 font-weight-400 fz-12px">
                                    {block?.profile_value}
                                  </span>
                                )}
                              </span>
                              <span className="c-neutral-scale-1 fz-16px font-weight-700 d-inline-flex-v-center gap-1">
                                {itemByType?.[block?.type]?.(
                                  block,
                                  candidateDetails?.committee_decisions,
                                ) || ''}
                              </span>
                            </div>
                          </div>
                        }
                        body={
                          <>
                            {block?.ratings?.map((member, memberIdx) => (
                              <React.Fragment
                                key={`member${
                                  member?.member_name || ''
                                }${memberIdx}`}
                              >
                                <div className="d-flex-h-between p-end-1 flex-wrap gap-2">
                                  <div className="d-inline-flex flex-grow-1  gap-1">
                                    <AvatarList
                                      members={
                                        [
                                          {
                                            name: member?.member_name,
                                          },
                                        ] || []
                                      }
                                      max={1}
                                      dimension={27}
                                    />
                                    <div className="px-1 d-block">
                                      <span className="pt-1 d-block c-neutral-scale-1 font-weight-500 fz-14px">
                                        {member?.member_name}
                                        <span className="c-neutral-scale-3 font-weight-400 fz-13px">
                                          {getBlockDescription({
                                            type: block.type,
                                            member,
                                          })}
                                        </span>
                                      </span>
                                      {member?.comment && (
                                        <span className="d-block c-black font-weight-400 fz-12px">
                                          {member?.comment}
                                        </span>
                                      )}
                                      {member?.time && (
                                        <span className="d-block c-neutral-scale-3 font-weight-400 fz-12-px">
                                          {member?.time}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="d-inline-flex-v-center-h-end  flex-grow-1 gap-2">
                                    {block?.type === 'decision'
                                      && member?.decision?.value && (
                                      <>
                                        <ScorecardDesicion
                                          value={member?.decision?.value}
                                          decisionLabels={member?.decision}
                                          isView={true}
                                          // isViewOnlySelectedVal={true}
                                          // labelKey={member?.decision?.value === 1  ? 'accept' :'reject'}
                                          wrapperClasses={
                                            'd-inline-flex small-decision-btns'
                                          }
                                        />
                                      </>
                                    )}
                                    {block?.type === 'rating' && (
                                      <>
                                        <ScorecardRatingInput
                                          sectionSetting={item.section_setting}
                                          globalSetting={
                                            candidateDetails?.card_setting
                                          }
                                          isView={true}
                                          value={member.rating_given}
                                          ishideLabels={true}
                                        />
                                        <span className="c-neutral-scale-1 fz-11px">
                                          {member?.rating_message}
                                        </span>
                                      </>
                                    )}
                                    {block?.type === 'dropdown' && (
                                      <>
                                        <span className="c-neutral-scale-1 fz-12px">
                                          {member.value}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {memberIdx < block?.ratings?.length - 1 && (
                                  <div
                                    className="d-block my-2 mr-3-reversed  separator-candidate-scorecard"
                                    style={{ opacity: '0.4' }}
                                  ></div>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        }
                      />
                      {idx < item.blocks?.length - 1 && (
                        <div
                          className="d-block my-1 mr-3-reversed  separator-candidate-scorecard"
                          style={{ opacity: '0.4' }}
                        ></div>
                      )}
                    </React.Fragment>
                  ))
              }
            />

            {index < candidateDetails.rating_by_blocks?.length - 1 && (
              <div className="d-block my-1 mx-3 separator-candidate-scorecard"></div>
            )}
          </div>
        ))
        : null}
      <Backdrop
        className="spinner-wrapper p-absolute"
        open={loadingArray.includes('candidate-score')}
        sx={{ backgroundColor: '#7272720a' }}
      >
        <CircularProgress color="inherit" size={30} />
      </Backdrop>
    </div>
  );
};

RatingByBlocksTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  candidateDetails: PropTypes.instanceOf(Object),
  candidateDetail: PropTypes.instanceOf(Object),
  loadingArray: PropTypes.instanceOf(Array),
};
RatingByBlocksTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
