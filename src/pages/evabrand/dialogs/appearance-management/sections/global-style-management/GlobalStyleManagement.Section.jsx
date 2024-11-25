import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { EvaBrandGlobalStyleEnum } from '../../../../../../enums';
import './GlobalStyleManagement.Style.scss';

export const GlobalStyleManagementSection = ({
  idRef,
  value,
  onValueChanged,
  isDisabled,
  labelValue,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [data] = useState(() => Object.values(EvaBrandGlobalStyleEnum));
  /**
   * @param styleProperty
   * @param styleValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if value include the style property or not
   */
  const getIsActiveStyle = useMemo(
    () => (styleProperty, styleValue) =>
      value && value[styleProperty] === styleValue,
    [value],
  );
  /**
   * @param styleProperty
   * @param styleValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove or add style property and send it to parent
   */
  const globalFontClickHandler = useCallback(
    (styleProperty, styleValue) => () => {
      const localValue = { ...(value || {}) };
      if (getIsActiveStyle(styleProperty, styleValue))
        delete localValue[styleProperty];
      else localValue[styleProperty] = styleValue;
      if (onValueChanged) onValueChanged(localValue);
    },
    [getIsActiveStyle, onValueChanged, value],
  );
  return (
    <div className="global-style-management-section-wrapper section-wrapper">
      {labelValue && (
        <label
          htmlFor={idRef}
          className={`label-wrapper${isDisabled ? ' disabled' : ''}`}
        >
          {t(`${translationPath}${labelValue}`)}
        </label>
      )}
      <div className="global-style-actions-wrapper">
        {data.map((item) => (
          <ButtonBase
            key={`${idRef}${item.key}`}
            className={`btns theme-shadow miw-32px${
              (getIsActiveStyle(item.styleProperty, item.styleValue)
                && ' is-active')
              || ''
            }${(item.isGroupStart && ' is-group-start') || ''}`}
            onClick={globalFontClickHandler(item.styleProperty, item.styleValue)}
          >
            <span className={item.icon} />
          </ButtonBase>
        ))}
      </div>
    </div>
  );
};

GlobalStyleManagementSection.propTypes = {
  idRef: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Object),
  onValueChanged: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  labelValue: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
GlobalStyleManagementSection.defaultProps = {
  value: null,
  isDisabled: false,
  translationPath: 'GlobalStyleManagementSection.',
};
