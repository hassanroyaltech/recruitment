/**
 * ----------------------------------------------------------------------------------
 * @title StandardButton.jsx
 * @author Yanal Kashou
 * ----------------------------------------------------------------------------------
 * This module contains a StandardButton class to be used instead of all Buttons.
 *
 * It allows us to standardize our buttons throughout the application.
 */

// Import react
import ButtonBase from '@mui/material/ButtonBase';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A Standard button with standard width and props.
 * This eliminates the need to specify a million different widths.
 * It receives the same props as a the reactstrap Button that we used to use
 *    - color
 *    - onClick
 *    - disabled
 *    - className (in case of css override)
 *
 * Remember: Special cases are not special enough.
 */
const StandardButton = (props) => {
  const { t } = useTranslation('Shared');
  return (
    <ButtonBase
      onClick={props.onClick}
      disabled={props.disabled}
      className={`btns theme-solid ${props.className ? props.className : ''}`}
    >
      {props.loading ? (
        <div>
          {props.keepLabelOnLoading && <span>{t(props.label)}</span>}
          <i className="fas fa-circle-notch fa-spin px-3" />
        </div>
      ) : (
        <span>{t(props.label)}</span>
      )}
    </ButtonBase>
  );
};
export { StandardButton };
