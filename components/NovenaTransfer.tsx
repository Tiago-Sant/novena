'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useNovenaStore } from '../store/useNovenaStore';

export function NovenaTransfer() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const exportProgress = useNovenaStore((state) => state.exportProgress);
	const importProgress = useNovenaStore((state) => state.importProgress);
	const [message, setMessage] = useState<string | null>(null);
	const [isImporting, setIsImporting] = useState(false);

	function handleExport() {
		const transferFile = exportProgress();
		const blob = new Blob([JSON.stringify(transferFile, null, 2)], {
			type: 'application/json',
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `novenas-${new Date().toISOString().slice(0, 10)}.json`;
		link.click();
		URL.revokeObjectURL(url);
		setMessage('Arquivo exportado. Transfira-o para o outro dispositivo.');
	}

	async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		event.target.value = '';
		if (!file) return;

		setIsImporting(true);
		setMessage(null);
		try {
			const result = importProgress(await file.text());
			const details = [
				`${result.importedCount} nova(s)`,
				`${result.updatedCount} atualizada(s)`,
			];
			if (result.ignoredCount > 0) {
				details.push(`${result.ignoredCount} ignorada(s)`);
			}
			setMessage(`Importação concluída: ${details.join(', ')}.`);
		} catch (error) {
			setMessage(
				error instanceof Error ? error.message : 'Não foi possível importar o arquivo.',
			);
		} finally {
			setIsImporting(false);
		}
	}

	return (
		<div className="flex flex-col gap-2 sm:items-end">
			<div className="flex w-full gap-2 sm:w-auto">
				<button
				type="button"
				onClick={handleExport}
				className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:flex-none"
				title="Exportar suas novenas"
			>
					<Download className="h-4 w-4" aria-hidden="true" />
					Exportar
				</button>
				<button
					type="button"
				onClick={() => fileInputRef.current?.click()}
				disabled={isImporting}
				className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60 sm:flex-none"
				title="Importar suas novenas"
			>
					<Upload className="h-4 w-4" aria-hidden="true" />
					{isImporting ? 'Importando...' : 'Importar'}
				</button>
			</div>
			<input
				ref={fileInputRef}
				type="file"
				accept="application/json,.json"
				onChange={handleImport}
				className="hidden"
				aria-label="Selecionar arquivo de novenas"
			/>
			{message && (
				<output className="max-w-xs text-right text-xs text-gray-600">
					{message}
				</output>
			)}
		</div>
	);
}
