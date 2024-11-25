/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PhonesComponent } from '../../../../components';
import './SharedControls.Style.scss';

export const SharedPhoneControl = memo(
  ({
    editValue,
    onValueChanged,
    currentCountryCode,
    countryCodeKey,
    stateKey,
    parentId,
    subParentId,
    subSubParentId,
    subSubParentIndex,
    parentIndex,
    subParentIndex,
    isRequired,
    isDisabled,
    idRef,
    labelValue,
    placeholder,
    title,
    errors,
    errorPath,
    tabIndex,
    isSubmitted,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    parentTranslationPath,
    translationPath,
    wrapperClasses,
    excludeCountries,
  }) => (
    <div
      className={`shared-input-wrapper${
        (wrapperClasses && ` ${wrapperClasses}`) || ''
      }${(isFullWidth && ' is-full-width') || ''}${
        (isTwoThirdsWidth && ' is-two-thirds-width') || ''
      }${(isHalfWidth && ' is-half-width') || ''}${
        (isQuarterWidth && ' is-quarter-width') || ''
      } shared-control-wrapper`}
    >
      <PhonesComponent
        value={editValue}
        idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
          subParentId || ''
        }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
          subParentIndex || 0
        }-${stateKey}`}
        excludeCountries={excludeCountries}
        inputPlaceholder={placeholder}
        labelValue={labelValue}
        specialLabel={title}
        tabIndex={tabIndex}
        isRequired={isRequired}
        isSubmitted={isSubmitted}
        isDisabled={isDisabled}
        error={(errors && errors[errorPath] && errors[errorPath].error) || undefined}
        helperText={
          (errors && errors[errorPath] && errors[errorPath].message) || undefined
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onDelayedChanged={(newPhoneValue, { countryCode }) => {
          if (countryCodeKey && currentCountryCode !== countryCode)
            if (onValueChanged)
              onValueChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                subSubParentId,
                subSubParentIndex,
                id: countryCodeKey,
                value: countryCode || '',
              });

          if (onValueChanged)
            onValueChanged({
              parentId,
              parentIndex,
              subParentId,
              subParentIndex,
              subSubParentId,
              subSubParentIndex,
              id: stateKey,
              value: newPhoneValue || '',
            });
        }}
      />
    </div>
  ),
);

SharedPhoneControl.displayName = 'SharedPhoneControl';

SharedPhoneControl.propTypes = {
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onValueChanged: PropTypes.func,
  stateKey: PropTypes.string.isRequired,
  countryCodeKey: PropTypes.string,
  currentCountryCode: PropTypes.string,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  idRef: PropTypes.string,
  isDisabled: PropTypes.bool,
  labelValue: PropTypes.string,
  placeholder: PropTypes.string,
  title: PropTypes.string,
  errors: PropTypes.instanceOf(Object),
  errorPath: PropTypes.string,
  tabIndex: PropTypes.number,
  isSubmitted: PropTypes.bool,
  isRequired: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  excludeCountries: PropTypes.arrayOf(PropTypes.string),
};

SharedPhoneControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  errors: {},
  errorPath: undefined,
  isSubmitted: undefined,
  isRequired: undefined,
  isDisabled: undefined,
  placeholder: undefined,
  labelValue: undefined,
  title: undefined,
  tabIndex: undefined,
  countryCodeKey: undefined,
  currentCountryCode: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  subParentId: undefined,
  parentId: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  isQuarterWidth: undefined,
  translationPath: '',
  wrapperClasses: undefined,
  excludeCountries: undefined,
  idRef: 'SharedPhoneControlRef',
};
