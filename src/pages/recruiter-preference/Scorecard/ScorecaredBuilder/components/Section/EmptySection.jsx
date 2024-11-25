import React from 'react';
import { Typography, Paper, ButtonBase } from '@mui/material';
import SectionsWrapper from './SectionsWrapper';
import { PlusIcon } from '../../../../../../assets/icons';
import { useTranslation } from 'react-i18next';

export default function EmptySection({
  parentTranslationPath,
  handleAddBlockFromEmpty,
}) {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <SectionsWrapper>
      <Paper
        sx={{ padding: '24px', minWidth: 300, borderRadius: '4px' }}
        square={true}
      >
        <Typography variant="body13content">
          {t('start-adding-data-section')}
        </Typography>
        <Typography variant="body13content">{t('click-on-add-section')}</Typography>
        <br />
        <ButtonBase
          className="btns theme-transparent mt-2 mx-0"
          onClick={() => {
            handleAddBlockFromEmpty();
          }}
        >
          <span className="pr-2">
            {' '}
            <PlusIcon />{' '}
          </span>{' '}
          {t('add-block')}
        </ButtonBase>
      </Paper>
    </SectionsWrapper>
  );
}
