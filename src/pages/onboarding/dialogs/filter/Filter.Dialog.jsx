// React and reactstrap
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import ButtonBase from '@mui/material/ButtonBase';

import { StandardModalFrame } from 'components/Modals/StandardModalFrame';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
} from '../../../setups/shared';
import { DynamicFormTypesEnum } from '../../../../enums';
import { GetAllJobsAccountLevel, GetAllSetupsUsers } from '../../../../services';

const translationPath = '';
const parentTranslationPath = 'OnboardingPage';

export const FilterModal = memo(({ isOpen, onClose, onApply, filterEditValue }) => {
  const { t } = useTranslation(parentTranslationPath);

  const stateInitRef = useRef({
    recruiter_uuid: '',
    job_uuid: '',
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  useEffect(() => {
    if (filterEditValue && Object.keys(filterEditValue).length)
      onStateChanged({ id: 'edit', value: filterEditValue });
  }, [filterEditValue]);
  const getDisplayedLabel = useMemo(
    () => (option) =>
      option.value
      || (option.title && (option.title[i18next.language] || option.title.en))
      || (option.name && (option.name[i18next.language] || option.name.en))
      || `${
        option.first_name
        && (option.first_name[i18next.language] || option.first_name.en)
      }${
        option.last_name
        && ` ${option.last_name[i18next.language] || option.last_name.en}`
      }`,
    [],
  );
  const applyFilters = () => {
    onApply(state);
  };
  return (
    <StandardModalFrame
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      modalTitle={t(`${translationPath}filters`)}
      closeOnClick={onClose}
    >
      <div className="filters-dialog-wrapper px-5 pb-3">
        <div className="h6 font-weight-normal text-gray">
          {t(`${translationPath}filter-results-based-on-the-below`)}
        </div>
        <div className="my-2">
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title={t(`job`)}
            placeholder={t(`select-job`)}
            stateKey="job_uuid"
            onValueChanged={onStateChanged}
            idRef="jobUUIDRef"
            getOptionLabel={(option) => option?.title || ''}
            type={DynamicFormTypesEnum.select.key}
            getDataAPI={GetAllJobsAccountLevel}
            parentTranslationPath={parentTranslationPath}
            searchKey="query"
            editValue={state?.job_uuid?.uuid}
            extraProps={{
              with_than: (state.job_uuid?.uuid && [state?.job_uuid?.uuid]) || null,
            }}
          />
          <SharedAPIAutocompleteControl
            isEntireObject
            isHalfWidth
            title={t(`recruiter`)}
            placeholder={t(`select-recruiter`)}
            stateKey="recruiter_uuid"
            onValueChanged={onStateChanged}
            idRef="recruiterUUIDRef"
            type={DynamicFormTypesEnum.select.key}
            getOptionLabel={(option) => getDisplayedLabel(option)}
            getDataAPI={GetAllSetupsUsers}
            parentTranslationPath={parentTranslationPath}
            searchKey="search"
            editValue={state?.recruiter_uuid?.uuid}
            extraProps={{
              all_users: 1,
              with_than:
                (state.recruiter_uuid?.uuid && [state?.recruiter_uuid?.uuid])
                || null,
            }}
          />
        </div>

        <div className="mt-5 d-flex justify-content-center">
          <ButtonBase
            className="btns theme-solid mx-3 mb-2"
            style={{ width: 220 }}
            onClick={() => {
              applyFilters();
            }}
          >
            {t(`${translationPath}apply-filters`)}
          </ButtonBase>
        </div>
      </div>
    </StandardModalFrame>
  );
});

FilterModal.displayName = 'FilterModal';

FilterModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
  filterEditValue: PropTypes.shape({}),
};

FilterModal.defaultProps = {
  isOpen: undefined,
  onClose: undefined,
  onApply: undefined,
  isWithCheckboxes: undefined,
  isWithSliders: undefined,
  filterEditValue: undefined,
};
