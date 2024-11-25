import React from 'react';
import PropTypes from 'prop-types';
import { LoadableImageComponant } from '../../../LoadableImage/LoadableImage.Componant';
import Avatar from '@mui/material/Avatar';
import { StringToColor } from '../../../../helpers';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './TagAvatar.Style.scss';

export const TagAvatarTheme = ({
  avatar,
  avatarImageAlt,
  onTagBtnClicked,
  iconClasses,
  tagBtnTitle,
  isDisabled,
  tagBtnIcon,
  parentTranslationPath,
  translationPath,
  getItemName,
  defaultImage,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="tag-avatar-wrapper">
      <div className="d-inline-flex-v-center">
        {(avatar.icon && (
          <span
            className={`${avatar.icon}${
              (avatar.iconClasses && ` ${avatar.iconClasses}`) || ''
            }${(iconClasses && ` ${iconClasses}`) || ''}`}
          />
        ))
          || ((avatar.url || !getItemName(avatar)) && (
            <LoadableImageComponant
              classes="avatar-image-wrapper"
              alt={getItemName(avatar) || t(`${translationPath}${avatarImageAlt}`)}
              src={avatar.url || defaultImage}
            />
          )) || (
          <Avatar
            className="avatar-item"
            sx={{
              backgroundColor: StringToColor(avatar.name || getItemName(avatar)),
            }}
          >
            {getItemName(avatar)
              .split(' ')
              .map((word) => word[0]) || ''}
          </Avatar>
        )}
        <span className="px-2">{getItemName(avatar) || 'N/A'}</span>
      </div>
      {onTagBtnClicked && (
        <ButtonBase
          className={`btns${
            (!tagBtnTitle && '-icon') || ''
          } theme-outline avatar-tab-btn-wrapper`}
          disabled={isDisabled}
          onClick={onTagBtnClicked}
        >
          <span className={tagBtnIcon} />
          {tagBtnTitle && (
            <span className="px-2">{t(`${translationPath}${tagBtnTitle}`)}</span>
          )}
        </ButtonBase>
      )}
    </div>
  );
};

TagAvatarTheme.propTypes = {
  avatar: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    icon: PropTypes.string,
    iconClasses: PropTypes.string,
  }).isRequired,
  iconClasses: PropTypes.string,
  getItemName: PropTypes.func.isRequired,
  onTagBtnClicked: PropTypes.func,
  tagBtnIcon: PropTypes.string,
  tagBtnTitle: PropTypes.string,
  isDisabled: PropTypes.bool,
  avatarImageAlt: PropTypes.string,
  defaultImage: PropTypes.node,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
