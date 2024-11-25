// Import React Components
import React from 'react';
import { SharedInputControl } from 'pages/setups/shared';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { numbersExpression } from 'utils';
import FilesComponent from '../component/Files.Component';
import moment from 'moment';
import { GlobalSavingDateFormat } from '../../../helpers';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';

const translationPath = 'PersonalDetails.';

const PersonalDetailsSection = ({
  parentTranslationPath,
  state,
  errors,
  isSubmitted,
  onStateChanged,
  isLoading,
  isView,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="section-item-wrapper w-100">
      <div className="section-item-title">
        {t(`${translationPath}personal-details`)}
      </div>
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="firstname"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="firstname"
          errorPath="personal.firstname"
          onValueChanged={onStateChanged}
          editValue={state.personal?.first_name}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="lastname"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="lastname"
          errorPath="personal.lastname"
          onValueChanged={onStateChanged}
          editValue={state.personal?.last_name}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="passport-number"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="passport_number"
          errorPath="personal.passport_number"
          onValueChanged={onStateChanged}
          editValue={state.personal?.passport_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="mail"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="mail"
          errorPath="personal.mail"
          onValueChanged={onStateChanged}
          editValue={state.personal?.email}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="country-code"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="country_code"
          errorPath="personal.country_code"
          onValueChanged={onStateChanged}
          editValue={state.personal?.country_code}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type="number"
          pattern={numbersExpression}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="country-code-id"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="country_code_id"
          errorPath="personal.country_code_id"
          onValueChanged={onStateChanged}
          editValue={state.personal?.country_code_id}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type="number"
          pattern={numbersExpression}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="telephone-number"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="telephone_number"
          errorPath="personal.telephone_number"
          onValueChanged={onStateChanged}
          editValue={state.personal?.telephone_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="passport-country-id"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="passport_country_id"
          errorPath="personal.passport_country_id"
          onValueChanged={onStateChanged}
          editValue={state.personal?.passport_country_id}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type="number"
          pattern={numbersExpression}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="nationality-id"
          isSubmitted={isSubmitted}
          parentId="personal"
          stateKey="nationality_id"
          errorPath="personal.nationality_id"
          onValueChanged={onStateChanged}
          editValue={state.personal?.nationality_id}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          type="number"
          pattern={numbersExpression}
        />
      )}
      {!isView && (
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="dateOfBirthRef"
            maxDate={moment().toDate()}
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.personal?.dob || ''}
            helperText={errors?.['personal.date_of_birth']?.message || undefined}
            error={errors?.['personal.date_of_birth']?.error || false}
            label={t(`${translationPath}date-of-birth`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'personal',
                  id: 'date_of_birth',
                  value: date.value,
                });
              else
                onStateChanged({
                  parentId: 'personal',
                  id: 'date_of_birth',
                  value: null,
                });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
      )}
      {!isView && (
        <FilesComponent
          parentTranslationPath={parentTranslationPath}
          state={state}
          errors={errors}
          isSubmitted={isSubmitted}
          onStateChanged={onStateChanged}
          isLoading={isLoading}
          parentId="personal"
          required
          withoutAdd
          label={t(`${translationPath}passport`)}
        />
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {isView && state.personal?.firstname && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}firstname`)}</div>
            <div>{state.personal.firstname}</div>
          </div>
        )}
        {isView && state.personal?.lastname && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}lastname`)}</div>
            <div>{state.personal.lastname}</div>
          </div>
        )}
        {isView && state.personal?.passport_number && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}passport-number`)}</div>
            <div>{state.personal.passport_number}</div>
          </div>
        )}
        {isView && state.personal?.mail && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}mail`)}</div>
            <div>{state.personal.mail}</div>
          </div>
        )}
        {isView && state.personal?.country_code && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}country-code`)}</div>
            <div>{state.personal.country_code}</div>
          </div>
        )}
        {isView && state.personal?.country_code_id && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}country-code-id`)}</div>
            <div>{state.personal.country_code_id}</div>
          </div>
        )}
        {isView && state.personal?.telephone_number && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}telephone-number`)}</div>
            <div>{state.personal.telephone_number}</div>
          </div>
        )}
        {isView && state.personal?.passport_country_id && (
          <div className="w-50 mb-3">
            <div className="fw-bold">
              {t(`${translationPath}passport-country-id`)}
            </div>
            <div>{state.personal.passport_country_id}</div>
          </div>
        )}
        {isView && state.personal?.nationality_id && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}nationality-id`)}</div>
            <div>{state.personal.nationality_id}</div>
          </div>
        )}
        {isView && state.personal?.date_of_birth && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}date-of-birth`)}</div>
            <div>{state.personal.date_of_birth}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsSection;

PersonalDetailsSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    personal: PropTypes.shape({
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      date_of_birth: PropTypes.string,
      passport_number: PropTypes.string,
      mail: PropTypes.string,
      country_code: PropTypes.number,
      country_code_id: PropTypes.number,
      telephone_number: PropTypes.string,
      passport_country_id: PropTypes.number,
      nationality_id: PropTypes.number,
      files: PropTypes.arrayOf(
        PropTypes.shape({
          media_uuid: PropTypes.string,
          category: PropTypes.string,
        }),
      ),
    }),
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  isView: PropTypes.bool,
};

PersonalDetailsSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  isView: undefined,
};
