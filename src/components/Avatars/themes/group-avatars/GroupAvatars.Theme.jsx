import React from 'react';
import PropTypes from 'prop-types';
import AvatarGroup from '@mui/material/AvatarGroup';
import { LoadableImageComponant } from '../../../LoadableImage/LoadableImage.Componant';
import Avatar from '@mui/material/Avatar';
import { StringToColor } from '../../../../helpers';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { TooltipsComponent } from '../../../Tooltips/Tooltips.Component';

export const GroupAvatarsTheme = ({
  avatars,
  avatarImageAlt,
  titleComponent,
  idRef,
  defaultImage,
  onGroupClicked,
  onEndBtnClicked,
  endBtnIcon,
  isDisabled,
  endBtnTitle,
  max,
  parentTranslationPath,
  translationPath,
  isSingle,
  getItemName,
  sizes,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const dimensions = {
    height: `${sizes}px !important`,
    width: `${sizes}px !important`,
    minWidth: `${sizes}px !important`,
    maxWidth: `${sizes}px !important`,
    minHeight: `${sizes}px !important`,
    maxHeight: `${sizes}px !important`,
  };

  return (
    <div className="group-avatars-theme">
      {!isSingle ? (
        <AvatarGroup
          max={max}
          onClick={(!isDisabled && onGroupClicked) || undefined}
        >
          {avatars
            && avatars.map(
              (item, index) =>
                ((item.url || !item.name) && (
                  <LoadableImageComponant
                    classes="avatar-image-wrapper"
                    tooltipTitle={getItemName(item)}
                    key={`avatarsItemsKeys${idRef}${index + 1}`}
                    alt={
                      getItemName(item) || t(`${translationPath}${avatarImageAlt}`)
                    }
                    src={item.url || defaultImage}
                  />
                )) || (
                  <TooltipsComponent
                    title={getItemName(item)}
                    key={`avatarsItemsKeys${idRef}${index + 1}`}
                    titleComponent={
                      (titleComponent && titleComponent({ item, index }))
                      || undefined
                    }
                    contentComponent={
                      <Avatar
                        className="avatar-item"
                        sx={{
                          backgroundColor: StringToColor(getItemName(item)),
                        }}
                      >
                        {getItemName(item)
                          .split(' ')
                          .map((word) => word[0]) || ''}
                      </Avatar>
                    }
                  />
                ),
            )}
        </AvatarGroup>
      ) : (
        avatars
        && avatars.map(
          (item, index) =>
            ((item.url || !item.name) && (
              <LoadableImageComponant
                classes="avatar-image-wrapper"
                tooltipTitle={getItemName(item)}
                key={`avatarsItemsKeys${idRef}${index + 1}`}
                alt={getItemName(item) || t(`${translationPath}${avatarImageAlt}`)}
                src={item.url || defaultImage}
                style={dimensions}
              />
            )) || (
              <TooltipsComponent
                title={getItemName(item)}
                key={`avatarsItemsKeys${idRef}${index + 1}`}
                titleComponent={
                  (titleComponent && titleComponent({ item, index })) || undefined
                }
                contentComponent={
                  <Avatar
                    sizes="medium"
                    className="avatar-item"
                    sx={{
                      backgroundColor: StringToColor(getItemName(item)),
                      ...dimensions,
                    }}
                  >
                    {getItemName(item)
                      .split(' ')
                      .map((word) => word[0]) || ''}
                  </Avatar>
                }
              />
            ),
        )
      )}
      {(onEndBtnClicked
        || (onGroupClicked && (!avatars || avatars.length === 0))) && (
        <ButtonBase
          className={`btns${
            (!endBtnTitle && '-icon') || ''
          } theme-transparent avatar-end-btn-wrapper`}
          onClick={
            onEndBtnClicked
            || ((!avatars || avatars.length === 0) && onGroupClicked)
            || undefined
          }
          disabled={isDisabled}
        >
          <span className={endBtnIcon} />
          {endBtnTitle && (
            <span className="px-2">{t(`${translationPath}${endBtnTitle}`)}</span>
          )}
        </ButtonBase>
      )}
    </div>
  );
};

GroupAvatarsTheme.propTypes = {
  idRef: PropTypes.string.isRequired,
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
  getItemName: PropTypes.func.isRequired,
  onGroupClicked: PropTypes.func,
  onEndBtnClicked: PropTypes.func,
  endBtnIcon: PropTypes.string,
  endBtnTitle: PropTypes.string,
  isDisabled: PropTypes.bool,
  avatarImageAlt: PropTypes.string,
  defaultImage: PropTypes.node,
  max: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isSingle: PropTypes.bool,
  sizes: PropTypes.number,
};
