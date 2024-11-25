// Import React Components
import React from 'react';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from 'pages/setups/shared';
import { useTranslation } from 'react-i18next';
import { GetDataFlowDropdown } from 'services';
import PropTypes from 'prop-types';
import FilesComponent from '../component/Files.Component';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../../helpers';

const translationPath = 'EducationDetails.';

const EducationDetailsSection = ({
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
        {t(`${translationPath}education-details`)}
      </div>
      {!isView && (
        <div className="section-item-action">
          <ButtonBase
            onClick={() => {
              const localeEducation = [...(state.education || [])];
              localeEducation.push({
                authority_name: '',
                authority_country: '',
                qualification_attend: '',
                qualification_date: '',
                name_as_per_certificate: '',
                files: [
                  {
                    media_uuid: '',
                    category: '',
                  },
                ],
              });
              onStateChanged({ id: 'education', value: localeEducation });
            }}
            className="btns theme-solid"
          >
            <span className="mdi mdi-plus" />
            <span>{t(`${translationPath}add-education`)}</span>
          </ButtonBase>
        </div>
      )}
      <div className="section-item-body-wrapper px-2">
        {state.education?.map((item, parentIndex) => (
          <div
            key={`${parentIndex}-education`}
            style={{
              padding: '1rem',
              border: '1px lightgray dashed',
              marginBottom: '1rem',
            }}
          >
            <div className="d-flex-v-center-h-end mx-2 mt-2 mb-3">
              <ButtonBase
                onClick={() => {
                  const localeEducation = [...(state.education || [])];
                  localeEducation.splice(parentIndex, 1);
                  onStateChanged({ id: 'education', value: localeEducation });
                }}
                disabled={state?.education?.length === 1}
              >
                <span className="fas fa-times ml-3" />
              </ButtonBase>
            </div>
            <div>
              {!isView && (
                <SharedAPIAutocompleteControl
                  isEntireObject
                  isHalfWidth
                  errors={errors}
                  title="authority-name"
                  searchKey="search"
                  parentId="education"
                  parentIndex={parentIndex}
                  errorPath={`education[${parentIndex}].authority_name`}
                  placeholder="authority-name"
                  // isDisabled={isLoading}
                  stateKey="authority_name"
                  isSubmitted={isSubmitted}
                  onValueChanged={onStateChanged}
                  getDataAPI={GetDataFlowDropdown}
                  extraProps={{
                    // ...(item.authority_name && {
                    //   with_than: [item.authority_name],
                    // }),
                    type: 'education_authority',
                  }}
                  editValue={item.authority_name?.uuid}
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
                  title="authority-country"
                  isSubmitted={isSubmitted}
                  parentId="education"
                  stateKey="authority_country"
                  errorPath={`education[${parentIndex}].authority_country`}
                  onValueChanged={onStateChanged}
                  editValue={item.authority_country}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  parentIndex={parentIndex}
                />
              )}
              {!isView && (
                <SharedInputControl
                  errors={errors}
                  isHalfWidth
                  title="qualification-attend"
                  isSubmitted={isSubmitted}
                  parentId="education"
                  stateKey="qualification_attend"
                  errorPath={`education[${parentIndex}].qualification_attend`}
                  onValueChanged={onStateChanged}
                  editValue={item.qualification_attend}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  parentIndex={parentIndex}
                />
              )}
              {!isView && (
                <SharedInputControl
                  errors={errors}
                  isHalfWidth
                  title="name-as-per-certificate"
                  isSubmitted={isSubmitted}
                  parentId="education"
                  stateKey="name_as_per_certificate"
                  errorPath={`education[${parentIndex}].name_as_per_certificate`}
                  onValueChanged={onStateChanged}
                  editValue={item.name_as_per_certificate}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  parentIndex={parentIndex}
                />
              )}
              {!isView && (
                <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
                  <DatePickerComponent
                    idRef="qualificationDateRef"
                    minDate=""
                    isSubmitted={isSubmitted}
                    inputPlaceholder="YYYY-MM-DD"
                    value={item.qualification_date || ''}
                    helperText={
                      errors?.[`education[${parentIndex}].qualification_date`]
                        ?.message || undefined
                    }
                    error={
                      errors?.[`education[${parentIndex}].qualification_date`]
                        ?.error || false
                    }
                    label={t(`${translationPath}qualification-date`)}
                    onChange={(date) => {
                      if (date?.value !== 'Invalid date')
                        onStateChanged({
                          parentId: 'education',
                          parentIndex,
                          id: 'qualification_date',
                          value: date.value,
                        });
                      else
                        onStateChanged({
                          parentId: 'education',
                          parentIndex,
                          id: 'qualification_date',
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
                  parentId="education"
                  required
                  parentIndex={parentIndex}
                  categoryAPIType="education_documents"
                  withCategory
                />
              )}
              {isView && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {isView && item?.authority_name && (
                    <div className="w-50 mb-3">
                      <div className="fw-bold">
                        {t(`${translationPath}authority-name`)}
                      </div>
                      <div>{item.authority_name}</div>
                    </div>
                  )}
                  {isView && item?.authority_country && (
                    <div className="w-50 mb-3">
                      <div className="fw-bold">
                        {t(`${translationPath}authority-country`)}
                      </div>
                      <div>{item.authority_country}</div>
                    </div>
                  )}
                  {isView && item?.qualification_attend && (
                    <div className="w-50 mb-3">
                      <div className="fw-bold">
                        {t(`${translationPath}qualification-attend`)}
                      </div>
                      <div>{item.qualification_attend}</div>
                    </div>
                  )}
                  {isView && item?.name_as_per_certificate && (
                    <div className="w-50 mb-3">
                      <div className="fw-bold">
                        {t(`${translationPath}name-as-per-certificate`)}
                      </div>
                      <div>{item.name_as_per_certificate}</div>
                    </div>
                  )}
                </div>
              )}
              {isView && item?.qualification_date && (
                <div className="w-50 mb-3">
                  <div className="fw-bold">
                    {t(`${translationPath}qualification-date`)}
                  </div>
                  <div>{item.qualification_date}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationDetailsSection;

EducationDetailsSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    education: PropTypes.arrayOf(
      PropTypes.shape({
        authority_name: PropTypes.string,
        authority_country: PropTypes.string,
        qualification_attend: PropTypes.string,
        qualification_date: PropTypes.string,
        name_as_per_certificate: PropTypes.string,
        files: PropTypes.arrayOf(
          PropTypes.shape({
            media_uuid: PropTypes.string,
            category: PropTypes.string,
          }),
        ),
      }),
    ),
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  isView: PropTypes.bool,
};

EducationDetailsSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  isView: undefined,
};
