import React from 'react';
import PropTypes from 'prop-types';
import { AvatarsComponent } from '../../../../../../components';
import i18next from 'i18next';

export const AssistedByTab = ({
  parentTranslationPath,
  translationPath,
  profileData,
}) => (
  <div className="assigned-tab-wrapper tab-content-wrapper p-3">
    {profileData?.assisted?.map((item) => (
      <div key={item.uuid} className="mb-4">
        <div className="d-flex-v-center mt-3">
          <div>
            <AvatarsComponent
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              idRef="ProfileMemberAvatarRef"
              isSingle
              avatars={[
                {
                  url: '',
                  name: `${
                    (item.name && (item.name[i18next.language] || item.name.en))
                    || 'N/A'
                  }`,
                  first_name: '',
                  last_name: '',
                },
              ]}
              sizes={30}
            />
          </div>
          <span className="mx-2">{`${
            (item.name && (item.name[i18next.language] || item.name.en)) || 'N/A'
          }`}</span>
        </div>
      </div>
    ))}
  </div>
);

AssistedByTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  profileData: PropTypes.shape({
    journey: PropTypes.instanceOf(Array),
    assisted: PropTypes.instanceOf(Array),
    assigned: PropTypes.instanceOf(Array),
  }).isRequired,
};
