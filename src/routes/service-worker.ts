import { setupServiceWorker } from '@builder.io/qwik-city/service-worker';

import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

addEventListener('install', () => {
    self.skipWaiting();
});

addEventListener('activate', () => {
    self.clients.claim();
});

const plugin = new BackgroundSyncPlugin('sync-queue', {
    maxRetentionTime : 24 * 60
});

console.log('plugin:', plugin);

setupServiceWorker();