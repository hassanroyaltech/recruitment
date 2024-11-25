import React, { cloneElement, useEffect, useMemo, useState } from 'react';
import {
  styled,
  Popover,
  Box,
  ButtonGroup,
  Typography,
  Tab,
  Tabs,
  Button,
} from '@mui/material';

import _ from 'lodash';
import { BlockSettingDrawer } from './BlockSettingDrawer';
import blocksData from '../../../data/BlocksData';

function TabPanel({ children, value, index, ...props }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        px: 6,
        pt: 3,
        pb: '17px',
      }}
      role="tabpanel"
      hidden={value !== index}
      className="form-field-settings-body-wrapper"
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...props}
    >
      {value === index && children}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
    sx: {
      alignItems: 'flex-start',
      minWidth: 'fit-content',
      p: 0,
      mr: 6,
    },
    disableRipple: true,
  };
}

const Menu = styled((props) => (
  <Popover
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: theme.spacing(2),
    width: '100%',
    minWidth: 280,
    maxWidth: 410,
    boxShadow: '0px 4px 13px 0px #090B2114, 0px 0px 2px 0px #10111E33',
  },
}));

export default function CardSettingsMenu({
  children,
  cardId,
  containerId,
  templateData,
  dataSectionItems,
  setDataSectionItems,
  fieldsItems,
  isDesicionExist,
}) {
  // select card item from all cards(fields)
  const cardItem = useMemo(
    () => dataSectionItems[containerId].blocks.find((x) => x.id === cardId),
    [cardId, containerId, dataSectionItems],
  );
  const [currentBlock, setCurrentBlock] = React.useState(cardItem);
  const [blocksItems] = React.useState(Object.values(blocksData));

  const [isOpen, setIsOpen] = useState(false);
  const [inputType, setInputType] = useState(cardItem.type);

  const handleInputTypeChange = ({ target: { value } }) => {
    setInputType(value);
    setCurrentBlock((items) => ({
      ...items,
      type: value,
      ...(['decision', 'rating'].includes(value) && { is_required: true }),
      ...(_.isEqual(items.description, blocksData[items.type].description) && {
        description: { ...blocksData[value].description },
      }),
      ...(_.isEqual(items.title, blocksData[items.type].title) && {
        title: { ...blocksData[value].title },
      }),
    }));
  };
  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    setCurrentBlock(cardItem);
  }, [cardItem]);

  const handleTitleAndDescriptionChange = ({ val, lang, name }) => {
    if (lang)
      setCurrentBlock((items) => ({
        ...items,
        [name]: { ...items[name], [lang]: val },
      }));
    else
      setCurrentBlock((items) => ({
        ...items,
        [name]: val,
      }));
  };
  const handleBlockRequiredChange = (val) => {
    setCurrentBlock((items) => ({ ...items, is_required: val }));
  };
  const handleSave = () => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        blocks: data[containerId].blocks.map((item) =>
          item.id === cardId
            ? {
              ...item,
              ...currentBlock,
              type: inputType,
            }
            : item,
        ),
      },
    }));
    handleClose();
  };

  const handleRemove = () => {
    handleClose();
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        blocks: data[containerId].blocks.filter((x) => x.id !== cardId),
      },
    }));
  };

  const handleChangeCommentSetting = ({ name, val }) => {
    setCurrentBlock((items) => ({
      ...items,
      block_setting: {
        ...items.block_setting,
        [name]: val,
        ...(name === 'is_enable_comment'
          && !val && {
          is_required_comment: false,
        }),
      },
    }));
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      {cloneElement(children, {
        id: 'settings-card-item-button',
        'aria-controls': isOpen ? 'settings-card-item-menu' : undefined,
        'aria-haspopup': true,
        'aria-expanded': isOpen ? 'true' : undefined,
        variant: 'contained',
        onClick: handleOpen,
      })}

      <BlockSettingDrawer
        drawerOpen={isOpen || false}
        currentTitle={cardItem?.title}
        fieldsItems={fieldsItems}
        templateData={templateData}
        inputType={inputType}
        setInputType={setInputType}
        handleInputTypeChange={handleInputTypeChange}
        dataSectionItems={dataSectionItems}
        closeHandler={handleClose}
        handleSave={handleSave}
        handleRemove={handleRemove}
        blocksItems={blocksItems}
        currentBlock={currentBlock}
        setCurrentBlock={setCurrentBlock}
        handleTitleAndDescriptionChange={handleTitleAndDescriptionChange}
        descriptionValue={currentBlock?.description || ''}
        titleValue={currentBlock?.title || ''}
        isEnableComment={currentBlock?.block_setting?.is_enable_comment}
        handleChangeCommentSetting={handleChangeCommentSetting}
        isRequired={currentBlock?.is_required}
        handleBlockRequiredChange={handleBlockRequiredChange}
        isRequiredComment={currentBlock?.block_setting?.is_required_comment}
        isDesicionExist={isDesicionExist}
      />
      {/*<FieldTypeTab*/}
      {/*  fieldsItems={fieldsItems}*/}
      {/*  templateData={templateData}*/}
      {/*  cardItem={cardItem}*/}
      {/*  inputType={inputType}*/}

      {/*  setInputType={setInputType}*/}

      {/*  dataSectionItems={dataSectionItems}*/}

      {/*/>*/}
    </Box>
  );
}
