import { Avatar, Card } from '@mui/material';
import * as yup from 'yup';
import { TabsComponent } from 'components';
import { getErrorByName } from 'helpers';
import { SetupsReset, SetupsReducer } from 'pages/setups/shared';
import { ProviderProfileTabs } from 'pages/setups/shared/tabs-data/ProviderProfile.Tabs';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { GetProviderProfile } from 'services';
// import ElevatusImage from '../../../assets/images/shared/Elevatus-blu.png';
import PropTypes from 'prop-types';
import './ProviderProfile.scss';

const parentTranslationPath = 'ProviderPage';
const translationPath = 'ProviderProfilePage.';

/*
profile can be viewed from provider tabs directly so there is no active item or
it can be viewed from providers or members list,
when we are viewing providers profile we'll send user type according to the tab
*/
const ProviderProfilePage = ({ activeItem, source, userType }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [providerTabsData] = useState(() => ProviderProfileTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [reload, setReload] = useState({});
  const [show, setShow] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);

  const stateInitRef = useRef({
    first_name: '',
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          first_name: yup.string().nullable().required(t('this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  const GetProviderProfileHandler = useCallback(async () => {
    setIsLoading(true);
    const payload = activeItem
      ? {
        uuid: activeItem.uuid,
        member_type: activeItem.member_type,
        user_uuid: userReducer?.results?.user?.uuid,
        type: source === 'members' ? userReducer?.results?.user?.type : userType,
        is_other: true,
      }
      : {
        member_type: userReducer?.results?.user?.member_type,
        user_uuid: userReducer?.results?.user?.uuid,
        type: userReducer?.results?.user?.type,
        is_other: false,
      };
    const response = await GetProviderProfile(payload);
    setIsLoading(false);
    if (response && response.status === 200)
      if (response.data?.results === null) {
        setShow(false);
        setShowMsg(true);
      } else {
        setState({ id: 'edit', value: { ...response.data?.results } });
        setShow(true);
        setShowMsg(false);
      }
  }, [activeItem, source, userReducer, userType]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    GetProviderProfileHandler();
  }, [GetProviderProfileHandler, reload]);

  return (
    <div className="m-4 d-flex-column-center">
      <Card sx={{ width: '100%', margin: '1rem' }}>
        <div className="d-flex-column-center m-4">
          <Avatar
            alt="company logo"
            src={state.member_logo_url || state.provider_logo_url}
            sx={{
              bgcolor: '#DCDCF8',
              color: '#484964',
              width: '6rem!important',
              height: '6rem!important',
            }}
          />
          <div className="provider-profile-tab-outer-wrapper">
            {showMsg && (
              <div className="d-flex-column-center m-4">
                <h2>{t('suspend-description')}</h2>
              </div>
            )}
            {show && (
              <TabsComponent
                isPrimary
                isWithLine
                customLabel={`invite-member`}
                labelInput="label"
                idRef="providerTabsRef"
                tabsContentClasses="pt-3"
                data={providerTabsData}
                currentTab={activeTab}
                translationPath={translationPath}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                dynamicComponentProps={{
                  state,
                  errors,
                  onStateChanged,
                  isSubmitted,
                  setIsSubmitted,
                  isLoading,
                  setIsLoading,
                  parentTranslationPath,
                  translationPath,
                  activeItem,
                  setReload,
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProviderProfilePage;

ProviderProfilePage.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    member_type: PropTypes.string,
    user_uuid: PropTypes.string,
  }),
  source: PropTypes.string,
  userType: PropTypes.oneOf(['agency', 'university']),
};

ProviderProfilePage.defaultProps = {
  activeItem: undefined,
  source: undefined,
  userType: undefined,
};
