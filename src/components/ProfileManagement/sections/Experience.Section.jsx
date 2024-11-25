import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import {
  GetAllSetupsCareerLevels,
  GetAllSetupsCountries,
  GetAllSetupsIndustries,
} from '../../../services';
import { numbersExpression } from '../../../utils';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../pages/setups/shared';
// import Datepicker from '../../Elevatus/Datepicker';
import { CheckboxesComponent } from '../../Checkboxes/Checkboxes.Component';
import { DynamicFormTypesEnum } from '../../../enums';
import DatePickerComponent from '../../Datepicker/DatePicker.Component';
import moment from 'moment';
import { GlobalDateFormat } from '../../../helpers';

export const ExperienceSection = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  isFullWidth,
  company_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('experience')}</div>
      <div className="section-item-description">{t('experience-description')}</div>
      <div className="section-item-action">
        <ButtonBase
          onClick={() => {
            const localExperience = [...(state.experience || [])];
            localExperience.push({
              career_level_uuid: '',
              company_name: '',
              country_uuid: '',
              description: '',
              from_date: '',
              industry_uuid: '',
              is_currently: false,
              locations: [],
              no_of_beds: 0,
              role: '',
              to_date: null,
            });
            onStateChanged({ id: 'experience', value: localExperience });
          }}
          className="btns theme-solid"
        >
          <span className="mdi mdi-plus" />
          <span>{t('add-experience')}</span>
        </ButtonBase>
      </div>
      <div className="section-item-body-wrapper px-2">
        {state.experience
          && state.experience.map((item, index) => (
            <div key={`${index + 1}-experience-item`}>
              <div className="experience-section-wrapper w-100">
                <div className="w-100">
                  <SharedInputControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    parentIndex={index}
                    parentId="experience"
                    isDisabled={isLoading}
                    stateKey="company_name"
                    isSubmitted={isSubmitted}
                    title="company-organization"
                    errorPath={`experience[${index}].company_name`}
                    editValue={item.company_name}
                    onValueChanged={onStateChanged}
                    placeholder="company-organization"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <SharedInputControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    stateKey="role"
                    errors={errors}
                    parentIndex={index}
                    parentId="experience"
                    title="position-role"
                    editValue={item.role}
                    isDisabled={isLoading}
                    errorPath={`experience[${index}].role`}
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                    placeholder="position-role"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    title="industry"
                    searchKey="search"
                    placeholder="industry"
                    isDisabled={isLoading}
                    stateKey="industry_uuid"
                    isSubmitted={isSubmitted}
                    parentIndex={index}
                    parentId="experience"
                    errorPath={`experience[${index}].industry_uuid`}
                    editValue={item.industry_uuid}
                    onValueChanged={onStateChanged}
                    getDataAPI={GetAllSetupsIndustries}
                    extraProps={{
                      company_uuid,
                      ...(item.industry_uuid && { with_than: [item.industry_uuid] }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    searchKey="search"
                    title="career-level"
                    errorPath={`experience[${index}].career_level_uuid`}
                    isDisabled={isLoading}
                    isSubmitted={isSubmitted}
                    placeholder="career-level"
                    stateKey="career_level_uuid"
                    parentIndex={index}
                    parentId="experience"
                    onValueChanged={onStateChanged}
                    editValue={item.career_level_uuid}
                    getDataAPI={GetAllSetupsCareerLevels}
                    extraProps={{
                      company_uuid,
                      ...(item.career_level_uuid && {
                        with_than: [item.career_level_uuid],
                      }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedAPIAutocompleteControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    title="country"
                    errors={errors}
                    searchKey="search"
                    placeholder="country"
                    errorPath={`experience[${index}].country_uuid`}
                    isDisabled={isLoading}
                    stateKey="country_uuid"
                    isSubmitted={isSubmitted}
                    editValue={item.country_uuid}
                    parentIndex={index}
                    parentId="experience"
                    onValueChanged={onStateChanged}
                    getDataAPI={GetAllSetupsCountries}
                    extraProps={{
                      company_uuid,
                      ...(item.country_uuid && { with_than: [item.country_uuid] }),
                    }}
                    parentTranslationPath={parentTranslationPath}
                    getOptionLabel={(option) =>
                      option.name[i18next.language] || option.name.en
                    }
                  />
                  <SharedInputControl
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    title="no-of-beds"
                    parentIndex={index}
                    parentId="experience"
                    stateKey="no_of_beds"
                    isDisabled={isLoading}
                    errorPath={`experience[${index}].no_of_beds`}
                    placeholder="no-of-beds"
                    isSubmitted={isSubmitted}
                    editValue={item.no_of_beds}
                    pattern={numbersExpression}
                    onValueChanged={onStateChanged}
                    parentTranslationPath={parentTranslationPath}
                  />
                  <div className="d-flex flex-wrap">
                    <div className="w-50 px-2">
                      <DatePickerComponent
                        parentId="experience"
                        parentIndex={index}
                        stateKey="from_date"
                        datePickerWrapperClasses="px-0"
                        label={t('start-date')}
                        inputPlaceholder={`${t('Shared:eg')} ${moment()
                          .locale(i18next.language)
                          .format(GlobalDateFormat)}`}
                        // helperText={t('this-field-is-required')}
                        // error={
                        //   errors
                        //   && errors.experience
                        //   && errors.experience[index].from_date
                        // }
                        idRef={`experienceStartDateRef${index + 1}`}
                        value={item.from_date || ''}
                        isSubmitted={isSubmitted}
                        displayFormat={GlobalDateFormat}
                        maxDate={moment().toDate()}
                        onDelayedChange={onStateChanged}
                        errors={errors}
                        errorPath={`experience[${index}].from_date`}
                      />
                    </div>
                    {!item.is_currently ? (
                      <div className="w-50 px-2">
                        <DatePickerComponent
                          parentId="experience"
                          parentIndex={index}
                          stateKey="to_date"
                          datePickerWrapperClasses="px-0"
                          label={t('end-date')}
                          inputPlaceholder={`${t('Shared:eg')} ${moment()
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}`}
                          // helperText={t('this-field-is-required')}
                          // error={
                          //   errors
                          //   && errors.experience
                          //   && errors.experience[index].to_date
                          // }
                          idRef={`experienceEndDateRef${index + 1}`}
                          value={item.to_date || ''}
                          isSubmitted={isSubmitted}
                          displayFormat={GlobalDateFormat}
                          maxDate={moment().toDate()}
                          onDelayedChange={onStateChanged}
                          errors={errors}
                          errorPath={`experience[${index}].to_date`}
                        />
                        {/*<Datepicker*/}
                        {/*  label={t('end-date')}*/}
                        {/*  isSubmitted={isSubmitted}*/}
                        {/*  value={item.to_date || ''}*/}
                        {/*  inputPlaceholder="YYYY-MM-DD"*/}
                        {/*  idRef={`experienceEndDateRef${index + 1}`}*/}
                        {/*  helperText={t('this-field-is-required')}*/}
                        {/*  error={*/}
                        {/*    errors*/}
                        {/*    && errors.experience*/}
                        {/*    && errors.experience[index].to_date*/}
                        {/*  }*/}
                        {/*  onChange={(date) => {*/}
                        {/*    if (date !== 'Invalid date')*/}
                        {/*      onStateChanged({*/}
                        {/*        parentId: 'experience',*/}
                        {/*        parentIndex: index,*/}
                        {/*        id: 'to_date',*/}
                        {/*        value: date,*/}
                        {/*      });*/}
                        {/*    else*/}
                        {/*      onStateChanged({*/}
                        {/*        parentId: 'experience',*/}
                        {/*        parentIndex: index,*/}
                        {/*        id: 'to_date',*/}
                        {/*        value: null,*/}
                        {/*      });*/}
                        {/*  }}*/}
                        {/*/>*/}
                      </div>
                    ) : (
                      <div className="w-50 px-2 present-text-wrapper">
                        <span className="mdi mdi-arrow-right pr-2-reversed" />
                        {t('present')}
                      </div>
                    )}
                  </div>
                  <div className="px-2 pt-3">
                    <CheckboxesComponent
                      idRef="isCurrentPositionRef"
                      singleChecked={item.is_currently}
                      label={t('i-am-currently-working-here')}
                      onSelectedCheckboxChanged={(event, checkedValue) => {
                        onStateChanged({
                          parentId: 'experience',
                          parentIndex: index,
                          id: 'is_currently',
                          value: checkedValue,
                        });

                        if (checkedValue)
                          onStateChanged({
                            parentId: 'experience',
                            parentIndex: index,
                            id: 'to_date',
                            value: null,
                          });
                      }}
                    />
                  </div>
                  <SharedAutocompleteControl
                    editValue={item.locations}
                    placeholder="press-enter-to-add"
                    title="address"
                    isFreeSolo
                    stateKey="locations"
                    parentId="experience"
                    parentIndex={index}
                    errorPath={`experience[${index}].locations`}
                    onValueChanged={onStateChanged}
                    isSubmitted={isSubmitted}
                    errors={errors}
                    type={DynamicFormTypesEnum.array.key}
                    parentTranslationPath={parentTranslationPath}
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                  />
                  <SharedInputControl
                    rows={3}
                    multiline
                    isHalfWidth={!isFullWidth}
                    isFullWidth={isFullWidth}
                    errors={errors}
                    parentIndex={index}
                    parentId="experience"
                    isDisabled={isLoading}
                    errorPath={`experience[${index}].description`}
                    stateKey="description"
                    isSubmitted={isSubmitted}
                    wrapperClasses="px-2 pt-3"
                    editValue={item.description}
                    onValueChanged={onStateChanged}
                    title="describe-your-work-experience-here"
                    parentTranslationPath={parentTranslationPath}
                    placeholder="describe-your-work-experience-here"
                    InputLabelProps={{ className: 'p_truncate' }}
                  />
                </div>
                <ButtonBase
                  onClick={() => {
                    const localExperience = [...state.experience];
                    localExperience.splice(index, 1);
                    onStateChanged({ id: 'experience', value: localExperience });
                  }}
                  className="btns-icon theme-danger mx-2 mt-1"
                >
                  <span className="fas fa-minus" />
                </ButtonBase>
              </div>
              {state.experience && state.experience.length !== index + 1 && <hr />}
            </div>
          ))}
      </div>
    </div>
  );
};

ExperienceSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isFullWidth: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};
ExperienceSection.defaultProps = {
  company_uuid: undefined,
};
