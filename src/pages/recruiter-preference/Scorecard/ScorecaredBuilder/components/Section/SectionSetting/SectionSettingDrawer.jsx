import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { Button, ButtonBase, ButtonGroup, Typography } from '@mui/material';
import './SectionSetting.Style.scss';
import { useTranslation } from 'react-i18next';
import { TabsComponent } from '../../../../../../../components';
import { CheckIcon, TrashIcon } from '../../../../../../form-builder/icons';
import { SectionSettingTabs } from './SectionSetting.Tabs';
import { ScoreCalculationTypeEnum } from '../../../../../../../enums';

const parentTranslationPath = 'Scorecard';

export const SectionSettingDrawer = ({
  drawerOpen,
  handleTitleChange,
  currentSection,
  handleRemove,
  handleSave,
  setLocalItemsOrder,
  localItemsOrder,
  titleValue,
  closeHandler,
  sectionSetting,
  handleSettingChange,
  calculationMethod,
  // setCalculationMethod
  ratingSections,
  handleGlobalSettingChange,
  handleWeightChange,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [sectionSettingTabsData] = useState(() => SectionSettingTabs);
  const [activeTab, setActiveTab] = useState(0);

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
              <div className="font-weight-500 fz-14px mx-2 overflow-ellipsis">
                {`${t('edit')} ${currentSection?.title?.en || ''}`}
              </div>
            </div>
            <div className=" ">
              <TabsComponent
                isPrimary
                isWithLine
                labelInput="label"
                idRef="taskTabsRef"
                wrapperClasses="px-0"
                tabsContentClasses="pt-1 px-0"
                data={sectionSettingTabsData.map((item) =>
                  item.key === 2
                    ? {
                      ...item,
                      disabled:
                          calculationMethod === ScoreCalculationTypeEnum.default.key,
                    }
                    : item,
                )}
                currentTab={activeTab}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                dynamicComponentProps={{
                  currentSection,
                  localItemsOrder,
                  setLocalItemsOrder,
                  parentTranslationPath,
                  handleTitleChange,
                  titleValue,
                  sectionSetting,
                  handleSettingChange,
                  calculationMethod,
                  // setCalculationMethod,
                  ratingSections,
                  handleGlobalSettingChange,
                  handleWeightChange,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="score-drawer-actions">
        <ButtonGroup variant="modal">
          <Button onClick={handleRemove}>
            <TrashIcon />
            <Typography>{t('remove')}</Typography>
          </Button>
          <Button onClick={handleSave}>
            <CheckIcon />
            <Typography>{t('save')}</Typography>
          </Button>
        </ButtonGroup>
      </div>
    </Drawer>
  );
};
