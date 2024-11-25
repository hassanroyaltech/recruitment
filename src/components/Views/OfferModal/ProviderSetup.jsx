/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title providerSetup.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the ProviderSetup component which allow user to choose or connect
 * with provider such as docusign to send offer.
 * ----------------------------------------------------------------------------------
 */

// React Components
import React, { useEffect, useState } from 'react';

// React Strap Components
import { Button, Card, Col, Row } from 'reactstrap';

// Classname for style
import classnames from 'classnames';

// Import API
import { commonAPI } from '../../../api/common';

// Import shared function
import { kebabToTitle } from '../../../shared/utils';

// Import Material UI tool tip
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import Empty from '../../../pages/recruiter-preference/components/Empty';
import { GlobalHistory } from '../../../helpers';

/**
 * Main Component
 * @param {*} type
 * @param {*} setType
 */
const translationPath = 'ProviderSetupComponent.';
const ProviderSetup = ({ type, setType, parentTranslationPath }) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get Integration page Link
  const getIntegration = (localProvider) => () => {
    // administrationAPI.getIntegrationsURL().then((response) => {
    //   window.open(response.data.results.url, '_blank');
    //   setLoading(false);
    //   // history.goBack();
    // });
    GlobalHistory.push(`/recruiter/connections?redirect_to=${localProvider}`);
  };

  // Get providers' list
  const getCompanyProviderList = () => {
    // declare icon to make the icon loading until the API request is completed.
    const icon = document.getElementById('refresh');
    if (icon) icon.className = 'fas fa-redo fa-spin text-primary mr-2-reserved';

    commonAPI.getCompanyProvider('offer').then((res) => {
      const data = res.data.results;
      setProvider(
        data.map((element) => ({
          value: element.provider,
          icon: element.image,
          status: element.status,
          title: kebabToTitle(element.provider),
          description: element.content,
        })),
      );
      if (icon) icon.className = 'fas fa-redo text-primary mr-2-reserved';

      setLoading(false);
    });
  };

  useEffect(() => {
    getCompanyProviderList();
  }, []);

  /**
   * @returns JSX element
   */
  return (
    <div className="my-4 w-100">
      {!loading && provider.length ? (
        <div>
          <Row className="d-flex flex-row-reverse">
            <Tooltip
              title={t(`${translationPath}refresh-to-check-providers-status`)}
            >
              <span>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  onClick={getCompanyProviderList}
                >
                  <i
                    className="fas fa-redo text-primary mr-2-reserved"
                    aria-hidden="true"
                    id="refresh"
                  />
                </button>
              </span>
            </Tooltip>
          </Row>
          {provider.map((opt, index) => (
            <Col xs={20} sm={5} className="my-2" key={`providerKey${index + 1}`}>
              <Card
                className={classnames(
                  'p-3 stage-card',
                  type === opt.value && 'selected',
                )}
                onClick={() => {
                  if (opt.status === true || opt.status === undefined)
                    setType(opt.value);
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
        </div>
      ) : (
        <div>
          {!loading && <Empty message={t(`${translationPath}no-providers-found`)} />}
        </div>
      )}
    </div>
  );
};
export default ProviderSetup;
