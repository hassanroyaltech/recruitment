import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import i18next from 'i18next';

export const BlockAccordionScore = ({ expanded, onChange, title, body }) => (
  <Accordion
    expanded={expanded}
    onChange={onChange}
    elevation={0}
    sx={{
      marginBlockEnd: '0',
      '&.MuiPaper-root.MuiPaper-elevation': {
        margin: '0px',
      },
      '& .MuiButtonBase-root.MuiAccordionSummary-root.Mui-expanded': {
        minHeight: '35px',
        marginBlock: '0',
        paddingInline: 0,
      },
      '&:before': { opacity: 0 },
    }}
  >
    <AccordionSummary
      aria-controls="accordion"
      sx={{
        '&': {
          minHeight: '35px',
          marginBlock: '0',
          paddingInline: 0,
        },
        '& .MuiAccordionSummary-content,& .MuiAccordionSummary-content.Mui-expanded':
          {
            marginBlock: '0 ',
          },
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
          transform: `${
            (i18next.dir() === 'rtl' && 'rotate( -90deg)') || 'rotate(90deg)'
          }`,
        },
      }}
      expandIcon={<span className={`fas fa-caret-right c-black`} />}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails sx={{ paddingInlineEnd: '0px' }}>{body}</AccordionDetails>
  </Accordion>
);
