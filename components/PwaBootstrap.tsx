'use client';

import { useEffect } from 'react';
import { useNovenaStore } from '../store/useNovenaStore';
import { getNotificationPermissionStatus, registerServiceWorker } from '../lib/notifications';

export default function PwaBootstrap() {
	const { initializeNotifications, setNotificationPermissionStatus } = useNovenaStore();

	useEffect(() => {
		let isMounted = true;

		async function bootstrap() {
			await registerServiceWorker();
			const permission = await getNotificationPermissionStatus();
			if (isMounted) {
				setNotificationPermissionStatus(permission);
				initializeNotifications();
			}
		}

		void bootstrap();

		return () => {
			isMounted = false;
		};
	}, [initializeNotifications, setNotificationPermissionStatus]);

	return null;
}
