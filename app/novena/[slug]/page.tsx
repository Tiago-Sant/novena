'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { parseISO, differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNovenaStore } from '../../../store/useNovenaStore'
import { novenas } from '../../../data'
import NovenaNavigation from '../../../components/NovenaNavigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default function NovenaPage({ params }: PageProps) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const { getNovena, markDay, selectedDay, setSelectedDay } = useNovenaStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Só renderiza o conteúdo real após montagem
  if (!isMounted) return null

  const novenaInstance = getNovena(params.slug)
  if (!novenaInstance) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Novena não encontrada.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voltar à página inicial
        </button>
      </div>
    )
  }

  const data = novenas[novenaInstance.type as keyof typeof novenas]
  if (!data) return <p>Tipo de novena não encontrado. Volte à tela inicial.</p>

  const diff = differenceInDays(new Date(), parseISO(novenaInstance.startDate))
  const currentDayIndex = Math.max(0, Math.min(8, diff))
  const currentDayNumber = currentDayIndex + 1

  // Use selectedDay if set, otherwise use current day
  const currentSelectedDay = selectedDay[params.slug] || null
  const displayDayNumber = currentSelectedDay || currentDayNumber
  const displayDayIndex = displayDayNumber - 1
  const current = data.days[displayDayIndex]

  const handleDaySelect = (day: number) => {
    setSelectedDay(params.slug, day)
  }

  const isCurrentDay = displayDayNumber === currentDayNumber
  const canViewDay = displayDayNumber <= currentDayNumber

  return (
    <section className="mt-6">
      {/* ...existing code... */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{data.name}</h1>
      {/* ...existing code... */}
      <div className="text-gray-600 mb-4 text-sm sm:text-base">
        {/* ...existing code... */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>Início: {format(parseISO(novenaInstance.startDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
          <span className="hidden sm:inline">•</span>
          <span>Dia atual: {currentDayNumber}</span>
          {!isCurrentDay && canViewDay && (
            <>
              <span className="hidden sm:inline">•</span>
              <span className="text-blue-600">Visualizando: Dia {displayDayNumber}</span>
            </>
          )}
        </div>
      </div>
      {/* ...existing code... */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <NovenaNavigation 
          novenaId={params.slug}
          currentDay={currentDayNumber}
          selectedDay={displayDayNumber}
          onDaySelect={handleDaySelect}
        />
      </div>
      {/* ...existing code... */}
      {!canViewDay ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Este dia da novena ainda não está disponível. Aguarde até {novenaInstance.startDate} para começar.
          </p>
        </div>
      ) : (
        <>
          {/* ...existing code... */}
          <div className="prayer-card mb-4 p-4 sm:p-6 bg-white rounded-lg border shadow-sm">
            {/* ...existing code... */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">Dia {current.day} — {current.title}</h2>
              {!isCurrentDay && (
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded self-start sm:self-auto">
                  Visualização
                </span>
              )}
            </div>
            {/* ...existing code... */}
            <div className="space-y-4 sm:space-y-6">
              {/* ...existing code... */}
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">
                  {novenaInstance.type === 'santa-teresinha' ? 'Invocação inicial' : 'Oração inicial'}
                </h3>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{current.prayers[0]}</p>
              </div>
              {/* ...existing code... */}
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">
                  {novenaInstance.type === 'santa-teresinha' ? 'Oração principal' : 'Meditação'}
                </h3>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {novenaInstance.type === 'santa-teresinha' ? current.prayers[1] : current.meditation}
                </p>
              </div>
              {/* ...existing code... */}
              {novenaInstance.type !== 'santa-teresinha' && (
                <div>
                  <h3 className="font-medium text-base sm:text-lg mb-3">Oração final</h3>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{current.prayers[1]}</p>
                </div>
              )}
              {/* ...existing code... */}
              <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">
                  {novenaInstance.type === 'santa-teresinha' ? 'Orações complementares' : 'Práticas'}
                </h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {novenaInstance.type === 'santa-teresinha' 
                    ? current.meditation 
                    : 'Práticas: 5 Pai-Nossos, 5 Ave-Marias e 5 Glórias.'}
                </p>
              </div>
            </div>
          </div>
          {/* ...existing code... */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* ...existing code... */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={() => setSelectedDay(params.slug, Math.max(1, displayDayNumber - 1))}
                  disabled={displayDayNumber <= 1}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm sm:text-base"
                >
                  ← Anterior
                </button>
                
                <button 
                  onClick={() => setSelectedDay(params.slug, Math.min(currentDayNumber, displayDayNumber + 1))}
                  disabled={displayDayNumber >= currentDayNumber}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 text-sm sm:text-base"
                >
                  Próximo →
                </button>
              </div>
              
              {currentSelectedDay && currentSelectedDay !== currentDayNumber && (
                <button 
                  onClick={() => setSelectedDay(params.slug, null)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm sm:text-base"
                >
                  Voltar ao Dia Atual
                </button>
              )}
            </div>
            {/* ...existing code... */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button 
                onClick={() => markDay(params.slug, current.day)} 
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-medium text-sm sm:text-base"
              >
                {novenaInstance.completedDays.includes(current.day) ? 'Desmarcar como rezado' : 'Marcar como rezado'}
              </button>
              <span className="text-sm text-gray-600 text-center sm:text-left">
                Dias marcados: {novenaInstance.completedDays.length}/9
              </span>
            </div>
            {/* ...existing code... */}
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
        </>
      )}
    </section>
  )
}
