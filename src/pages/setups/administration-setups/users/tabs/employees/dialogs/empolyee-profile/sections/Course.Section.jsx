import React, { useEffect, useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { numbersExpression } from '../../../../../../../../../utils';
import {
  SetupsReset,
  SetupsReducer,
  SharedInputControl,
  SharedUploaderControl,
  SharedAPIAutocompleteControl,
} from '../../../../../../../shared';
import {
  GetAllSetupsCourses,
  getSetupsCoursesById,
  GetMultipleMedias,
} from '../../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  UploaderPageEnum,
} from '../../../../../../../../../enums';
import {
  GlobalSavingDateFormat,
  showError,
} from '../../../../../../../../../helpers';
import DatePickerComponent from '../../../../../../../../../components/Datepicker/DatePicker.Component';

export const CourseForm = ({
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
    course_uuid: '',
    from_date: '',
    to_date: '',
    amount: '0',
    note: '',
    employee_uuid: '',
    media_uuids: [],
    media_data: [],
  });
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
          Object.entries(res.data.results).forEach((item) => {
            onStateChanged({ id: item[0], value: item[1] });
            if (item[0] === 'media_uuids')
              item[1]?.length
                && GetMultipleMedias({ uuids: item[1] }).then((mediaData) => {
                  if (mediaData?.status === 200)
                    onStateChanged({
                      id: 'media_data',
                      value:
                        mediaData?.data?.results?.data
                        && mediaData.data.results.data.map((result) => result.original),
                    });
                  else showError(t('Shared:failed-to-get-saved-data'));
                });
          });
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
    activeItem && onSetEditValues();
  }, [activeItem, onSetEditValues]);

  return (
    <div>
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="course-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="course_uuid"
        errorPath="course_uuid"
        placeholder="select-course"
        onValueChanged={onStateChanged}
        editValue={state.course_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsCourses}
        getItemByIdAPI={getSetupsCoursesById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en || ''}
        extraProps={{
          ...(state.course_uuid && { with_than: [state.course_uuid] }),
        }}
      />

      <SharedInputControl
        isHalfWidth
        type="number"
        title="amount"
        errors={errors}
        stateKey="amount"
        errorPath="amount"
        editValue={`${state.amount}`}
        isSubmitted={isSubmitted}
        pattern={numbersExpression}
        onValueChanged={(newValue) =>
          onStateChanged({ ...newValue, value: `${newValue.value}` })
        }
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        min={1}
      />

      <div className="d-flex flex-wrap">
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="fromDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.from_date || ''}
            helperText={(errors.from_date && errors.from_date.message) || undefined}
            error={(errors.from_date && errors.from_date.error) || false}
            label={t(`${translationPath}from-date`)}
            onChange={(date) => {
              if (date.value !== 'Invalid date')
                onStateChanged({ id: 'from_date', value: date.value });
              else onStateChanged({ id: 'from_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0 mb-0"
          />
        </div>
        <div className="w-50 w-t-50 w-p-100 px-2 mb-3">
          <DatePickerComponent
            idRef="toDateRef"
            minDate=""
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.to_date || ''}
            helperText={(errors.to_date && errors.to_date.message) || undefined}
            error={(errors.to_date && errors.to_date.error) || false}
            label={t(`${translationPath}to-date`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'to_date', value: date.value });
              else onStateChanged({ id: 'to_date', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0 mb-0"
          />
        </div>
      </div>

      <SharedInputControl
        errors={errors}
        isFullWidth
        title="note"
        isSubmitted={isSubmitted}
        stateKey="note"
        errorPath="note"
        onValueChanged={onStateChanged}
        editValue={state.note}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        multiline
        rows={2}
        wrapperClasses="px-2"
      />

      <SharedUploaderControl
        editValue={state?.media_data || []}
        onValueChanged={(uploaded) => {
          const uploadedValue = (uploaded.value?.length && uploaded.value) || [];
          onStateChanged({
            id: 'media_uuids',
            value: uploaded.value
              ? (uploadedValue.length && uploadedValue.map((val) => val.uuid))
                || uploadedValue
              : uploaded,
          });
          onStateChanged({
            id: 'media_data',
            value: uploadedValue,
          });
        }}
        stateKey="media_data"
        labelValue="media-uuids"
        isSubmitted={isSubmitted}
        errors={errors}
        errorPath="media_data"
        labelClasses="theme-primary"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        fileTypeText="files"
        isFullWidth
        uploaderPage={UploaderPageEnum.EmployeeProfile}
        multiple
      />
    </div>
  );
};

CourseForm.propTypes = {
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

CourseForm.defaultProps = {
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
