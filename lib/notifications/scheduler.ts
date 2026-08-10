import { addDays, isBefore, parseISO, setHours, setMinutes, startOfDay } from 'date-fns';
import { novenas } from '../../data';
import { buildReminderBody, buildReminderTitle } from './templates';
import type { NotificationPreferences, NotificationReminderPayload } from './types';

interface NovenaInstance {
	id: string;
	type: string;
	startDate: string;
	completedDays: number[];
}

const scheduledTimers = new Map<string, number>();

function createReminderDate(baseDate: Date, hour: number, minute: number) {
	const base = startOfDay(baseDate);
	return setMinutes(setHours(base, hour), minute);
}

function getNovenaName(type: string) {
	const novenaData = novenas[type as keyof typeof novenas];
	return novenaData?.name ?? 'Novena';
}

function scheduleReminder(
	key: string,
	when: Date,
	payload: NotificationReminderPayload,
) {
	if (typeof window === 'undefined') return;

	const now = new Date();
	if (isBefore(when, now)) return;

	const existing = scheduledTimers.get(key);
	if (existing) {
		window.clearTimeout(existing);
	}

	const delay = Math.max(0, when.getTime() - now.getTime());
	const timeoutId = window.setTimeout(() => {
		scheduledTimers.delete(key);
		void import('./permissions').then(({ showNotification }) => {
			void showNotification(
				buildReminderTitle(payload),
				buildReminderBody(payload),
				payload.novenaId,
			);
		});
	}, delay);

	scheduledTimers.set(key, timeoutId);
}

export function cancelScheduledNotifications() {
	if (typeof window === 'undefined') return;

	scheduledTimers.forEach((timerId) => {
		window.clearTimeout(timerId);
	});
	scheduledTimers.clear();
}

export function scheduleNotifications(
	novenas: NovenaInstance[],
	preferences: NotificationPreferences,
) {
	if (typeof window === 'undefined') return;

	cancelScheduledNotifications();

	if (!preferences.enabled || preferences.permissionStatus !== 'granted') {
		return;
	}

	const now = new Date();

	novenas.forEach((novena) => {
		const startDate = parseISO(novena.startDate);
		const novenaName = getNovenaName(novena.type);

		if (preferences.startReminderEnabled) {
			const beforeStart = addDays(startDate, -1);
			const beforeStartAt = createReminderDate(beforeStart, preferences.defaultHour, preferences.defaultMinute);
			if (beforeStartAt.getTime() > now.getTime()) {
				scheduleReminder(`start-before-${novena.id}`, beforeStartAt, {
					type: 'start',
					novenaId: novena.id,
					novenaName,
				});
			}

			const startAt = createReminderDate(startDate, preferences.defaultHour, preferences.defaultMinute);
			if (startAt.getTime() > now.getTime()) {
				scheduleReminder(`start-day-${novena.id}`, startAt, {
					type: 'start',
					novenaId: novena.id,
					novenaName,
				});
			}
		}

		if (preferences.dailyReminderEnabled) {
			for (let day = 1; day <= 9; day += 1) {
				if (novena.completedDays.includes(day)) {
					continue;
				}

				const reminderDate = addDays(startDate, day - 1);
				const dailyAt = createReminderDate(reminderDate, preferences.defaultHour, preferences.defaultMinute);
				if (dailyAt.getTime() <= now.getTime()) {
					continue;
				}

				scheduleReminder(`daily-${novena.id}-${day}`, dailyAt, {
					type: 'daily',
					novenaId: novena.id,
					novenaName,
					dayNumber: day,
				});
			}
		}
	});
}
