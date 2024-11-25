/* eslint-disable implicit-arrow-linebreak */
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { LoadableImageComponant } from '../../../../../components';
import { EvaBrandThemesEnum } from '../../../../../enums';
import './Layouts.Style.scss';
// shared component to display all available themes
export const LayoutsTab = ({
  state,
  onStateChanged,
  parentId,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [currentSectionThemes] = useState(() =>
    Object.values(EvaBrandThemesEnum).filter((item) =>
      item.supportedSections.includes(state.type),
    ),
  );
  // method to send selected theme to parent on click only
  /*
    @param themeKey
  */
  const onThemeClicked = useCallback(
    (themeKey) => () => {
      if (onStateChanged) onStateChanged({ id: parentId, value: themeKey });
    },
    [onStateChanged, parentId],
  );

  return (
    <div className="layouts-tab-wrapper">
      {currentSectionThemes.map((item, index) => (
        <ButtonBase
          key={`evaBrandThemesKey${index + 1}`}
          className={`layout-btn${
            (state[parentId] === item.key && ' selected-theme') || ''
          }`}
          onClick={
            (state[parentId] !== item.key && onThemeClicked(item.key)) || undefined
          }
        >
          <LoadableImageComponant
            classes="theme-img"
            src={item.themeImg}
            alt={t('theme-image')}
          />
        </ButtonBase>
      ))}
    </div>
  );
};

LayoutsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func,
  parentId: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
};
LayoutsTab.defaultProps = {
  onStateChanged: undefined,
  parentId: 'layout',
};
