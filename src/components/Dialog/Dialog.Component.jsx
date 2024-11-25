import React, { forwardRef, memo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonBase,
  Slide,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Dialog.Style.scss';
import { LoaderComponent } from '../Loader/Loader.Component';

const Transition = forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));
Transition.displayName = 'DialogTransitionHandlerComponent';
export const DialogComponent = memo(
  ({
    isOpen,
    wrapperClasses,
    titleClasses,
    contentClasses,
    footerClasses,
    closeClasses,
    nextPreviousWrapperClasses,
    previousClasses,
    nextClasses,
    saveCancelWrapperClasses,
    cancelWrapperClasses,
    cancelClasses,
    saveWrapperClasses,
    saveClasses,
    titleTextClasses,
    titleText,
    saveText,
    cancelText,
    closeIsDisabled,
    previousIsDisabled,
    nextIsDisabled,
    cancelIsDisabled,
    saveIsDisabled,
    dialogTitle,
    titleIcon,
    dialogContent,
    dialogActions,
    onCloseClicked,
    onNextClicked,
    onPreviousClicked,
    onCancelClicked,
    onSaveClicked,
    onSubmit,
    translationPath,
    parentTranslationPath,
    translationPathShared,
    maxWidth,
    defaultMaxWidth,
    defaultConfirmMaxWidth,
    saveType,
    nextType,
    cancelType,
    previousType,
    isSaving,
    isConfirm,
    isWithoutConfirmClasses,
    isEdit,
    isOldTheme,
    minHeight,
    scroll,
    dialogFormId,
    dialogPaperProps,
    dialogPaperStyle,
    isFixedHeight,
    isWithoutTitle,
    saveAfterIcon,
    isFullScreen,
    isWithFullScreen,
    onIsFullScreenChanged,
    fullScreenClasses,
    isDisabledFullScreen,
    contentFooterClasses,
    dialogStyle,
    zIndex,
    contentOverflowY,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [localIsFullScreen, setLocalIsFullScreen] = useState(false);

    const onFullScreenClicked = () => {
      if (isFullScreen === undefined) setLocalIsFullScreen((item) => !item);
      else if (onIsFullScreenChanged) onIsFullScreenChanged(!isFullScreen);
    };

    return (
      <Dialog
        className={`dialog-wrapper ${wrapperClasses}${
          (isOldTheme && ' is-old-theme') || ''
        }`}
        fullScreen={isFullScreen || localIsFullScreen}
        onClose={onCloseClicked || onCancelClicked}
        open={isOpen}
        scroll={scroll}
        TransitionComponent={Transition}
        transitionDuration={800}
        style={
          dialogStyle
          || (zIndex && {
            zIndex,
          })
        }
        PaperProps={
          dialogPaperProps || {
            style: dialogPaperStyle,
          }
        }
        maxWidth={
          (isConfirm && !maxWidth && defaultConfirmMaxWidth)
          || maxWidth
          || defaultMaxWidth
        }
      >
        <form
          className="w-100 form-content-wrapper"
          noValidate
          id={dialogFormId}
          onSubmit={onSubmit}
        >
          <DialogTitle
            className={`dialog-title-wrapper ${titleClasses} ${
              (dialogTitle && ' with-custom-title') || ''
            }`}
          >
            {!isWithoutTitle ? (
              <>
                {(!dialogTitle && (isConfirm || titleText) && (
                  <span>
                    {titleIcon && (
                      <span className={`dialog-title-icon ${titleIcon}`} />
                    )}
                    <span
                      className={`dialog-title-text${
                        (titleTextClasses && ` ${titleTextClasses}`) || ''
                      }${(titleIcon && ' px-2') || ''}`}
                    >
                      {(isConfirm
                        && !titleText
                        && t(`${translationPathShared}confirm-message`))
                        || t(`${translationPath}${titleText}`)}
                    </span>
                  </span>
                ))
                  || dialogTitle}
              </>
            ) : (
              <span className="dialog-title-text" />
            )}
            {(onIsFullScreenChanged
              || isWithFullScreen
              || isFullScreen !== undefined
              || onCloseClicked) && (
              <div className="d-inline-flex">
                {(onIsFullScreenChanged
                  || isWithFullScreen
                  || isFullScreen !== undefined) && (
                  <ButtonBase
                    className={`full-screen-btn-wrapper${
                      ` ${fullScreenClasses}` || ''
                    }`}
                    onClick={onFullScreenClicked}
                    disabled={isDisabledFullScreen}
                  >
                    <span
                      className={`fas fa-${
                        ((isFullScreen || localIsFullScreen) && 'compress')
                        || 'expand'
                      }-alt`}
                    />
                  </ButtonBase>
                )}
                {onCloseClicked && (
                  <ButtonBase
                    className={`close-btn-wrapper ${closeClasses}`}
                    onClick={onCloseClicked}
                    disabled={closeIsDisabled}
                  >
                    <span className="fas fa-times" />
                  </ButtonBase>
                )}
              </div>
            )}
          </DialogTitle>
          <div
            className={`content-and-footer-wrapper${
              (contentFooterClasses && ` ${contentFooterClasses}`) || ''
            }${(dialogTitle && ' with-custom-title') || ''}`}
          >
            <DialogContent
              style={{
                height: minHeight,
                minHeight: (isFixedHeight && '74.5vh') || undefined,
                overflowY: contentOverflowY,
              }}
              className={`dialog-content-wrapper ${contentClasses}`}
            >
              {dialogContent || undefined}
            </DialogContent>
            <DialogActions className={`dialog-footer-wrapper ${footerClasses}`}>
              {dialogActions
                || ((onNextClicked || onPreviousClicked) && (
                  <div
                    className={`next-previous-wrapper ${nextPreviousWrapperClasses}`}
                  >
                    {(onPreviousClicked || previousType === 'submit') && (
                      <ButtonBase
                        className={previousClasses}
                        type={previousType}
                        onClick={onPreviousClicked}
                        disabled={previousIsDisabled}
                      >
                        <span>{t(`${translationPathShared}back`)}</span>
                      </ButtonBase>
                    )}
                    {(onNextClicked || nextType === 'submit') && (
                      <ButtonBase
                        className={nextClasses}
                        type={nextType}
                        onClick={onNextClicked}
                        disabled={nextIsDisabled}
                      >
                        <span>{t(`${translationPathShared}next`)}</span>
                      </ButtonBase>
                    )}
                  </div>
                ))}
              {!dialogActions && (onCancelClicked || onSaveClicked || onSubmit) && (
                <div className={`save-cancel-wrapper ${saveCancelWrapperClasses}`}>
                  {(onCancelClicked || cancelType === 'submit') && (
                    <div className={`cancel-wrapper ${cancelWrapperClasses}`}>
                      <ButtonBase
                        className={`cancel-btn-wrapper ${cancelClasses}`}
                        type={cancelType}
                        onClick={onCancelClicked}
                        disabled={cancelIsDisabled}
                      >
                        <span>
                          {t(
                            `${
                              (cancelText === 'cancel' && translationPathShared)
                              || translationPath
                            }${cancelText}`,
                          )}
                        </span>
                      </ButtonBase>
                    </div>
                  )}
                  {(onSaveClicked || saveType === 'submit') && (
                    <div className={`save-wrapper ${saveWrapperClasses}`}>
                      <ButtonBase
                        className={`save-btn-wrapper ${saveClasses}${
                          (isConfirm && !isWithoutConfirmClasses && ' bg-danger')
                          || ''
                        }${(isEdit && ' bg-secondary') || ''}`}
                        type={saveType}
                        onClick={onSaveClicked}
                        disabled={saveIsDisabled || isSaving}
                      >
                        <LoaderComponent
                          isLoading={isSaving}
                          isSkeleton
                          wrapperClasses="position-absolute w-100 h-100"
                          skeletonStyle={{ width: '100%', height: '100%' }}
                        />
                        <span>
                          {(isConfirm
                            && saveText === 'save'
                            && t(`${translationPathShared}confirm`))
                            || t(
                              `${
                                (saveText === 'save' && translationPathShared)
                                || translationPath
                              }${saveText}`,
                            )}
                        </span>
                        {saveAfterIcon && (
                          <span className={`px-2 ${saveAfterIcon}`} />
                        )}
                      </ButtonBase>
                    </div>
                  )}
                </div>
              )}
            </DialogActions>
          </div>
        </form>
      </Dialog>
    );
  },
);

DialogComponent.displayName = 'DialogComponent';

DialogComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  wrapperClasses: PropTypes.string,
  titleClasses: PropTypes.string,
  titleIcon: PropTypes.string,
  contentClasses: PropTypes.string,
  footerClasses: PropTypes.string,
  closeClasses: PropTypes.string,
  nextPreviousWrapperClasses: PropTypes.string,
  previousClasses: PropTypes.string,
  nextClasses: PropTypes.string,
  cancelWrapperClasses: PropTypes.string,
  cancelClasses: PropTypes.string,
  saveWrapperClasses: PropTypes.string,
  saveCancelWrapperClasses: PropTypes.string,
  saveClasses: PropTypes.string,
  titleTextClasses: PropTypes.string,
  titleText: PropTypes.string,
  saveText: PropTypes.string,
  cancelText: PropTypes.string,
  closeIsDisabled: PropTypes.bool,
  previousIsDisabled: PropTypes.bool,
  nextIsDisabled: PropTypes.bool,
  cancelIsDisabled: PropTypes.bool,
  saveIsDisabled: PropTypes.bool,
  dialogTitle: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  dialogContent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  dialogActions: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  onCloseClicked: PropTypes.func,
  onNextClicked: PropTypes.func,
  onPreviousClicked: PropTypes.func,
  onCancelClicked: PropTypes.func,
  onSaveClicked: PropTypes.func,
  onSubmit: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  defaultMaxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  defaultConfirmMaxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  saveType: PropTypes.string,
  cancelType: PropTypes.string,
  nextType: PropTypes.string,
  previousType: PropTypes.string,
  isSaving: PropTypes.bool,
  isConfirm: PropTypes.bool,
  isWithoutConfirmClasses: PropTypes.bool,
  isEdit: PropTypes.bool,
  isOldTheme: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  isWithFullScreen: PropTypes.bool,
  onIsFullScreenChanged: PropTypes.func,
  fullScreenClasses: PropTypes.string,
  isDisabledFullScreen: PropTypes.bool,
  scroll: PropTypes.oneOf(['paper', 'body']),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dialogFormId: PropTypes.string,
  saveAfterIcon: PropTypes.string,
  dialogPaperProps: PropTypes.instanceOf(Object),
  dialogPaperStyle: PropTypes.instanceOf(Object),
  dialogStyle: PropTypes.instanceOf(Object),
  zIndex: PropTypes.number,
  isFixedHeight: PropTypes.bool,
  isWithoutTitle: PropTypes.bool,
  contentFooterClasses: PropTypes.string,
  contentOverflowY: PropTypes.string,
};
DialogComponent.defaultProps = {
  wrapperClasses: '',
  titleClasses: '',
  contentClasses: '',
  footerClasses: '',
  closeClasses: 'btns-icon theme-transparent mx-2 mb-2',
  nextPreviousWrapperClasses: '',
  saveCancelWrapperClasses: '',
  previousClasses: 'btns theme-outline',
  nextClasses: 'btns theme-solid bg-secondary',
  cancelWrapperClasses: '',
  cancelClasses: 'btns theme-transparent',
  saveWrapperClasses: '',
  saveClasses: 'btns theme-solid',
  titleTextClasses: '',
  titleText: undefined,
  saveText: 'save',
  cancelText: 'cancel',
  closeIsDisabled: false,
  previousIsDisabled: false,
  nextIsDisabled: false,
  cancelIsDisabled: false,
  saveIsDisabled: false,
  dialogTitle: undefined,
  titleIcon: undefined,
  dialogContent: undefined,
  dialogActions: undefined,
  onCloseClicked: undefined,
  onNextClicked: undefined,
  onPreviousClicked: undefined,
  onCancelClicked: undefined,
  onSaveClicked: undefined,
  onSubmit: undefined,
  translationPath: '',
  parentTranslationPath: '',
  translationPathShared: 'Shared:',
  maxWidth: undefined,
  defaultMaxWidth: 'md',
  defaultConfirmMaxWidth: 'xs',
  saveType: 'submit',
  cancelType: undefined,
  nextType: undefined,
  previousType: undefined,
  isSaving: false,
  isConfirm: false,
  isWithoutConfirmClasses: false,
  isEdit: false,
  isOldTheme: false,
  minHeight: undefined,
  scroll: 'paper',
  dialogFormId: 'sharedDialogFormId',
  dialogPaperProps: undefined,
  dialogPaperStyle: undefined,
  isFixedHeight: false,
  isWithoutTitle: undefined,
  saveAfterIcon: undefined,
  isFullScreen: undefined,
  isWithFullScreen: false,
  onIsFullScreenChanged: undefined,
  fullScreenClasses: 'btns-icon theme-transparent mx-2 mb-2',
  isDisabledFullScreen: undefined,
  contentFooterClasses: undefined,
  dialogStyle: undefined,
  zIndex: undefined,
  contentOverflowY: undefined,
};
