import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedInputControl,
  SharedAPIAutocompleteControl,
  SharedPhoneControl,
} from '../../../../../../../shared';
import {
  GetAllEmployeeExperienceJob,
  GetEmployeeExperienceJobById,
} from '../../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../../enums';
import { showError } from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';
import { useSelector } from 'react-redux';

export const ExperienceReferenceForm = ({
  lookup,
  translationPath,
  parentTranslationPath,
  setStateFunc,
  isSubmitted,
  setIsLoading,
  errors,
  activeItem,
  isOpenChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    experience_job_uuid: '',
    referral_name: '',
    referral_position: '',
    referral_mobile: '',
    referral_feedback: '',
    employee_uuid: '',
  });
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const onSetEditValues = useCallback(() => {
    lookup.viewAPI({ uuid: activeItem.uuid }).then((res) => {
      if (res && res.status === 200) {
        if (res.data?.results)
          Object.entries(res.data.results).forEach((item) =>
            onStateChanged({ id: item[0], value: item[1] }),
          );
        else showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
        isOpenChanged();
      }
    });
  }, [activeItem, lookup, isOpenChanged, setIsLoading, t]);

  useEffect(() => {
    if (filter?.employee_uuid)
      onStateChanged({ id: 'employee_uuid', value: filter.employee_uuid });
  }, [filter]);

  useEffect(() => {
    setStateFunc(state);
  }, [state, setStateFunc]);

  useEffect(() => {
    if (activeItem) onSetEditValues();
  }, [activeItem, onSetEditValues]);

  return (
    <div>
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="experience-job-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="experience_job_uuid"
        errorPath="experience_job_uuid"
        placeholder="select-experience-job"
        onValueChanged={onStateChanged}
        editValue={state.experience_job_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllEmployeeExperienceJob}
        getItemByIdAPI={GetEmployeeExperienceJobById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.title || ''}
        extraProps={{
          employee_uuid: filter.employee_uuid,
          ...(state.experience_job_uuid && {
            with_than: [state.experience_job_uuid],
          }),
        }}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="referral-name"
        isSubmitted={isSubmitted}
        stateKey="referral_name"
        errorPath="referral_name"
        onValueChanged={onStateChanged}
        editValue={state.referral_name}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedInputControl
        errors={errors}
        isHalfWidth
        title="referral-position"
        isSubmitted={isSubmitted}
        stateKey="referral_position"
        errorPath="referral_position"
        onValueChanged={onStateChanged}
        editValue={state.referral_position}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
      />
      <SharedPhoneControl
        editValue={state.referral_mobile}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        stateKey="referral_mobile"
        title="referral-mobile"
        errorPath="referral_mobile"
        errors={errors}
        isSubmitted={isSubmitted}
        onValueChanged={onStateChanged}
        isHalfWidth
        excludeCountries={branchesReducer?.branches?.excluded_countries}
      />
      <SharedInputControl
        errors={errors}
        isFullWidth
        title="referral-feedback"
        isSubmitted={isSubmitted}
        stateKey="referral_feedback"
        errorPath="referral_feedback"
        onValueChanged={onStateChanged}
        editValue={state.referral_feedback}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        wrapperClasses="px-2"
      />
    </div>
  );
};

ExperienceReferenceForm.propTypes = {
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
  }),
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  setStateFunc: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
  setIsLoading: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    from_date: PropTypes.string,
    to_date: PropTypes.string,
  }),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

ExperienceReferenceForm.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {
    from_date: '',
    to_date: '',
  },
};
