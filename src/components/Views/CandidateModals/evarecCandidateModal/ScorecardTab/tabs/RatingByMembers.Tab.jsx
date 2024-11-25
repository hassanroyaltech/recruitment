import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { BlockAccordionScore } from '../cards/block-accordion/BlockAccordion.Card';
import i18next from 'i18next';

import { AvatarList } from '../../../../../../pages/onboarding/activity/components/AvatarsList';
import ScorecardRatingInput from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/FieldItem/Fields/ScorecardRatingInput/ScorcardRatingInput.component';
import ScorecardDesicion from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardDesicion.compnent';
import { Backdrop, CircularProgress } from '@mui/material';
import ScorecardDropdown from '../../../../../../pages/recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardDropdown.compnent';

export const RatingByMembers = ({
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

  return (
    <div className="w-100 min-h-50px score-candidate-tab-wrapper p-relative py-2">
      {candidateDetails?.rating_by_members?.length
        ? candidateDetails.rating_by_members.map((item, index) => (
          <div key={`member${item?.member?.name || ''}${index}`}>
            <BlockAccordionScore
              expanded={expandedAccordions.includes(`${index}`)}
              onChange={() => {
                onChangeAccordion(`${index}`);
              }}
              title={
                <div className="d-flex section-title">
                  <div className="d-inline-flex-v-center w-100 px-2 py-1 mx-2 fz-12px font-weight-500">
                    <AvatarList
                      members={[{ name: item?.member?.name || '' }] || []}
                      max={1}
                      dimension={27}
                    />
                    <span className="c-black px-1">
                      {item?.member?.name || ''}
                    </span>
                  </div>
                </div>
              }
              body={
                item?.sections?.length > 0
                  && item.sections.map((section, idx) => (
                    <React.Fragment key={`section${idx}${index}`}>
                      <BlockAccordionScore
                        expanded={expandedAccordions.includes(
                          `section${idx}${index}`,
                        )}
                        onChange={() => {
                          onChangeAccordion(`section${idx}${index}`);
                        }}
                        title={
                          <div className="d-flex section-title">
                            <div className="d-inline-flex-v-center-h-between w-100 px-2 py-1 mx-2 fz-12px font-weight-500">
                              <span className="c-black">
                                {section?.title?.[i18next.language]
                                  || section?.title?.en
                                  || ''}
                              </span>
                            </div>
                          </div>
                        }
                        body={
                          <>
                            {section?.blocks?.map((block, blockIdx) => (
                              <React.Fragment key={`block${index}${idx}${blockIdx}`}>
                                <div className="d-flex-h-between p-end-1 flex-wrap gap-2">
                                  <div className="px-1 d-block">
                                    <span className="c-black font-weight-500 fz-14px">
                                      {block?.title?.[i18next.language]
                                        || block?.title?.en
                                        || ''}
                                    </span>
                                    {block?.profile_value && (
                                      <span className={'d-block '}>
                                        <span className="tags-wrapper mx-0 my-1 py-2 font-weight-400 fz-12px">
                                          {block?.profile_value}
                                        </span>
                                      </span>
                                    )}
                                    {block?.comment && (
                                      <span className="d-block c-black py-1 font-weight-400 fz-12px">
                                        {block?.comment}
                                      </span>
                                    )}

                                    <div className="d-block pt-1">
                                      <div className="d-inline-flex-v-center gap-2 ">
                                        {block?.type === 'rating' && (
                                          <>
                                            <ScorecardRatingInput
                                              sectionSetting={
                                                section.section_setting
                                              }
                                              globalSetting={
                                                candidateDetails?.card_setting
                                              }
                                              isView={true}
                                              value={block.rating_given}
                                              ishideLabels={true}
                                            />
                                            <span className="c-neutral-scale-1 fz-16px font-weight-500">
                                              {block.rating_given}
                                            </span>
                                          </>
                                        )}
                                        {block?.type === 'decision' && (
                                          <>
                                            <ScorecardDesicion
                                              value={block?.decision?.value}
                                              decisionLabels={block?.decision}
                                              isView={true}
                                              wrapperClasses={
                                                'd-inline-flex small-decision-btns'
                                              }
                                            />
                                          </>
                                        )}
                                        {block?.type === 'dropdown' && (
                                          <>
                                            <ScorecardDropdown
                                              value={block?.value}
                                              options={block?.options}
                                              isView={true}
                                              isFieldsDisabled={true}
                                            />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {block?.time && (
                                      <span className="d-block pt-1 c-neutral-scale-3 font-weight-400 fz-12-px">
                                        {block?.time}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {blockIdx < section?.blocks?.length - 1 && (
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
                      {idx < item.sections?.length - 1 && (
                        <div
                          className="d-block my-1 mr-3-reversed  separator-candidate-scorecard"
                          style={{ opacity: '0.4' }}
                        ></div>
                      )}
                    </React.Fragment>
                  ))
              }
            />

            {index < candidateDetails.rating_by_members?.length - 1 && (
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

RatingByMembers.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  candidateDetails: PropTypes.instanceOf(Object),
  candidateDetail: PropTypes.instanceOf(Object),
  loadingArray: PropTypes.instanceOf(Array),
  onIsOpenDialogsChanged: PropTypes.func,
};
RatingByMembers.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
