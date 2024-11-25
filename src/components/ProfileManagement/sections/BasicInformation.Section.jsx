import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import moment from 'moment';
import {
  GetAllSetupsCountries,
  GetAllSetupsDocumentTypes,
  GetAllSetupsGender,
  GetAllSetupsJobTypes,
  GetAllSetupsNationality,
} from '../../../services';
import { DynamicFormTypesEnum, UploaderPageEnum } from '../../../enums';
// import Datepicker from '../../Elevatus/Datepicker';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedUploaderControl,
} from '../../../pages/setups/shared';
import DatePickerComponent from '../../Datepicker/DatePicker.Component';
import { GlobalDateFormat } from '../../../helpers';

export const BasicInformationSection = ({
  state,
  isFullWidth,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  company_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const booleanValues = [
    { label: t('yes'), value: 'yes' },
    { label: t('no'), value: 'no' },
  ];

  /**
   * @param newValue - the current file
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle updating the uploading the logo
   */
  const onUploadChanged = (newValue) => {
    onStateChanged({
      id: 'cv_uuid',
      value: (newValue.value.length && newValue.value[0].uuid) || null,
    });
    onStateChanged({
      id: 'cv',
      value: newValue.value || [],
    });
  };

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('basic-information')}</div>
      <div className="section-item-description">
        {t('basic-information-description')}
      </div>
      <div className="section-item-body-wrapper">
        <div className="section-body-title">{t('general')}</div>
        <SharedInputControl
          rows={4}
          multiline
          isFullWidth
          errors={errors}
          wrapperClasses="px-2"
          stateKey="description"
          errorPath="description"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.description}
          title="tell-us-about-yourself"
          onValueChanged={onStateChanged}
          placeholder="tell-us-about-yourself"
          parentTranslationPath={parentTranslationPath}
        />
        <div className="d-flex flex-wrap">
          <div className={`w-100 px-2 mb-3 ${(!isFullWidth && 'w-t-50') || ''}`}>
            <DatePickerComponent
              datePickerWrapperClasses="px-0"
              label={t('date-of-birth')}
              inputPlaceholder={`${t('Shared:eg')} ${moment()
                .locale(i18next.language)
                .format(GlobalDateFormat)}`}
              helperText={t('this-field-is-required')}
              error={errors.dob}
              value={state.dob || ''}
              stateKey={'dob'}
              isSubmitted={isSubmitted}
              displayFormat={GlobalDateFormat}
              isHijri={false}
              maxDate={moment().toDate()}
              onDelayedChange={onStateChanged}
            />
          </div>
          <SharedAPIAutocompleteControl
            isHalfWidth={!isFullWidth}
            isFullWidth={isFullWidth}
            title="gender"
            errors={errors}
            stateKey="gender"
            errorPath="gender"
            searchKey="search"
            placeholder="gender"
            isDisabled={isLoading}
            editValue={state.gender}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            getDataAPI={GetAllSetupsGender}
            extraProps={{
              company_uuid,
              ...(state.gender && { with_than: [state.gender] }),
            }}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
          />
        </div>
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="address"
          stateKey="address"
          errorPath="address"
          placeholder="address"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.address}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          searchKey="search"
          title="nationality"
          stateKey="nationality"
          isRequired
          isDisabled={isLoading}
          errorPath="nationality"
          placeholder="nationality"
          isSubmitted={isSubmitted}
          editValue={state.nationality}
          onValueChanged={onStateChanged}
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsNationality}
          extraProps={{
            company_uuid,
            ...(state.nationality?.length && { with_than: state.nationality }),
          }}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          title="national-id"
          stateKey="national_id"
          errors={errors}
          searchKey="search"
          placeholder="national-id"
          errorPath="national_id"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.national_id}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          title="city"
          stateKey="city"
          errors={errors}
          searchKey="search"
          placeholder="city"
          parentId="location"
          errorPath="location"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state.location.city}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="country"
          searchKey="search"
          parentId="location"
          errorPath="location.country_uuid"
          placeholder="country"
          isDisabled={isLoading}
          stateKey="country_uuid"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsCountries}
          extraProps={{
            company_uuid,
            ...(state.location.country_uuid && {
              with_than: [state.location.country_uuid],
            }),
          }}
          editValue={state.location.country_uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />
        <SharedInputControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          title="zip-code"
          stateKey="zip_code"
          errors={errors}
          searchKey="search"
          placeholder="zip-code"
          errorPath="zip_code"
          isDisabled={isLoading}
          isSubmitted={isSubmitted}
          editValue={state?.zip_code || ''}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
        />
        <hr />

        <div className="section-body-title">{t('right-to-work')}</div>
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          title="country"
          errors={errors}
          searchKey="search"
          placeholder="country"
          isDisabled={isLoading}
          stateKey="country_uuid"
          parentId="right_to_work"
          errorPath="right_to_work"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsCountries}
          extraProps={{
            company_uuid,
            ...(state.right_to_work.country_uuid && {
              with_than: [state.right_to_work.country_uuid],
            }),
          }}
          editValue={state.right_to_work.country_uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="document"
          searchKey="search"
          placeholder="document"
          isDisabled={isLoading}
          stateKey="document_type"
          errorPath="right_to_work"
          parentId="right_to_work"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsDocumentTypes}
          extraProps={{
            company_uuid,
            ...(state.right_to_work.document_type && {
              with_than: [state.right_to_work.document_type],
            }),
          }}
          editValue={state.right_to_work.document_type}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />

        <hr />

        <div className="section-body-title">{t('miscellaneous')}</div>
        <SharedAPIAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          title="job-types"
          searchKey="search"
          stateKey="job_types"
          errorPath="job_types"
          isDisabled={isLoading}
          placeholder="job-types"
          isSubmitted={isSubmitted}
          editValue={state.job_types}
          onValueChanged={onStateChanged}
          getDataAPI={GetAllSetupsJobTypes}
          type={DynamicFormTypesEnum.array.key}
          extraProps={{
            company_uuid,
            ...(state.job_types && { with_than: state.job_types }),
          }}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
        />
        <SharedAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          searchKey="search"
          initValuesKey="value"
          isDisabled={isLoading}
          initValuesTitle="label"
          isSubmitted={isSubmitted}
          initValues={booleanValues}
          stateKey="willing_to_travel"
          errorPath="willing_to_travel"
          onValueChanged={onStateChanged}
          title="are-you-willing-to-travel"
          editValue={state.willing_to_travel}
          placeholder="are-you-willing-to-travel"
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          searchKey="search"
          initValuesKey="value"
          isDisabled={isLoading}
          initValuesTitle="label"
          isSubmitted={isSubmitted}
          initValues={booleanValues}
          stateKey="willing_to_relocate"
          errorPath="willing_to_relocate"
          onValueChanged={onStateChanged}
          title="are-you-willing-to-relocate"
          editValue={state.willing_to_relocate}
          placeholder="are-you-willing-to-relocate"
          parentTranslationPath={parentTranslationPath}
        />
        <SharedAutocompleteControl
          isHalfWidth={!isFullWidth}
          isFullWidth={isFullWidth}
          errors={errors}
          searchKey="search"
          initValuesKey="value"
          isDisabled={isLoading}
          initValuesTitle="label"
          isSubmitted={isSubmitted}
          stateKey="owns_a_vehicle"
          errorPath="owns_a_vehicle"
          initValues={booleanValues}
          title="do-you-own-a-vehicle"
          onValueChanged={onStateChanged}
          editValue={state.owns_a_vehicle}
          placeholder="do-you-own-a-vehicle"
          parentTranslationPath={parentTranslationPath}
        />

        <hr />

        <div className="section-body-title">{t('resume')}</div>
        <div className="px-2">
          <SharedUploaderControl
            isHalfWidth={!isFullWidth}
            isFullWidth={isFullWidth}
            errors={errors}
            translationPath=""
            uploaderPage={UploaderPageEnum.ProfileCVDoc}
            stateKey="cv_uuid"
            errorPath="cv_uuid"
            fileTypeText="file"
            isDisabled={isLoading}
            editValue={state.cv}
            isSubmitted={isSubmitted}
            labelClasses="theme-primary"
            uploaderBtnText="browse-files"
            onValueChanged={onUploadChanged}
            company_uuid={company_uuid}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
    </div>
  );
};

BasicInformationSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isFullWidth: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};
BasicInformationSection.defaultProps = {
  company_uuid: undefined,
};
