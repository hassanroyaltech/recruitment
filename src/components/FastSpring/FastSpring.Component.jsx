import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export const FastSpringComponent = ({
  scriptId,
  onDataCallback,
  onErrorCallback,
  onPopupWebhookReceived,
  onPopupClosed,
  onPopupEventReceived,
  onBeforeRequestsCallback,
  onAfterRequestsCallback,
  onBeforeMarkupCallback,
  onAfterMarkupCallback,
  onDecorateURL,
}) => {
  const fastSpringScriptRef = useRef(null);
  useEffect(() => {
    const existingScript = document.getElementById(scriptId);
    if (!existingScript) {
      const storeFrontToUse = process.env.REACT_APP_FASTSPRING_STOREFRONT;
      fastSpringScriptRef.current = document.createElement('script');
      fastSpringScriptRef.current.type = 'text/javascript';
      fastSpringScriptRef.current.id = scriptId;
      fastSpringScriptRef.current.src
        = 'https://sbl.onfastspring.com/sbl/0.9.2/fastspring-builder.min.js';
      fastSpringScriptRef.current.dataset.storefront = storeFrontToUse;
      fastSpringScriptRef.current.dataset.debug = 'true';
      fastSpringScriptRef.current.dataset.continuous = 'true';
      // fastSpringScriptRef.current.setAttribute('crossorigin', 'anonymous');
      // fastSpringScriptRef.current.setAttribute(
      //   'integrity',
      //   'sha384-0YwVHfO4DnRhpS7XVh8m0Yyyz3v7uRyWmbtcksg3GkwpFgODAb81MkdbXdvkU0TP',
      // );
      if (onDataCallback)
        fastSpringScriptRef.current.dataset.dataCallback = 'onDataCallback';
      if (onBeforeRequestsCallback)
        fastSpringScriptRef.current.dataset.beforeRequestsCallback
          = 'onBeforeRequestsCallback';
      if (onAfterRequestsCallback)
        fastSpringScriptRef.current.dataset.afterRequestsCallback
          = 'onAfterRequestsCallback';
      if (onBeforeMarkupCallback)
        fastSpringScriptRef.current.dataset.beforeMarkupCallback
          = 'onBeforeMarkupCallback';
      if (onAfterMarkupCallback)
        fastSpringScriptRef.current.dataset.afterMarkupCallback
          = 'onAfterMarkupCallback';
      if (onDecorateURL)
        fastSpringScriptRef.current.dataset.decorateCallback = 'onDecorateURL';
      if (onPopupEventReceived)
        fastSpringScriptRef.current.dataset.popupEventReceived
          = 'onPopupEventReceived';
      if (onErrorCallback)
        fastSpringScriptRef.current.dataset.errorCallback = 'onErrorCallback';
      if (onPopupWebhookReceived)
        fastSpringScriptRef.current.dataset.popupWebhookReceived
          = 'onPopupWebhookReceived';
      if (onPopupClosed)
        fastSpringScriptRef.current.dataset.popupClosed = 'onPopupClosed';
      document.head.appendChild(fastSpringScriptRef.current);
    }
  }, [
    onAfterMarkupCallback,
    onAfterRequestsCallback,
    onBeforeMarkupCallback,
    onBeforeRequestsCallback,
    onDataCallback,
    onDecorateURL,
    onErrorCallback,
    onPopupClosed,
    onPopupEventReceived,
    onPopupWebhookReceived,
    scriptId,
  ]);
  useEffect(() => {
    if (onDataCallback) window.onDataCallback = onDataCallback;
    if (onBeforeRequestsCallback)
      window.onBeforeRequestsCallback = onBeforeRequestsCallback;
    if (onAfterRequestsCallback)
      window.onAfterRequestsCallback = onAfterRequestsCallback;
    if (onBeforeMarkupCallback)
      window.onBeforeMarkupCallback = onBeforeMarkupCallback;
    if (onAfterMarkupCallback) window.onAfterMarkupCallback = onAfterMarkupCallback;
    if (onDecorateURL) window.onDecorateURL = onDecorateURL;
    if (onPopupEventReceived) window.onPopupEventReceived = onPopupEventReceived;
    if (onErrorCallback) window.onErrorCallback = onErrorCallback;
    if (onPopupWebhookReceived)
      window.onPopupWebhookReceived = onPopupWebhookReceived;
    if (onPopupClosed) window.onPopupClosed = onPopupClosed;
  }, [
    onAfterMarkupCallback,
    onAfterRequestsCallback,
    onBeforeMarkupCallback,
    onBeforeRequestsCallback,
    onDataCallback,
    onDecorateURL,
    onErrorCallback,
    onPopupClosed,
    onPopupEventReceived,
    onPopupWebhookReceived,
  ]);

  useEffect(
    () => () => {
      if (fastSpringScriptRef.current)
        document.head.removeChild(fastSpringScriptRef.current);
    },
    [],
  );
  return null;
};
FastSpringComponent.propTypes = {
  scriptId: PropTypes.string,
  onDataCallback: PropTypes.func,
  onErrorCallback: PropTypes.func,
  onPaymentReceived: PropTypes.func,
  onPopupWebhookReceived: PropTypes.func,
  onPopupClosed: PropTypes.func,
  onPopupEventReceived: PropTypes.func,
  onBeforeRequestsCallback: PropTypes.func,
  onAfterRequestsCallback: PropTypes.func,
  onBeforeMarkupCallback: PropTypes.func,
  onAfterMarkupCallback: PropTypes.func,
  onDecorateURL: PropTypes.func,
};
FastSpringComponent.defaultProps = {
  scriptId: 'fsc-api',
  onDataCallback: undefined,
  onErrorCallback: undefined,
  onPaymentReceived: undefined,
  onPopupWebhookReceived: undefined,
  onPopupClosed: undefined,
  onPopupEventReceived: undefined,
  onBeforeRequestsCallback: undefined,
  onAfterRequestsCallback: undefined,
  onBeforeMarkupCallback: undefined,
  onAfterMarkupCallback: undefined,
  onDecorateURL: undefined,
};
