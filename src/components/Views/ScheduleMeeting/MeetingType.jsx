/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'reactstrap';
import classnames from 'classnames';
import { commonAPI } from '../../../api/common';
import { kebabToTitle } from '../../../shared/utils';
// Import Material UI tool tip
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import offlinelogo from '../../../assets/img/logo/offlinelogo.png';
import offline from '../../../assets/img/logo/offline.png';
import { GlobalHistory } from '../../../helpers';
import { useSelector } from 'react-redux';
import { GetMSTeamsMeetingProviders } from '../../../services';

const translationPath = 'MeetingTypeComponent.';
const msTeamsProviders = {
  microsoft_teams: 'Microsoft Teams',
  skypeForBusiness: 'Skype For Business',
  skypeForConsumer: 'Skype For Consumer',
  teamsForBusiness: 'Teams For Business',
};
const MeetingType = ({
  type: defaultType,
  onNext,
  noModal,
  setProvider,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [type, setType] = useState(defaultType);
  const [providers, setProviders] = useState();
  const [loading, setLoading] = useState(true);
  const userReducer = useSelector((state) => state.userReducer);

  const getIntegration = (provider) => () => {
    // administrationAPI.getIntegrationsURL().then((response) => {
    //   window.open(response.data.results.url, '_blank');
    //   setLoading(false);
    //   // history.goBack();
    // });
    GlobalHistory.push(`/recruiter/connections?redirect_to=${provider}`);
  };

  const meetingTypes = [
    {
      value: 'other',
      icon: offlinelogo,
      title: t(`${translationPath}other`),
      description: t(`${translationPath}set-up-meeting-description`),
    },
  ];

  const getCompanyProviderList = useCallback(async () => {
    // declare icon to make the icon loading until the API request is completed.
    const icon = document.getElementById('refresh');
    if (icon) icon.className = 'fas fa-redo fa-spin text-primary mr--4';
    const user_uuid = userReducer?.results?.user?.uuid || '';
    if (!user_uuid) return;

    const response = await Promise.allSettled([
      commonAPI.getCompanyProvider('schedule'),
      GetMSTeamsMeetingProviders({ user_uuid }),
    ]);

    let providersArray = [];
    response.forEach((item, index) => {
      const resData = response?.[index]?.value?.data;
      let localeProviders = [];
      if (index === 0) localeProviders = resData?.results;
      if (index === 1) localeProviders = resData;
      if (localeProviders?.length)
        localeProviders.forEach((element) => {
          providersArray.push({
            value: element.provider_name,
            icon: element.image || offline,
            title:
              (Object.keys(msTeamsProviders).includes(element.provider_name)
                && msTeamsProviders?.[element.provider_name])
              || element.provider_name
              || kebabToTitle(element.providers_uuid),
            status: element.status,
            description:
              element.content || t(`${translationPath}set-up-meeting-description`),
          });
        });
    });
    setProviders(providersArray);
    if (icon) icon.className = 'fas fa-redo text-primary mr--4';
    setLoading(false);
  }, [t, userReducer?.results?.user?.uuid]);

  useEffect(() => {
    getCompanyProviderList();
  }, [getCompanyProviderList]);
  return (
    <div className="my-4 w-100">
      {!loading && providers?.length > 0 && (
        <Row className="d-flex flex-row-reverse">
          <Tooltip title={t(`${translationPath}refresh-to-check-providers-status`)}>
            <span>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true"
                onClick={getCompanyProviderList}
              >
                <i
                  className="fas fa-redo text-primary mr-2-reversed pb-1"
                  aria-hidden="true"
                  id="refresh"
                />
              </button>
            </span>
          </Tooltip>
        </Row>
      )}
      <Row>
        {!loading
          && providers.map((opt, index) => (
            <Col xs={20} sm={4} className="my-2" key={`providersKey${index + 1}`}>
              <Card
                className={classnames(
                  'p-3 stage-card',
                  type === opt.value && 'selected',
                )}
                onClick={() => {
                  if (opt.status === true || opt.status === undefined) {
                    setType(opt.value);
                    if (setProvider) setProvider(opt.value);
                  }
                }}
                style={{ cursor: 'pointer', minHeight: 170 }}
              >
                <div className="d-flex flex-column align-items-center">
                  <div className="mt-3">
                    <img src={opt.icon} alt={opt.title} width="100%" />
                  </div>
                  <div className="mt-3 text-gray font-12">{opt.title}</div>
                  <div className="mt-4 text-gray h8">{opt.description}</div>
                  {opt.status === false && (
                    <div className="mt-3 ">
                      <Button
                        color="primary"
                        disabled={opt.status}
                        onClick={getIntegration(opt.value)}
                      >
                        {t(`${translationPath}connect`)}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        {!loading
          && meetingTypes.map((opt, index) => (
            <Col xs={20} sm={4} className="my-2" key={`meetingTypesKey${index + 1}`}>
              <Card
                className={classnames(
                  'p-3 stage-card',
                  type === opt.value && 'selected',
                )}
                onClick={() => {
                  setType(opt.value);
                  if (setProvider) setProvider(opt.value);
                }}
                style={{ cursor: 'pointer', minHeight: 170 }}
              >
                <div className="d-flex flex-column align-items-center">
                  <div className="mt-3">
                    <img src={opt.icon} alt={opt.title} width="100%" />
                  </div>
                  <div className="mt-3 text-gray font-12">{opt.title}</div>
                  <div className="mt-4 text-gray h8">{opt.description}</div>
                </div>
              </Card>
            </Col>
          ))}
      </Row>
      <hr className="mt-0 mb-5" />
      {!noModal && (
        <div className="d-flex justify-content-center" style={{ marginTop: 15 }}>
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={() => onNext(type)}
            disabled={!type}
          >
            {t(`${translationPath}continue`)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MeetingType;
