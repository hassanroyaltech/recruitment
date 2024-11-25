// Import React Components
import React from 'react';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from 'pages/setups/shared';
import { useTranslation } from 'react-i18next';
import { GetDataFlowDropdown } from 'services';
import PropTypes from 'prop-types';
import Datepicker from 'components/Elevatus/Datepicker';
import FilesComponent from '../component/Files.Component';
import moment from 'moment';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../../helpers';

const translationPath = 'HealthLicenseDetails.';

const HealthLicenseDetailsSection = ({
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
        {t(`${translationPath}health-license-details`)}
      </div>
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="authority-name"
          searchKey="search"
          parentId="health"
          errorPath="health.authority_name"
          placeholder="authority-name"
          // isDisabled={isLoading}
          stateKey="authority_name"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.health?.authority_name && {
            //   with_than: [state.health?.authority_name],
            // }),
            type: 'health_authority',
          }}
          editValue={state.health?.authority_name?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-address"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_address"
          errorPath="health.authority_address"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_address}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-city"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_city"
          errorPath="health.authority_city"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_city}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-state"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_state"
          errorPath="health.authority_state"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_state}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-country"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_country"
          errorPath="health.authority_country"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_country}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-phone-type"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_phone_type"
          errorPath="health.authority_phone_type"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_phone_type}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-country-code"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_country_code"
          errorPath="health.authority_country_code"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_country_code}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-state-code"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_state_code"
          errorPath="health.authority_state_code"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_state_code}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-telephone-number"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_telephone_number"
          errorPath="health.authority_telephone_number"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_telephone_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-mail"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_mail"
          errorPath="health.authority_mail"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_mail}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="authority-website"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="authority_website"
          errorPath="health.authority_website"
          onValueChanged={onStateChanged}
          editValue={state.health?.authority_website}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="applicant-name-per-document"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="applicant_name_per_document"
          errorPath="health.applicant_name_per_document"
          onValueChanged={onStateChanged}
          editValue={state.health?.applicant_name_per_document}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="licence-type"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="licence_type"
          errorPath="health.licence_type"
          onValueChanged={onStateChanged}
          editValue={state.health?.licence_type}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="licence-attend"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="licence_attend"
          errorPath="health.licence_attend"
          onValueChanged={onStateChanged}
          editValue={state.health?.licence_attend}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="licence-number"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="licence_number"
          errorPath="health.licence_number"
          onValueChanged={onStateChanged}
          editValue={state.health?.licence_number}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="licenceConferredDateRef"
            maxDate={
              (state.health?.licence_expired_date
                && moment(state.health?.licence_expired_date)?.toDate())
              || ''
            }
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.health?.licence_conferred_date || ''}
            helperText={
              errors?.['health.licence_conferred_date']?.message || undefined
            }
            error={errors?.['health.licence_conferred_date']?.error || false}
            label={t(`${translationPath}licence-conferred-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'health',
                  id: 'licence_conferred_date',
                  value: date.value,
                });
              else
                onStateChanged({
                  parentId: 'health',
                  id: 'licence_conferred_date',
                  value: null,
                });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
      )}
      {!isView && (
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="licenceExpiredDateRef"
            minDate={
              (state.health?.licence_conferred_date
                && moment(state.health?.licence_conferred_date)?.toDate())
              || ''
            }
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.health?.licence_expired_date || ''}
            helperText={
              errors?.['health.licence_expired_date']?.message || undefined
            }
            error={errors?.['health.licence_expired_date']?.error || false}
            label={t(`${translationPath}licence-expired-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'health',
                  id: 'licence_expired_date',
                  value: date.value,
                });
              else
                onStateChanged({
                  parentId: 'health',
                  id: 'licence_expired_date',
                  value: null,
                });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="licence-status"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="licence_status"
          errorPath="health.licence_status"
          onValueChanged={onStateChanged}
          editValue={state.health?.licence_status}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="bar-code"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="bar_code"
          errorPath="health.bar_code"
          onValueChanged={onStateChanged}
          editValue={state.health?.bar_code}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="component-label"
          isSubmitted={isSubmitted}
          parentId="health"
          stateKey="component_label"
          errorPath="health.component_label"
          onValueChanged={onStateChanged}
          editValue={state.health?.component_label}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <FilesComponent
          parentTranslationPath={parentTranslationPath}
          state={state}
          errors={errors}
          isSubmitted={isSubmitted}
          onStateChanged={onStateChanged}
          isLoading={isLoading}
          parentId="health"
          required
          categoryAPIType="health_documents"
          withCategory
        />
      )}
      {isView && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {isView && state.health?.authority_city && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}authority-city`)}</div>
              <div>{state.health.authority_city}</div>
            </div>
          )}
          {isView && state.health?.authority_name && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}authority-name`)}</div>
              <div>{state.health.authority_name}</div>
            </div>
          )}
          {isView && state.health?.authority_address && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-address`)}
              </div>
              <div>{state.health.authority_address}</div>
            </div>
          )}
          {isView && state.health?.authority_state && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}authority-state`)}</div>
              <div>{state.health.authority_state}</div>
            </div>
          )}
          {isView && state.health?.authority_country && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-country`)}
              </div>
              <div>{state.health.authority_country}</div>
            </div>
          )}
          {isView && state.health?.authority_phone_type && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-phone-type`)}
              </div>
              <div>{state.health.authority_phone_type}</div>
            </div>
          )}
          {isView && state.health?.authority_country_code && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-country-code`)}
              </div>
              <div>{state.health.authority_country_code}</div>
            </div>
          )}
          {isView && state.health?.authority_state_code && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-state-code`)}
              </div>
              <div>{state.health.authority_state_code}</div>
            </div>
          )}
          {isView && state.health?.authority_telephone_number && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-telephone-number`)}
              </div>
              <div>{state.health.authority_telephone_number}</div>
            </div>
          )}
          {isView && state.health?.authority_mail && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}authority-mail`)}</div>
              <div>{state.health.authority_mail}</div>
            </div>
          )}
          {isView && state.health?.authority_website && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}authority-website`)}
              </div>
              <div>{state.health.authority_website}</div>
            </div>
          )}
          {isView && state.health?.applicant_name_per_document && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}applicant-name-per-document`)}
              </div>
              <div>{state.health.applicant_name_per_document}</div>
            </div>
          )}
          {isView && state.health?.licence_type && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}licence-type`)}</div>
              <div>{state.health.licence_type}</div>
            </div>
          )}
          {isView && state.health?.licence_attend && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}licence-attend`)}</div>
              <div>{state.health.licence_attend}</div>
            </div>
          )}
          {isView && state.health?.licence_number && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}licence-number`)}</div>
              <div>{state.health.licence_number}</div>
            </div>
          )}
          {isView && state.health?.licence_conferred_date && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}licence-conferred-date`)}
              </div>
              <div>{state.health.licence_conferred_date}</div>
            </div>
          )}
          {isView && state.health?.licence_expired_date && (
            <div className="w-50 mb-4">
              <div className="fw-bold">
                {t(`${translationPath}licence-expired-date`)}
              </div>
              <div>{state.health.licence_expired_date}</div>
            </div>
          )}
          {isView && state.health?.licence_status && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}licence-status`)}</div>
              <div>{state.health.licence_status}</div>
            </div>
          )}
          {isView && state.health?.bar_code && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}bar-code`)}</div>
              <div>{state.health.bar_code}</div>
            </div>
          )}
          {isView && state.health?.component_label && (
            <div className="w-50 mb-4">
              <div className="fw-bold">{t(`${translationPath}component-label`)}</div>
              <div>{state.health.component_label}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthLicenseDetailsSection;

HealthLicenseDetailsSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    health: PropTypes.shape({
      authority_name: PropTypes.string,
      authority_address: PropTypes.string,
      authority_city: PropTypes.string,
      authority_state: PropTypes.string,
      authority_country: PropTypes.string,
      authority_phone_type: PropTypes.string,
      authority_country_code: PropTypes.string,
      authority_state_code: PropTypes.string,
      authority_telephone_number: PropTypes.string,
      authority_mail: PropTypes.string,
      authority_website: PropTypes.string,
      applicant_name_per_document: PropTypes.string,
      licence_type: PropTypes.string,
      licence_attend: PropTypes.string,
      licence_number: PropTypes.string,
      licence_conferred_date: PropTypes.string,
      licence_expired_date: PropTypes.string,
      licence_status: PropTypes.string,
      bar_code: PropTypes.string,
      component_label: PropTypes.string,
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

HealthLicenseDetailsSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  isView: undefined,
};
