import type { NotificationPermissionStatus } from './types';

export async function getNotificationPermissionStatus(): Promise<NotificationPermissionStatus> {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return 'unsupported';
	}

	return window.Notification.permission as NotificationPermissionStatus;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return 'unsupported';
	}

	const permission = await window.Notification.requestPermission();
	return permission as NotificationPermissionStatus;
}

export async function showNotification(title: string, body: string, tag?: string) {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return false;
	}

	if (window.Notification.permission !== 'granted') {
		return false;
	}

	const notificationOptions = {
		body,
		tag,
		icon: '/icons/icon-192.svg',
		badge: '/icons/icon-192.svg',
		data: {
			url: '/',
		},
	};

	if ('serviceWorker' in navigator) {
		try {
			const registration = await navigator.serviceWorker.ready;
			registration.showNotification(title, notificationOptions);
			return true;
		} catch {
			// Fallback for browsers where service worker notifications are not available.
		}
	}

	new window.Notification(title, notificationOptions);
	return true;
}
