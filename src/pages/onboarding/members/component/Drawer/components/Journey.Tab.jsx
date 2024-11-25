import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  FormsAssistRoleTypesEnum,
  FormsForTypesEnum,
  FormsRolesEnum,
  FormsSubmissionsLevelsTypesEnum,
  NavigationSourcesEnum,
} from '../../../../../../enums';
import { GlobalHistory, showError } from '../../../../../../helpers';
import { GetOnboardingFlowURL } from '../../../../../../services';
import JourneyCardSection from './sections/JourneyCard.Section';

export const JourneyTab = ({
  parentTranslationPath,
  translationPath,
  activeItem,
  profileData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoadingLink, setIsLoadingLink] = useState(false);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to generate the redirect link to form for each flow
   * */
  const onJourneyCardClicked = useCallback(
    ({ uuid }) =>
      async () => {
        if (!activeItem) return;
        setIsLoadingLink(true);
        const response = await GetOnboardingFlowURL({
          uuid,
          forType: FormsForTypesEnum.SystemUser.key,
          email: activeItem.email,
          type_of_submission: FormsSubmissionsLevelsTypesEnum.FormLevel.key,
          editor_role: FormsRolesEnum.InvitedMembers.key,
          role_type: FormsAssistRoleTypesEnum.Viewer.key,
        });
        setIsLoadingLink(false);
        if (response && response.status === 200)
          GlobalHistory.push(
            `${response.data.results.form_link}&source=${NavigationSourcesEnum.OnboardingMembersToFormBuilder.key}`,
          );
        else showError(t(`${translationPath}generate-form-link-failed`), response);
      },
    [activeItem, t, translationPath],
  );

  return (
    <div className="journey-tab-wrapper tab-content-wrapper p-3">
      {profileData.journey.map((item) => (
        <JourneyCardSection
          key={`flowCardKey${item.uuid}-${item.space?.uuid || ''}-${
            item.folder?.uuid || ''
          }`}
          item={item}
          isGlobalLoading={isLoadingLink}
          onJourneyCardClicked={onJourneyCardClicked}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      ))}
    </div>
  );
};

JourneyTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  profileData: PropTypes.shape({
    journey: PropTypes.instanceOf(Array),
    assisted: PropTypes.instanceOf(Array),
    assigned: PropTypes.instanceOf(Array),
  }).isRequired,
};
