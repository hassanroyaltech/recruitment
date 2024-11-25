import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import { DynamicService } from 'services';

export const ConfirmDeleteDialog = memo(
  ({
    activeItem,
    isOpen,
    isOpenChanged,
    onSave,
    successMessage,
    errorMessage,
    descriptionMessage,
    extraDescription,
    deleteApi,
    apiProps,
    activeItemKey,
    apiDeleteKey,
    parentTranslationPath,
    translationPath,
    isConfirmOnly,
    saveType,
    isDynamicService,
    lookup,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isLoading, setIsLoading] = useState(false);
    const deleteHandler = async (event) => {
      event.preventDefault();
      if (isConfirmOnly) {
        if (onSave) onSave();
        isOpenChanged();
        return;
      }
      setIsLoading(true);
      const payload
        = apiProps !== undefined
          ? apiProps
          : (apiDeleteKey && {
            [apiDeleteKey]: [activeItem[activeItemKey]],
          })
            || undefined;
      const res = await (isDynamicService ? DynamicService : deleteApi)(
        isDynamicService
          ? {
            params: payload,
            method: 'delete',
            path: lookup.path,
          }
          : payload,
      );
      if (res && (res.status === 200 || res.status === 201 || res.status === 202)) {
        if (onSave) onSave();
        showSuccess(t(`${translationPath}${successMessage}`));
      } else showError(t(`${translationPath}${errorMessage}`), res);
      setIsLoading(false);
      isOpenChanged();
    };
    return (
      <DialogComponent
        isConfirm
        dialogContent={
          <div className="d-flex-column-center">
            <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
            {descriptionMessage && (
              <span>{t(`${translationPath}${descriptionMessage}`)}</span>
            )}
            {extraDescription && (
              <span className="d-flex w-100">{extraDescription}</span>
            )}
          </div>
        }
        isOpen={isOpen}
        saveType={saveType}
        onSubmit={
          ((!saveType || saveType === 'submit') && deleteHandler) || undefined
        }
        onSaveClicked={(saveType === 'button' && deleteHandler) || undefined}
        isSaving={isLoading}
        onCloseClicked={isOpenChanged}
        onCancelClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    );
  },
);

ConfirmDeleteDialog.displayName = 'ConfirmDeleteDialog';

ConfirmDeleteDialog.propTypes = {
  descriptionMessage: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  extraDescription: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Object),
  ]),
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  deleteApi: PropTypes.func,
  apiProps: PropTypes.oneOfType([
    PropTypes.instanceOf(Object),
    PropTypes.instanceOf(Array),
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  apiDeleteKey: PropTypes.string,
  activeItemKey: PropTypes.string,
  isConfirmOnly: PropTypes.bool,
  saveType: PropTypes.oneOf(['button', 'submit']),
  translationPath: PropTypes.string,
  isDynamicService: PropTypes.bool,
  lookup: PropTypes.shape({
    path: PropTypes.string,
  }),
};
ConfirmDeleteDialog.defaultProps = {
  activeItem: undefined,
  extraDescription: undefined,
  successMessage: undefined,
  errorMessage: undefined,
  deleteApi: undefined,
  apiProps: undefined,
  activeItemKey: undefined,
  apiDeleteKey: undefined,
  saveType: undefined,
  isConfirmOnly: false,
  translationPath: 'ConfirmDeleteDialog.',
  isDynamicService: undefined,
  lookup: undefined,
};
