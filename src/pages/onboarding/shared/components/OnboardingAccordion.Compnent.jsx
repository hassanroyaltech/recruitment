import React, { memo } from 'react';
import PropTypes from 'prop-types';

import i18next from 'i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from '@mui/material';

import Avatar from '@mui/material/Avatar';

import { StringToColor } from '../../../../helpers';

export const OnboardingAccordion = memo(
  ({
    bodyComponent,
    expanded,
    onChange,
    withAvatar,
    member,
    actionComponent,
    withExtraButton,
    onExtraButtonClick,
  }) => {
    const avatarStyles = {
      height: `22px !important`,
      width: `22px !important`,
      marginInlineStart: '0px',
      marginInlineEnd: '7px',
      fontSize: '0.6rem !important',
      transform: 'scale(0.9)',
    };
    return (
      <Accordion
        expanded={expanded}
        onChange={() => {
          onChange();
        }}
        elevation={0}
        sx={{
          marginBlockEnd: '.25rem',
          '& .MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded': {
            minHeight: '35px',
            height: '35px',
          },
          '&:before': { opacity: 0 },
        }}
      >
        <AccordionSummary
          aria-controls="accordion"
          sx={{
            '&': {
              minHeight: '35px',
              height: '35px',
            },
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: `${
                (i18next.dir() === 'rtl' && 'rotate( -90deg)') || 'rotate(90deg)'
              }`,
            },
          }}
          expandIcon={
            <div className="gray-medium-light-color ">
              <span className={`fas fa-caret-right`} />
            </div>
          }
        >
          <div className="d-inline-flex-v-center ">
            <div className="accordin-title px-2 py-1 mx-2 c-black-light-color font-14 font-weight-400">
              {withAvatar ? (
                member?.url ? (
                  <Avatar
                    className="user-avatar-item  "
                    src={member.url}
                    sx={avatarStyles}
                  />
                ) : (
                  <Avatar
                    className="user-avatar-item"
                    sx={{
                      ...avatarStyles,
                      backgroundColor: StringToColor(
                        'filter.flowuuid.first_name.en',
                      ),
                    }}
                  >
                    {(member?.name || []).split(' ').map((word) => word[0]) || ''}
                  </Avatar>
                )
              ) : null}

              <span>{member?.name}</span>
            </div>
            {actionComponent ? actionComponent : null}
            {withExtraButton ? (
              <ButtonBase
                onClick={(e) => {
                  e.stopPropagation();
                  onExtraButtonClick(e);
                }}
                className="btns-icon theme-transparent  px-2 miw-0 "
              >
                {' '}
                <span className="fas fa-ellipsis-h gray-medium-light-color" />
              </ButtonBase>
            ) : null}
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingInlineEnd: '0px' }}>
          {bodyComponent}
        </AccordionDetails>
      </Accordion>
    );
  },
);
OnboardingAccordion.displayName = 'OnboardingAccordion';
OnboardingAccordion.propTypes = {
  member: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
  // defaultExpanded: PropTypes.bool.isRequired,

  bodyComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  onChange: PropTypes.func.isRequired,
  onExtraButtonClick: PropTypes.func.isRequired,
  withAvatar: PropTypes.bool.isRequired,
  withExtraButton: PropTypes.bool.isRequired,

  expanded: PropTypes.bool,
};

OnboardingAccordion.defaultProps = {
  bodyComponent: <></>,
  // defaultExpanded: false,

  onChange: () => {},
  onExtraButtonClick: () => {},
  expanded: false,
  withAvatar: true,
  withExtraButton: false,
};
