import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useOverlayedAvatarStyles } from '../../utils/constants/colorMaps';

/**
 * Create a list of Avatar letters
 * @param data
 * @param max
 * @returns {JSX.Element}
 * @constructor
 */
export default function AvatarList({ data, max }) {
  const classes = useOverlayedAvatarStyles();
  return (
    <div className="avatar-group">
      {data && data.length <= (max || 4) ? (
        data.map((user, i) => (
          <React.Fragment key={`usersAvatarKey${i + 1}`}>
            <div className={classes.root}>
              <LetterAvatar
                id={`user-${i}`}
                key={i}
                alt="user-profile"
                name={`${user.first_name} ${user.last_name}`}
              />
            </div>
            <UncontrolledTooltip target={`user-${i}`}>
              {`${user.first_name} ${user.last_name}`}
            </UncontrolledTooltip>
          </React.Fragment>
        ))
      ) : (
        <>
          {data.slice(0, max || 4).map((user, i) => (
            <React.Fragment key={`usersAvatarKey${i + 1}`}>
              <div className={classes.root}>
                <LetterAvatar
                  id={`user-${i}`}
                  key={i}
                  alt="user-profile"
                  name={`${user.first_name} ${user.last_name}`}
                />
              </div>
              <UncontrolledTooltip target={`user-${i}`}>
                {`${user.first_name} ${user.last_name}`}
              </UncontrolledTooltip>
            </React.Fragment>
          ))}
          <span className="avatar avatar-sm rounded-circle bg-gray font-12 font-weight-bold img-circle">
            {`+${data.length - 7}`}
          </span>
        </>
      )}
    </div>
  );
}
