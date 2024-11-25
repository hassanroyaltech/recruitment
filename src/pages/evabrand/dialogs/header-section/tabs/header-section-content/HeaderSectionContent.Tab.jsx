import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ControlsForSectionsShared } from '../../../shared/contols-for-sections';
import {
  HeaderSectionInputControl,
  HeaderSectionPagesAutocompleteControl,
  HeaderSectionTypeAutocompleteControl,
} from './controls';
import './HeaderSectionContent.Style.scss';
import {
  NavigationInternalPagesEnum,
  NavigationLinkTypesEnum,
} from '../../../../../../enums';
import { UploaderPageEnum } from '../../../../../../enums/Pages/UploaderPage.Enum';
import { SwitchComponent } from '../../../../../../components';
import { GetSectionTitle } from '../../../../helpers';

export const HeaderSectionContentsTab = ({
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
  const [headerSectionToSectionData] = useState(() =>
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
  const [headerSectionToInternalPageData] = useState(() =>
    Object.values(NavigationInternalPagesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  return (
    <div className="header-section-content tab-wrapper pt-3">
      <ControlsForSectionsShared
        state={state}
        onStateChanged={onStateChanged}
        errors={errors}
        isSubmitted={isSubmitted}
        isWithColorPicker
        isWithHeaderTitle
        isWithSubheaderTitle
        isWithBackgroundImg
        // isExternalUrl={state.isExternalUrl}
        // isWithExternalUrl
        isAdvancedMode={isAdvancedMode}
        uploaderLabelValue="upload-background-media"
        uploaderPage={UploaderPageEnum.HeaderSectionContentsTap}
        parentTranslationPath={parentTranslationPath}
      />
      <div className="switch-controls-wrapper control-wrapper">
        <div className="d-inline-flex">
          <SwitchComponent
            idRef="hasCallToActionSwitchRef"
            label={`${t(`${translationPath}show`)} ${
              (state.section_data && state.section_data.action_title)
              || t(`${translationPath}call-to-action`)
            }`}
            isChecked={
              (state.section_data && state.section_data.has_call_to_action) || false
            }
            isReversedLabel
            // isFlexEnd
            onChange={(event, newValue) => {
              onStateChanged({
                parentId: 'section_data',
                id: 'has_call_to_action',
                value: newValue,
              });
            }}
          />
        </div>
      </div>
      {state.section_data && state.section_data.has_call_to_action && (
        <>
          <HeaderSectionInputControl
            idRef="HeaderSectionInputCallToActionRef"
            editValue={(state.section_data && state.section_data.action_title) || ''}
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            errors={errors}
            parentId="section_data"
            stateKey="action_title"
            title="call-to-action"
            placeholder="call-to-action"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <HeaderSectionTypeAutocompleteControl
            editValue={state.section_data.link_type}
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            stateKey="link_type"
            parentId="section_data"
            errors={errors}
            linkStateKey="link"
            linkValue={state.section_data.link}
            title="action-link-type"
            placeholder="select-link-type"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          {state.section_data.link_type === NavigationLinkTypesEnum.HtmlId.key && (
            <HeaderSectionPagesAutocompleteControl
              data={headerSectionToSectionData}
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
          {state.section_data.link_type
            === NavigationLinkTypesEnum.InternalPage.key && (
            <HeaderSectionPagesAutocompleteControl
              data={headerSectionToInternalPageData}
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
          {state.section_data.link_type
            === NavigationLinkTypesEnum.Hyperlink.key && (
            <HeaderSectionInputControl
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
        </>
      )}
    </div>
  );
};

HeaderSectionContentsTab.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isAdvancedMode: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
