importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js');

const config = {
  apiKey: '{%REACT_APP_FIREBASE_API_KEY%}',
  authDomain: '{%REACT_APP_FIREBASE_AUTH_DOMAIN%}',
  projectId: '{%REACT_APP_FIREBASE_PROJECT_ID%}',
  databaseURL: '{%REACT_APP_FIREBASE_DATABASE_URL%}',
  storageBucket: '{%REACT_APP_FIREBASE_STORAGE_BUCKET%}',
  messagingSenderId: '{%REACT_APP_FIREBASE_MESSAGING_SENDER_ID%}',
  appId: '{%REACT_APP_FIREBASE_APP_ID%}',
};

firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    url: payload.notification.click_action,
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', function (event) {
  // console.log('Received a push message');
  const data = event.data.json();
  // console.log('orginal noti ', data.notification)

  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: data.notification.icon,
    url: data.notification.click_action,
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// browser push notification "onClick" event heandler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // console.log('its clicked', event)
  /**
   * if exists open browser tab with matching url just set focus to it,
   * otherwise open new tab/window with sw root scope url
   */
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
      })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url == self.registration.scope && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }),
  );
});
