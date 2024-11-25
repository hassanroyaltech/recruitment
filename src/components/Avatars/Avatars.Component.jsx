import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Avatars.Style.scss';
import i18next from 'i18next';
import defaultUserImage from '../../assets/icons/user-avatar.svg';
// noinspection ES6PreferShortImport
import { AvatarsThemesEnum } from '../../enums/Shared/AvatarsThemes.Enum';

export const AvatarsComponent = ({
  avatarTheme,
  avatars,
  titleComponent,
  avatarImageAlt,
  idRef,
  defaultImage,
  onGroupClicked,
  onEndBtnClicked,
  endBtnIcon,
  isDisabled,
  endBtnTitle,
  max,
  onTagBtnClicked,
  tagBtnIcon,
  tagBtnTitle,
  avatar,
  iconClasses,
  parentTranslationPath,
  translationPath,
  isSingle,
  sizes,
}) => {
  /**
   * @param item - the return item from data source
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the item name
   */
  const getItemName = useCallback(
    (item) =>
      (item.name && (item.name[i18next.language] || item.name.en || item.name))
      || (typeof item?.first_name === 'string'
        && `${item?.first_name || ''} ${item?.last_name || ''}`)
      || (item.title
        && (item.title[i18next.language] || item.title.en || item.title))
      || `${
        item.first_name && (item.first_name[i18next.language] || item.first_name.en)
      }${
        item.last_name
        && ` ${item.last_name[i18next.language] || item.last_name?.en || ''}`
      }`
      || '',
    [],
  );

  const getAvatarTheme = useMemo(() => {
    const LocalComponent = avatarTheme;
    const localProps = {
      avatars,
      avatarImageAlt,
      idRef,
      iconClasses,
      defaultImage,
      onGroupClicked,
      onEndBtnClicked,
      endBtnIcon,
      isDisabled,
      endBtnTitle,
      max,
      getItemName,
      onTagBtnClicked,
      tagBtnIcon,
      titleComponent,
      tagBtnTitle,
      avatar,
      parentTranslationPath,
      translationPath,
      isSingle,
      sizes,
    };
    return <LocalComponent {...localProps} />;
  }, [
    avatar,
    avatarImageAlt,
    avatarTheme,
    avatars,
    defaultImage,
    endBtnIcon,
    endBtnTitle,
    getItemName,
    iconClasses,
    idRef,
    isDisabled,
    isSingle,
    max,
    onEndBtnClicked,
    onGroupClicked,
    onTagBtnClicked,
    parentTranslationPath,
    sizes,
    tagBtnIcon,
    tagBtnTitle,
    titleComponent,
    translationPath,
  ]);

  return (
    <div className="avatars-component-wrapper component-wrapper">
      {getAvatarTheme}
    </div>
  );
};

AvatarsComponent.propTypes = {
  idRef: PropTypes.string,
  iconClasses: PropTypes.string,
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
      first_name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Object),
      ]),
      last_name: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Object),
      ]),
    }),
  ),
  titleComponent: PropTypes.func,
  onGroupClicked: PropTypes.func,
  onEndBtnClicked: PropTypes.func,
  endBtnIcon: PropTypes.string,
  endBtnTitle: PropTypes.string,
  isDisabled: PropTypes.bool,
  avatarImageAlt: PropTypes.string,
  defaultImage: PropTypes.node,
  max: PropTypes.number,
  onTagBtnClicked: PropTypes.func,
  tagBtnIcon: PropTypes.string,
  tagBtnTitle: PropTypes.string,
  avatar: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isSingle: PropTypes.bool,
  sizes: PropTypes.number,
  avatarTheme: PropTypes.oneOf(
    Object.values(AvatarsThemesEnum).map((item) => item.theme),
  ),
};
AvatarsComponent.defaultProps = {
  avatarImageAlt: 'users',
  endBtnIcon: 'fas fa-plus',
  defaultImage: defaultUserImage,
  isSingle: false,
  avatarTheme: AvatarsThemesEnum.GroupAvatars.theme,
  tagBtnIcon: 'fas fa-times',
  iconClasses: 'fz-before-18px',
};
