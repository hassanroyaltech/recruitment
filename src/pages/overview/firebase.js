import firebase from 'firebase/compat/app';
import { getToken, onMessage } from 'firebase/messaging';
/**
 * this configuration you will have it after you create a project in firebase
 * @type {{storageBucket, apiKey, messagingSenderId, appId, projectId, authDomain}}
 */
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
/**
 * Initialize Firebase
 */
firebase.initializeApp(config);

/**
 * Retrieve a messaging object
 */

/**
 * Fun(): show pop up message asking user (yes or no) to accepting Notification
 * if Yes will return Token from firebase(FCM)
 * @returns {Promise<>}
 */
export const requestFirebaseNotificationPermission = async () =>
  new Promise((resolve, reject) => {
    onMessage
      .requestPermission()
      .then(() => getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });
/**
 * onMessage()
 * this function fired when firebase push notification
 * @returns {Promise<>}
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage((payload) => resolve(payload));
  });
export default firebase;
