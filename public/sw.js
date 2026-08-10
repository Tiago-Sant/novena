self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const urlToOpen = event.notification.data?.url || '/';

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
			for (const client of clientList) {
				if (client.url === urlToOpen || client.url.startsWith(`${urlToOpen}/`)) {
					return client.focus();
				}
			}

			if (clients.openWindow) {
				return clients.openWindow(urlToOpen);
			}
		}),
	);
});
