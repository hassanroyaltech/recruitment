// Import React Components
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from 'pages/setups/shared';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GetDataFlowDropdown } from 'services';
import PropTypes from 'prop-types';

const translationPath = 'LicensingAuthority.';

const LicensingAuthoritySection = ({
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
        {t(`${translationPath}licensing-authority`)}
      </div>
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="application-type"
          searchKey="search"
          parentId="referential"
          errorPath="referential.application_type"
          placeholder="application-type"
          // isDisabled={isLoading}
          stateKey="application_type"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.referential?.application_type && {
            //   with_than: [state.referential?.application_type],
            // }),
            type: 'application_type',
          }}
          editValue={state.referential?.application_type?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="case-type"
          searchKey="search"
          parentId="referential"
          errorPath="referential.case_type"
          placeholder="case-type"
          // isDisabled={isLoading}
          stateKey="case_type"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.referential?.case_type && {
            //   with_than: [state.referential?.case_type],
            // }),
            type: 'case_type',
          }}
          editValue={state.referential?.case_type?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="category"
          searchKey="search"
          parentId="referential"
          errorPath="referential.category"
          placeholder="category"
          // isDisabled={isLoading}
          stateKey="category"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.referential?.category && {
            //   with_than: [state.referential?.category],
            // }),
            type: 'category',
          }}
          editValue={state.referential?.category?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="sub-category"
          searchKey="search"
          parentId="referential"
          errorPath="referential.sub_category"
          placeholder="sub-category"
          // isDisabled={isLoading}
          stateKey="sub_category"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.referential?.sub_category && {
            //   with_than: [state.referential?.sub_category],
            // }),
            type: 'sub_category',
          }}
          editValue={state.referential?.sub_category?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      {!isView && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isHalfWidth
          errors={errors}
          title="service-type"
          searchKey="search"
          parentId="referential"
          errorPath="referential.service_type"
          placeholder="service-type"
          // isDisabled={isLoading}
          stateKey="service_type"
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
          getDataAPI={GetDataFlowDropdown}
          extraProps={{
            // ...(state.referential?.service_type && {
            //   with_than: [state.referential?.service_type],
            // }),
            type: 'service_type',
          }}
          editValue={state.referential?.service_type?.uuid}
          parentTranslationPath={parentTranslationPath}
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          translationPath={translationPath}
        />
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {isView && state.referential?.application_type && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}application-type`)}</div>
            <div>{state.referential.application_type}</div>
          </div>
        )}
        {isView && state.referential?.case_type && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}case-type`)}</div>
            <div>{state.referential.case_type}</div>
          </div>
        )}
        {isView && state.referential?.category && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}category`)}</div>
            <div>{state.referential.category}</div>
          </div>
        )}
        {isView && state.referential?.sub_category && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}sub-category`)}</div>
            <div>{state.referential.sub_category}</div>
          </div>
        )}
        {isView && state.referential?.service_type && (
          <div className="w-50 mb-3">
            <div className="fw-bold">{t(`${translationPath}service-type`)}</div>
            <div>{state.referential.service_type}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LicensingAuthoritySection;

LicensingAuthoritySection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    referential: PropTypes.shape({
      application_type: PropTypes.string,
      case_type: PropTypes.string,
      category: PropTypes.string,
      sub_category: PropTypes.string,
      service_type: PropTypes.string,
    }),
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
  isView: PropTypes.bool,
};

LicensingAuthoritySection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
  isView: undefined,
};
