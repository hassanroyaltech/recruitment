import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Box, ButtonBase } from '@mui/material';

import { useTranslation } from 'react-i18next';
import '../scorecard.builder.style.scss';
import './EvaluateDrawer.Style.scss';
import {
  CheckIcon,
  CornerDownIcon,
  TrashIcon,
} from '../../../../form-builder/icons';
import i18next from 'i18next';
import BlocksSwitcher from '../components/FieldItem/BlocksSwitcher';
import {
  ScorecardAppereanceEnum,
  ScorecardSubmitTypeEnum,
} from '../../../../../enums';

const parentTranslationPath = 'Scorecard';

export const EvaluateDrawer = ({
  drawerOpen,
  sections,
  closeHandler,
  title,
  description,
  labels,
  globalSetting,
  isPreview,
  submitStyle,
  handleChange,
  errors,
  isSubmitted,
  onClickSave,
  isSaving,
  status,
  showProfileValue,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [step, setStep] = useState({
    sectionIndex: 0,
    blockIndex: 0,
  });

  const handleNext = () => {
    if (!sections?.[step.sectionIndex]) return;
    if (sections?.[step.sectionIndex]?.blocks?.[step.blockIndex + 1])
      return setStep((items) => ({
        ...items,
        blockIndex: items.blockIndex + 1,
      }));
    if (
      sections?.[step.sectionIndex + 1]
      && !sections?.[step.sectionIndex]?.blocks?.[step.blockIndex + 1]
    )
      return setStep((items) => ({
        ...items,
        blockIndex: 0,
        sectionIndex: items.sectionIndex + 1,
      }));
  };
  const handleBack = () => {
    if (sections?.[step.sectionIndex]?.blocks?.[step.blockIndex - 1])
      return setStep((items) => ({ ...items, blockIndex: items.blockIndex - 1 }));
    if (
      sections?.[step.sectionIndex - 1]
      && !sections?.[step.sectionIndex]?.blocks?.[step.blockIndex - 1]
    )
      return setStep((items) => ({
        blockIndex: sections?.[step.sectionIndex - 1]?.blocks?.length
          ? sections?.[step.sectionIndex - 1]?.blocks?.length - 1
          : 0,
        sectionIndex: items.sectionIndex - 1,
      }));
  };
  const currentSection = useMemo(
    () => sections[step.sectionIndex],
    [sections, step],
  );
  const currentBlock = useMemo(
    () => sections[step.sectionIndex]?.blocks?.[step.blockIndex],
    [sections, step],
  );

  useEffect(() => {
    setStep({ sectionIndex: 0, blockIndex: 0 });
  }, [drawerOpen]);

  const blocksDoneDetect = useMemo(() => {
    let total = 0;
    let done = 0;
    if (sections.length)
      sections.forEach((sec) => {
        total = (sec.blocks?.length || 0) + total;
        done
          = ((sec.blocks || []).filter(
            (block) =>
              ((block?.type === 'rating' && block.rating)
                || (block?.type === 'dropdown'
                  && (block.value || block.value === `${0}`))
                || (block?.type === 'decision' && block?.decision?.value))
              && ((block?.block_setting?.is_required_comment && block?.comment)
                || !block?.block_setting?.is_required_comment),
          ).length || 0) + done;
      });
    return { total, done };
  }, [sections]);
  const isFieldsDisabled = useMemo(
    () => status === ScorecardSubmitTypeEnum.Submitted.key || isSaving,
    [isSaving, status],
  );
  return (
    <Drawer
      elevation={2}
      anchor="right"
      open={drawerOpen || false}
      onClose={closeHandler}
      hideBackdrop
      className="highest-z-index evaluation-drawer"
    >
      <div className="my-1 scorecard-evaluate-drawer-width">
        <div className="drawer-header d-flex-v-center-h-between my-1">
          <div className="d-flex-v-center">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-2"
              onClick={closeHandler}
            >
              <span className="fas fa-angle-double-right" />
            </ButtonBase>
          </div>
          <div></div>
        </div>

        <div className="d-flex-column ">
          <div className="d-block my-1  separator-sidebar-scorecard"></div>
          <div className="scorecard-tab-wrapper evaluation-section-preview">
            <div className="general-tab-wrapper px-3 ">
              <div className="d-flex font-weight-500 py-1 pb-2 fz-16px ">
                {title?.[i18next.language] || title?.en || ''}
              </div>
              <div className="d-flex font-weight-400 fz-14px c-neutral-scale-3 ">
                {description?.[i18next.language] || description?.en || ''}
              </div>
              {labels?.length > 0 && (
                <div className="d-flex flex-wrap gap-2 py-2">
                  {labels.map((item) => (
                    <span key={item} className="tags-wrapper mx-0">
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {/*<div className="d-block my-1  separator-sidebar-scorecard"></div>*/}
              {submitStyle === ScorecardAppereanceEnum.scroll.key
                && sections?.length > 0
                && sections.map((section, index) => (
                  <React.Fragment key={section.id}>
                    <div className="d-flex font-weight-400 py-2 fz-14px c-neutral-scale-3">
                      {section?.title?.[i18next.language]
                        || section?.title?.en
                        || ''}
                    </div>
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
                              block?.title?.[i18next.language]
                              || block?.title?.en
                              || ''
                            }
                            cardId={block.id}
                            containerId={section.id}
                            isView={isPreview}
                            errors={errors}
                            isSubmitted={isSubmitted}
                            sectionSetting={section?.section_setting || {}}
                            globalSetting={globalSetting}
                            decision={block?.decision || {}}
                            options={block?.options || []}
                            isEnableComment={block?.block_setting?.is_enable_comment}
                            isCommentRequired={
                              block?.block_setting?.is_required_comment
                            }
                            profileField={block?.profile_field}
                            isDynamic={block?.is_dynamic}
                            showProfileKey={!showProfileValue}
                            parentTranslationPath={parentTranslationPath}
                            selectValue={block?.value}
                            ratingValue={block?.rating}
                            decisionValue={block?.decision?.value}
                            handleChangeSections={handleChange}
                            comment={block?.comment}
                            sections={sections}
                            sectionIndex={index}
                            cardIndex={idx}
                            isFieldsDisabled={isFieldsDisabled}
                            showProfileValue={showProfileValue}
                            profileValue={block?.profile_value}
                          />
                          {idx < section.blocks?.length - 1 && (
                            <div
                              className="d-block my-1 mx-4 separator-sidebar-scorecard"
                              style={{ opacity: '0.4' }}
                            ></div>
                          )}
                        </React.Fragment>
                      ))}
                    {index < sections?.length - 1 && (
                      <div className="d-block my-1  separator-sidebar-scorecard"></div>
                    )}
                  </React.Fragment>
                ))}

              {submitStyle === ScorecardAppereanceEnum.steps.key
                && sections?.length > 0 && (
                <>
                  <div className="d-flex font-weight-400 py-2 fz-14px c-neutral-scale-3">
                    {currentSection?.title?.[i18next.language]
                        || currentSection?.title?.en
                        || ''}
                  </div>
                  {currentBlock && (
                    <BlocksSwitcher
                      type={currentBlock?.type}
                      description={
                        currentBlock?.description?.[i18next.language]
                          || currentBlock?.description?.en
                          || ''
                      }
                      title={
                        currentBlock?.title?.[i18next.language]
                          || currentBlock?.title?.en
                          || ''
                      }
                      cardId={currentBlock.id}
                      containerId={currentSection.id}
                      isView={isPreview}
                      errors={errors}
                      isSubmitted={isSubmitted}
                      sectionSetting={currentSection?.section_setting || {}}
                      globalSetting={globalSetting}
                      decision={currentBlock?.decision || {}}
                      options={currentBlock?.options || []}
                      isEnableComment={
                        currentBlock?.block_setting?.is_enable_comment
                      }
                      isCommentRequired={
                        currentBlock?.block_setting?.is_required_comment
                      }
                      profileField={currentBlock?.profile_field}
                      isDynamic={currentBlock?.is_dynamic}
                      showProfileKey={!showProfileValue}
                      parentTranslationPath={parentTranslationPath}
                      selectValue={currentBlock?.value}
                      ratingValue={currentBlock?.rating}
                      decisionValue={currentBlock?.decision?.value}
                      handleChangeSections={handleChange}
                      comment={currentBlock?.comment}
                      sections={sections}
                      isFieldsDisabled={isFieldsDisabled}
                      showProfileValue={showProfileValue}
                      profileValue={currentBlock?.profile_value}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {submitStyle === ScorecardAppereanceEnum.steps.key && (
        <div className="score-drawer-steps-actions ">
          <div className="d-flex-v-center-h-between  m-2 steps-btns">
            {(step.sectionIndex > 0 || step.blockIndex > 0) && (
              <ButtonBase
                className="btns theme-solid mx-0 miw-0"
                onClick={() => {
                  handleBack();
                }}
              >
                {t('back')}
              </ButtonBase>
            )}
            <div className="fz-12px done-blocks-label">
              {blocksDoneDetect?.done}/{blocksDoneDetect?.total}
              <span className="px-1">{t('blocks-done')}</span>
            </div>
            {step.sectionIndex < sections.length - 1
            || step.blockIndex < sections?.[step.sectionIndex]?.blocks?.length - 1 ? (
                <ButtonBase
                  className="btns theme-solid mx-0 miw-0"
                  onClick={() => {
                    handleNext();
                  }}
                >
                  {t('next')}
                </ButtonBase>
              ) : (
                <ButtonBase
                  className="btns theme-solid mx-0 miw-0"
                  onClick={() => {
                    onClickSave && onClickSave();
                  }}
                  disabled={isSaving || isPreview}
                >
                  {isSaving && (
                    <span className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {t('submit')}
                </ButtonBase>
              )}
          </div>
        </div>
      )}
      {submitStyle === ScorecardAppereanceEnum.scroll.key && (
        <div className="score-drawer-steps-actions ">
          <div className="d-flex-v-center-h-between  m-2 bg-white steps-btns">
            <div className="fz-12px done-blocks-label">
              {blocksDoneDetect?.done}/{blocksDoneDetect?.total}
              <span className="px-1">{t('blocks-done')}</span>
            </div>
            <ButtonBase
              className="btns theme-solid mx-0 miw-0"
              onClick={() => {
                onClickSave && onClickSave();
              }}
              disabled={isSaving || isPreview}
            >
              {isSaving && (
                <span className="fas fa-circle-notch fa-spin mr-2-reversed" />
              )}
              {t('submit')}{' '}
            </ButtonBase>
          </div>
        </div>
      )}
    </Drawer>
  );
};

EvaluateDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  sections: PropTypes.instanceOf(Array),
  closeHandler: PropTypes.func,
  title: PropTypes.instanceOf(Object),
  description: PropTypes.instanceOf(Object),
  labels: PropTypes.instanceOf(Array),
  globalSetting: PropTypes.instanceOf(Object),
  isPreview: PropTypes.bool,
  submitStyle: PropTypes.number,
  handleChange: PropTypes.func,
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onClickSave: PropTypes.func,
  isSaving: PropTypes.bool,
  status: PropTypes.number,
  showProfileValue: PropTypes.bool,
};
