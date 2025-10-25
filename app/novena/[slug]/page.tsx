'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { parseISO, differenceInDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNovenaStore } from '../../../store/useNovenaStore'
import { novenas } from '../../../data'
import NovenaNavigation from '../../../components/NovenaNavigation'
import NovenaActions from '../../../components/NovenaActions'

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
      <h1 className="text-xl sm:text-2xl font-bold mb-2">{data.name}</h1>
      <div className="text-gray-600 mb-4 text-sm sm:text-base">
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
      <div className="mb-6 bg-gray-50 rounded-lg">
        <NovenaNavigation 
          novenaId={params.slug}
          currentDay={currentDayNumber}
          selectedDay={displayDayNumber}
          onDaySelect={handleDaySelect}
        />
      </div>
      {!canViewDay ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Este dia da novena ainda não está disponível. Aguarde até {novenaInstance.startDate} para começar.
          </p>
        </div>
      ) : (
        <>
          <div className="prayer-card mb-4 p-4 sm:p-6 bg-white rounded-lg border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold">Dia {current.day} — {current.title}</h2>
              {!isCurrentDay && (
                <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded self-start sm:self-auto">
                  Visualização
                </span>
              )}
            </div>
            <div className="space-y-4 sm:space-y-6">
              {!!data.initialPrayer && (
                 <div>
                <h3 className="font-medium text-base sm:text-lg mb-3">
                  Oração inicial
                </h3>
                <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{data.initialPrayer}</p>
              </div>
              )}

              <div>
                {!!current.meditation && (
                  <h3 className="font-medium text-base sm:text-lg mb-3">
                    Meditação
                  </h3>
                )}
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {current.meditation}
                </p>
              </div>

              {data.prayer && (
                <div>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                    {data.prayer}
                  </p>
                </div>
              )}
              {'finallyPrayer' in data && data.finallyPrayer && (
                <div>
                  <h3 className="font-medium text-base sm:text-lg mb-3">Oração final</h3>
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{data.finallyPrayer}</p>
                </div>
              )}
            </div>
          </div>
          <NovenaActions
            displayDayNumber={displayDayNumber}
            currentDayNumber={currentDayNumber}
            currentSelectedDay={currentSelectedDay}
            markDay={markDay}
            setSelectedDay={setSelectedDay}
            paramsSlug={params.slug}
            novenaInstance={novenaInstance}
            router={router}
            current={current}
          />
        </>
      )}
    </section>
  )
}
