import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import {
  Backdrop,
  Box,
  Button,
  ButtonBase,
  ButtonGroup,
  CircularProgress,
  Icon,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import '../../Section/SectionSetting/SectionSetting.Style.scss';
import { useTranslation } from 'react-i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { CheckboxesComponent, TabsComponent } from '../../../../../../../components';
import {
  CheckIcon,
  CornerDownIcon,
  TrashIcon,
} from '../../../../../../form-builder/icons';
import { ScorecardTemplateTabs } from '../../../tabs-data';
import blocksData from '../../../data/BlocksData';
import {
  DynamicFormTypesEnum,
  ScoreCalculationTypeEnum,
} from '../../../../../../../enums';
import AddTranslationButton from '../../AddTranslationsButton/AddTranslationButton.Component';
import { ScorecardTranslationDialog } from '../../TranslationDialog/ScorecardTranslationDialog';
import { DesicionSetting } from './DecisionSetting';
import { OptionsSetting } from './OptionsSetting';
import { GetAllScorecardProfileFields } from '../../../../../../../services';
import i18next from 'i18next';

const parentTranslationPath = 'Scorecard';

export const BlockSettingDrawer = ({
  drawerOpen,
  handleTitleAndDescriptionChange,
  currentBlock,
  setCurrentBlock,
  handleRemove,
  handleSave,
  descriptionValue,
  setLocalItemsOrder,
  localItemsOrder,
  titleValue,
  closeHandler,
  sectionSetting,
  handleSettingChange,
  calculationMethod,
  setCalculationMethod,
  inputType,
  handleInputTypeChange,
  setInputType,
  blocksItems,
  isEnableComment,
  handleChangeCommentSetting,
  isRequiredComment,
  currentTitle,
  handleBlockRequiredChange,
  isRequired,
  isDesicionExist,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenTranslation, setIsOpenTranslation] = useState(false);
  const handleTranslate = (translations) => {
    setIsOpenTranslation(false);
    setCurrentBlock((items) => ({ ...items, ...translations }));
  };

  return (
    <Drawer
      elevation={2}
      anchor="right"
      open={drawerOpen || false}
      onClose={closeHandler}
      hideBackdrop
      className="highest-z-index"
    >
      <div className="my-2 score-side-drawer-width">
        <div className="drawer-header d-flex-v-center-h-between my-2">
          <div className="d-flex-v-center">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-2"
              onClick={closeHandler}
            >
              <span className="fas fa-angle-double-right" />
            </ButtonBase>
          </div>
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-2"
              // onClick={(e) => setPopoverAttachedWith(e.target)}
            >
              <span className="fas fa-ellipsis-h" />
            </ButtonBase>
          </div>
        </div>
        <div className="mt-2">
          <div className="d-flex-column">
            <div className="d-flex-v-center  px-2 pt-1">
              <div className="font-weight-500 fz-14px mx-2">
                {`${t('edit')} ${currentTitle?.en || ''}`}
              </div>
            </div>
            <div className="d-block my-2  separator-sidebar-scorecard"></div>
            <div className="scorecard-tab-wrapper">
              <div className="general-tab-wrapper section-setting-scroll">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 2, px: 3 }}>
                    <div className="d-flex-v-center-h-between mb-2 w-100 ">
                      <span
                        className="fz-12px c-black-light-color"
                        style={{ width: '150px' }}
                      >
                        {t('block-type')}
                      </span>
                      <Select
                        displayEmpty
                        fullWidth
                        variant="standard"
                        id="modal-input-type-select"
                        IconComponent={CornerDownIcon}
                        value={inputType}
                        onChange={handleInputTypeChange}
                      >
                        {blocksItems.map((item) => (
                          <MenuItem
                            key={`selectKey${item.id}`}
                            value={item.type}
                            name={item.type}
                            disabled={isDesicionExist && item?.type === 'decision'}
                          >
                            <Box display="flex" alignItems="center">
                              <Icon component={item.icon} />
                              <span className="px-1 ">
                                {' '}
                                {item.cardTitle?.[i18next.language]
                                  || item.cardTitle?.en}
                              </span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <div className="d-block my-2  separator-sidebar-scorecard"></div>
                    <div className="d-flex-v-center-h-between mt-2 mb-2">
                      <div className="d-inline-flex-v-center  px-2">
                        <CheckboxesComponent
                          idRef={`isRequiredBlockIdRef${inputType}`}
                          singleChecked={isRequired}
                          onSelectedCheckboxChanged={(event, isChecked) => {
                            handleBlockRequiredChange(isChecked);
                          }}
                          isDisabled={['decision', 'rating'].includes(inputType)}
                        />
                        <Typography
                          className="d-inline-flex  "
                          sx={{ width: '150px', color: 'dark.$40' }}
                        >
                          {t('required')}
                        </Typography>
                      </div>

                      <AddTranslationButton
                        onClick={() => {
                          setIsOpenTranslation(true);
                        }}
                      />
                    </div>
                    <span className="fz-12px c-black-light-color">
                      {t('block-title')}
                    </span>
                    <SharedInputControl
                      isFullWidth
                      stateKey="title"
                      searchKey="search"
                      innerInputWrapperClasses="border-0"
                      placeholder="block-title"
                      wrapperClasses="mb-0 px-0 mx-0 w-100"
                      textFieldWrapperClasses={'w-100'}
                      fieldClasses="input-font-weight-700 "
                      onValueChanged={(newValue) =>
                        handleTitleAndDescriptionChange({
                          val: newValue.value,
                          name: 'title',
                          lang: 'en',
                        })
                      }
                      editValue={titleValue?.en || ''}
                      parentTranslationPath={parentTranslationPath}
                    />
                    <div className="d-block my-2  separator-sidebar-scorecard"></div>
                    <span className="fz-12px c-black-light-color">
                      {t('description')}
                    </span>
                    <SharedInputControl
                      isFullWidth
                      stateKey="title"
                      searchKey="search"
                      innerInputWrapperClasses="border-0"
                      placeholder="add-optional-description"
                      wrapperClasses="mb-0 px-0 mx-0 w-100"
                      textFieldWrapperClasses={'w-100'}
                      fieldClasses="input-font-weight-700 "
                      onValueChanged={(newValue) =>
                        handleTitleAndDescriptionChange({
                          val: newValue.value,
                          name: 'description',
                          lang: 'en',
                        })
                      }
                      editValue={descriptionValue?.en || ''}
                      parentTranslationPath={parentTranslationPath}
                    />
                  </Box>
                </Box>
                <div className="d-block mb-2  separator-sidebar-scorecard"></div>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span className="px-2 fz-12px c-black ">
                    {t('dynamic-values')}
                  </span>
                  <Box className="d-flex" sx={{ mb: 2, px: 3 }}>
                    <Typography
                      className="d-inline-flex"
                      sx={{ pt: 2, color: 'dark.$40' }}
                    >
                      {t('dynamic-val-msg')}
                    </Typography>
                    <ButtonBase
                      className="btns btns-icon theme-transparent mx-0"
                      onClick={() => {
                        setCurrentBlock((items) => ({
                          ...items,
                          is_dynamic: !items.is_dynamic,
                        }));
                      }}
                    >
                      <span
                        className={`fas fa-toggle-${
                          currentBlock.is_dynamic ? 'on c-black' : 'off'
                        }`}
                      />
                    </ButtonBase>
                  </Box>
                  {currentBlock.is_dynamic && (
                    <Box className="d-flex" sx={{ mb: 2, px: 3 }}>
                      <div className="d-flex-v-center-h-between mb-1 w-100 ">
                        <Typography
                          className="d-inline-flex  "
                          sx={{ width: '150px', color: 'dark.$40' }}
                        >
                          {t('profile-field')}
                        </Typography>
                        <SharedAPIAutocompleteControl
                          isFullWidth
                          stateKey="profile_field"
                          controlWrapperClasses="mb-0"
                          placeholder="select-profile-field"
                          parentTranslationPath={parentTranslationPath}
                          onValueChanged={(newValue) => {
                            setCurrentBlock((items) => ({
                              ...items,
                              profile_field: newValue.value,
                            }));
                          }}
                          getDataAPI={GetAllScorecardProfileFields}
                          sharedClassesWrapper="mb-0"
                          editValue={currentBlock?.profile_field}
                          uniqueKey="key"
                          type={DynamicFormTypesEnum.select.key}
                        />
                      </div>
                    </Box>
                  )}
                </Box>

                {['dropdown'].includes(inputType) && (
                  <OptionsSetting
                    parentTranslationPath={parentTranslationPath}
                    currentBlock={currentBlock}
                    setCurrentBlock={setCurrentBlock}
                  />
                )}
                {['decision'].includes(inputType) && (
                  <DesicionSetting
                    parentTranslationPath={parentTranslationPath}
                    currentBlock={currentBlock}
                    setCurrentBlock={setCurrentBlock}
                  />
                )}
                <div className="d-block my-1  separator-sidebar-scorecard"></div>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 2, px: 3 }}>
                    <div className="d-flex-v-center">
                      <ButtonBase
                        className="btns btns-icon theme-transparent mx-0"
                        onClick={() => {
                          handleChangeCommentSetting({
                            name: 'is_enable_comment',
                            val: !isEnableComment,
                          });
                        }}
                      >
                        <span
                          className={`fas fa-toggle-${
                            isEnableComment ? 'on c-black' : 'off'
                          }`}
                        />
                      </ButtonBase>
                      <span className="fz-14px px-1 c-black-light-color">
                        {t('enable-comment')}
                      </span>
                      <span className="fa fa-comment c-gray" />
                    </div>
                    {isEnableComment && (
                      <div className="d-flex-v-center px-3">
                        <CheckboxesComponent
                          idRef={`isRequiredIdRef${inputType}`}
                          singleChecked={isRequiredComment}
                          onSelectedCheckboxChanged={(event, isChecked) => {
                            handleChangeCommentSetting({
                              name: 'is_required_comment',
                              val: isChecked,
                            });
                          }}
                        />
                        <Typography
                          className="d-inline-flex  "
                          sx={{ width: '150px', color: 'dark.$40' }}
                        >
                          {t('comment-is-required')}
                        </Typography>
                      </div>
                    )}
                  </Box>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="score-drawer-actions">
        <ButtonGroup variant="modal">
          <Button onClick={handleRemove}>
            <TrashIcon />
            <Typography>{t('remove-block')}</Typography>
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            <Typography>{t('save')}</Typography>
          </Button>
        </ButtonGroup>
      </div>
      {isOpenTranslation && (
        <ScorecardTranslationDialog
          activeItem={{
            title: titleValue,
            description: descriptionValue,
          }}
          isOpen={isOpenTranslation || false}
          onSave={handleTranslate}
          handleCloseDialog={() => {
            setIsOpenTranslation(false);
          }}
          titleText="block-data-translation"
          parentTranslationPath={parentTranslationPath}
          requiredKey="title"
          additionalKey="description"
        />
      )}
    </Drawer>
  );
};
