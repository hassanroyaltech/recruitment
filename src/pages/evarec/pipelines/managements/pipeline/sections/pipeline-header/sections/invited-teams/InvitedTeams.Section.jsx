import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import { LoadableImageComponant } from '../../../../../../../../../components';
import defaultUserImage from '../../../../../../../../../assets/icons/user-avatar.svg';
import { StringToColor } from '../../../../../../../../../helpers';
import './InvitedTeams.Style.scss';
import AvatarGroup from '@mui/material/AvatarGroup';

export const InvitedTeamsSection = ({
  invitedTeams,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="invited-teams-section-wrapper section-wrapper">
      <AvatarGroup max={4}>
        {invitedTeams
          && invitedTeams.map(
            (item, index) =>
              ((item.url || !item.name) && (
                <LoadableImageComponant
                  classes="user-image-wrapper"
                  tooltipTitle={item.name}
                  key={`invitedTeamsKeys${index + 1}`}
                  alt={item.name || t(`${translationPath}user-image`)}
                  src={item.url || defaultUserImage}
                />
              )) || (
                <Avatar
                  className="user-avatar-item"
                  key={`invitedTeamsKeys${index + 1}`}
                  style={{
                    backgroundColor: StringToColor(item.name),
                  }}
                >
                  {(item.name && item.name.split(' ').map((word) => word[0])) || ''}
                </Avatar>
              ),
          )}
      </AvatarGroup>
    </div>
  );
};

InvitedTeamsSection.propTypes = {
  invitedTeams: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
InvitedTeamsSection.defaultProps = {
  invitedTeams: undefined,
};
