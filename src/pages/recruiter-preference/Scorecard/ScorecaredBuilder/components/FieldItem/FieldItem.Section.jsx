import * as React from 'react';
import { Box, Typography, Divider, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { CSS } from '@dnd-kit/utilities';
import { DndIcon } from '../../../../../form-builder/icons';
import { useMemo } from 'react';
import FieldSettingsPopper from './Poppers/FieldSettings.Popper';
import { SharedInputControl } from '../../../../../setups/shared';
import * as PropTypes from 'prop-types';
import BlocksSwitcher from './BlocksSwitcher';
import { tr } from 'date-fns/locale';

const Field = styled(Box)(
  ({ theme, type, active, transform, transition, dragging, sorting }) => ({
    transition,
    transform: CSS.Translate.toString(transform),
    position: 'relative',
    opacity: dragging ? 0.5 : undefined,
    border: dragging ? `2px dashed ${theme.palette.secondary.$80}` : undefined,
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    borderRadius: '4px',
    ...(sorting && {
      '&.dnd-field-item': {
        minHeight: 112,
        overflow: 'hidden',
      },
    }),
    '&.dnd-field-item': {
      '&.is-horizontal-labels': {
        '.MuiFormControl-root': {
          marginLeft: 0,
        },
        '.field-box-wrapper': {
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'flex-start',
          '.field-label-wrapper': {
            position: 'relative',
            display: 'inline-block',
            marginTop: '.5rem',
            '> span': {
              padding: '0.5rem 0.5rem 0',
              display: 'inline-flex',
              alignSelf: 'center',
              width: 150,
              wordBreak: 'break-word',
            },
          },
        },
      },
    },
    '> .MuiBox-root': {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      flexDirection: !['inline', 'texteditor'].includes(type) && 'column',
      outline: active && !dragging && `1px solid ${theme.palette.dark.$70}`,
      padding: '8px 15px',
      borderRadius: '4px',

      '& .MuiFormGroup-root': {
        '& .MuiButtonBase-root': {
          padding: theme.spacing(2),
          marginLeft: 0,
        },
        flexDirection: 'column',
        '& .MuiFormControlLabel-root': {
          marginLeft: theme.spacing(3),
        },
      },
      '& .MuiIconButton-root': {
        cursor: dragging ? 'grabbing' : 'grab',
      },
    },
  }),
);

const FieldItemSection = React.forwardRef(
  (
    {
      isFieldDisabled,
      preview,
      setDataSectionItems,
      fieldsItems,
      templateData,
      dataSectionItems,
      containerId,
      setActiveId,
      isActive,
      listeners,
      languages,
      style,
      isDragging,
      type,
      id,
      errors,
      isSubmitted,
      title,
      description,
      decision,
      options,
      parentTranslationPath,
      handleOpenChatGPTDialog,
      isGlobalLoading,
      isDesicionExist,
      ...props
    },
    ref,
  ) => {
    const [popperAnchorEl, setPopperAnchorEl] = React.useState(null);
    const handleCardClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        setActiveId((ids) =>
          ids.cardId !== id || ids.sectionId !== containerId
            ? { ...ids, cardId: id, sectionId: containerId }
            : ids,
        );
        setPopperAnchorEl((items) =>
          items !== e.currentTarget ? e.currentTarget : items,
        );
      },
      [containerId, id, setActiveId],
    );
    const currentSection = useMemo(
      () => dataSectionItems[containerId] || {},
      [containerId, dataSectionItems],
    );

    return (
      <>
        <Field
          dragging={(isDragging && isDragging.toString()) || ''}
          ref={ref}
          type={type}
          active={(isActive && isActive.toString()) || ''}
          // templateData={templateData}
          className={`dnd-field-item field-row-wrapper  
           is-vertical-labels `}
          onClick={handleCardClick}
          theme={props.theme}
          transform={props.transform}
          transition={props.transition}
          sorting={props.isSorting || ''}
        >
          {!isDragging ? (
            <>
              <React.Fragment>
                <Box className="field-box-wrapper">
                  {isActive && (
                    <Box className="field-label-wrapper">
                      <Tooltip title="Drag">
                        <IconButton
                          {...listeners}
                          sx={{
                            position: 'absolute',
                            top: '-5px',
                            left: '6px',
                            backgroundColor: (theme) => `${theme.palette.dark.$70}`,
                            borderRadius: '4px',
                            padding: '0px',
                            '& ellipse': { fill: 'white' },
                          }}
                        >
                          <DndIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                  <BlocksSwitcher
                    type={type}
                    setIsGlobalLoading={props.setIsGlobalLoading}
                    cardId={id}
                    containerId={containerId}
                    templateData={templateData}
                    setDataSectionItems={setDataSectionItems}
                    isView={true}
                    errors={errors}
                    isSubmitted={isSubmitted}
                    sectionSetting={currentSection?.section_setting || {}}
                    globalSetting={templateData?.card_setting || {}}
                    decision={decision || {}}
                    options={options || []}
                    isEnableComment={props?.block_setting?.is_enable_comment}
                    isCommentRequired={props?.block_setting?.is_required_comment}
                    title={title.en || ''}
                    description={description?.en || ''}
                    profileField={props?.profile_field}
                    isDynamic={props?.is_dynamic}
                    showProfileKey={true}
                    parentTranslationPath={parentTranslationPath}
                  />
                </Box>
              </React.Fragment>
            </>
          ) : (
            <Box dispaly="flex">
              <Typography
                color="secondary.main"
                sx={{
                  ml: 6,
                  fontSize: ` 14px`,
                }}
              >
                {title.en}
              </Typography>
            </Box>
          )}
        </Field>
        <FieldSettingsPopper
          keepMounted
          cardId={id}
          containerId={containerId}
          type={type}
          styleType={style ?? undefined}
          fieldsItems={fieldsItems}
          templateData={templateData}
          setDataSectionItems={setDataSectionItems}
          dataSectionItems={dataSectionItems}
          open={isActive || false}
          // translationPath={translationPath}
          anchorEl={popperAnchorEl}
          handleOpenChatGPTDialog={handleOpenChatGPTDialog}
          isGlobalLoading={isGlobalLoading}
          isDesicionExist={isDesicionExist}
        />
      </>
    );
  },
);

FieldItemSection.displayName = 'FieldItemSection';

export default FieldItemSection;
