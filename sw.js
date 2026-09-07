// SIMA — minimal service worker.
// Its only job here is to let the page display real, OS-level notifications
// via registration.showNotification(), which iOS requires for a PWA that's
// been added to the Home Screen. It does not (yet) handle push messages
// from a server — that's the piece that would make notifications reliable
// even when the app has been fully closed for a long time.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Tapping a notification brings the app to the foreground.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});
