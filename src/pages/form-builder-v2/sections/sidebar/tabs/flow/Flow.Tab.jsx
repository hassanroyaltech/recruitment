import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

export default function Customizing() {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <Box
      sx={{
        p: 5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="caption11">{t(`${translationPath}workflow`)}</Typography>
      {/*<Box display="flex" alignItems="center" sx={{ mt:8 }}>*/}
      {/*  <Switch />*/}
      {/*  <Typography sx={{ ml: 2.5 }}>*/}
      {/*    Turn on workflow*/}
      {/*  </Typography>*/}
      {/*</Box>*/}
      <Timeline>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{ backgroundColor: (theme) => theme.palette.dark.$20 }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography>{t(`${translationPath}draft-stage`)}</Typography>
            <Typography>{t(`${translationPath}draft-stage-des`)}</Typography>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{ backgroundColor: (theme) => theme.palette.secondary.$80 }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            {t(`${translationPath}submit-the-approval`)}
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{ backgroundColor: (theme) => theme.palette.secondary.$80 }}
            />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{t(`${translationPath}document-sent`)}</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot
              sx={{ backgroundColor: (theme) => theme.palette.secondary.$80 }}
            />
          </TimelineSeparator>
          <TimelineContent>
            {t(`${translationPath}signed-or-expired`)}
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Box>
  );
}
