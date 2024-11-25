import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IntegrationsGenerateVonqTokenV2 } from '../../services';
import { showError } from '../../helpers';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './VonqIntegration.Style.scss';
import { useSelector } from 'react-redux';
import { VonqLocales } from './internalization';
import { FixVonqStyles } from './helpers';
import i18next from 'i18next';

export const VonqIntegrationComponent = memo(
  ({
    isWithCampaign,
    isWithContractAdd,
    isWithContractJourney,
    isWithOrderJourneyContract,
    isWithOrderJourneyCheckout,
    isWithContractAddCredentials,
    isWithContract,
    isWithUserJourneyButtons,
    isWithoutHTMLBody,
    getBeforeHapiInjection,
    getAfterHapiInjection,
    scriptId,
    parentTranslationPath,
  }) => {
    const isMountedRef = useRef(true);
    const isInitRef = useRef(true);
    // const [token, setToken] = useState(null);
    const { t } = useTranslation(parentTranslationPath);
    const selectedBranchReducer = useSelector(
      (state) => state?.selectedBranchReducer,
    );
    const vonqScriptRef = useRef(null);
    const [hapiElement, setHapiElement] = useState(null);

    const initializationHandler = useCallback(async () => {
      if (!isInitRef.current) return;
      isInitRef.current = false;
      console.log('initializationHandler');
      const debuggerElement = document.body.querySelector(
        '#hapi__debug-panel-toggle-button',
      );
      // token initialization
      const response = await IntegrationsGenerateVonqTokenV2();
      if (debuggerElement) debuggerElement.remove();
      if (getBeforeHapiInjection && isMountedRef.current) getBeforeHapiInjection();

      if (response && response.status === 200) {
        // setToken(response.data.token);
        if (window.hapi) {
          const debuggerElement = document.body.querySelector(
            '#hapi__debug-panel-toggle-button',
          );
          if (debuggerElement) debuggerElement.remove();
          if (window.hapiAuth) {
            window.hapiAuth.clientToken = response.data.token;
            window.hapiConfig.clientToken = response.data.token;
            window.hapiInjectorConfig.clientToken = response.data.token;
            window.hapi.language.state.locale = i18next.language || 'en';
            FixVonqStyles(i18next.language || 'en');
          }
          setHapiElement(window.hapi);
          if (getAfterHapiInjection && isMountedRef.current)
            getAfterHapiInjection({ hapi: window.hapi });
          isInitRef.current = false;
          return;
        }
        // script initialization
        vonqScriptRef.current = document.createElement('script');
        vonqScriptRef.current.type = 'module';
        vonqScriptRef.current.id = scriptId;
        vonqScriptRef.current.defer = true;
        vonqScriptRef.current.src = `${process.env.REACT_APP_VONQ_INTEGRATION}/api/injector.js`;
        vonqScriptRef.current.setAttribute('crossorigin', 'anonymous');
        // vonqScriptRef.current.setAttribute(
        //   'integrity',
        //   'sha384-5le8S6Qk2YXuF8JpQEZWT6uKKnOy7oSnQ1AngLl/qGxBo2LJxYzcbp/O8HneIHP6',
        // );
        vonqScriptRef.current.onload = async () => {
          window.hapiInjector.setConfig('clientToken', response.data.token);
          // window.hapiInjector.setConfig('addDebugPanel', false);

          // Inject is a Promise that resolves when HAPI Elements script has successfully loaded
          await window.hapiInjector.inject();
          const debuggerElement = document.body.querySelector(
            '#hapi__debug-panel-toggle-button',
          );
          if (debuggerElement) debuggerElement.remove();
          window.hapi.language.state.translations = {
            ...window.hapi.language.state.translations.value, //keep this not to overwrite default English translations
            ...VonqLocales,
          };
          window.hapi.language.state.locale = i18next.language || 'en';
          FixVonqStyles(i18next.language || 'en');
          window.hapi.ui.service.setStyle('.hapi-text-left', { textAlign: 'start' });
          window.hapi.ui.service.setStyle('.hapi-mr-4', {
            marginInlineEnd: '1rem',
            marginInlineStart: '0px',
          });
          window.hapi.ui.service.setStyle('.hapi-ml-2', {
            marginInlineEnd: '0px',
            marginInlineStart: '0.5rem',
          });
          window.hapi.ui.service.hideElement('[id$=-toggle-basket]');
          window.hapi.ui.service.setStyle('button[id*=in-basket-button]', {
            display: 'none',
          });
          window.hapi.theming.state.theme = {
            global: {
              primaryBackgroundColor:
                (selectedBranchReducer
                  && selectedBranchReducer.brandStyle
                  && selectedBranchReducer.brandStyle.mainColor)
                || '#272c6a',
            },
          };
          if (getAfterHapiInjection && isMountedRef.current)
            getAfterHapiInjection({ hapi: window.hapi, token: response.data.token });
          setHapiElement(window.hapi);
          // You can now start using HAPI Elements Javascript API
          // console.log('[HAPI] Elements has loaded', window.hapi);
        };
        document.body.appendChild(vonqScriptRef.current);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    }, [
      getBeforeHapiInjection,
      t,
      getAfterHapiInjection,
      scriptId,
      selectedBranchReducer,
    ]);

    // to initialize the vonq integrations
    useEffect(() => {
      initializationHandler().catch();
    }, [initializationHandler]);

    // to destroy Vonq script bindings on destroy this component
    // useEffect(
    //   () => () => {
    //     // const elementsToRemove = ['he-ui-alertbar', 'he-ui-modals'];
    //     // elementsToRemove.forEach((el) => {
    //     //   document.querySelectorAll(el).forEach((item) => {
    //     //     item.parentNode.removeChild(item);
    //     //   });
    //     // });
    //     // if (vonqScriptRef.current) {
    //     //   vonqScriptRef.current.remove();
    //     //   vonqScriptRef.current = null;
    //     // }
    //     // const scriptsToRemove = [scriptId, 'vonq-hapi-elements-loader'];
    //     // scriptsToRemove.forEach((id) => {
    //     //   const element = document.getElementById(id);
    //     //   if (element) element.remove();
    //     // });
    //     // if (vonqScriptRef.current) {
    //     //   document.body.removeChild(vonqScriptRef.current);
    //     //   document.body.querySelectorAll('[tagName^="he-ui"]').forEach((item) => {
    //     //     console.log({ item });
    //     //   });
    //     // } else if (document.body.querySelector(`#${scriptId}`))
    //     //   document.body.removeChild(document.body.querySelector(`#${scriptId}`));
    //     // window.hapi = null;
    //   },
    //   [scriptId]
    // );

    useEffect(
      () => () => {
        isMountedRef.current = false;
      },
      [],
    );
    // useEffect(() => {
    //   if (
    //     hapiElement
    //     && window?.hapi?.language?.state?.translations
    //   ) {
    //     window.hapi.language.state.translations = {
    //       ...window.hapi.language.state.translations.value, //keep this not to overwrite default English translations
    //       ...VonqLocales,
    //     };
    //     window.hapi.language.state.locale = i18next.language || 'en';
    //     FixVonqStyles(i18next.language || 'en')
    //   }
    // }, [hapiElement ]);
    return (
      hapiElement
      && !isWithoutHTMLBody && (
        <div className="vonq-integration-component-wrapper component-wrapper">
          <he-ui-localeselector />
          {isWithUserJourneyButtons && <he-userjourney-buttons />}
          {isWithContractAdd && <he-contract-add />}
          {isWithContract && <he-contract />}
          {isWithOrderJourneyContract && <he-orderjourney-contract />}
          {isWithContractJourney && <he-contract-journey />}
          {isWithContractAddCredentials && <he-contract-add-credentials />}
          {isWithOrderJourneyCheckout && <he-orderjourney-checkout />}
          {isWithCampaign && <he-campaign />}
          {/*<he-wallet-button></he-wallet-button>*/}
        </div>
      )
    );
  },
);

VonqIntegrationComponent.displayName = 'VonqIntegrationComponent';

VonqIntegrationComponent.propTypes = {
  isWithCampaign: PropTypes.bool,
  isWithContractAdd: PropTypes.bool,
  isWithContractJourney: PropTypes.bool,
  isWithOrderJourneyContract: PropTypes.bool,
  isWithOrderJourneyCheckout: PropTypes.bool,
  isWithContractAddCredentials: PropTypes.bool,
  isWithUserJourneyButtons: PropTypes.bool,
  isWithContract: PropTypes.bool,
  isWithoutHTMLBody: PropTypes.bool,
  getBeforeHapiInjection: PropTypes.func,
  getAfterHapiInjection: PropTypes.func,
  scriptId: PropTypes.string,
  parentTranslationPath: PropTypes.string,
};
VonqIntegrationComponent.defaultProps = {
  scriptId: 'vonqScriptId',
  parentTranslationPath: 'Shared',
};
