import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Avatar, ButtonBase, Chip } from '@mui/material';
// import ElevatusImage from '../../../assets/images/shared/Elevatus-blu.png';
import { TabsComponent } from 'components';
import { ProviderRatingDrawerTabs } from 'pages/setups/shared/tabs-data/ProviderRatingDrawer.Tabs';
import { getSetupsProvidersById } from 'services/Providers.Services';
import { useSelector } from 'react-redux';

export const ProviderRatingDrawer = ({
  openedRatingDrawer,
  setOpenedRatingDrawer,
  parentTranslationPath,
  translationPath,
  activeProvider,
  userType,
  setActiveItem,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [providerRatingDrawerTabsData] = useState(() => ProviderRatingDrawerTabs);
  const [selectedProviderData, setSelectedProviderData] = useState(null);
  const [filter, setFilter] = useState({});

  const GetProviderByIdHandler = useCallback(async () => {
    const response = await getSetupsProvidersById({
      provider_uuid: activeProvider?.uuid,
    });
    if (response && response.status === 200)
      setSelectedProviderData(response.data?.results);
  }, [activeProvider]);

  useEffect(() => {
    if (activeProvider) GetProviderByIdHandler();
  }, [GetProviderByIdHandler, activeProvider, filter]);

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
            <div>{activeProvider?.name || 'Provider name'}</div>
          </div>
          {/* <ButtonBase 
            className="btns-icon theme-transparent mx-3"
            onClick={()=> {
              setOpenedRatingDrawer(false)
              setActiveItem(null)
            }}
            disabled
          >
            <span className="fas fa-ellipsis-h" />
          </ButtonBase> */}
        </div>
        <div className="">
          <div className="d-flex-column">
            <div className="m-2 p-3">
              <Avatar
                alt="company logo"
                src={selectedProviderData?.account_logo_url}
                sx={{
                  bgcolor: '#DCDCF8',
                  color: '#484964',
                  width: '6rem!important',
                  height: '6rem!important',
                }}
              />
              <div className="my-2">{activeProvider?.email}</div>
              <Chip
                label={userType}
                size="small"
                sx={{ width: 'fit-content', borderRadius: 0, marginBottom: '1rem' }}
              />
            </div>
            <div className="provider-profile-tab-outer-wrapper">
              <TabsComponent
                isPrimary
                isWithLine
                customLabel={`invite-member`}
                labelInput="label"
                idRef="providerTabsRef"
                tabsContentClasses="pt-3"
                data={providerRatingDrawerTabsData}
                currentTab={activeTab}
                translationPath={translationPath}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                dynamicComponentProps={{
                  parentTranslationPath,
                  translationPath,
                  activeItem: activeProvider,
                  userType,
                  selectedProviderData,
                  setFilter,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

ProviderRatingDrawer.propTypes = {
  openedRatingDrawer: PropTypes.bool.isRequired,
  setOpenedRatingDrawer: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  activeProvider: PropTypes.shape({
    user_uuid: PropTypes.string,
    uuid: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
  userType: PropTypes.oneOf(['univeristy', 'agency']).isRequired,
  setActiveItem: PropTypes.func.isRequired,
};
ProviderRatingDrawer.defaultProps = {
  parentTranslationPath: undefined,
  translationPath: undefined,
};
