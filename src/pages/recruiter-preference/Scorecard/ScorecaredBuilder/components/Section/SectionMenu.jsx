import * as React from 'react';
import _ from 'lodash';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';
import { SectionSettingDrawer } from './SectionSetting/SectionSettingDrawer';
import blocksData from '../../data/BlocksData';
export default function SectionMenu({
  children,
  containerId,
  currentSection,
  setDataSectionItems,
  setDataSectionContainers,
  templateData,
  setTemplateData,
  ratingSections,
  handleGlobalSettingChange,
  handleWeightChange,
}) {
  const { t } = useTranslation('Shared');

  const [localItemsOrder, setLocalItemsOrder] = React.useState([]);

  const [titleValue, setTitleValue] = React.useState(currentSection.title);
  const [sectionSetting, setSectionSetting] = React.useState(
    currentSection.section_setting,
  );
  const memoizedRatingSections = React.useMemo(
    () =>
      ratingSections?.map((item) =>
        item.containerID === containerId
          ? {
            ...item,
            title: titleValue,
          }
          : { ...item },
      ),
    [containerId, ratingSections, titleValue],
  );
  const [isOpen, setIsOpen] = React.useState(null);
  const handleTitleChange = ({ val, lang }) => {
    if (lang)
      setTitleValue((items) => ({
        ...items,
        [lang]: val,
      }));
    else setTitleValue(val);
  };
  const handleSettingChange = ({ parent, id, val }) => {
    setSectionSetting((items) => ({
      ...items,
      [parent]: {
        ...items[parent],
        [id]: val,
      },
    }));
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleRemove = () => {
    handleClose();
    setDataSectionContainers((arr) => arr.filter((x) => x !== containerId));
    setDataSectionItems((obj) => _.omit(obj, [containerId]));
  };

  const handleSave = () => {
    // setTemplateData(items=>({
    //   ...items,
    //   card_setting:{
    //     ...items.card_setting,
    //     score_calculation_method:calculationMethod }
    // }))
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        blocks: localItemsOrder,
        title: titleValue,
        section_setting: sectionSetting,
      },
    }));
    handleClose();
  };

  React.useEffect(() => {
    setLocalItemsOrder(currentSection.blocks);
  }, [currentSection]);

  return (
    <Box>
      {React.cloneElement(children, {
        id: 'settings-card-button',
        'aria-label': 'section-settings',
        'aria-controls': isOpen ? 'settings-card-menu' : undefined,
        'aria-haspopup': true,
        'aria-expanded': isOpen ? 'true' : undefined,
        className: isOpen ? '' : 'hidden-button',
        variant: 'contained',
        onClick: handleOpen,
      })}
      <SectionSettingDrawer
        currentSection={currentSection}
        closeHandler={handleClose}
        drawerOpen={isOpen || false}
        handleRemove={handleRemove}
        handleSave={handleSave}
        setLocalItemsOrder={setLocalItemsOrder}
        localItemsOrder={localItemsOrder}
        handleTitleChange={handleTitleChange}
        titleValue={titleValue}
        sectionSetting={sectionSetting}
        handleSettingChange={handleSettingChange}
        calculationMethod={templateData?.card_setting?.score_calculation_method}
        ratingSections={memoizedRatingSections}
        handleGlobalSettingChange={handleGlobalSettingChange}
        handleWeightChange={handleWeightChange}
      />
    </Box>
  );
}
