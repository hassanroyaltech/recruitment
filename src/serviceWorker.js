export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator)
    navigator.serviceWorker
      .register('../firebase-messaging-sw.js')
      .then((registration) => registration.scope)
      .catch((err) => err);
};
