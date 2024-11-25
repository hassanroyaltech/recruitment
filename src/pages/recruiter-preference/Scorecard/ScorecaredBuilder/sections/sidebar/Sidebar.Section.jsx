import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import sections from '../../data/SectionsData';
import blocksData from '../../data/BlocksData';
import DraggableCards from '../../../../../form-builder-v2/features/Dragndrop/DraggableCards';
import Hint from '../../components/BulbHint/Hint.Component';

export const SidebarSection = ({
  isOpenSideMenu,
  headerHeight,
  parentTranslationPath,
  SectionsData,
  BlocksData,
  isDesicionExist,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div
      className={`scorecard-sidebar-wrapper${
        (isOpenSideMenu && ' side-is-open') || ''
      }`}
      style={{
        height: `calc(100vh - ${headerHeight}px)`,
        flexWrap: 'nowrap',
        overflowY: 'auto',
      }}
    >
      <div className="scorecard-cards-panel">
        <span className="px-3 d-block my-2 c-black">{t('sections')}</span>
        <DraggableCards
          type="section"
          items={SectionsData}
          sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}
        />
      </div>
      <div className="d-block separator-sidebar" />
      <div className="scorecard-cards-panel">
        <span className="px-3 d-block mt-3 mb-2 c-black">{t('blocks')}</span>
        <DraggableCards
          type="input"
          isDesicionExist={isDesicionExist}
          fromScorecard={true}
          items={BlocksData}
          sx={{ padding: (theme) => theme.spacing(1.5, 4, 4, 5) }}
        />
      </div>
      <div className="mx-3 mt-2">
        <Hint title={t('builder-sidebar-hint')} />
      </div>
    </div>
  );
};

SidebarSection.propTypes = {
  // templateData: PropTypes.instanceOf(Object).isRequired,
  // isOpenSideMenu: PropTypes.bool.isRequired,
  // setTemplateData: PropTypes.func.isRequired,
};
