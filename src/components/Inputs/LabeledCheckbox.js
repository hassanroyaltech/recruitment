import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const translationPath = 'Components.';
const parentTranslationPath = 'RecruiterPreferences';

const LabeledCheckbox = ({ id, ats, bothActive, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <>
      {ats ? (
        <span className="switcherATS switcherATS-1">
          <input
            {...props}
            type="checkbox"
            id={id}
            className={bothActive && 'input-both-active'}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={id} />
        </span>
      ) : (
        <span className="switcher switcher-1">
          <div
            className={`input-switcher-active${
              (props.checked && ' is-checked') || ''
            }`}
          >
            {t(`${translationPath}${props.activeLabel}`)}
          </div>
          <input
            {...props}
            type="checkbox"
            id={id}
            className={bothActive && 'input-both-active'}
          />
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor={id} className={(bothActive && 'both') || ''} />
          <div
            className={
              bothActive
                ? 'input-switcher-both-active'
                : props.isInternalOnly
                  ? 'input-switcher-inactive-active'
                  : 'input-switcher-inactive'
            }
          >
            {t(`${translationPath}${props.inactiveLabel}`)}
          </div>
        </span>
      )}
    </>
  );
};
export default LabeledCheckbox;

LabeledCheckbox.protoTypes = {
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
};
LabeledCheckbox.defaultProps = {
  activeLabel: 'active',
  inactiveLabel: 'inactive',
};
