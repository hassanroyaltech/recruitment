import React, { useEffect } from 'react';
import {
  Box,
  IconButton,
  MenuItem,
  Typography,
  FormControl,
  Select,
  Popper,
  Divider,
} from '@mui/material';
import FieldMenu from './FieldMenu';
import {
  CopyIcon,
  TrashIcon,
  SettingsIcon,
  CornerDownIcon,
  IndicatorIcon,
} from '../../icons';
import Fade from '../../components/Fade';
import IconButtonGroup from '../../components/IconsButtonGroup';
import { alignList, textModificationList } from '../../data/iconButtonLists';
import fields from 'pages/form-builder/data/inputFields';
import { generateUUIDV4 } from '../../../../helpers';

function CustomPopper({
  type,
  open,
  cardId,
  anchorEl,
  fillBy,
  styleType,
  containerId,
  fieldsItems,
  templateData,
  dataSectionItems,
  setDataSectionItems,
}) {
  const [roleSelelct, setRoleSelect] = React.useState(fillBy);

  const handleRoleChange = (e) => {
    setRoleSelect(e.target.value);
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        ...(e.target.value === 'recipient' && {
          isSectionVisibleOnTheFinalDoc: true,
        }),
        items: data[containerId].items.map((x) =>
          x.id === cardId
            ? {
              ...x,
              fillBy: e.target.value,
              ...(e.target.value === 'recipient' && { isVisibleFinalDoc: true }),
            }
            : x,
        ),
      },
    }));
  };
  const handleCopy = () =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.reduce(
          (acc, item) => [
            ...acc,
            ...(item.id !== cardId
              ? [item]
              : [item, { ...item, id: generateUUIDV4(), isActive: false }]),
          ],
          [],
        ),
      },
    }));
  const handleTypographyChange = (e) => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId
            ? {
              ...x,
              style: fields[e?.target?.value?.toLowerCase()]?.style,
            }
            : x,
        ),
      },
    }));
  };
  const handleAlignment = (textAlign) =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId ? { ...x, style: { ...styleType, textAlign } } : x,
        ),
      },
    }));
  const handleTextStyle = (textDecoration) =>
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.map((x) =>
          x.id === cardId ? { ...x, style: { ...styleType, textDecoration } } : x,
        ),
      },
    }));

  const handleRemove = () => {
    setDataSectionItems((data) => ({
      ...data,
      [containerId]: {
        ...data[containerId],
        items: data[containerId].items.filter((x) => x.id !== cardId),
      },
    }));
  };

  useEffect(() => {
    setRoleSelect(fillBy);
  }, [fillBy]);

  return (
    <Popper
      id={cardId}
      open={anchorEl && open}
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
            {!['texteditor'].includes(type) && (
              <Box display="flex" alignItems="center">
                <FormControl fullWidth>
                  {['inline'].includes(type) ? (
                    <Select
                      id="popper-select"
                      value={styleType?.type || ''}
                      variant="standard"
                      disableUnderline
                      sx={{ border: 'none' }}
                      IconComponent={CornerDownIcon}
                      onChange={handleTypographyChange}
                    >
                      {Object.values(fieldsItems)
                        .filter((f) => f.type === 'inline')
                        .map((f) => (
                          <MenuItem key={f.title} value={f.style.type}>
                            {f.style.type}
                          </MenuItem>
                        ))}
                    </Select>
                  ) : (
                    <Select
                      id="popper-select"
                      value={roleSelelct}
                      variant="standard"
                      disabled={templateData.isNotShareable}
                      disableUnderline
                      sx={{
                        border: 'none',
                        '.MuiSelect-select': { display: 'flex' },
                      }}
                      IconComponent={CornerDownIcon}
                      onChange={handleRoleChange}
                    >
                      <MenuItem display="flex" value="sender">
                        <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                        <Typography sx={{ mr: 1 }}>Sender</Typography>
                      </MenuItem>
                      <MenuItem value="recipient">
                        <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                        <Typography sx={{ mr: 1 }}>Recipient</Typography>
                      </MenuItem>
                      {/* if section not visible on final document then disable change field role */}
                      {/* {(dataSectionItems[containerId].isSectionVisibleOnTheFinalDoc 
                      && dataSectionItems[containerId]?.items?.find((x) => x.id === cardId)?.isVisibleFinalDoc) ? ( 
                          <MenuItem  value="recipient">  
                            <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                            <Typography sx={{ mr: 1 }}>Recipient</Typography>
                          </MenuItem>
                        ) : (
                          <Tooltip 
                            title='Turn on section and field "Visible on final document" switches to change field fill by to recipient'
                          >
                            <div className='d-flex'> 
                              <MenuItem 
                                value="recipient"
                                disabled
                              >  
                                <IndicatorIcon sx={{ color: 'secondary.$80' }} />
                                <Typography sx={{ mr: 1 }}>Recipient</Typography>
                              </MenuItem>
                            </div>
                          </Tooltip>
                        )} */}
                    </Select>
                  )}
                </FormControl>
              </Box>
            )}
            {['inline'].includes(type) && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
                <IconButtonGroup
                  border="none"
                  isExclusive
                  setValue={handleAlignment}
                  list={alignList}
                  value={styleType?.textAlign}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
                <IconButtonGroup
                  border="none"
                  setValue={handleTextStyle}
                  list={textModificationList}
                  value={styleType?.textDecoration}
                />
              </>
            )}
            {!['texteditor'].includes(type) && (
              <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
            )}
            <Box display="flex">
              <IconButton onClick={handleCopy}>
                <CopyIcon />
              </IconButton>
              {!['inline', 'texteditor'].includes(type) && (
                <FieldMenu
                  cardId={cardId}
                  fillBy={fillBy}
                  containerId={containerId}
                  fieldsItems={fieldsItems}
                  templateData={templateData}
                  setDataSectionItems={setDataSectionItems}
                  dataSectionItems={dataSectionItems}
                  handleRoleChange={handleRoleChange}
                >
                  <IconButton>
                    <SettingsIcon />
                  </IconButton>
                </FieldMenu>
              )}
              {['inline'].includes(type) && (
                <Divider orientation="vertical" flexItem sx={{ mx: '9px' }} />
              )}
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

export default React.memo(CustomPopper);
