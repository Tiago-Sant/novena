'use client';

import React, { useEffect, useState } from 'react';
import {
	getNotificationPermissionStatus,
	requestNotificationPermission,
	showNotification,
} from '../lib/notifications';
import { useNovenaStore } from '../store/useNovenaStore';

export default function NotificationSettings() {
	const {
		notifications,
		setNotificationPreferences,
		setNotificationPermissionStatus,
		initializeNotifications,
	} = useNovenaStore();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	async function handleToggle() {
		if (notifications.enabled) {
			setNotificationPreferences({ enabled: false });
			return;
		}

		const permission = await requestNotificationPermission();
		setNotificationPermissionStatus(permission);
		const enabled = permission === 'granted';
		setNotificationPreferences({ enabled, permissionStatus: permission });
		if (enabled) {
			initializeNotifications();
		}
	}

	async function handleTestNotification() {
		const permission = await getNotificationPermissionStatus();
		setNotificationPermissionStatus(permission);
		if (permission !== 'granted') {
			return;
		}

		await showNotification(
			'Lembrete de teste',
			'Este é um lembrete de teste do app de novenas.',
			'test-notification',
		);
	}

	function updateHour(value: string) {
		setNotificationPreferences({ defaultHour: Number(value) });
	}

	function updateMinute(value: string) {
		setNotificationPreferences({ defaultMinute: Number(value) });
	}

	function toggleReminder(kind: 'start' | 'daily', value: boolean) {
		setNotificationPreferences(
			kind === 'start'
				? { startReminderEnabled: value }
				: { dailyReminderEnabled: value },
		);
	}

	return (
		<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						Lembretes de novena
					</h2>
					<p className="text-sm text-slate-600">
						Receba lembretes para começar e rezar cada dia das suas novenas.
					</p>
					<p className="mt-2 text-xs text-slate-500">
						Em celulares, a experiência fica mais confiável quando o app é instalado na tela inicial.
					</p>
				</div>
				<button
					onClick={handleToggle}
					disabled={!isClient}
					className={`rounded-full px-4 py-2 text-sm font-medium ${
						notifications.enabled
							? 'bg-slate-900 text-white'
							: 'bg-white text-slate-700 ring-1 ring-slate-300'
					} ${!isClient ? 'cursor-not-allowed opacity-60' : ''}`}
				>
					{notifications.enabled ? 'Desativar' : 'Ativar'}
				</button>
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
				<span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
					Status: {notifications.permissionStatus === 'granted' ? 'Permitido' : notifications.permissionStatus === 'denied' ? 'Negado' : notifications.permissionStatus === 'unsupported' ? 'Não suportado' : 'Pendente'}
				</span>
				<span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
					Horário padrão: {String(notifications.defaultHour).padStart(2, '0')}:{String(notifications.defaultMinute).padStart(2, '0')}
				</span>
			</div>

			<div className="mt-4 grid gap-4 md:grid-cols-2">
				<div className="rounded-lg border border-slate-200 bg-white p-3">
					<label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="notification-hour">
						Hora
					</label>
					<select
						id="notification-hour"
						value={notifications.defaultHour}
						onChange={(event) => updateHour(event.target.value)}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
					>
						{Array.from({ length: 24 }, (_, index) => (
							<option key={index} value={index}>
								{String(index).padStart(2, '0')}:00
							</option>
						))}
					</select>
				</div>

				<div className="rounded-lg border border-slate-200 bg-white p-3">
					<label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="notification-minute">
						Minuto
					</label>
					<select
						id="notification-minute"
						value={notifications.defaultMinute}
						onChange={(event) => updateMinute(event.target.value)}
						className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
					>
						<option value={0}>00</option>
						<option value={15}>15</option>
						<option value={30}>30</option>
						<option value={45}>45</option>
					</select>
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
				<label className="flex items-center gap-2 text-sm text-slate-700">
					<input
						type="checkbox"
						checked={notifications.startReminderEnabled}
						onChange={(event) => toggleReminder('start', event.target.checked)}
						className="h-4 w-4 rounded border-slate-300"
						disabled={!isClient}
					/>
					Lembrar 1 dia antes do início
				</label>
				<label className="flex items-center gap-2 text-sm text-slate-700">
					<input
						type="checkbox"
						checked={notifications.dailyReminderEnabled}
						onChange={(event) => toggleReminder('daily', event.target.checked)}
						className="h-4 w-4 rounded border-slate-300"
						disabled={!isClient}
					/>
					Lembrar o dia atual da novena
				</label>
			</div>

			<div className="mt-4 flex justify-start">
				<button
					onClick={handleTestNotification}
					disabled={!isClient}
					className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
				>
					Testar notificação
				</button>
			</div>
		</div>
	);
}
