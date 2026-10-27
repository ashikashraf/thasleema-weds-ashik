/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB9b3_pXuIXTbV5P_Vakk9mLKTi_Gdxo8g",
  authDomain: "wedding-notifcation.firebaseapp.com",
  projectId: "wedding-notifcation",
  storageBucket: "wedding-notifcation.firebasestorage.app",
  messagingSenderId: "449397835689",
  appId: "1:449397835689:web:a7148e9c07c1b22df9a6b8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "💍 New Wedding RSVP";
  const notificationOptions = {
    body: payload.notification?.body || "A new RSVP has been received.",
    icon: "/thasleema-weds-ashik/favicon.ico",
    badge: "/thasleema-weds-ashik/favicon.ico",
    data: {
      url: "/thasleema-weds-ashik/#admin",
      ...payload.data,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("/thasleema-weds-ashik/") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/thasleema-weds-ashik/#admin");
      }
    })
  );
});
