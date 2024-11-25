import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';
import './TeamMembersContents.Style.scss';
import {
  TeamMembersInputControl,
  TeamMembersPagesAutocompleteControl,
  TeamMembersTypeAutocompleteControl,
} from './controls';
import {
  NavigationInternalPagesEnum,
  NavigationLinkTypesEnum,
} from '../../../../../../enums';
import { GetSectionTitle } from '../../../../helpers';

export const TeamMembersContentsTab = ({
  sections,
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isAdvancedMode,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [teamMembersToSectionData] = useState(() =>
    sections
      .filter((item) => item.uuid && item.uuid !== state.uuid)
      .map((item) => ({
        key: item.uuid,
        value:
          GetSectionTitle(sections, item, parentTranslationPath)
          || item.section_title,
      })),
  );
  // eslint-disable-next-line max-len
  const [teamMembersToInternalPageData] = useState(() =>
    Object.values(NavigationInternalPagesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  return (
    <div className="team-members-contents-wrapper tab-wrapper pt-3">
      <ControlsForSectionsShared
        state={state}
        onStateChanged={onStateChanged}
        errors={errors}
        isSubmitted={isSubmitted}
        isWithColorPicker
        isWithHeaderTitle
        isWithSubheaderTitle
        isWithBackgroundImg
        isAdvancedMode={isAdvancedMode}
        parentTranslationPath={parentTranslationPath}
      />
      <TeamMembersTypeAutocompleteControl
        editValue={state.section_data.link_type}
        onValueChanged={onStateChanged}
        isSubmitted={isSubmitted}
        stateKey="link_type"
        parentId="section_data"
        errors={errors}
        linkStateKey="link"
        linkValue={state.section_data.link}
        title="link-type"
        placeholder="select-link-type"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {state.section_data.link_type === NavigationLinkTypesEnum.HtmlId.key && (
        <TeamMembersPagesAutocompleteControl
          data={teamMembersToSectionData}
          editValue={state.section_data.link}
          onValueChanged={onStateChanged}
          isSubmitted={isSubmitted}
          stateKey="link"
          parentId="section_data"
          errors={errors}
          title="section"
          placeholder="select-section"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {state.section_data.link_type === NavigationLinkTypesEnum.InternalPage.key && (
        <TeamMembersPagesAutocompleteControl
          data={teamMembersToInternalPageData}
          editValue={state.section_data.link}
          onValueChanged={onStateChanged}
          isSubmitted={isSubmitted}
          stateKey="link"
          parentId="section_data"
          errors={errors}
          title="internal-page"
          placeholder="select-internal-page"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
      {state.section_data.link_type === NavigationLinkTypesEnum.Hyperlink.key && (
        <TeamMembersInputControl
          editValue={state.section_data.link || ''}
          onValueChanged={onStateChanged}
          isSubmitted={isSubmitted}
          stateKey="link"
          parentId="section_data"
          errors={errors}
          title="link"
          placeholder="link-example"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

TeamMembersContentsTab.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
