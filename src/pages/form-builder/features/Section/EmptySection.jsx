import React from 'react';
import { Typography, Paper } from '@mui/material';
import SectionsWrapper from './SectionsWrapper';
import { useTranslation } from 'react-i18next';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

export default function EmptySection() {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <SectionsWrapper>
      <Paper sx={{ padding: '24px', minWidth: 300 }}>
        <Typography variant="body13content">
          {t(`${translationPath}empty-section`)}{' '}
        </Typography>
        <Typography variant="body13content">
          {t(`${translationPath}empty-section-des`)}
        </Typography>
      </Paper>
    </SectionsWrapper>
  );
}
