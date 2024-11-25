import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { ButtonBase, Chip } from '@mui/material';
import { AvatarsComponent, TabsComponent } from 'components';
import { JourneyDrawerTabs } from './tabs/JourneyDrawer.Tabs';
import { GetOnboardingMemberDetails } from '../../../../../services';
import { showError } from '../../../../../helpers';
import { useTranslation } from 'react-i18next';

export const ProfileDrawer = ({
  openedRatingDrawer,
  setOpenedRatingDrawer,
  parentTranslationPath,
  translationPath,
  activeItem,
  setActiveItem,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [activeTab, setActiveTab] = useState(0);
  const [profileDrawerTabsData] = useState(() => JourneyDrawerTabs);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    journey: [],
    assisted: [],
    assigned: [],
  });

  const getOnboardingMemberDetails = useCallback(async () => {
    setIsLoading(true);
    const response = await GetOnboardingMemberDetails({
      member_uuid: activeItem?.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      const { journey = {}, assisted = [], assigned = [] } = response.data.results;
      const { spaces = [], folders = [], flows = [] } = journey;
      const flattenedJourney = [
        ...spaces.flatMap(({ folders = [], flows = [], ...space }) => [
          ...folders.flatMap(({ flows = [], folder }) =>
            flows.map((flow) => ({ space, folder, ...flow })),
          ),
          ...flows.map((flow) => ({ space, ...flow })),
        ]),
        ...folders.flatMap(({ flows = [], folder }) =>
          flows.map((flow) => ({ folder, ...flow })),
        ),
        ...flows,
      ];
      setProfileData({ journey: flattenedJourney, assisted, assigned });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t, activeItem]);

  useEffect(() => {
    if (activeItem) getOnboardingMemberDetails();
  }, [getOnboardingMemberDetails, activeItem]);

  return (
    <Drawer
      anchor="right"
      open={openedRatingDrawer}
      onClose={() => {
        setOpenedRatingDrawer(false);
        setActiveItem(null);
      }}
      hideBackdrop
      className="pipeline-details-section-wrapper section-wrapper"
    >
      <div className="my-2" style={{ width: '100%' }}>
        <div className="drawer-header d-flex-v-center-h-between">
          <div className="d-flex-v-center">
            <ButtonBase
              className="btns-icon theme-transparent mx-3"
              onClick={() => {
                setOpenedRatingDrawer(false);
                setActiveItem(null);
              }}
            >
              <span className="fas fa-angle-double-right" />
            </ButtonBase>
            <div>{activeItem?.member || 'Profile Name'}</div>
          </div>
          <ButtonBase
            className="btns-icon theme-transparent mx-3"
            onClick={() => {
              setOpenedRatingDrawer(false);
              setActiveItem(null);
            }}
            disabled
          >
            <span className="fas fa-ellipsis-h" />
          </ButtonBase>
        </div>
        <div>
          <div className="d-flex-column">
            <div className="d-flex-h-center">
              <div className="d-flex-column-center p-3">
                <AvatarsComponent
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  idRef="ProfileMemberAvatarRef"
                  isSingle
                  avatars={[
                    {
                      url: '',
                      name: `${activeItem?.member}`,
                      first_name: '',
                      last_name: '',
                    },
                  ]}
                  sizes={100}
                />
                <div className="my-3 px-3">{activeItem?.email}</div>
                <Chip
                  className="mb-1 ml-3"
                  label={activeItem?.spaces}
                  size="small"
                  sx={{ width: 'fit-content', borderRadius: 0 }}
                />
              </div>
            </div>
            <div className="profile-tab-outer-wrapper">
              <TabsComponent
                isPrimary
                isWithLine
                isDisabled={isLoading}
                customLabel="members"
                labelInput="label"
                idRef="membersTabsRef"
                tabsContentClasses="pt-3"
                data={profileDrawerTabsData}
                currentTab={activeTab}
                translationPath={translationPath}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                dynamicComponentProps={{
                  parentTranslationPath,
                  translationPath,
                  activeItem,
                  profileData,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
ProfileDrawer.propTypes = {
  openedRatingDrawer: PropTypes.bool.isRequired,
  setOpenedRatingDrawer: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  activeItem: PropTypes.shape({
    member: PropTypes.string,
    spaces: PropTypes.string,
    uuid: PropTypes.string,
    email: PropTypes.string,
  }),
  setActiveItem: PropTypes.func.isRequired,
};
ProfileDrawer.defaultProps = {
  parentTranslationPath: undefined,
  translationPath: undefined,
};
