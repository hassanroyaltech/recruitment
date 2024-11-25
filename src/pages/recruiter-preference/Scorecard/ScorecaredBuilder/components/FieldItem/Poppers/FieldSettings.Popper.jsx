import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Popper,
  Divider,
} from '@mui/material';

import {
  CopyIcon,
  TrashIcon,
  CornerDownIcon,
  SettingsIcon,
} from '../../../../../../form-builder/icons';
import FieldMenu from '../FieldMenu';

import fields from 'pages/form-builder/data/inputFields';

import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { generateUUIDV4 } from '../../../../../../../helpers';
import Fade from '../../../../../../form-builder-v2/components/Fade';
import { ChatGPTIcon } from '../../../../../../../assets/icons';

function FieldSettingsPopper({
  type,
  open,
  cardId,
  anchorEl,
  containerId,
  fieldsItems,
  templateData,
  dataSectionItems,
  setDataSectionItems,
  handleOpenChatGPTDialog,
  isGlobalLoading,
  isDesicionExist,
}) {
  const handleCopy = () =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        blocks: data[containerId].blocks.reduce(
          (acc, item) => [
            ...acc,
            ...(item.id !== cardId
              ? [item]
              : [item, { ...item, id: generateUUIDV4() }]),
          ],
          [],
        ),
      },
    }));

  const getCurrentFieldItem = useMemo(
    () => () =>
      dataSectionItems[containerId].blocks.find((item) => item.id === cardId) || {},
    [cardId, containerId, dataSectionItems],
  );

  const handleRemove = () => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        blocks: data[containerId].blocks.filter((x) => x.id !== cardId),
      },
    }));
  };

  return (
    <Popper
      id={cardId}
      open={Boolean(anchorEl && open)}
      onClick={(e) => e.stopPropagation()}
      anchorEl={anchorEl}
      transition
      placement="top-start"
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box
            sx={{
              p: 2,
              mb: 2,
              bgcolor: 'light.main',
              boxShadow: 1,
              borderRadius: 2,
              display: 'flex',
              maxHeight: '48px',
            }}
          >
            <Box display="flex">
              {type && type !== 'decision' && (
                <IconButton onClick={handleCopy}>
                  <CopyIcon />
                </IconButton>
              )}
              <IconButton
                disabled={(isGlobalLoading || []).includes(cardId)}
                onClick={() => {
                  handleOpenChatGPTDialog({
                    containerId,
                    blockID: cardId,
                    type,
                  });
                }}
                sx={{
                  '& svg': {
                    fill: '#484964',
                  },
                }}
              >
                {(isGlobalLoading || []).includes(cardId) ? (
                  <span
                    className="fas fa-circle-notch fa-spin m-1"
                    style={{
                      color: '#484964',
                    }}
                  />
                ) : (
                  <ChatGPTIcon />
                )}
              </IconButton>
              <FieldMenu
                cardId={cardId}
                containerId={containerId}
                fieldsItems={fieldsItems}
                templateData={templateData}
                setDataSectionItems={setDataSectionItems}
                dataSectionItems={dataSectionItems}
                isDesicionExist={isDesicionExist}
              >
                <IconButton>
                  <SettingsIcon />
                </IconButton>
              </FieldMenu>

              <IconButton onClick={handleRemove}>
                <TrashIcon />
              </IconButton>
            </Box>
          </Box>
        </Fade>
      )}
    </Popper>
  );
}
FieldSettingsPopper.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.any]),
  cardId: PropTypes.string.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
    PropTypes.object,
  ]),

  styleType: PropTypes.instanceOf(Object),
  containerId: PropTypes.string.isRequired,
  fieldsItems: PropTypes.instanceOf(Object),

  setDataSectionItems: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
export default React.memo(FieldSettingsPopper);
