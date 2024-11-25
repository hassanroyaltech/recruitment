import React from 'react';
import PropTypes from 'prop-types';
import { SocialMediaInputControl } from './controls';
import './SocialMedia.Style.scss';

// shared component for eva-brand social media inputs
export const SocialMediaShared = ({
  onValueChanged,
  isSubmitted,
  parentId,
  subParentId,
  subParentItem,
  index,
  errors,
  socialMediaKey,
  parentTranslationPath,
  translationPath,
  isWithFacebook,
  isWithLinkedin,
  isWithYoutube,
  isWithTwitter,
  isWithSnapchat,
  isWithInstagram,
  isWithWebsite,
}) => (
  <div className="social-media-shared-wrapper shared-wrapper">
    {isWithFacebook && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.facebook)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="facebook"
        title="facebook"
        inputPlaceholder="facebook-example"
        socialMediaIcon="fab fa-facebook-square"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithLinkedin && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.linkedin)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="linkedin"
        title="linkedin"
        inputPlaceholder="linkedin-example"
        socialMediaIcon="fab fa-linkedin"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithYoutube && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.youtube)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="youtube"
        title="youtube"
        inputPlaceholder="youtube-example"
        socialMediaIcon="fab fa-youtube"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithTwitter && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.twitter)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="twitter"
        title="twitter"
        inputPlaceholder="twitter-example"
        socialMediaIcon="fab fa-twitter-square"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithSnapchat && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.snapchat)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="snapchat"
        title="snapchat"
        inputPlaceholder="snapchat-example"
        socialMediaIcon="fab fa-snapchat-square"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithInstagram && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.instagram)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="instagram"
        title="instagram"
        inputPlaceholder="instagram-example"
        socialMediaIcon="fab fa-instagram-square"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
    {isWithWebsite && (
      <SocialMediaInputControl
        editValue={
          (subParentItem
            && subParentItem.social_media
            && subParentItem.social_media.website)
          || ''
        }
        index={index}
        parentId={parentId}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        subParentItem={subParentItem}
        subParentId={subParentId}
        onValueChanged={onValueChanged}
        errors={errors}
        stateKey="website"
        title="website"
        inputPlaceholder="website-example"
        socialMediaIcon="fas fa-globe"
        socialMediaKey={socialMediaKey}
        translationPath={translationPath}
      />
    )}
  </div>
);

SocialMediaShared.propTypes = {
  onValueChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  subParentItem: PropTypes.instanceOf(Object).isRequired,
  index: PropTypes.number,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  socialMediaKey: PropTypes.string,
  isWithFacebook: PropTypes.bool,
  isWithLinkedin: PropTypes.bool,
  isWithYoutube: PropTypes.bool,
  isWithTwitter: PropTypes.bool,
  isWithSnapchat: PropTypes.bool,
  isWithInstagram: PropTypes.bool,
  isWithWebsite: PropTypes.bool,
};

SocialMediaShared.defaultProps = {
  parentId: undefined,
  subParentId: undefined,
  index: undefined,
  isWithFacebook: false,
  isWithLinkedin: false,
  isWithYoutube: false,
  isWithTwitter: false,
  isWithSnapchat: false,
  isWithInstagram: false,
  isWithWebsite: false,
  socialMediaKey: 'social_media',
  translationPath: 'SocialMediaShared.',
};
