import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// import { Link } from 'react-router-dom';
import { Progress } from 'reactstrap';
import { AvatarList } from './AvatarsList';
import { TooltipsComponent } from '../../../../components';

// eslint-disable-next-line react/display-name
export const ActivityCard = memo(
  ({
    parentTranslationPath,
    translationPath,
    members,
    title,
    tags,
    total,
    performed,
    percent,
    onCompletedClicked,
    // uuid,
  }) => {
    const { t } = useTranslation(parentTranslationPath);

    // const [activitiesTypes]=useState(()=>OnboardingActivitiesTypesEnum)
    return (
      <div
        // to={`/forms?template_uuid=${uuid}`}
        className="p-3 activity-card d-flex-column justify-content-between "
      >
        <div>
          <div className="d-flex mb-1">
            <span className="far fa-dot-circle activity-type-icon"></span>
          </div>
          <TooltipsComponent
            title={title}
            contentComponent={
              <span className="d-inline-flex">
                <h1 className="title-wrapper c-black-light fw-normal">
                  {title || ''}
                </h1>
              </span>
            }
          />
          <div className="activity-tags d-flex flex-wrap gap-2 c-black-light font-14  ">
            {tags?.map((tag, index) => (
              <div key={`${tag}tag${index}`} className="activity-tag p-1">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div>
          <Progress className="flex-grow-1 p-0 mb-2" multi>
            <Progress bar className="progress-rate" value={percent || 0} />
          </Progress>
          <div className="d-flex-v-center gap-2 c-gray-primary">
            <AvatarList members={members} max={3} dimension={26} />
            <span className="pt-1 c-black-lighter ">{members?.length || 0}</span>
            <span className="pt-1 fas fa-circle dot-icon"> </span>
            <span
              className="pt-1  font-12"
              style={{ cursor: 'pointer' }}
              onKeyUp={() => {}}
              role="button"
              tabIndex={0}
              onClick={() => onCompletedClicked()}
            >
              {performed || 0}/{total || 0} {t(`${translationPath}Completed`)}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

ActivityCard.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string.isRequired),
  total: PropTypes.string.isRequired,
  performed: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  onCompletedClicked: PropTypes.func.isRequired,
  // uuid: PropTypes.string.isRequired,
};

ActivityCard.defaultProps = {};
