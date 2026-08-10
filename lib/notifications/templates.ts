import type { NotificationReminderPayload } from './types';

export function buildReminderTitle(payload: NotificationReminderPayload) {
	if (payload.type === 'start') {
		return 'Comece sua novena hoje';
	}

	return `Dia ${payload.dayNumber ?? 1} da novena`;
}

export function buildReminderBody(payload: NotificationReminderPayload) {
	if (payload.type === 'start') {
		return `A novena “${payload.novenaName}” começa hoje. Reserve um momento para abrir o app e começar sua oração.`;
	}

	return `É hora de rezar o dia ${payload.dayNumber ?? 1} da novena “${payload.novenaName}”.`;
}
