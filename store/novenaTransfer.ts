'use client';

import { novenas } from '../data';

export const NOVENA_TRANSFER_VERSION = 1;

export interface NovenaInstance {
	id: string;
	type: string;
	startDate: string;
	completedDays: number[];
	createdAt: string;
}

export interface NovenaProgressState {
	novenas: NovenaInstance[];
	selectedDay: Record<string, number | null>;
}

export interface NovenaTransferFile extends NovenaProgressState {
	format: 'novena-catolica-progress';
	version: number;
	exportedAt: string;
}

export interface ImportResult {
	state: NovenaProgressState;
	importedCount: number;
	updatedCount: number;
	ignoredCount: number;
	warnings: string[];
}

const knownNovenaTypes = new Set(Object.keys(novenas));

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isValidDate(value: unknown): value is string {
	return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function normalizeDays(value: unknown): number[] | null {
	if (!Array.isArray(value)) return null;

	const days = value.filter(
		(day): day is number =>
			typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 9,
	);
	return Array.from(new Set(days)).sort((first, second) => first - second);
}

function normalizeNovena(value: unknown): NovenaInstance | null {
	if (!isRecord(value)) return null;
	const completedDays = normalizeDays(value.completedDays);

	if (
		typeof value.id !== 'string' ||
		value.id.trim() === '' ||
		typeof value.type !== 'string' ||
		!knownNovenaTypes.has(value.type) ||
		!isValidDate(value.startDate) ||
		!isValidDate(value.createdAt) ||
		completedDays === null
	) {
		return null;
	}

	return {
		id: value.id,
		type: value.type,
		startDate: value.startDate,
		completedDays,
		createdAt: value.createdAt,
	};
}

function normalizeSelectedDay(
	value: unknown,
	novenasList: NovenaInstance[],
): Record<string, number | null> {
	if (!isRecord(value)) return {};
	const validIds = new Set(novenasList.map((novena) => novena.id));
	const selectedDay: Record<string, number | null> = {};

	for (const [id, day] of Object.entries(value)) {
		if (
			validIds.has(id) &&
			(day === null ||
				(typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 9))
		) {
			selectedDay[id] = day === null ? null : (day as number);
		}
	}

	return selectedDay;
}

export function createTransferFile(state: NovenaProgressState): NovenaTransferFile {
	return {
		format: 'novena-catolica-progress',
		version: NOVENA_TRANSFER_VERSION,
		exportedAt: new Date().toISOString(),
		novenas: state.novenas,
		selectedDay: state.selectedDay,
	};
}

export function parseTransferFile(input: unknown): {
	novenas: NovenaInstance[];
	selectedDay: Record<string, number | null>;
	ignoredCount: number;
	warnings: string[];
} {
	if (!isRecord(input)) throw new Error('O arquivo não contém um objeto válido.');
	if (input.format !== 'novena-catolica-progress') {
		throw new Error('Este arquivo não é uma exportação válida de novenas.');
	}
	if (typeof input.version !== 'number' || input.version > NOVENA_TRANSFER_VERSION) {
		throw new Error('Este arquivo foi criado por uma versão mais recente do aplicativo.');
	}
	if (!Array.isArray(input.novenas)) {
		throw new Error('O arquivo não contém uma lista de novenas.');
	}

	const warnings: string[] = [];
	const validNovenas: NovenaInstance[] = [];
	const seenIds = new Set<string>();
	let ignoredCount = 0;

	for (const item of input.novenas) {
		const novena = normalizeNovena(item);
		if (!novena) {
			ignoredCount += 1;
			warnings.push('Uma novena foi ignorada por conter dados inválidos ou incompatíveis.');
			continue;
		}
		if (seenIds.has(novena.id)) {
			warnings.push(`A novena "${novena.id}" apareceu mais de uma vez; a última foi usada.`);
			const index = validNovenas.findIndex((current) => current.id === novena.id);
			validNovenas[index] = novena;
			continue;
		}
		seenIds.add(novena.id);
		validNovenas.push(novena);
	}

	const unknownTypes = input.novenas.filter(
		(item) => isRecord(item) && typeof item.type === 'string' && !knownNovenaTypes.has(item.type),
	).length;
	if (unknownTypes > 0) {
		warnings.push(`${unknownTypes} novena(s) não disponível(is) nesta versão foram ignorada(s).`);
	}

	return {
		novenas: validNovenas,
		selectedDay: normalizeSelectedDay(input.selectedDay, validNovenas),
		ignoredCount,
		warnings: Array.from(new Set(warnings)),
	};
}

export function parseTransferText(text: string) {
	try {
		return parseTransferFile(JSON.parse(text));
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error('O arquivo não contém um JSON válido.');
		}
		throw error;
	}
}

export function mergeProgress(
	current: NovenaProgressState,
	incoming: Pick<NovenaProgressState, 'novenas' | 'selectedDay'>,
): ImportResult {
	const novenasById = new Map(current.novenas.map((novena) => [novena.id, novena]));
	let updatedCount = 0;

	for (const novena of incoming.novenas) {
		if (novenasById.has(novena.id)) updatedCount += 1;
		novenasById.set(novena.id, novena);
	}

	const mergedNovenas = Array.from(novenasById.values());
	const selectedDay = {
		...normalizeSelectedDay(current.selectedDay, mergedNovenas),
		...normalizeSelectedDay(incoming.selectedDay, mergedNovenas),
	};

	return {
		state: { novenas: mergedNovenas, selectedDay },
		importedCount: incoming.novenas.length - updatedCount,
		updatedCount,
		ignoredCount: 0,
		warnings: [],
	};
}

export function normalizePersistedState(value: unknown): NovenaProgressState {
	if (!isRecord(value)) return { novenas: [], selectedDay: {} };
	const novenasList = Array.isArray(value.novenas)
		? value.novenas.map(normalizeNovena).filter((novena): novena is NovenaInstance => novena !== null)
		: [];
	return {
		novenas: novenasList,
		selectedDay: normalizeSelectedDay(value.selectedDay, novenasList),
	};
}
