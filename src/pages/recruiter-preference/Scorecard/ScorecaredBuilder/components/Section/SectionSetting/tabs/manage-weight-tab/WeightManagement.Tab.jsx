import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import { Box, ButtonBase, Typography } from '@mui/material';
import { PlusIcon } from '../../../../../../../../form-builder/icons';

import { MinusIcon } from '../../../../../../../../../assets/icons';
import block from 'react-color/lib/components/block/Block';

export const WeightManagementTab = ({
  isLoading,
  parentTranslationPath,
  ratingSections,
  handleWeightChange,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="scorecard-tab-wrapper">
      <div
        className="general-tab-wrapper section-setting-scroll"
        style={{ width: '100%', paddingInline: '15px' }}
      >
        {!ratingSections.length ? (
          <Typography sx={{ mt: 2, color: 'dark.$40' }}>
            {t('add-rating-to-control')}
          </Typography>
        ) : (
          ratingSections.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="d-flex-v-center-h-between">
                <span className="c-ui-dark-primary-100 w-120px overflow-ellipsis ">
                  {section?.title?.en}
                </span>
                <SharedInputControl
                  wrapperClasses="mb-1 max-w-120"
                  placeholder="0"
                  innerInputWrapperClasses="border-0"
                  editValue={section.weight || 0}
                  themeClass="theme-transparent"
                  // parentTranslationPath={parentTranslationPath}
                  type="number"
                  onValueChanged={(newValue) =>
                    handleWeightChange({
                      val: newValue.value || 0,
                      type: 'section',
                      containerID: section.containerID,
                    })
                  }
                  min={0}
                  max={100}
                  endAdornment={<span className="c-neutral-scale-3">%</span>}
                />
                <div className="d-inline-flex">
                  <ButtonBase
                    className="btns btns-icon theme-transparent mx-1 weight-action-btn"
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.dark.$55}`,
                    }}
                    onClick={() => {
                      handleWeightChange({
                        val:
                          (section?.weight || 0) < 100
                            ? (section?.weight || 0) + 1
                            : 100,
                        type: 'section',
                        containerID: section.containerID,
                      });
                    }}
                  >
                    <PlusIcon />
                  </ButtonBase>
                  <ButtonBase
                    sx={{
                      border: (theme) => `1px solid ${theme.palette.dark.$55}`,
                    }}
                    className="btns btns-icon theme-transparent mx-0 weight-action-btn"
                    onClick={() => {
                      handleWeightChange({
                        val: section?.weight > 0 ? section?.weight - 1 : 0,
                        type: 'section',
                        containerID: section.containerID,
                      });
                    }}
                  >
                    <MinusIcon />
                  </ButtonBase>
                </div>
              </div>
              {section?.blocks.map((block) => (
                <React.Fragment key={block.id}>
                  <div className="d-flex-v-center-h-between">
                    <span className="c-neutral-scale-3  w-120px overflow-ellipsis ">
                      {block?.title?.en}
                    </span>
                    <SharedInputControl
                      wrapperClasses="mb-1 max-w-120"
                      placeholder="0"
                      editValue={block.weight || 0}
                      innerInputWrapperClasses="border-0"
                      themeClass="theme-transparent"
                      parentTranslationPath={parentTranslationPath}
                      type="number"
                      min={0}
                      max={section?.weight || 0}
                      endAdornment={<span className="c-neutral-scale-3">%</span>}
                      onValueChanged={(newValue) =>
                        handleWeightChange({
                          val: newValue.value,
                          type: 'block',
                          containerID: section.containerID,
                          blockID: block.id,
                        })
                      }
                    />
                    <div className="d-inline-flex">
                      <ButtonBase
                        className="btns btns-icon theme-transparent mx-1 weight-action-btn"
                        sx={{
                          border: (theme) => `1px solid ${theme.palette.dark.$55}`,
                        }}
                        onClick={() => {
                          handleWeightChange({
                            val:
                              (block?.weight || 0) < section.weight
                                ? (block?.weight || 0) + 1
                                : section.weight || 0,
                            type: 'block',
                            containerID: section.containerID,
                            blockID: block.id,
                          });
                        }}
                      >
                        <PlusIcon />
                      </ButtonBase>
                      <ButtonBase
                        sx={{
                          border: (theme) => `1px solid ${theme.palette.dark.$55}`,
                        }}
                        className="btns btns-icon theme-transparent mx-0 weight-action-btn "
                        onClick={() => {
                          handleWeightChange({
                            val: block?.weight > 0 ? block?.weight - 1 : 0,
                            type: 'block',
                            containerID: section.containerID,
                            blockID: block.id,
                          });
                        }}
                      >
                        <MinusIcon />
                      </ButtonBase>
                    </div>
                  </div>
                </React.Fragment>
              ))}
              {index < ratingSections.length - 1 && (
                <div className="d-block my-3 separator-scorecard"></div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

WeightManagementTab.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
