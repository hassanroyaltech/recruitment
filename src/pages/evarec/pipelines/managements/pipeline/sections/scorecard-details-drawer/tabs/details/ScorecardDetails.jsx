import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { GlobalDateFormat } from '../../../../../../../../../helpers';
import BlocksSwitcher from '../../../../../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/FieldItem/BlocksSwitcher';
import moment from 'moment/moment';
import { AvatarList } from '../../../../../../../../onboarding/activity/components/AvatarsList';

export const ScorecardDetails = ({
  parentTranslationPath,
  translationPath,
  scorecardData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const onChangeAccordion = useCallback((id) => {
    setExpandedAccordions((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);

  return (
    <div className=" ">
      <div className="flex-column px-3 py-2">
        <div className="d-flex mb-3">
          <span className=" c-gray-primary w-33">
            {t(`${translationPath}labels`)}
          </span>
          {scorecardData?.template_labels?.length > 0 && (
            <div className="d-flex flex-wrap gap-2  ">
              {scorecardData?.template_labels.map((item) => (
                <span key={item} className="tags-wrapper mx-0">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="d-flex  mb-3">
          <span className="  c-gray-primary w-33">
            {t(`${translationPath}created-at`)}
          </span>
          <span className="d-flex-v-center gap-2">
            <span className="far fa-clock" />
            {moment(scorecardData.created_at, 'DD/MM/YYYY HH:mm')
              .locale(i18next.language)
              .format(GlobalDateFormat)}
          </span>
        </div>
        <div className="d-flex">
          <span className="  c-gray-primary w-33">
            {t(`${translationPath}created-by`)}
          </span>
          <span className="d-flex-v-center gap-2">
            <span className="far fa-user" />
            {scorecardData?.created_by || ''}
          </span>
        </div>
      </div>
      <div className="d-block my-2  separator-sidebar-scorecard"></div>
      {scorecardData?.sections?.map((section, index) => (
        <React.Fragment key={section.id}>
          <Accordion
            expanded={expandedAccordions.includes(section.id)}
            onChange={() => {
              onChangeAccordion(section.id);
            }}
            elevation={0}
            sx={{
              marginBlockEnd: '0',
              '&.MuiPaper-root.MuiPaper-elevation': {
                margin: '0px',
              },
              '& .MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded': {
                minHeight: '35px',
                marginBlock: '0',
              },
              '&:before': { opacity: 0 },
            }}
          >
            <AccordionSummary
              aria-controls="accordion"
              sx={{
                '&': {
                  minHeight: '35px',
                  marginBlock: '0',
                },
                '& .MuiAccordionSummary-content,& .MuiAccordionSummary-content.Mui-expanded':
                  {
                    marginBlock: '0 ',
                  },
                flexDirection: 'row-reverse',
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: `${
                    (i18next.dir() === 'rtl' && 'rotate( -90deg)') || 'rotate(90deg)'
                  }`,
                },
              }}
              expandIcon={<span className={`fas fa-caret-right c-black`} />}
            >
              <div className="d-inline-flex-v-center">
                <div className="px-2 py-1 mx-2 pb-2 fz-14px font-weight-500">
                  <span>
                    {section?.title?.[i18next.language] || section?.title?.en || ''}
                  </span>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails
            // sx={{ paddingInlineEnd: '0px' }}
            >
              {section?.blocks?.length > 0
                && section.blocks.map((block, idx) => (
                  <React.Fragment key={block.id}>
                    <BlocksSwitcher
                      type={block?.type}
                      description={
                        block?.description?.[i18next.language]
                        || block?.description?.en
                        || ''
                      }
                      title={
                        block?.title?.[i18next.language] || block?.title?.en || ''
                      }
                      cardId={block.id}
                      containerId={section.id}
                      isView={true}
                      // errors={errors}
                      // isSubmitted={isSubmitted}
                      sectionSetting={section?.section_setting || {}}
                      globalSetting={scorecardData?.card_setting || {}}
                      decision={block?.decision || {}}
                      options={block?.options || []}
                      isEnableComment={block?.block_setting?.is_enable_comment}
                      isCommentRequired={block?.block_setting?.is_required_comment}
                      profileField={block?.profile_field}
                      isDynamic={block?.is_dynamic}
                      showProfileKey={true}
                      parentTranslationPath={parentTranslationPath}
                    />
                    {idx < section.blocks?.length - 1 && (
                      <div
                        className="d-block my-1 mx-4 separator-sidebar-scorecard"
                        style={{ opacity: '0.4' }}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
            </AccordionDetails>
          </Accordion>
          {index < scorecardData?.sections?.length - 1 && (
            <div className="d-block my-1 mx-3 separator-sidebar-scorecard"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

ScorecardDetails.propTypes = {
  isLoading: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  scorecardData: PropTypes.instanceOf(Object),
};
