import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Require from '../../../../Require';

export const GeneralTab = ({
  state,
  onStateChanged,
  isShowCategory,
  // isLoading,
  // translationPath,
  // parentTranslationPath,
  isSubmitted,
  errors,
}) => {
  const [keys, setKeys] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (
      state.activeCategoryRequirements
      && state.activeCategoryRequirements.profile
    ) {
      setKeys(Object.keys(state.activeCategoryRequirements.profile));
      setProfile({ ...state.activeCategoryRequirements.profile });
    } else {
      setKeys([]);
      setProfile({});
    }
  }, [state.activeCategoryRequirements, state.profile]);

  return (
    <div className="general-tab-wrapper tab-content-wrapper">
      {keys
        && keys
          .filter((item) =>
            !isShowCategory ? item?.toLowerCase() !== 'extra' : item,
          )
          ?.map((item) => (
            <Require
              response={profile}
              setNewResponse={(newValue) => {
                const localState = { ...state };
                const activeCategoriesRequirementsIndex
                  = localState.categoriesRequirements.findIndex(
                    (element) => element.category_uuid === localState.category_uuid,
                  );
                const changedRequirementsIndex
                  = localState.changedCategoriesRequirements.findIndex(
                    (element) => element.category_uuid === localState.category_uuid,
                  );

                // changedCategoriesRequirements
                localState.activeCategoryRequirements.profile = newValue;
                // eslint-disable-next-line operator-linebreak
                localState.categoriesRequirements[
                  activeCategoriesRequirementsIndex
                ] = localState.activeCategoryRequirements;
                const toSaveDto = {
                  ...localState.activeCategoryRequirements,
                  ...newValue,
                };
                if (toSaveDto.profile) delete toSaveDto.profile;
                if (changedRequirementsIndex !== -1)
                  localState.changedCategoriesRequirements[
                    changedRequirementsIndex
                  ] = toSaveDto;
                else localState.changedCategoriesRequirements.push(toSaveDto);
                if (onStateChanged)
                  onStateChanged({ id: 'edit', value: localState });
              }}
              options={item}
              label={profile[item]}
              key={item}
              isSubmitted={isSubmitted}
              errors={errors}
            />
          ))}
    </div>
  );
};

GeneralTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func,
  // isLoading: PropTypes.bool,
  // translationPath: PropTypes.string,
  // parentTranslationPath: PropTypes.string.isRequired,
};
GeneralTab.defaultProps = {
  onStateChanged: undefined,
  // isLoading: false,
  // translationPath: '',
};
