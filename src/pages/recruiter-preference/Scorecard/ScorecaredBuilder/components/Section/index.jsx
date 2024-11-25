import * as React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSS } from '@dnd-kit/utilities';
import SectionMenu from './SectionMenu';
import { DndIcon } from '../../../../../form-builder/icons';
import { ChatGPTIcon } from '../../../../../../assets/icons';

const StyledSection = styled(Paper)(({ theme, transform, transition }) => ({
  transition,
  transform: CSS.Translate.toString(transform),
  backgroundColor: theme.palette.light.main,
  borderRadius: '4px',
  boxShadow: '0px 2px 13px 0px #00000005',
  position: 'relative',
  // minWidth: '1000px!important',
  maxWidth: 1255,
  margin: '15px auto',
  '& .hidden-button': {
    visibility: 'hidden',
    opacity: 0,
    transition: `visibility ${theme.transitions.duration.leavingScreen}ms, opacity ${theme.transitions.duration.enteringScreen}ms ${theme.transitions.easing.easeOut}`,
  },
  '&:hover': {
    '.hidden-button': {
      visibility: 'visible',
      opacity: 1,
    },
    boxShadow: '0px 2px 13px 0px #00000015',
  },
  '& .fb-section-header': {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '2px 10px 2px 16px',
    boxShadow: theme.shadow.divider.bottom,
    '&.is-rtl': {
      flexDirection: 'row-reverse',
      '& .MuiTypography-root': {
        marginRight: '0',
        marginLeft: 'auto',
      },
    },
    '& .MuiTypography-root': {
      marginRight: 'auto',
    },
  },
  '& .field-layout-row-wrapper': {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '1rem',
  },
  '& .field-layout-col-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    padding: '3rem',
  },
}));

const ScoreCardSection = React.forwardRef(
  (
    {
      children,
      handleProps,
      isDragging,
      containerId,
      setActiveId,
      activeId,
      dataSectionItems,
      setDataSectionItems,
      setDataSectionContainers,
      isOverContainer,
      onClick,
      templateData,
      setTemplateData,
      ratingSections,
      handleSettingChange,
      handleWeightChange,
      handleOpenChatGPTDialog,
      isGlobalLoading,
      ...props
    },
    ref,
  ) => {
    const handleSectionClick = React.useCallback(
      (e) => {
        e.stopPropagation();
        setActiveId((ids) =>
          ids.sectionId !== containerId || ids.cardId
            ? { ...ids, sectionId: containerId, cardId: null }
            : ids,
        );
      },
      [containerId, setActiveId],
    );

    return (
      <StyledSection
        ref={ref}
        onClick={handleSectionClick}
        sx={{
          borderRadius: '4px',
          outline: (theme) =>
            (activeId.sectionId === containerId && !activeId.cardId)
            || isOverContainer
              ? `1px solid ${theme.palette.dark.$70}`
              : `1px solid ${theme.palette.dark.$55}`,
          opacity: isDragging ? 0.5 : undefined,
        }}
        square={true}
        theme={props.theme}
        transform={props.transform}
        transition={props.transition}
      >
        <Box>
          <Box>
            {((activeId.sectionId === containerId && !activeId.cardId)
              || isOverContainer) && (
              <Tooltip title="Drag">
                <IconButton
                  disableRipple
                  sx={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    position: 'absolute',
                    top: '-5px',
                    left: '-6px',
                    backgroundColor: (theme) => `${theme.palette.dark.$70}`,
                    borderRadius: '4px',
                    padding: '0px',
                    ...(((activeId.sectionId === containerId && !activeId.cardId)
                      || isOverContainer) && {
                      '&  ellipse': { fill: 'white' },
                    }),
                  }}
                  aria-label="dnd"
                  {...handleProps}
                >
                  <DndIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box className={`row p-2 `}>
            <div className="d-flex-v-center-h-between">
              <Typography
                sx={{
                  fontWeight: 500,
                  color: (theme) => `${theme.palette.primary.$70}`,
                  fontSize: '12px',
                }}
              >
                {dataSectionItems[containerId]?.title?.en || 'test'}
              </Typography>
              <div className="d-inline-flex">
                <SectionMenu
                  containerId={containerId}
                  currentSection={dataSectionItems[containerId]}
                  setDataSectionItems={setDataSectionItems}
                  setDataSectionContainers={setDataSectionContainers}
                  templateData={templateData}
                  setTemplateData={setTemplateData}
                  ratingSections={ratingSections}
                  handleGlobalSettingChange={handleSettingChange}
                  handleWeightChange={handleWeightChange}
                >
                  <Tooltip title="Edit">
                    <IconButton size="small">
                      <i className="fas fa-pen"></i>
                    </IconButton>
                  </Tooltip>
                </SectionMenu>
                {((activeId.sectionId === containerId && !activeId.cardId)
                  || isOverContainer) && (
                  <IconButton
                    // className="hidden-button"
                    disabled={(isGlobalLoading || []).includes(containerId)}
                    onClick={() => {
                      handleOpenChatGPTDialog({
                        containerId,
                        type: 'text',
                      });
                    }}
                    sx={{
                      '& svg': {
                        fill: '#484964',
                      },
                    }}
                  >
                    {(isGlobalLoading || []).includes(containerId) ? (
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
                )}
              </div>
            </div>

            {children?.props?.items?.length ? children : <Box className={'py-3'} />}
          </Box>
        </Box>
      </StyledSection>
    );
  },
);

ScoreCardSection.displayName = 'ScoreCardSection';

ScoreCardSection.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.instanceOf(Element),
    PropTypes.instanceOf(Object),
    PropTypes.any,
  ]),
  handleProps: PropTypes.instanceOf(Object).isRequired,
  isDragging: PropTypes.bool,
  containerId: PropTypes.string,
  setActiveId: PropTypes.func.isRequired,
  activeId: PropTypes.shape({
    sectionId: PropTypes.string,
    cardId: PropTypes.string,
  }),
  dataSectionItems: PropTypes.instanceOf(Object).isRequired,
  setDataSectionItems: PropTypes.func.isRequired,
  setDataSectionContainers: PropTypes.func.isRequired,
  isOverContainer: PropTypes.bool,
  onClick: PropTypes.func,
};
ScoreCardSection.defaultProps = {
  isDragging: undefined,
  containerId: undefined,
  activeId: undefined,
  isOverContainer: undefined,
  onClick: undefined,
};

export default ScoreCardSection;
