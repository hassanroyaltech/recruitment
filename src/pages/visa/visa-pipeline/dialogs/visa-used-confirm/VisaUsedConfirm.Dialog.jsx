import React, { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getErrorByName,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  GlobalSecondaryDateFormat,
} from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../setups/shared';
import i18next from 'i18next';
import moment from 'moment';

export const VisaUsedConfirmDialog = ({
  candidateItem,
  stageTitle,
  isOpen,
  isLoading,
  onIsLoadingChanged,
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
      border_number: null,
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
          border_number: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [state, t]);

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (onIsLoadingChanged) onIsLoadingChanged(true);
    if (onSave) onSave(state);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText={t(`${translationPath}visa-used-confirm-title-description`)}
      maxWidth="sm"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses="visa-used-confirm-dialog-wrapper"
      dialogContent={
        <div className="visa-used-confirm-dialog-content-wrapper px-3">
          <SharedInputControl
            labelValue="enter-border-number"
            placeholder="ex-border-number"
            errors={errors}
            stateKey="border_number"
            errorPath="border_number"
            editValue={state.border_number}
            isDisabled={isLoading}
            isSubmitted={isSubmitted}
            onValueChanged={(newValue) => {
              setState(newValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isFullWidth
          />
          <div className="description-text mb-3">
            <span>{t(`${translationPath}visa-used-confirm-description`)}</span>
          </div>
          <div className="description-text">
            {candidateItem.block_number && (
              <div>
                <span>{t(`${translationPath}block`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.block_number}
                </span>
              </div>
            )}
            {candidateItem.expiry_date && (
              <div>
                <span>{t(`${translationPath}block-expiry-date`)}</span>
                <span>:</span>
                <span className="px-1">
                  {moment(
                    candidateItem.expiry_date,
                    (candidateItem.is_hijri && GlobalSavingHijriDateFormat)
                      || GlobalSavingDateFormat,
                  )
                    .locale(i18next.language)
                    .format(GlobalSecondaryDateFormat)}
                </span>
              </div>
            )}
            {candidateItem.occupation && (
              <div>
                <span>{t(`${translationPath}occupation`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.occupation[i18next.language]
                    || candidateItem.occupation.en}
                </span>
              </div>
            )}
            {candidateItem.gender && (
              <div>
                <span>{t(`${translationPath}gender`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.gender[i18next.language] || candidateItem.gender.en}
                </span>
              </div>
            )}
            {candidateItem.religion && (
              <div>
                <span>{t(`${translationPath}religion`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.religion[i18next.language]
                    || candidateItem.religion.en}
                </span>
              </div>
            )}
            {candidateItem.nationality && (
              <div>
                <span>{t(`${translationPath}nationality`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.nationality[i18next.language]
                    || candidateItem.nationality.en}
                </span>
              </div>
            )}
            {candidateItem.issue_place && (
              <div>
                <span>{t(`${translationPath}arriving-from`)}</span>
                <span>:</span>
                <span className="c-black-light px-1">
                  {candidateItem.issue_place[i18next.language]
                    || candidateItem.issue_place.en}
                </span>
              </div>
            )}
          </div>
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      saveText={`${t(`${translationPath}submit-and-move-to`)} ${stageTitle}`}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

VisaUsedConfirmDialog.propTypes = {
  candidateItem: PropTypes.instanceOf(Object),
  stageTitle: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  onIsLoadingChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};
VisaUsedConfirmDialog.defaultProps = {
  candidateItem: undefined,
  stageTitle: 'Used',
  isLoading: undefined,
  isOpenChanged: undefined,
  onIsLoadingChanged: undefined,
  onSave: undefined,
};
