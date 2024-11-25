import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName } from '../../../../helpers';
import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
  SharedUploaderControl,
} from '../../../setups/shared';
import { UploaderPageEnum } from '../../../../enums';
import { VisaMediaUploader } from '../../../../services';

export const VisaAttachmentsDialog = ({
  activeItem,
  comment,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [state, setState] = useReducer(
    SetupsReducer,
    {
      attachment: null,
      comment: null,
    },
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          attachment: yup
            .object()
            .nullable()
            .required(
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}file`,
              )}`,
            ),
          comment: yup.string().nullable(),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t, translationPath]);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the visa uploaded attachments
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (onSave) onSave(state);
    if (isOpenChanged) isOpenChanged();
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the data on edit
   */
  const getEditInit = useCallback(async () => {
    setState({
      id: 'edit',
      value: {
        attachment: { ...activeItem },
        comment,
      },
    });
  }, [activeItem, comment]);

  const getIsSavingDisabled = useMemo(
    () => () => state.attachment && state.attachment.status !== 'success',
    [state.attachment],
  );

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText="upload-a-file"
      maxWidth="md"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses="visa-attachments-dialog-wrapper"
      dialogContent={
        <div className="visa-attachments-dialog-content-wrapper px-3">
          <div className="description-text mb-3">
            {t(`${translationPath}visa-attachments-description`)}
          </div>
          <SharedUploaderControl
            editValue={(state.attachment && [{ ...state.attachment }]) || []}
            onValueChanged={(uploaded) => {
              console.log({ uploaded });
              const uploadedValue
                = (uploaded.value.length > 0 && uploaded.value[0]) || null;
              onStateChanged({
                id: 'attachment',
                value: uploadedValue,
              });
            }}
            stateKey="attachment"
            isSubmitted={isSubmitted}
            errors={errors}
            sharedClassesWrapper="px-0"
            errorPath="attachment"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            customAPIUploader={VisaMediaUploader}
            uploaderPage={UploaderPageEnum.VisaAttachments}
          />
          <SharedInputControl
            isFullWidth
            labelValue="add-a-comment"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="comment"
            errorPath="comment"
            placeholder="comment-description"
            editValue={state.comment}
            wrapperClasses="px-0"
            multiline
            rows={4}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      saveIsDisabled={getIsSavingDisabled()}
      isOpen={isOpen}
      saveType="button"
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

VisaAttachmentsDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object), // file with all of its details
  comment: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

VisaAttachmentsDialog.defaultProps = {
  activeItem: null,
  comment: null,
};
