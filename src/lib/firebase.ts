import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, isSupported, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyB9b3_pXuIXTbV5P_Vakk9mLKTi_Gdxo8g",
  authDomain: "wedding-notifcation.firebaseapp.com",
  projectId: "wedding-notifcation",
  storageBucket: "wedding-notifcation.firebasestorage.app",
  messagingSenderId: "449397835689",
  appId: "1:449397835689:web:a7148e9c07c1b22df9a6b8",
  measurementId: "G-HWMHNVNJ39",
};

export const FIREBASE_VAPID_KEY = "BOdFls4JXOXA-cSdVgbtb9aHlzDv8YG4rr5aZ9VMNiLQW6Kie3Q64yNwtxMmFFLw2kuftakTxGu2N6xhBeHq-aQ";

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export const requestFirebaseToken = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return { success: false, error: "Notifications not supported in this browser" };
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { success: false, error: "Notification permission was not granted" };
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return { success: false, error: "Firebase Cloud Messaging not supported in this environment" };
    }

    // Register service worker
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.register(
        "/thasleema-weds-ashik/firebase-messaging-sw.js",
        { scope: "/thasleema-weds-ashik/" }
      );
    }

    const tokenOptions: { vapidKey: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
      vapidKey: FIREBASE_VAPID_KEY,
    };
    if (swRegistration) {
      tokenOptions.serviceWorkerRegistration = swRegistration;
    }

    const token = await getToken(messaging, tokenOptions);

    if (token) {
      return { success: true, token };
    } else {
      return { success: false, error: "No registration token available. Request permission to generate one." };
    }
  } catch (err: any) {
    console.error("FCM Token Error:", err);
    return { success: false, error: err?.message || "Failed to retrieve Firebase token" };
  }
};
