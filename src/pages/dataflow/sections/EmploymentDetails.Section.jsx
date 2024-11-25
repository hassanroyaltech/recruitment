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
import FilesComponent from '../component/Files.Component';
import moment from 'moment';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../../helpers';

const translationPath = 'EmploymentDetails.';

const EmploymentDetailsSection = ({
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
        {t(`${translationPath}employment-details`)}
      </div>
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="authority-name"
          searchKey="search"
          parentId="employment"
          errorPath="employment.authority_name"
          placeholder="authority-name"
          // isDisabled={isLoading}
          stateKey="authority_name"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.employment?.authority_name && {
            //   with_than: [state.employment?.authority_name],
            // }),
            type: 'employment_authority',
          }}
          editValue={state.employment?.authority_name?.uuid}
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
          title="authority-state"
          isSubmitted={isSubmitted}
          parentId="employment"
          stateKey="authority_state"
          errorPath="employment.authority_state"
          onValueChanged={onStateChanged}
          editValue={state.employment?.authority_state}
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
          parentId="employment"
          stateKey="authority_country"
          errorPath="employment.authority_country"
          onValueChanged={onStateChanged}
          editValue={state.employment?.authority_country}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="last-designation"
          isSubmitted={isSubmitted}
          parentId="employment"
          stateKey="last_designation"
          errorPath="employment.last_designation"
          onValueChanged={onStateChanged}
          editValue={state.employment?.last_designation}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="nature-of-employment"
          isSubmitted={isSubmitted}
          parentId="employment"
          stateKey="nature_of_employment"
          errorPath="employment.nature_of_employment"
          onValueChanged={onStateChanged}
          editValue={state.employment?.nature_of_employment}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <SharedInputControl
          errors={errors}
          isHalfWidth
          title="name-as-per-document"
          isSubmitted={isSubmitted}
          parentId="employment"
          stateKey="name_as_per_document"
          errorPath="employment.name_as_per_document"
          onValueChanged={onStateChanged}
          editValue={state.employment?.name_as_per_document}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {!isView && (
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="periodFromRef"
            maxDate={
              (state.employment?.period_to
                && moment(state.employment?.period_to)?.toDate())
              || ''
            }
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.employment?.period_from || ''}
            helperText={errors?.['employment.period_from']?.message || undefined}
            error={errors?.['employment.period_from']?.error || false}
            label={t(`${translationPath}period-from`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'employment',
                  id: 'period_from',
                  value: date.value,
                });
              else
                onStateChanged({
                  parentId: 'employment',
                  id: 'period_from',
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
            idRef="periodToRef"
            minDate={
              (state.employment?.period_from
                && moment(state.employment?.period_from)?.toDate())
              || ''
            }
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.employment?.period_to || ''}
            helperText={errors?.['employment.period_to']?.message || undefined}
            error={errors?.['employment.period_to']?.error || false}
            label={t(`${translationPath}period-to`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({
                  parentId: 'employment',
                  id: 'period_to',
                  value: date.value,
                });
              else
                onStateChanged({
                  parentId: 'employment',
                  id: 'period_to',
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
          parentId="employment"
          required
          categoryAPIType="employment_documents"
          withCategory
        />
      )}
      {isView && (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {isView && state.employment?.authority_name && (
            <div className="w-50 mb-3">
              <div className="fw-bold">{t(`${translationPath}authority-name`)}</div>
              <div>{state.employment.authority_name}</div>
            </div>
          )}
          {isView && state.employment?.authority_state && (
            <div className="w-50 mb-3">
              <div className="fw-bold">{t(`${translationPath}authority-state`)}</div>
              <div>{state.employment.authority_state}</div>
            </div>
          )}
          {isView && state.employment?.authority_country && (
            <div className="w-50 mb-3">
              <div className="fw-bold">
                {t(`${translationPath}authority-country`)}
              </div>
              <div>{state.employment.authority_country}</div>
            </div>
          )}
          {isView && state.employment?.last_designation && (
            <div className="w-50 mb-3">
              <div className="fw-bold">
                {t(`${translationPath}last-designation`)}
              </div>
              <div>{state.employment.last_designation}</div>
            </div>
          )}
          {isView && state.employment?.nature_of_employment && (
            <div className="w-50 mb-3">
              <div className="fw-bold">
                {t(`${translationPath}nature-of-employment`)}
              </div>
              <div>{state.employment.nature_of_employment}</div>
            </div>
          )}
          {isView && state.employment?.name_as_per_document && (
            <div className="w-50 mb-3">
              <div className="fw-bold">
                {t(`${translationPath}name-as-per-document`)}
              </div>
              <div>{state.employment.name_as_per_document}</div>
            </div>
          )}
          {isView && state.employment?.period_from && (
            <div className="w-50 mb-3">
              <div className="fw-bold">{t(`${translationPath}period-from`)}</div>
              <div>{state.employment.period_from}</div>
            </div>
          )}
          {isView && state.employment?.period_to && (
            <div className="w-50 mb-3">
              <div className="fw-bold">{t(`${translationPath}period-to`)}</div>
              <div>{state.employment.period_to}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmploymentDetailsSection;

EmploymentDetailsSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    employment: PropTypes.shape({
      authority_name: PropTypes.string,
      authority_state: PropTypes.string,
      authority_country: PropTypes.string,
      last_designation: PropTypes.string,
      nature_of_employment: PropTypes.string,
      name_as_per_document: PropTypes.string,
      period_from: PropTypes.string,
      period_to: PropTypes.string,
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

EmploymentDetailsSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  isView: undefined,
};
