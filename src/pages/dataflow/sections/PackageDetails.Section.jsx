// Import React Components
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from 'pages/setups/shared';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GetDataFlowDropdown } from 'services';
import PropTypes from 'prop-types';

const translationPath = 'PackageDetails.';

const PackageDetailsSection = ({
  parentTranslationPath,
  state,
  errors,
  isSubmitted,
  onStateChanged,
  isLoading,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="section-item-wrapper w-100">
      <div className="section-item-title">
        {t(`${translationPath}package-details`)}
      </div>
      <SharedAPIAutocompleteControl
        isEntireObject
        isHalfWidth
        errors={errors}
        title="package"
        searchKey="search"
        errorPath="package"
        placeholder="package"
        // isDisabled={isLoading}
        stateKey="package"
        isSubmitted={isSubmitted}
        onValueChanged={onStateChanged}
        getDataAPI={GetDataFlowDropdown}
        extraProps={{
          // ...(state.package?.uuid && {
          //   with_than: [state.package?.uuid],
          // }),
          type: 'package',
        }}
        editValue={state.package?.uuid || ''}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option.name[i18next.language] || option.name.en}
        translationPath={translationPath}
      />
    </div>
  );
};

export default PackageDetailsSection;

PackageDetailsSection.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  state: PropTypes.shape({
    package: PropTypes.string,
  }),
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool,
  onStateChanged: PropTypes.func,
  isLoading: PropTypes.bool,
};

PackageDetailsSection.defaultProps = {
  state: undefined,
  errors: undefined,
  isSubmitted: false,
  onStateChanged: undefined,
  isLoading: false,
};
