// SIMA — service worker.
//
// This now does two jobs:
//  1. (unchanged) let the page show real OS-level notifications on demand
//     via registration.showNotification(), for while the app is open.
//  2. (new, v36) receive actual PUSH events sent from a server, which is
//     the only thing that reliably wakes a notification when the phone is
//     locked or the app has been closed — in-page timers cannot do this,
//     which was the whole cause of testers not getting notified.
//
// The push-receiving piece is handled by OneSignal's own service worker
// code, merged into this single file via importScripts — see:
// https://documentation.onesignal.com/docs/en/onesignal-service-worker
// (this is their documented way to combine their worker with an app's
// existing one, so we keep one sw.js instead of two competing workers).
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Tapping a notification brings the app to the foreground. OneSignal's
// merged-in code already registers its own 'notificationclick' handler
// (which does this same focus-or-open behavior) — this listener is only
// a fallback in case that changes, so it deliberately does nothing if a
// window is already open, to avoid stealing/duplicating that behavior.
self.addEventListener('notificationclick', (event) => {
  // Intentionally not calling event.notification.close() or
  // event.waitUntil() here — OneSignal's own handler (loaded above)
  // already does this. Leaving this listener empty-but-present just
  // documents that this was considered, not left out by accident.
});
