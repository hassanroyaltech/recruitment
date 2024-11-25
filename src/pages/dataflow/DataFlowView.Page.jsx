// Import React Components
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import './DataFlowPage.Style.scss';
import { GetDataFlowCase } from 'services';
import {
  // SharedInputControl,
  SetupsReducer,
  SetupsReset,
} from 'pages/setups/shared';
// import { ButtonBase } from '@mui/material';
import {
  // showSuccess,
  showError,
} from 'helpers';
import PersonalDetailsSection from './sections/PersonalDetails.Section';
import LicensingAuthoritySection from './sections/LicensingAuthority.Section';
import EducationDetailsSection from './sections/EducationDetails.Section';
import EmploymentDetailsSection from './sections/EmploymentDetails.Section';
import HealthLicenseDetailsSection from './sections/HealthLicenseDetails.Section';
import PropTypes from 'prop-types';

const parentTranslationPath = 'DataFlowPage';

const DataFlowViewPage = ({ activeItem }) => {
  // const { t } = useTranslation(parentTranslationPath);
  // const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const stateInitRef = useRef({
    DFREFNUMBER: '',
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

  const GetDataFlowCaseHandler = useCallback(async ({ DFREFNUMBER }) => {
    setIsSubmitted(true);
    // setIsLoading(true);
    const res = await GetDataFlowCase({ DFREFNUMBER });
    // setIsLoading(false);
    if (res.status === 200)
      // showSuccess('Candidate case details is fetched successfully!');
      onStateChanged({ id: 'edit', value: { ...res.data?.CASES, DFREFNUMBER } });
    else {
      showError('Failed to get case details!');
      onStateChanged({ id: 'edit', value: { DFREFNUMBER } });
    }
  }, []);

  useEffect(() => {
    if (activeItem) {
      onStateChanged({ id: 'DFREFNUMBER', value: activeItem?.DFREFNUMBER });
      GetDataFlowCaseHandler({ DFREFNUMBER: activeItem?.DFREFNUMBER });
    }
  }, [GetDataFlowCaseHandler, activeItem]);

  return (
    <div className="m-4">
      {/* <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t('view-case-details')}
        </span>
        <span className="description-text">
          {t('view-case-description')}
        </span>
      </div> */}
      {/* <div className='d-flex my-4'>
        <SharedInputControl
          isHalfWidth
          title="data-flow-ref-number"
          isSubmitted={isSubmitted}
          stateKey="DFREFNUMBER"
          errorPath="DFREFNUMBER"
          onValueChanged={onStateChanged}
          editValue={state.DFREFNUMBER}
          parentTranslationPath={parentTranslationPath}
          wrapperClasses='m-0'
        />
        <ButtonBase
          onClick={()=> GetDataFlowCaseHandler()}
          className="btns theme-solid p-2 my-2"
          disabled={!state.DFREFNUMBER}
        >
          <span>{t('get-case-details')}</span>
        </ButtonBase>
      </div> */}
      {isSubmitted && (
        <div className="m-2">
          {state.personal?.firstname && (
            <PersonalDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isView
            />
          )}
          {state.referential?.case_type && (
            <LicensingAuthoritySection
              parentTranslationPath={parentTranslationPath}
              state={state}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isView
            />
          )}
          {state.education?.[0]?.authority_name && (
            <EducationDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isView
            />
          )}
          {state.employment?.authority_name && (
            <EmploymentDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isView
            />
          )}
          {state.health?.authority_name && (
            <HealthLicenseDetailsSection
              parentTranslationPath={parentTranslationPath}
              state={state}
              isSubmitted={isSubmitted}
              onStateChanged={onStateChanged}
              isView
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DataFlowViewPage;

DataFlowViewPage.propTypes = {
  activeItem: PropTypes.shape({
    DFREFNUMBER: PropTypes.string,
  }),
};

DataFlowViewPage.defaultProps = {
  activeItem: undefined,
};
