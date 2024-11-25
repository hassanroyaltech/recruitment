import React, { useEffect } from 'react';
import { GlobalHistory } from '../helpers';
import { administrationAPI } from '../api/administration';

/**
 * A function component for the Administration component
 * @returns {JSX.Element}
 * @constructor
 */
const Integrations = () => {
  const gateWayUrls = JSON.parse(localStorage.getItem('gateway_urls')) || '';

  // Redirect to the integration view.
  useEffect(() => {
    if (gateWayUrls && gateWayUrls.integration_url) {
      window.open(gateWayUrls.integration_url, '_blank');
      GlobalHistory.goBack();
    } else
      administrationAPI.getIntegrationsURL().then((response) => {
        const { results } = response.data;

        if (results) {
          localStorage.setItem('gateway_urls', JSON.stringify(results));
          window.open(results.integration_url, '_blank');
        }
        GlobalHistory.goBack();
      });
  }, [gateWayUrls]);

  /**
   * Return JSX
   */
  return <></>;
};

export default Integrations;
