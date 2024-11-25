import React, { useCallback, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getErrorByName,
  GlobalDateFormat,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  GlobalSecondaryDateFormat,
} from '../../../../helpers';
import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../setups/shared';
import i18next from 'i18next';
import moment from 'moment-hijri';
import DatePickerComponent from '../../../../components/Datepicker/DatePicker.Component';

export const VisaCountsManagementDialog = ({
  getMaxExpiryDate,
  selectedVisa,
  available_visas,
  expiry_date,
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
      border_number: null,
      expiry_date,
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
          count: yup
            .number()
            .nullable()
            .min(1, `${t('Shared:this-field-must-be-more-than-or-equal')} ${1}`)
            .required(t('Shared:this-field-is-required')),
          expiry_date: yup
            .string()
            .nullable()
            .test(
              'isValidDate',
              `${t('Shared:this-field-must-be-less-than-or-equal')} ${moment(
                getMaxExpiryDate().expiry_date,
                (getMaxExpiryDate().is_hijri && GlobalSavingHijriDateFormat)
                  || GlobalSavingDateFormat,
              )
                .locale(i18next.language)
                .format(GlobalSecondaryDateFormat)}`,
              (value) =>
                !getMaxExpiryDate
                || (value
                  && moment(
                    getMaxExpiryDate().expiry_date,
                    (getMaxExpiryDate().is_hijri && GlobalSavingHijriDateFormat)
                      || GlobalSavingDateFormat,
                  )
                    .locale('en')
                    .isSameOrAfter(value)),
            )
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [getMaxExpiryDate, state, t]);

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the stages & pipeline template
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (onSave) onSave(state);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      isWithFullScreen
      titleText={t(`${translationPath}select-number-of-visas`)}
      maxWidth="sm"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses="visa-counts-management-dialog-wrapper"
      dialogContent={
        <div className="visa-counts-management-dialog-content-wrapper px-3">
          <div className="description-text mb-3">
            <div>
              <span>{t(`${translationPath}block`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">{selectedVisa.block_number}</span>
            </div>
            <div>
              <span>{t(`${translationPath}block-expiry-date`)}</span>
              <span>:</span>
              <span className="px-1">
                {moment(
                  selectedVisa.expiry_date,
                  (selectedVisa.is_hijri && GlobalSavingHijriDateFormat)
                    || GlobalSavingDateFormat,
                )
                  .locale(i18next.language)
                  .format(GlobalSecondaryDateFormat)}
              </span>
            </div>
            <div>
              <span>{t(`${translationPath}occupation`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">
                {(selectedVisa.occupation
                  && (selectedVisa.occupation[i18next.language]
                    || selectedVisa.occupation.en))
                  || 'N/A'}
              </span>
            </div>
            <div>
              <span>{t(`${translationPath}gender`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">
                {(selectedVisa.gender
                  && (selectedVisa.gender[i18next.language]
                    || selectedVisa.gender.en))
                  || 'N/A'}
              </span>
            </div>
            <div>
              <span>{t(`${translationPath}religion`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">
                {(selectedVisa.religion
                  && (selectedVisa.religion[i18next.language]
                    || selectedVisa.religion.en))
                  || 'N/A'}
              </span>
            </div>
            <div>
              <span>{t(`${translationPath}nationality`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">
                {(selectedVisa.nationality
                  && (selectedVisa.nationality[i18next.language]
                    || selectedVisa.nationality.en))
                  || 'N/A'}
              </span>
            </div>
            <div>
              <span>{t(`${translationPath}arriving-from`)}</span>
              <span>:</span>
              <span className="c-black-light px-1">
                {(selectedVisa.issue_place
                  && (selectedVisa.issue_place[i18next.language]
                    || selectedVisa.issue_place.en))
                  || 'N/A'}
              </span>
            </div>
          </div>
          <SharedInputControl
            inlineLabelIcon="fas fa-hashtag"
            labelValue="number-of-visas"
            placeholder="number-of-visas"
            errors={errors}
            stateKey="count"
            errorPath="count"
            editValue={state.count}
            type="number"
            min={0}
            max={available_visas}
            isSubmitted={isSubmitted}
            onValueChanged={(newValue) => {
              setState(newValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isFullWidth
          />
          <DatePickerComponent
            isFullWidth
            labelValue="expiry-date"
            inputPlaceholder={`${t('Shared:eg')} ${moment()
              .locale(i18next.language)
              .format(GlobalDateFormat)}`}
            value={state.expiry_date || ''}
            errors={errors}
            isSubmitted={isSubmitted}
            displayFormat={GlobalDateFormat}
            disableMaskedInput
            errorPath="expiry_date"
            stateKey="expiry_date"
            minDate={moment().add(1, 'days').locale('en')}
            maxDate={
              (getMaxExpiryDate
                && moment(
                  getMaxExpiryDate().expiry_date,
                  (getMaxExpiryDate().is_hijri && GlobalSavingHijriDateFormat)
                    || GlobalSavingDateFormat,
                ).locale('en'))
              || undefined
            }
            onDelayedChange={(newValue) => {
              setState(newValue);
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      isOpen={isOpen}
      saveText="continue"
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

VisaCountsManagementDialog.propTypes = {
  getMaxExpiryDate: PropTypes.func,
  selectedVisa: PropTypes.instanceOf(Object),
  available_visas: PropTypes.number.isRequired,
  expiry_date: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};
