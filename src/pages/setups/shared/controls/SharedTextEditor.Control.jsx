/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TextEditorComponent } from '../../../../components';
import './SharedControls.Style.scss';

export const SharedTextEditorControl = memo(
  ({
    editValue,
    onValueChanged,
    stateKey,
    parentId,
    subParentId,
    subSubParentId,
    subSubParentIndex,
    parentIndex,
    subParentIndex,
    isDisabled,
    idRef,
    labelValue,
    placeholder,
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
    menubar,
    height,
    isRequired,
    rightToolbarExtend,
    leftToolbarExtend,
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
      <TextEditorComponent
        editorValue={editValue}
        idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
          subParentId || ''
        }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
          subParentIndex || 0
        }-${stateKey}`}
        placeholder={placeholder}
        labelValue={labelValue}
        tabIndex={tabIndex}
        isSubmitted={isSubmitted}
        isRequired={isRequired}
        isDisabled={isDisabled}
        helperText={
          (errors && errors[errorPath] && errors[errorPath].message) || undefined
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        height={height}
        menubar={menubar}
        rightToolbarExtend={rightToolbarExtend}
        leftToolbarExtend={leftToolbarExtend}
        onEditorDelayedChange={(content) => {
          if (onValueChanged)
            onValueChanged({
              parentId,
              parentIndex,
              subParentId,
              subParentIndex,
              subSubParentId,
              subSubParentIndex,
              id: stateKey,
              value: content || '',
            });
        }}
      />
    </div>
  ),
);

SharedTextEditorControl.displayName = 'SharedTextEditorControl';

SharedTextEditorControl.propTypes = {
  editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onValueChanged: PropTypes.func,
  stateKey: PropTypes.string.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  idRef: PropTypes.string,
  isDisabled: PropTypes.bool,
  labelValue: PropTypes.string,
  placeholder: PropTypes.string,
  errors: PropTypes.instanceOf(Object),
  errorPath: PropTypes.string,
  tabIndex: PropTypes.number,
  height: PropTypes.number,
  isSubmitted: PropTypes.bool,
  menubar: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  isRequired: PropTypes.bool,
  rightToolbarExtend: PropTypes.string,
  leftToolbarExtend: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
};

SharedTextEditorControl.defaultProps = {
  editValue: null,
  onValueChanged: undefined,
  errors: {},
  errorPath: undefined,
  isSubmitted: undefined,
  isDisabled: undefined,
  placeholder: undefined,
  labelValue: undefined,
  height: 155,
  menubar: false,
  tabIndex: undefined,
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
  isRequired: undefined,
  translationPath: '',
  wrapperClasses: undefined,
  idRef: 'SharedTextEditorControlRef',
};
