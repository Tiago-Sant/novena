export type NotificationPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

export interface NotificationPreferences {
	enabled: boolean;
	defaultHour: number;
	defaultMinute: number;
	startReminderEnabled: boolean;
	dailyReminderEnabled: boolean;
	permissionStatus: NotificationPermissionStatus;
}

export interface NotificationReminderPayload {
	type: 'start' | 'daily';
	novenaId: string;
	novenaName: string;
	dayNumber?: number;
}
