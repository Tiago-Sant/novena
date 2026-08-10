'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { scheduleNotifications } from '../lib/notifications';
import type { NotificationPermissionStatus, NotificationPreferences } from '../lib/notifications';

interface NovenaInstance {
	id: string;
	type: string;
	startDate: string;
	completedDays: number[];
	createdAt: string;
}

const defaultNotifications: NotificationPreferences = {
	enabled: false,
	defaultHour: 8,
	defaultMinute: 0,
	startReminderEnabled: true,
	dailyReminderEnabled: true,
	permissionStatus: 'default',
};

interface NovenaState {
	novenas: NovenaInstance[];
	selectedDay: { [novenaId: string]: number | null };
	notifications: NotificationPreferences;
	createNovena: (type: string, startDate: string) => string;
	markDay: (novenaId: string, day: number) => void;
	setSelectedDay: (novenaId: string, day: number | null) => void;
	deleteNovena: (novenaId: string) => void;
	getNovena: (novenaId: string) => NovenaInstance | undefined;
	setNotificationPreferences: (preferences: Partial<NotificationPreferences>) => void;
	setNotificationPermissionStatus: (status: NotificationPermissionStatus) => void;
	initializeNotifications: () => void;
}

export const useNovenaStore = create<NovenaState>()(
	persist(
		(set, get) => ({
			novenas: [],
			selectedDay: {},
			notifications: defaultNotifications,
			createNovena: (type, startDate) => {
				const id = `${type}-${Date.now()}`;
				const newNovena: NovenaInstance = {
					id,
					type,
					startDate,
					completedDays: [],
					createdAt: new Date().toISOString(),
				};
				set((state) => ({ ...state, novenas: [...state.novenas, newNovena] }));
				get().initializeNotifications();
				return id;
			},
			markDay: (novenaId, day) => {
				set((state) => ({
					...state,
					novenas: state.novenas.map((novena) => {
						if (novena.id === novenaId) {
							const completedDays = novena.completedDays.includes(day)
								? novena.completedDays.filter((d) => d !== day)
								: [...novena.completedDays, day];
							return { ...novena, completedDays };
						}
						return novena;
					}),
				}));
				get().initializeNotifications();
			},
			setSelectedDay: (novenaId, day) => {
				set((state) => ({
					...state,
					selectedDay: { ...state.selectedDay, [novenaId]: day },
				}));
			},
			deleteNovena: (novenaId) => {
				set((state) => {
					const updatedSelectedDay = { ...state.selectedDay };
					delete updatedSelectedDay[novenaId];
					return {
						...state,
						novenas: state.novenas.filter((n) => n.id !== novenaId),
						selectedDay: updatedSelectedDay,
					};
				});
				get().initializeNotifications();
			},
			getNovena: (novenaId) => {
				return get().novenas.find((n) => n.id === novenaId);
			},
			setNotificationPreferences: (preferences) => {
				set((state) => ({
					...state,
					notifications: { ...state.notifications, ...preferences },
				}));
				get().initializeNotifications();
			},
			setNotificationPermissionStatus: (status) => {
				set((state) => ({
					...state,
					notifications: { ...state.notifications, permissionStatus: status },
				}));
			},
			initializeNotifications: () => {
				const { novenas, notifications } = get();
				scheduleNotifications(novenas, notifications);
			},
		}),
		{ name: 'novenas-progress' },
	),
);
