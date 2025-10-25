import React from 'react'

interface NovenaActionsProps {
  displayDayNumber: number
  currentDayNumber: number
  currentSelectedDay: number | null
  markDay: (slug: string, day: number) => void
  setSelectedDay: (slug: string, day: number | null) => void
  paramsSlug: string
  novenaInstance: any
  router: any
  current: any
}

export default function NovenaActions({
  displayDayNumber,
  currentDayNumber,
  currentSelectedDay,
  markDay,
  setSelectedDay,
  paramsSlug,
  novenaInstance,
  router,
  current,
}: NovenaActionsProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedDay(paramsSlug, Math.max(1, displayDayNumber - 1))}
            disabled={displayDayNumber <= 1}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm sm:text-base"
          >
            ← Anterior
          </button>

          <button
            onClick={() => setSelectedDay(paramsSlug, Math.min(currentDayNumber, displayDayNumber + 1))}
            disabled={displayDayNumber >= currentDayNumber}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm sm:text-base"
          >
            Próximo →
          </button>
        </div>

        {currentSelectedDay && currentSelectedDay !== currentDayNumber && (
          <button
            onClick={() => setSelectedDay(paramsSlug, null)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm sm:text-base"
          >
            Voltar ao Dia Atual
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={() => markDay(paramsSlug, current.day)}
          className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm sm:text-base"
        >
          {novenaInstance.completedDays.includes(current.day) ? 'Desmarcar como rezado' : 'Marcar como rezado'}
        </button>
        <span className="text-sm text-gray-600 text-center sm:text-left">
          Dias marcados: {novenaInstance.completedDays.length}/9
        </span>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto text-gray-500 hover:text-gray-700 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Voltar à página inicial</span>
        </button>
      </div>
    </div>
  )
}
