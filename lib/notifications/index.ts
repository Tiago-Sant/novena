export * from './permissions';
export * from './scheduler';
export * from './templates';
export * from './types';

export async function registerServiceWorker() {
	if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
		return null;
	}

	try {
		return await navigator.serviceWorker.register('/sw.js', { scope: '/' });
	} catch {
		return null;
	}
}
