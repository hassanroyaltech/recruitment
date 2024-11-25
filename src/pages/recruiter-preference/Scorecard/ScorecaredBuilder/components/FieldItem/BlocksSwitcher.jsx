import React, { memo, useEffect, useMemo, useState } from 'react';

import InputField from './Fields/InputField';
import ScorecardRatingInput from './Fields//ScorecardRatingInput/ScorcardRatingInput.component';
import ScorecardDesicion from '../RatingInputs/ScorecardDesicion.compnent';
import ScorecardDropdown from '../RatingInputs/ScorecardDropdown.compnent';
import { Box } from '@mui/material';
import i18next from 'i18next';
import { SharedInputControl } from '../../../../../setups/shared';
import { useTranslation } from 'react-i18next';
// 'input' type default case
function BlocksSwitcher({
  type,
  options,
  sectionSetting,
  globalSetting,
  containerId,
  cardId,
  isRequired,
  isSubmitted,
  errors,
  decision,
  title,
  description,
  isEnableComment,
  isCommentRequired,
  parentTranslationPath,
  profileField,
  isDynamic,
  showProfileKey,
  selectValue,
  ratingValue,
  decisionValue,
  handleChangeSections,
  comment,
  isView,
  sections,
  cardIndex,
  sectionIndex,
  isFieldsDisabled,
  showProfileValue,
  profileValue,
}) {
  const { t } = useTranslation(parentTranslationPath);
  const handleSetValue = React.useCallback(
    ({ value, comment, isComment }) => {
      if (handleChangeSections)
        handleChangeSections({
          value,
          comment,
          type,
          containerId,
          cardId,
          isComment,
        });
    },
    [cardId, containerId, handleChangeSections, type],
  );
  const sectionIndexMemo = useMemo(() => {
    if (sectionIndex || sectionIndex === 0) return sectionIndex;
    else {
      const sectionIndex = (sections || []).findIndex(
        (sec) => sec?.id === containerId,
      );
      return sectionIndex;
    }
  }, [containerId, sectionIndex, sections]);

  const BlockIndexMem = useMemo(() => {
    if (cardIndex || cardIndex === 0) return cardIndex;
    else if (sectionIndexMemo || sectionIndexMemo === 0) {
      const blockIndex = (sections?.[sectionIndexMemo]?.blocks || []).findIndex(
        (block) => block?.id === cardId,
      );
      return blockIndex;
    } else return undefined;
  }, [cardId, cardIndex, sectionIndexMemo, sections]);

  const renderContent = React.useCallback(() => {
    switch (type) {
    case 'rating':
      return (
        <ScorecardRatingInput
          onChange={handleSetValue}
          isRequired={isRequired}
          type={type}
          isView={isView || isFieldsDisabled}
          sectionSetting={sectionSetting}
          globalSetting={globalSetting}
          id={`${cardId}`}
          value={ratingValue}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath={`sections[${sectionIndexMemo}].blocks[${BlockIndexMem}].rating`}
        />
      );
    case 'decision':
      return (
        <ScorecardDesicion
          isRequired={isRequired}
          isSubmitted={isSubmitted}
          decisionLabels={decision}
          id={`${cardId}`}
          value={decisionValue}
          onChange={handleSetValue}
          isView={isView || isFieldsDisabled}
          errors={errors}
          errorPath={`sections[${sectionIndexMemo}].blocks[${BlockIndexMem}].decision.value`}
        />
      );
    case 'dropdown':
      return (
        <ScorecardDropdown
          onChange={handleSetValue}
          isRequired={isRequired}
          options={options}
          id={`${cardId}`}
          value={selectValue}
          isView={isView || isFieldsDisabled}
          isFieldsDisabled={isFieldsDisabled}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath={`sections[${sectionIndexMemo}].blocks[${BlockIndexMem}].value`}
          parentTranslationPath={parentTranslationPath}
        />
      );
    default:
      return (
        <ScorecardRatingInput
          onChange={handleSetValue}
          isRequired={isRequired}
          type={type}
          sectionSetting={sectionSetting}
          globalSetting={globalSetting}
          id={`${cardId}`}
          value={ratingValue}
          isView={isView || isFieldsDisabled}
          isSubmitted={isSubmitted}
          errors={errors}
          errorPath={`sections[${sectionIndexMemo}].blocks[${BlockIndexMem}].rating`}
        />
      );
    }
  }, [
    type,
    handleSetValue,
    isRequired,
    isView,
    isFieldsDisabled,
    sectionSetting,
    globalSetting,
    cardId,
    ratingValue,
    isSubmitted,
    errors,
    sectionIndexMemo,
    BlockIndexMem,
    decision,
    decisionValue,
    options,
    selectValue,
    parentTranslationPath,
  ]);

  return (
    <>
      <div className="d-block px-1 py-2">
        {title && <Box className="header-text pt-0 pb-2 ">{title}</Box>}
        {profileField && isDynamic && showProfileKey && (
          <Box className="my-1 px-0 pt-0 pb-2  fz-12px">
            <span className="tags-wrapper mx-0 py-2">
              {t('dynamic-val')}
              <span style={{ paddingInlineStart: '5px' }}>{profileField}</span>
            </span>
          </Box>
        )}
        {profileField && isDynamic && showProfileValue && profileValue && (
          <Box className="my-1 px-0 pt-0 pb-2  fz-12px">
            <span className="tags-wrapper mx-0 py-2">{profileValue}</span>
          </Box>
        )}
        {description && (
          <Box className=" texts-form px-0 pt-0 pb-2  fz-16px">{description}</Box>
        )}

        <Box className="field-item-wrapper" display="flex" flex="1">
          {renderContent()}
        </Box>
      </div>
      {isEnableComment && (
        <div className="d-flex mt-2">
          <SharedInputControl
            wrapperClasses="m-0"
            isFullWidth
            isSubmitted={isSubmitted}
            isDisabled={isFieldsDisabled}
            errors={errors}
            errorPath={`sections[${sectionIndexMemo}].blocks[${BlockIndexMem}].comment`}
            isRequired={isCommentRequired}
            placeholder={isCommentRequired ? `comment-required` : `comment`}
            type="text"
            parentTranslationPath={parentTranslationPath}
            editValue={comment}
            onValueChanged={(newValue) => {
              handleSetValue({
                comment: newValue.value,
                isComment: true,
              });
            }}
          />
        </div>
      )}
    </>
  );
}

export default memo(BlocksSwitcher);
BlocksSwitcher.displayName = 'BlocksSwitcher';
