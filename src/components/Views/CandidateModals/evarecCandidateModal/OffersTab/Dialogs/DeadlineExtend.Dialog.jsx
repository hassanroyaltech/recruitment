import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../components';
import '../Offers.Style.scss';
import moment from 'moment/moment';
import i18next from 'i18next';
import {
  getErrorByName,
  GlobalDateFormat, GlobalSavingDateFormat,
  showError,
  showSuccess
} from '../../../../../../helpers';
import DatePickerComponent from '../../../../../Datepicker/DatePicker.Component';
import { object, string } from 'yup';
import { ExtendDeadlineDate } from '../../../../../../services';

export const DeadlineExtendDialog = ({
  isOpen,
  onSave,
  onClose,
  form_type = 'offer',
  form_uuid,
  currentDeadlineDate,
  parentTranslationPath,
  translationPath = '',
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({
    deadline_date: moment(currentDeadlineDate, "YYYY-MM-DD").locale('en').format(GlobalSavingDateFormat),
    form_type,
    form_uuid,
  });
  console.log({
    currentDeadlineDate,
    form_type,
    form_uuid,
    parentTranslationPath,
    translationPath,
    state,
  })

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: object().shape({
          deadline_date: string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
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
    setIsLoading(true);
    const response = await ExtendDeadlineDate(state);
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}deadline-extended-successfully`));
      if (onSave) onSave();
      if (onClose) onClose();
    } else showError(t(`${translationPath}deadline-extend-failed`), response);
  };

  // this to call errors' updater when state changed
  useEffect(() => {
    void getErrors();
  }, [getErrors, state]);
  return (
    <DialogComponent
      maxWidth="sm"
      titleText="extend-deadline-date"
      contentClasses="px-0"
      dialogContent={
        <div className="mx-4 mb-4">
          <DatePickerComponent
            isFullWidth
            labelValue="deadline-date"
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            value={state.deadline_date || ''}
            errors={errors}
            isSubmitted={isSubmitted}
            displayFormat={GlobalDateFormat}
            errorPath="deadline_date"
            stateKey="deadline_date"
            disablePast
            onDelayedChange={({ value }) => {
              setState((prevState) => ({
                ...prevState,
                deadline_date: value,
              }));
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      wrapperClasses="deadline-extend-dialog-wrapper"
      isSaving={isLoading}
      onSubmit={saveHandler}
      isOpen={isOpen}
      onCloseClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

DeadlineExtendDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentDeadlineDate: PropTypes.string.isRequired,
  form_uuid: PropTypes.string.isRequired,
  form_type: PropTypes.oneOf(['form', 'offer']),
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
